import axios from 'axios';

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
}

export const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractApiError(error: any): string {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  return error.message || 'An unexpected error occurred';
}

