import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface Contractor {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  location: {
    city: string;
    state: string;
    zipCode: string;
  };
  avatar?: string;
  verified: boolean;
  yearsExperience: number;
  portfolio: string[];
  description: string;
}

interface ContractorFilters {
  specialty: string;
  location: string;
  rating: number;
  priceRange: [number, number];
  verified: boolean;
}

interface ContractorState {
  contractors: Contractor[];
  filteredContractors: Contractor[];
  selectedContractor: Contractor | null;
  filters: Partial<ContractorFilters>;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

const initialState: ContractorState = {
  contractors: [],
  filteredContractors: [],
  selectedContractor: null,
  filters: {},
  searchQuery: '',
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  },
};

// Async thunks
export const fetchContractors = createAsyncThunk(
  'contractor/fetchContractors',
  async (params: { page?: number; filters?: Partial<ContractorFilters>; search?: string }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        page: (params.page || 1).toString(),
        search: params.search || '',
        ...Object.entries(params.filters || {}).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = value.toString();
          }
          return acc;
        }, {} as Record<string, string>),
      });

      const response = await fetch(`/api/contractors?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch contractors');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Failed to fetch contractors');
    }
  }
);

export const fetchContractorById = createAsyncThunk(
  'contractor/fetchContractorById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/contractors/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch contractor');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Failed to fetch contractor details');
    }
  }
);

export const searchContractors = createAsyncThunk(
  'contractor/searchContractors',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/contractors/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Failed to search contractors');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Failed to search contractors');
    }
  }
);

const contractorSlice = createSlice({
  name: 'contractor',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ContractorFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearSearchQuery: (state) => {
      state.searchQuery = '';
    },
    setSelectedContractor: (state, action: PayloadAction<Contractor | null>) => {
      state.selectedContractor = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Local filtering for better UX
    applyLocalFilters: (state) => {
      let filtered = [...state.contractors];
      
      // Apply search query
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(contractor =>
          contractor.name.toLowerCase().includes(query) ||
          contractor.company.toLowerCase().includes(query) ||
          contractor.specialties.some(specialty => specialty.toLowerCase().includes(query)) ||
          contractor.location.city.toLowerCase().includes(query)
        );
      }
      
      // Apply filters
      if (state.filters.specialty) {
        filtered = filtered.filter(contractor =>
          contractor.specialties.includes(state.filters.specialty!)
        );
      }
      
      if (state.filters.rating) {
        filtered = filtered.filter(contractor =>
          contractor.rating >= state.filters.rating!
        );
      }
      
      if (state.filters.verified !== undefined) {
        filtered = filtered.filter(contractor =>
          contractor.verified === state.filters.verified
        );
      }
      
      state.filteredContractors = filtered;
    },
  },
  extraReducers: (builder) => {
    // Fetch contractors
    builder
      .addCase(fetchContractors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContractors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contractors = action.payload.contractors;
        state.filteredContractors = action.payload.contractors;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchContractors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch contractor by ID
    builder
      .addCase(fetchContractorById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContractorById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedContractor = action.payload;
      })
      .addCase(fetchContractorById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Search contractors
    builder
      .addCase(searchContractors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchContractors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.filteredContractors = action.payload.contractors;
      })
      .addCase(searchContractors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setSearchQuery,
  clearSearchQuery,
  setSelectedContractor,
  setCurrentPage,
  clearError,
  applyLocalFilters,
} = contractorSlice.actions;

export default contractorSlice.reducer;