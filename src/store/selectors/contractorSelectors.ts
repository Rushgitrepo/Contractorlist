import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Base selectors
const selectContractorState = (state: RootState) => state.contractor;

// Basic selectors
export const selectContractors = createSelector(
  [selectContractorState],
  (contractor) => contractor.contractors
);

export const selectFilteredContractors = createSelector(
  [selectContractorState],
  (contractor) => contractor.filteredContractors
);

export const selectSelectedContractor = createSelector(
  [selectContractorState],
  (contractor) => contractor.selectedContractor
);

export const selectContractorFilters = createSelector(
  [selectContractorState],
  (contractor) => contractor.filters
);

export const selectSearchQuery = createSelector(
  [selectContractorState],
  (contractor) => contractor.searchQuery
);

export const selectContractorLoading = createSelector(
  [selectContractorState],
  (contractor) => contractor.isLoading
);

export const selectContractorError = createSelector(
  [selectContractorState],
  (contractor) => contractor.error
);

export const selectPagination = createSelector(
  [selectContractorState],
  (contractor) => contractor.pagination
);

// Complex selectors
export const selectContractorsBySpecialty = createSelector(
  [selectContractors, (_, specialty: string) => specialty],
  (contractors, specialty) => 
    contractors.filter(contractor => 
      contractor.specialties.includes(specialty)
    )
);

export const selectTopRatedContractors = createSelector(
  [selectContractors],
  (contractors) => 
    [...contractors]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10)
);

export const selectVerifiedContractors = createSelector(
  [selectContractors],
  (contractors) => 
    contractors.filter(contractor => contractor.verified)
);

export const selectContractorsByLocation = createSelector(
  [selectContractors, (_, city: string) => city],
  (contractors, city) => 
    contractors.filter(contractor => 
      contractor.location.city.toLowerCase() === city.toLowerCase()
    )
);

export const selectContractorStats = createSelector(
  [selectContractors],
  (contractors) => ({
    total: contractors.length,
    verified: contractors.filter(c => c.verified).length,
    averageRating: contractors.length > 0 
      ? contractors.reduce((sum, c) => sum + c.rating, 0) / contractors.length 
      : 0,
    specialties: [...new Set(contractors.flatMap(c => c.specialties))],
    locations: [...new Set(contractors.map(c => `${c.location.city}, ${c.location.state}`))],
  })
);

export const selectFilteredContractorCount = createSelector(
  [selectFilteredContractors],
  (contractors) => contractors.length
);

export const selectHasActiveFilters = createSelector(
  [selectContractorFilters, selectSearchQuery],
  (filters, searchQuery) => 
    Object.keys(filters).length > 0 || searchQuery.length > 0
);

export const selectPaginatedContractors = createSelector(
  [selectFilteredContractors, selectPagination],
  (contractors, pagination) => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return contractors.slice(startIndex, endIndex);
  }
);

export const selectContractorLoadingState = createSelector(
  [selectContractorLoading, selectContractorError],
  (isLoading, error) => ({
    isLoading,
    hasError: !!error,
    error,
  })
);