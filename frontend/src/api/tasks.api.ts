import api from '../services/api.service';
import { ApiResponse, Task, TaskCreatePayload, TaskStatusUpdateRequest, TaskUpdatePayload } from '../types';

export const fetchTasks = async (params?: Record<string, any>): Promise<Task[]> => {
  const response = await api.get<ApiResponse<Task[]>>('/tasks', { params });
  return response.data.data as Task[];
};

export const createTask = async (payload: TaskCreatePayload): Promise<Task> => {
  const response = await api.post<ApiResponse<Task>>('/tasks', payload);
  return response.data.data as Task;
};

export const updateTask = async (taskId: number, payload: TaskUpdatePayload): Promise<Task> => {
  const response = await api.put<ApiResponse<Task>>(`/tasks/${taskId}`, payload);
  return response.data.data as Task;
};

export const updateTaskStatus = async (taskId: number, payload: TaskStatusUpdateRequest): Promise<Task> => {
  const response = await api.patch<ApiResponse<Task>>(`/tasks/${taskId}/status`, payload);
  return response.data.data as Task;
};

export const deleteTask = async (taskId: number): Promise<void> => {
  await api.delete(`/tasks/${taskId}`);
};
