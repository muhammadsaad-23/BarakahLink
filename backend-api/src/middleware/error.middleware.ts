import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger';

/** Global error handler — must be registered last in app.ts */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) {
  const message = err instanceof Error ? err.message : 'Internal server error';
  const stack = err instanceof Error ? err.stack : undefined;

  logger.error('Unhandled error', { method: req.method, path: req.path, message, stack });

  res.status(500).json({ success: false, error: 'Internal server error' });
}

/** 404 handler — register after all routes */
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ success: false, error: `Cannot ${req.method} ${req.path}` });
}
