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

export async function postProgress(req: AuthRequest, res: Response) {
  const data = createSchema.parse(req.body);
  const studentId = req.user?.role === 'STUDENT' ? req.user.id : data.studentId;
  if (!studentId) {
    return res.status(400).json({ message: 'studentId é obrigatório', code: 'STUDENT_REQUIRED' });
  }
  const log = await createProgress({
    studentId,
    date: new Date(data.date),
    weightKg: data.weightKg,
    bodyFatPercent: data.bodyFatPercent,
    notes: data.notes,
  });
  res.status(201).json(log);
}

export async function removeProgress(req: AuthRequest, res: Response) {
  const { id } = req.params;
  await deleteProgress(id);
  res.status(204).send();
}
