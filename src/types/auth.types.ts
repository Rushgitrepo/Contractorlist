// Auth-related types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'contractor' | 'client' | 'vendor';
  phone?: string;
  company?: string;
  avatar?: string;
  is_verified: boolean;
  // Contractor specific
  license_number?: string;
  business_address?: string;
  years_experience?: number;
  specialties?: string[];
  // Client specific
  project_type?: string;
  budget?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'contractor' | 'client' | 'vendor';
  phone?: string;
  company?: string;
  // Contractor specific
  licenseNumber?: string;
  businessAddress?: string;
  yearsExperience?: number;
  specialties?: string[];
  // Client specific
  projectType?: string;
  budget?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  company?: string;
  avatar?: string;
  // Contractor specific
  license_number?: string;
  business_address?: string;
  years_experience?: number;
  specialties?: string[];
  // Client specific
  project_type?: string;
  budget?: string;
}
