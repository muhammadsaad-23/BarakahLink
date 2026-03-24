import { Request, Response } from 'express';
import { z } from 'zod';
import { Role } from '@prisma/client';
import * as dropsService from '../services/drops.service';
import { ok, fail } from '../lib/response';

// req.params values are always strings at runtime; this helper satisfies strict TS
function dropId(req: Request): string {
  return req.params.id as string;
}

const createDropSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().min(10).max(1000),
  donorPhone: z.string().min(7).max(30),
  pickupAddress: z.string().min(5).max(200),
  city: z.string().min(1).max(80),
  quantity: z.string().min(1).max(100),
  pickupStartTime: z.string().datetime({ message: 'pickupStartTime must be an ISO date string' }),
  availableUntil: z.string().datetime({ message: 'availableUntil must be an ISO date string' }),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

const updateDropSchema = createDropSchema.partial();

const reserveSchema = z.object({
  name: z.string().min(1).max(80),
  phone: z.string().min(7).max(30),
});

const querySchema = z.object({
  city: z.string().optional(),
  tag: z.string().optional(),
  status: z.enum(['available', 'claimed', 'expired']).optional(),
  search: z.string().optional(),
});

export async function list(req: Request, res: Response) {
  const parsed = querySchema.safeParse(req.query);
  const opts = parsed.success ? parsed.data : {};
  const dropsList = await dropsService.getDrops(opts);
  ok(res, dropsList);
}

export async function getOne(req: Request, res: Response) {
  const drop = await dropsService.getDropById(dropId(req));
  if (!drop) {
    fail(res, 'Drop not found', 404);
    return;
  }
  ok(res, drop);
}

export async function create(req: Request, res: Response) {
  const parsed = createDropSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({
      success: false,
      error: 'Validation failed',
      details: parsed.error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
    });
    return;
  }

  try {
    const drop = await dropsService.createDrop(
      parsed.data,
      req.user!.userId,
      req.user!.name,
    );
    ok(res, drop, 201);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create drop';
    fail(res, message, 400);
  }
}

export async function update(req: Request, res: Response) {
  const parsed = updateDropSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ success: false, error: 'Validation failed' });
    return;
  }

  try {
    const isAdmin = req.user!.role === Role.ADMIN;
    const drop = await dropsService.updateDrop(dropId(req), parsed.data, req.user!.userId, isAdmin);
    ok(res, drop);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Update failed';
    const status = message === 'Forbidden.' ? 403 : message === 'Drop not found.' ? 404 : 400;
    fail(res, message, status);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const isAdmin = req.user!.role === Role.ADMIN;
    await dropsService.deleteDrop(dropId(req), req.user!.userId, isAdmin);
    ok(res, { deleted: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Delete failed';
    const status = message === 'Forbidden.' ? 403 : message === 'Drop not found.' ? 404 : 400;
    fail(res, message, status);
  }
}

export async function reserve(req: Request, res: Response) {
  const parsed = reserveSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ success: false, error: 'name and phone are required' });
    return;
  }

  try {
    const drop = await dropsService.reserveDrop(
      dropId(req),
      parsed.data.name,
      parsed.data.phone,
      req.user?.userId,
    );
    ok(res, drop);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Reservation failed';
    fail(res, message, 409);
  }
}

export async function release(req: Request, res: Response) {
  try {
    const isAdmin = req.user!.role === Role.ADMIN;
    const drop = await dropsService.releaseDrop(dropId(req), req.user!.userId, isAdmin);
    ok(res, drop);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Release failed';
    const status = message === 'Forbidden.' ? 403 : message === 'Drop not found.' ? 404 : 400;
    fail(res, message, status);
  }
}
