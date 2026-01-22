import React, { useState, useEffect } from 'react';
import { getProjects, createProject as createProjectAPI, initializeFreshUserData } from '@/services/gcDashboardService';
import { Card, CardContent } from '@/components/ui/card';
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
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  Building,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Users,
  FileText,
  MessageSquare,
  ArrowRight,
  Filter,
  Search,
  Calendar,
  MoreHorizontal,
  Plus,
  Upload,
  X,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Gavel,
  FileUp,
  Download,
  Eye,
  Trash2,
  TrendingUp,
  TrendingDown,
  Award,
  Shield,
  HardHat,
  Zap,
  CheckCircle,
  AlertCircle,
  Grid3x3,
  List
} from 'lucide-react';

const MyProjects = () => {
  const { toast } = useToast();
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [showTeamInvite, setShowTeamInvite] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [bidAmount, setBidAmount] = useState('');
  const [bidDuration, setBidDuration] = useState('');
  const [bidProposal, setBidProposal] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  
  // New Project Form State
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectLocation, setNewProjectLocation] = useState('');
  const [newProjectClient, setNewProjectClient] = useState('');
  const [newProjectBudget, setNewProjectBudget] = useState('');
  const [newProjectDuration, setNewProjectDuration] = useState('');
  const [newProjectStatus, setNewProjectStatus] = useState('Planning');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  const [projects, setProjects] = useState<any[]>([
    {
      id: 1,
      name: 'Downtown Office Renovation',
      location: 'Austin, TX',
      jobNumber: 'Job #23-401',
      client: 'Metro Properties LLC',
      status: 'In Progress',
      statusColor: 'green',
      timeline: { current: 12, total: 24, percentage: 50 },
      budget: { spent: 650000, total: 1200000, percentage: 54, variance: '+2.1%' },
      completion: 'Dec 15, 2024',
      teamSize: 11,
      bidStatus: 'Awarded',
      documents: 12,
      rfiCount: 3,
      changeOrders: 2,
      milestones: { completed: 8, total: 15 }
    },
    {
      id: 2,
      name: 'Riverside Apartments Phase 2',
      location: 'San Antonio, TX',
      jobNumber: 'Job #23-405',
      client: 'Riverside Development Group',
      status: 'Bidding',
      statusColor: 'yellow',
      timeline: { current: 0, total: 36, percentage: 0 },
      budget: { estimated: 4500000, bidAmount: 0, percentage: 0 },
      completion: 'Bid Due: Nov 20, 2024',
      teamSize: 0,
      bidStatus: 'Pending',
      documents: 3,
      rfiCount: 0,
      changeOrders: 0,
      milestones: { completed: 0, total: 0 }
    },
    {
      id: 3,
      name: 'Medical Center Expansion',
      location: 'Dallas, TX',
      jobNumber: 'Job #23-410',
      client: 'Dallas Healthcare Systems',
      status: 'Planning',
      statusColor: 'blue',
      timeline: { current: 2, total: 48, percentage: 4 },
      budget: { spent: 200000, total: 2800000, percentage: 7, variance: '0%' },
      completion: 'Est. Completion: Jun 2025',
      teamSize: 8,
      bidStatus: 'Awarded',
      documents: 8,
      rfiCount: 5,
      changeOrders: 1,
      milestones: { completed: 2, total: 20 }
    },
    {
      id: 4,
      name: 'Industrial Warehouse Complex',
      location: 'Houston, TX',
      jobNumber: 'Job #23-415',
      client: 'LogiCorp Industries',
      status: 'In Progress',
      statusColor: 'green',
      timeline: { current: 18, total: 30, percentage: 60 },
      budget: { spent: 1800000, total: 3200000, percentage: 56, variance: '-1.2%' },
      completion: 'Jan 30, 2025',
      teamSize: 15,
      bidStatus: 'Awarded',
      documents: 18,
      rfiCount: 7,
      changeOrders: 4,
      milestones: { completed: 12, total: 18 }
    }
  ]);

  const activeProjectsCount = projects.filter(p => p.status === 'In Progress' || p.status === 'Planning').length;
  
  const stats = [
    {
      title: 'Active Projects',
      value: activeProjectsCount.toString(),
      change: '+2 this month',
      icon: Building,
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
      trend: 'up'
    },
    {
      title: 'Pending Bids',
      value: '5',
      change: 'Awaiting response',
      icon: Gavel,
      color: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
      trend: 'neutral'
    },
    {
      title: 'Budget Health',
      value: '98.5%',
      change: 'Under budget',
      icon: DollarSign,
      color: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
      trend: 'up'
    },
    {
      title: 'Team Members',
      value: '24',
      change: 'Across all projects',
      icon: Users,
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
      trend: 'neutral'
    }
  ];


  const teamMembers = [
    { id: 1, name: 'John Smith', role: 'Project Manager', email: 'john@acmeconstruction.com', phone: '(512) 555-0123', status: 'Active' },
    { id: 2, name: 'Sarah Johnson', role: 'Site Supervisor', email: 'sarah@acmeconstruction.com', phone: '(512) 555-0124', status: 'Active' },
    { id: 3, name: 'Mike Davis', role: 'Safety Officer', email: 'mike@acmeconstruction.com', phone: '(512) 555-0125', status: 'Active' },
    { id: 4, name: 'Emily Chen', role: 'Quality Control', email: 'emily@acmeconstruction.com', phone: '(512) 555-0126', status: 'Active' }
  ];

  const documents = [
    { id: 1, name: 'Project Proposal & Scope.pdf', type: 'PDF', size: '2.4 MB', uploaded: '2 days ago', projectId: 1, category: 'Proposal' },
    { id: 2, name: 'Site Plans & Drawings.dwg', type: 'DWG', size: '5.1 MB', uploaded: '5 days ago', projectId: 1, category: 'Drawings' },
    { id: 3, name: 'Safety Compliance Report.pdf', type: 'PDF', size: '1.2 MB', uploaded: '1 week ago', projectId: 1, category: 'Safety' },
    { id: 4, name: 'Change Order #1.pdf', type: 'PDF', size: '856 KB', uploaded: '3 days ago', projectId: 1, category: 'Change Orders' },
    { id: 5, name: 'RFI Response - Electrical.pdf', type: 'PDF', size: '1.8 MB', uploaded: '1 day ago', projectId: 1, category: 'RFIs' },
    { id: 6, name: 'Bid Package - Riverside.zip', type: 'ZIP', size: '12.3 MB', uploaded: '3 days ago', projectId: 2, category: 'Bid Documents' },
    { id: 7, name: 'Project Specifications.pdf', type: 'PDF', size: '3.2 MB', uploaded: '4 days ago', projectId: 2, category: 'Specifications' }
  ];

  const handleBidSubmit = () => {
    if (!bidAmount || !bidDuration || !bidProposal) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Bid Submitted Successfully",
      description: `Your bid of $${parseFloat(bidAmount).toLocaleString()} has been submitted for review.`,
    });
    setShowBidModal(false);
    setBidAmount('');
    setBidDuration('');
    setBidProposal('');
  };

  const handleTeamInvite = () => {
    if (!newMemberName || !newMemberEmail || !newMemberRole) {
      toast({
        title: "Missing Information",
        description: "Please fill in name, email, and role",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Invitation Sent",
      description: `Invitation sent to ${newMemberName} for ${newMemberRole} role.`,
    });
    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberPhone('');
    setNewMemberRole('');
  };

  const handleDocumentUpload = () => {
    toast({
      title: "Document Uploaded",
      description: "Your document has been uploaded successfully.",
    });
  };

  const handleNewProject = async () => {
    if (!newProjectName || !newProjectLocation || !newProjectClient || !newProjectBudget || !newProjectDuration) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const budgetAmount = parseFloat(newProjectBudget);
      const durationWeeks = parseInt(newProjectDuration);
      
      const newProject = await createProjectAPI({
        name: newProjectName,
        location: newProjectLocation,
        client: newProjectClient,
        budget: budgetAmount,
        duration: durationWeeks,
        status: newProjectStatus,
        description: newProjectDescription
      });

      setProjects([...projects, newProject]);
      
      toast({
        title: "Project Created Successfully",
        description: `${newProjectName} has been added to your active projects.`,
      });

      // Reset form
      setNewProjectName('');
      setNewProjectLocation('');
      setNewProjectClient('');
      setNewProjectBudget('');
      setNewProjectDuration('');
      setNewProjectStatus('Planning');
      setNewProjectDescription('');
      setShowNewProject(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive"
      });
    }
  };

  const activeProject = projects.find(p => p.id === selectedProject);
  const projectDocuments = documents.filter(doc => doc.projectId === selectedProject);

  // Load projects from API
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projectsData = await getProjects();
        if (projectsData.length === 0) {
          // Initialize fresh user if no projects
          await initializeFreshUserData();
          const newProjects = await getProjects();
          setProjects(newProjects);
        } else {
          setProjects(projectsData);
        }
      } catch (error) {
        console.error('Error loading projects:', error);
        // Initialize fresh user on error
        await initializeFreshUserData();
        const newProjects = await getProjects();
        setProjects(newProjects);
      }
    };
    
    loadProjects();
  }, []);

  // Listen for new project modal trigger from Header
  useEffect(() => {
    const handleOpenNewProject = () => {
      setShowNewProject(true);
    };
    window.addEventListener('openNewProjectModal', handleOpenNewProject);
    return () => {
      window.removeEventListener('openNewProjectModal', handleOpenNewProject);
    };
  }, []);

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-full">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              My Projects
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your construction projects, submit bids, coordinate teams, and track project documents. All your project management needs in one place.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button 
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold"
              onClick={() => setShowNewProject(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      {stat.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-500" />}
                      {stat.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-500" />}
                      <span>{stat.change}</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Projects List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Projects</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search projects..."
                  className="pl-9 w-64 border-gray-200 dark:border-gray-800"
                />
              </div>
              <div className="flex items-center border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className={`h-9 px-3 ${viewMode === 'table' ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900' : ''}`}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'card' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('card')}
                  className={`h-9 px-3 ${viewMode === 'card' ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900' : ''}`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Table View (Default) */}
          {viewMode === 'table' ? (
            <Card className="border-gray-200 dark:border-gray-800">
              <CardContent className="p-0">
                {projects.length === 0 ? (
                  <div className="p-12 text-center">
                    <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No Projects Yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Get started by creating your first project. Track progress, manage teams, and handle all project documents in one place.
                    </p>
                    <Button
                      onClick={() => setShowNewProject(true)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Project
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Project</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Client</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Timeline</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Budget</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Team</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                        {projects.map((project) => (
                        <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <div className="text-sm font-semibold text-gray-900 dark:text-white">{project.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3" />
                                {project.location}
                              </div>
                              <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{project.jobNumber}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">{project.client}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Badge className={`${
                                project.statusColor === 'green' 
                                  ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800' 
                                  : project.statusColor === 'yellow'
                                  ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
                                  : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                              } border`}>
                                {project.status === 'In Progress' && <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>}
                                {project.status}
                              </Badge>
                              {project.bidStatus === 'Pending' && (
                                <Badge className="bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800 text-xs">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Bid Pending
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-20">
                                <Progress value={project.timeline.percentage} className="h-2" />
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{project.timeline.percentage}%</span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{project.completion}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {project.budget.spent 
                                ? `$${(project.budget.spent / 1000).toFixed(0)}k / $${(project.budget.total / 1000000).toFixed(1)}M`
                                : project.budget.estimated
                                ? `Est: $${(project.budget.estimated / 1000000).toFixed(1)}M`
                                : 'N/A'
                              }
                            </div>
                            {project.budget.variance && (
                              <div className={`text-xs ${parseFloat(project.budget.variance) > 0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}>
                                {project.budget.variance}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-900 dark:text-white">{project.teamSize}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FileText className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-900 dark:text-white">{project.documents}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {project.bidStatus === 'Pending' ? (
                                <Button
                                  onClick={() => {
                                    setSelectedProject(project.id);
                                    setShowBidModal(true);
                                  }}
                                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold h-8 text-xs"
                                  size="sm"
                                >
                                  <Gavel className="w-3 h-3 mr-1" />
                                  Bid
                                </Button>
                              ) : (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedProject(project.id);
                                      setShowTeamInvite(true);
                                    }}
                                    className="h-8 text-xs"
                                  >
                                    <UserPlus className="w-3 h-3 mr-1" />
                                    Team
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedProject(project.id);
                                      setShowDocuments(true);
                                    }}
                                    className="h-8 text-xs"
                                  >
                                    <FileText className="w-3 h-3 mr-1" />
                                    Docs
                                  </Button>
                                </>
                              )}
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            /* Card View */
            <>
              {projects.map((project) => (
            <Card 
              key={project.id} 
              className="border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Project Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                            {project.name}
                          </h4>
                          <Badge className={`${
                            project.statusColor === 'green' 
                              ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800' 
                              : project.statusColor === 'yellow'
                              ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
                              : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                          } border`}>
                            {project.status === 'In Progress' && <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>}
                            {project.status}
                          </Badge>
                          {project.bidStatus === 'Pending' && (
                            <Badge className="bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                              <Clock className="w-3 h-3 mr-1" />
                              Bid Pending
                            </Badge>
                          )}
                          {project.bidStatus === 'Awarded' && (
                            <Badge className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                              <Award className="w-3 h-3 mr-1" />
                              Awarded
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            {project.location}
                          </div>
                          <span>•</span>
                          <span className="font-medium">{project.jobNumber}</span>
                          <span>•</span>
                          <span>{project.client}</span>
                        </div>

                        {/* Project Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <div className="flex justify-between mb-2 text-xs">
                              <span className="text-gray-600 dark:text-gray-400">Timeline Progress</span>
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {project.timeline.percentage}%
                              </span>
                            </div>
                            <Progress value={project.timeline.percentage} className="h-2 mb-2" />
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <Calendar className="w-3 h-3" />
                              {project.completion}
                            </div>
                            {project.milestones.total > 0 && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {project.milestones.completed}/{project.milestones.total} Milestones
                              </div>
                            )}
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <div className="flex justify-between mb-2 text-xs">
                              <span className="text-gray-600 dark:text-gray-400">Budget Status</span>
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {project.budget.spent 
                                  ? `$${(project.budget.spent / 1000).toFixed(0)}k / $${(project.budget.total / 1000000).toFixed(1)}M`
                                  : `Est: $${(project.budget.estimated / 1000000).toFixed(1)}M`
                                }
                              </span>
                            </div>
                            <Progress 
                              value={project.budget.percentage || 0} 
                              className={`h-2 mb-2 ${
                                project.budget.variance && parseFloat(project.budget.variance) > 0
                                  ? '[&>div]:bg-yellow-500'
                                  : '[&>div]:bg-green-500'
                              }`}
                            />
                            {project.budget.variance && (
                              <div className={`flex items-center gap-1 text-xs ${
                                parseFloat(project.budget.variance) > 0
                                  ? 'text-yellow-600 dark:text-yellow-400'
                                  : 'text-green-600 dark:text-green-400'
                              }`}>
                                {parseFloat(project.budget.variance) > 0 ? (
                                  <TrendingUp className="w-3 h-3" />
                                ) : (
                                  <TrendingDown className="w-3 h-3" />
                                )}
                                Variance: {project.budget.variance}
                              </div>
                            )}
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <div className="flex justify-between mb-3 text-xs">
                              <span className="text-gray-600 dark:text-gray-400">Project Resources</span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Team</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {project.teamSize}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Documents</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {project.documents}
                                </span>
                              </div>
                              {project.rfiCount > 0 && (
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-orange-400" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">RFIs</span>
                                  </div>
                                  <Badge className="bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-xs">
                                    {project.rfiCount}
                                  </Badge>
                                </div>
                              )}
                              {project.changeOrders > 0 && (
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-400" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Change Orders</span>
                                  </div>
                                  <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs">
                                    {project.changeOrders}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                          {project.bidStatus === 'Pending' ? (
                            <Button
                              onClick={() => {
                                setSelectedProject(project.id);
                                setShowBidModal(true);
                              }}
                              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold"
                            >
                              <Gavel className="w-4 h-4 mr-2" />
                              Place Bid
                            </Button>
                          ) : (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedProject(project.id);
                                  setShowTeamInvite(true);
                                }}
                              >
                                <UserPlus className="w-4 h-4 mr-2" />
                                Invite Team
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedProject(project.id);
                                  setShowDocuments(true);
                                }}
                              >
                                <FileText className="w-4 h-4 mr-2" />
                                Documents ({project.documents})
                              </Button>
                            </>
                          )}
                          <Button variant="outline" size="sm">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Communicate
                          </Button>
                          <Button variant="outline" size="sm" className="ml-auto">
                            View Details
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="shrink-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))}
            </>
          )}
        </div>
      </div>

      {/* Team Invite Modal */}
      <Dialog open={showTeamInvite} onOpenChange={setShowTeamInvite}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Invite Team Members</DialogTitle>
            <DialogDescription>
              Add team members to <span className="font-semibold">{activeProject?.name}</span>. Team members will receive an invitation email with project access.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Existing Team */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Current Team Members ({teamMembers.length})
              </h4>
              <div className="space-y-2">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-yellow-400 dark:bg-yellow-500 flex items-center justify-center text-gray-900 font-bold text-sm">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{member.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {member.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {member.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        {member.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Invite New Member */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Invite New Team Member
              </h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="memberName" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Full Name *
                  </Label>
                  <Input 
                    id="memberName"
                    placeholder="Enter full name"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="border-gray-200 dark:border-gray-800"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="memberEmail" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Email Address *
                    </Label>
                    <Input 
                      id="memberEmail"
                      type="email" 
                      placeholder="email@example.com"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      className="border-gray-200 dark:border-gray-800"
                    />
                  </div>
                  <div>
                    <Label htmlFor="memberPhone" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Phone Number
                    </Label>
                    <Input 
                      id="memberPhone"
                      type="tel" 
                      placeholder="(512) 555-0123"
                      value={newMemberPhone}
                      onChange={(e) => setNewMemberPhone(e.target.value)}
                      className="border-gray-200 dark:border-gray-800"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="memberRole" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Role / Position *
                  </Label>
                  <Select value={newMemberRole} onValueChange={setNewMemberRole}>
                    <SelectTrigger id="memberRole" className="border-gray-200 dark:border-gray-800">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Project Manager">Project Manager</SelectItem>
                      <SelectItem value="Site Supervisor">Site Supervisor</SelectItem>
                      <SelectItem value="Safety Officer">Safety Officer</SelectItem>
                      <SelectItem value="Quality Control">Quality Control</SelectItem>
                      <SelectItem value="Estimator">Estimator</SelectItem>
                      <SelectItem value="Field Engineer">Field Engineer</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold h-11"
                  onClick={handleTeamInvite}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Send Invitation
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Documents Modal */}
      <Dialog open={showDocuments} onOpenChange={setShowDocuments}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Project Documents</DialogTitle>
            <DialogDescription>
              Manage documents for <span className="font-semibold">{activeProject?.name}</span>. Upload, view, and organize all project-related files.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-yellow-400 dark:hover:border-yellow-500 transition-colors cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Upload Documents</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Drag and drop files here or click to browse. Supports PDF, DWG, DOCX, and image files.
              </p>
              <Button 
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold"
                onClick={handleDocumentUpload}
              >
                <FileUp className="w-4 h-4 mr-2" />
                Select Files to Upload
              </Button>
            </div>

            {/* Documents List */}
            {projectDocuments.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Documents ({projectDocuments.length})
                  </h4>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px] border-gray-200 dark:border-gray-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Documents</SelectItem>
                      <SelectItem value="proposal">Proposals</SelectItem>
                      <SelectItem value="drawings">Drawings</SelectItem>
                      <SelectItem value="safety">Safety</SelectItem>
                      <SelectItem value="rfi">RFIs</SelectItem>
                      <SelectItem value="change-orders">Change Orders</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  {projectDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center shrink-0">
                          <FileText className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white mb-1">{doc.name}</p>
                          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                            <Badge variant="outline" className="text-xs">{doc.category}</Badge>
                            <span>{doc.type}</span>
                            <span>•</span>
                            <span>{doc.size}</span>
                            <span>•</span>
                            <span>{doc.uploaded}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button variant="ghost" size="sm" title="Preview">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Download">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No documents uploaded yet</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Bid Modal */}
      <Dialog open={showBidModal} onOpenChange={setShowBidModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Place Bid</DialogTitle>
            <DialogDescription>
              Submit your professional bid for <span className="font-semibold">{activeProject?.name}</span>. Ensure all information is accurate before submission.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Project Summary */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Project Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Client:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">{activeProject?.client}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Location:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">{activeProject?.location}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Estimated Budget:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    ${activeProject?.budget.estimated ? (activeProject.budget.estimated / 1000000).toFixed(1) + 'M' : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Bid Deadline:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">{activeProject?.completion}</span>
                </div>
              </div>
            </div>

            {/* Bid Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bidAmount" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Bid Amount ($) *
                  </Label>
                  <Input 
                    id="bidAmount"
                    type="number" 
                    placeholder="0.00"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="border-gray-200 dark:border-gray-800"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Enter your total bid amount
                  </p>
                </div>
                <div>
                  <Label htmlFor="bidDuration" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Estimated Duration (weeks) *
                  </Label>
                  <Input 
                    id="bidDuration"
                    type="number" 
                    placeholder="0"
                    value={bidDuration}
                    onChange={(e) => setBidDuration(e.target.value)}
                    className="border-gray-200 dark:border-gray-800"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Expected project timeline
                  </p>
                </div>
              </div>
              <div>
                <Label htmlFor="bidProposal" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Bid Proposal & Approach *
                </Label>
                <Textarea 
                  id="bidProposal"
                  placeholder="Describe your approach, methodology, timeline, key deliverables, and why you're the best fit for this project..."
                  value={bidProposal}
                  onChange={(e) => setBidProposal(e.target.value)}
                  className="border-gray-200 dark:border-gray-800 min-h-[150px]"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Provide a detailed proposal outlining your approach and capabilities
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Attach Supporting Documents
                </Label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                  <FileUp className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Upload bid documents, certifications, references, or portfolio samples
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    PDF, DOCX, or ZIP files (Max 50MB)
                  </p>
                  <Button variant="outline" size="sm">
                    Select Files
                  </Button>
                </div>
              </div>
            </div>

            {/* Submit Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <Button 
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold h-11"
                onClick={handleBidSubmit}
              >
                <Gavel className="w-4 h-4 mr-2" />
                Submit Bid
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowBidModal(false);
                  setBidAmount('');
                  setBidDuration('');
                  setBidProposal('');
                }}
                className="h-11"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Project Modal */}
      <Dialog open={showNewProject} onOpenChange={setShowNewProject}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Plus className="w-6 h-6" />
              Post New Project
            </DialogTitle>
            <DialogDescription>
              Create a new construction project. Fill in the details below to add it to your active projects list.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Project Basic Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white text-lg border-b border-gray-200 dark:border-gray-800 pb-2">
                Project Information
              </h4>
              <div>
                <Label htmlFor="projectName" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Project Name *
                </Label>
                <Input 
                  id="projectName"
                  placeholder="e.g., Downtown Office Renovation"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="border-gray-200 dark:border-gray-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projectLocation" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Location *
                  </Label>
                  <Input 
                    id="projectLocation"
                    placeholder="e.g., Austin, TX"
                    value={newProjectLocation}
                    onChange={(e) => setNewProjectLocation(e.target.value)}
                    className="border-gray-200 dark:border-gray-800"
                  />
                </div>
                <div>
                  <Label htmlFor="projectClient" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Client Name *
                  </Label>
                  <Input 
                    id="projectClient"
                    placeholder="e.g., Metro Properties LLC"
                    value={newProjectClient}
                    onChange={(e) => setNewProjectClient(e.target.value)}
                    className="border-gray-200 dark:border-gray-800"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="projectDescription" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Project Description
                </Label>
                <Textarea 
                  id="projectDescription"
                  placeholder="Describe the project scope, requirements, and key details..."
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  className="border-gray-200 dark:border-gray-800 min-h-[100px]"
                />
              </div>
            </div>

            {/* Project Details */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white text-lg border-b border-gray-200 dark:border-gray-800 pb-2">
                Project Details
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projectBudget" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Total Budget ($) *
                  </Label>
                  <Input 
                    id="projectBudget"
                    type="number"
                    placeholder="0.00"
                    value={newProjectBudget}
                    onChange={(e) => setNewProjectBudget(e.target.value)}
                    className="border-gray-200 dark:border-gray-800"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Enter the total project budget
                  </p>
                </div>
                <div>
                  <Label htmlFor="projectDuration" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Estimated Duration (weeks) *
                  </Label>
                  <Input 
                    id="projectDuration"
                    type="number"
                    placeholder="0"
                    value={newProjectDuration}
                    onChange={(e) => setNewProjectDuration(e.target.value)}
                    className="border-gray-200 dark:border-gray-800"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Expected project timeline in weeks
                  </p>
                </div>
              </div>
              <div>
                <Label htmlFor="projectStatus" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Project Status *
                </Label>
                <Select value={newProjectStatus} onValueChange={setNewProjectStatus}>
                  <SelectTrigger id="projectStatus" className="border-gray-200 dark:border-gray-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Bidding">Bidding</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Select the current status of the project
                </p>
              </div>
            </div>

            {/* Project Preview */}
            {(newProjectName || newProjectLocation || newProjectClient) && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Project Preview
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">Name:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{newProjectName || 'Not set'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">Location:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{newProjectLocation || 'Not set'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">Client:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{newProjectClient || 'Not set'}</span>
                  </div>
                  {newProjectBudget && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">Budget:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        ${parseFloat(newProjectBudget).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {newProjectDuration && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{newProjectDuration} weeks</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Submit Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <Button 
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold h-11"
                onClick={handleNewProject}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create & Activate Project
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowNewProject(false);
                  setNewProjectName('');
                  setNewProjectLocation('');
                  setNewProjectClient('');
                  setNewProjectBudget('');
                  setNewProjectDuration('');
                  setNewProjectStatus('Planning');
                  setNewProjectDescription('');
                }}
                className="h-11"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyProjects;
