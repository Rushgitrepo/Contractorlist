import React, { useState, useEffect } from 'react';
import { getProjects, createProject as createProjectAPI, updateProject as updateProjectAPI, initializeFreshUserData } from '@/services/gcDashboardService';
import EnterpriseTeamManagement from './EnterpriseTeamManagement';
import ProjectDocuments from './ProjectDocuments';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Plus,
  MapPin,
  MoreHorizontal,
  Grid3x3,
  List,
  UserPlus,
  ArrowRight,
  MessageSquare, FileText, Users, FolderOpen, Users2
} from 'lucide-react';
import { Avatar as UIAvatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

// Mock existing team members (In a real app, this would come from an API)
const existingTeamMembers = [
  { id: '1', name: 'Gorde Omkar', role: 'Project Manager', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100' },
  { id: '2', name: 'Darrell Steward', role: 'Site Supervisor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100' },
  { id: '3', name: 'Robert Fox', role: 'Coordinator', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100' },
  { id: '4', name: 'Courtney Henry', role: 'Estimator', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100' },
];

const MyProjects = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('card');
  const [invitedMembers, setInvitedMembers] = useState<string[]>([]);

  // New Project Form State
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectLocation, setNewProjectLocation] = useState('');
  const [newProjectClient, setNewProjectClient] = useState('');
  const [newProjectBudget, setNewProjectBudget] = useState('');
  const [newProjectDuration, setNewProjectDuration] = useState('');
  const [newProjectStatus, setNewProjectStatus] = useState('Planning');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectData, setSelectedProjectData] = useState<any>(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'projects' | 'team' | 'documents'>((searchParams.get('tab') as any) || 'projects');

  const [isEditing, setIsEditing] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);

  // Update active tab when URL search parameter changes
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && (tab === 'projects' || tab === 'team' || tab === 'documents')) {
      setActiveTab(tab as any);
    }
  }, [searchParams]);

  // Load Projects from Service
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjects();
        if (data.length === 0) {
          await initializeFreshUserData();
          const newData = await getProjects();
          setProjects(newData);
        } else {
          setProjects(data);
        }
      } catch (error) {
        console.error("Failed to load projects", error);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  // Listen for 'openNewProjectModal' event
  useEffect(() => {
    const handleOpenModal = () => setShowNewProject(true);
    window.addEventListener('openNewProjectModal', handleOpenModal);
    return () => window.removeEventListener('openNewProjectModal', handleOpenModal);
  }, []);

  const resetForm = () => {
    setNewProjectName('');
    setNewProjectLocation('');
    setNewProjectClient('');
    setNewProjectBudget('');
    setNewProjectDuration('');
    setNewProjectStatus('Planning');
    setNewProjectDescription('');
    setIsEditing(false);
    setEditingProjectId(null);
  };

  const handleSaveProject = async () => {
    try {
      const projectData = {
        name: newProjectName,
        location: newProjectLocation,
        client: newProjectClient,
        status: newProjectStatus as any,
        budget: Number(newProjectBudget) || 0,
        duration: Number(newProjectDuration) || 0,
        description: newProjectDescription
      };

      if (isEditing && editingProjectId) {
        const updated = await updateProjectAPI(editingProjectId, projectData as any);
        setProjects(projects.map(p => p.id === editingProjectId ? updated : p));
        toast({
          title: "Project Updated",
          description: "Project details have been successfully updated.",
        });
      } else {
        const created = await createProjectAPI(projectData);
        setProjects([created, ...projects]);
        toast({
          title: "Project Created",
          description: "Your new project has been successfully initialized.",
        });
        // Only show invite modal for new projects
        setTimeout(() => setShowInviteModal(true), 500);
      }

      setShowNewProject(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} project`,
        variant: "destructive"
      });
    }
  };

  const handleEditClick = (e: React.MouseEvent, project: any) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditingProjectId(project.id);
    setNewProjectName(project.name || '');
    setNewProjectLocation(project.location || '');
    setNewProjectClient(project.client || '');
    setNewProjectBudget(project.budget?.toString() || '');
    setNewProjectStatus(project.status || 'Planning');
    setNewProjectDescription(project.description || '');
    setShowNewProject(true);
  };

  const toggleInvite = (memberId: string) => {
    setInvitedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const filteredProjects = projects.filter(p =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.client?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (project: any) => {
    setSelectedProjectData(project);
    setShowProjectDetails(true);
  };

  return (
    <div className="min-h-full bg-gray-50 dark:bg-[#0f1115] text-gray-900 dark:text-white p-6 font-sans transition-colors duration-300 relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 dark:bg-accent/5 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-6 mb-1">
              <button onClick={() => setSearchParams({ tab: 'projects' })} className={cn("text-2xl font-bold transition-all", activeTab === 'projects' ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-600 hover:text-gray-500")}>My Projects</button>
              <button onClick={() => setSearchParams({ tab: 'team' })} className={cn("text-2xl font-bold transition-all", activeTab === 'team' ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-600 hover:text-gray-500")}>Team</button>
              <button onClick={() => setSearchParams({ tab: 'documents' })} className={cn("text-2xl font-bold transition-all", activeTab === 'documents' ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-600 hover:text-gray-500")}>Documents</button>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {activeTab === 'projects' ? 'Manage and track all your construction jobs' : activeTab === 'team' ? 'Review team members and contractor onboarding status' : 'Centralized storage for all project related documents'}
            </p>
          </div>

          {activeTab === 'projects' && (
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input placeholder="Search projects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-11 bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/10 rounded-xl" />
              </div>
              <div className="flex bg-white dark:bg-[#1c1e24] rounded-lg p-1 border border-gray-200 dark:border-white/10">
                <button onClick={() => setViewMode('card')} className={`p-1.5 rounded-md transition-all ${viewMode === 'card' ? 'bg-gray-100 dark:bg-white/10 text-black dark:text-white' : 'text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white'}`}><Grid3x3 size={18} /></button>
                <button onClick={() => setViewMode('table')} className={`p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-gray-100 dark:bg-white/10 text-black dark:text-white' : 'text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white'}`}><List size={18} /></button>
              </div>
              <Button onClick={() => { resetForm(); setShowNewProject(true); }} className="h-11 bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-xl px-6"><Plus size={18} className="mr-2" /> New Project</Button>
            </div>
          )}
        </div>

        {activeTab === 'projects' ? (
          viewMode === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <div key={project.id || index} className="group relative bg-white dark:bg-[#1c1e24]/80 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-white/5 hover:border-accent dark:hover:border-accent/30 transition-all duration-300 overflow-hidden cursor-pointer hover:shadow-lg dark:hover:shadow-accent/5" onClick={() => handleViewDetails(project)}>
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${project.status === 'On Track' ? 'bg-black dark:bg-white' : project.status === 'Planning' ? 'bg-accent' : project.status === 'Delayed' ? 'bg-gray-500' : 'bg-gray-500'}`} />
                  <div className="p-6">
                    <div className="mb-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-accent transition-colors line-clamp-1 pr-2">{project.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`border-0 bg-gray-100 dark:bg-white/5 whitespace-nowrap ${project.status === 'On Track' ? 'text-black dark:text-white' : project.status === 'Planning' ? 'text-yellow-600 dark:text-accent' : project.status === 'Delayed' ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>{project.status}</Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"
                            onClick={(e) => { e.stopPropagation(); navigate('/gc-dashboard/communications'); }}
                            title="Project Chat"
                          >
                            <Users2 size={16} />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-500">{project.client}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Location</p>
                        <p className="text-sm text-gray-700 dark:text-gray-200 flex items-center gap-1"><MapPin size={12} className="text-gray-400 dark:text-gray-500" />{project.location}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Budget</p>
                        <p className="text-sm text-gray-900 dark:text-white font-mono">{typeof project.budget === 'object' && project.budget !== null ? project.budget.estimated || '$0.00' : project.budget}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <div className="flex justify-between text-xs mb-1.5"><span className="text-gray-500">Completion</span><span className="text-gray-900 dark:text-white">{project.completion}</span></div>
                        <Progress value={project.progress} className="h-1.5 bg-gray-100 dark:bg-white/10"><div className="h-full bg-gradient-to-r from-accent to-accent/80 dark:from-accent dark:to-accent/80" style={{ width: `${project.progress}%` }} /></Progress>
                      </div>
                      <div className="relative w-10 h-10 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-gray-200 dark:text-gray-800" />
                          <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-accent" strokeDasharray={113.1} strokeDashoffset={113.1 - (113.1 * project.progress) / 100} />
                        </svg>
                        <span className="absolute text-[9px] font-bold text-gray-900 dark:text-white">{project.progress}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-[#1c1e24] rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-black/20 border-b border-gray-200 dark:border-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase">Project</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase">Client</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase">Budget</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase">Timeline</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group" onClick={() => handleViewDetails(project)}>
                      <td className="px-6 py-4"><div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-accent transition-colors">{project.name}</div><div className="text-xs text-gray-500">{project.location}</div></td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{project.client}</td>
                      <td className="px-6 py-4"><Badge variant="outline" className={`border-0 bg-gray-100 dark:bg-white/5 ${project.status === 'On Track' ? 'text-black dark:text-white' : project.status === 'Planning' ? 'text-yellow-600 dark:text-accent' : 'text-gray-500 dark:text-gray-400'}`}>{project.status}</Badge></td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-mono">{typeof project.budget === 'object' && project.budget !== null ? project.budget.estimated || '$0.00' : project.budget}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2"><Progress value={project.progress} className="w-24 h-1.5 bg-gray-200 dark:bg-white/10" /><span className="text-xs text-gray-500 whitespace-nowrap">{project.progress}%</span></div>
                        <div className="text-[10px] text-gray-400 dark:text-gray-600 mt-1">{project.completion}</div>
                      </td>
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-accent" onClick={(e) => handleEditClick(e, project)}><FileText size={16} /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white"><MoreHorizontal size={16} /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : activeTab === 'team' ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-400"><EnterpriseTeamManagement /></div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-400"><ProjectDocuments projectId={projects[0]?.id || 1} /></div>
        )}

        {/* Project Detail Modal */}
        <Dialog open={showProjectDetails} onOpenChange={setShowProjectDetails}>
          <DialogContent className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white sm:max-w-2xl overflow-hidden">
            {selectedProjectData && (
              <>
                <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 blur-3xl rounded-full pointer-events-none"></div>
                <DialogHeader className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-accent text-accent-foreground border-none font-bold">{selectedProjectData.status}</Badge>
                    <span className="text-sm text-gray-500">{selectedProjectData.client}</span>
                  </div>
                  <DialogTitle className="text-3xl font-bold tracking-tight">{selectedProjectData.name}</DialogTitle>
                  <DialogDescription className="flex items-center gap-1 text-gray-500 dark:text-gray-400"><MapPin className="w-4 h-4" /> {selectedProjectData.location}</DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-6 py-6 border-t border-b border-gray-100 dark:border-white/5 my-4">
                  <div className="space-y-4">
                    <div><p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Estimated Budget</p><p className="text-2xl font-bold font-mono text-gray-900 dark:text-white">{typeof selectedProjectData.budget === 'object' ? selectedProjectData.budget.estimated : selectedProjectData.budget}</p></div>
                    <div><p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Target Completion</p><p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedProjectData.completion}</p></div>
                  </div>
                  <div className="space-y-4">
                    <div><p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Current Progress</p><div className="flex items-center gap-3"><div className="relative w-12 h-12 flex items-center justify-center"><svg className="w-full h-full transform -rotate-90"><circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-100 dark:text-white/5" /><circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-accent" strokeDasharray={125.6} strokeDashoffset={125.6 - (125.6 * selectedProjectData.progress) / 100} /></svg><span className="absolute text-[10px] font-bold">{selectedProjectData.progress}%</span></div><span className="text-sm font-medium text-gray-500">On Schedule</span></div></div>
                    <div><p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Lead Contact</p><div className="flex items-center gap-2"><UIAvatar className="h-6 w-6"><AvatarFallback className="text-[10px]">PM</AvatarFallback></UIAvatar><span className="text-sm">John Project Manager</span></div></div>
                  </div>
                </div>

                <div className="space-y-4 pb-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">Quick Actions</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Button variant="outline" className="flex flex-col h-auto py-3 gap-2 border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 group" onClick={() => navigate('/gc-dashboard/communications')}>
                      <Users2 className="w-5 h-5 text-gray-400 group-hover:text-black dark:group-hover:text-white" />
                      <span className="text-[10px] font-bold">Project Chat</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col h-auto py-3 gap-2 border-gray-200 dark:border-white/5 hover:bg-accent/10 hover:border-accent/30 group" onClick={() => navigate('/gc-dashboard/communications')}>
                      <MessageSquare className="w-5 h-5 text-gray-400 group-hover:text-accent" />
                      <span className="text-[10px] font-bold">Messages</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col h-auto py-3 gap-2 border-gray-200 dark:border-white/5 hover:bg-accent/10 hover:border-accent/30 group">
                      <FileText className="w-5 h-5 text-gray-400 group-hover:text-accent" />
                      <span className="text-[10px] font-bold">Documents</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col h-auto py-3 gap-2 border-gray-200 dark:border-white/5 hover:bg-accent/10 hover:border-accent/30 group" onClick={() => navigate('/gc-dashboard/directory')}>
                      <Users className="w-5 h-5 text-gray-400 group-hover:text-accent" />
                      <span className="text-[10px] font-bold">Find Subs</span>
                    </Button>
                  </div>
                </div>

                <DialogFooter className="border-t border-gray-100 dark:border-white/5 pt-4">
                  <Button variant="ghost" onClick={() => setShowProjectDetails(false)}>Close</Button>
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold h-11 px-8">Open Project Dashboard</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* New Project Dialog */}
        <Dialog open={showNewProject} onOpenChange={setShowNewProject}>
          <DialogContent className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white sm:max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{isEditing ? 'Edit Project' : 'Create New Project'}</DialogTitle>
              <DialogDescription className="text-gray-500 dark:text-gray-400">{isEditing ? 'Update project details and settings.' : 'Fill in the details below to initialize a new construction project.'}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label className="text-gray-700 dark:text-gray-300">Project Name</Label><Input placeholder="e.g. Office Renovation" className="bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} /></div>
                <div className="space-y-2"><Label className="text-gray-700 dark:text-gray-300">Location</Label><Input placeholder="City, State" className="bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white" value={newProjectLocation} onChange={(e) => setNewProjectLocation(e.target.value)} /></div>
              </div>
              <div className="space-y-2"><Label className="text-gray-700 dark:text-gray-300">Client / Owner</Label><Input placeholder="Client Name" className="bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white" value={newProjectClient} onChange={(e) => setNewProjectClient(e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label className="text-gray-700 dark:text-gray-300">Estimated Budget</Label><Input placeholder="$0.00" className="bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white" value={newProjectBudget} onChange={(e) => setNewProjectBudget(e.target.value)} /></div>
                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">Timeline / Status</Label>
                  <Select value={newProjectStatus} onValueChange={setNewProjectStatus}>
                    <SelectTrigger className="bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white">
                      <SelectItem value="Planning">Planning</SelectItem><SelectItem value="In Progress">In Progress</SelectItem><SelectItem value="Bidding">Bidding</SelectItem><SelectItem value="On Hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2"><Label className="text-gray-700 dark:text-gray-300">Description (Optional)</Label><Textarea placeholder="Brief details..." className="bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white min-h-[80px]" value={newProjectDescription} onChange={(e) => setNewProjectDescription(e.target.value)} /></div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowNewProject(false)}>Cancel</Button>
              <Button onClick={handleSaveProject} className="bg-accent hover:bg-accent/90 text-accent-foreground">{isEditing ? 'Save Changes' : 'Create Project'}</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Invite Team Modal */}
        <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
          <DialogContent className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white sm:max-w-lg">
            <DialogHeader>
              <div className="mx-auto bg-accent/20 p-3 rounded-full mb-4"><UserPlus className="w-8 h-8 text-yellow-600 dark:text-accent" /></div>
              <DialogTitle className="text-xl font-bold text-center">Assign Team Members</DialogTitle>
              <DialogDescription className="text-center text-gray-500 dark:text-gray-400">Select from your existing team to assign them to this project.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="bg-gray-50 dark:bg-black/20 rounded-lg border border-gray-100 dark:border-white/5 max-h-[300px] overflow-y-auto">
                {existingTeamMembers.map(member => (
                  <div key={member.id} className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-white/5 last:border-0 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3"><UIAvatar className='h-8 w-8'><AvatarFallback>{member.name.charAt(0)}</AvatarFallback></UIAvatar><div><p className="text-sm font-medium">{member.name}</p><p className="text-xs text-gray-500">{member.role}</p></div></div>
                    <Button size="sm" variant={invitedMembers.includes(member.id) ? "secondary" : "outline"} className={`h-8 text-xs ${invitedMembers.includes(member.id) ? 'bg-accent/20 text-yellow-900 dark:text-accent' : ''}`} onClick={() => toggleInvite(member.id)}>{invitedMembers.includes(member.id) ? 'Assigned' : 'Assign'}</Button>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 pt-2"><p>Don't see who you need?</p><Button variant="link" onClick={() => { setShowInviteModal(false); navigate('/gc-dashboard/team'); }} className="h-auto p-0 text-yellow-600 dark:text-accent">Add new members to team</Button></div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button variant="ghost" onClick={() => setShowInviteModal(false)}>Skip for now</Button>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => { toast({ title: "Team Invitation Sent", description: `${invitedMembers.length} members have been assigned.` }); setShowInviteModal(false); }}>Done</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MyProjects;
