import * as gcAPI from '@/api/gcDashboardService';
import mockAPI from './gc-dashboard-api';

/**
 * GC Dashboard Service
 * Provides a unified interface for GC Dashboard data, 
 * handling fallback to mock data when backend is unavailable.
 */

const USE_MOCK_API = import.meta.env.DEV || !import.meta.env.VITE_API_URL;

export type { Project, DashboardStats, RecentProject } from '@/api/gcDashboardService';

// Re-export types from API if needed, or define compatible ones

/**
 * Get Dashboard Overview
 */
export const getDashboardOverview = async () => {
    if (USE_MOCK_API) {
        return mockAPI.getOverview().data;
    }
    try {
        return await gcAPI.getDashboardOverview();
    } catch (error) {
        console.warn('API Error, falling back to mock:', error);
        return mockAPI.getOverview().data;
    }
};

/**
 * Get All Projects
 */
export const getProjects = async () => {
    if (USE_MOCK_API) {
        return mockAPI.getProjects().data;
    }
    try {
        return await gcAPI.getProjects();
    } catch (error) {
        console.warn('API Error, falling back to mock:', error);
        return mockAPI.getProjects().data;
    }
};

/**
 * Create New Project
 */
export const createProject = async (projectData: any) => {
    if (USE_MOCK_API) {
        return mockAPI.createProject(projectData).data;
    }
    try {
        return await gcAPI.createProject(projectData);
    } catch (error) {
        console.warn('API Error, falling back to mock:', error);
        return mockAPI.createProject(projectData).data;
    }
};

/**
 * Update Project
 */
export const updateProject = async (id: number, projectData: any) => {
    if (USE_MOCK_API) {
        return mockAPI.updateProject(id, projectData).data;
    }
    try {
        return await gcAPI.updateProject(id, projectData);
    } catch (error) {
        console.warn('API Error, falling back to mock:', error);
        return mockAPI.updateProject(id, projectData).data;
    }
};

/**
 * Delete Project
 */
export const deleteProject = async (id: number) => {
    if (USE_MOCK_API) {
        mockAPI.deleteProject(id);
        return;
    }
    try {
        await gcAPI.deleteProject(id);
    } catch (error) {
        console.warn('API Error, falling back to mock:', error);
        mockAPI.deleteProject(id);
    }
};

/**
 * Get Recent Projects
 */
export const getRecentProjects = async (limit: number = 3) => {
    if (USE_MOCK_API) {
        return mockAPI.getRecentProjects(limit).data;
    }
    try {
        return await gcAPI.getRecentProjects(limit);
    } catch (error) {
        console.warn('API Error, falling back to mock:', error);
        return mockAPI.getRecentProjects(limit).data;
    }
};

/**
 * Initialize Fresh User Data
 */
export const initializeFreshUserData = async () => {
    if (USE_MOCK_API) {
        mockAPI.initializeFreshUser();
        return;
    }
    try {
        await gcAPI.initializeFreshUserData();
    } catch (error) {
        console.warn('API Error, falling back to mock:', error);
        mockAPI.initializeFreshUser();
    }
};

/**
 * Get Project Discovery List
 */
export const getProjectDiscovery = async (filters?: any) => {
    // Mock API doesn't have discovery, so we might return empty or mock
    if (USE_MOCK_API) {
        return []; // Or implement mock discovery
    }
    try {
        return await gcAPI.getProjectDiscovery(filters);
    } catch (error) {
        console.warn('API Error, falling back to mock (empty):', error);
        return [];
    }
};

/**
 * Submit Bid
 */
export const submitBid = async (projectId: number, bidData: any) => {
    if (USE_MOCK_API) {
        return mockAPI.submitBid(projectId, bidData).data;
    }
    try {
        return await gcAPI.submitBid(projectId, bidData);
    } catch (error) {
        console.warn('API Error, falling back to mock:', error);
        return mockAPI.submitBid(projectId, bidData).data;
    }
};

/**
 * Get Team Members
 */
export const getTeamMembers = async (projectId?: number) => {
    if (USE_MOCK_API) {
        return mockAPI.getTeamMembers(projectId).data;
    }
    try {
        return await gcAPI.getTeamMembers(projectId);
    } catch (error) {
        console.warn('API Error, falling back to mock:', error);
        return mockAPI.getTeamMembers(projectId).data;
    }
};

/**
 * Invite Team Member
 */
export const inviteTeamMember = async (projectId: number, memberData: any) => {
    if (USE_MOCK_API) {
        return mockAPI.inviteTeamMember(projectId, memberData).data;
    }
    try {
        return await gcAPI.inviteTeamMember(projectId, memberData);
    } catch (error) {
        console.warn('API Error, falling back to mock:', error);
        return mockAPI.inviteTeamMember(projectId, memberData).data;
    }
};

/**
 * Get Project Documents
 */
export const getProjectDocuments = async (projectId: number) => {
    if (USE_MOCK_API) {
        return mockAPI.getProjectDocuments(projectId).data;
    }
    try {
        return await gcAPI.getProjectDocuments(projectId);
    } catch (error) {
        console.warn('API Error, falling back to mock:', error);
        return mockAPI.getProjectDocuments(projectId).data;
    }
};

/**
 * Upload Document
 */
export const uploadDocument = async (projectId: number, file: File, category: string) => {
    if (USE_MOCK_API) {
        return mockAPI.uploadDocument(projectId, file, category).data;
    }
    try {
        return await gcAPI.uploadDocument(projectId, file, category);
    } catch (error) {
        console.warn('API Error, falling back to mock:', error);
        return mockAPI.uploadDocument(projectId, file, category).data;
    }
};

/**
 * Delete Document
 */
export const deleteDocument = async (documentId: number) => {
    if (USE_MOCK_API) {
        mockAPI.deleteDocument(documentId);
        return;
    }
    try {
        await gcAPI.deleteDocument(documentId);
    } catch (error) {
        console.warn('API Error, falling back to mock:', error);
        mockAPI.deleteDocument(documentId);
    }
};
