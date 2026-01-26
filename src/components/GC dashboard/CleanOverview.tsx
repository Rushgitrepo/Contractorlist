import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
  Plus,
  Calendar,
  DollarSign,
  Clock,
  ArrowRight,
  MessageSquare,
  FileText
} from 'lucide-react';
import {
  CircularProgressbar,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";


const CleanOverview = () => {
  const navigate = useNavigate();
  const [projectFilter, setProjectFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const stats = [
    {
      title: 'Active Projects',
      value: '1',
      subtext: 'All Systems Operational',
      icon: Building2,
      progress: 100,
      color: '#FFD700', // Gold
      textColor: 'text-yellow-400'
    },
    {
      title: 'Pending Bids',
      value: '0',
      subtext: 'No pending bids',
      icon: Briefcase,
      progress: 0,
      color: '#A1A1AA', // Gray
      textColor: 'text-gray-400'
    },
    {
      title: 'Team Members',
      value: '0',
      subtext: 'Invite team',
      icon: Users,
      progress: 0,
      color: '#A1A1AA', // Gray
      textColor: 'text-gray-400'
    },
    {
      title: 'Messages',
      value: '0',
      subtext: 'No new messages',
      icon: TrendingUp, // Using generic icon
      progress: 0,
      color: '#A1A1AA', // Gray
      textColor: 'text-gray-400'
    }
  ];

  const recentProjects = [
    {
      name: 'Downtown Office Renovation',
      client: 'Sample Client LLC',
      location: 'Austin, TX',
      status: 'Active',
      budget: '$2.4M',
      completion: 'Mar 2025',
      progress: 65
    },
    {
      name: 'Modern Residence Expansion',
      client: 'Private Owner',
      location: 'Austin, TX',
      status: 'Planning',
      budget: '$0.8M',
      completion: 'Aug 2025',
      progress: 15
    },
    {
      name: 'Retail Space Build-out',
      client: 'Metro Retail Group',
      location: 'Austin, TX',
      status: 'Completed',
      budget: '$1.2M',
      completion: 'Jan 2025',
      progress: 100
    }
  ];

  const filteredProjects = projectFilter === 'All'
    ? recentProjects
    : recentProjects.filter(p => p.status === projectFilter);

  return (
    <div className="p-6 md:p-8 min-h-full bg-gray-50 dark:bg-[#0f1115] text-gray-900 dark:text-white space-y-8 transition-colors duration-300">

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`glass-card rounded-3xl p-6 relative overflow-hidden group hover:border-yellow-400 dark:hover:border-yellow-500/50 transition-all cursor-pointer bg-white dark:bg-[#1c1e24] border border-gray-200 dark:border-white/5 shadow-sm ${stat.progress > 0 ? 'dark:glow-yellow shadow-md' : ''}`}
            onClick={() => {
              if (stat.title === 'Active Projects') setProjectFilter('Active');
              if (stat.title === 'Team Members') navigate('/gc-dashboard/team');
              if (stat.title === 'Messages') navigate('/gc-dashboard/communications');
            }}
          >
            {/* Background Glow Effect - Light Mode: subtle gradient, Dark Mode: glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-yellow-50/50 to-transparent dark:from-yellow-500/10 dark:to-transparent rounded-bl-full -mr-4 -mt-4 pointer-events-none`}></div>

            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{stat.title}</h3>
                <div className="text-4xl font-bold font-sans text-gray-900 dark:text-white mb-2">{stat.value}</div>
                <div className={`text-xs font-medium tracking-wide ${stat.progress > 0 ? "text-yellow-600 dark:text-yellow-400" : "text-gray-400 dark:text-gray-500"}`}>
                  {stat.subtext}
                </div>
              </div>

              {/* Circular indicator */}
              <div className="w-16 h-16 relative">
                <CircularProgressbar
                  value={stat.progress || 0}
                  styles={buildStyles({
                    pathColor: stat.color,
                    trailColor: "rgba(128,128,128,0.1)",
                    strokeLinecap: "round"
                  })}
                />
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                  <stat.icon className="w-6 h-6" style={{ color: stat.progress > 0 ? '#EAB308' : 'currentColor' }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Projects Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Projects</h2>
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-black/40 p-1 rounded-full border border-gray-200 dark:border-white/10">
            {['All', 'Planning', 'Active', 'Completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setProjectFilter(tab)}
                className={cn(
                  "px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-300",
                  projectFilter === tab
                    ? "bg-yellow-400 dark:bg-yellow-500 text-black shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, i) => (
            <div
              key={i}
              onClick={() => {
                setSelectedProject(project);
                setIsDetailModalOpen(true);
              }}
              className="glass-card rounded-2xl p-6 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors group cursor-pointer relative overflow-hidden bg-white dark:bg-[#1c1e24] border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-md"
            >
              {/* Hover Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-1 max-w-[80%] line-clamp-2">{project.name}</h3>
                  <p className="text-xs text-gray-500">{project.client}</p>
                </div>
                <button className="text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm mb-6">
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Location</p>
                  <p className="text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-yellow-500" />
                    {project.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Status</p>
                  <span className="text-yellow-600 dark:text-yellow-400 font-medium">{project.status}</span>
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Budget</p>
                  <p className="text-gray-900 dark:text-white font-mono">{project.budget}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Est. Completion</p>
                  <p className="text-gray-700 dark:text-gray-300">{project.completion}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Progress</span>
                  <span className="text-gray-900 dark:text-white font-medium">{project.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 dark:bg-yellow-500 rounded-full dark:glow-yellow"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white">
          {selectedProject && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 border-yellow-400/20">
                    {selectedProject.status}
                  </Badge>
                  <span className="text-sm text-gray-500">{selectedProject.client}</span>
                </div>
                <DialogTitle className="text-2xl font-bold">{selectedProject.name}</DialogTitle>
                <DialogDescription className="text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  {selectedProject.location}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-6 py-6 border-t border-b border-gray-100 dark:border-white/5 my-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase flex items-center gap-1">
                    <DollarSign className="w-3 h-3" /> Budget
                  </p>
                  <p className="text-lg font-bold font-mono">{selectedProject.budget}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Est. Completion
                  </p>
                  <p className="text-lg font-bold">{selectedProject.completion}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Current Progress
                  </p>
                  <div className="flex items-center gap-3">
                    <Progress value={selectedProject.progress} className="flex-1 h-2" />
                    <span className="text-sm font-bold">{selectedProject.progress}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="justify-start border-gray-200 dark:border-white/10" onClick={() => navigate('/gc-dashboard/my-projects')}>
                    <FileText className="w-4 h-4 mr-2" /> View Documents
                  </Button>
                  <Button variant="outline" className="justify-start border-gray-200 dark:border-white/10" onClick={() => navigate('/gc-dashboard/communications')}>
                    <MessageSquare className="w-4 h-4 mr-2" /> Message Team
                  </Button>
                  <Button variant="outline" className="justify-start border-gray-200 dark:border-white/10" onClick={() => navigate('/gc-dashboard/directory')}>
                    <Users className="w-4 h-4 mr-2" /> Find Subs
                  </Button>
                  <Button variant="outline" className="justify-start border-gray-200 dark:border-white/10">
                    <TrendingUp className="w-4 h-4 mr-2" /> View Reports
                  </Button>
                </div>
              </div>

              <DialogFooter>
                <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold" onClick={() => navigate('/gc-dashboard/my-projects')}>
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
