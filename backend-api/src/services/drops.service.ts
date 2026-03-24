import { DropStatus, FoodDrop, Reservation } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { analyseFoodDescription } from './gemini.service';
import { logger } from '../lib/logger';

// ── Serialisation ─────────────────────────────────────────────────────────────

type DropWithReservation = FoodDrop & { reservation: Reservation | null };

/** Convert Prisma model to the shape the frontend expects */
function serialiseDrop(drop: DropWithReservation) {
  return {
    id: drop.id,
    donorId: drop.donorId,
    donorName: drop.donorName,
    donorPhone: drop.donorPhone,
    title: drop.title,
    description: drop.description,
    quantity: drop.quantity,
    pickupAddress: drop.pickupAddress,
    city: drop.city,
    lat: drop.lat,
    lng: drop.lng,
    pickupStartTime: drop.pickupStartTime.toISOString(),
    availableUntil: drop.availableUntil.toISOString(),
    tags: drop.tags,
    status: drop.status.toLowerCase() as 'available' | 'claimed' | 'expired',
    aiSummary: drop.aiSummary ?? undefined,
    createdAt: drop.createdAt.toISOString(),
    reservedBy: drop.reservation
      ? { name: drop.reservation.name, phone: drop.reservation.phone }
      : undefined,
  };
}

/** Mark drops whose availableUntil is in the past as EXPIRED (in the DB) */
async function markExpired() {
  const updated = await prisma.foodDrop.updateMany({
    where: {
      status: DropStatus.AVAILABLE,
      availableUntil: { lt: new Date() },
    },
    data: { status: DropStatus.EXPIRED },
  });
  if (updated.count > 0) {
    logger.info('Marked expired drops', { count: updated.count });
  }
}

// ── Query ─────────────────────────────────────────────────────────────────────

export interface GetDropsOptions {
  city?: string;
  tag?: string;
  status?: string;
  search?: string;
}

export async function getDrops(opts: GetDropsOptions = {}) {
  // Lazily expire listings on every read — acceptable for this scale
  await markExpired();

  const statusFilter: DropStatus | undefined = opts.status
    ? (opts.status.toUpperCase() as DropStatus)
    : undefined;

  const drops = await prisma.foodDrop.findMany({
    where: {
      ...(opts.city && opts.city !== 'All' ? { city: opts.city } : {}),
      ...(opts.tag && opts.tag !== 'All' ? { tags: { has: opts.tag } } : {}),
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(opts.search
        ? {
            OR: [
              { title: { contains: opts.search, mode: 'insensitive' } },
              { description: { contains: opts.search, mode: 'insensitive' } },
              { city: { contains: opts.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    include: { reservation: true },
    orderBy: { createdAt: 'desc' },
  });

  return drops.map(serialiseDrop);
}

export async function getDropById(id: string) {
  const drop = await prisma.foodDrop.findUnique({
    where: { id },
    include: { reservation: true },
  });
  if (!drop) return null;
  return serialiseDrop(drop);
}

// ── Create ────────────────────────────────────────────────────────────────────

export interface CreateDropInput {
  title: string;
  description: string;
  donorPhone: string;
  pickupAddress: string;
  city: string;
  quantity: string;
  pickupStartTime: string;
  availableUntil: string;
  lat: number;
  lng: number;
}

export async function createDrop(input: CreateDropInput, donorId: string, donorName: string) {
  // AI analysis runs on the server only
  const analysis = await analyseFoodDescription(input.description);

  if (!analysis.isAppropriate) {
    throw new Error('Content flagged as inappropriate for the platform.');
  }

  const drop = await prisma.foodDrop.create({
    data: {
      donorId,
      donorName,
      donorPhone: input.donorPhone,
      title: input.title,
      description: input.description,
      quantity: input.quantity,
      pickupAddress: input.pickupAddress,
      city: input.city,
      lat: input.lat,
      lng: input.lng,
      pickupStartTime: new Date(input.pickupStartTime),
      availableUntil: new Date(input.availableUntil),
      tags: analysis.tags,
      aiSummary: analysis.summary,
      status: DropStatus.AVAILABLE,
    },
    include: { reservation: true },
  });

  return serialiseDrop(drop);
}

// ── Update ────────────────────────────────────────────────────────────────────

export interface UpdateDropInput {
  title?: string;
  description?: string;
  donorPhone?: string;
  pickupAddress?: string;
  city?: string;
  quantity?: string;
  pickupStartTime?: string;
  availableUntil?: string;
}

export async function updateDrop(id: string, input: UpdateDropInput, requestingUserId: string, isAdmin: boolean) {
  const existing = await prisma.foodDrop.findUnique({ where: { id } });
  if (!existing) throw new Error('Drop not found.');
  if (!isAdmin && existing.donorId !== requestingUserId) throw new Error('Forbidden.');

  const drop = await prisma.foodDrop.update({
    where: { id },
    data: {
      ...input,
      ...(input.pickupStartTime ? { pickupStartTime: new Date(input.pickupStartTime) } : {}),
      ...(input.availableUntil ? { availableUntil: new Date(input.availableUntil) } : {}),
    },
    include: { reservation: true },
  });

  return serialiseDrop(drop);
}

// ── Delete ────────────────────────────────────────────────────────────────────

export async function deleteDrop(id: string, requestingUserId: string, isAdmin: boolean) {
  const existing = await prisma.foodDrop.findUnique({ where: { id } });
  if (!existing) throw new Error('Drop not found.');
  if (!isAdmin && existing.donorId !== requestingUserId) throw new Error('Forbidden.');

  await prisma.foodDrop.delete({ where: { id } });
}

// ── Reserve ───────────────────────────────────────────────────────────────────

export async function reserveDrop(
  dropId: string,
  name: string,
  phone: string,
  userId?: string,
) {
  const drop = await prisma.foodDrop.findUnique({ where: { id: dropId } });
  if (!drop) throw new Error('Drop not found.');
  if (drop.status === DropStatus.CLAIMED) throw new Error('This drop has already been claimed.');
  if (drop.status === DropStatus.EXPIRED) throw new Error('This drop has expired.');

  const [updated] = await prisma.$transaction([
    prisma.foodDrop.update({
      where: { id: dropId },
      data: { status: DropStatus.CLAIMED },
      include: { reservation: true },
    }),
    prisma.reservation.create({
      data: { dropId, name, phone, userId },
    }),
  ]);

  // Re-fetch to include the new reservation
  const fresh = await prisma.foodDrop.findUniqueOrThrow({
    where: { id: dropId },
    include: { reservation: true },
  });

  return serialiseDrop(fresh);
}

// ── Release ───────────────────────────────────────────────────────────────────

export async function releaseDrop(id: string, requestingUserId: string, isAdmin: boolean) {
  const existing = await prisma.foodDrop.findUnique({ where: { id } });
  if (!existing) throw new Error('Drop not found.');
  if (!isAdmin && existing.donorId !== requestingUserId) throw new Error('Forbidden.');
  if (existing.status !== DropStatus.CLAIMED) throw new Error('Drop is not currently claimed.');

  // Delete reservation and set drop back to available in one transaction
  await prisma.$transaction([
    prisma.reservation.deleteMany({ where: { dropId: id } }),
    prisma.foodDrop.update({
      where: { id },
      data: { status: DropStatus.AVAILABLE },
    }),
  ]);

  const fresh = await prisma.foodDrop.findUniqueOrThrow({
    where: { id },
    include: { reservation: true },
  });

  return serialiseDrop(fresh);
}

/** Utility for scheduled cleanup jobs / cron. Marks all past-due drops as EXPIRED. */
export async function expireStaleDrops() {
  const result = await prisma.foodDrop.updateMany({
    where: { status: DropStatus.AVAILABLE, availableUntil: { lt: new Date() } },
    data: { status: DropStatus.EXPIRED },
  });
  logger.info('Expiry sweep complete', { expired: result.count });
  return result.count;
}
