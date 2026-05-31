import api from '../services/api.service';
import { ApiResponse, AuthResponse, LoginRequest, LogoutRequest, RefreshRequest, RegisterRequest } from '../types';

export const registerUser = async (payload: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', payload);
  return response.data.data as AuthResponse;
};

export const loginUser = async (payload: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', payload);
  return response.data.data as AuthResponse;
};

export const refreshToken = async (payload: RefreshRequest): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/refresh', payload);
  return response.data.data as AuthResponse;
};

export const logoutUser = async (payload: LogoutRequest): Promise<void> => {
  await api.post<ApiResponse<null>>('/auth/logout', payload);
};
