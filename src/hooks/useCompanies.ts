import { useState, useEffect, useCallback } from 'react';
import companyService, { CompanySearchFilters, CompanySearchResult, Company } from '../services/companyService';

interface UseCompaniesOptions {
  autoFetch?: boolean;
  initialFilters?: CompanySearchFilters;
}

interface UseCompaniesReturn {
  companies: CompanySearchResult[];
  loading: boolean;
  error: string | null;
  search: (filters: CompanySearchFilters) => Promise<void>;
  getAllCompanies: () => Promise<void>;
  getCompanyByName: (name: string) => Promise<Company | null>;
  getServicesByZip: (zipCode: string) => Promise<string[]>;
  clearError: () => void;
}

/**
 * Custom hook for managing company data and searches
 * 
 * @example
 * ```tsx
 * const { companies, loading, search } = useCompanies();
 * 
 * // Search with filters
 * await search({ zip: '33602', service: 'HVAC', rating: 4.5 });
 * ```
 */
export const useCompanies = (options: UseCompaniesOptions = {}): UseCompaniesReturn => {
  const { autoFetch = false, initialFilters } = options;

  const [companies, setCompanies] = useState<CompanySearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Search companies with filters
   */
  const search = useCallback(async (filters: CompanySearchFilters) => {
    setLoading(true);
    setError(null);

    try {
      const response = await companyService.searchCompanies(filters);
      if (response.success) {
        setCompanies(response.data || []);
      } else {
        throw new Error(response.message || 'Search failed');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to search companies');
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get all companies
   */
  const getAllCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await companyService.getAllCompanies();
      if (response.success) {
        setCompanies(response.data || []);
      } else {
        throw new Error(response.message || 'Failed to fetch companies');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch companies');
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get a specific company by name
   */
  const getCompanyByName = useCallback(async (name: string): Promise<Company | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await companyService.getCompanyByName(name);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Company not found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch company');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get services available in a zip code
   */
  const getServicesByZip = useCallback(async (zipCode: string): Promise<string[]> => {
    setLoading(true);
    setError(null);

    try {
      const response = await companyService.getServicesByZip(zipCode);
      if (response.success) {
        return response.data || [];
      } else {
        throw new Error(response.message || 'Failed to fetch services');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch services');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      if (initialFilters) {
        search(initialFilters);
      } else {
        getAllCompanies();
      }
    }
  }, [autoFetch, initialFilters, search, getAllCompanies]);

  return {
    companies,
    loading,
    error,
    search,
    getAllCompanies,
    getCompanyByName,
    getServicesByZip,
    clearError,
  };
};

export default useCompanies;

