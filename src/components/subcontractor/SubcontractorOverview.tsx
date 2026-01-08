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
  Eye,
  DollarSign,
  Plus,
  MapPin,
  Calendar,
  Building,
  Star,
  Bot,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Users,
  FileText,
  BarChart3,
  Target,
  Zap,
  Award,
  Activity,
  Filter,
  ExternalLink,
  Timer,
  AlertCircle,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Layers,
  CheckCircle2
} from 'lucide-react';

// Mock Data for Charts
const revenueData = [
  { name: 'Jan', value: 32000 },
  { name: 'Feb', value: 38000 },
  { name: 'Mar', value: 35000 },
  { name: 'Apr', value: 42000 },
  { name: 'May', value: 40000 },
  { name: 'Jun', value: 48000 },
  { name: 'Jul', value: 52000 },
  { name: 'Aug', value: 60000 },
  { name: 'Sep', value: 58000 },
  { name: 'Oct', value: 65000 },
  { name: 'Nov', value: 70000 },
  { name: 'Dec', value: 75000 },
];

const bidStatusData = [
  { name: 'Won', value: 8, color: '#10b981' },
  { name: 'Pending', value: 12, color: '#f59e0b' },
  { name: 'Lost', value: 5, color: '#ef4444' },
  { name: 'Draft', value: 3, color: '#6b7280' },
];

const SubcontractorOverview = () => {
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  // Real-time data state
  const [realTimeStats, setRealTimeStats] = useState({
    winRate: 24,
    activeBids: 12,
    profileViews: 1240,
    revenueYTD: 450000
  });

  // Real-time updates simulation
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setRealTimeStats(prev => ({
        winRate: Math.min(30, prev.winRate + Math.random() * 0.1),
        activeBids: prev.activeBids + (Math.random() > 0.8 ? 1 : 0),
        profileViews: prev.profileViews + Math.floor(Math.random() * 3),
        revenueYTD: prev.revenueYTD + Math.floor(Math.random() * 500)
      }));
      setLastUpdate(new Date());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  // Enhanced stats with better metrics
  const stats = [
    {
      title: 'Win Rate',
      value: `${realTimeStats.winRate.toFixed(1)}%`,
      change: '+2.5%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'vs last month'
    },
    {
      title: 'Active Bids',
      value: realTimeStats.activeBids.toString(),
      change: '+4 new',
      changeType: 'positive',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'today'
    },
    {
      title: 'Profile Views',
      value: realTimeStats.profileViews.toLocaleString(),
      change: '-5%',
      changeType: 'negative',
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'vs last week'
    },
    {
      title: 'Revenue YTD',
      value: `$${(realTimeStats.revenueYTD / 1000).toFixed(0)}k`,
      change: '+12%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'year to date'
    }
  ];

  const projects = [
    {
      id: 1,
      title: 'Downtown Medical Center Expansion',
      category: 'Commercial',
      trade: 'HVAC',
      location: 'Austin, TX',
      gc: 'Turner Construction',
      budget: '$2.4M - $3M',
      dueDate: 'Oct 24, 2023',
      views: 45,
      aiMatch: 98,
      status: 'hot',
      urgency: 'high'
    },
    {
      id: 2,
      title: 'Riverside High School Renovation',
      category: 'Public Works',
      trade: 'HVAC',
      location: 'San Marcos, TX',
      gc: 'Skanska',
      budget: '$850k',
      dueDate: 'Oct 28, 2023',
      views: 12,
      aiMatch: 92,
      status: 'new',
      urgency: 'medium'
    },
    {
      id: 3,
      title: 'The Aurora Apartments Phase 2',
      category: 'Multi-Family',
      trade: 'Plumbing',
      location: 'Austin, TX',
      gc: 'D.R. Horton',
      budget: '$1.2M',
      dueDate: 'Nov 02, 2023',
      views: 210,
      aiMatch: 88,
      status: 'trending',
      urgency: 'low'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return 'bg-red-100 text-red-800 border-red-200';
      case 'new': return 'bg-green-100 text-green-800 border-green-200';
      case 'trending': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };
  return (
    <div className="p-6 lg:p-8 space-y-8 bg-slate-50/50 dark:bg-slate-950/50 min-h-screen">
      {/* Professional Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Good morning, Acme Construction</h1>
            <Badge className="bg-green-100 text-green-800 font-semibold">
              <Activity className="w-3 h-3 mr-1" />
              Active
            </Badge>
          </div>
          <p className="text-gray-600 text-lg">
            You have <span className="font-semibold text-orange-600">5 new project matches</span> ready for review
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 border-orange-200 text-orange-700 hover:bg-orange-50">
            <Filter className="w-4 h-4" />
            Filter Projects
          </Button>
          <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold gap-2 shadow-lg">
            <Plus className="w-5 h-5" />
            Create Proposal
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
                  {isLive && stat.title === 'Active Bids' && (
                    <span className="ml-2 inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  )}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.description}</p>
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

      {/* Revenue Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white dark:bg-slate-900 border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue over the past year</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
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
                  dataKey="value" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Bid Status</CardTitle>
            <CardDescription>Current bid distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bidStatusData.map((item) => (
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
                    value={(item.value / 28) * 100} 
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
        {/* Main Content - Project Matches */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Recommended Projects</h2>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 font-semibold">
                AI-Powered Matching
              </Badge>
              <Button variant="outline" size="sm" className="text-orange-600 border-orange-200 hover:bg-orange-50">
                View All Matches
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {projects.map((project) => (
              <Card 
                key={project.id} 
                className={cn(
                  "bg-white dark:bg-slate-900 hover:shadow-xl transition-all duration-300 border-l-4 group cursor-pointer",
                  getUrgencyColor(project.urgency),
                  "hover:scale-[1.01]"
                )}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex flex-wrap gap-2">
                          <Badge className={getStatusColor(project.status)}>
                            {project.status.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="border-blue-200 text-blue-700">
                            {project.category}
                          </Badge>
                          <Badge variant="outline" className="border-orange-200 text-orange-700">
                            {project.trade}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full text-sm">
                          <Bot className="w-4 h-4" />
                          {project.aiMatch}% Match
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                        {project.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {project.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          GC: {project.gc}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Due: {project.dueDate}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {project.views} views
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end justify-between gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Est. Budget</p>
                        <p className="text-2xl font-bold text-gray-900">{project.budget}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <ExternalLink className="w-4 h-4" />
                          View Details
                        </Button>
                        <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold gap-1">
                          <Target className="w-4 h-4" />
                          Bid Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Enhanced Sidebar */}
        <div className="space-y-6">
          {/* AI Copilot - More Professional */}
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-0 shadow-xl overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -left-8 bottom-8 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl"></div>
            
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                    <Bot className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">AI Copilot</h3>
                    <p className="text-xs text-gray-400">Smart Bidding Assistant</p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-3 py-1">
                  Enhanced
                </Badge>
              </div>

              <div className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-sm mb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Today's Insight</h4>
                    <p className="text-sm text-gray-200 leading-relaxed mb-3">
                      Your win rate on <span className="font-semibold text-yellow-400">Commercial HVAC</span> projects in Austin is up 15%. I've identified 3 high-value opportunities.
                    </p>
                    <Button size="sm" variant="outline" className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400 hover:text-black">
                      Review Opportunities
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <Button variant="ghost" className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 h-auto flex flex-col items-start gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="text-xs font-medium text-left">Qualify Leads</span>
                </Button>
                <Button variant="ghost" className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 h-auto flex flex-col items-start gap-2">
                  <FileText className="w-5 h-5 text-green-400" />
                  <span className="text-xs font-medium text-left">Optimize Bids</span>
                </Button>
                <Button variant="ghost" className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 h-auto flex flex-col items-start gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  <span className="text-xs font-medium text-left">Analytics</span>
                </Button>
                <Button variant="ghost" className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 h-auto flex flex-col items-start gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-xs font-medium text-left">Auto-Bid</span>
                </Button>
              </div>

              <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold">
                <ArrowRight className="w-4 h-4 mr-2" />
                Open AI Assistant
              </Button>
            </CardContent>
          </Card>

          {/* Performance Dashboard */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg font-bold">Performance Dashboard</span>
                <Button variant="ghost" size="sm" className="text-orange-600">
                  <BarChart3 className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Win Rate Trend */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">Win Rate Trend</span>
                  <span className="text-sm font-bold text-green-600">+15%</span>
                </div>
                <div className="flex items-end gap-1 h-16">
                  {[40, 60, 30, 80, 50, 90, 45].map((height, i) => (
                    <div 
                      key={i}
                      className="flex-1 bg-gradient-to-t from-yellow-400 to-orange-500 rounded-t-sm"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Action Items */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Action Items</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-900">Insurance Cert Expiring</p>
                      <p className="text-xs text-red-700">Expires in 3 days</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <Timer className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-900">Follow up on City Center Bid</p>
                      <p className="text-xs text-yellow-700">Sent 1 week ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Briefcase className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Complete Profile Gallery</p>
                      <p className="text-xs text-blue-700">Add 3 more project photos</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                    <Award className="w-4 h-4" />
                    <span className="text-lg font-bold">4.9</span>
                  </div>
                  <p className="text-xs text-gray-600">Avg Rating</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                    <Star className="w-4 h-4" />
                    <span className="text-lg font-bold">156</span>
                  </div>
                  <p className="text-xs text-gray-600">Reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubcontractorOverview;