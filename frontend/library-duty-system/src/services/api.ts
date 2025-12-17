import axios, {AxiosResponse, AxiosError} from 'axios';

//Base configuration
const API_BASE_URL = 'http://localhost:5000/api';

//Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;

// Export types for API responses
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: boolean;
  details?: string;
}

export interface User {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'teacher' | 'itstaff';
  studentMatrixNumber?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}