import { Request, Response } from 'express';
import { z } from 'zod';
import { listUsers, updateUserRole } from './service.js';

const roleSchema = z.object({
  role: z.enum(['ADMIN', 'TRAINER', 'STUDENT']),
});

export async function getUsers(_req: Request, res: Response) {
  const users = await listUsers();
  res.json(users);
}

export async function patchUser(req: Request, res: Response) {
  const { id } = req.params;
  const data = roleSchema.parse(req.body);
  const user = await updateUserRole(id, data.role);
  res.json(user);
}
