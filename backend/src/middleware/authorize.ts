import { Request, Response, NextFunction } from 'express';
import { IJWTPayload } from '../interfaces/domain.interface';

export const authorize = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IJWTPayload | undefined;

    if (!user) {
      return res.status(401).json({
        status: 401,
        code: 'UNAUTHORIZED',
        message: 'User not authenticated',
      });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Insufficient permissions',
      });
    }

    next();
  };
};
