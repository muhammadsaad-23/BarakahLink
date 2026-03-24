import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { fail } from '../lib/response';
import { Role } from '@prisma/client';

export interface AuthPayload {
  userId: string;
  email: string;
  name: string;
  role: Role;
}

// Extend Express Request to carry the decoded token payload
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

/** Validates Bearer token and attaches req.user. Aborts with 401 on failure. */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    fail(res, 'Authorization header missing or malformed', 401);
    return;
  }

  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    req.user = payload;
    next();
  } catch {
    fail(res, 'Invalid or expired token', 401);
  }
}

/** Same as requireAuth but only blocks if a token is provided AND invalid.
 *  Useful for routes that have optional authentication. */
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    const token = header.split(' ')[1];
    try {
      req.user = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    } catch {
      // Invalid token — just ignore it for optional auth
    }
  }
  next();
}

/** Middleware factory — requires the user to have one of the allowed roles. */
export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      fail(res, 'Unauthorized', 401);
      return;
    }
    if (!roles.includes(req.user.role)) {
      fail(res, 'Forbidden: insufficient role', 403);
      return;
    }
    next();
  };
}
