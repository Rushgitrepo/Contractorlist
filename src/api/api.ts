import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

/**
 * API Configuration
 * Base URL for API
 * - Development: Uses proxy (relative URL)
 * - Production: Uses environment variable or fallback
 */
const BASE_URL = import.meta.env.DEV
  ? '/api'
  : import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API timeout in milliseconds
const API_TIMEOUT = 30000; // 30 seconds

/**
 * Create axios instance with default configuration
 */
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_TIMEOUT,
  withCredentials: true, // Enable cookies
});

/**
 * Request Interceptor
 * - Logs requests in development mode
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Token is now sent via HttpOnly cookie automatically

    // Log API calls in development
    if (import.meta.env.DEV) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.baseURL + config.url,
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * - Handles successful responses
 * - Handles errors globally
 * - Implements token refresh logic
 */
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    return response;
  },
  async (error: AxiosError) => {
    // Log errors in development
    if (import.meta.env.DEV) {
      console.error('❌ API Error:', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url,
        data: error.response?.data,
      });
    }

    const originalRequest = error.config as any;

    // Handle 401 Unauthorized - Token expired
    // BUT: Don't try to refresh if:
    // 1. This is already a retry attempt
    // 2. The request is to login/register/refresh endpoints (would cause infinite loop)
    // 3. User is not authenticated (no point in refreshing)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/register') &&
      !originalRequest.url?.includes('/token/refresh')
    ) {
      // Check if user is authenticated before attempting refresh
      const user = localStorage.getItem('user');
      if (!user) {
        // No user session, don't try to refresh
        handleLogout();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        // With cookie-based auth, we just call the refresh endpoint
        // The backend will read the refreshToken cookie
        await api.post('/token/refresh');

        // After successful refresh, retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout user
        handleLogout();
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden - insufficient permissions');
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('Resource not found');
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error('Server error - please try again later');
    }

    return Promise.reject(error);
  }
);

/**
 * Helper function to handle logout
 */
function handleLogout() {
  // Exhaustive cleanup of any potential token keys
  const tokenKeys = ['token', 'refreshToken', 'accessToken', 'access_token', 'refresh_token', 'id_token'];
  tokenKeys.forEach(key => localStorage.removeItem(key));

  localStorage.removeItem('user');

  // Reset theme to light on logout
  document.documentElement.classList.remove('dark');
  localStorage.setItem('theme', 'light');

  // Redirect to login page
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}

export default api;
