/**
 * Theme Management Utility
 * Handles theme persistence and application using localStorage
 * This is the recommended approach for production apps
 * 
 * Strategy:
 * - Public pages (landing, login, etc.) always use light theme
 * - Dashboard pages use user's saved preference
 * - User's dashboard theme preference is preserved in 'dashboardTheme' key
 */

export type Theme = 'light' | 'dark' | 'system';

const THEME_STORAGE_KEY = 'theme';
const DASHBOARD_THEME_KEY = 'dashboardTheme';

/**
 * Get the current theme from localStorage
 * Falls back to 'light' if not set
 */
export const getStoredTheme = (): Theme => {
    try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
            return stored;
        }
    } catch (error) {
        console.error('Error reading theme from localStorage:', error);
    }
    return 'light';
};

/**
 * Save theme to localStorage
 */
export const setStoredTheme = (theme: Theme): void => {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
        console.error('Error saving theme to localStorage:', error);
    }
};

/**
 * Get the system preference (light or dark)
 */
export const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';

    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
};

/**
 * Resolve the actual theme to apply
 * If theme is 'system', returns the system preference
 */
export const resolveTheme = (theme: Theme): 'light' | 'dark' => {
    if (theme === 'system') {
        return getSystemTheme();
    }
    return theme;
};

/**
 * Apply theme to the document
 * This should be called on app initialization and theme changes
 */
export const applyTheme = (theme: Theme): void => {
    const resolved = resolveTheme(theme);

    if (resolved === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};

/**
 * Initialize theme on app load
 * Call this as early as possible to prevent flash
 */
export const initializeTheme = (): Theme => {
    const storedTheme = getStoredTheme();
    applyTheme(storedTheme);
    return storedTheme;
};

/**
 * Change theme and persist to localStorage
 */
export const changeTheme = (theme: Theme): void => {
    setStoredTheme(theme);
    applyTheme(theme);
};

/**
 * Toggle between light and dark
 * If current theme is 'system', switches to the opposite of system preference
 */
export const toggleTheme = (): Theme => {
    const current = getStoredTheme();
    const resolved = resolveTheme(current);
    const newTheme: Theme = resolved === 'dark' ? 'light' : 'dark';

    changeTheme(newTheme);
    return newTheme;
};

/**
 * Listen for system theme changes
 * Useful if theme is set to 'system'
 */
export const watchSystemTheme = (callback: (theme: 'light' | 'dark') => void): (() => void) => {
    if (typeof window === 'undefined') return () => { };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handler = (e: MediaQueryListEvent) => {
        const currentTheme = getStoredTheme();
        if (currentTheme === 'system') {
            const newTheme = e.matches ? 'dark' : 'light';
            applyTheme('system'); // Re-apply to update
            callback(newTheme);
        }
    };


    mediaQuery.addEventListener('change', handler);

    // Return cleanup function
    return () => mediaQuery.removeEventListener('change', handler);
};

/**
 * Dashboard-specific theme management
 */

/**
 * Get the user's saved dashboard theme preference
 * Falls back to 'light' if not set
 */
export const getDashboardTheme = (): Theme => {
    try {
        const stored = localStorage.getItem(DASHBOARD_THEME_KEY);
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
            return stored;
        }
    } catch (error) {
        console.error('Error reading dashboard theme from localStorage:', error);
    }
    return 'light';
};

/**
 * Save user's dashboard theme preference
 */
export const setDashboardTheme = (theme: Theme): void => {
    try {
        localStorage.setItem(DASHBOARD_THEME_KEY, theme);
    } catch (error) {
        console.error('Error saving dashboard theme to localStorage:', error);
    }
};

/**
 * Check if the current path is a dashboard route
 */
export const isDashboardRoute = (pathname: string): boolean => {
    const dashboardPaths = [
        '/gc-dashboard',
        '/subcontractor-dashboard',
        '/supplier-dashboard',
        '/homeowner-dashboard',
        '/project-management',
        '/settings',
        '/subscription'
    ];

    return dashboardPaths.some(path => pathname.startsWith(path));
};

/**
 * Apply theme based on route context
 * - Dashboard routes: Use user's saved dashboard theme
 * - Public routes: Always use light theme
 */
export const applyRouteBasedTheme = (pathname: string): void => {
    if (isDashboardRoute(pathname)) {
        // Apply user's dashboard theme preference
        const dashboardTheme = getDashboardTheme();
        changeTheme(dashboardTheme);
    } else {
        // Force light theme for public pages
        changeTheme('light');
    }
};

/**
 * Change dashboard theme and persist it
 * Should only be called from dashboard pages
 */
export const changeDashboardTheme = (theme: Theme): void => {
    setDashboardTheme(theme);
    changeTheme(theme);
};
