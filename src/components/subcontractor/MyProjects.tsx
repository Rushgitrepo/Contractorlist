import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Briefcase,
  Calendar,
  MapPin,
  Building,
  DollarSign,
  CheckCircle,
  Users,
  FileText,
  Eye,
  Edit,
  MoreHorizontal,
  Zap,
  ArrowRight,
  TrendingUp,
  Activity,
  Shield,
  Layers,
  Inbox,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { scDashboardService, Deployment } from '@/services/scDashboardService';
import { useToast } from '@/hooks/use-toast';

const MyProjects = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('active');
  const [sortBy, setSortBy] = useState('progress');
  const [deployments, setDeployments] = useState<Deployment[]>([]);

  // Modal State
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Deployment | null>(null);

  useEffect(() => {
    setDeployments(scDashboardService.getDeployments());
  }, []);

  const sortedProjects = useMemo(() => {
    return [...deployments].sort((a, b) => {
      if (sortBy === 'progress') return b.progress - a.progress;
      if (sortBy === 'value') return b.budgetValue - a.budgetValue;
      return 0;
    });
  }, [sortBy, deployments]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ON-TRACK': return "bg-green-500/10 text-green-600 dark:text-green-400";
      case 'AT-RISK': return "bg-red-500/10 text-red-600 dark:text-red-400";
      case 'AHEAD': return "bg-accent/10 text-accent";
      case 'DELAYED': return "bg-red-500/10 text-red-600 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressColor = (status: string) => {
    if (status === 'AHEAD') return 'bg-accent';
    if (status === 'AT-RISK') return 'bg-red-500';
    if (status === 'DELAYED') return 'bg-red-500';
    return 'bg-accent';
  };

  const handleProjectView = (project: Deployment) => {
    setSelectedProject(project);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="min-h-full bg-gray-50 dark:bg-[#0f1115] p-6 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-accent/10 text-accent border-accent/20 font-medium uppercase text-[10px] tracking-wider px-2.5 py-0.5">
                Project Tracking
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white leading-none">
              My Active Projects
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mt-3 max-w-lg leading-relaxed">
              Monitor real-time progress, manage your field teams, and track milestones across your active project portfolio.
            </p>
          </div>
          <Button
            className="h-11 px-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white hover:bg-gray-50 font-semibold rounded-xl text-xs"
            onClick={() => {
              toast({
                title: "Report Generated",
                description: "The project status report has been compiled for download."
              });
            }}
          >
            <FileText className="w-4 h-4 mr-2" /> Export Report
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'ACTIVE PROJECTS', value: deployments.length.toString().padStart(2, '0'), sub: 'LIVE SITES', icon: Activity, color: 'text-accent' },
            { label: 'AVG PROGRESS', value: '0.0%', sub: 'OVERALL COMPLETION', icon: TrendingUp, color: 'text-gray-500' },
            { label: 'FIELD TEAM', value: deployments.reduce((acc, d) => acc + d.team, 0).toString(), sub: 'TOTAL CREW ONSITE', icon: Users, color: 'text-accent' },
            { label: 'COMPLIANCE', value: '100%', sub: 'SAFETY RATING', icon: Shield, color: 'text-green-500' },
          ].map((stat, i) => (
            <Card key={i} className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5 rounded-2xl overflow-hidden group transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-gray-50 dark:bg-black/20 rounded-xl group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300 border border-gray-100 dark:border-white/5">
                    <stat.icon className="w-4 h-4 transition-colors" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{stat.label}</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{stat.value}</h3>
                  <p className={cn("text-[10px] font-bold uppercase tracking-wider", stat.color)}>{stat.sub}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Project Interface */}
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 pt-4">
              <TabsList className="bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/5 h-auto">
                <TabsTrigger value="active" className="px-6 py-2.5 rounded-lg font-semibold text-xs data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all">
                  In Progress
                </TabsTrigger>
                <TabsTrigger value="completed" className="px-6 py-2.5 rounded-lg font-semibold text-xs data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all">
                  Completed
                </TabsTrigger>
                <TabsTrigger value="pipeline" className="px-6 py-2.5 rounded-lg font-semibold text-xs data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all">
                  Upcoming
                </TabsTrigger>
              </TabsList>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-11 lg:w-48 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-xl font-semibold text-xs uppercase tracking-widest">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="progress">Sort: Completion</SelectItem>
                  <SelectItem value="value">Sort: Value</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <TabsContent value="active" className="space-y-4">
              {sortedProjects.map((project) => (
                <Card key={project.id} className="group bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5 transition-all rounded-2xl overflow-hidden shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-8">
                      <div className="flex-1 space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight group-hover:text-accent transition-colors">{project.name}</h3>
                              <Badge className={cn("border-none font-semibold text-[9px] px-3 py-1 rounded-md", getStatusStyle(project.status))}>
                                {project.status}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-[11px] font-medium text-gray-500 dark:text-gray-400 tracking-wide">
                              <span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-accent" /> {project.client}</span>
                              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-accent" /> {project.location}</span>
                              <span className="flex items-center gap-1.5 text-accent font-semibold"><DollarSign className="w-3.5 h-3.5" /> {project.value}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-400 hover:text-accent">
                            <MoreHorizontal className="w-5 h-5" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4 border-y border-gray-50 dark:border-white/5">
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Phase</span>
                            <span className="text-xs font-semibold text-gray-900 dark:text-white uppercase">{project.phase}</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Field Team</span>
                            <span className="text-xs font-semibold text-gray-900 dark:text-white uppercase">{project.team} STAFF</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Last Check-in</span>
                            <span className="text-xs font-semibold text-gray-900 dark:text-white uppercase">{project.lastUpdate}</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Deadline</span>
                            <span className="text-xs font-semibold text-gray-900 dark:text-white uppercase font-mono">{project.endDate}</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-end">
                            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Overall Progress</span>
                            <span className="text-lg font-semibold text-gray-900 dark:text-white tabular-nums">{project.progress}%</span>
                          </div>
                          <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                            <div className={cn("h-full transition-all duration-1000", getProgressColor(project.status))} style={{ width: `${project.progress}%` }} />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 min-w-[220px] justify-center pt-6 lg:pt-0 lg:pl-8 border-t lg:border-t-0 lg:border-l border-gray-50 dark:border-white/5">
                        <Button
                          onClick={() => handleProjectView(project)}
                          className="h-11 w-full bg-gray-900 dark:bg-accent text-white dark:text-accent-foreground font-semibold text-xs rounded-xl transition-all"
                        >
                          Project Portal <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                        <Button
                          variant="outline"
                          className="h-11 w-full border-gray-200 dark:border-white/10 font-semibold text-xs rounded-xl bg-transparent hover:bg-accent hover:text-accent-foreground transition-all"
                          onClick={() => {
                            toast({
                              title: "Documents Synced",
                              description: "Project documentation has been updated."
                            });
                          }}
                        >
                          View Documents
                        </Button>
                        <Button
                          variant="ghost"
                          className="h-11 w-full font-semibold text-xs rounded-xl text-gray-400 hover:text-accent"
                          onClick={() => {
                            toast({
                              title: "Updating Logs",
                              description: "Field logs and communications updated."
                            });
                          }}
                        >
                          Communication
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4 focus-visible:outline-none">
              <div className="py-32 flex flex-col items-center justify-center text-center bg-white dark:bg-[#1c1e24] rounded-2xl border border-dashed border-gray-200 dark:border-white/10 shadow-sm">
                <div className="w-16 h-16 bg-gray-50 dark:bg-black/20 rounded-2xl flex items-center justify-center mb-6">
                  <Inbox className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white uppercase tracking-tight mb-2">No Completed Projects</h3>
                <p className="text-gray-500 dark:text-gray-400 font-semibold text-sm max-w-xs mx-auto">
                  Your completed project records will be archived here for future reference.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="pipeline" className="space-y-4 focus-visible:outline-none">
              <div className="py-32 flex flex-col items-center justify-center text-center bg-white dark:bg-[#1c1e24] rounded-2xl border border-dashed border-gray-200 dark:border-white/10 shadow-sm">
                <div className="w-16 h-16 bg-gray-50 dark:bg-black/20 rounded-2xl flex items-center justify-center mb-6">
                  <Inbox className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight mb-2">Pipeline Empty</h3>
                <p className="text-gray-500 dark:text-gray-400 font-semibold text-sm max-w-xs mx-auto">
                  Won bids will automatically appear here once the project setup is initiated.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Project Details Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-xl bg-white dark:bg-[#1c1e24] border-none rounded-xl p-0 overflow-hidden shadow-2xl">
          <div className="h-2 bg-accent w-full" />
          <div className="p-8 font-sans">
            <DialogHeader className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Badge className={cn("border-none font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-md", getStatusStyle(selectedProject?.status || ''))}>
                  {selectedProject?.status}
                </Badge>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Project ID: {selectedProject?.id}</span>
              </div>
              <DialogTitle className="text-3xl font-bold uppercase tracking-tight text-gray-900 dark:text-white leading-tight">
                {selectedProject?.name}
              </DialogTitle>
              <DialogDescription className="text-xs font-semibold uppercase tracking-widest text-gray-500 flex flex-wrap items-center gap-4 mt-4">
                <span className="flex items-center gap-2"><Building className="w-4 h-4 text-accent" /> {selectedProject?.client}</span>
                <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-accent" /> {selectedProject?.location}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="p-5 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-white/5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Contract Value</span>
                <span className="text-2xl font-bold text-accent font-mono">{selectedProject?.value}</span>
              </div>
              <div className="p-5 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-white/5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Current Phase</span>
                <span className="text-xl font-bold uppercase text-gray-900 dark:text-white">{selectedProject?.phase}</span>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Project Completion</span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white tabular-nums">{selectedProject?.progress}%</span>
                </div>
                <div className="h-3 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className={cn("h-full transition-all duration-1000", getProgressColor(selectedProject?.status || ''))} style={{ width: `${selectedProject?.progress}%` }} />
                </div>
              </div>

              <div className="flex gap-5 p-5 bg-accent/5 border border-accent/10 rounded-2xl items-center">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5 text-accent" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-tight text-accent">Project Health Note</p>
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 leading-relaxed">
                    All project parameters are currently within normal operating ranges. Staff allocation is optimized for the current {selectedProject?.phase} phase.
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-10 flex flex-col sm:flex-row gap-3">
              <Button variant="ghost" className="font-bold uppercase text-[10px] tracking-widest h-12 flex-1 rounded-xl" onClick={() => setIsDetailModalOpen(false)}>
                Close Window
              </Button>
              <Button className="bg-accent text-accent-foreground font-bold uppercase text-[10px] tracking-widest px-8 h-12 flex-1 rounded-xl shadow-lg shadow-accent/10 transition-all">
                Full Project Report
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyProjects;