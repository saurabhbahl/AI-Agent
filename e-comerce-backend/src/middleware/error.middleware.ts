import { Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors.length > 0 ? err.errors : undefined,
    });
    return;
  }

  if (err instanceof Error) {
    console.error('Unhandled error:', err);
    res.status(500).json({
      success: false,
      message: env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    });
    return;
  }

  console.error('Unknown error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({ success: false, message: 'Route not found' });
};
