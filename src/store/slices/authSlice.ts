import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AsyncThunkState } from '../types';
import authService from '@/api/authService';
import { RegisterData, LoginData, User as ApiUser } from '@/types/auth.types';

// Types
export interface User {
  id: number | string;
  name: string;
  email: string;
  avatar?: string;
  role: 'general-contractor' | 'subcontractor' | 'client' | 'homeowner' | 'admin' | 'vendor';
  phone?: string;
  company?: string;
  is_verified?: boolean;
  license_number?: string;
  business_address?: string;
  years_experience?: number;
  specialties?: string[];
  project_type?: string;
  budget?: string;
  createdAt?: string;
  lastLogin?: string;
  preferences?: {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
  };
  contractor_type?: 'general-contractor' | 'subcontractor';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  // Enhanced async states
  loginState: AsyncThunkState;
  registerState: AsyncThunkState;
  logoutState: AsyncThunkState;
  deleteAccountState: AsyncThunkState;
  // Session management
  sessionExpiry: number | null;
  refreshTokenExpiry: number | null;
}

// Initial state - check for accessToken in localStorage
// Initial state - check for user in localStorage
const getInitialAuthState = (): AuthState => {
  const userStr = localStorage.getItem('user');
  let user: User | null = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch {
      localStorage.removeItem('user');
    }
  }

  return {
    user: user,
    isAuthenticated: !!user,
    isLoading: false,
    error: null,
    // Enhanced async states
    loginState: { pending: false, fulfilled: false, rejected: false, error: null },
    registerState: { pending: false, fulfilled: false, rejected: false, error: null },
    logoutState: { pending: false, fulfilled: false, rejected: false, error: null },
    deleteAccountState: { pending: false, fulfilled: false, rejected: false, error: null },
    // Session management
    sessionExpiry: null,
    refreshTokenExpiry: null,
  };
};

const initialState: AuthState = getInitialAuthState();

// Async thunks

/**
 * Register new user
 */
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authService.register(data);
      const apiUser = response.data.user;
      // Map API user to Store user
      const user: User = {
        ...apiUser,
        id: apiUser.id,
        name: (apiUser as any).name || (apiUser.firstName && apiUser.lastName ? `${apiUser.firstName} ${apiUser.lastName}` : apiUser.firstName || apiUser.lastName || apiUser.email || 'User'),
        role: apiUser.role as any
      };
      return { ...response.data, user };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

/**
 * Login user
 */
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (data: LoginData, { rejectWithValue }) => {
    try {
      const response = await authService.login(data);
      const apiUser = response.data.user;
      // Map API user to Store user
      const user: User = {
        ...apiUser,
        id: apiUser.id,
        name: (apiUser as any).name || (apiUser.firstName && apiUser.lastName ? `${apiUser.firstName} ${apiUser.lastName}` : apiUser.firstName || apiUser.lastName || apiUser.email || 'User'),
        role: apiUser.role as any
      };
      return { ...response.data, user };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

/**
 * Get user profile
 */
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getProfile();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

/**
 * Logout user
 */
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      authService.logout();
      return null;
    } catch (error) {
      // Even if API call fails, clear local state
      authService.logout();
      return null;
    }
  }
);

export const deleteUserAccount = createAsyncThunk(
  'auth/deleteUserAccount',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call for account deletion
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Clear all user data from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('sessionExpiry');
      localStorage.removeItem('rememberMe');

      // Also potentially call an API endpoint to delete account which would clear cookies

      return null;
    } catch (error) {
      return rejectWithValue('Account deletion failed');
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
      state.deleteAccountState.error = null;
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      // Token management is now cookie-based
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.sessionExpiry = null;
      state.refreshTokenExpiry = null;
      localStorage.removeItem('user');

      // Reset theme to light on logout
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    },
    updateUserPreferences: (state, action: PayloadAction<Partial<User['preferences']>>) => {
      if (state.user?.preferences) {
        state.user.preferences = { ...state.user.preferences, ...action.payload };
      }
    },
    setSessionExpiry: (state, action: PayloadAction<number>) => {
      state.sessionExpiry = action.payload;
    },
    refreshSession: (state, action: PayloadAction<{ sessionExpiry: number }>) => {
      state.sessionExpiry = action.payload.sessionExpiry;
      localStorage.setItem('sessionExpiry', action.payload.sessionExpiry.toString());
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.registerState = { pending: true, fulfilled: false, rejected: false, error: null };
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user as User;
        state.isAuthenticated = true;
        state.error = null;
        state.registerState = { pending: false, fulfilled: true, rejected: false, error: null };
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.registerState = {
          pending: false,
          fulfilled: false,
          rejected: true,
          error: action.payload as string
        };
      });

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.loginState = { pending: true, fulfilled: false, rejected: false, error: null };
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user as User;
        state.isAuthenticated = true;
        state.error = null;
        state.loginState = { pending: false, fulfilled: true, rejected: false, error: null };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.loginState = {
          pending: false,
          fulfilled: false,
          rejected: true,
          error: action.payload as string
        };
      });

    // Fetch Profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload as unknown as User;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        state.sessionExpiry = null;
        state.refreshTokenExpiry = null;
        state.isLoading = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        // Even if logout fails, clear the state
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      });

    // Delete Account
    builder
      .addCase(deleteUserAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.deleteAccountState = { pending: true, fulfilled: false, rejected: false, error: null };
      })
      .addCase(deleteUserAccount.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.sessionExpiry = null;
        state.refreshTokenExpiry = null;
        state.error = null;
        state.deleteAccountState = { pending: false, fulfilled: true, rejected: false, error: null };
      })
      .addCase(deleteUserAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.deleteAccountState = {
          pending: false,
          fulfilled: false,
          rejected: true,
          error: action.payload as string
        };
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