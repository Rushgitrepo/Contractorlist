import api from './api';
import mockAPI from '@/api/gc-dashboard-api';

/**
 * GC Dashboard API Service
 * Handles all API calls for General Contractor Dashboard
 * Falls back to mock API if backend is not available
 */

const USE_MOCK_API = import.meta.env.DEV || !import.meta.env.VITE_API_URL;

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
  if (USE_MOCK_API) {
    const result = mockAPI.getOverview();
    return result.data;
  }

  try {
    const response = await api.get('/gc-dashboard/overview');
    return response.data;
  } catch (error) {
    // Fallback to mock API
    const result = mockAPI.getOverview();
    return result.data;
  }
};

/**
 * Get All Projects
 */
export const getProjects = async (): Promise<Project[]> => {
  if (USE_MOCK_API) {
    const result = mockAPI.getProjects();
    return result.data;
  }

  try {
    const response = await api.get('/gc-dashboard/projects');
    return response.data;
  } catch (error) {
    // Fallback to mock API
    const result = mockAPI.getProjects();
    return result.data;
  }
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
  if (USE_MOCK_API) {
    const result = mockAPI.createProject(projectData);
    return result.data;
  }

  try {
    const response = await api.post('/gc-dashboard/projects', projectData);
    return response.data;
  } catch (error) {
    // Fallback to mock API
    const result = mockAPI.createProject(projectData);
    return result.data;
  }
};

/**
 * Update Project
 */
export const updateProject = async (id: number, projectData: Partial<Project>): Promise<Project> => {
  if (USE_MOCK_API) {
    const result = mockAPI.updateProject(id, projectData);
    return result.data;
  }

  try {
    const response = await api.put(`/gc-dashboard/projects/${id}`, projectData);
    return response.data;
  } catch (error) {
    const result = mockAPI.updateProject(id, projectData);
    return result.data;
  }
};

/**
 * Delete Project
 */
export const deleteProject = async (id: number): Promise<void> => {
  if (USE_MOCK_API) {
    mockAPI.deleteProject(id);
    return;
  }

  try {
    await api.delete(`/gc-dashboard/projects/${id}`);
  } catch (error) {
    mockAPI.deleteProject(id);
  }
};

/**
 * Get Recent Projects
 */
export const getRecentProjects = async (limit: number = 3): Promise<RecentProject[]> => {
  if (USE_MOCK_API) {
    const result = mockAPI.getRecentProjects(limit);
    return result.data;
  }

  try {
    const response = await api.get(`/gc-dashboard/recent-projects?limit=${limit}`);
    return response.data;
  } catch (error) {
    // Fallback to mock API
    const result = mockAPI.getRecentProjects(limit);
    return result.data;
  }
};

/**
 * Initialize Fresh User Data
 * Creates initial sample data for new users
 */
export const initializeFreshUserData = async (): Promise<void> => {
  if (USE_MOCK_API) {
    mockAPI.initializeFreshUser();
    return;
  }

  try {
    await api.post('/gc-dashboard/initialize-fresh-user');
  } catch (error) {
    // Fallback to mock API
    mockAPI.initializeFreshUser();
  }
};

/**
 * Get Project Discovery List
 */
export const getProjectDiscovery = async (filters?: {
  location?: string;
  type?: string;
  budgetRange?: string;
}): Promise<any[]> => {
  try {
    const response = await api.get('/gc-dashboard/project-discovery', { params: filters });
    return response.data;
  } catch (error) {
    return [];
  }
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
  try {
    const url = projectId
      ? `/gc-dashboard/team-members?projectId=${projectId}`
      : '/gc-dashboard/team-members';
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    return [];
  }
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
  if (USE_MOCK_API) {
    const result = mockAPI.getProjectDocuments(projectId);
    return result.data;
  }

  try {
    const response = await api.get(`/gc-dashboard/projects/${projectId}/documents`);
    return response.data;
  } catch (error) {
    const result = mockAPI.getProjectDocuments(projectId);
    return result.data;
  }
};

/**
 * Upload Document
 */
export const uploadDocument = async (projectId: number, file: File, category: string): Promise<any> => {
  if (USE_MOCK_API) {
    const result = mockAPI.uploadDocument(projectId, {
      name: file.name,
      type: file.type,
      size: file.size
    }, category);
    return result.data;
  }

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
  if (USE_MOCK_API) {
    mockAPI.deleteDocument(documentId);
    return;
  }

  try {
    await api.delete(`/gc-dashboard/documents/${documentId}`);
  } catch (error) {
    mockAPI.deleteDocument(documentId);
  }
};

