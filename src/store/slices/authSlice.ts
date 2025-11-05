import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AsyncThunkState, ApiError } from '../types';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'contractor' | 'client' | 'homeowner' | 'admin';
  createdAt?: string;
  lastLogin?: string;
  preferences?: {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  // Enhanced async states
  loginState: AsyncThunkState;
  registerState: AsyncThunkState;
  logoutState: AsyncThunkState;
  // Session management
  sessionExpiry: number | null;
  refreshTokenExpiry: number | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: localStorage.getItem('token'),
  // Enhanced async states
  loginState: { pending: false, fulfilled: false, rejected: false, error: null },
  registerState: { pending: false, fulfilled: false, rejected: false, error: null },
  logoutState: { pending: false, fulfilled: false, rejected: false, error: null },
  // Session management
  sessionExpiry: null,
  refreshTokenExpiry: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string; rememberMe?: boolean }, { rejectWithValue }) => {
    try {
      // Simulate API call with better error handling
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate validation
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }
      
      if (credentials.email === 'error@test.com') {
        throw new Error('Invalid credentials');
      }
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      const refreshToken = 'mock-refresh-token-' + Date.now();
      
      // Get user data from localStorage or use default
      const storedUserData = localStorage.getItem('userData');
      const userData = storedUserData ? JSON.parse(storedUserData) : null;
      
      const mockUser: User = {
        id: 'user-' + Date.now(),
        name: userData?.name || 'John Doe',
        email: credentials.email,
        role: userData?.role || 'contractor',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        preferences: {
          theme: 'light',
          notifications: true,
          language: 'en',
        },
      };
      
      // Set session expiry (1 hour for demo)
      const sessionExpiry = Date.now() + (60 * 60 * 1000);
      const refreshTokenExpiry = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
      
      localStorage.setItem('token', mockToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('sessionExpiry', sessionExpiry.toString());
      
      if (credentials.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      
      return { 
        user: mockUser, 
        token: mockToken, 
        refreshToken,
        sessionExpiry,
        refreshTokenExpiry,
      };
    } catch (error: any) {
      const apiError: ApiError = {
        message: error.message || 'Login failed',
        code: error.code || 'AUTH_ERROR',
        details: error.details,
      };
      return rejectWithValue(apiError);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: { name: string; email: string; password: string; role: string }, { rejectWithValue }) => {
    try {
      // Simulate successful registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      const mockUser = {
        id: 'user-' + Date.now(),
        name: userData.name,
        email: userData.email,
        role: userData.role as 'contractor' | 'client' | 'homeowner' | 'admin'
      };
      
      // Store user data for login
      localStorage.setItem('userData', JSON.stringify({
        name: userData.name,
        email: userData.email,
        role: userData.role
      }));
      localStorage.setItem('token', mockToken);
      return { user: mockUser, token: mockToken };
    } catch (error) {
      return rejectWithValue('Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      return null;
    } catch (error) {
      return rejectWithValue('Logout failed');
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuthErrors: (state) => {
      state.loginState.error = null;
      state.registerState.error = null;
      state.logoutState.error = null;
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.sessionExpiry = null;
      state.refreshTokenExpiry = null;
    },
    updateUserPreferences: (state, action: PayloadAction<Partial<User['preferences']>>) => {
      if (state.user?.preferences) {
        state.user.preferences = { ...state.user.preferences, ...action.payload };
      }
    },
    setSessionExpiry: (state, action: PayloadAction<number>) => {
      state.sessionExpiry = action.payload;
    },
    refreshSession: (state, action: PayloadAction<{ token: string; sessionExpiry: number }>) => {
      state.token = action.payload.token;
      state.sessionExpiry = action.payload.sessionExpiry;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('sessionExpiry', action.payload.sessionExpiry.toString());
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.loginState = { pending: true, fulfilled: false, rejected: false, error: null };
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.sessionExpiry = action.payload.sessionExpiry;
        state.refreshTokenExpiry = action.payload.refreshTokenExpiry;
        state.isAuthenticated = true;
        state.error = null;
        state.loginState = { pending: false, fulfilled: true, rejected: false, error: null };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        const error = action.payload as ApiError;
        state.error = error.message;
        state.isAuthenticated = false;
        state.loginState = { 
          pending: false, 
          fulfilled: false, 
          rejected: true, 
          error: error.message 
        };
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Logout
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { 
  clearError, 
  clearAuthErrors, 
  setUser, 
  clearUser, 
  updateUserPreferences, 
  setSessionExpiry, 
  refreshSession 
} = authSlice.actions;
export default authSlice.reducer;