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
  provides_3d?: boolean;
  eco_friendly?: boolean;
  family_owned?: boolean;
  locally_owned?: boolean;
  offers_custom_work?: boolean;
  language?: string;
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
    const response = await api.get('/companies');
    return response.data;
  },

  /**
   * Search Companies (Main Endpoint)
   * GET http://localhost:5000/api/companies/search
   * 
   * Supports all query parameters:
   * - zip, service, city, location
   * - rating, verified_license, responds_quickly, hired_on_platform
   * - professional_category, budget, provides_3d
   * - eco_friendly, family_owned, locally_owned, offers_custom_work
   * - language
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
    if (filters.provides_3d !== undefined) params.append('provides_3d', filters.provides_3d.toString());
    if (filters.eco_friendly !== undefined) params.append('eco_friendly', filters.eco_friendly.toString());
    if (filters.family_owned !== undefined) params.append('family_owned', filters.family_owned.toString());
    if (filters.locally_owned !== undefined) params.append('locally_owned', filters.locally_owned.toString());
    if (filters.offers_custom_work !== undefined) params.append('offers_custom_work', filters.offers_custom_work.toString());
    if (filters.language) params.append('language', filters.language);

    const response = await api.get(`/companies/search?${params.toString()}`);
    return response.data;
  },

  /**
   * Get Services by Zip Code
   * GET http://localhost:5000/api/companies/zip/{zipCode}
   */
  getServicesByZip: async (zipCode: string): Promise<ServicesByZipResponse> => {
    const response = await api.get(`/companies/zip/${encodeURIComponent(zipCode)}`);
    return response.data;
  },

  /**
   * Get Company by Name
   * GET http://localhost:5000/api/companies/{companyName}
   */
  getCompanyByName: async (companyName: string): Promise<CompanyDetailResponse> => {
    const response = await api.get(`/companies/${encodeURIComponent(companyName)}`);
    return response.data;
  },
};

export default companyService;

