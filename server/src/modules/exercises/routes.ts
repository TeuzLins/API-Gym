import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.js';
import { roleMiddleware } from '../../middlewares/role.js';
import { getExercises, postExercise, patchExercise, removeExercise } from './controller.js';

export const exercisesRoutes = Router();

exercisesRoutes.use(authMiddleware, roleMiddleware(['ADMIN', 'TRAINER']));

exercisesRoutes.get('/', getExercises);
exercisesRoutes.post('/', postExercise);
exercisesRoutes.patch('/:id', patchExercise);
exercisesRoutes.delete('/:id', removeExercise);
