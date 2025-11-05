// Common types used across the Redux store

export interface ApiError {
  message: string;
  code?: string | number;
  details?: any;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface AsyncState<T = any> extends LoadingState {
  data: T | null;
  lastFetched?: number;
}

// Generic async thunk state
export interface AsyncThunkState {
  pending: boolean;
  fulfilled: boolean;
  rejected: boolean;
  error: string | null;
}

// API response wrapper
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  pagination?: PaginationState;
}

// Filter types
export interface BaseFilter {
  [key: string]: any;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

// Search state
export interface SearchState {
  query: string;
  results: any[];
  isSearching: boolean;
  hasSearched: boolean;
}

// Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationPayload {
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    handler: () => void;
  };
}