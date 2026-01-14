import { NextFunction, Response } from 'express';
import { AuthRequest } from './auth.js';

export function roleMiddleware(roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuário não autenticado', code: 'AUTH_REQUIRED' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Sem permissão para esta ação', code: 'FORBIDDEN' });
    }

    return next();
  };
}
