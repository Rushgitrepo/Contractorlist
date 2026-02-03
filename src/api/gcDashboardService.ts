import api from './api';

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
  status: 'Planning' | 'In Progress' | 'Bidding' | 'Completed';
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
  activeProjects: number;
  pendingBids: number;
  teamMembers: number;
  messages: number;
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
  return response.data;
};

/**
 * Get All Projects
 */
export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get('/gc-dashboard/projects');
  // Handle empty or null response gracefully if needed, but return data directly
  return response.data;
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
  return response.data;
};

/**
 * Update Project
 */
export const updateProject = async (id: number, projectData: Partial<Project>): Promise<Project> => {
  const response = await api.put(`/gc-dashboard/projects/${id}`, projectData);
  return response.data;
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
  return response.data;
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
  return response.data;
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
  return response.data;
};

/**
 * Get Team Members
 */
export const getTeamMembers = async (projectId?: number): Promise<any[]> => {
  const url = projectId
    ? `/gc-dashboard/team-members?projectId=${projectId}`
    : '/gc-dashboard/team-members';
  const response = await api.get(url);
  return response.data;
};

/**
 * Invite Team Member
 */
export const inviteTeamMember = async (projectId: number, memberData: {
  name: string;
  email: string;
  phone?: string;
  role: string;
}): Promise<any> => {
  const response = await api.post(`/gc-dashboard/projects/${projectId}/team/invite`, memberData);
  return response.data;
};

/**
 * Get Project Documents
 */
export const getProjectDocuments = async (projectId: number): Promise<any[]> => {
  const response = await api.get(`/gc-dashboard/projects/${projectId}/documents`);
  return response.data;
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
  return response.data;
};

/**
 * Delete Document
 */
export const deleteDocument = async (documentId: number): Promise<void> => {
  await api.delete(`/gc-dashboard/documents/${documentId}`);
};
