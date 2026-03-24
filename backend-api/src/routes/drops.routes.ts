import { Router } from 'express';
import * as dropsController from '../controllers/drops.controller';
import { requireAuth, optionalAuth, requireRole } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// GET /api/drops  — public
router.get('/', dropsController.list);

// GET /api/drops/:id  — public
router.get('/:id', dropsController.getOne);

// POST /api/drops  — donor only
router.post('/', requireAuth, requireRole(Role.DONOR), dropsController.create);

// PATCH /api/drops/:id  — donor owner or admin
router.patch('/:id', requireAuth, dropsController.update);

// DELETE /api/drops/:id  — donor owner or admin
router.delete('/:id', requireAuth, dropsController.remove);

// POST /api/drops/:id/reserve  — any authenticated user (or provide optionalAuth for guest flow)
router.post('/:id/reserve', optionalAuth, dropsController.reserve);

// POST /api/drops/:id/release  — donor owner or admin
router.post('/:id/release', requireAuth, dropsController.release);

export default router;
