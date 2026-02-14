import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  Clock,
  DollarSign,
  FileText,
  ArrowUpRight,
  Plus,
  ChevronRight
} from 'lucide-react';
import CreateProjectDialog from './CreateProjectDialog';

// Simple interfaces
interface Project {
  id: string;
  name: string;
  status: 'Active' | 'Planning' | 'Completed';
  progress: number;
  contractor: string;
  budget: string;
  dueDate: string;
}

// Budget trend data
const budgetData = [
  { month: 'Jan', amount: 8500 },
  { month: 'Feb', amount: 12500 },
  { month: 'Mar', amount: 14200 },
  { month: 'Apr', amount: 16800 },
  { month: 'May', amount: 19500 },
  { month: 'Jun', amount: 21200 },
];

const HomeownerOverview = () => {
  const [selectedPeriod] = useState('Last 6 months');
  const [createProjectOpen, setCreateProjectOpen] = useState(false);

  // Key metrics
  const stats = [
    {
      title: 'Active Projects',
      value: '3',
      change: '+1 this month',
      icon: TrendingUp,
      trend: 'up'
    },
    {
      title: 'Pending Bids',
      value: '5',
      change: '2 new today',
      icon: Clock,
      trend: 'up'
    },
    {
      title: 'Total Spent',
      value: '$21,200',
      change: '+8% vs last month',
      icon: DollarSign,
      trend: 'up'
    },
    {
      title: 'Documents',
      value: '24',
      change: '3 added this week',
      icon: FileText,
      trend: 'neutral'
    }
  ];

  const projects: Project[] = [
    {
      id: '1',
      name: 'Kitchen Renovation',
      status: 'Active',
      progress: 65,
      contractor: 'Elite Builders',
      budget: '$25,000',
      dueDate: 'Feb 15, 2025'
    },
    {
      id: '2',
      name: 'Backyard ADU',
      status: 'Planning',
      progress: 15,
      contractor: 'Metro Builders',
      budget: '$45,000',
      dueDate: 'Jun 30, 2025'
    },
    {
      id: '3',
      name: 'Master Bathroom',
      status: 'Active',
      progress: 42,
      contractor: 'Modern Homes',
      budget: '$18,000',
      dueDate: 'Apr 20, 2025'
    }
  ];

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'Active': return 'bg-accent/20 text-accent dark:bg-accent/30 dark:text-accent';
      case 'Planning': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track your projects and spending
          </p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => setCreateProjectOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-gray-200 dark:border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <stat.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                {stat.trend === 'up' && (
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                )}
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.title}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{stat.change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid - Graph Left, Projects Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending Chart - Left Side (2 columns) */}
        <Card className="lg:col-span-2 border-gray-200 dark:border-gray-800">
          <CardHeader className="border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Spending Overview</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{selectedPeriod}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={budgetData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fce011" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#fce011" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-800" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Spent']}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#fce011"
                  strokeWidth={2}
                  fill="url(#colorAmount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Projects List - Right Side (1 column) */}
        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader className="border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Active Projects</CardTitle>
              <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80">
                View all
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                          {project.name}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {project.contractor}
                      </p>
                    </div>
                    <Badge className={cn('text-xs ml-2 flex-shrink-0', getStatusColor(project.status))}>
                      {project.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Progress</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {project.progress}%
                      </span>
                    </div>
                    <Progress value={project.progress} className="h-1.5" />
                  </div>

                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>{project.budget}</span>
                    <span>Due {project.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Project Dialog */}
      <CreateProjectDialog open={createProjectOpen} onOpenChange={setCreateProjectOpen} />
    </div>
  );
};

export default HomeownerOverview;
