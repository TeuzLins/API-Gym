import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.js';
import { roleMiddleware } from '../../middlewares/role.js';
import { getUsers, patchUser } from './controller.js';

export const usersRoutes = Router();

usersRoutes.use(authMiddleware, roleMiddleware(['ADMIN']));

usersRoutes.get('/', getUsers);
usersRoutes.patch('/:id', patchUser);
