import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Base selector
const selectUIState = (state: RootState) => state.ui;

// Navigation selectors
export const selectIsMobileMenuOpen = createSelector(
  [selectUIState],
  (ui) => ui.isMobileMenuOpen
);

export const selectActiveDropdown = createSelector(
  [selectUIState],
  (ui) => ui.activeDropdown
);

// Modal selectors
export const selectIsLoginModalOpen = createSelector(
  [selectUIState],
  (ui) => ui.isLoginModalOpen
);

export const selectIsSignupModalOpen = createSelector(
  [selectUIState],
  (ui) => ui.isSignupModalOpen
);

export const selectAnyModalOpen = createSelector(
  [selectIsLoginModalOpen, selectIsSignupModalOpen],
  (loginOpen, signupOpen) => loginOpen || signupOpen
);

// Loading selectors
export const selectIsPageLoading = createSelector(
  [selectUIState],
  (ui) => ui.isPageLoading
);

// Notification selectors
export const selectNotifications = createSelector(
  [selectUIState],
  (ui) => ui.notifications
);

export const selectNotificationCount = createSelector(
  [selectNotifications],
  (notifications) => notifications.length
);

export const selectLatestNotification = createSelector(
  [selectNotifications],
  (notifications) => notifications[notifications.length - 1] || null
);

export const selectNotificationsByType = createSelector(
  [selectNotifications, (_, type: string) => type],
  (notifications, type) => 
    notifications.filter(notification => notification.type === type)
);

// Theme selectors
export const selectTheme = createSelector(
  [selectUIState],
  (ui) => ui.theme
);

export const selectIsDarkMode = createSelector(
  [selectTheme],
  (theme) => theme === 'dark'
);

// Sidebar selectors
export const selectIsSidebarOpen = createSelector(
  [selectUIState],
  (ui) => ui.isSidebarOpen
);

// Complex UI state selectors
export const selectUILoadingState = createSelector(
  [selectIsPageLoading],
  (isPageLoading) => ({
    isPageLoading,
  })
);

export const selectNavigationState = createSelector(
  [selectIsMobileMenuOpen, selectActiveDropdown, selectIsSidebarOpen],
  (isMobileMenuOpen, activeDropdown, isSidebarOpen) => ({
    isMobileMenuOpen,
    activeDropdown,
    isSidebarOpen,
    hasActiveDropdown: !!activeDropdown,
  })
);

export const selectModalState = createSelector(
  [selectIsLoginModalOpen, selectIsSignupModalOpen],
  (isLoginModalOpen, isSignupModalOpen) => ({
    isLoginModalOpen,
    isSignupModalOpen,
    anyModalOpen: isLoginModalOpen || isSignupModalOpen,
  })
);