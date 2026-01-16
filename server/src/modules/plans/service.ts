import { prisma } from '../../config/prisma.js';
import { AppError } from '../../middlewares/error.js';

export async function listPlans(filter: { studentId?: string }) {
  return prisma.workoutPlan.findMany({
    where: filter.studentId ? { studentId: filter.studentId } : {},
    include: { days: { include: { items: { include: { exercise: true } } } }, student: true, trainer: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getPlan(id: string) {
  const plan = await prisma.workoutPlan.findUnique({
    where: { id },
    include: { days: { include: { items: { include: { exercise: true } } } }, student: true, trainer: true },
  });
  if (!plan) {
    throw new AppError('Plano não encontrado', 404, 'PLAN_NOT_FOUND');
  }
  return plan;
}

export async function createPlan(data: {
  studentId: string;
  trainerId: string;
  title: string;
  goal?: string;
  startDate: Date;
  endDate?: Date;
}) {
  const student = await prisma.user.findUnique({ where: { id: data.studentId } });
  if (!student || student.role !== 'STUDENT') {
    throw new AppError('Aluno inválido para o plano', 400, 'INVALID_STUDENT');
  }

  const trainer = await prisma.user.findUnique({ where: { id: data.trainerId } });
  if (!trainer || (trainer.role !== 'TRAINER' && trainer.role !== 'ADMIN')) {
    throw new AppError('Treinador inválido para o plano', 400, 'INVALID_TRAINER');
  }

  return prisma.workoutPlan.create({ data });
}

export async function updatePlan(id: string, data: { title?: string; goal?: string; startDate?: Date; endDate?: Date }) {
  const plan = await prisma.workoutPlan.findUnique({ where: { id } });
  if (!plan) {
    throw new AppError('Plano não encontrado', 404, 'PLAN_NOT_FOUND');
  }
  return prisma.workoutPlan.update({ where: { id }, data });
}

export async function deletePlan(id: string) {
  const plan = await prisma.workoutPlan.findUnique({ where: { id } });
  if (!plan) {
    throw new AppError('Plano não encontrado', 404, 'PLAN_NOT_FOUND');
  }
  await prisma.workoutPlan.delete({ where: { id } });
}

export async function createWorkoutDay(data: { planId: string; dayOfWeek: number; title: string }) {
  const plan = await prisma.workoutPlan.findUnique({ where: { id: data.planId } });
  if (!plan) {
    throw new AppError('Plano não encontrado', 404, 'PLAN_NOT_FOUND');
  }
  return prisma.workoutDay.create({ data });
}

export async function updateWorkoutDay(id: string, data: { dayOfWeek?: number; title?: string }) {
  const day = await prisma.workoutDay.findUnique({ where: { id } });
  if (!day) {
    throw new AppError('Dia do treino não encontrado', 404, 'DAY_NOT_FOUND');
  }
  return prisma.workoutDay.update({ where: { id }, data });
}

export async function deleteWorkoutDay(id: string) {
  const day = await prisma.workoutDay.findUnique({ where: { id } });
  if (!day) {
    throw new AppError('Dia do treino não encontrado', 404, 'DAY_NOT_FOUND');
  }
  await prisma.workoutDay.delete({ where: { id } });
}

export async function createWorkoutItem(data: {
  dayId: string;
  exerciseId: string;
  sets: number;
  reps: number;
  restSeconds: number;
  notes?: string;
}) {
  const day = await prisma.workoutDay.findUnique({ where: { id: data.dayId } });
  if (!day) {
    throw new AppError('Dia do treino não encontrado', 404, 'DAY_NOT_FOUND');
  }
  return prisma.workoutItem.create({ data });
}

export async function updateWorkoutItem(id: string, data: { sets?: number; reps?: number; restSeconds?: number; notes?: string }) {
  const item = await prisma.workoutItem.findUnique({ where: { id } });
  if (!item) {
    throw new AppError('Item não encontrado', 404, 'ITEM_NOT_FOUND');
  }
  return prisma.workoutItem.update({ where: { id }, data });
}

export async function deleteWorkoutItem(id: string) {
  const item = await prisma.workoutItem.findUnique({ where: { id } });
  if (!item) {
    throw new AppError('Item não encontrado', 404, 'ITEM_NOT_FOUND');
  }
  await prisma.workoutItem.delete({ where: { id } });
}
