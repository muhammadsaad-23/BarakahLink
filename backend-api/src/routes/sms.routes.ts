import { Router } from 'express';
import * as smsController from '../controllers/sms.controller';
import { env } from '../config/env';

const router = Router();

// POST /api/sms/webhook  — Twilio sends form-encoded data
// Disabled gracefully if ENABLE_SMS is false
router.post('/webhook', (req, res, next) => {
  if (!env.ENABLE_SMS) {
    res.status(404).json({ success: false, error: 'SMS integration is not enabled.' });
    return;
  }
  next();
}, smsController.twilioWebhook);

export default router;
