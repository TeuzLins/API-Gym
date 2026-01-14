import { NextFunction, Request, Response } from 'express';

export class AppError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(message: string, status = 400, code = 'BAD_REQUEST', details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function errorMiddleware(error: Error, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof AppError) {
    return res.status(error.status).json({ message: error.message, code: error.code, details: error.details });
  }

  console.error(error);
  return res.status(500).json({ message: 'Erro interno no servidor', code: 'SERVER_ERROR' });
}
