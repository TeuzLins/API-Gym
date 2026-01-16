import { Request, Response } from 'express';
import { z } from 'zod';
import { createExercise, deleteExercise, listExercises, updateExercise } from './service.js';

const createSchema = z.object({
  name: z.string().min(2),
  muscleGroup: z.enum(['CHEST', 'BACK', 'LEGS', 'SHOULDERS', 'ARMS', 'CORE', 'FULL_BODY']),
  equipment: z.enum(['BODYWEIGHT', 'DUMBBELL', 'BARBELL', 'MACHINE', 'KETTLEBELL', 'BAND', 'OTHER']),
});

const updateSchema = createSchema.partial();

export async function getExercises(_req: Request, res: Response) {
  const exercises = await listExercises();
  res.json(exercises);
}

export async function postExercise(req: Request, res: Response) {
  const data = createSchema.parse(req.body);
  const exercise = await createExercise(data);
  res.status(201).json(exercise);
}

export async function patchExercise(req: Request, res: Response) {
  const { id } = req.params;
  const data = updateSchema.parse(req.body);
  const exercise = await updateExercise(id, data);
  res.json(exercise);
}

export async function removeExercise(req: Request, res: Response) {
  const { id } = req.params;
  await deleteExercise(id);
  res.status(204).send();
}
