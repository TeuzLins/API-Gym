import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../../middlewares/auth.js';
import { listProgress, createProgress, deleteProgress } from './service.js';

const createSchema = z.object({
  studentId: z.string().uuid().optional(),
  date: z.string(),
  weightKg: z.number().min(0),
  bodyFatPercent: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
});

export async function getProgress(req: AuthRequest, res: Response) {
  const studentId = req.user?.role === 'STUDENT' ? req.user.id : (req.query.studentId as string | undefined);
  const progress = await listProgress({ studentId });
  res.json(progress);
}
