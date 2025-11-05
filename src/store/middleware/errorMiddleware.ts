import { Middleware, AnyAction } from '@reduxjs/toolkit';
import { addNotification } from '../slices/uiSlice';

// Error handling middleware
export const errorMiddleware: Middleware = (store) => (next) => (action: AnyAction) => {
  // Handle rejected async thunks
  if (action.type && action.type.endsWith('/rejected')) {
    const errorMessage = action.payload?.message || action.payload || action.error?.message || 'An error occurred';
    
    // Add error notification to UI
    store.dispatch(addNotification({
      type: 'error',
      title: 'Error',
      message: typeof errorMessage === 'string' ? errorMessage : 'An error occurred',
      duration: 5000,
    }));
  }

  // Handle fulfilled async thunks for success notifications
  if (action.type && action.type.endsWith('/fulfilled')) {
    const successMessages: Record<string, string> = {
      'auth/loginUser/fulfilled': 'Successfully logged in!',
      'auth/registerUser/fulfilled': 'Account created successfully!',
      'auth/logoutUser/fulfilled': 'Successfully logged out!',
    };

    const message = successMessages[action.type];
    if (message) {
      store.dispatch(addNotification({
        type: 'success',
        title: 'Success',
        message,
        duration: 3000,
      }));
    }
  }

  return next(action);
};