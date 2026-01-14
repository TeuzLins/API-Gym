import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';

export interface AuthRequest extends Request {
  user?: { id: string; role: string; email: string };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token de acesso ausente', code: 'AUTH_MISSING' });
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const payload = verifyAccessToken(token) as { id: string; role: string; email: string };
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ message: 'Token inválido ou expirado', code: 'AUTH_INVALID' });
  }
}
