import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { errorMiddleware } from './middlewares/error.js';
import { authRoutes } from './modules/auth/routes.js';
import { usersRoutes } from './modules/users/routes.js';
import { exercisesRoutes } from './modules/exercises/routes.js';
import { studentsRoutes } from './modules/students/routes.js';
import { plansRoutes } from './modules/plans/routes.js';
import { progressRoutes } from './modules/progress/routes.js';

export const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/exercises', exercisesRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/plans', plansRoutes);
app.use('/api/progress', progressRoutes);

app.use(errorMiddleware);
