import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.js';
import { roleMiddleware } from '../../middlewares/role.js';
import {
  getPlans,
  getPlanById,
  postPlan,
  patchPlan,
  removePlan,
  postDay,
  patchDay,
  removeDay,
  postItem,
  patchItem,
  removeItem,
} from './controller.js';

export const plansRoutes = Router();

plansRoutes.use(authMiddleware);

plansRoutes.get('/', getPlans);
plansRoutes.get('/:id', getPlanById);

plansRoutes.post('/', roleMiddleware(['ADMIN', 'TRAINER']), postPlan);
plansRoutes.patch('/:id', roleMiddleware(['ADMIN', 'TRAINER']), patchPlan);
plansRoutes.delete('/:id', roleMiddleware(['ADMIN', 'TRAINER']), removePlan);

plansRoutes.post('/:planId/days', roleMiddleware(['ADMIN', 'TRAINER']), postDay);
plansRoutes.patch('/days/:dayId', roleMiddleware(['ADMIN', 'TRAINER']), patchDay);
plansRoutes.delete('/days/:dayId', roleMiddleware(['ADMIN', 'TRAINER']), removeDay);

plansRoutes.post('/days/:dayId/items', roleMiddleware(['ADMIN', 'TRAINER']), postItem);
plansRoutes.patch('/items/:itemId', roleMiddleware(['ADMIN', 'TRAINER']), patchItem);
plansRoutes.delete('/items/:itemId', roleMiddleware(['ADMIN', 'TRAINER']), removeItem);
