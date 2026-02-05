import api from './api';

// Types for Company Search Filters
export interface CompanySearchFilters {
  zip?: string;
  service?: string;
  city?: string;
  location?: string;
  rating?: number;
  verified_license?: boolean;
  responds_quickly?: boolean;
  hired_on_platform?: boolean;
  professional_category?: string;
  budget?: '$' | '$$' | '$$$' | '$$$$';
  provides_3d_visualization?: boolean;
  eco_friendly?: boolean;
  family_owned?: boolean;
  locally_owned?: boolean;
  offers_custom_work?: boolean;
  language?: string;
  state?: string;
  radius?: string | number;
  certifications?: string;
  project_type?: string;
  bonded?: boolean;
  insured?: boolean;
  availability?: string;
  search?: string;
  // Backend pagination support
  page?: number;
  limit?: number;
}

// Company Response Types
export interface Company {
  name: string;
  rating?: number;
  reviews?: number;
  verifiedHires?: number;
  tagline?: string;
  testimonial?: string;
  reviewer?: string;
  location?: string;
  projects?: number;
  images?: string[];
  sponsored?: boolean;
  bannerText?: string;
  [key: string]: any; // Allow for additional properties
}

export interface CompanySearchResult {
  company: Company;
  [key: string]: any; // Allow for additional properties
}

export interface CompanySearchResponse {
  success: boolean;
  data: CompanySearchResult[];
  message?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface ServicesByZipResponse {
  success: boolean;
  data: string[]; // Array of service names
  message?: string;
}

export interface CompanyDetailResponse {
  success: boolean;
  data: Company;
  message?: string;
}

export const companyService = {
  /**
   * Get All Companies
   * GET http://localhost:5000/api/companies
   */
  getAllCompanies: async (): Promise<CompanySearchResponse> => {
    // Return empty list as fallback, searchCompanies handles the real work
    return {
      success: true,
      data: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
      }
    };
  },

  /**
   * Search Companies (Main Endpoint)
   * GET http://localhost:5000/api/companies/search
   */
  searchCompanies: async (filters: CompanySearchFilters): Promise<CompanySearchResponse> => {
    const params = new URLSearchParams();

    // Add all filters to params
    if (filters.zip) params.append('zip', filters.zip);
    if (filters.service) params.append('service', filters.service);
    if (filters.city) params.append('city', filters.city);
    if (filters.location) params.append('location', filters.location);
    if (filters.rating !== undefined) params.append('rating', filters.rating.toString());
    if (filters.verified_license !== undefined) params.append('verified_license', filters.verified_license.toString());
    if (filters.responds_quickly !== undefined) params.append('responds_quickly', filters.responds_quickly.toString());
    if (filters.hired_on_platform !== undefined) params.append('hired_on_platform', filters.hired_on_platform.toString());
    if (filters.professional_category) params.append('professional_category', filters.professional_category);
    if (filters.budget) params.append('budget', filters.budget);
    if (filters.provides_3d_visualization !== undefined) params.append('provides_3d_visualization', filters.provides_3d_visualization.toString());
    if (filters.eco_friendly !== undefined) params.append('eco_friendly', filters.eco_friendly.toString());
    if (filters.family_owned !== undefined) params.append('family_owned', filters.family_owned.toString());
    if (filters.locally_owned !== undefined) params.append('locally_owned', filters.locally_owned.toString());
    if (filters.offers_custom_work !== undefined) params.append('offers_custom_work', filters.offers_custom_work.toString());
    if (filters.language) params.append('language', filters.language);
    if (filters.state) params.append('state', filters.state);
    if (filters.radius) params.append('radius', filters.radius.toString());
    if (filters.certifications) params.append('certifications', filters.certifications);
    if (filters.project_type) params.append('project_type', filters.project_type);
    if (filters.bonded !== undefined) params.append('bonded', filters.bonded.toString());
    if (filters.insured !== undefined) params.append('insured', filters.insured.toString());
    if (filters.availability) params.append('availability', filters.availability);
    if (filters.search) params.append('search', filters.search);
    if (filters.page !== undefined) params.append('page', filters.page.toString());
    if (filters.limit !== undefined) params.append('limit', filters.limit.toString());

    const response = await api.get(`/companies/search?${params.toString()}`);
    return response.data;
  },

  /**
   * Get Services by Zip Code
   * GET http://localhost:5000/api/companies/zip/{zipCode}
   */
  getServicesByZip: async (zipCode: string): Promise<ServicesByZipResponse> => {
    const response = await api.get(`/companies/zip/${zipCode}`);
    return response.data;
  },

  /**
   * Get Company by Name
   * GET http://localhost:5000/api/companies/{companyName}
   */
  getCompanyByName: async (companyName: string): Promise<CompanyDetailResponse> => {
    // URL encode the company name to handle spaces/special characters
    const encodedName = encodeURIComponent(companyName);
    const response = await api.get(`/companies/${encodedName}`);
    return response.data;
  },

  /**
   * Get current user's company profile and completion status
   */
  getMyCompanyProfile: async (): Promise<any> => {
    const response = await api.get('/companies/me');
    return response.data;
  },

  /**
   * Update current user's company profile
   */
  updateMyCompanyProfile: async (data: any): Promise<any> => {
    const response = await api.post('/companies/me', data);
    return response.data;
  },

  /**
   * Skip profile completion reminder
   */
  skipProfileReminder: async (): Promise<any> => {
    const response = await api.post('/companies/me/skip');
    return response.data;
  },
};

export default companyService;

