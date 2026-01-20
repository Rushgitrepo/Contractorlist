# 🔗 Frontend Integration Guide

This guide shows how to connect your React frontend to the backend APIs.

---

## 📋 Table of Contents

1. [Update Environment Configuration](#1-update-environment-configuration)
2. [Update API Service](#2-update-api-service)
3. [Update Auth Service](#3-update-auth-service)
4. [Update Redux Slices](#4-update-redux-slices)
5. [Update Dashboard Components](#5-update-dashboard-components)
6. [Real-time Updates with Socket.io](#6-real-time-updates)

---

## 1. Update Environment Configuration

### Create `src/.env.example`:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000

# App Configuration
VITE_APP_NAME=ContractorList
VITE_APP_ENV=development
```

### Update `.env.development`:

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

### Update `.env.production`:

```env
VITE_API_URL=https://api.yoursite.com/api/v1
VITE_SOCKET_URL=https://api.yoursite.com
```

---

## 2. Update API Service

### Update `src/services/api.ts`:

```typescript
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// API Configuration
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const API_TIMEOUT = 30000;

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_TIMEOUT,
});

// Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage (use consistent key!)
    const token = localStorage.getItem('accessToken');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log in development
    if (import.meta.env.DEV) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', response.data);
    }
    return response;
  },
  async (error: AxiosError<{ message: string }>) => {
    const originalRequest = error.config as any;

    // Handle 401 - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          // Try to refresh token
          const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
            refreshToken,
          });
          
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          
          // Save new tokens
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        handleLogout();
        return Promise.reject(refreshError);
      }
      
      handleLogout();
    }

    // Format error message
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    
    return Promise.reject(new Error(errorMessage));
  }
);

function handleLogout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  
  // Only redirect if not already on login page
  if (!window.location.pathname.includes('/login')) {
    window.location.href = '/login';
  }
}

export default api;
```

---

## 3. Update Auth Service

### Update `src/services/authService.ts`:

```typescript
import api from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'HOMEOWNER' | 'CONTRACTOR' | 'SUBCONTRACTOR' | 'SUPPLIER' | 'ADMIN';
  phone?: string;
  avatar?: string;
  isVerified: boolean;
  profile?: any;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'HOMEOWNER' | 'CONTRACTOR' | 'SUBCONTRACTOR' | 'SUPPLIER';
  phone?: string;
  companyName?: string;
  licenseNumber?: string;
  yearsExperience?: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<{ data: AuthResponse }>('/auth/register', data);
    
    if (response.data.data) {
      const { accessToken, refreshToken } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
    
    return response.data.data;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<{ data: AuthResponse }>('/auth/login', data);
    
    if (response.data.data) {
      const { accessToken, refreshToken } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
    
    return response.data.data;
  }

  async getProfile(): Promise<User> {
    const response = await api.get<{ data: User }>('/auth/profile');
    return response.data.data;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put<{ data: User }>('/users/me', data);
    return response.data.data;
  }

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await api.post('/auth/reset-password', { token, password });
  }

  async verifyEmail(token: string): Promise<void> {
    await api.get(`/auth/verify-email?token=${token}`);
  }

  logout(): void {
    const refreshToken = localStorage.getItem('refreshToken');
    
    // Call logout API (fire and forget)
    if (refreshToken) {
      api.post('/auth/logout', { refreshToken }).catch(() => {});
    }
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }
}

export default new AuthService();
```

---

## 4. Update Redux Slices

### Update `src/store/slices/authSlice.ts`:

```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import authService, { User, LoginData, RegisterData } from '@/services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,
  error: null,
};

// Async Thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (data: LoginData, { rejectWithValue }) => {
    try {
      const response = await authService.login(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authService.register(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getProfile();
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    authService.logout();
    return null;
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
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
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
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // If profile fetch fails, user might not be authenticated
        state.isAuthenticated = false;
      });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    });
  },
});

export const { clearError, setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
```

### Create `src/services/dashboardService.ts`:

```typescript
import api from './api';

// Types
export interface DashboardStats {
  activeProjects: number;
  totalProjects: number;
  pendingBids: number;
  totalSpent: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  budget: number;
  progress: number;
  totalBudget: number;
  spentBudget: number;
  remainingBudget: number;
  pendingBids: number;
  milestones: Milestone[];
  bids: Bid[];
  createdAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  amount?: number;
  dueDate?: string;
  isCompleted: boolean;
}

export interface Bid {
  id: string;
  amount: number;
  description: string;
  timeline?: string;
  status: string;
  contractor: {
    id: string;
    name: string;
    avatar?: string;
    contractorProfile?: {
      companyName: string;
      rating: number;
      isVerified: boolean;
    };
  };
  submittedAt: string;
}

export interface Activity {
  type: string;
  title: string;
  description: string;
  amount?: number;
  timestamp: string;
}

// Homeowner Dashboard Service
class DashboardService {
  // ======== HOMEOWNER ========
  
  async getHomeownerOverview(): Promise<{
    stats: DashboardStats;
    recentActivity: Activity[];
  }> {
    const response = await api.get('/dashboard/homeowner/overview');
    return response.data.data;
  }

  async getHomeownerProjects(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{
    projects: Project[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const response = await api.get('/dashboard/homeowner/projects', { params });
    return {
      projects: response.data.data,
      pagination: response.data.pagination,
    };
  }

  async getProjectDetails(projectId: string): Promise<Project> {
    const response = await api.get(`/dashboard/homeowner/projects/${projectId}`);
    return response.data.data;
  }

  async getHomeownerBids(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{
    bids: Bid[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const response = await api.get('/dashboard/homeowner/bids', { params });
    return {
      bids: response.data.data,
      pagination: response.data.pagination,
    };
  }

  async acceptBid(bidId: string): Promise<void> {
    await api.post(`/dashboard/homeowner/bids/${bidId}/accept`);
  }

  async rejectBid(bidId: string): Promise<void> {
    await api.post(`/dashboard/homeowner/bids/${bidId}/reject`);
  }

  // ======== CONTRACTOR ========

  async getContractorOverview(): Promise<{
    stats: {
      activeProjects: number;
      pendingBids: number;
      wonBidsThisMonth: number;
      totalEarnings: number;
      rating: number;
      reviewCount: number;
      isVerified: boolean;
    };
    recentActivity: Activity[];
  }> {
    const response = await api.get('/dashboard/contractor/overview');
    return response.data.data;
  }

  async getContractorLeads(params?: {
    page?: number;
    limit?: number;
    specialty?: string;
    location?: string;
  }): Promise<{
    projects: Project[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const response = await api.get('/dashboard/contractor/leads', { params });
    return {
      projects: response.data.data,
      pagination: response.data.pagination,
    };
  }

  async getContractorBids(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{
    bids: Bid[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const response = await api.get('/dashboard/contractor/bids', { params });
    return {
      bids: response.data.data,
      pagination: response.data.pagination,
    };
  }

  async getContractorProjects(params?: {
    page?: number;
    limit?: number;
  }): Promise<{
    projects: Project[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const response = await api.get('/dashboard/contractor/projects', { params });
    return {
      projects: response.data.data,
      pagination: response.data.pagination,
    };
  }

  async submitBid(data: {
    projectId: string;
    amount: number;
    description: string;
    timeline?: string;
  }): Promise<Bid> {
    const response = await api.post('/bids', data);
    return response.data.data;
  }

  // ======== PROJECTS ========

  async createProject(data: {
    title: string;
    description: string;
    specialtyId?: string;
    budget?: number;
    budgetMin?: number;
    budgetMax?: number;
    location: string;
    city: string;
    state: string;
    zipCode?: string;
    startDate?: string;
    endDate?: string;
    isUrgent?: boolean;
  }): Promise<Project> {
    const response = await api.post('/projects', data);
    return response.data.data;
  }

  async updateProject(projectId: string, data: Partial<Project>): Promise<Project> {
    const response = await api.put(`/projects/${projectId}`, data);
    return response.data.data;
  }

  async deleteProject(projectId: string): Promise<void> {
    await api.delete(`/projects/${projectId}`);
  }

  // ======== MILESTONES ========

  async addMilestone(projectId: string, data: {
    title: string;
    description?: string;
    amount?: number;
    dueDate?: string;
  }): Promise<Milestone> {
    const response = await api.post(`/projects/${projectId}/milestones`, data);
    return response.data.data;
  }

  async completeMilestone(projectId: string, milestoneId: string): Promise<void> {
    await api.post(`/projects/${projectId}/milestones/${milestoneId}/complete`);
  }
}

export default new DashboardService();
```

---

## 5. Update Dashboard Components

### Update `src/components/homeowner/MyProjects.tsx`:

```typescript
import { useState, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import dashboardService, { Project, Activity } from '@/services/dashboardService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Activity as ActivityIcon,
  Plus,
} from 'lucide-react';

const MyProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [stats, setStats] = useState({
    activeProjects: 0,
    totalProjects: 0,
    pendingBids: 0,
    totalSpent: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.auth);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch overview and projects in parallel
      const [overviewData, projectsData] = await Promise.all([
        dashboardService.getHomeownerOverview(),
        dashboardService.getHomeownerProjects(),
      ]);
      
      setStats(overviewData.stats);
      setRecentActivity(overviewData.recentActivity);
      setProjects(projectsData.projects);
      
      // Select first project by default
      if (projectsData.projects.length > 0) {
        setSelectedProject(projectsData.projects[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
      toast({
        title: 'Error',
        description: err.message || 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptBid = async (bidId: string) => {
    try {
      await dashboardService.acceptBid(bidId);
      toast({
        title: 'Success!',
        description: 'Bid accepted successfully',
      });
      // Refresh data
      fetchDashboardData();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to accept bid',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'BIDDING': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'ON_HOLD': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={fetchDashboardData}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50/50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Projects</h1>
          <p className="text-gray-600">
            Track progress, manage budgets, and coordinate with contractors
          </p>
        </div>
        <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white gap-2">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-700">Active Projects</p>
                <p className="text-3xl font-bold text-blue-900">{stats.activeProjects}</p>
              </div>
              <ActivityIcon className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-700">Total Spent</p>
                <p className="text-3xl font-bold text-green-900">
                  ${(stats.totalSpent / 1000).toFixed(0)}K
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-orange-700">Pending Bids</p>
                <p className="text-3xl font-bold text-orange-900">{stats.pendingBids}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-700">Total Projects</p>
                <p className="text-3xl font-bold text-purple-900">{stats.totalProjects}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Project List */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Projects</h2>
          
          {projects.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500 mb-4">No projects yet</p>
              <Button>Create Your First Project</Button>
            </Card>
          ) : (
            projects.map((project) => (
              <Card
                key={project.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedProject?.id === project.id
                    ? 'ring-2 ring-orange-400 shadow-lg'
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedProject(project)}
              >
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-gray-900">{project.title}</h3>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-orange-600">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between mt-3 text-sm text-gray-500">
                    <span>Budget: ${project.totalBudget?.toLocaleString()}</span>
                    <span>{project.pendingBids} bids</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Project Details */}
        <div className="lg:col-span-8">
          {selectedProject ? (
            <Card className="h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{selectedProject.title}</CardTitle>
                    <p className="text-gray-500 mt-1">{selectedProject.description}</p>
                  </div>
                  <Badge className={getStatusColor(selectedProject.status)}>
                    {selectedProject.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Budget Overview */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Budget</p>
                    <p className="text-xl font-bold text-gray-900">
                      ${selectedProject.totalBudget?.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600">Spent</p>
                    <p className="text-xl font-bold text-green-900">
                      ${selectedProject.spentBudget?.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">Remaining</p>
                    <p className="text-xl font-bold text-blue-900">
                      ${selectedProject.remainingBudget?.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Milestones */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Milestones</h3>
                  <div className="space-y-2">
                    {selectedProject.milestones?.map((milestone) => (
                      <div
                        key={milestone.id}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          milestone.isCompleted ? 'bg-green-50' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle
                            className={`w-5 h-5 ${
                              milestone.isCompleted ? 'text-green-500' : 'text-gray-300'
                            }`}
                          />
                          <span className={milestone.isCompleted ? 'line-through text-gray-500' : ''}>
                            {milestone.title}
                          </span>
                        </div>
                        <span className="font-semibold">
                          ${milestone.amount?.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pending Bids */}
                {selectedProject.bids?.filter(b => b.status === 'PENDING').length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Pending Bids</h3>
                    <div className="space-y-3">
                      {selectedProject.bids
                        .filter(b => b.status === 'PENDING')
                        .map((bid) => (
                          <div key={bid.id} className="p-4 border rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-semibold">
                                  {bid.contractor.contractorProfile?.companyName || bid.contractor.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  ⭐ {bid.contractor.contractorProfile?.rating || 'N/A'} rating
                                  {bid.contractor.contractorProfile?.isVerified && ' • Verified'}
                                </p>
                              </div>
                              <p className="text-xl font-bold text-green-600">
                                ${bid.amount.toLocaleString()}
                              </p>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{bid.description}</p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleAcceptBid(bid.id)}
                                className="bg-green-500 hover:bg-green-600"
                              >
                                Accept Bid
                              </Button>
                              <Button size="sm" variant="outline">
                                Message
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <p className="text-gray-500">Select a project to view details</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProjects;
```

---

## 6. Real-time Updates with Socket.io

### Install Socket.io Client:

```bash
npm install socket.io-client
```

### Create `src/services/socketService.ts`:

```typescript
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('🔌 Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
    });

    // Set up event listeners
    this.setupListeners();
  }

  private setupListeners() {
    if (!this.socket) return;

    // Notification events
    this.socket.on('notification', (data) => {
      this.emit('notification', data);
    });

    // Message events
    this.socket.on('new_message', (data) => {
      this.emit('new_message', data);
    });

    // Bid events
    this.socket.on('bid_received', (data) => {
      this.emit('bid_received', data);
    });

    this.socket.on('bid_accepted', (data) => {
      this.emit('bid_accepted', data);
    });

    // Project events
    this.socket.on('project_updated', (data) => {
      this.emit('project_updated', data);
    });
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new SocketService();
```

### Use in App.tsx:

```typescript
import { useEffect } from 'react';
import socketService from '@/services/socketService';
import { useAppSelector } from '@/store/hooks';

// In your App component or a global provider:
const useSocketConnection = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        socketService.connect(token);
      }
    } else {
      socketService.disconnect();
    }
    
    return () => {
      socketService.disconnect();
    };
  }, [isAuthenticated]);
};
```

---

**Next:** [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md) - Deploy to production

