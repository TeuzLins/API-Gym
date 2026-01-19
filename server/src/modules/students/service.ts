import { prisma } from '../../config/prisma.js';
import { AppError } from '../../middlewares/error.js';

export async function listStudents() {
  return prisma.user.findMany({
    where: { role: 'STUDENT' },
    include: { studentProfile: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getStudent(id: string) {
  const student = await prisma.user.findUnique({
    where: { id },
    include: { studentProfile: true },
  });
  if (!student || student.role !== 'STUDENT') {
    throw new AppError('Aluno não encontrado', 404, 'STUDENT_NOT_FOUND');
  }
  return student;
}

export async function createStudentProfile(data: {
  userId: string;
  height?: number;
  goal?: string;
  birthDate?: Date;
}) {
  const user = await prisma.user.findUnique({ where: { id: data.userId } });
  if (!user || user.role !== 'STUDENT') {
    throw new AppError('Usuário não é um aluno válido', 400, 'INVALID_STUDENT');
  }

  const existing = await prisma.studentProfile.findUnique({ where: { userId: data.userId } });
  if (existing) {
    throw new AppError('Perfil do aluno já existe', 409, 'PROFILE_EXISTS');
  }

  return prisma.studentProfile.create({
    data: {
      userId: data.userId,
      height: data.height,
      goal: data.goal,
      birthDate: data.birthDate,
    },
  });
}

export async function updateStudentProfile(id: string, data: { height?: number; goal?: string; birthDate?: Date }) {
  const profile = await prisma.studentProfile.findUnique({ where: { id } });
  if (!profile) {
    throw new AppError('Perfil do aluno não encontrado', 404, 'PROFILE_NOT_FOUND');
  }
  return prisma.studentProfile.update({ where: { id }, data });
}

export async function deleteStudentProfile(id: string) {
  const profile = await prisma.studentProfile.findUnique({ where: { id } });
  if (!profile) {
    throw new AppError('Perfil do aluno não encontrado', 404, 'PROFILE_NOT_FOUND');
  }
  await prisma.studentProfile.delete({ where: { id } });
}
