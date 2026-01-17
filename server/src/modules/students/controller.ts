import { Request, Response } from 'express';
import { z } from 'zod';
import { listStudents, getStudent, createStudentProfile, updateStudentProfile, deleteStudentProfile } from './service.js';

const createSchema = z.object({
  userId: z.string().uuid(),
  height: z.number().optional(),
  goal: z.string().optional(),
  birthDate: z.string().optional(),
});

const updateSchema = z.object({
  height: z.number().optional(),
  goal: z.string().optional(),
  birthDate: z.string().optional(),
});

export async function getStudents(_req: Request, res: Response) {
  const students = await listStudents();
  res.json(students);
}

export async function getStudentById(req: Request, res: Response) {
  const { id } = req.params;
  const student = await getStudent(id);
  res.json(student);
}

export async function postStudent(req: Request, res: Response) {
  const data = createSchema.parse(req.body);
  const profile = await createStudentProfile({
    userId: data.userId,
    height: data.height,
    goal: data.goal,
    birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
  });
  res.status(201).json(profile);
}

export async function patchStudent(req: Request, res: Response) {
  const { id } = req.params;
  const data = updateSchema.parse(req.body);
  const profile = await updateStudentProfile(id, {
    height: data.height,
    goal: data.goal,
    birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
  });
  res.json(profile);
}

export async function removeStudent(req: Request, res: Response) {
  const { id } = req.params;
  await deleteStudentProfile(id);
  res.status(204).send();
}
