import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import dropsRoutes from './routes/drops.routes';
import smsRoutes from './routes/sms.routes';
import { logger } from './lib/logger';

export function createApp() {
  const app = express();

  // ── Security headers ───────────────────────────────────────────────────────
  app.use(helmet());

  // ── CORS ───────────────────────────────────────────────────────────────────
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (curl, Postman, mobile apps)
        if (!origin) return callback(null, true);

        const allowed = [
          env.FRONTEND_URL,
          'http://localhost:3000',
          'http://localhost:5173',
        ];

        if (allowed.includes(origin)) {
          callback(null, true);
        } else {
          logger.warn('CORS rejected origin', { origin });
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    }),
  );

  // ── Body parsers ───────────────────────────────────────────────────────────
  app.use(express.json({ limit: '1mb' }));
  // SMS webhooks from Twilio are form-encoded
  app.use(express.urlencoded({ extended: false, limit: '1mb' }));

  // ── Rate limiting ──────────────────────────────────────────────────────────
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: 'Too many requests, please try again later.' },
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20, // tighter limit on auth endpoints
    message: { success: false, error: 'Too many auth attempts, please wait.' },
  });

  app.use(globalLimiter);

  // ── Health check ───────────────────────────────────────────────────────────
  app.get('/health', (_req, res) => {
    res.json({ success: true, data: { status: 'ok', env: env.NODE_ENV } });
  });

  // ── Routes ─────────────────────────────────────────────────────────────────
  app.use('/api/auth', authLimiter, authRoutes);
  app.use('/api/drops', dropsRoutes);
  app.use('/api/sms', smsRoutes);

  // ── Error handling (must be last) ──────────────────────────────────────────
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
