export interface AppError extends Error {
  status?: number;
  code?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}
