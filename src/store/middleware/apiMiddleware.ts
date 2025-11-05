import { Middleware, AnyAction } from '@reduxjs/toolkit';

// API middleware for handling authentication and request logging
export const apiMiddleware: Middleware = (store) => (next) => (action: AnyAction) => {
  // Log API calls in development
  if (process.env.NODE_ENV === 'development' && action.type && action.type.includes('pending')) {
    console.log(`🚀 API Call: ${action.type}`, action.meta?.arg);
  }

  // Add auth token to async thunk meta if user is authenticated
  if (action.type && action.type.includes('pending') && action.meta?.requestId) {
    const state = store.getState();
    const token = state.auth.token;
    
    if (token && action.meta) {
      (action.meta as any).token = token;
    }
  }

  return next(action);
};