import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { IJWTPayload } from '../interfaces/domain.interface';

declare global {
  namespace Express {
    interface Request {
      user?: IJWTPayload;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 401,
      code: 'UNAUTHORIZED',
      message: 'Missing or invalid authorization header',
    });
  }

  const token = authHeader.slice(7);
  const payload = verifyAccessToken(token);

  if (!payload) {
    return res.status(401).json({
      status: 401,
      code: 'UNAUTHORIZED',
      message: 'Invalid or expired access token',
    });
  }

  req.user = payload;
  next();
};
