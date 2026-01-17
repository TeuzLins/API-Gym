import { prisma } from '../../config/prisma.js';
import { AppError } from '../../middlewares/error.js';

export async function listProgress(filter: { studentId?: string }) {
  return prisma.progressLog.findMany({
    where: filter.studentId ? { studentId: filter.studentId } : {},
    orderBy: { date: 'desc' },
  });
}

export async function createProgress(data: {
  studentId: string;
  date: Date;
  weightKg: number;
  bodyFatPercent?: number;
  notes?: string;
}) {
  const student = await prisma.user.findUnique({ where: { id: data.studentId } });
  if (!student || student.role !== 'STUDENT') {
    throw new AppError('Aluno inválido', 400, 'INVALID_STUDENT');
  }
  return prisma.progressLog.create({ data });
}

export async function deleteProgress(id: string) {
  const log = await prisma.progressLog.findUnique({ where: { id } });
  if (!log) {
    throw new AppError('Registro não encontrado', 404, 'PROGRESS_NOT_FOUND');
  }
  await prisma.progressLog.delete({ where: { id } });
}
