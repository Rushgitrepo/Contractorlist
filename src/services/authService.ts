import api from './api';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'client' | 'contractor';
  phone?: string;
  company?: string;
  licenseNumber?: string;
  businessAddress?: string;
  yearsExperience?: string;
  specialties?: string;
  projectType?: string;
  budget?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  // Register
  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register', data);
    const { token, refreshToken } = response.data.data;
    
    // Save tokens
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    
    return response.data;
  },

  // Login
  login: async (data: LoginData) => {
    const response = await api.post('/auth/login', data);
    const { token, refreshToken } = response.data.data;
    
    // Save tokens
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    
    return response.data;
  },

  // Logout
  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    try {
      if (refreshToken) {
        await api.post('/token/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  // Get Profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Verify Email
  verifyEmail: async (token: string) => {
    const response = await api.get(`/email/verify?token=${token}`);
    return response.data;
  },

  // Resend Verification
  resendVerification: async (email: string) => {
    const response = await api.post('/email/resend-verification', { email });
    return response.data;
  },

  // Forgot Password
  forgotPassword: async (email: string) => {
    const response = await api.post('/password/forgot-password', { email });
    return response.data;
  },

  // Reset Password
  resetPassword: async (token: string, newPassword: string) => {
    const response = await api.post('/password/reset-password', {
      token,
      newPassword,
    });
    return response.data;
  },

  // Refresh Token
  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/token/refresh', { refreshToken });
    return response.data;
  },
};

