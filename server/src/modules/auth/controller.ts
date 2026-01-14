import { Request, Response } from 'express';
import { z } from 'zod';
import { env } from '../../config/env.js';
import { registerUser, loginUser, refreshSession, logoutSession } from './service.js';

const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'TRAINER', 'STUDENT']).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

export async function register(req: Request, res: Response) {
  const data = registerSchema.parse(req.body);
  const user = await registerUser(data);
  res.status(201).json({
    message: 'Usuário criado com sucesso',
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}

export async function login(req: Request, res: Response) {
  const data = loginSchema.parse(req.body);
  const { user, accessToken, refreshToken } = await loginUser(data);

  res.cookie('refreshToken', refreshToken, cookieOptions());

  res.json({
    accessToken,
    tokenType: 'Bearer',
    expiresIn: env.JWT_EXPIRES_IN,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}

export async function refresh(req: Request, res: Response) {
  const token = req.cookies?.refreshToken as string | undefined;
  if (!token) {
    return res.status(401).json({ message: 'Refresh token ausente', code: 'REFRESH_MISSING' });
  }

  const { user, accessToken, refreshToken } = await refreshSession(token);
  res.cookie('refreshToken', refreshToken, cookieOptions());

  return res.json({
    accessToken,
    tokenType: 'Bearer',
    expiresIn: env.JWT_EXPIRES_IN,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}

export async function logout(req: Request, res: Response) {
  const token = req.cookies?.refreshToken as string | undefined;
  await logoutSession(token);
  res.clearCookie('refreshToken', cookieOptions());
  res.json({ message: 'Logout realizado com sucesso' });
}
