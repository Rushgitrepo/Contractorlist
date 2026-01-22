/**
 * GC Dashboard API Endpoints
 * Mock API endpoints for development
 * Replace with actual backend endpoints when available
 */

// Mock data storage (in real app, this would be a database)
let mockProjects: any[] = [];
let mockStats: any = null;
let mockTeamMembers: any[] = [];
let mockDocuments: any[] = [];

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
  const newProject = {
    id: mockProjects.length + 1,
    ...projectData,
    jobNumber: `Job #24-${String(mockProjects.length + 1).padStart(3, '0')}`,
    statusColor: projectData.status === 'In Progress' ? 'green' : projectData.status === 'Planning' ? 'blue' : 'yellow',
    timeline: { current: 0, total: projectData.duration, percentage: 0 },
    budget: { 
      estimated: projectData.budget, 
      total: projectData.budget,
      percentage: 0 
    },
    teamSize: 0,
    bidStatus: 'Awarded',
    documents: 0,
    rfiCount: 0,
    changeOrders: 0,
    milestones: { completed: 0, total: Math.ceil(projectData.duration / 4) }
  };
  
  mockProjects.push(newProject);
  mockStats.activeProjects = mockProjects.filter(p => p.status === 'In Progress' || p.status === 'Planning').length;
  
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
    progress: p.timeline.percentage,
    status: p.status === 'In Progress' ? 'On Track' : p.status,
    budget: p.budget.estimated ? `$${(p.budget.estimated / 1000000).toFixed(1)}M` : 'N/A',
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

/**
 * Upload Document
 */
export const uploadDocument = (projectId: number, file: File, category: string) => {
  const newDoc = {
    id: mockDocuments.length + 1,
    projectId,
    name: file.name,
    type: file.type,
    size: file.size,
    category,
    uploaded: new Date().toISOString()
  };
  
  mockDocuments.push(newDoc);
  
  // Update project document count
  const project = mockProjects.find(p => p.id === projectId);
  if (project) {
    project.documents = (project.documents || 0) + 1;
  }
  
  return {
    success: true,
    message: 'Document uploaded',
    data: newDoc
  };
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
  uploadDocument
};

