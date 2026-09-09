import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('leavo_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('leavo_token');
      localStorage.removeItem('leavo_user');
      window.dispatchEvent(new CustomEvent('leavo_unauthorized'));
    }
    return Promise.reject(error);
  }
);

// Check if demo mode is active
export const isDemoModeActive = (): boolean => {
  return localStorage.getItem('leavo_demo_mode') === 'true';
};

// Check if mock API should be used: only in demo mode or explicit env override
export const isMockActive = (): boolean => {
  return (
    isDemoModeActive() ||
    import.meta.env.VITE_USE_MOCK_API === 'true' ||
    localStorage.getItem('leavo_force_mock') === 'true'
  );
};

// Legacy export - evaluates dynamically via function in API modules
export const USE_MOCK = false;
