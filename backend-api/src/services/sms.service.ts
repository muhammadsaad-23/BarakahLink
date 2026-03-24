import { env } from '../config/env';
import { logger } from '../lib/logger';

// ── Abstraction ───────────────────────────────────────────────────────────────

interface SmsProvider {
  send(to: string, body: string): Promise<void>;
}

// ── Console / mock provider (always available) ────────────────────────────────

class ConsoleSmsProvider implements SmsProvider {
  async send(to: string, body: string) {
    logger.info('SMS (mock) sent', { to, body });
  }
}

// ── Twilio provider ───────────────────────────────────────────────────────────

class TwilioSmsProvider implements SmsProvider {
  private readonly sid: string;
  private readonly token: string;
  private readonly from: string;

  constructor(sid: string, token: string, from: string) {
    this.sid = sid;
    this.token = token;
    this.from = from;
  }

  async send(to: string, body: string) {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${this.sid}/Messages.json`;
    const params = new URLSearchParams({ From: this.from, To: to, Body: body });

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${this.sid}:${this.token}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Twilio error ${res.status}: ${text}`);
    }

    logger.info('SMS sent via Twilio', { to });
  }
}

// ── Factory ───────────────────────────────────────────────────────────────────

function createSmsProvider(): SmsProvider {
  if (
    env.ENABLE_SMS &&
    env.TWILIO_ACCOUNT_SID &&
    env.TWILIO_AUTH_TOKEN &&
    env.TWILIO_PHONE_NUMBER
  ) {
    logger.info('SMS provider: Twilio');
    return new TwilioSmsProvider(
      env.TWILIO_ACCOUNT_SID,
      env.TWILIO_AUTH_TOKEN,
      env.TWILIO_PHONE_NUMBER,
    );
  }
  logger.info('SMS provider: console (mock)');
  return new ConsoleSmsProvider();
}

export const smsProvider = createSmsProvider();

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Format a short SMS response from active food drops */
export function formatDropsForSms(
  drops: Array<{ title: string; city: string; pickupAddress: string; quantity: string }>,
): string {
  if (drops.length === 0) {
    return 'BarakahLink: No active food pickups right now. Check again soon. barakahlink.app';
  }

  const lines = drops.slice(0, 3).map(
    (d, i) => `${i + 1}. ${d.title} — ${d.city} (${d.pickupAddress}) · ${d.quantity}`,
  );

  return ['BarakahLink — Active pickups near you:', ...lines, 'More: barakahlink.app'].join('\n');
}
