import api from '../services/api.service';
import { ApiResponse, Project, ProjectCreateRequest } from '../types';

export const fetchProjects = async (): Promise<Project[]> => {
  const response = await api.get<ApiResponse<Project[]>>('/projects');
  return response.data.data as Project[];
};

export const createProject = async (payload: ProjectCreateRequest): Promise<Project> => {
  const response = await api.post<ApiResponse<Project>>('/projects', payload);
  return response.data.data as Project;
};
