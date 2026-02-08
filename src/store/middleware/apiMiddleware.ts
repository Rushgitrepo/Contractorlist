import { Middleware, AnyAction } from '@reduxjs/toolkit';

// API middleware for handling request logging only (no token injection)
export const apiMiddleware: Middleware = (_store) => (next) => (action: AnyAction) => {
  // Log API calls in development
  if (process.env.NODE_ENV === 'development' && action.type && action.type.includes('pending')) {
    console.log(`🚀 API Call: ${action.type}`, action.meta?.arg);
  }

  return next(action);
};