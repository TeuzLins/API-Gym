import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../../middlewares/auth.js';
import {
  listPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
  createWorkoutDay,
  updateWorkoutDay,
  deleteWorkoutDay,
  createWorkoutItem,
  updateWorkoutItem,
  deleteWorkoutItem,
} from './service.js';

const planSchema = z.object({
  studentId: z.string().uuid(),
  trainerId: z.string().uuid().optional(),
  title: z.string().min(2),
  goal: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
});

const planUpdateSchema = z.object({
  title: z.string().min(2).optional(),
  goal: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

const daySchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  title: z.string().min(2),
});

const dayUpdateSchema = daySchema.partial();

const itemSchema = z.object({
  exerciseId: z.string().uuid(),
  sets: z.number().min(1),
  reps: z.number().min(1),
  restSeconds: z.number().min(0),
  notes: z.string().optional(),
});

const itemUpdateSchema = itemSchema.partial();

export async function getPlans(req: AuthRequest, res: Response) {
  const studentId = req.user?.role === 'STUDENT' ? req.user.id : undefined;
  const plans = await listPlans({ studentId });
  res.json(plans);
}

export async function getPlanById(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const plan = await getPlan(id);
  if (req.user?.role === 'STUDENT' && plan.studentId !== req.user.id) {
    return res.status(403).json({ message: 'Sem permissão para acessar este plano', code: 'FORBIDDEN' });
  }
  res.json(plan);
}

export async function postPlan(req: AuthRequest, res: Response) {
  const data = planSchema.parse(req.body);
  const trainerId = data.trainerId ?? req.user?.id;
  if (!trainerId) {
    return res.status(400).json({ message: 'TrainerId obrigatório', code: 'TRAINER_REQUIRED' });
  }
  const plan = await createPlan({
    studentId: data.studentId,
    trainerId,
    title: data.title,
    goal: data.goal,
    startDate: new Date(data.startDate),
    endDate: data.endDate ? new Date(data.endDate) : undefined,
  });
  res.status(201).json(plan);
}

export async function patchPlan(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const data = planUpdateSchema.parse(req.body);
  const plan = await updatePlan(id, {
    title: data.title,
    goal: data.goal,
    startDate: data.startDate ? new Date(data.startDate) : undefined,
    endDate: data.endDate ? new Date(data.endDate) : undefined,
  });
  res.json(plan);
}

export async function removePlan(req: AuthRequest, res: Response) {
  const { id } = req.params;
  await deletePlan(id);
  res.status(204).send();
}

export async function postDay(req: AuthRequest, res: Response) {
  const { planId } = req.params;
  const data = daySchema.parse(req.body);
  const day = await createWorkoutDay({ planId, dayOfWeek: data.dayOfWeek, title: data.title });
  res.status(201).json(day);
}

export async function patchDay(req: AuthRequest, res: Response) {
  const { dayId } = req.params;
  const data = dayUpdateSchema.parse(req.body);
  const day = await updateWorkoutDay(dayId, data);
  res.json(day);
}

export async function removeDay(req: AuthRequest, res: Response) {
  const { dayId } = req.params;
  await deleteWorkoutDay(dayId);
  res.status(204).send();
}

export async function postItem(req: AuthRequest, res: Response) {
  const { dayId } = req.params;
  const data = itemSchema.parse(req.body);
  const item = await createWorkoutItem({
    dayId,
    exerciseId: data.exerciseId,
    sets: data.sets,
    reps: data.reps,
    restSeconds: data.restSeconds,
    notes: data.notes,
  });
  res.status(201).json(item);
}

export async function patchItem(req: AuthRequest, res: Response) {
  const { itemId } = req.params;
  const data = itemUpdateSchema.parse(req.body);
  const item = await updateWorkoutItem(itemId, data);
  res.json(item);
}

export async function removeItem(req: AuthRequest, res: Response) {
  const { itemId } = req.params;
  await deleteWorkoutItem(itemId);
  res.status(204).send();
}
