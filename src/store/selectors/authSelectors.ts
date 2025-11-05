import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Base selectors
const selectAuthState = (state: RootState) => state.auth;

// Memoized selectors
export const selectUser = createSelector(
  [selectAuthState],
  (auth) => auth.user
);

export const selectIsAuthenticated = createSelector(
  [selectAuthState],
  (auth) => auth.isAuthenticated
);

export const selectAuthLoading = createSelector(
  [selectAuthState],
  (auth) => auth.isLoading
);

export const selectAuthError = createSelector(
  [selectAuthState],
  (auth) => auth.error
);

export const selectUserRole = createSelector(
  [selectUser],
  (user) => user?.role
);

export const selectUserName = createSelector(
  [selectUser],
  (user) => user?.name
);

export const selectUserEmail = createSelector(
  [selectUser],
  (user) => user?.email
);

export const selectIsContractor = createSelector(
  [selectUserRole],
  (role) => role === 'contractor'
);

export const selectIsClient = createSelector(
  [selectUserRole],
  (role) => role === 'client'
);

export const selectIsAdmin = createSelector(
  [selectUserRole],
  (role) => role === 'admin'
);

// Complex selectors
export const selectAuthStatus = createSelector(
  [selectIsAuthenticated, selectAuthLoading, selectAuthError],
  (isAuthenticated, isLoading, error) => ({
    isAuthenticated,
    isLoading,
    hasError: !!error,
    error,
  })
);

export const selectUserProfile = createSelector(
  [selectUser],
  (user) => user ? {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
  } : null
);