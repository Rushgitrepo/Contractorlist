import { useState } from 'react';
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
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Plus,
  Calendar,
  DollarSign,
  Users,
  Briefcase,
  Layers,
  Clock,
  CheckCircle2,
  Activity,
  Target,
  Award,
  TrendingUp,
  Filter,
  Eye,
  Building,
  MapPin,
  AlertCircle,
  Star,
  Zap,
  Bot
} from 'lucide-react';

// Mock Data for Charts
const revenueData = [
  { name: 'Jan', value: 45000 },
  { name: 'Feb', value: 52000 },
  { name: 'Mar', value: 48000 },
  { name: 'Apr', value: 61000 },
  { name: 'May', value: 55000 },
  { name: 'Jun', value: 67000 },
  { name: 'Jul', value: 72000 },
  { name: 'Aug', value: 84000 },
  { name: 'Sep', value: 79000 },
  { name: 'Oct', value: 88000 },
  { name: 'Nov', value: 94000 },
  { name: 'Dec', value: 102000 },
];

const projectStatusData = [
  { name: 'On Track', value: 18, color: '#10b981' }, // green-500
  { name: 'At Risk', value: 3, color: '#ef4444' }, // red-500
  { name: 'Delayed', value: 2, color: '#f59e0b' }, // amber-500
  { name: 'Completed', value: 12, color: '#eab308' }, // yellow-500
];

const recentProjects = [
  {
    id: '1',
    name: 'Austin Medical Center Expansion',
    client: 'Austin Healthcare',
    budget: 2800000,
    spent: 2100000,
    status: 'In Progress',
    dueDate: '2024-06-30',
    team: ['/avatars/01.png', '/avatars/02.png', '/avatars/03.png'],
    progress: 75,
  },
  {
    id: '2',
    name: 'Downtown Office Complex',
    client: 'Metro Properties',
    budget: 4200000,
    spent: 1800000,
    status: 'At Risk',
    dueDate: '2024-08-15',
    team: ['/avatars/04.png', '/avatars/05.png'],
    progress: 45,
  },
  {
    id: '3',
    name: 'Riverside Shopping Center',
    client: 'Retail Ventures',
    budget: 1650000,
    spent: 1450000,
    status: 'In Progress',
    dueDate: '2024-03-30',
    team: ['/avatars/06.png', '/avatars/07.png', '/avatars/08.png', '/avatars/09.png'],
    progress: 90,
  },
  {
    id: '4',
    name: 'Industrial Warehouse Ph2',
    client: 'LogiCorp',
    budget: 980000,
    spent: 200000,
    status: 'Planning',
    dueDate: '2024-07-15',
    team: ['/avatars/01.png'],
    progress: 25,
  },
];

const CleanOverview = () => {
  const [timeRange, setTimeRange] = useState('12m');

  // Enhanced project data with more details
  const enhancedProjects = [
    {
      id: '1',
      name: 'Austin Medical Center Expansion',
      client: 'Austin Healthcare',
      budget: 2800000,
      spent: 2100000,
      status: 'In Progress',
      dueDate: '2024-06-30',
      team: ['/avatars/01.png', '/avatars/02.png', '/avatars/03.png'],
      progress: 75,
      location: 'Austin, TX',
      priority: 'high',
      category: 'Healthcare'
    },
    {
      id: '2',
      name: 'Downtown Office Complex',
      client: 'Metro Properties',
      budget: 4200000,
      spent: 1800000,
      status: 'At Risk',
      dueDate: '2024-08-15',
      team: ['/avatars/04.png', '/avatars/05.png'],
      progress: 45,
      location: 'Dallas, TX',
      priority: 'high',
      category: 'Commercial'
    },
    {
      id: '3',
      name: 'Riverside Shopping Center',
      client: 'Retail Ventures',
      budget: 1650000,
      spent: 1450000,
      status: 'In Progress',
      dueDate: '2024-03-30',
      team: ['/avatars/06.png', '/avatars/07.png', '/avatars/08.png', '/avatars/09.png'],
      progress: 90,
      location: 'Houston, TX',
      priority: 'medium',
      category: 'Retail'
    },
    {
      id: '4',
      name: 'Industrial Warehouse Ph2',
      client: 'LogiCorp',
      budget: 980000,
      spent: 200000,
      status: 'Planning',
      dueDate: '2024-07-15',
      team: ['/avatars/01.png'],
      progress: 25,
      location: 'San Antonio, TX',
      priority: 'low',
      category: 'Industrial'
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'At Risk': return 'bg-red-100 text-red-800 border-red-200';
      case 'Planning': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="flex-1 w-full bg-slate-50/50 dark:bg-slate-950/50 p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-[1600px] mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Overview
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back. Here's what's happening with your projects today.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <Calendar className="mr-2 h-4 w-4" />
              May 12, 2024
            </Button>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-yellow-950 font-semibold shadow-sm shadow-yellow-200 dark:shadow-none">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>

        {/* Enhanced KPI Cards with Animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Total Revenue',
              value: '$12.5M',
              change: '+15.2%',
              trend: 'up',
              icon: DollarSign,
              subtext: 'vs. last month',
              gradient: 'from-emerald-500 to-teal-600',
              bgGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20'
            },
            {
              title: 'Active Projects',
              value: '24',
              change: '+8.5%',
              trend: 'up',
              icon: Briefcase,
              subtext: '4 completing soon',
              gradient: 'from-blue-500 to-cyan-600',
              bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20'
            },
            {
              title: 'Team Capacity',
              value: '87%',
              change: '-2.1%',
              trend: 'down',
              icon: Users,
              subtext: 'Across 12 teams',
              gradient: 'from-purple-500 to-pink-600',
              bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'
            },
            {
              title: 'Avg. Margin',
              value: '18.4%',
              change: '+1.2%',
              trend: 'up',
              icon: Layers,
              subtext: 'Exceeds target (15%)',
              gradient: 'from-yellow-500 to-orange-600',
              bgGradient: 'from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20'
            }
          ].map((stat, i) => (
            <Card 
              key={i} 
              className="group border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden relative"
            >
              {/* Animated gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <CardContent className="p-6 relative z-10">
                <div className="flex justify-between items-start">
                  <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <Badge
                    variant="secondary"
                    className={`${stat.trend === 'up' ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20' : 'text-red-600 bg-red-50 dark:bg-red-900/20'} border-0 font-medium group-hover:scale-110 transition-transform duration-300`}
                  >
                    {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {stat.change}
                  </Badge>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-50 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-700 dark:group-hover:from-slate-100 dark:group-hover:to-slate-300 transition-all duration-300">
                    {stat.value}
                  </h3>
                  <div className="flex items-center mt-1 text-sm text-slate-500 dark:text-slate-400">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{stat.title}</span>
                    <span className="mx-2">•</span>
                    <span>{stat.subtext}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Revenue Chart */}
            <Card className="lg:col-span-2 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                  Revenue Performance
                </CardTitle>
                <CardDescription>Income trend over the last 12 months</CardDescription>
              </div>
              <div className="flex gap-2">
                {['12m', '6m', '30d'].map((range) => (
                  <Button
                    key={range}
                    variant={timeRange === range ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setTimeRange(range)}
                    className={cn(
                      "text-xs font-medium transition-all duration-200",
                      timeRange === range && "bg-yellow-500 hover:bg-yellow-600 text-black shadow-md"
                    )}
                  >
                    {range.toUpperCase()}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="pl-0">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#eab308" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: '#1e293b', fontWeight: 600 }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#eab308"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Project Status */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50">Project Status</CardTitle>
              <CardDescription>Current state of active portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {projectStatusData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{item.name}</span>
                      </div>
                      <span className="text-slate-500">{item.value} Projects</span>
                    </div>
                    <Progress value={(item.value / 35) * 100} className="h-2" indicatorClassName={`bg-[${item.color}]`} style={{ backgroundColor: '#f1f5f9' }} />
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Quick Actions</h4>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-slate-600 dark:text-slate-400 h-10 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50">
                    <Plus className="mr-2 h-4 w-4" /> Add Team Member
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-slate-600 dark:text-slate-400 h-10 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50">
                    <Layers className="mr-2 h-4 w-4" /> Create Estimate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Projects Table */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50">Recent Projects</CardTitle>
              <CardDescription>Manage and monitor your ongoing construction sites</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50">
              View All Projects
            </Button>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 font-semibold">Project Name</th>
                  <th className="px-6 py-4 font-semibold">Budget vs. Actual</th>
                  <th className="px-6 py-4 font-semibold">Team</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Completion</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
                {recentProjects.map((project) => (
                  <tr 
                    key={project.id} 
                    className="hover:bg-gradient-to-r hover:from-yellow-50/50 hover:to-orange-50/50 dark:hover:from-yellow-900/10 dark:hover:to-orange-900/10 transition-all duration-300 cursor-pointer group border-b border-slate-100 dark:border-slate-800"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform duration-300">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                            {project.name}
                          </div>
                          <div className="text-xs text-slate-500">{project.client}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-900 dark:text-slate-100 font-medium">${project.spent.toLocaleString()}</span>
                        <span className="text-xs text-slate-500">of ${project.budget.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        {project.team.map((_, i) => (
                          <div key={i} className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-600">
                            {['SJ', 'MK', 'AL', 'TR'][i % 4]}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className={`
                        ${project.status === 'In Progress' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                        ${project.status === 'At Risk' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                        ${project.status === 'Planning' ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}
                        font-medium
                      `}>
                        {project.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 min-w-[150px]">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                          <Progress 
                            value={project.progress} 
                            className="h-2 bg-slate-200 dark:bg-slate-700 group-hover:bg-slate-300 dark:group-hover:bg-slate-600 transition-colors" 
                          />
                          <div 
                            className="absolute top-0 left-0 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500 group-hover:shadow-lg group-hover:shadow-yellow-500/50"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors min-w-[3rem]">
                          {project.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all duration-300 group-hover:scale-110"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-center">
            <Button variant="link" className="text-sm text-slate-500 hover:text-slate-900">
              View All 24 Active Projects
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CleanOverview;