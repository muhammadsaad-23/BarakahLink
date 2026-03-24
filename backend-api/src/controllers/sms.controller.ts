import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { DropStatus } from '@prisma/client';
import { formatDropsForSms } from '../services/sms.service';
import { logger } from '../lib/logger';

/**
 * POST /api/sms/webhook
 * Twilio sends form-encoded POST with From and Body fields.
 * Returns TwiML XML response.
 */
export async function twilioWebhook(req: Request, res: Response) {
  const from: string = req.body?.From ?? 'unknown';
  const body: string = (req.body?.Body ?? '').trim().toLowerCase();

  logger.info('SMS webhook received', { from, body });

  let reply: string;

  // Keyword matching: FOOD, HELP, or a city name → return active drops
  const isFoodRequest =
    body === 'food' ||
    body === 'help' ||
    body.startsWith('food ') ||
    // Canadian city names
    ['kitchener', 'waterloo', 'cambridge', 'guelph', 'toronto', 'hamilton', 'london'].some((c) =>
      body.includes(c),
    );

  if (isFoodRequest) {
    // Extract city if mentioned
    const cityMap: Record<string, string> = {
      kitchener: 'Kitchener',
      waterloo: 'Waterloo',
      cambridge: 'Cambridge',
      guelph: 'Guelph',
      toronto: 'Toronto',
      hamilton: 'Hamilton',
      london: 'London',
    };
    const mentionedCity = Object.entries(cityMap).find(([k]) => body.includes(k))?.[1];

    const drops = await prisma.foodDrop.findMany({
      where: {
        status: DropStatus.AVAILABLE,
        availableUntil: { gt: new Date() },
        ...(mentionedCity ? { city: mentionedCity } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    reply = formatDropsForSms(drops);
  } else {
    reply =
      'BarakahLink: Text FOOD or your city (Kitchener, Waterloo, etc.) to see available pickups. barakahlink.app';
  }

  // Log to database
  await prisma.smsLog.create({ data: { fromPhone: from, body: req.body?.Body ?? '', reply } });

  // Respond with TwiML
  res.set('Content-Type', 'text/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${escapeXml(reply)}</Message>
</Response>`);
}

function escapeXml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
