import crypto from 'crypto';
import { env } from '../../config/env.js';
import { prisma } from '../../config/prisma.js';
import { AppError } from '../../middlewares/error.js';
import { compareHash, hashValue } from '../../utils/hash.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt.js';
import { addDuration } from '../../utils/time.js';

function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function registerUser(data: { name: string; email: string; password: string; role?: string }) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new AppError('E-mail já cadastrado', 409, 'EMAIL_IN_USE');
  }

  const passwordHash = await hashValue(data.password);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role ?? 'STUDENT',
    },
  });

  return user;
}

export async function loginUser(data: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) {
    throw new AppError('Credenciais inválidas', 401, 'INVALID_CREDENTIALS');
  }

  const match = await compareHash(data.password, user.passwordHash);
  if (!match) {
    throw new AppError('Credenciais inválidas', 401, 'INVALID_CREDENTIALS');
  }

  const accessToken = signAccessToken({ id: user.id, email: user.email, role: user.role });
  const refreshToken = signRefreshToken({ id: user.id, email: user.email, role: user.role });

  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(refreshToken),
      userId: user.id,
      expiresAt: addDuration(new Date(), env.REFRESH_EXPIRES_IN),
    },
  });

  return { user, accessToken, refreshToken };
}

export async function refreshSession(token: string) {
  try {
    verifyRefreshToken(token);
  } catch {
    throw new AppError('Refresh token inválido', 401, 'REFRESH_INVALID');
  }

  const tokenHash = hashToken(token);
  const stored = await prisma.refreshToken.findUnique({ where: { tokenHash } });
  if (!stored || stored.revokedAt) {
    throw new AppError('Refresh token revogado', 401, 'REFRESH_REVOKED');
  }

  if (stored.expiresAt < new Date()) {
    throw new AppError('Refresh token expirado', 401, 'REFRESH_EXPIRED');
  }

  const user = await prisma.user.findUnique({ where: { id: stored.userId } });
  if (!user) {
    throw new AppError('Usuário não encontrado', 404, 'USER_NOT_FOUND');
  }

  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  });

  const accessToken = signAccessToken({ id: user.id, email: user.email, role: user.role });
  const newRefreshToken = signRefreshToken({ id: user.id, email: user.email, role: user.role });

  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(newRefreshToken),
      userId: user.id,
      expiresAt: addDuration(new Date(), env.REFRESH_EXPIRES_IN),
    },
  });

  return { user, accessToken, refreshToken: newRefreshToken };
}

export async function logoutSession(token?: string) {
  if (!token) {
    return;
  }

  const tokenHash = hashToken(token);
  const stored = await prisma.refreshToken.findUnique({ where: { tokenHash } });
  if (!stored) {
    return;
  }

  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  });
}
