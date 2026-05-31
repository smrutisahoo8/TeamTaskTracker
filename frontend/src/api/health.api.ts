import api from '../services/api.service';
import { HealthResponse } from '../types';

export const getHealthStatus = async (): Promise<HealthResponse> => {
  const response = await api.get<HealthResponse>('/health');
  return response.data;
};
