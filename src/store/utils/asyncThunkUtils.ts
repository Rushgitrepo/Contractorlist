import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiError } from '../types';

// Utility for creating async thunks with consistent error handling
export const createAppAsyncThunk = <Returned, ThunkArg = void>(
  typePrefix: string,
  payloadCreator: (
    arg: ThunkArg,
    thunkAPI: Parameters<Parameters<typeof createAsyncThunk>[1]>[1]
  ) => Promise<Returned>
) => {
  return createAsyncThunk<Returned, ThunkArg, { rejectValue: ApiError }>(
    typePrefix,
    async (arg, thunkAPI) => {
      try {
        return await payloadCreator(arg, thunkAPI);
      } catch (error: any) {
        const apiError: ApiError = {
          message: error.message || 'An unexpected error occurred',
          code: error.code || error.status || 'UNKNOWN_ERROR',
          details: error.details || error.response?.data,
        };
        return thunkAPI.rejectWithValue(apiError);
      }
    }
  );
};

// Utility for handling API responses
export const handleApiResponse = <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

// Utility for creating API calls with authentication
export const createAuthenticatedApiCall = (
  url: string,
  options: RequestInit = {},
  token?: string
): Promise<Response> => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
};

// Utility for retry logic
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (i === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }

  throw lastError!;
};

// Utility for timeout handling
export const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number = 10000
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    ),
  ]);
};