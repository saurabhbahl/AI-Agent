import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError, ForbiddenError } from '../utils/ApiError';
import { verifyAccessToken } from '../utils/jwt';
import { UserRole, JwtPayload } from '../types';

// Module augmentation for Express Request
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export interface AuthRequest extends Request {
  user: JwtPayload;
}

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return next(new UnauthorizedError('Access token required'));
    }

    const token = authHeader.split(' ')[1];
    req.user = verifyAccessToken(token);
    next();
  } catch (error) {
    next(error instanceof UnauthorizedError ? error : new UnauthorizedError('Invalid or expired access token'));
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        return next(new UnauthorizedError());
      }
      if (!roles.includes(req.user.role)) {
        return next(new ForbiddenError('Insufficient permissions'));
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const optionalAuth = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        req.user = verifyAccessToken(authHeader.split(' ')[1]);
      } catch {
        // ignore invalid token for optional auth
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};
