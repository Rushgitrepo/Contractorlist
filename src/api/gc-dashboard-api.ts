/**
 * GC Dashboard API Endpoints
 * Mock API endpoints for development
 * Handles persistence to localStorage for testing purposes
 */

const STORAGE_KEYS = {
  PROJECTS: 'gc_mock_projects',
  STATS: 'gc_mock_stats',
  TEAM: 'gc_mock_team',
  DOCS: 'gc_mock_docs'
};

// Helper to load from localStorage
const loadFromStorage = (key: string, defaultValue: any) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

// Helper to save to localStorage
const saveToStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Mock data storage (initialized from localStorage)
let mockProjects: any[] = loadFromStorage(STORAGE_KEYS.PROJECTS, []);
let mockStats: any = loadFromStorage(STORAGE_KEYS.STATS, null);
let mockTeamMembers: any[] = loadFromStorage(STORAGE_KEYS.TEAM, []);
let mockDocuments: any[] = loadFromStorage(STORAGE_KEYS.DOCS, []);

/**
 * Initialize Fresh User with Sample Data
 */
export const initializeFreshUser = () => {
  // Sample projects for fresh user
  mockProjects = [
    {
      id: 1,
      name: 'Welcome Project - Sample Office Renovation',
      location: 'Austin, TX',
      jobNumber: 'Job #24-001',
      client: 'Sample Client LLC',
      status: 'Planning',
      statusColor: 'blue',
      timeline: { current: 0, total: 12, percentage: 0 },
      budget: { estimated: 500000, percentage: 0 },
      completion: 'Est. Completion: Mar 2025',
      teamSize: 0,
      bidStatus: 'Awarded',
      documents: 0,
      rfiCount: 0,
      changeOrders: 0,
      milestones: { completed: 0, total: 6 }
    }
  ];

  // Sample stats
  mockStats = {
    activeProjects: 1,
    pendingBids: 0,
    teamMembers: 0,
    messages: 0
  };

  saveToStorage(STORAGE_KEYS.PROJECTS, mockProjects);
  saveToStorage(STORAGE_KEYS.STATS, mockStats);

  return {
    success: true,
    message: 'Fresh user initialized with sample data',
    data: {
      projects: mockProjects,
      stats: mockStats
    }
  };
};

/**
 * Get Dashboard Overview
 */
export const getOverview = () => {
  if (!mockStats) {
    initializeFreshUser();
  }

  return {
    success: true,
    data: mockStats || {
      activeProjects: 0,
      pendingBids: 0,
      teamMembers: 0,
      messages: 0
    }
  };
};

/**
 * Get Projects
 */
export const getProjects = () => {
  if (mockProjects.length === 0) {
    initializeFreshUser();
  }

  return {
    success: true,
    data: mockProjects
  };
};

/**
 * Create Project
 */
export const createProject = (projectData: any) => {
  const newId = mockProjects.length > 0 ? Math.max(...mockProjects.map(p => p.id)) + 1 : 1;
  const newProject = {
    id: newId,
    ...projectData,
    jobNumber: `Job #24-${String(newId).padStart(3, '0')}`,
    statusColor: projectData.status === 'In Progress' ? 'green' : projectData.status === 'Planning' ? 'blue' : 'yellow',
    timeline: { current: 0, total: projectData.duration || 12, percentage: 0 },
    budget: {
      estimated: projectData.budget,
      total: projectData.budget,
      percentage: 0
    },
    completion: projectData.completion || `Est. Completion: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000 * (projectData.duration || 12)).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
    progress: 0,
    teamSize: 0,
    bidStatus: 'Awarded',
    documents: 0,
    rfiCount: 0,
    changeOrders: 0,
    milestones: { completed: 0, total: Math.ceil((projectData.duration || 12) / 4) }
  };

  mockProjects.push(newProject);
  mockStats.activeProjects = mockProjects.filter(p => p.status === 'In Progress' || p.status === 'Planning').length;

  saveToStorage(STORAGE_KEYS.PROJECTS, mockProjects);
  saveToStorage(STORAGE_KEYS.STATS, mockStats);

  return {
    success: true,
    data: newProject
  };
};

/**
 * Update Project
 */
export const updateProject = (id: number, updates: any) => {
  const index = mockProjects.findIndex(p => p.id === id);
  if (index !== -1) {
    mockProjects[index] = { ...mockProjects[index], ...updates };
    saveToStorage(STORAGE_KEYS.PROJECTS, mockProjects);
    return {
      success: true,
      data: mockProjects[index]
    };
  }
  return {
    success: false,
    message: 'Project not found'
  };
};

/**
 * Delete Project
 */
export const deleteProject = (id: number) => {
  const index = mockProjects.findIndex(p => p.id === id);
  if (index !== -1) {
    mockProjects.splice(index, 1);
    mockStats.activeProjects = mockProjects.filter(p => p.status === 'In Progress' || p.status === 'Planning').length;
    saveToStorage(STORAGE_KEYS.PROJECTS, mockProjects);
    saveToStorage(STORAGE_KEYS.STATS, mockStats);
    return {
      success: true,
      message: 'Project deleted'
    };
  }
  return {
    success: false,
    message: 'Project not found'
  };
};

/**
 * Get Recent Projects
 */
export const getRecentProjects = (limit: number = 3) => {
  const recent = mockProjects.slice(0, limit).map(p => ({
    name: p.name,
    location: p.location,
    progress: p.timeline?.percentage || 0,
    status: p.status === 'In Progress' ? 'On Track' : p.status,
    budget: p.budget?.estimated ? `$${(p.budget.estimated / 1000000).toFixed(1)}M` : 'N/A',
    completion: p.completion,
    client: p.client
  }));

  return {
    success: true,
    data: recent
  };
};

/**
 * Submit Bid
 */
export const submitBid = (projectId: number, bidData: any) => {
  return {
    success: true,
    message: 'Bid submitted successfully',
    data: {
      id: Date.now(),
      projectId,
      ...bidData,
      status: 'Submitted',
      submittedAt: new Date().toISOString()
    }
  };
};

/**
 * Get Team Members
 */
export const getTeamMembers = (projectId?: number) => {
  return {
    success: true,
    data: mockTeamMembers.filter(m => !projectId || m.projectId === projectId)
  };
};

/**
 * Invite Team Member
 */
export const inviteTeamMember = (projectId: number, memberData: any) => {
  const newMember = {
    id: mockTeamMembers.length + 1,
    projectId,
    ...memberData,
    status: 'Pending',
    invitedAt: new Date().toISOString()
  };

  mockTeamMembers.push(newMember);
  mockStats.teamMembers = mockTeamMembers.length;

  saveToStorage(STORAGE_KEYS.TEAM, mockTeamMembers);
  saveToStorage(STORAGE_KEYS.STATS, mockStats);

  return {
    success: true,
    message: 'Invitation sent',
    data: newMember
  };
};

/**
 * Get Project Documents
 */
export const getProjectDocuments = (projectId: number) => {
  return {
    success: true,
    data: mockDocuments.filter(d => d.projectId === projectId)
  };
};

export const uploadDocument = (projectId: number, file: any, category: string) => {
  const newDoc = {
    id: mockDocuments.length > 0 ? Math.max(...mockDocuments.map(d => d.id)) + 1 : 1,
    projectId,
    name: file.name,
    type: file.type || 'application/pdf',
    size: file.size || 0,
    category: category || 'General',
    uploaded: new Date().toISOString(),
    uploadedBy: 'You'
  };

  mockDocuments.push(newDoc);
  saveToStorage(STORAGE_KEYS.DOCS, mockDocuments);

  // Update project document count
  const project = mockProjects.find(p => p.id === projectId);
  if (project) {
    project.documents = (project.documents || 0) + 1;
    saveToStorage(STORAGE_KEYS.PROJECTS, mockProjects);
  }

  return {
    success: true,
    message: 'Document uploaded',
    data: newDoc
  };
};

export const deleteDocument = (documentId: number) => {
  const index = mockDocuments.findIndex(d => d.id === documentId);
  if (index !== -1) {
    const projectId = mockDocuments[index].projectId;
    mockDocuments.splice(index, 1);
    saveToStorage(STORAGE_KEYS.DOCS, mockDocuments);

    // Update project document count
    const project = mockProjects.find(p => p.id === projectId);
    if (project && project.documents > 0) {
      project.documents -= 1;
      saveToStorage(STORAGE_KEYS.PROJECTS, mockProjects);
    }

    return { success: true, message: 'Document deleted' };
  }
  return { success: false, message: 'Document not found' };
};

// Export all functions
export default {
  initializeFreshUser,
  getOverview,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getRecentProjects,
  submitBid,
  getTeamMembers,
  inviteTeamMember,
  getProjectDocuments,
  uploadDocument,
  deleteDocument
};
