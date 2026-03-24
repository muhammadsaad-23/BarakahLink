import { Request, Response } from 'express';
import { z } from 'zod';
import { Role } from '@prisma/client';
import * as authService from '../services/auth.service';
import { ok, fail } from '../lib/response';
import { logger } from '../lib/logger';

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required').max(80),
  role: z.enum(['DONOR', 'RECIPIENT']).default('RECIPIENT'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function signup(req: Request, res: Response) {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    fail(res, parsed.error.errors[0].message, 422);
    return;
  }

  const { email, password, name, role } = parsed.data;
  try {
    const result = await authService.signup(email, password, name, role as Role);
    logger.info('User signed up', { email, role });
    ok(res, result, 201);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Signup failed';
    fail(res, message, 409);
  }
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    fail(res, 'Invalid email or password', 422);
    return;
  }

  const { email, password } = parsed.data;
  try {
    const result = await authService.login(email, password);
    logger.info('User logged in', { email });
    ok(res, result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Login failed';
    fail(res, message, 401);
  }
}

export async function me(req: Request, res: Response) {
  try {
    const user = await authService.getMe(req.user!.userId);
    ok(res, user);
  } catch (err) {
    fail(res, 'User not found', 404);
  }
}
