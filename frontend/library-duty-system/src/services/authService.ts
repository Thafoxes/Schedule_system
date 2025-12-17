import api, { ApiResponse, User, LoginResponse } from './api';

export interface LoginRequest {
  email: string;
  password: string;
  role: 'student' | 'teacher' | 'itstaff';
}

export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: 'student' | 'teacher' | 'itstaff';
  studentMatrixNumber?: string;
}


export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
  studentMatrixNumber?: string;
}


export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

class AuthService {
  // Login user
  async login(loginData: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', loginData);
      
      if (response.data.success && response.data.token) {
        // Store token and user data
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  // Register user
  async register(registerData: RegisterRequest): Promise<ApiResponse<User>> {
    try {
      const response = await api.post<ApiResponse<User>>('/auth/register', registerData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  // Get current user profile
  async getProfile(): Promise<ApiResponse<User>> {
    try {
      const response = await api.get<ApiResponse<User>>('/auth/profile');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  }

  // Update user profile
  async updateProfile(updateData: UpdateProfileRequest): Promise<ApiResponse<User>> {
    try {
      const response = await api.put<ApiResponse<User>>('/auth/profile', updateData);
      
      if (response.data.success && response.data.data) {
        // Update stored user data
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  }

  // Update password
  async updatePassword(passwordData: UpdatePasswordRequest): Promise<ApiResponse<void>> {
    try {
      const response = await api.put<ApiResponse<void>>('/auth/password', passwordData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update password');
    }
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Get stored user
  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default new AuthService();