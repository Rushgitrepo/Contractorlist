import { RootState } from '../index';

/**
 * UI Selectors
 * Reusable selectors for accessing UI state
 * 
 * Note: Theme is managed via localStorage (not Redux).
 * Use the useTheme() hook instead.
 */

// Notification selectors
export const selectNotifications = (state: RootState) => state.ui.notifications;
export const selectUnreadNotificationCount = (state: RootState) =>
  state.ui.notifications ? state.ui.notifications.length : 0;


// Modal selectors
export const selectIsMobileMenuOpen = (state: RootState) => state.ui.isMobileMenuOpen;
export const selectActiveDropdown = (state: RootState) => state.ui.activeDropdown;