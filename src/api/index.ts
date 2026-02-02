/**
 * Central export for all services
 * Import services like: import { authService, contractorService } from '@/api'
 */

export { default as api } from './api';
export { default as authService } from './authService';
export { default as contractorService } from './contractorService';
export { default as companyService } from './companyService';
export { getDashboardOverview, getProjects, getRecentProjects, getProjectDiscovery, submitBid, getTeamMembers, inviteTeamMember, getProjectDocuments, uploadDocument, deleteDocument } from './gcDashboardService';

// Re-export types for convenience
export type * from '@/types/auth.types';
export type * from '@/types/contractor.types';
export type * from '@/types/api.types';
