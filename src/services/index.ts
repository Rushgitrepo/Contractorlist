/**
 * Central export for all non-API services
 * Logic not directly making backend calls (e.g. localStorage persistence)
 */

export { scDashboardService } from './scDashboardService';
export { default as gcMockAPI } from './gc-dashboard-api';
