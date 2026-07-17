import { Request, Response, NextFunction } from 'express';

interface ValidationError {
  field: string;
  message: string;
}

export function validateRegister(req: Request, _res: Response, next: NextFunction): void {
  const errors: ValidationError[] = [];
  const { name, email, password } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push({ field: 'name', message: 'Name is required' });
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    errors.push({ field: 'email', message: 'Valid email is required' });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    _res.status(400).json({ errors });
    return;
  }

  next();
}

export function validateLogin(req: Request, _res: Response, next: NextFunction): void {
  const errors: ValidationError[] = [];
  const { email, password } = req.body;

  if (!email || typeof email !== 'string') {
    errors.push({ field: 'email', message: 'Email is required' });
  }

  if (!password || typeof password !== 'string') {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  if (errors.length > 0) {
    _res.status(400).json({ errors });
    return;
  }

  next();
}
