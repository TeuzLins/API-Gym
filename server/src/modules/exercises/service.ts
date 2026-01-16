import { prisma } from '../../config/prisma.js';
import { AppError } from '../../middlewares/error.js';

export async function listExercises() {
  return prisma.exercise.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function createExercise(data: { name: string; muscleGroup: string; equipment: string }) {
  return prisma.exercise.create({ data });
}

export async function updateExercise(id: string, data: { name?: string; muscleGroup?: string; equipment?: string }) {
  const existing = await prisma.exercise.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError('Exercício não encontrado', 404, 'EXERCISE_NOT_FOUND');
  }
  return prisma.exercise.update({ where: { id }, data });
}

export async function deleteExercise(id: string) {
  const existing = await prisma.exercise.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError('Exercício não encontrado', 404, 'EXERCISE_NOT_FOUND');
  }
  await prisma.exercise.delete({ where: { id } });
}
