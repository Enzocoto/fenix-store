import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../env';

export interface AuthedRequest extends Request {
  adminEmail?: string;
}

export function signAdminToken(email: string): string {
  return jwt.sign({ sub: email }, env.jwtSecret, { expiresIn: '7d' });
}

export function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }
  try {
    const payload = jwt.verify(token, env.jwtSecret) as { sub?: string };
    req.adminEmail = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: 'invalid_token' });
  }
}
