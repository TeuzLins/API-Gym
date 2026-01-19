import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.js';
import { roleMiddleware } from '../../middlewares/role.js';
import { getStudents, getStudentById, postStudent, patchStudent, removeStudent } from './controller.js';

export const studentsRoutes = Router();

studentsRoutes.use(authMiddleware, roleMiddleware(['ADMIN', 'TRAINER']));

studentsRoutes.get('/', getStudents);
studentsRoutes.get('/:id', getStudentById);
studentsRoutes.post('/', postStudent);
studentsRoutes.patch('/:id', patchStudent);
studentsRoutes.delete('/:id', removeStudent);
