import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { fail } from '../lib/response';

/** Validates req.body against a Zod schema. Replies 422 with field errors on failure. */
export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const formatted = formatZodError(result.error);
      res.status(422).json({ success: false, error: 'Validation failed', details: formatted });
      return;
    }
    req.body = result.data;
    next();
  };
}

/** Validates req.query against a Zod schema. Replies 422 on failure. */
export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const formatted = formatZodError(result.error);
      res.status(422).json({ success: false, error: 'Invalid query parameters', details: formatted });
      return;
    }
    (req as Request & { validatedQuery: T }).validatedQuery = result.data;
    next();
  };
}

function formatZodError(error: ZodError) {
  return error.errors.map((e) => ({
    field: e.path.join('.'),
    message: e.message,
  }));
}
