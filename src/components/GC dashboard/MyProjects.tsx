import { getProjects, createProject as createProjectAPI, updateProject as updateProjectAPI, deleteProject as deleteProjectAPI, getTeamMembers, assignTeamMember, removeTeamMemberFromProject, getProjectTeamMembers, uploadDocument } from '@/api/gc-apis';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import EnterpriseTeamManagement from './EnterpriseTeamManagement';
import ProjectDocuments from './ProjectDocuments';
import {
  Search,
  Plus,
  MapPin,
  MoreHorizontal,
  Grid3x3,
  List,
  UserPlus,
  ArrowRight,
  MessageSquare, FileText, Users, FolderOpen, Users2,
  Trash2,
  Upload,
  Power,
  CheckCircle2
} from 'lucide-react';
import { Avatar as UIAvatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const MyProjects = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('card');
  const [invitedMembers, setInvitedMembers] = useState<string[]>([]);
  const [existingTeamMembers, setExistingTeamMembers] = useState<any[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'projects';
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [selectedProjectData, setSelectedProjectData] = useState<any>(null);
  const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [projectTeamMembers, setProjectTeamMembers] = useState<any[]>([]);

  // New Project Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectLocation, setNewProjectLocation] = useState('');
  const [newProjectClient, setNewProjectClient] = useState('');
  const [newProjectBudget, setNewProjectBudget] = useState('');
  const [newProjectDuration, setNewProjectDuration] = useState('');
  const [newProjectStatus, setNewProjectStatus] = useState('Planning');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  // Custom Global Upload State
  const [showGlobalUploadModal, setShowGlobalUploadModal] = useState(false);
  const [globalUploadProject, setGlobalUploadProject] = useState<string>("");
  const [globalUploadCategory, setGlobalUploadCategory] = useState("Other");
  const [isGlobalUploading, setIsGlobalUploading] = useState(false);
  const [selectedGlobalFile, setSelectedGlobalFile] = useState<File | null>(null);

  // Alert Dialog State
  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant: 'default' | 'destructive';
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => { },
    variant: 'default'
  });

  const confirmAction = (title: string, description: string, onConfirm: () => void, variant: 'default' | 'destructive' = 'default') => {
    setAlertConfig({ isOpen: true, title, description, onConfirm, variant });
  };

  // Load Projects and Team Members
  useEffect(() => {
    const loadData = async () => {
      try {
        const [projectsData, teamData] = await Promise.all([
          getProjects({ search: searchQuery }),
          getTeamMembers()
        ]);
        setProjects(projectsData);
        setExistingTeamMembers(teamData);
        if (projectsData.length > 0 && !currentProjectId) {
          setCurrentProjectId(projectsData[0].id);
        }
      } catch (error) {
        console.error("Failed to load data", error);
        toast({
          title: "Error loading data",
          description: "Some dashboard information could not be loaded.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(() => {
      loadData();
    }, 300); // 300ms debounce
    return () => clearTimeout(timer);
  }, [searchQuery]);



  const executeDeleteProject = async (projectId: number) => {
    try {
      console.log('Attempting to delete project:', projectId);
      await deleteProjectAPI(projectId);
      console.log('Delete API call successful');

      setProjects(prev => {
        const filtered = prev.filter(p => Number(p.id) !== Number(projectId));
        console.log(`Filtering UI: ${prev.length} -> ${filtered.length} projects`);
        return filtered;
      });

      toast({
        title: "Project Deleted",
        description: "The project has been permanently removed.",
      });
      setShowProjectDetails(false);

      // Optional: Refetch to be 100% sure
      const updatedProjects = await getProjects({ search: searchQuery });
      setProjects(updatedProjects);
    } catch (error: any) {
      console.error('Delete project error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      toast({
        title: "Error",
        description: error.response?.data?.error?.message || "Failed to delete project",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProject = (projectId: number) => {
    confirmAction(
      "Delete Project?",
      "⚠️ WARNING: This will PERMANENTLY delete this project and all associated data (documents, team assignments, etc.). This action CANNOT be undone. Are you absolutely sure?",
      () => executeDeleteProject(projectId),
      "destructive"
    );
  };

  const handleViewTeam = async (projectId: number) => {
    try {
      const teamMembers = await getProjectTeamMembers(projectId);
      setProjectTeamMembers(teamMembers);
      // Populate invitedMembers so the Invite Modal shows checkmarks for existing members
      setInvitedMembers(teamMembers.map((m: any) => m.id.toString()));
      setSelectedProject(projectId);
      setShowTeamModal(true);
    } catch (error: any) {
      console.error('Failed to load team members:', error);
      toast({
        title: "Error",
        description: "Failed to load team members for this project",
        variant: "destructive"
      });
    }
  };

  const handleRemoveFromTeamView = (memberId: string, memberName: string) => {
    confirmAction(
      "Remove Team Member?",
      `Remove ${memberName} from this project?`,
      async () => {
        try {
          await removeTeamMemberFromProject(selectedProject!, Number(memberId));

          // Update local state to reflect removal immediately
          const updatedList = projectTeamMembers.filter(m => m.id.toString() !== memberId);
          setProjectTeamMembers(updatedList);
          setInvitedMembers(updatedList.map(m => m.id.toString()));

          toast({ title: "Removed", description: "Team member removed from project" });
        } catch (error) {
          console.error("Failed to remove member:", error);
          toast({ title: "Error", description: "Failed to remove member", variant: "destructive" });
        }
      },
      "destructive"
    );
  };



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
        location: newProjectLocation || undefined,
        client: newProjectClient || undefined,
        status: newProjectStatus as any,
        budget: newProjectBudget === '' ? undefined : Number(newProjectBudget.replace(/[^0-9.]/g, '')),
        duration: newProjectDuration === '' ? undefined : Number(newProjectDuration),
        description: newProjectDescription || undefined
      };

      if (isEditing && editingProjectId) {
        const updated = await updateProjectAPI(editingProjectId, projectData as any);
        setProjects(projects.map(p => p.id === editingProjectId ? { ...p, ...updated } : p));
        toast({
          title: "Project Updated",
          description: "Project details have been successfully updated.",
        });
      } else {
        const created = await createProjectAPI(projectData);
        setProjects([created, ...projects]);
        setSelectedProject(created.id);
        toast({
          title: "Project Created",
          description: "Your new project has been successfully initialized.",
        });
        // Only show invite modal for new projects
        setTimeout(() => setShowInviteModal(true), 500);
      }

      setShowNewProject(false);
      resetForm();
      const [projectsData] = await Promise.all([
        getProjects({ search: searchQuery }),
      ]);
      setProjects(projectsData);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} project`,
        variant: "destructive"
      });
    }
  };

  const handleInviteMembers = async () => {
    if (!selectedProject || invitedMembers.length === 0) {
      setShowInviteModal(false);
      return;
    }

    try {
      // Filter out members who are already in the project team (if loaded) to prevent duplicate assignment calls
      let membersToAssign = invitedMembers;
      if (showTeamModal && projectTeamMembers.length > 0) {
        membersToAssign = invitedMembers.filter(id => !projectTeamMembers.some(m => m.id.toString() === id));
      }

      if (membersToAssign.length > 0) {
        const promises = membersToAssign.map(memberId =>
          assignTeamMember(selectedProject, Number(memberId), 'Member')
        );
        await Promise.all(promises);
        toast({ title: "Team Invitation Sent", description: `${membersToAssign.length} new members have been assigned.` });
      } else if (membersToAssign.length === 0 && invitedMembers.length > 0) {
        // Just closed without new additions
        // toast({ title: "Updated", description: "Team list updated." });
      }

      setShowInviteModal(false);

      // If we are in "View Team" mode, refresh the list
      if (showTeamModal) {
        const updatedMembers = await getProjectTeamMembers(selectedProject);
        setProjectTeamMembers(updatedMembers);
        setInvitedMembers(updatedMembers.map((m: any) => m.id.toString()));
      } else {
        setInvitedMembers([]);
        setSelectedProject(null);
      }
    } catch (error) {
      console.error("Assign error:", error);
      toast({
        title: "Error",
        description: "Failed to assign some members.",
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

  const handleGlobalUpload = async () => {
    if (!globalUploadProject || !selectedGlobalFile) {
      toast({ title: "Validation Error", description: "Please select a project and a file.", variant: "destructive" });
      return;
    }

    try {
      setIsGlobalUploading(true);
      await uploadDocument(Number(globalUploadProject), selectedGlobalFile, globalUploadCategory);
      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
      setSelectedGlobalFile(null);
      setShowGlobalUploadModal(false);
      // Refresh docs if on docs tab? Or just let it be.
      if (activeTab === 'documents' && Number(globalUploadProject) === currentProjectId) {
        // We could force a refresh here but simplest to just let user navigate
        window.location.reload();
      }
    } catch (error) {
      console.error("Upload error", error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive"
      });
    } finally {
      setIsGlobalUploading(false);
    }
  };

  const handleGlobalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File Type Validation
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'text/plain', 'text/csv',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    // Check extension as fallback
    const isValidType = allowedTypes.includes(file.type) ||
      /\.(jpg|jpeg|png|gif|webp|pdf|txt|csv|doc|docx|xls|xlsx)$/i.test(file.name);

    if (!isValidType) {
      toast({
        title: "Unsupported File Format",
        description: "Please upload a supported file type (PDF, Image, Word, Excel, CSV).",
        variant: "destructive"
      });
      e.target.value = ''; // Reset input
      return;
    }
    setSelectedGlobalFile(file);
  };

  const handleStatusUpdate = async (projectId: number, newStatus: string) => {
    try {
      // Optimistic update
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: newStatus } : p));

      await updateProjectAPI(projectId, { status: newStatus });
      toast({
        title: "Status Updated",
        description: `Project marked as ${newStatus}`,
      });
    } catch (error) {
      console.error("Failed to update status", error);
      // Revert or fetch again could be done here, but simple error toast for now
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const filteredProjects = projects.filter(p =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.client?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (project: any) => {
    setSelectedProjectData(project);
    setCurrentProjectId(project.id);
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
              <Button onClick={() => setShowGlobalUploadModal(true)} className="h-11 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white font-bold rounded-xl px-4 border border-gray-200 dark:border-white/10" variant="outline"><Upload size={18} className="mr-2" /> Upload Doc</Button>
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
                        <div className="flex-1 pr-2">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-accent transition-colors line-clamp-1 pr-2">{project.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className={`border-0 bg-gray-100 dark:bg-white/5 whitespace-nowrap ${project.status === 'Active' ? 'text-black dark:text-white' : project.status === 'Planning' ? 'text-yellow-600 dark:text-accent' : 'text-gray-500 dark:text-gray-400'}`}>{project.status}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Active/Inactive Toggle */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              const isActive = project.status === 'Active';
                              const newStatus = isActive ? 'On Hold' : 'Active';
                              handleStatusUpdate(project.id, newStatus);
                            }}
                            className={cn(
                              "h-8 px-2 text-[10px] font-semibold rounded-lg transition-all border shrink-0 mr-1 hidden sm:flex",
                              ['On Track', 'In Progress', 'Active'].includes(project.status)
                                ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50 hover:bg-green-200 dark:hover:bg-green-900/50"
                                : "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10"
                            )}
                            title={project.status === 'Active' ? "Deactivate Project" : "Activate Project"}
                          >
                            {project.status === 'Active' ? (
                              <div className="flex items-center gap-1.5"><CheckCircle2 size={12} /> Active</div>
                            ) : (
                              <div className="flex items-center gap-1.5"><Power size={12} /> Inactive</div>
                            )}
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"
                            onClick={(e) => { e.stopPropagation(); navigate('/gc-dashboard/communications'); }}
                            title="Project Chat"
                          >
                            <Users2 size={16} />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/10">
                              <DropdownMenuItem className="focus:bg-gray-100 dark:focus:bg-white/10" onClick={(e) => handleEditClick(e, project)}>Edit Details</DropdownMenuItem>
                              <DropdownMenuItem className="focus:bg-gray-100 dark:focus:bg-white/10" onClick={() => handleViewDetails(project)}>View Dashboard</DropdownMenuItem>

                              <DropdownMenuSeparator />

                              <DropdownMenuSub>
                                <DropdownMenuSubTrigger className="focus:bg-gray-100 dark:focus:bg-white/10">Change Status</DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                  <DropdownMenuSubContent className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/10">
                                    {['Planning', 'Bidding', 'Active', 'Completed', 'On Hold'].map(status => (
                                      <DropdownMenuItem key={status} onClick={(e) => { e.stopPropagation(); handleStatusUpdate(project.id, status) }}>{status}</DropdownMenuItem>
                                    ))}
                                  </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                              </DropdownMenuSub>

                              <DropdownMenuSeparator />

                              <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20" onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id); }}>Delete Project</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
                        <p className="text-sm text-gray-900 dark:text-white font-mono">
                          {typeof project.budget === 'number'
                            ? `$${(project.budget / 1000).toFixed(0)}K`
                            : typeof project.budget === 'object' && project.budget !== null
                              ? project.budget.estimated || '$0.00'
                              : project.budget || '$0.00'}
                        </p>
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
                      <td className="px-6 py-4"><Badge variant="outline" className={`border-0 bg-gray-100 dark:bg-white/5 ${project.status === 'Active' ? 'text-black dark:text-white' : project.status === 'Planning' ? 'text-yellow-600 dark:text-accent' : 'text-gray-500 dark:text-gray-400'}`}>{project.status}</Badge></td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-mono">
                        {typeof project.budget === 'number'
                          ? `$${(project.budget / 1000).toFixed(0)}K`
                          : typeof project.budget === 'object' && project.budget !== null
                            ? project.budget.estimated || '$0.00'
                            : project.budget || '$0.00'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2"><Progress value={project.progress} className="w-24 h-1.5 bg-gray-200 dark:bg-white/10" /><span className="text-xs text-gray-500 whitespace-nowrap">{project.progress}%</span></div>
                        <div className="text-[10px] text-gray-400 dark:text-gray-600 mt-1">{project.completion}</div>
                      </td>
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-2 items-center">
                          {/* Active/Inactive Toggle */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              const isActive = project.status === 'Active';
                              const newStatus = isActive ? 'On Hold' : 'Active';
                              handleStatusUpdate(project.id, newStatus);
                            }}
                            className={cn(
                              "h-7 w-7 p-0 rounded-lg transition-all border shrink-0",
                              ['On Track', 'In Progress', 'Active'].includes(project.status)
                                ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50 hover:bg-green-200 dark:hover:bg-green-900/50"
                                : "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10"
                            )}
                            title={project.status === 'Active' ? "Deactivate Project" : "Activate Project"}
                          >
                            {project.status === 'Active' ? (
                              <CheckCircle2 size={14} />
                            ) : (
                              <Power size={14} />
                            )}
                          </Button>

                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-accent" onClick={(e) => handleEditClick(e, project)}><FileText size={16} /></Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white"><MoreHorizontal size={16} /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/10">
                              <DropdownMenuItem className="focus:bg-gray-100 dark:focus:bg-white/10" onClick={(e) => handleEditClick(e, project)}>Edit Details</DropdownMenuItem>
                              <DropdownMenuItem className="focus:bg-gray-100 dark:focus:bg-white/10" onClick={() => { setSelectedProjectData(project); setShowProjectDetails(true); }}>View Dashboard</DropdownMenuItem>

                              <DropdownMenuSeparator />

                              <DropdownMenuSub>
                                <DropdownMenuSubTrigger className="focus:bg-gray-100 dark:focus:bg-white/10">Change Status</DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                  <DropdownMenuSubContent className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/10">
                                    {['Planning', 'Bidding', 'Active', 'Completed', 'On Hold'].map(status => (
                                      <DropdownMenuItem key={status} onClick={(e) => { e.stopPropagation(); handleStatusUpdate(project.id, status) }}>{status}</DropdownMenuItem>
                                    ))}
                                  </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                              </DropdownMenuSub>

                              <DropdownMenuSeparator />

                              <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20" onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id); }}>Delete Project</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
            {currentProjectId ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FolderOpen className="w-5 h-5 text-accent" />
                    <h2 className="text-xl font-bold">Documents for: {projects.find(p => p.id === currentProjectId)?.name || 'Selected Project'}</h2>
                  </div>
                  <Select value={currentProjectId.toString()} onValueChange={(val) => setCurrentProjectId(Number(val))}>
                    <SelectTrigger className="w-64 bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/10">
                      <SelectValue placeholder="Switch Project" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/10">
                      {projects.map(p => (
                        <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <ProjectDocuments projectId={currentProjectId} />
              </div>
            ) : (
              <div className="p-20 text-center text-gray-400">Please select a project to view documents.</div>
            )}
          </div>
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
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Estimated Budget</p>
                      <p className="text-2xl font-bold font-mono text-gray-900 dark:text-white">
                        {typeof selectedProjectData.budget === 'number'
                          ? `$${selectedProjectData.budget.toLocaleString()}`
                          : typeof selectedProjectData.budget === 'object' && selectedProjectData.budget !== null
                            ? selectedProjectData.budget.estimated
                            : selectedProjectData.budget || '$0.00'}
                      </p>
                    </div>
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
                    <Button variant="outline" className="flex flex-col h-auto py-3 gap-2 border-gray-200 dark:border-white/5 hover:bg-red-50 hover:border-red-200 group" onClick={() => selectedProjectData && handleDeleteProject(selectedProjectData.id)}>
                      <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
                      <span className="text-[10px] font-bold group-hover:text-red-600">Delete</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col h-auto py-3 gap-2 border-gray-200 dark:border-white/5 hover:bg-accent/10 hover:border-accent/30 group" onClick={() => selectedProjectData && handleViewTeam(selectedProjectData.id)}>
                      <Users className="w-5 h-5 text-gray-400 group-hover:text-accent" />
                      <span className="text-[10px] font-bold">View Team</span>
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
                  <Button
                    className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold h-11 px-8"
                    onClick={() => {
                      setCurrentProjectId(selectedProjectData.id);
                      setSearchParams({ tab: 'documents' });
                      setShowProjectDetails(false);
                    }}
                  >
                    Open Project Dashboard
                  </Button>
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
                    <div className="flex items-center gap-3"><UIAvatar className='h-8 w-8'><AvatarImage src={member.avatar_url} /><AvatarFallback>{member.name.charAt(0)}</AvatarFallback></UIAvatar><div><p className="text-sm font-medium">{member.name}</p><p className="text-xs text-gray-500">{member.role}</p></div></div>
                    {invitedMembers.includes(member.id) ? (
                      <Button size="sm" variant="destructive" className="h-8 text-xs" onClick={() => {
                        if (!selectedProjectData?.id) {
                          toggleInvite(member.id);
                        } else {
                          confirmAction("Remove Team Member?", `Remove ${member.name} from project?`, async () => {
                            await removeTeamMemberFromProject(selectedProjectData.id, member.id);
                            toggleInvite(member.id);
                            toast({ title: "Removed", description: "Team member removed from project" });
                          }, "destructive");
                        }
                      }}>Remove</Button>
                    ) : (
                      <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => {
                        toggleInvite(member.id);
                        // If immediate assignment is desired, we could call assignTeamMember here, but handleInviteMembers does batch
                      }}>Assign</Button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 pt-2"><p>Don't see who you need?</p><Button variant="link" onClick={() => { setShowInviteModal(false); navigate('/gc-dashboard/team'); }} className="h-auto p-0 text-yellow-600 dark:text-accent">Add new members to team</Button></div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button variant="ghost" onClick={() => setShowInviteModal(false)}>Close</Button>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleInviteMembers}>Save Assignments</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Project Team View Modal */}
        <Dialog open={showTeamModal} onOpenChange={setShowTeamModal}>
          <DialogContent className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white sm:max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader className="flex flex-row items-center justify-between pr-8">
              <div>
                <DialogTitle className="text-xl font-bold">Project Team</DialogTitle>
                <DialogDescription className="text-gray-500 dark:text-gray-400">
                  {selectedProjectData?.name} - Assigned Members
                </DialogDescription>
              </div>
              <Button
                onClick={() => setShowInviteModal(true)}
                className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
              >
                <UserPlus size={16} /> Add Member
              </Button>
            </DialogHeader>

            <div className="mt-6">
              {projectTeamMembers.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 dark:bg-black/20 rounded-xl border border-dashed border-gray-200 dark:border-white/10">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No team members assigned to this project yet.</p>
                  <Button variant="outline" onClick={() => setShowInviteModal(true)}>Assign Team Members</Button>
                </div>
              ) : (
                <div className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-black/20 border-b border-gray-200 dark:border-white/10">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project Role</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                      {projectTeamMembers.map((member) => (
                        <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <UIAvatar className='h-8 w-8'>
                                <AvatarImage src={member.avatar_url} />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                              </UIAvatar>
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</div>
                                <div className="text-xs text-gray-500">{member.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{member.role}</td>
                          <td className="px-4 py-3"><Badge variant="outline" className="text-xs font-normal">{member.project_role || 'Member'}</Badge></td>
                          <td className="px-4 py-3 text-xs text-gray-500">
                            {member.assigned_at ? new Date(member.assigned_at).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8 p-0"
                              onClick={() => handleRemoveFromTeamView(member.id.toString(), member.name)}
                              title="Remove from project"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <DialogFooter className="mt-6 border-t border-gray-100 dark:border-white/5 pt-4">
              <Button variant="ghost" onClick={() => setShowTeamModal(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <AlertDialog open={alertConfig.isOpen} onOpenChange={(open) => {
          if (!open) setAlertConfig(prev => ({ ...prev, isOpen: false }));
        }}>
          <AlertDialogContent className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>{alertConfig.title}</AlertDialogTitle>
              <AlertDialogDescription>{alertConfig.description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  alertConfig.onConfirm();
                  setAlertConfig(prev => ({ ...prev, isOpen: false }));
                }}
                className={cn(alertConfig.variant === 'destructive' ? "bg-red-600 hover:bg-red-700 focus:ring-red-600" : "")}
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Global Upload Dialog */}
        <Dialog open={showGlobalUploadModal} onOpenChange={setShowGlobalUploadModal}>
          <DialogContent className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle className='flex items-center gap-2'><Upload className='w-5 h-5 text-accent' /> Upload Document</DialogTitle>
              <DialogDescription className="text-gray-500 dark:text-gray-400">Select a project and upload a document to its secure vault.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Select Project <span className='text-red-500'>*</span></Label>
                <Select value={globalUploadProject} onValueChange={setGlobalUploadProject}>
                  <SelectTrigger className="bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10">
                    <SelectValue placeholder="Choose project..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/10">
                    {projects.map(p => (
                      <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Category</Label>
                <Select value={globalUploadCategory} onValueChange={setGlobalUploadCategory}>
                  <SelectTrigger className="bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/10">
                    <SelectItem value="Plans">Plans</SelectItem>
                    <SelectItem value="Drawings">Drawings</SelectItem>
                    <SelectItem value="Photos">Photos</SelectItem>
                    <SelectItem value="Contracts">Contracts</SelectItem>
                    <SelectItem value="Invoices">Invoices</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Document File <span className='text-red-500'>*</span></Label>
                <div className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl p-6 text-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer relative">
                  <Input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleGlobalFileChange}
                  />
                  {selectedGlobalFile ? (
                    <div className="flex flex-col items-center">
                      <FileText className="w-8 h-8 text-accent mb-2" />
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-full px-4">{selectedGlobalFile.name}</p>
                      <p className="text-xs text-gray-500">{(selectedGlobalFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-2" />
                      <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Click to Browse or Drag File</p>
                      <p className="text-xs text-gray-400">PDF, JPG, PNG, DOC, XLS (Max 10MB)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setShowGlobalUploadModal(false)}>Cancel</Button>
              <Button
                onClick={handleGlobalUpload}
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
                disabled={!globalUploadProject || !selectedGlobalFile || isGlobalUploading}
              >
                {isGlobalUploading ? "Uploading..." : "Upload Document"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MyProjects;
