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
      case 'ON-TRACK': return "bg-green-400/10 text-green-600 dark:text-green-500";
      case 'AT-RISK': return "bg-yellow-400/10 text-yellow-600 dark:text-yellow-500";
      case 'AHEAD': return "bg-blue-400/10 text-blue-600 dark:text-blue-400";
      case 'DELAYED': return "bg-red-400/10 text-red-600 dark:text-red-500";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressColor = (status: string) => {
    if (status === 'AHEAD') return 'bg-blue-500';
    if (status === 'AT-RISK') return 'bg-yellow-500';
    if (status === 'DELAYED') return 'bg-red-500';
    return 'bg-green-500';
  };

  const handleMissionControl = (project: Deployment) => {
    setSelectedProject(project);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="min-h-full bg-gray-50 dark:bg-[#0f1115] p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-yellow-400 rounded-lg">
                <Layers className="w-5 h-5 text-black" />
              </div>
              <h1 className="text-3xl font-bold uppercase tracking-tight text-gray-900 dark:text-white">Active Deployments</h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium max-w-xl">
              Track real-time project execution, resource allocation, and milestone achievement across all active sites.
            </p>
          </div>
          <Button
            className="h-12 px-8 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white hover:bg-gray-50 font-bold rounded-xl transition-all uppercase tracking-widest text-[10px]"
            onClick={() => {
              toast({
                title: "Generating Manifest",
                description: "Fleet status report has been compiled for export."
              });
            }}
          >
            <FileText className="w-4 h-4 mr-2" /> GENERATE MANIFEST
          </Button>
        </div>

        {/* Fleet Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'ACTIVE FLEET', value: deployments.length.toString().padStart(2, '0'), sub: 'OPERATIONAL UNITS', icon: Activity, color: 'text-yellow-500' },
            { label: 'AVG EFFICIENCY', value: '0%', sub: 'NO DATA YET', icon: TrendingUp, color: 'text-gray-500' },
            { label: 'PERSONNEL', value: deployments.reduce((acc, d) => acc + d.team, 0).toString(), sub: 'TOTAL FIELD DEPLOYED', icon: Users, color: 'text-blue-500' },
            { label: 'TRUST SCORE', value: 'N/A', sub: 'AWAITING FEEDBACK', icon: Shield, color: 'text-gray-500' },
          ].map((stat, i) => (
            <Card key={i} className="bg-white dark:bg-[#1c1e24] border-gray-100 dark:border-white/5 shadow-sm rounded-2xl overflow-hidden group hover:border-yellow-400/50 transition-all">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg group-hover:bg-yellow-400 group-hover:text-black transition-all">
                    <stat.icon className="w-5 h-5 transition-colors" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">{stat.label}</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white tabular-nums">{stat.value}</h3>
                  <p className={cn("text-[10px] font-bold uppercase tracking-widest", stat.color)}>{stat.sub}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Project Interface */}
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
              <TabsList className="bg-white dark:bg-white/5 p-1.5 rounded-2xl border border-gray-100 dark:border-white/5 h-auto">
                <TabsTrigger value="active" className="px-6 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest data-[state=active]:bg-yellow-400 data-[state=active]:text-black transition-all">
                  In Progress
                </TabsTrigger>
                <TabsTrigger value="completed" className="px-6 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest data-[state=active]:bg-yellow-400 data-[state=active]:text-black transition-all">
                  Success Logs
                </TabsTrigger>
                <TabsTrigger value="pipeline" className="px-6 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest data-[state=active]:bg-yellow-400 data-[state=active]:text-black transition-all">
                  Awaiting Prep
                </TabsTrigger>
              </TabsList>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-11 lg:w-48 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-xl font-bold uppercase text-[10px] tracking-widest">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="progress">SORT: COMPLETION</SelectItem>
                  <SelectItem value="value">SORT: REVENUE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <TabsContent value="active" className="space-y-4">
              {sortedProjects.map((project) => (
                <Card key={project.id} className="group bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5 hover:border-yellow-400/50 transition-all rounded-3xl overflow-hidden shadow-sm hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-8">
                      <div className="flex-1 space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">{project.name}</h3>
                              <Badge className={cn("border-none font-bold text-[9px] uppercase tracking-[0.2em] px-3 py-1", getStatusStyle(project.status))}>
                                {project.status}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              <span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-yellow-500" /> {project.client}</span>
                              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-yellow-500" /> {project.location}</span>
                              <span className="flex items-center gap-1.5 text-green-600"><DollarSign className="w-3.5 h-3.5" /> {project.value}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-400 hover:text-yellow-500">
                            <MoreHorizontal className="w-5 h-5" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4 border-y border-gray-50 dark:border-white/5">
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Phase</span>
                            <span className="text-xs font-bold text-gray-900 dark:text-white uppercase">{project.phase}</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Active Team</span>
                            <span className="text-xs font-bold text-gray-900 dark:text-white uppercase">{project.team} OPERATIVES</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Last Sync</span>
                            <span className="text-xs font-bold text-gray-900 dark:text-white uppercase">{project.lastUpdate}</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Timeline</span>
                            <span className="text-xs font-bold text-gray-900 dark:text-white uppercase font-mono">{project.endDate} EXPIRE</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-end">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Completion Metric</span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">{project.progress}%</span>
                          </div>
                          <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                            <div className={cn("h-full transition-all duration-1000", getProgressColor(project.status))} style={{ width: `${project.progress}%` }} />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 min-w-[220px] justify-center pt-6 lg:pt-0 lg:pl-8 border-t lg:border-t-0 lg:border-l border-gray-50 dark:border-white/5">
                        <Button
                          onClick={() => handleMissionControl(project)}
                          className="h-12 w-full bg-black dark:bg-yellow-400 text-white dark:text-black font-bold uppercase text-[10px] tracking-widest rounded-xl hover:scale-[1.02] group transition-all"
                        >
                          MISSION CONTROL <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button
                          variant="outline"
                          className="h-12 w-full border-gray-200 dark:border-white/10 font-bold uppercase text-[10px] tracking-widest rounded-xl bg-transparent"
                          onClick={() => {
                            toast({
                              title: "Asset Refinement",
                              description: "Project documents and specs synced."
                            });
                          }}
                        >
                          REFINE ASSETS
                        </Button>
                        <Button
                          variant="ghost"
                          className="h-12 w-full font-bold uppercase text-[10px] tracking-widest rounded-xl text-gray-400 hover:text-yellow-500"
                          onClick={() => {
                            toast({
                              title: "Syncing Logs",
                              description: "Communication and field logs updated."
                            });
                          }}
                        >
                          SYNC LOGS
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              <Card className="p-20 text-center bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5 rounded-3xl">
                <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">No Success Logs</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Completed missions will be archived here for record recovery.</p>
              </Card>
            </TabsContent>

            <TabsContent value="pipeline" className="space-y-4">
              <Card className="p-20 text-center bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5 rounded-3xl">
                <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">Pipeline Empty</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Secure new protocols in the terminal to populate your pipeline.</p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Deployment Details Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-xl bg-white dark:bg-[#1c1e24] border-gray-100 dark:border-white/5 rounded-3xl p-0 overflow-hidden">
          <div className="h-2 bg-yellow-400 w-full" />
          <div className="p-8">
            <DialogHeader className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Badge className={cn("border-none font-bold text-[9px] uppercase tracking-[0.2em] px-3 py-1", getStatusStyle(selectedProject?.status || ''))}>
                  {selectedProject?.status}
                </Badge>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Deployment ID: EX-{selectedProject?.id.padStart(4, '0')}</span>
              </div>
              <DialogTitle className="text-3xl font-bold uppercase tracking-tight">{selectedProject?.name}</DialogTitle>
              <DialogDescription className="text-[11px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2 mt-2">
                <Building className="w-3.5 h-3.5" /> {selectedProject?.client} Terminal • <MapPin className="w-3.5 h-3.5" /> {selectedProject?.location}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Contract Scale</span>
                <span className="text-xl font-bold text-green-600 font-mono">{selectedProject?.value}</span>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Execution Phase</span>
                <span className="text-xl font-bold uppercase">{selectedProject?.phase}</span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Operational Progress</span>
                  <span className="text-lg font-bold tabular-nums">{selectedProject?.progress}%</span>
                </div>
                <div className="h-3 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className={cn("h-full transition-all duration-1000", getProgressColor(selectedProject?.status || ''))} style={{ width: `${selectedProject?.progress}%` }} />
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                <Activity className="w-5 h-5 text-blue-500 shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-tight text-blue-700 dark:text-blue-400">Tactical Recommendation</p>
                  <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                    Target milestones are within nominal parameters. Personnel allocation is optimized for {selectedProject?.phase} phase.
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-8 flex gap-3 sm:justify-between w-full">
              <Button variant="ghost" className="font-bold uppercase text-[10px] tracking-widest" onClick={() => setIsDetailModalOpen(false)}>Close Terminal</Button>
              <Button className="bg-black dark:bg-yellow-400 text-white dark:text-black font-bold uppercase text-[10px] tracking-widest px-8 rounded-xl">View Full Logs</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyProjects;