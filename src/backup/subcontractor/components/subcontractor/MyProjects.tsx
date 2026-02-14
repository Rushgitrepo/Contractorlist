/**
 * SC MyProjects Component
 * Real API-connected project management for Subcontractors
 * Mirrors GC MyProjects structure with SC-specific fields
 */

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Briefcase,
  Calendar,
  MapPin,
  Building,
  DollarSign,
  Users,
  FileText,
  Eye,
  Edit,
  MoreHorizontal,
  ArrowRight,
  TrendingUp,
  Activity,
  Shield,
  Inbox,
  Plus,
  Search,
  Trash2,
  UserPlus,
  Grid3x3,
  List,
  Wrench,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import * as scApi from '@/api/sc-apis';
import type { SCProject, SCProjectTeamMember } from '@/api/sc-apis';
import ProjectDocuments from './ProjectDocuments';

// Project statuses
const PROJECT_STATUSES = ['Planning', 'Bidding', 'Active', 'Completed', 'On Hold'] as const;

// Common trades for subcontractors
const TRADES = [
  'Electrical', 'Plumbing', 'HVAC', 'Roofing', 'Flooring', 'Painting',
  'Drywall', 'Carpentry', 'Concrete', 'Masonry', 'Landscaping', 'General'
];

const SCMyProjects = () => {
  const { toast } = useToast();

  // State
  const [projects, setProjects] = useState<SCProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [sortBy, setSortBy] = useState('recent');

  // Modal states
  const [showNewProject, setShowNewProject] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [selectedProject, setSelectedProject] = useState<SCProject | null>(null);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [projectTeam, setProjectTeam] = useState<SCProjectTeamMember[]>([]);
  const [showDocsModal, setShowDocsModal] = useState(false);

  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    project_type: '',
    trade: '',
    city: '',
    state: '',
    address: '',
    contract_value: '',
    status: 'Planning' as SCProject['status'],
    progress: '0',
    phase: '',
    start_date: '',
    expected_completion_date: '',
    description: '',
    notes: '',
  });

  // Team member form
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');

  // Dashboard stats
  const [stats, setStats] = useState({
    activeProjectsCount: 0,
    completedProjectsCount: 0,
    totalTeamSize: 0,
    totalContractValue: 0,
    averageProgress: '0',
  });

  // Alert dialog state
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

  // Load projects and stats
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const result = await scApi.getProjects({ search: searchQuery });
      setProjects(result.projects);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const overview = await scApi.getDashboardOverview();
      setStats(overview);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchStats();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter projects by tab
  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    if (activeTab !== 'all') {
      filtered = filtered.filter(p => p.status.toLowerCase() === activeTab.toLowerCase());
    }

    // Sort
    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'progress') {
      filtered.sort((a, b) => b.progress - a.progress);
    } else if (sortBy === 'value') {
      filtered.sort((a, b) => (b.contract_value || 0) - (a.contract_value || 0));
    }

    return filtered;
  }, [projects, activeTab, sortBy]);

  // Form handlers
  const resetForm = () => {
    setFormData({
      name: '',
      client: '',
      project_type: '',
      trade: '',
      city: '',
      state: '',
      address: '',
      contract_value: '',
      status: 'Planning',
      progress: '0',
      phase: '',
      start_date: '',
      expected_completion_date: '',
      description: '',
      notes: '',
    });
    setIsEditing(false);
  };

  const handleCreateProject = async () => {
    try {
      if (!formData.name.trim()) {
        toast({ title: "Error", description: "Project name is required", variant: "destructive" });
        return;
      }

      const projectData = {
        ...formData,
        contract_value: formData.contract_value ? parseFloat(formData.contract_value) : undefined,
        progress: parseInt(formData.progress),
      };

      if (isEditing && selectedProject) {
        const updated = await scApi.updateProject(selectedProject.id, projectData);
        setProjects(projects.map(p => p.id === selectedProject.id ? updated : p));
        toast({ title: "Success", description: "Project updated successfully" });
      } else {
        const created = await scApi.createProject(projectData);
        setProjects([created, ...projects]);
        toast({ title: "Success", description: "Project created successfully" });
      }

      setShowNewProject(false);
      resetForm();
      fetchStats();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error?.message || "Failed to save project",
        variant: "destructive"
      });
    }
  };

  const handleEditProject = (project: SCProject) => {
    setFormData({
      name: project.name,
      client: project.client || '',
      project_type: project.project_type || '',
      trade: project.trade || '',
      city: project.city || '',
      state: project.state || '',
      address: project.address || '',
      contract_value: project.contract_value?.toString() || '',
      status: project.status,
      progress: project.progress.toString(),
      phase: project.phase || '',
      start_date: project.start_date || '',
      expected_completion_date: project.expected_completion_date || '',
      description: project.description || '',
      notes: project.notes || '',
    });
    setSelectedProject(project);
    setIsEditing(true);
    setShowNewProject(true);
  };

  const handleDeleteProject = (projectId: number) => {
    confirmAction(
      "Delete Project?",
      "⚠️ WARNING: This will PERMANENTLY delete this project and all associated data. This action CANNOT be undone.",
      async () => {
        try {
          await scApi.deleteProject(projectId);
          setProjects(projects.filter(p => p.id !== projectId));
          setShowProjectDetails(false);
          toast({ title: "Deleted", description: "Project has been permanently removed" });
          fetchStats();
        } catch (error) {
          toast({ title: "Error", description: "Failed to delete project", variant: "destructive" });
        }
      },
      "destructive"
    );
  };

  const handleViewProject = async (project: SCProject) => {
    try {
      const fullProject = await scApi.getProjectById(project.id);
      setSelectedProject(fullProject);
      setShowProjectDetails(true);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load project details", variant: "destructive" });
    }
  };

  // Team handlers
  const handleViewTeam = async (project: SCProject) => {
    try {
      const team = await scApi.getProjectTeam(project.id);
      setProjectTeam(team);
      setSelectedProject(project);
      setShowTeamModal(true);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load team", variant: "destructive" });
    }
  };

  // Document handlers
  const handleViewDocs = (project: SCProject) => {
    setSelectedProject(project);
    setShowDocsModal(true);
  };

  const handleAddTeamMember = async () => {
    if (!selectedProject || !newMemberName.trim()) return;

    try {
      const member = await scApi.addTeamMember(selectedProject.id, {
        member_name: newMemberName,
        role: newMemberRole || undefined,
        phone: newMemberPhone || undefined,
        email: newMemberEmail || undefined,
      });
      setProjectTeam([...projectTeam, member]);
      setNewMemberName('');
      setNewMemberRole('');
      setNewMemberPhone('');
      setNewMemberEmail('');
      toast({ title: "Added", description: "Team member added successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to add team member", variant: "destructive" });
    }
  };

  const handleRemoveTeamMember = (memberId: number, memberName: string) => {
    if (!selectedProject) return;

    confirmAction(
      "Remove Team Member?",
      `Remove ${memberName} from this project?`,
      async () => {
        try {
          await scApi.removeTeamMember(selectedProject.id, memberId);
          setProjectTeam(projectTeam.filter(m => m.id !== memberId));
          toast({ title: "Removed", description: "Team member removed" });
        } catch (error) {
          toast({ title: "Error", description: "Failed to remove team member", variant: "destructive" });
        }
      },
      "destructive"
    );
  };

  // Status styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Active': return "bg-green-500/10 text-green-600 dark:text-green-400";
      case 'Completed': return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case 'Bidding': return "bg-accent/10 text-accent";
      case 'On Hold': return "bg-orange-500/10 text-orange-600 dark:text-orange-400";
      case 'Planning': return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (value?: number) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="min-h-full bg-gray-50 dark:bg-[#0f1115] p-6 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-accent/10 text-accent border-accent/20 font-medium uppercase text-[10px] tracking-wider px-2.5 py-0.5">
                Project Management
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white leading-none">
              My Projects
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mt-3 max-w-lg leading-relaxed">
              Manage your active projects, track progress, and coordinate with your field teams.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                resetForm();
                setShowNewProject(true);
              }}
              className="h-11 px-6 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold rounded-xl text-xs"
            >
              <Plus className="w-4 h-4 mr-2" /> New Project
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'ACTIVE PROJECTS', value: stats.activeProjectsCount.toString().padStart(2, '0'), sub: 'IN PROGRESS', icon: Activity, color: 'text-accent' },
            { label: 'COMPLETED', value: stats.completedProjectsCount.toString().padStart(2, '0'), sub: 'FINISHED PROJECTS', icon: TrendingUp, color: 'text-green-500' },
            { label: 'FIELD TEAM', value: stats.totalTeamSize.toString(), sub: 'TOTAL CREW', icon: Users, color: 'text-accent' },
            { label: 'AVG PROGRESS', value: `${stats.averageProgress}%`, sub: 'ACTIVE PROJECTS', icon: Shield, color: 'text-blue-500' },
          ].map((stat, i) => (
            <Card key={i} className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5 rounded-2xl overflow-hidden group transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-gray-50 dark:bg-black/20 rounded-xl group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300 border border-gray-100 dark:border-white/5">
                    <stat.icon className="w-4 h-4 transition-colors" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{stat.label}</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{stat.value}</h3>
                  <p className={cn("text-[10px] font-bold uppercase tracking-wider", stat.color)}>{stat.sub}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-xl"
            />
          </div>

          <div className="flex items-center gap-3">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-11 w-40 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-xl">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="progress">Progress</SelectItem>
                <SelectItem value="value">Contract Value</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('card')}
                className={cn("h-9 px-3 rounded-lg", viewMode === 'card' && "bg-white dark:bg-white/10 shadow-sm")}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('table')}
                className={cn("h-9 px-3 rounded-lg", viewMode === 'table' && "bg-white dark:bg-white/10 shadow-sm")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/5 h-auto">
            <TabsTrigger value="all" className="px-6 py-2.5 rounded-lg font-semibold text-xs data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              All Projects
            </TabsTrigger>
            <TabsTrigger value="active" className="px-6 py-2.5 rounded-lg font-semibold text-xs data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              Active
            </TabsTrigger>
            <TabsTrigger value="bidding" className="px-6 py-2.5 rounded-lg font-semibold text-xs data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              Bidding
            </TabsTrigger>
            <TabsTrigger value="completed" className="px-6 py-2.5 rounded-lg font-semibold text-xs data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              Completed
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="py-32 flex flex-col items-center justify-center text-center bg-white dark:bg-[#1c1e24] rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
                <div className="w-16 h-16 bg-gray-50 dark:bg-black/20 rounded-2xl flex items-center justify-center mb-6">
                  <Inbox className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Projects Found</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-sm max-w-xs">
                  {activeTab === 'all' ? 'Create your first project to get started.' : `No ${activeTab} projects yet.`}
                </p>
                <Button onClick={() => setShowNewProject(true)} className="mt-6 bg-accent text-accent-foreground">
                  <Plus className="w-4 h-4 mr-2" /> Create Project
                </Button>
              </div>
            ) : (
              filteredProjects.map((project) => (
                <Card key={project.id} className="group bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Project Info */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-accent transition-colors">
                                {project.name}
                              </h3>
                              <Badge className={cn("border-none font-semibold text-[10px] px-2.5 py-0.5", getStatusStyle(project.status))}>
                                {project.status}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                              {project.client && (
                                <span className="flex items-center gap-1.5">
                                  <Building className="w-3.5 h-3.5 text-accent" /> {project.client}
                                </span>
                              )}
                              {(project.city || project.state) && (
                                <span className="flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-accent" /> {project.city}{project.city && project.state && ', '}{project.state}
                                </span>
                              )}
                              {project.trade && (
                                <span className="flex items-center gap-1.5">
                                  <Wrench className="w-3.5 h-3.5 text-accent" /> {project.trade}
                                </span>
                              )}
                              {project.contract_value && (
                                <span className="flex items-center gap-1.5 text-accent font-semibold">
                                  <DollarSign className="w-3.5 h-3.5" /> {formatCurrency(project.contract_value)}
                                </span>
                              )}
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-9 w-9">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => handleViewProject(project)}>
                                <Eye className="w-4 h-4 mr-2" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditProject(project)}>
                                <Edit className="w-4 h-4 mr-2" /> Edit Project
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleViewTeam(project)}>
                                <Users className="w-4 h-4 mr-2" /> Manage Team
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleViewDocs(project)}>
                                <FileText className="w-4 h-4 mr-2" /> Documents
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDeleteProject(project.id)} className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Progress */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium text-gray-400">Progress</span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>

                        {/* Meta info */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
                          {project.phase && (
                            <div>
                              <span className="text-[10px] font-medium text-gray-400 uppercase block">Phase</span>
                              <span className="text-xs font-semibold text-gray-900 dark:text-white">{project.phase}</span>
                            </div>
                          )}
                          <div>
                            <span className="text-[10px] font-medium text-gray-400 uppercase block">Team Size</span>
                            <span className="text-xs font-semibold text-gray-900 dark:text-white">{project.team_size} members</span>
                          </div>
                          {project.start_date && (
                            <div>
                              <span className="text-[10px] font-medium text-gray-400 uppercase block">Start Date</span>
                              <span className="text-xs font-semibold text-gray-900 dark:text-white">{new Date(project.start_date).toLocaleDateString()}</span>
                            </div>
                          )}
                          {project.expected_completion_date && (
                            <div>
                              <span className="text-[10px] font-medium text-gray-400 uppercase block">Due Date</span>
                              <span className="text-xs font-semibold text-gray-900 dark:text-white">{new Date(project.expected_completion_date).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 min-w-[200px] justify-center pt-4 lg:pt-0 lg:pl-6 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-white/5">
                        <Button
                          onClick={() => handleViewProject(project)}
                          className="h-10 bg-gray-900 dark:bg-accent text-white dark:text-accent-foreground font-semibold text-xs rounded-xl"
                        >
                          View Details <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleViewTeam(project)}
                          className="h-10 font-semibold text-xs rounded-xl"
                        >
                          <UserPlus className="w-4 h-4 mr-2" /> Manage Team
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Create/Edit Project Modal */}
      <Dialog open={showNewProject} onOpenChange={setShowNewProject}>
        <DialogContent className="sm:max-w-2xl bg-white dark:bg-[#1c1e24] border-none rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {isEditing ? 'Edit Project' : 'Create New Project'}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update your project details.' : 'Fill in the details to create a new project.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Project Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter project name"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label>Client / GC</Label>
                <Input
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  placeholder="Client or GC name"
                  className="h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Trade</Label>
                <Select value={formData.trade} onValueChange={(v) => setFormData({ ...formData, trade: v })}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select trade" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRADES.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v: any) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_STATUSES.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="City"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="TX"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label>Contract Value</Label>
                <Input
                  type="number"
                  value={formData.contract_value}
                  onChange={(e) => setFormData({ ...formData, contract_value: e.target.value })}
                  placeholder="50000"
                  className="h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label>Expected Completion</Label>
                <Input
                  type="date"
                  value={formData.expected_completion_date}
                  onChange={(e) => setFormData({ ...formData, expected_completion_date: e.target.value })}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label>Progress (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
                  className="h-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Phase</Label>
              <Input
                value={formData.phase}
                onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                placeholder="e.g., Foundation, Framing, Finishing"
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Project description..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => { setShowNewProject(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject} className="bg-accent text-accent-foreground">
              {isEditing ? 'Update Project' : 'Create Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Project Details Modal */}
      <Dialog open={showProjectDetails} onOpenChange={setShowProjectDetails}>
        <DialogContent className="sm:max-w-xl bg-white dark:bg-[#1c1e24] border-none rounded-2xl">
          <div className="h-2 bg-accent w-full absolute top-0 left-0 rounded-t-2xl" />
          <DialogHeader className="pt-4">
            <div className="flex items-center gap-3 mb-2">
              <Badge className={cn("border-none font-semibold text-xs", getStatusStyle(selectedProject?.status || ''))}>
                {selectedProject?.status}
              </Badge>
              {selectedProject?.trade && (
                <Badge variant="outline" className="text-xs">
                  {selectedProject.trade}
                </Badge>
              )}
            </div>
            <DialogTitle className="text-2xl font-bold">{selectedProject?.name}</DialogTitle>
            <DialogDescription className="flex flex-wrap items-center gap-4">
              {selectedProject?.client && (
                <span className="flex items-center gap-2"><Building className="w-4 h-4 text-accent" /> {selectedProject.client}</span>
              )}
              {(selectedProject?.city || selectedProject?.state) && (
                <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-accent" /> {selectedProject?.city}{selectedProject?.city && selectedProject?.state && ', '}{selectedProject?.state}</span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 my-6">
            <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-xl">
              <span className="text-xs font-medium text-gray-400 block mb-1">Contract Value</span>
              <span className="text-xl font-bold text-accent">{formatCurrency(selectedProject?.contract_value)}</span>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-xl">
              <span className="text-xs font-medium text-gray-400 block mb-1">Phase</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">{selectedProject?.phase || 'N/A'}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs font-medium text-gray-400">Progress</span>
                <span className="text-sm font-bold">{selectedProject?.progress}%</span>
              </div>
              <Progress value={selectedProject?.progress || 0} className="h-3" />
            </div>

            {selectedProject?.description && (
              <div className="p-4 bg-accent/5 border border-accent/10 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedProject.description}</p>
              </div>
            )}
          </div>

          <DialogFooter className="mt-6 flex gap-3">
            <Button variant="ghost" onClick={() => setShowProjectDetails(false)}>Close</Button>
            <Button variant="outline" onClick={() => selectedProject && handleEditProject(selectedProject)}>
              <Edit className="w-4 h-4 mr-2" /> Edit
            </Button>
            <Button variant="outline" onClick={() => selectedProject && handleViewDocs(selectedProject)}>
              <FileText className="w-4 h-4 mr-2" /> Documents
            </Button>
            <Button className="bg-accent text-accent-foreground" onClick={() => selectedProject && handleViewTeam(selectedProject)}>
              <Users className="w-4 h-4 mr-2" /> View Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Team Management Modal */}
      <Dialog open={showTeamModal} onOpenChange={setShowTeamModal}>
        <DialogContent className="sm:max-w-lg bg-white dark:bg-[#1c1e24] border-none rounded-2xl">
          <DialogHeader>
            <DialogTitle>Project Team - {selectedProject?.name}</DialogTitle>
            <DialogDescription>Manage your field team for this project.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            {/* Add new member */}
            <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-xl space-y-3">
              <h4 className="text-sm font-semibold">Add Team Member</h4>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Name *"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="h-9"
                />
                <Input
                  placeholder="Role"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Phone"
                  value={newMemberPhone}
                  onChange={(e) => setNewMemberPhone(e.target.value)}
                  className="h-9"
                />
                <Input
                  placeholder="Email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="h-9"
                />
              </div>
              <Button onClick={handleAddTeamMember} disabled={!newMemberName.trim()} className="w-full h-9 bg-accent text-accent-foreground">
                <UserPlus className="w-4 h-4 mr-2" /> Add Member
              </Button>
            </div>

            {/* Team list */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {projectTeam.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No team members yet</p>
              ) : (
                projectTeam.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-white dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/10">
                    <div>
                      <p className="font-semibold text-sm">{member.member_name}</p>
                      <p className="text-xs text-gray-400">{member.role || 'Team Member'}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveTeamMember(member.id, member.member_name)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowTeamModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog */}
      <AlertDialog open={alertConfig.isOpen} onOpenChange={(open) => setAlertConfig({ ...alertConfig, isOpen: open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertConfig.title}</AlertDialogTitle>
            <AlertDialogDescription>{alertConfig.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                alertConfig.onConfirm();
                setAlertConfig({ ...alertConfig, isOpen: false });
              }}
              className={alertConfig.variant === 'destructive' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Documents Modal */}
      <Dialog open={showDocsModal} onOpenChange={setShowDocsModal}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] bg-white dark:bg-[#1c1e24] border-none rounded-2xl overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              Documents - {selectedProject?.name}
            </DialogTitle>
            <DialogDescription>
              Manage documents for this project. Upload, view, download, and organize files.
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[70vh] -mx-6 px-6">
            {selectedProject && (
              <ProjectDocuments projectId={selectedProject.id} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SCMyProjects;
