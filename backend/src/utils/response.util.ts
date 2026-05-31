import { ApiResponse } from '../interfaces/app.interface';

export const createSuccessResponse = <T = unknown>(message: string, data?: T): ApiResponse<T> => {
  return {
    success: true,
    message,
    ...(data !== undefined ? { data } : {}),
  };
};

export const createErrorResponse = (status: number, code: string, message: string) => ({
  status,
  code,
  message,
});
