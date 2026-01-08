import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
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
  Camera,
  User,
  Plus,
  Filter,
  Search,
  Download,
  Upload,
  Phone,
  Mail,
  AlertCircle,
  Target,
  Zap,
  Activity,
  BarChart3,
  Users
} from 'lucide-react';

const MyProjects = () => {
  const [selectedProject, setSelectedProject] = useState('kitchen');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

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
      color: 'text-blue-600',
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
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
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
      case 'on-track': return { color: 'text-blue-600', bg: 'bg-blue-50', icon: Target };
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
              <BarChart3 className="w-4 h-4 text-blue-500" />
              <span>Budget tracking</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>AI insights</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 hover:bg-yellow-50 border-orange-200 text-orange-700">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-lg font-semibold gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">Active Projects</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-300">3</p>
              </div>
              <div className="p-3 bg-blue-200 dark:bg-blue-900/30 rounded-full">
                <Activity className="w-6 h-6 text-blue-700 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-700 dark:text-green-400">Total Budget</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-300">$88K</p>
              </div>
              <div className="p-3 bg-green-200 dark:bg-green-900/30 rounded-full">
                <DollarSign className="w-6 h-6 text-green-700 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-orange-700 dark:text-orange-400">Avg Progress</p>
                <p className="text-3xl font-bold text-orange-900 dark:text-orange-300">33%</p>
              </div>
              <div className="p-3 bg-orange-200 dark:bg-orange-900/30 rounded-full">
                <Target className="w-6 h-6 text-orange-700 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-700 dark:text-purple-400">On Schedule</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-300">2/3</p>
              </div>
              <div className="p-3 bg-purple-200 dark:bg-purple-900/30 rounded-full">
                <Clock className="w-6 h-6 text-purple-700 dark:text-purple-400" />
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
                    ? 'ring-2 ring-orange-400 shadow-lg bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20' 
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
                      <span className="text-orange-600">{project.progress}%</span>
                    </div>
                    <div className="relative">
                      <Progress value={project.progress} className="h-2 bg-gray-100" />
                      <div 
                        className="absolute top-0 left-0 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
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
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-yellow-50/30 dark:from-gray-800 dark:to-yellow-900/10">
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
                  <Button variant="outline" size="sm" className="gap-2 hover:bg-yellow-50">
                    <Share className="w-4 h-4" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 hover:bg-yellow-50">
                    <Phone className="w-4 h-4" />
                    Call Contractor
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold gap-2">
                    <Edit className="w-4 h-4" />
                    Manage
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-5 bg-gray-100 dark:bg-gray-800">
                  <TabsTrigger value="overview" className="font-semibold text-gray-700 dark:text-gray-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">Overview</TabsTrigger>
                  <TabsTrigger value="timeline" className="font-semibold text-gray-700 dark:text-gray-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">Timeline</TabsTrigger>
                  <TabsTrigger value="budget" className="font-semibold text-gray-700 dark:text-gray-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">Budget</TabsTrigger>
                  <TabsTrigger value="documents" className="font-semibold text-gray-700 dark:text-gray-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">Documents</TabsTrigger>
                  <TabsTrigger value="team" className="font-semibold text-gray-700 dark:text-gray-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">Team</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Progress Widget */}
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
                      <CardHeader>
                        <CardTitle className="text-base font-bold text-blue-900 dark:text-blue-300 flex items-center gap-2">
                          <Target className="w-5 h-5" />
                          Project Progress
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-6 mb-6">
                          <div className="relative size-20 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                              <path
                                className="text-blue-200 dark:text-blue-900"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                              />
                              <path
                                className="text-blue-600 dark:text-blue-400"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeDasharray={`${selectedProjectData.progress}, 100`}
                                strokeWidth="3"
                              />
                            </svg>
                            <span className="absolute text-lg font-bold text-blue-900 dark:text-blue-300">
                              {selectedProjectData.progress}%
                            </span>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-1">
                              {selectedProjectData.phase}
                            </p>
                            <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">
                              Next: {selectedProjectData.nextMilestone}
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-500">
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
                            <div className="w-5 h-5 rounded-full bg-blue-500 dark:bg-blue-400 border-2 border-white dark:border-gray-800 shadow-sm" />
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
                    <Card className="md:col-span-2 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-orange-200 dark:border-orange-800">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-orange-900 dark:text-orange-300 text-base font-bold">
                          <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                          AI Insights
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-orange-100 dark:border-orange-900/50">
                            <p className="text-sm text-orange-800 dark:text-orange-300 font-medium mb-2">
                              Timeline Optimization
                            </p>
                            <p className="text-xs text-orange-700 dark:text-orange-400 leading-relaxed">
                              Order countertops by Friday to maintain your 3-day lead. I found 3 suppliers with immediate availability.
                            </p>
                          </div>
                          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-orange-100 dark:border-orange-900/50">
                            <p className="text-sm text-orange-800 dark:text-orange-300 font-medium mb-2">
                              Budget Alert
                            </p>
                            <p className="text-xs text-orange-700 dark:text-orange-400 leading-relaxed">
                              You're 3% under budget so far. Consider upgrading to premium fixtures within remaining budget.
                            </p>
                          </div>
                        </div>
                        <Button size="sm" className="w-full mt-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold">
                          View All Insights
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="md:col-span-3 bg-white dark:bg-slate-900">
                      <CardHeader>
                        <CardTitle className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <Activity className="w-5 h-5" />
                          Recent Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {recentActivity.slice(0, 4).map((activity, index) => (
                            <div key={index} className="flex gap-4 items-start">
                              <div className={`bg-gray-50 dark:bg-gray-800 p-2 rounded-lg ${activity.color}`}>
                                <activity.icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {activity.title}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                  {activity.description}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                  {activity.time} • {activity.project}
                                </p>
                              </div>
                              <Button size="sm" variant="outline" className="text-xs hover:bg-yellow-50 dark:hover:bg-yellow-900/20">
                                View
                              </Button>
                            </div>
                          ))}
                        </div>
                        <Button variant="outline" className="w-full mt-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                          View All Activity
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="timeline">
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Project Timeline</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Detailed project timeline and milestone tracking will be displayed here.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="budget">
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Budget Analysis</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Comprehensive budget breakdown and financial tracking will be shown here.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="documents">
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Project Documents</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Contracts, permits, invoices, and other project documents will be organized here.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="team">
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Project Team</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Contractor details, team members, and communication tools will be available here.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyProjects;