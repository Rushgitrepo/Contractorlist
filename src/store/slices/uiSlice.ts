import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  // Navigation
  isMobileMenuOpen: boolean;
  activeDropdown: string | null;
  
  // Modals
  isLoginModalOpen: boolean;
  isSignupModalOpen: boolean;
  
  // Loading states
  isPageLoading: boolean;
  
  // Notifications
  notifications: Notification[];
  
  // Theme
  theme: 'light' | 'dark';
  
  // Sidebar
  isSidebarOpen: boolean;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

const initialState: UIState = {
  isMobileMenuOpen: false,
  activeDropdown: null,
  isLoginModalOpen: false,
  isSignupModalOpen: false,
  isPageLoading: false,
  notifications: [],
  theme: 'light',
  isSidebarOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Navigation
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.isMobileMenuOpen = false;
    },
    setActiveDropdown: (state, action: PayloadAction<string | null>) => {
      state.activeDropdown = action.payload;
    },
    
    // Modals
    openLoginModal: (state) => {
      state.isLoginModalOpen = true;
      state.isSignupModalOpen = false;
    },
    closeLoginModal: (state) => {
      state.isLoginModalOpen = false;
    },
    openSignupModal: (state) => {
      state.isSignupModalOpen = true;
      state.isLoginModalOpen = false;
    },
    closeSignupModal: (state) => {
      state.isSignupModalOpen = false;
    },
    
    // Loading
    setPageLoading: (state, action: PayloadAction<boolean>) => {
      state.isPageLoading = action.payload;
    },
    
    // Notifications
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    // Theme
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    
    // Sidebar
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    closeSidebar: (state) => {
      state.isSidebarOpen = false;
    },
  },
});

export const {
  toggleMobileMenu,
  closeMobileMenu,
  setActiveDropdown,
  openLoginModal,
  closeLoginModal,
  openSignupModal,
  closeSignupModal,
  setPageLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  toggleTheme,
  setTheme,
  toggleSidebar,
  closeSidebar,
} = uiSlice.actions;

export default uiSlice.reducer;