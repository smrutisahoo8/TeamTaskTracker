import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const savedAuth = localStorage.getItem('team-task-tracker-auth');
  if (savedAuth && config.headers) {
    try {
      const auth = JSON.parse(savedAuth);
      if (auth?.accessToken) {
        config.headers.Authorization = `Bearer ${auth.accessToken}`;
      }
    } catch {
      // ignore malformed auth
    }
  }
  return config;
});

export default api;
