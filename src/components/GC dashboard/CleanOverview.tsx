import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Building,
  Users,
  Briefcase,
  ArrowRight,
  MessageSquare,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getDashboardOverview, getRecentProjects, initializeFreshUserData } from '@/services/gcDashboardService';

const CleanOverview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeProjects: 0,
    pendingBids: 0,
    teamMembers: 0,
    messages: 0
  });
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check if user is fresh (no data)
        const overviewData = await getDashboardOverview();
        const recentData = await getRecentProjects(3);
        
        // If no data, initialize fresh user
        if (overviewData.activeProjects === 0 && recentData.length === 0) {
          await initializeFreshUserData();
          // Reload data after initialization
          const newOverview = await getDashboardOverview();
          const newRecent = await getRecentProjects(3);
          setStats(newOverview);
          setRecentProjects(newRecent);
        } else {
          setStats(overviewData);
          setRecentProjects(recentData);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Initialize fresh user on error
        await initializeFreshUserData();
        const newOverview = await getDashboardOverview();
        const newRecent = await getRecentProjects(3);
        setStats(newOverview);
        setRecentProjects(newRecent);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const statsData = [
    {
      title: 'Active Projects',
      value: stats.activeProjects.toString(),
      change: stats.activeProjects > 0 ? 'Active projects' : 'Get started by creating a project',
      icon: Building,
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
      trend: stats.activeProjects > 0 ? 'up' : 'neutral'
    },
    {
      title: 'Pending Bids',
      value: stats.pendingBids.toString(),
      change: stats.pendingBids > 0 ? 'Awaiting response' : 'No pending bids',
      icon: Briefcase,
      color: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
      trend: 'neutral'
    },
    {
      title: 'Team Members',
      value: stats.teamMembers.toString(),
      change: stats.teamMembers > 0 ? 'Across all projects' : 'Invite team members',
      icon: Users,
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
      trend: 'neutral'
    },
    {
      title: 'Messages',
      value: stats.messages.toString(),
      change: stats.messages > 0 ? 'Unread messages' : 'No new messages',
      icon: MessageSquare,
      color: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
      trend: 'neutral'
    }
  ];

  // recentProjects is now loaded from API

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-full">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back! Here's a comprehensive view of your construction projects and business performance.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              All Systems Operational
            </Badge>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData.map((stat, index) => (
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

        {/* Recent Projects - Table Format */}
        <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Projects
              </h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/gc-dashboard/my-projects')}
                className="text-yellow-600 dark:text-yellow-400"
              >
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <Card className="border-gray-200 dark:border-gray-800">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Project</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Client</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Progress</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Budget</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Completion</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                            Loading projects...
                          </td>
                        </tr>
                      ) : recentProjects.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <Building className="w-12 h-12 text-gray-400" />
                              <p className="text-gray-600 dark:text-gray-400">No projects yet</p>
                              <Button 
                                onClick={() => navigate('/gc-dashboard/my-projects')}
                                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold mt-2"
                              >
                                Create Your First Project
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        recentProjects.map((project, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer" onClick={() => navigate('/gc-dashboard/my-projects')}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <div className="text-sm font-semibold text-gray-900 dark:text-white">{project.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3" />
                                {project.location}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">{project.client}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={`${
                              project.status === 'On Track' 
                                ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : project.status === 'Near Completion'
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }`}>
                              {project.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-16">
                                <Progress value={project.progress} className="h-2" />
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{project.progress}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">{project.budget}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600 dark:text-gray-400">{project.completion}</div>
                          </td>
                        </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default CleanOverview;
