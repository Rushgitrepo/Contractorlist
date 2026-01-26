import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import {
  TrendingUp,
  Clock,
  DollarSign,
  Calendar,
  Star,
  ArrowRight,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Activity,
  CheckCircle2,
  Plus,
  Eye
} from 'lucide-react';

// Simple interfaces for clean code
interface Project {
  id: string;
  name: string;
  status: 'In Progress' | 'Planning' | 'Bidding' | 'Completed';
  progress: number;
  contractor: string;
  budget: string;
  dueDate: string;
}

interface Contractor {
  name: string;
  rating: number;
  specialty: string;
  responseTime: string;
}

// Mock Data for Charts
const budgetData = [
  { name: 'Jan', budget: 12000, spent: 8500 },
  { name: 'Feb', budget: 15000, spent: 12500 },
  { name: 'Mar', budget: 18000, spent: 14200 },
  { name: 'Apr', budget: 20000, spent: 16800 },
  { name: 'May', budget: 22000, spent: 19500 },
  { name: 'Jun', budget: 25000, spent: 21200 },
];

const projectStatusData = [
  { name: 'In Progress', value: 1, color: '#3b82f6' },
  { name: 'Planning', value: 1, color: '#f59e0b' },
  { name: 'Bidding', value: 1, color: '#8b5cf6' },
];

const HomeownerOverview = () => {
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  // Real-time data state
  const [realTimeStats, setRealTimeStats] = useState({
    activeProjects: 3,
    pendingBids: 5,
    budgetUsed: 12500,
    nextMilestone: 2
  });

  // Real-time updates simulation
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setRealTimeStats(prev => ({
        activeProjects: prev.activeProjects,
        pendingBids: prev.pendingBids + (Math.random() > 0.9 ? 1 : 0) - (Math.random() > 0.95 ? 1 : 0),
        budgetUsed: prev.budgetUsed + Math.floor(Math.random() * 50),
        nextMilestone: Math.max(0, prev.nextMilestone - (Math.random() > 0.8 ? 0.1 : 0))
      }));
      setLastUpdate(new Date());
    }, 6000); // Update every 6 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  // Enhanced stats with real-time data
  const stats = [
    { 
      title: 'Active Projects', 
      value: realTimeStats.activeProjects.toString(), 
      change: '+1',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      title: 'Pending Bids', 
      value: realTimeStats.pendingBids.toString(), 
      change: '+2',
      changeType: 'positive' as const,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    { 
      title: 'Budget Used', 
      value: `$${realTimeStats.budgetUsed.toLocaleString()}`, 
      change: '+8%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      title: 'Next Milestone', 
      value: `${realTimeStats.nextMilestone.toFixed(1)} days`, 
      change: 'On track',
      changeType: 'positive' as const,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const activeProjects: Project[] = [
    {
      id: 'PRJ-001',
      name: 'Kitchen Renovation',
      status: 'In Progress',
      progress: 65,
      contractor: 'Elite Builders',
      budget: '$25,000',
      dueDate: 'Feb 15, 2025'
    },
    {
      id: 'PRJ-002',
      name: 'Backyard ADU',
      status: 'Planning',
      progress: 15,
      contractor: 'Metro Builders',
      budget: '$45,000',
      dueDate: 'Jun 30, 2025'
    },
    {
      id: 'PRJ-003',
      name: 'Master Bath',
      status: 'Bidding',
      progress: 5,
      contractor: 'TBD',
      budget: '$18,000',
      dueDate: 'Apr 20, 2025'
    }
  ];

  const recommendedPros: Contractor[] = [
    {
      name: 'Summit Roofing',
      rating: 4.9,
      specialty: 'Licensed • 12 Years Exp.',
      responseTime: '< 2 hours'
    },
    {
      name: 'A1 Construction',
      rating: 4.7,
      specialty: 'General Contractor • 8 Years',
      responseTime: '< 4 hours'
    },
    {
      name: 'Modern Interiors',
      rating: 4.8,
      specialty: 'Interior Design • 15 Years',
      responseTime: '< 1 hour'
    }
  ];

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Planning': return 'bg-yellow-100 text-yellow-800';
      case 'Bidding': return 'bg-purple-100 text-purple-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 bg-slate-50/50 dark:bg-slate-950/50 min-h-screen">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Good morning, Alex</h1>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 font-semibold">
              <Activity className="w-3 h-3 mr-1" />
              Active
            </Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            You have <span className="font-semibold text-orange-600 dark:text-orange-400">3 active projects</span> and <span className="font-semibold text-blue-600 dark:text-blue-400">5 pending bids</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400">
            <MoreHorizontal className="w-4 h-4" />
            Filter
          </Button>
          <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold gap-2 shadow-lg">
            <Plus className="w-5 h-5" />
            New Project
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Grid with Real-time Updates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card 
            key={stat.title} 
            className={cn(
              "bg-white dark:bg-slate-900 hover:shadow-xl transition-all duration-300 border-0 shadow-sm",
              "group hover:scale-[1.02] cursor-pointer"
            )}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn(
                  "p-3 rounded-xl transition-all duration-300 group-hover:scale-110",
                  stat.bgColor,
                  "dark:bg-opacity-20"
                )}>
                  <stat.icon className={cn(
                    "w-6 h-6 transition-transform duration-300",
                    stat.color,
                    "group-hover:rotate-12"
                  )} />
                </div>
                <div className={cn(
                  "text-sm font-medium flex items-center gap-1",
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-500'
                )}>
                  {stat.changeType === 'positive' ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1 transition-all duration-300">
                  {stat.value}
                  {isLive && stat.title === 'Pending Bids' && (
                    <span className="ml-2 inline-block w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Real-time Status Bar */}
      {isLive && (
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-green-700 dark:text-green-400">Live Updates Active</span>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className="text-xs"
          >
            {isLive ? 'Pause Updates' : 'Resume Updates'}
          </Button>
        </div>
      )}

      {/* Budget Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white dark:bg-slate-900 border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Budget Overview</CardTitle>
                <CardDescription>Monthly budget vs spending</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={budgetData}>
                <defs>
                  <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="budget" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorBudget)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="spent" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorSpent)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Project Status</CardTitle>
            <CardDescription>Current project distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectStatusData.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">{item.value}</span>
                  </div>
                  <Progress 
                    value={(item.value / 3) * 100} 
                    className="h-2"
                    style={{
                      backgroundColor: `${item.color}20`,
                    }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Projects - Enhanced Layout */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Active Projects</h2>
            <Button variant="outline" size="sm" className="text-orange-600 border-orange-200 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400">
              <Eye className="w-4 h-4 mr-2" />
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {activeProjects.map((project) => (
              <Card 
                key={project.id} 
                className={cn(
                  "bg-white dark:bg-slate-900 hover:shadow-xl transition-all duration-300 border-0 shadow-sm",
                  "group cursor-pointer hover:scale-[1.01]"
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{project.contractor}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={cn(
                        getStatusColor(project.status),
                        "mb-2 dark:bg-opacity-20"
                      )}>
                        {project.status}
                      </Badge>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{project.budget}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{project.progress}%</span>
                        {isLive && project.status === 'In Progress' && (
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>
                    <div className="relative">
                      <Progress value={project.progress} className="h-2.5 bg-gray-100 dark:bg-gray-800" />
                      <div 
                        className={cn(
                          "absolute top-0 left-0 h-2.5 rounded-full transition-all duration-1000",
                          "bg-gradient-to-r from-yellow-400 to-orange-500",
                          isLive && project.status === 'In Progress' && "animate-pulse"
                        )}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Due: {project.dueDate}</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recommended Contractors - Enhanced List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recommended Pros</h2>
          </div>
          
          <Card className="bg-white dark:bg-slate-900 border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                {recommendedPros.map((pro, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "flex items-center justify-between p-4 border border-gray-100 dark:border-gray-800 rounded-lg",
                      "hover:border-orange-200 dark:hover:border-orange-800 hover:shadow-md transition-all cursor-pointer"
                    )}
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">{pro.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{pro.specialty}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{pro.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Responds in {pro.responseTime}</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-sm"
                    >
                      Contact
                    </Button>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  className="w-full mt-4 text-orange-600 border-orange-200 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-900/20"
                >
                  Browse All Contractors
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomeownerOverview;