import api from '../api';

/**
 * GC Dashboard API Service
 * Handles all backend API calls for General Contractor Dashboard
 * This file contains ONLY API calls.
 */

export interface Project {
  id: number;
  name: string;
  location: string;
  jobNumber: string;
  client: string;
  status: 'Planning' | 'Bidding' | 'Active' | 'Completed' | 'On Hold';
  statusColor: 'green' | 'yellow' | 'blue';
  timeline: { current: number; total: number; percentage: number };
  budget: {
    spent?: number;
    total?: number;
    estimated?: number;
    percentage: number;
    variance?: string
  };
  completion: string;
  teamSize: number;
  bidStatus: 'Pending' | 'Awarded' | 'Rejected';
  documents: number;
  rfiCount: number;
  changeOrders: number;
  milestones: { completed: number; total: number };
}

export interface DashboardStats {
  activeProjectsCount: number;
  pendingBidsCount: number;
  teamMembersCount: number;
  totalBudget: number;
}

export interface RecentProject {
  name: string;
  location: string;
  progress: number;
  status: string;
  budget: string;
  completion: string;
  client: string;
}

/**
 * Get Dashboard Overview Stats
 */
export const getDashboardOverview = async (): Promise<DashboardStats> => {
  const response = await api.get('/gc-dashboard/overview');
  return response.data.data;
};

/**
 * Get All Projects
 */
export const getProjects = async (params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<Project[]> => {
  const response = await api.get('/gc-dashboard/projects', { params });
  return response.data.data;
};

/**
 * Get Single Project
 */
export const getProjectById = async (id: number): Promise<Project> => {
  const response = await api.get(`/gc-dashboard/projects/${id}`);
  return response.data.data;
};

/**
 * Create New Project
 */
export const createProject = async (projectData: {
  name: string;
  location: string;
  client: string;
  budget: number;
  duration: number;
  status: string;
  description?: string;
}): Promise<Project> => {
  const response = await api.post('/gc-dashboard/projects', projectData);
  return response.data.data;
};

/**
 * Update Project
 */
export const updateProject = async (id: number, projectData: Partial<Project>): Promise<Project> => {
  const response = await api.put(`/gc-dashboard/projects/${id}`, projectData);
  return response.data.data;
};

/**
 * Delete Project
 */
export const deleteProject = async (id: number): Promise<void> => {
  await api.delete(`/gc-dashboard/projects/${id}`);
};

/**
 * Get Recent Projects
 */
export const getRecentProjects = async (limit: number = 3): Promise<RecentProject[]> => {
  // Pass limit as query param
  const response = await api.get(`/gc-dashboard/recent-projects?limit=${limit}`);
  return response.data.data;
};

/**
 * Initialize Fresh User Data
 */
export const initializeFreshUserData = async (): Promise<void> => {
  await api.post('/gc-dashboard/initialize-fresh-user');
};

/**
 * Get Project Discovery List
 */
export const getProjectDiscovery = async (filters?: {
  location?: string;
  type?: string;
  budgetRange?: string;
}): Promise<any[]> => {
  const response = await api.get('/gc-dashboard/project-discovery', { params: filters });
  return response.data.data;
};

/**
 * Submit Bid
 */
export const submitBid = async (projectId: number, bidData: {
  amount: number;
  duration: number;
  proposal: string;
}): Promise<any> => {
  const response = await api.post(`/gc-dashboard/projects/${projectId}/bids`, bidData);
  return response.data.data;
};

/**
 * Get Team Members
 */
export const getTeamMembers = async (projectId?: number): Promise<any[]> => {
  const url = projectId
    ? `/gc-dashboard/team-members?projectId=${projectId}`
    : '/gc-dashboard/team-members';
  const response = await api.get(url);
  return response.data.data;
};

/**
 * Create Team Member (Global)
 */
export const createTeamMember = async (memberData: {
  name: string;
  email?: string;
  phone?: string;
  role: string;
  employee_id?: string;
  type: 'Direct Employee' | 'Contractor';
  status?: string;
}): Promise<any> => {
  const response = await api.post('/gc-dashboard/team-members', memberData);
  return response.data.data;
};

/**
 * Get Single Team Member
 */
export const getTeamMemberById = async (id: number): Promise<any> => {
  const response = await api.get(`/gc-dashboard/team-members/${id}`);
  return response.data.data;
};

/**
 * Update Team Member
 */
export const updateTeamMember = async (id: number, memberData: any): Promise<any> => {
  const response = await api.put(`/gc-dashboard/team-members/${id}`, memberData);
  return response.data.data;
};

/**
 * Delete Team Member
 */
export const deleteTeamMember = async (id: number): Promise<void> => {
  await api.delete(`/gc-dashboard/team-members/${id}`);
};

/**
 * Invite Team Member (to Project)
 */
export const inviteTeamMember = async (projectId: number, memberData: {
  name: string;
  email: string;
  phone?: string;
  role: string;
}): Promise<any> => {
  const response = await api.post(`/gc-dashboard/projects/${projectId}/invite-team`, memberData);
  return response.data.data;
};

/**
 * Assign Team Member to Project
 */
export const assignTeamMember = async (projectId: number, teamMemberId: number, role: string = 'Member'): Promise<any> => {
  const response = await api.post(`/gc-dashboard/projects/${projectId}/team`, { teamMemberId, role });
  return response.data.data;
};

/**
 * Remove Team Member from Project
 */
export const removeTeamMemberFromProject = async (projectId: number, teamMemberId: number): Promise<void> => {
  await api.delete(`/gc-dashboard/projects/${projectId}/team/${teamMemberId}`);
};

/**
 * Get Team Members Assigned to Project
 */
export const getProjectTeamMembers = async (projectId: number): Promise<any[]> => {
  const response = await api.get(`/gc-dashboard/projects/${projectId}/team`);
  return response.data.data;
};

/**
 * Send Reminder Email to Team Member
 */
export const sendTeamMemberReminder = async (teamMemberId: number): Promise<void> => {
  await api.post(`/gc-dashboard/team-members/${teamMemberId}/send-reminder`);
};

/**
 * Get Project Documents
 */
export const getProjectDocuments = async (projectId: number, category?: string): Promise<any[]> => {
  const response = await api.get(`/gc-dashboard/projects/${projectId}/documents`, { params: { category } });
  return response.data.data;
};

/**
 * Upload Document
 */
export const uploadDocument = async (projectId: number, file: File, category: string): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('category', category);

  const response = await api.post(`/gc-dashboard/projects/${projectId}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};

/**
 * Download Document
 */
export const downloadDocument = async (documentId: number): Promise<Blob> => {
  const response = await api.get(`/gc-dashboard/documents/${documentId}/download`, {
    responseType: 'blob'
  });
  return response.data;
};

/**
 * View Document
 */
export const viewDocument = async (documentId: number): Promise<Blob> => {
  const response = await api.get(`/gc-dashboard/documents/${documentId}/view`, {
    responseType: 'blob'
  });
  return response.data;
};

/**
 * Update Document
 */
export const updateDocument = async (documentId: number, data: any): Promise<any> => {
  const response = await api.put(`/gc-dashboard/documents/${documentId}`, data);
  return response.data.data;
};

/**
 * Delete Document
 */
export const deleteDocument = async (documentId: number): Promise<void> => {
  await api.delete(`/gc-dashboard/documents/${documentId}`);
};

/**
 * Get All Bids
 */
export const getBids = async (): Promise<any[]> => {
  const response = await api.get('/gc-dashboard/bids');
  return response.data.data;
};
