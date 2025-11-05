// Example component showing how to use the enhanced Redux setup
import React from 'react';
import { 
  useAppDispatch, 
  useAppSelector, 
  useAppThunk,
  useMemoizedSelector,
  AppThunk
} from '../hooks';
import {
  selectUser,
  selectIsAuthenticated,
  selectContractorStats,
  selectNotifications,
  selectChatbotStatus,
} from '../selectors';
import { loginUser, clearAuthErrors } from '../slices/authSlice';
import { addNotification } from '../slices/uiSlice';

// Example: Enhanced component with better Redux patterns
export const EnhancedDashboardExample: React.FC = () => {
  const dispatch = useAppDispatch();
  const dispatchThunk = useAppThunk();

  // Using efficient selectors
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const notifications = useAppSelector(selectNotifications);
  
  // Using memoized selector with dependencies
  const contractorStats = useMemoizedSelector(
    selectContractorStats,
    [user?.role] // Only recalculate when user role changes
  );

  // Using complex selector
  const chatbotStatus = useAppSelector(selectChatbotStatus);

  // Example: Enhanced login handler with better error handling
  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      // Clear any previous errors
      dispatch(clearAuthErrors());
      
      // Dispatch login thunk
      const result = await dispatch(loginUser(credentials) as any);
      
      if (loginUser.fulfilled.match(result)) {
        // Success - middleware will show success notification
        console.log('Login successful:', result.payload.user);
      } else if (loginUser.rejected.match(result)) {
        // Error - middleware will show error notification
        console.error('Login failed:', result.payload);
      }
    } catch (error) {
      // Fallback error handling
      dispatch(addNotification({
        type: 'error',
        title: 'Login Error',
        message: 'An unexpected error occurred during login',
        duration: 5000,
      }));
    }
  };

  // Example: Using thunk dispatcher
  const handleQuickAction = () => {
    const thunk: AppThunk = (dispatch, getState) => {
      const state = getState();
      const currentUser = selectUser(state);
      
      if (currentUser) {
        dispatch(addNotification({
          type: 'info',
          title: 'Quick Action',
          message: `Hello ${currentUser.name}!`,
          duration: 3000,
        }));
      }
    };
    
    dispatchThunk(thunk);
  };

  return (
    <div className="enhanced-dashboard">
      <h2>Enhanced Redux Usage Example</h2>
      
      {/* User Info */}
      {isAuthenticated && user && (
        <div className="user-info">
          <h3>Welcome, {user.name}!</h3>
          <p>Role: {user.role}</p>
          <p>Theme: {user.preferences?.theme}</p>
        </div>
      )}

      {/* Contractor Stats */}
      {user?.role === 'admin' && (
        <div className="contractor-stats">
          <h3>Contractor Statistics</h3>
          <p>Total: {contractorStats.total}</p>
          <p>Verified: {contractorStats.verified}</p>
          <p>Average Rating: {contractorStats.averageRating.toFixed(1)}</p>
        </div>
      )}

      {/* Chatbot Status */}
      <div className="chatbot-status">
        <h3>Chatbot Status</h3>
        <p>Active: {chatbotStatus.isActive ? 'Yes' : 'No'}</p>
        <p>Typing: {chatbotStatus.isTyping ? 'Yes' : 'No'}</p>
        {chatbotStatus.hasError && (
          <p className="error">Error: {chatbotStatus.error}</p>
        )}
      </div>

      {/* Notifications */}
      <div className="notifications">
        <h3>Notifications ({notifications.length})</h3>
        {notifications.map(notification => (
          <div key={notification.id} className={`notification ${notification.type}`}>
            <strong>{notification.title}</strong>: {notification.message}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="actions">
        <button onClick={handleQuickAction}>
          Quick Action (Thunk Example)
        </button>
        
        {!isAuthenticated && (
          <button onClick={() => handleLogin({ email: 'test@example.com', password: 'password' })}>
            Test Login
          </button>
        )}
      </div>
    </div>
  );
};

// Example: Custom hook using enhanced selectors
export const useAuthStatus = () => {
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  
  return useMemoizedSelector(
    (state) => ({
      user: selectUser(state),
      isAuthenticated: selectIsAuthenticated(state),
      isContractor: user?.role === 'contractor',
      isClient: user?.role === 'client',
      isAdmin: user?.role === 'admin',
      hasPreferences: !!user?.preferences,
    }),
    [user?.id, user?.role] // Only recalculate when user ID or role changes
  );
};

// Example: Custom hook for contractor operations
export const useContractorOperations = () => {
  const dispatch = useAppDispatch();
  
  return {
    // Enhanced operations with better error handling
    searchContractors: (query: string) => {
      // Implementation would use the enhanced async thunk utilities
    },
    
    filterContractors: (filters: any) => {
      // Implementation would use efficient selectors
    },
    
    // More operations...
  };
};