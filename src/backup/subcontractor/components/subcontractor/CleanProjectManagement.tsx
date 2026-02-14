import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  Users,
  CheckCircle,
  Circle,
  Play,
  Eye,
  Plus,
  BarChart3,
  FileText,
  MessageSquare,
  Search,
  Target,
  Activity
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  client: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  startDate: Date;
  endDate: Date;
  budget: number;
  spent: number;
  team: TeamMember[];
  tasks: Task[];
  milestones: Milestone[];
  riskLevel: 'low' | 'medium' | 'high';
  clientSatisfaction: number;
}

interface Task {
  id: string;
  name: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  estimatedHours: number;
  actualHours: number;
  subtasks: SubTask[];
}

interface SubTask {
  id: string;
  name: string;
  completed: boolean;
  assignee: string;
}

interface Milestone {
  id: string;
  name: string;
  date: Date;
  status: 'upcoming' | 'completed' | 'overdue';
  description: string;
  deliverables: string[];
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  workload: number;
  availability: 'available' | 'busy' | 'offline';
}

const CleanProjectManagement = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'kanban' | 'list'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data
  useEffect(() => {
    const mockProjects: Project[] = [
      {
        id: '1',
        name: 'Medical Center HVAC Installation',
        client: 'Austin Medical Group',
        status: 'active',
        priority: 'high',
        progress: 65,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-03-30'),
        budget: 250000,
        spent: 162500,
        riskLevel: 'medium',
        clientSatisfaction: 4.8,
        team: [
          { id: '1', name: 'John Smith', role: 'Lead Technician', workload: 85, availability: 'busy' },
          { id: '2', name: 'Mike Johnson', role: 'HVAC Installer', workload: 70, availability: 'available' },
          { id: '3', name: 'Sarah Davis', role: 'Project Coordinator', workload: 60, availability: 'available' }
        ],
        tasks: [
          {
            id: 't1',
            name: 'Site Assessment & Planning',
            description: 'Complete site survey and create installation plan',
            status: 'completed',
            priority: 'high',
            assignee: 'John Smith',
            startDate: new Date('2024-01-15'),
            endDate: new Date('2024-01-22'),
            progress: 100,
            estimatedHours: 40,
            actualHours: 38,
            subtasks: [
              { id: 'st1', name: 'Site survey', completed: true, assignee: 'John Smith' },
              { id: 'st2', name: 'Equipment assessment', completed: true, assignee: 'John Smith' },
              { id: 'st3', name: 'Installation plan', completed: true, assignee: 'Sarah Davis' }
            ]
          },
          {
            id: 't2',
            name: 'Equipment Procurement',
            description: 'Order and receive all HVAC equipment',
            status: 'completed',
            priority: 'high',
            assignee: 'Sarah Davis',
            startDate: new Date('2024-01-20'),
            endDate: new Date('2024-02-05'),
            progress: 100,
            estimatedHours: 20,
            actualHours: 22,
            subtasks: [
              { id: 'st4', name: 'Equipment ordering', completed: true, assignee: 'Sarah Davis' },
              { id: 'st5', name: 'Delivery coordination', completed: true, assignee: 'Sarah Davis' },
              { id: 'st6', name: 'Quality inspection', completed: true, assignee: 'John Smith' }
            ]
          },
          {
            id: 't3',
            name: 'Phase 1 Installation',
            description: 'Install HVAC system in east wing',
            status: 'in-progress',
            priority: 'high',
            assignee: 'Mike Johnson',
            startDate: new Date('2024-02-06'),
            endDate: new Date('2024-02-28'),
            progress: 80,
            estimatedHours: 120,
            actualHours: 95,
            subtasks: [
              { id: 'st7', name: 'Ductwork installation', completed: true, assignee: 'Mike Johnson' },
              { id: 'st8', name: 'Unit installation', completed: true, assignee: 'Mike Johnson' },
              { id: 'st9', name: 'Electrical connections', completed: false, assignee: 'John Smith' }
            ]
          },
          {
            id: 't4',
            name: 'Phase 2 Installation',
            description: 'Install HVAC system in west wing',
            status: 'todo',
            priority: 'medium',
            assignee: 'Mike Johnson',
            startDate: new Date('2024-03-01'),
            endDate: new Date('2024-03-20'),
            progress: 0,
            estimatedHours: 100,
            actualHours: 0,
            subtasks: [
              { id: 'st10', name: 'Ductwork installation', completed: false, assignee: 'Mike Johnson' },
              { id: 'st11', name: 'Unit installation', completed: false, assignee: 'Mike Johnson' },
              { id: 'st12', name: 'System testing', completed: false, assignee: 'John Smith' }
            ]
          }
        ],
        milestones: [
          {
            id: 'm1',
            name: 'Site Assessment Complete',
            date: new Date('2024-01-22'),
            status: 'completed',
            description: 'All site assessments and planning completed',
            deliverables: ['Site survey report', 'Installation plan', 'Equipment list']
          },
          {
            id: 'm2',
            name: 'Equipment Delivered',
            date: new Date('2024-02-05'),
            status: 'completed',
            description: 'All HVAC equipment delivered and inspected',
            deliverables: ['Equipment delivery confirmation', 'Quality inspection report']
          },
          {
            id: 'm3',
            name: 'Phase 1 Complete',
            date: new Date('2024-02-28'),
            status: 'upcoming',
            description: 'East wing HVAC installation completed',
            deliverables: ['Installation report', 'System testing results', 'Client walkthrough']
          }
        ]
      }
    ];

    setProjects(mockProjects);
    setSelectedProject('1');
  }, []);

  const currentProject = projects.find(p => p.id === selectedProject);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-accent text-accent-foreground font-bold';
      case 'active': case 'in-progress': return 'bg-accent/10 text-accent-foreground border-none';
      case 'on-hold': return 'bg-accent/5 text-accent-foreground/70 border-none';
      case 'cancelled': return 'bg-red-100 dark:bg-red-900/10 text-red-600';
      case 'todo': return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
      case 'review': return 'bg-accent/10 text-accent-foreground border-none';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-accent-foreground bg-accent font-bold';
      case 'high': return 'text-accent bg-accent/10';
      case 'medium': return 'text-accent bg-accent/10';
      case 'low': return 'text-accent bg-accent/5';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const KanbanView = () => {
    const tasksByStatus = {
      'todo': currentProject?.tasks.filter(t => t.status === 'todo') || [],
      'in-progress': currentProject?.tasks.filter(t => t.status === 'in-progress') || [],
      'review': currentProject?.tasks.filter(t => t.status === 'review') || [],
      'completed': currentProject?.tasks.filter(t => t.status === 'completed') || []
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Object.entries(tasksByStatus).map(([status, tasks]) => (
          <div key={status} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold capitalize flex items-center gap-2">
                {status === 'todo' && <Circle className="w-4 h-4 text-gray-500" />}
                {status === 'in-progress' && <Play className="w-4 h-4 text-accent" />}
                {status === 'review' && <Eye className="w-4 h-4 text-accent" />}
                {status === 'completed' && <CheckCircle className="w-4 h-4 text-accent" />}
                {status.replace('-', ' ')}
              </h3>
              <Badge variant="outline">{tasks.length}</Badge>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => (
                <Card key={task.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-sm">{task.name}</h4>
                      <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </Badge>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                      {task.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span>Progress</span>
                        <span>{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="h-1" />
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatDate(task.endDate)}</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{task.actualHours || 0}h / {task.estimatedHours}h</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">{task.assignee}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">
                          {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} subtasks
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              <Button variant="outline" className="w-full border-dashed">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!currentProject) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 pb-20">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Project Selected</h3>
          <p className="text-gray-500">Select a project to view its details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Project Management</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Advanced project tracking with team collaboration
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        {/* Project Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Progress</p>
                  <p className="text-2xl font-semibold">{currentProject.progress}%</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-accent" />
                </div>
              </div>
              <Progress value={currentProject.progress} className="mt-4" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Budget</p>
                  <p className="text-2xl font-semibold">{formatCurrency(currentProject.budget)}</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-accent" />
                </div>
              </div>
              <div className="mt-2 text-sm">
                <span className="text-gray-600 dark:text-gray-400">Spent: </span>
                <span className="font-medium">{formatCurrency(currentProject.spent)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Team</p>
                  <p className="text-2xl font-semibold">{currentProject.team.length}</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-accent" />
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {currentProject.team.filter(m => m.availability === 'available').length} available
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Tasks</p>
                  <p className="text-2xl font-semibold">{currentProject.tasks.length}</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-accent" />
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {currentProject.tasks.filter(t => t.status === 'completed').length} completed
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">{currentProject.name}</CardTitle>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Client: {currentProject.client}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(currentProject.status)}>
                  {currentProject.status}
                </Badge>
                <Badge className={getPriorityColor(currentProject.priority)}>
                  {currentProject.priority} priority
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <KanbanView />
                  </div>

                  <div className="space-y-6">
                    {/* Project Info */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg font-bold">Project Info</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Start Date</span>
                          <span className="font-medium">{formatDate(currentProject.startDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">End Date</span>
                          <span className="font-medium">{formatDate(currentProject.endDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Risk Level</span>
                          <Badge className={
                            currentProject.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                              currentProject.riskLevel === 'medium' ? 'bg-accent/10 text-accent' :
                                'bg-accent text-accent-foreground'
                          }>
                            {currentProject.riskLevel}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Client Satisfaction</span>
                          <span className="font-medium">{currentProject.clientSatisfaction}/5</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                            <div>
                              <p className="text-sm font-medium">Phase 1 Installation 80% complete</p>
                              <p className="text-xs text-gray-500">2 hours ago</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-accent/60 rounded-full mt-2"></div>
                            <div>
                              <p className="text-sm font-medium">Equipment inspection completed</p>
                              <p className="text-xs text-gray-500">5 hours ago</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-accent/40 rounded-full mt-2"></div>
                            <div>
                              <p className="text-sm font-medium">Client meeting scheduled</p>
                              <p className="text-xs text-gray-500">1 day ago</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tasks">
                <KanbanView />
              </TabsContent>

              <TabsContent value="team" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentProject.team.map((member) => (
                    <Card key={member.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <span className="font-semibold">{member.name.charAt(0)}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{member.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
                          </div>
                          <div className={`w-3 h-3 rounded-full ${member.availability === 'available' ? 'bg-accent' :
                            member.availability === 'busy' ? 'bg-accent/60' : 'bg-gray-500'
                            }`}></div>
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Workload</span>
                            <span>{member.workload}%</span>
                          </div>
                          <Progress value={member.workload} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="milestones" className="space-y-4">
                {currentProject.milestones.map((milestone) => (
                  <Card key={milestone.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Target className="w-5 h-5 text-accent" />
                            <h3 className="font-semibold">{milestone.name}</h3>
                            <Badge className={getStatusColor(milestone.status)}>
                              {milestone.status}
                            </Badge>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-3">{milestone.description}</p>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Deliverables:</p>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                              {milestone.deliverables.map((deliverable, index) => (
                                <li key={index}>{deliverable}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">{formatDate(milestone.date)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CleanProjectManagement;
