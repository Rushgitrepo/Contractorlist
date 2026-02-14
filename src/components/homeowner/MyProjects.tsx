import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  Calendar,
  MapPin,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  MoreVertical,
  Eye,
  Edit,
  Share,
  FileText,
  MessageSquare,
  Plus,
  Filter,
  Phone,
  Target,
  Zap,
  Activity,
  BarChart3,
  Users
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import CreateProjectDialog from './CreateProjectDialog';

const MyProjects = () => {
  const [selectedProject, setSelectedProject] = useState('kitchen');
  const [isLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [manageProjectOpen, setManageProjectOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<string | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const projects = [
    {
      id: 'kitchen',
      name: 'Kitchen Renovation',
      status: 'In Progress',
      priority: 'High',
      progress: 68,
      phase: 'Cabinet Installation',
      location: '123 Maple Dr, Austin, TX',
      projectId: '#PRJ-2024-001',
      budget: 25000,
      spent: 16250,
      remaining: 8750,
      contractor: 'Elite Builders',
      contractorPhone: '+1 (555) 123-4567',
      contractorEmail: 'contact@elitebuilders.com',
      timeline: 'Ahead by 3 days',
      startDate: '2024-01-15',
      endDate: '2024-03-15',
      nextMilestone: 'Countertop Installation',
      milestoneDate: '2024-02-20',
      image: '/home1.jpeg',
      lastUpdate: '2 hours ago',
      completionRate: 68,
      budgetUtilization: 65,
      timelineHealth: 'ahead'
    },
    {
      id: 'patio',
      name: 'Backyard ADU Construction',
      status: 'Planning',
      priority: 'Medium',
      progress: 25,
      phase: 'Permit Approval',
      location: '123 Maple Dr, Austin, TX',
      projectId: '#PRJ-2024-002',
      budget: 45000,
      spent: 8500,
      remaining: 36500,
      contractor: 'Metro Builders',
      contractorPhone: '+1 (555) 987-6543',
      contractorEmail: 'info@metrobuilders.com',
      timeline: 'On schedule',
      startDate: '2024-02-01',
      endDate: '2024-08-01',
      nextMilestone: 'Foundation Prep',
      milestoneDate: '2024-03-01',
      image: '/home2.jpeg',
      lastUpdate: '1 day ago',
      completionRate: 25,
      budgetUtilization: 19,
      timelineHealth: 'on-track'
    },
    {
      id: 'bathroom',
      name: 'Master Bathroom Remodel',
      status: 'Bidding',
      priority: 'Low',
      progress: 5,
      phase: 'Contractor Selection',
      location: '123 Maple Dr, Austin, TX',
      projectId: '#PRJ-2024-003',
      budget: 18000,
      spent: 500,
      remaining: 17500,
      contractor: 'TBD',
      contractorPhone: '',
      contractorEmail: '',
      timeline: 'Not started',
      startDate: '2024-04-01',
      endDate: '2024-06-01',
      nextMilestone: 'Design Finalization',
      milestoneDate: '2024-03-15',
      image: '/home3.jpeg',
      lastUpdate: '3 days ago',
      completionRate: 5,
      budgetUtilization: 3,
      timelineHealth: 'planning'
    }
  ];

  const recentActivity = [
    {
      type: 'milestone',
      title: 'Cabinet Installation Started',
      description: 'Elite Builders began cabinet installation phase',
      time: '2 hours ago',
      icon: CheckCircle,
      color: 'text-green-600',
      project: 'Kitchen Renovation'
    },
    {
      type: 'payment',
      title: 'Payment Processed',
      description: '$3,250 payment approved for materials',
      time: '5 hours ago',
      icon: DollarSign,
      color: 'text-accent',
      project: 'Kitchen Renovation'
    },
    {
      type: 'document',
      title: 'Permit Approved',
      description: 'Building permit #BP-2024-0892 approved',
      time: '1 day ago',
      icon: FileText,
      color: 'text-orange-600',
      project: 'Backyard ADU'
    },
    {
      type: 'message',
      title: 'New Message from Contractor',
      description: 'Elite Builders sent project update',
      time: '2 days ago',
      icon: MessageSquare,
      color: 'text-purple-600',
      project: 'Kitchen Renovation'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return 'bg-accent/20 text-accent border-accent/30';
      case 'Planning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Bidding': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'On Hold': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTimelineHealth = (health: string) => {
    switch (health) {
      case 'ahead': return { color: 'text-green-600', bg: 'bg-green-50', icon: TrendingUp };
      case 'on-track': return { color: 'text-accent', bg: 'bg-accent/10', icon: Target };
      case 'behind': return { color: 'text-red-600', bg: 'bg-red-50', icon: AlertTriangle };
      default: return { color: 'text-gray-600', bg: 'bg-gray-50', icon: Clock };
    }
  };

  const selectedProjectData = projects.find(p => p.id === selectedProject) || projects[0];
  const timelineHealth = getTimelineHealth(selectedProjectData.timelineHealth);

  return (
    <div className="p-6 space-y-8 bg-gray-50/50 dark:bg-slate-950/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Projects
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Track progress, manage budgets, and coordinate with contractors
          </p>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Activity className="w-4 h-4 text-green-500" />
              <span>Real-time updates</span>
            </div>
            <div className="flex items-center gap-1">
              <BarChart3 className="w-4 h-4 text-accent" />
              <span>Budget tracking</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-accent" />
              <span>AI insights</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 hover:bg-accent/10 border-accent/20 text-accent">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button onClick={() => setCreateProjectOpen(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg font-semibold gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-accent">Active Projects</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">3</p>
              </div>
              <div className="p-3 bg-accent/20 rounded-full">
                <Activity className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total Budget</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">$88K</p>
              </div>
              <div className="p-3 bg-gray-200 dark:bg-gray-800 rounded-full">
                <DollarSign className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Avg Progress</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">33%</p>
              </div>
              <div className="p-3 bg-gray-200 dark:bg-gray-800 rounded-full">
                <Target className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">On Schedule</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">2/3</p>
              </div>
              <div className="p-3 bg-gray-200 dark:bg-gray-800 rounded-full">
                <Clock className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Project List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Projects</h2>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
          
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-16 w-16 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              </Card>
            ))
          ) : (
            projects.map((project) => (
              <Card 
                key={project.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-xl ${
                  selectedProject === project.id 
                    ? 'ring-2 ring-accent shadow-lg bg-gradient-to-r from-accent/5 to-yellow-50/30 dark:from-accent/10 dark:to-yellow-900/10' 
                    : 'hover:shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm'
                }`}
                onClick={() => setSelectedProject(project.id)}
              >
                <CardContent className="p-5">
                  <div className="flex gap-4 mb-4">
                    <div 
                      className="w-16 h-16 rounded-xl bg-cover bg-center flex-shrink-0 shadow-md ring-2 ring-white"
                      style={{ backgroundImage: `url(${project.image})` }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-base text-gray-900 dark:text-white truncate pr-2">
                          {project.name}
                        </h3>
                        <div className="flex gap-1">
                          <Badge className={`${getStatusColor(project.status)} text-xs font-semibold`}>
                            {project.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate mb-2 font-medium">
                        {project.projectId} • {project.contractor}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{project.timeline}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          <span>${(project.spent / 1000).toFixed(0)}K spent</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-600">
                        {project.phase}
                      </span>
                      <span className="text-accent">{project.progress}%</span>
                    </div>
                    <div className="relative">
                      <Progress value={project.progress} className="h-2 bg-gray-100" />
                      <div 
                        className="absolute top-0 left-0 h-2 bg-gradient-to-r from-accent to-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Updated {project.lastUpdate}</span>
                      <Badge className={`${getPriorityColor(project.priority)} text-xs`}>
                        {project.priority}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Project Details */}
        <div className="lg:col-span-8">
          <Card className="h-full shadow-xl border-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-accent/5 dark:from-gray-800 dark:to-accent/10">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-20 h-20 rounded-xl bg-cover bg-center shadow-lg ring-4 ring-white dark:ring-gray-800"
                    style={{ backgroundImage: `url(${selectedProjectData.image})` }}
                  />
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {selectedProjectData.name}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin className="w-4 h-4" />
                        123 Maple Dr, Austin
                      </span>
                      <span>•</span>
                      <span className="font-medium">ID: {selectedProjectData.projectId}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={`${getStatusColor(selectedProjectData.status)} font-semibold`}>
                        {selectedProjectData.status}
                      </Badge>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${timelineHealth.bg}`}>
                        <timelineHealth.icon className={`w-4 h-4 ${timelineHealth.color}`} />
                        <span className={`text-xs font-semibold ${timelineHealth.color}`}>
                          {selectedProjectData.timeline}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 hover:bg-accent/10"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Project link copied to clipboard!');
                    }}
                  >
                    <Share className="w-4 h-4" />
                    Share
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 hover:bg-accent/10"
                    onClick={() => {
                      if (selectedProjectData.contractorPhone) {
                        window.location.href = `tel:${selectedProjectData.contractorPhone}`;
                      } else {
                        alert('No phone number available');
                      }
                    }}
                  >
                    <Phone className="w-4 h-4" />
                    Call Contractor
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2"
                    onClick={() => setManageProjectOpen(true)}
                  >
                    <Edit className="w-4 h-4" />
                    Manage
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-5 bg-gray-100 dark:bg-gray-800">
                  <TabsTrigger value="overview" className="font-semibold">Overview</TabsTrigger>
                  <TabsTrigger value="timeline" className="font-semibold">Timeline</TabsTrigger>
                  <TabsTrigger value="budget" className="font-semibold">Budget</TabsTrigger>
                  <TabsTrigger value="documents" className="font-semibold">Documents</TabsTrigger>
                  <TabsTrigger value="team" className="font-semibold">Team</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Progress Widget */}
                    <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                      <CardHeader>
                        <CardTitle className="text-base font-bold text-accent flex items-center gap-2">
                          <Target className="w-5 h-5" />
                          Project Progress
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-6 mb-6">
                          <div className="relative size-20 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                              <path
                                className="text-gray-200"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                              />
                              <path
                                className="text-accent"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeDasharray={`${selectedProjectData.progress}, 100`}
                                strokeWidth="3"
                              />
                            </svg>
                            <span className="absolute text-lg font-bold text-accent">
                              {selectedProjectData.progress}%
                            </span>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                              {selectedProjectData.phase}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              Next: {selectedProjectData.nextMilestone}
                            </p>
                            <p className="text-xs text-gray-500">
                              Due: {new Date(selectedProjectData.milestoneDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300 line-through">Demolition Complete</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-accent border-2 border-white dark:border-gray-800 shadow-sm" />
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">Cabinet Installation</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-800" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Countertop Installation</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-800" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Final Inspection</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Budget Widget */}
                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base font-bold text-green-900 dark:text-green-300 flex items-center gap-2">
                            <DollarSign className="w-5 h-5" />
                            Budget Overview
                          </CardTitle>
                          <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-semibold">
                            On Track
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-baseline gap-2 mb-2">
                              <span className="text-2xl font-bold text-green-900 dark:text-green-300">
                                ${(selectedProjectData.spent / 1000).toFixed(1)}K
                              </span>
                              <span className="text-sm text-green-700 dark:text-green-400">
                                of ${(selectedProjectData.budget / 1000).toFixed(0)}K spent
                              </span>
                            </div>
                            
                            <div className="relative mb-4">
                              <div className="w-full bg-green-100 dark:bg-green-900/30 rounded-full h-3 overflow-hidden">
                                <div 
                                  className="bg-gradient-to-r from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600 h-full rounded-full transition-all duration-500" 
                                  style={{ width: `${selectedProjectData.budgetUtilization}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div className="size-3 rounded-full bg-green-500" />
                                <span className="text-gray-700 dark:text-gray-300">Materials</span>
                              </div>
                              <span className="font-semibold text-gray-900 dark:text-white">$9,800</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div className="size-3 rounded-full bg-green-400" />
                                <span className="text-gray-700 dark:text-gray-300">Labor</span>
                              </div>
                              <span className="font-semibold text-gray-900 dark:text-white">$6,450</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div className="size-3 rounded-full bg-green-300" />
                                <span className="text-gray-700 dark:text-gray-300">Remaining</span>
                              </div>
                              <span className="font-semibold text-green-600 dark:text-green-400">$8,750</span>
                            </div>
                          </div>

                          <Button variant="outline" className="w-full hover:bg-green-50 dark:hover:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400">
                            View Detailed Breakdown
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* AI Insights & Activity */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {/* AI Insight */}
                    <Card className="md:col-span-2 bg-gradient-to-br from-accent/10 to-yellow-50/30 dark:from-accent/20 dark:to-yellow-900/20 border-accent/20">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-accent text-base font-bold">
                          <Zap className="w-5 h-5" />
                          AI Insights
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-accent/20">
                            <p className="text-sm text-gray-800 dark:text-gray-200 font-medium mb-2">
                              Timeline Optimization
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                              Order countertops by Friday to maintain your 3-day lead. I found 3 suppliers with immediate availability.
                            </p>
                          </div>
                          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-accent/20">
                            <p className="text-sm text-gray-800 dark:text-gray-200 font-medium mb-2">
                              Budget Alert
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                              You're 5% under budget. Consider upgrading fixtures or adding contingency.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="md:col-span-3">
                      <CardHeader>
                        <CardTitle className="text-base font-bold">Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                              <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800`}>
                                <activity.icon className={`w-4 h-4 ${activity.color}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{activity.description}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{activity.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="timeline" className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Milestones</h3>
                    <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Milestone
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {[
                      { id: '1', name: 'Demolition', status: 'completed', date: '2024-01-20', progress: 100 },
                      { id: '2', name: 'Cabinet Installation', status: 'in-progress', date: '2024-02-15', progress: 68 },
                      { id: '3', name: 'Countertop Installation', status: 'pending', date: '2024-02-28', progress: 0 },
                      { id: '4', name: 'Final Inspection', status: 'pending', date: '2024-03-15', progress: 0 },
                    ].map((milestone) => (
                      <Card key={milestone.id} className="border-gray-200 dark:border-gray-800">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="mt-1">
                                {milestone.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-600" />}
                                {milestone.status === 'in-progress' && <Clock className="w-5 h-5 text-accent" />}
                                {milestone.status === 'pending' && <div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                              </div>
                              <div className="flex-1">
                                {editingMilestone === milestone.id ? (
                                  <Input
                                    defaultValue={milestone.name}
                                    className="mb-2"
                                    onBlur={() => setEditingMilestone(null)}
                                    autoFocus
                                  />
                                ) : (
                                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                                    {milestone.name}
                                  </h4>
                                )}
                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(milestone.date).toLocaleDateString()}</span>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      'text-xs',
                                      milestone.status === 'completed' && 'border-green-200 text-green-700',
                                      milestone.status === 'in-progress' && 'border-accent/30 text-accent',
                                      milestone.status === 'pending' && 'border-gray-200 text-gray-600'
                                    )}
                                  >
                                    {milestone.status === 'completed' && 'Completed'}
                                    {milestone.status === 'in-progress' && 'In Progress'}
                                    {milestone.status === 'pending' && 'Pending'}
                                  </Badge>
                                </div>
                                {milestone.status === 'in-progress' && (
                                  <div className="mt-3">
                                    <div className="flex items-center justify-between text-xs mb-1">
                                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                                      <span className="font-medium text-gray-900 dark:text-white">{milestone.progress}%</span>
                                    </div>
                                    <Progress value={milestone.progress} className="h-2" />
                                  </div>
                                )}
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setEditingMilestone(milestone.id)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>Mark as Complete</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="budget" className="space-y-4">
                  <Card className="border-gray-200 dark:border-gray-800">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Budget Breakdown</CardTitle>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Budget
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Total Budget Overview */}
                        <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Total Budget</p>
                              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                ${selectedProjectData.budget.toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500 dark:text-gray-400">Spent</p>
                              <p className="text-3xl font-bold text-accent">
                                ${selectedProjectData.spent.toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500 dark:text-gray-400">Remaining</p>
                              <p className="text-3xl font-bold text-green-600">
                                ${selectedProjectData.remaining.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <Progress value={(selectedProjectData.spent / selectedProjectData.budget) * 100} className="h-3" />
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            {Math.round((selectedProjectData.spent / selectedProjectData.budget) * 100)}% of budget used
                          </p>
                        </div>

                        {/* Budget Categories */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900 dark:text-white">Expense Categories</h4>
                          {[
                            { name: 'Materials', amount: 9800, budget: 12000, color: 'bg-accent' },
                            { name: 'Labor', amount: 6450, budget: 10000, color: 'bg-blue-500' },
                            { name: 'Permits & Fees', amount: 0, budget: 1500, color: 'bg-purple-500' },
                            { name: 'Contingency', amount: 0, budget: 1500, color: 'bg-gray-500' },
                          ].map((category) => (
                            <div key={category.name} className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-900 dark:text-white">{category.name}</span>
                                <div className="text-right">
                                  <span className="font-semibold text-gray-900 dark:text-white">
                                    ${category.amount.toLocaleString()}
                                  </span>
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {' '}/ ${category.budget.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              <div className="relative">
                                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                                  <div
                                    className={`${category.color} h-2 rounded-full transition-all duration-500`}
                                    style={{ width: `${(category.amount / category.budget) * 100}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Recent Transactions */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-900 dark:text-white">Recent Transactions</h4>
                            <Button size="sm" variant="outline">
                              <Plus className="w-4 h-4 mr-2" />
                              Add Expense
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {[
                              { date: '2024-02-10', description: 'Cabinet materials', amount: 3250, category: 'Materials' },
                              { date: '2024-02-08', description: 'Labor - Week 3', amount: 2100, category: 'Labor' },
                              { date: '2024-02-05', description: 'Countertop deposit', amount: 1500, category: 'Materials' },
                            ].map((transaction, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                <div className="flex-1">
                                  <p className="font-medium text-sm text-gray-900 dark:text-white">{transaction.description}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(transaction.date).toLocaleDateString()} • {transaction.category}
                                  </p>
                                </div>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  ${transaction.amount.toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Documents</h3>
                    <Button 
                      size="sm" 
                      className="bg-accent hover:bg-accent/90 text-accent-foreground"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      disabled={uploadingDoc}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {uploadingDoc ? 'Uploading...' : 'Upload Document'}
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setUploadingDoc(true);
                          setTimeout(() => {
                            alert(`File "${e.target.files![0].name}" uploaded successfully!`);
                            setUploadingDoc(false);
                          }, 1500);
                        }
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'Contract Agreement.pdf', size: '2.4 MB', date: '2024-01-15', type: 'PDF', icon: FileText },
                      { name: 'Floor Plans.pdf', size: '5.1 MB', date: '2024-01-18', type: 'PDF', icon: FileText },
                      { name: 'Material Invoice.pdf', size: '1.2 MB', date: '2024-02-05', type: 'PDF', icon: FileText },
                      { name: 'Progress Photos.zip', size: '12.8 MB', date: '2024-02-10', type: 'ZIP', icon: FileText },
                      { name: 'Permit Documents.pdf', size: '890 KB', date: '2024-01-20', type: 'PDF', icon: FileText },
                      { name: 'Change Orders.pdf', size: '450 KB', date: '2024-02-08', type: 'PDF', icon: FileText },
                    ].map((doc, index) => (
                      <Card key={index} className="border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-accent/10 rounded-lg">
                              <doc.icon className="w-5 h-5 text-accent" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                                {doc.name}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {doc.size} • {new Date(doc.date).toLocaleDateString()}
                              </p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem>Download</DropdownMenuItem>
                                <DropdownMenuItem>Share</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="team" className="space-y-4">
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">Team view coming soon</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Project Dialog */}
      <CreateProjectDialog open={createProjectOpen} onOpenChange={setCreateProjectOpen} />

      {/* Manage Project Dialog */}
      <Dialog open={manageProjectOpen} onOpenChange={setManageProjectOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Manage Project</DialogTitle>
            <DialogDescription>
              Update project details and settings
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 mt-4">
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                defaultValue={selectedProjectData.name}
                placeholder="e.g., Kitchen Renovation"
              />
            </div>

            {/* Contractor */}
            <div className="space-y-2">
              <Label htmlFor="contractor">Contractor</Label>
              <Input
                id="contractor"
                defaultValue={selectedProjectData.contractor}
                placeholder="Contractor name"
              />
            </div>

            {/* Budget & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <Input
                  id="budget"
                  type="number"
                  defaultValue={selectedProjectData.budget}
                  placeholder="25000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  defaultValue={selectedProjectData.status}
                  className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950"
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Planning">Planning</option>
                  <option value="Bidding">Bidding</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  defaultValue={selectedProjectData.startDate}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  defaultValue={selectedProjectData.endDate}
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                defaultValue={selectedProjectData.location}
                placeholder="123 Maple Dr, Austin, TX"
              />
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Contractor Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  defaultValue={selectedProjectData.contractorPhone}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Contractor Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={selectedProjectData.contractorEmail}
                  placeholder="contact@contractor.com"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Project Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes or details..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 mt-6">
            <Button variant="outline" onClick={() => setManageProjectOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={() => {
                alert('Project updated successfully!');
                setManageProjectOpen(false);
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyProjects;
