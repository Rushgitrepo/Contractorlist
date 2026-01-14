// Auth-related types
export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  workType: 'client' | 'subcontractor' | 'general-contractor' | 'supplier';
  phone: string;

  // Shared
  companyName?: string;
  companySize?: string;
  address?: string; // Property or Business Address
  role?: string;

  // GC / SC
  yearsInBusiness?: number;
  projectSizeRange?: string; // GC only
  serviceArea?: string; // SC only

  // Supplier
  businessType?: string;
  deliveryRadius?: number;
  minOrderValue?: string;
  offerCreditTerms?: boolean;

  // Client
  projectType?: string;
  budgetRange?: string;
  timeline?: string;
  propertySize?: string;
  financingStatus?: string;

  // Arrays
  trades?: string[];
  goals?: string[];
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'contractor' | 'client' | 'vendor' | 'admin';
  phone?: string;
  // ... rest of fields can be updated or kept as optional compatible
  company?: string;
  avatar?: string;
  is_verified: boolean;
  createdAt?: string;
  updatedAt?: string;
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
