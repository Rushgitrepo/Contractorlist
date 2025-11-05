import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { useCallback, useMemo } from 'react';
import type { RootState, AppDispatch } from './index';
import { AnyAction, ThunkAction } from '@reduxjs/toolkit';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Define AppThunk type
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;

// Enhanced hook for dispatching thunks
export const useAppThunk = () => {
  const dispatch = useAppDispatch();
  return useCallback(
    (thunk: AppThunk) => dispatch(thunk as any),
    [dispatch]
  );
};

// Hook for selecting multiple values efficiently
export const useAppSelectors = <T>(
  selectors: ((state: RootState) => any)[]
): T => {
  return useAppSelector(
    useMemo(
      () => (state: RootState) =>
        selectors.reduce((acc, selector, index) => {
          acc[index] = selector(state);
          return acc;
        }, {} as any),
      [selectors]
    )
  ) as T;
};

// Hook for conditional selector (only runs when condition is true)
export const useConditionalSelector = <T>(
  selector: (state: RootState) => T,
  condition: boolean,
  fallback?: T
): T => {
  return useAppSelector(
    useMemo(
      () => (state: RootState) => (condition ? selector(state) : fallback),
      [selector, condition, fallback]
    )
  ) as T;
};

// Hook for memoized selector with dependencies
export const useMemoizedSelector = <T, D extends readonly unknown[]>(
  selector: (state: RootState) => T,
  deps: D
): T => {
  return useAppSelector(
    useMemo(() => selector, deps)
  );
};