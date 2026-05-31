import { NextFunction, Request, Response } from 'express';
import { AppError } from '../interfaces/app.interface';
import { createErrorResponse } from '../utils/response.util';

export const notFoundHandler = (_req: Request, res: Response) => {
  return res.status(404).json(createErrorResponse(404, 'NOT_FOUND', 'Route not found'));
};

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const status = err.status || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected error occurred';

  return res.status(status).json(createErrorResponse(status, code, message));
};
