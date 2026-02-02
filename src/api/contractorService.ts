import api from './api';
import { ApiResponse, PaginatedResponse, SearchParams } from '@/types/api.types';
import {
  Contractor,
  ContractorFilters,
  ContractorReview,
  ContractorStats,
} from '@/types/contractor.types';

/**
 * Contractor Service
 * Handles all contractor-related API calls
 */
class ContractorService {
  private readonly BASE_PATH = '/contractors';

  /**
   * Get all contractors with filters and pagination
   */
  async getContractors(
    params?: SearchParams & ContractorFilters
  ): Promise<PaginatedResponse<Contractor>> {
    try {
      const response = await api.get<PaginatedResponse<Contractor>>(this.BASE_PATH, {
        params,
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to fetch contractors' };
    }
  }

  /**
   * Get contractor by ID
   */
  async getContractorById(id: number): Promise<ApiResponse<Contractor>> {
    try {
      const response = await api.get<ApiResponse<Contractor>>(`${this.BASE_PATH}/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to fetch contractor' };
    }
  }

  /**
   * Get contractor reviews
   */
  async getContractorReviews(
    contractorId: number,
    params?: SearchParams
  ): Promise<PaginatedResponse<ContractorReview>> {
    try {
      const response = await api.get<PaginatedResponse<ContractorReview>>(
        `${this.BASE_PATH}/${contractorId}/reviews`,
        { params }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to fetch reviews' };
    }
  }

  /**
   * Get contractor statistics
   */
  async getContractorStats(contractorId: number): Promise<ApiResponse<ContractorStats>> {
    try {
      const response = await api.get<ApiResponse<ContractorStats>>(
        `${this.BASE_PATH}/${contractorId}/stats`
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to fetch stats' };
    }
  }

  /**
   * Update contractor profile
   */
  async updateContractor(
    id: number,
    data: Partial<Contractor>
  ): Promise<ApiResponse<Contractor>> {
    try {
      const response = await api.put<ApiResponse<Contractor>>(
        `${this.BASE_PATH}/${id}`,
        data
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to update contractor' };
    }
  }

  /**
   * Upload contractor portfolio image
   */
  async uploadPortfolioImage(
    contractorId: number,
    file: File
  ): Promise<ApiResponse<{ url: string }>> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post<ApiResponse<{ url: string }>>(
        `${this.BASE_PATH}/${contractorId}/portfolio`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to upload image' };
    }
  }

  /**
   * Search contractors by specialty
   */
  async searchBySpecialty(specialty: string): Promise<ApiResponse<Contractor[]>> {
    try {
      const response = await api.get<ApiResponse<Contractor[]>>(
        `${this.BASE_PATH}/search/specialty`,
        {
          params: { specialty },
        }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to search contractors' };
    }
  }
}

export default new ContractorService();
