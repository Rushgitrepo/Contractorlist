import * as gcAPI from './backend';

/**
 * GC Dashboard Service
 * Provides a unified interface for GC Dashboard data.
 * All functions now strictly use the real backend API.
 */

export type { Project, DashboardStats, RecentProject } from './backend';

/**
 * Get Dashboard Overview
 */
export const getDashboardOverview = async () => {
    return await gcAPI.getDashboardOverview();
};

/**
 * Get All Projects
 */
export const getProjects = async (params?: any) => {
    return await gcAPI.getProjects(params);
};

/**
 * Create New Project
 */
export const createProject = async (projectData: any) => {
    return await gcAPI.createProject(projectData);
};

/**
 * Bulk Upload Projects
 */
export const bulkUploadProjects = async (file: File) => {
    return await gcAPI.bulkUploadProjects(file);
};

/**
 * Update Project
 */
export const updateProject = async (id: number, projectData: any) => {
    return await gcAPI.updateProject(id, projectData);
};

/**
 * Delete Project
 */
export const deleteProject = async (id: number) => {
    await gcAPI.deleteProject(id);
};

/**
 * Get Recent Projects
 */
export const getRecentProjects = async (limit: number = 3) => {
    return await gcAPI.getRecentProjects(limit);
};

/**
 * Initialize Fresh User Data
 */
export const initializeFreshUserData = async () => {
    await gcAPI.initializeFreshUserData();
};

/**
 * Get Project Discovery List
 */
export const getProjectDiscovery = async (filters?: any) => {
    return await gcAPI.getProjectDiscovery(filters);
};

/**
 * Submit Bid
 */
export const submitBid = async (projectId: number, bidData: any) => {
    return await gcAPI.submitBid(projectId, bidData);
};

/**
 * Get Team Members
 */
export const getTeamMembers = async (projectId?: number) => {
    return await gcAPI.getTeamMembers(projectId);
};

/**
 * Invite Team Member
 */
export const inviteTeamMember = async (projectId: number, memberData: any) => {
    return await gcAPI.inviteTeamMember(projectId, memberData);
};

/**
 * Create Team Member (Global)
 */
export const createTeamMember = async (memberData: any) => {
    return await gcAPI.createTeamMember(memberData);
};

/**
 * Assign Team Member to Project
 */
export const assignTeamMember = async (projectId: number, teamMemberId: number, role: string) => {
    return await gcAPI.assignTeamMember(projectId, teamMemberId, role);
};

/**
 * Get Project Documents
 */
export const getProjectDocuments = async (projectId: number) => {
    return await gcAPI.getProjectDocuments(projectId);
};

/**
 * Upload Document
 */
export const uploadDocument = async (projectId: number, file: File, category: string) => {
    return await gcAPI.uploadDocument(projectId, file, category);
};

/**
 * Delete Document
 */
export const deleteDocument = async (documentId: number) => {
    await gcAPI.deleteDocument(documentId);
};

export const getProjectById = async (id: number) => {
    return await gcAPI.getProjectById(id);
};

export const getTeamMemberById = async (id: number) => {
    return await gcAPI.getTeamMemberById(id);
};

export const updateTeamMember = async (id: number, memberData: any) => {
    return await gcAPI.updateTeamMember(id, memberData);
};

export const deleteTeamMember = async (id: number) => {
    await gcAPI.deleteTeamMember(id);
};

export const removeTeamMemberFromProject = async (projectId: number, teamMemberId: number) => {
    await gcAPI.removeTeamMemberFromProject(projectId, teamMemberId);
};

export const downloadDocument = async (documentId: number) => {
    return await gcAPI.downloadDocument(documentId);
};

export const viewDocument = async (documentId: number) => {
    return await gcAPI.viewDocument(documentId);
};

export const updateDocument = async (documentId: number, data: any) => {
    return await gcAPI.updateDocument(documentId, data);
};

// Renamed from getBids to match backend.ts
export const getSentInvitations = async () => {
    return await gcAPI.getSentInvitations();
};

// NEW BID MANAGEMENT EXPORTS
export const getMyBids = async () => {
    return await gcAPI.getMyBids();
};

export const getBidDetail = async (bidId: string) => {
    return await gcAPI.getBidDetail(bidId);
};

export const createBid = async (data: any) => {
    return await gcAPI.createBid(data);
};

export const updateBidItems = async (bidId: string, items: any) => {
    return await gcAPI.updateBidItems(bidId, items);
};

export const finalizeBidSubmission = async (bidId: string) => {
    return await gcAPI.finalizeBidSubmission(bidId);
};

export const withdrawBid = async (bidId: string) => {
    return await gcAPI.withdrawBid(bidId);
};

export const sendTeamMemberReminder = async (teamMemberId: number) => {
    await gcAPI.sendTeamMemberReminder(teamMemberId);
};

export const getProjectTeamMembers = async (projectId: number) => {
    return await gcAPI.getProjectTeamMembers(projectId);
};
export const getMyPendingInvitations = async () => {
    return await gcAPI.getMyPendingInvitations();
};

export const verifyInvitation = async (token: string) => {
    return await gcAPI.verifyInvitation(token);
};

export const acceptInvitationAction = async (token: string) => {
    return await gcAPI.acceptInvitationAction(token);
};

export const declineInvitationAction = async (token: string) => {
    return await gcAPI.declineInvitationAction(token);
};
