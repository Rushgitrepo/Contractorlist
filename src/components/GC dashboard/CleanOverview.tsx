import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Building2,
  Users,
  Briefcase,
  MapPin,
  TrendingUp,
  MoreHorizontal,
  Calendar,
  DollarSign,
  Clock,
  ArrowRight,
  MessageSquare,
  FileText
} from 'lucide-react';
import { getProjects, getTeamMembers, updateProject } from '@/api/gc-apis';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const CleanOverview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projectFilter, setProjectFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [teamCount, setTeamCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [projectsData, teamData] = await Promise.all([
        getProjects({}),
        getTeamMembers()
      ]);
      // Sort projects by ID descending (assuming newer IDs are more recent) 
      // or created_at if available. Using simple reverse for now if API returns chronological.
      // Usually API returns latest or we sort. Let's assume current order and reverse or sort by ID.
      const sortedProjects = [...projectsData].sort((a: any, b: any) => b.id - a.id);

      setProjects(sortedProjects);
      setTeamCount(teamData.length);
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStatusUpdate = async (projectId: number, newStatus: string) => {
    try {
      // Optimistic update
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: newStatus } : p));

      await updateProject(projectId, { status: newStatus });

      toast({
        title: "Status Updated",
        description: `Project marked as ${newStatus}`,
      });
    } catch (error) {
      console.error("Failed to update status", error);
      fetchDashboardData();
      toast({
        title: "Error",
        description: "Failed to update project status",
        variant: "destructive"
      });
    }
  };



  const activeProjectsCount = projects.filter(p => ['On Track', 'In Progress', 'Active'].includes(p.status)).length;
  const recentProjects = projects.slice(0, 3);

  const stats = [
    {
      title: 'Active Projects',
      value: activeProjectsCount.toString(),
      subtext: 'All Systems Operational',
      icon: Building2,
      isActive: true,
      bgColor: 'bg-accent/10 dark:bg-accent/20',
      iconColor: 'text-accent',
      borderColor: 'border-accent/20 dark:border-accent/30'
    },
    {
      title: 'Pending Bids',
      value: '0',
      subtext: 'No pending bids',
      icon: Briefcase,
      isActive: false,
      bgColor: 'bg-gray-100 dark:bg-gray-800/50',
      iconColor: 'text-gray-400 dark:text-gray-500',
      borderColor: 'border-gray-200 dark:border-gray-700'
    },
    {
      title: 'Team Members',
      value: teamCount.toString(),
      subtext: 'Invite team',
      icon: Users,
      isActive: false,
      bgColor: 'bg-gray-100 dark:bg-gray-800/50',
      iconColor: 'text-gray-400 dark:text-gray-500',
      borderColor: 'border-gray-200 dark:border-gray-700'
    },
    {
      title: 'Messages',
      value: '0',
      subtext: 'No new messages',
      icon: MessageSquare,
      isActive: false,
      bgColor: 'bg-gray-100 dark:bg-gray-800/50',
      iconColor: 'text-gray-400 dark:text-gray-500',
      borderColor: 'border-gray-200 dark:border-gray-700'
    }
  ];

  const displayProjects = projectFilter === 'All'
    ? recentProjects
    : recentProjects.filter(p => p.status === projectFilter);

  // Helper to safely format budget
  const formatBudget = (budget: any) => {
    if (typeof budget === 'number') return `$${(budget / 1000).toFixed(0)}k`;
    if (typeof budget === 'object' && budget !== null) return budget.estimated || '-';
    return budget || '-';
  };

  return (
    <div className="p-6 md:p-8 min-h-full bg-gray-50 dark:bg-[#0f1115] text-gray-900 dark:text-white space-y-8 transition-colors duration-300">

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`group relative rounded-2xl p-5 bg-white dark:bg-[#1c1e24] border ${stat.borderColor} hover:border-accent/40 dark:hover:border-accent/30 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-accent/5 dark:hover:shadow-accent/10 ${stat.isActive ? 'shadow-md shadow-accent/10 dark:shadow-accent/20' : 'shadow-sm'}`}
            onClick={() => {
              if (stat.title === 'Active Projects') setProjectFilter('All'); // Or specific filter if desired
              if (stat.title === 'Team Members') navigate('/gc-dashboard/team');
              if (stat.title === 'Messages') navigate('/gc-dashboard/communications');
            }}
          >
            {/* Subtle background gradient for active cards */}
            {stat.isActive && (
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-accent/5 to-transparent rounded-bl-2xl pointer-events-none"></div>
            )}

            <div className="relative z-10">
              {/* Icon Box */}
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.bgColor} ${stat.borderColor} border mb-4 transition-all duration-300 group-hover:scale-105`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor} transition-colors`} />
              </div>

              {/* Content */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  {stat.title}
                </h3>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1.5">
                  {stat.value}
                </div>
                <p className={`text-xs font-medium ${stat.isActive ? 'text-accent' : 'text-gray-400 dark:text-gray-500'}`}>
                  {stat.subtext}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Projects Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Projects</h2>
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800/50 p-1 rounded-lg border border-gray-200 dark:border-white/10 overflow-x-auto scrolbar-hide">
            {['All', 'Planning', 'Bidding', 'Active', 'Completed', 'On Hold'].map((tab) => (
              <button
                key={tab}
                onClick={() => setProjectFilter(tab)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 whitespace-nowrap",
                  projectFilter === tab
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700/50"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading dashboard...</div>
        ) : recentProjects.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#1c1e24] rounded-xl border border-dashed border-gray-200 dark:border-white/10">
            <p className="text-gray-500 mb-4">No recent projects found.</p>
            <Button onClick={() => navigate('/gc-dashboard/my-projects')} className="bg-accent text-accent-foreground">Create Project</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {displayProjects.map((project, i) => {
              const isActive = ['On Track', 'In Progress', 'Active'].includes(project.status);
              return (
                <div
                  key={project.id || i}
                  onClick={() => {
                    setSelectedProject(project);
                    setIsDetailModalOpen(true);
                  }}
                  className="group relative rounded-xl p-5 bg-white dark:bg-[#1c1e24] border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-md hover:border-accent/30 dark:hover:border-accent/20 transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  {/* Hover Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-5">
                      <div className="flex-1 min-w-0 pr-2">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight mb-1.5 line-clamp-2">
                          {project.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{project.client}</p>
                      </div>


                    </div>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-3 mb-5">
                      <div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5">Location</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                          <span className="truncate">{project.location || 'N/A'}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5">Status</p>
                        <div onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <span className={cn("inline-block text-sm font-semibold cursor-pointer hover:underline", isActive ? "text-accent" : "text-gray-400")}>{project.status}</span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/10">
                              {['Planning', 'On Track', 'In Progress', 'Bidding', 'On Hold', 'Completed', 'Delayed'].map(status => (
                                <DropdownMenuItem key={status} onClick={(e) => { e.stopPropagation(); handleStatusUpdate(project.id, status) }}>{status}</DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5">Budget</p>
                        <p className="text-sm text-gray-900 dark:text-white font-mono font-semibold">{formatBudget(project.budget)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5">Est. Completion</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{project.completion || 'TBD'}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500 dark:text-gray-400 font-medium">Progress</span>
                        <span className="text-gray-900 dark:text-white font-bold">{project.progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full transition-all duration-500"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white">
          {selectedProject && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 font-medium">
                    {selectedProject.status}
                  </Badge>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{selectedProject.client}</span>
                </div>
                <DialogTitle className="text-2xl font-bold mb-2">{selectedProject.name}</DialogTitle>
                <DialogDescription className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  {selectedProject.location}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-5 py-5 border-t border-b border-gray-100 dark:border-white/5 my-5">
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5 font-medium">
                    <DollarSign className="w-3.5 h-3.5" /> Budget
                  </p>
                  <p className="text-lg font-bold font-mono text-gray-900 dark:text-white">{formatBudget(selectedProject.budget)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5" /> Est. Completion
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedProject.completion || 'TBD'}</p>
                </div>
                <div className="space-y-2 col-span-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5" /> Current Progress
                  </p>
                  <div className="flex items-center gap-3">
                    <Progress value={selectedProject.progress} className="flex-1 h-2.5" />
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{selectedProject.progress}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2.5">
                  <Button
                    variant="outline"
                    className="justify-start border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    onClick={() => navigate(`/gc-dashboard/my-projects?tab=documents`)}
                  >
                    <FileText className="w-4 h-4 mr-2" /> View Documents
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    onClick={() => navigate('/gc-dashboard/communications')}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" /> Message Team
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    onClick={() => navigate('/gc-dashboard/directory')}
                  >
                    <Users className="w-4 h-4 mr-2" /> Find Subs
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" /> View Reports
                  </Button>
                </div>
              </div>

              <DialogFooter>
                <Button
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-sm"
                  onClick={() => navigate('/gc-dashboard/my-projects')}
                >
                  Manage Full Project <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CleanOverview;
