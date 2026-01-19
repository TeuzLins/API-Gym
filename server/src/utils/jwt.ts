import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signAccessToken(payload: object) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

export function signRefreshToken(payload: object) {
  return jwt.sign(payload, env.REFRESH_SECRET, { expiresIn: env.REFRESH_EXPIRES_IN });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.REFRESH_SECRET);
}
