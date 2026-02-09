import api from './api';
import { ApiResponse } from '@/types/api.types';
import {
  User,
  RegisterData,
  LoginData,
  AuthResponse,
  ForgotPasswordData,
  ResetPasswordData,
  ChangePasswordData,
  UpdateProfileData,
} from '@/types/auth.types';

// Authentication Service
class AuthService {
  /**
   * Register a new user
   */
  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);

      if (response.data.success && response.data.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }

      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Registration failed' };
    }
  }

  /**
   * Login user
   */
  async login(data: LoginData): Promise<ApiResponse<AuthResponse>> {
    // Proceed directly to API call
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);

      if (response.data.success && response.data.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }

      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Login failed' };
    }
  }

  /**
   * Get user profile
   */
  async getProfile(): Promise<ApiResponse<User>> {
    try {
      const response = await api.get<ApiResponse<User>>('/auth/profile');

      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }

      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to fetch profile' };
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileData): Promise<ApiResponse<User>> {
    try {
      const response = await api.put<ApiResponse<User>>('/auth/profile', data);

      if (response.data.success) {
        // Update stored user data
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }

      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to update profile' };
    }
  }

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordData): Promise<ApiResponse<null>> {
    try {
      const response = await api.post<ApiResponse<null>>('/auth/change-password', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to change password' };
    }
  }

  /**
   * Verify email
   */
  async verifyEmail(token: string): Promise<{ success: boolean; message: string; data: any }> {
    try {
      const response = await api.get(`/email/verify?token=${token}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Email verification failed' };
    }
  }

  /**
   * Resend verification email
   */
  async resendVerification(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post('/email/resend-verification', { email });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to resend verification email' };
    }
  }

  /**
   * Forgot password
   */
  async forgotPassword(data: ForgotPasswordData): Promise<ApiResponse<null>> {
    try {
      const response = await api.post<ApiResponse<null>>('/auth/forgot-password', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to send reset email' };
    }
  }

  /**
   * Reset password
   */
  async resetPassword(data: ResetPasswordData): Promise<ApiResponse<null>> {
    try {
      const response = await api.post<ApiResponse<null>>('/auth/reset-password', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Password reset failed' };
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      // Exhaustive cleanup of any potential token keys
      const tokenKeys = ['token', 'refreshToken', 'accessToken', 'access_token', 'refresh_token', 'id_token'];
      tokenKeys.forEach(key => localStorage.removeItem(key));

      localStorage.removeItem('user');

      // Reset to light theme for public pages (login, etc.)
      // Dashboard theme preference is preserved in 'dashboardTheme' key
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');

      // Force reload or redirect handled by component/store
    }
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Check if user is authenticated
   * Now relies on existence of user profile in storage + valid cookie (validated by API calls)
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('user');
  }

  /**
   * Get token - No longer accessible via JS
   */
  getToken(): string | null {
    return null;
  }
  /**
   * Check if email exists
   */
  async checkEmail(email: string): Promise<{ success: boolean; exists: boolean; message: string }> {
    try {
      const response = await api.post('/email/check', { email }); // Updated endpoint
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to check email' };
    }
  }

  async sendEmailOtp(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post('/email/send-otp', { email }); // Updated endpoint
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to send OTP' };
    }
  }

  async verifyEmailOtp(email: string, code: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post('/email/verify-otp', { email, code }); // Updated endpoint
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to verify OTP' };
    }
  }

  async sendSmsOtp(phone: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post('/auth/send-sms-otp', { phone });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to send SMS OTP' };
    }
  }

  async verifySmsOtp(phone: string, code: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post('/auth/verify-sms-otp', { phone, code });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to verify SMS OTP' };
    }
  }
}

export default new AuthService();
