import api from '../services/api.service';
import { ApiResponse, UserRoleUpdateRequest, UserStatusUpdateRequest, UserSummary } from '../types';

export const fetchUsers = async (): Promise<UserSummary[]> => {
  const response = await api.get<ApiResponse<UserSummary[]>>('/users');
  return response.data.data as UserSummary[];
};

export const updateUserRole = async (userId: number, payload: UserRoleUpdateRequest): Promise<UserSummary> => {
  const response = await api.patch<ApiResponse<UserSummary>>(`/users/${userId}/role`, payload);
  return response.data.data as UserSummary;
};

export const updateUserStatus = async (userId: number, payload: UserStatusUpdateRequest): Promise<UserSummary> => {
  const response = await api.patch<ApiResponse<UserSummary>>(`/users/${userId}/status`, payload);
  return response.data.data as UserSummary;
};
