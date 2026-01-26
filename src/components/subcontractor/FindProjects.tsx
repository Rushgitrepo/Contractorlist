import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  Search,
  Filter,
  MapPin,
  Calendar,
  Building,
  Clock,
  Star,
  Bookmark,
  BookmarkCheck,
  Bot,
  Zap,
  ArrowRight,
  Target,
  Briefcase,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { scDashboardService, Bid } from '@/services/scDashboardService';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const FindProjects = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [savedProjectIds, setSavedProjectIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tradeFilter, setTradeFilter] = useState('all');
  const [missionFilter, setMissionFilter] = useState('all');
  const [sortBy, setSortBy] = useState('match');

  // Modal State
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [lastInitiatedProject, setLastInitiatedProject] = useState<string>('');

  useEffect(() => {
    setSavedProjectIds(scDashboardService.getSavedProjects());
  }, []);

  const toggleSave = (projectId: string) => {
    const updated = scDashboardService.toggleSavedProject(projectId);
    setSavedProjectIds(updated);

    const isSaved = updated.includes(projectId);
    toast({
      title: isSaved ? "Target Locked" : "Target Released",
      description: isSaved ? "Project added to recovery list." : "Project removed from recovery list.",
    });
  };

  const rawProjects = [
    {
      id: 'project-101',
      title: 'Austin Tech Center - HVAC Installation',
      location: 'Austin, TX',
      gc: 'Turner Construction',
      gcRating: 4.8,
      type: 'Commercial',
      trade: 'HVAC',
      match: 98,
      budget: '$2.4M - $3M',
      budgetValue: 2400000,
      deadline: 'Oct 30, 2024',
      deadlineDate: new Date('2024-10-30'),
      posted: '2 hours ago',
      views: 124,
      bids: 8,
      description: 'Comprehensive HVAC installation for a new 10-story tech hub. Requires high-efficiency variable refrigerant flow (VRF) systems and advanced building automation interfaces.'
    },
    {
      id: 'project-202',
      title: 'University Annex - Climate Control Upgrade',
      location: 'San Marcos, TX',
      gc: 'Skanska',
      gcRating: 4.9,
      type: 'Education',
      trade: 'HVAC',
      match: 92,
      budget: '$850k',
      budgetValue: 850000,
      deadline: 'Nov 05, 2024',
      deadlineDate: new Date('2024-11-05'),
      posted: '1 day ago',
      views: 45,
      bids: 3,
      description: 'Upgrade of legacy climate control systems across 4 dormitory wings. Implementation of energy-efficient heat pumps and central monitoring station.'
    },
    {
      id: 'project-303',
      title: 'Downtown Austin Plaza - Maintenance Retrofit',
      location: 'Austin, TX',
      gc: 'Beck Group',
      gcRating: 4.7,
      type: 'Public Works',
      trade: 'HVAC',
      match: 85,
      budget: '$1.2M',
      budgetValue: 1200000,
      deadline: 'Nov 12, 2024',
      deadlineDate: new Date('2024-11-12'),
      posted: '3 days ago',
      views: 210,
      bids: 15,
      description: 'Full retrofit of existing ventilation and chiller systems for the North Plaza complex. Project emphasizes non-disruptive installation during business hours.'
    }
  ];

  const filteredProjects = useMemo(() => {
    return rawProjects
      .filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.gc.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTrade = tradeFilter === 'all' || p.trade.toLowerCase() === tradeFilter.toLowerCase();
        const matchesMission = missionFilter === 'all' || p.type.toLowerCase().includes(missionFilter.toLowerCase());
        return matchesSearch && matchesTrade && matchesMission;
      })
      .sort((a, b) => {
        if (sortBy === 'match') return b.match - a.match;
        if (sortBy === 'budget') return b.budgetValue - a.budgetValue;
        if (sortBy === 'deadline') return a.deadlineDate.getTime() - b.deadlineDate.getTime();
        return 0;
      });
  }, [searchQuery, tradeFilter, missionFilter, sortBy]);

  const handleInitiateBid = (project: any) => {
    const newBid: Bid = {
      id: `BID-${Math.floor(Math.random() * 10000)}`,
      projectName: project.title,
      gc: project.gc,
      location: project.location,
      bidAmount: project.budget,
      budgetValue: project.budgetValue,
      deadline: project.deadline,
      deadlineDate: '2024-10-24', // Simplified for demo
      status: 'DRAFT',
      daysLeft: 5,
      lastModified: 'JUST NOW',
      probability: project.match,
      type: 'active'
    };

    scDashboardService.saveBid(newBid);
    setLastInitiatedProject(project.title);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="min-h-full bg-gray-50 dark:bg-[#0f1115] p-4 sm:p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-yellow-400 rounded-lg">
                <Target className="w-4 h-4 text-black" />
              </div>
              <h1 className="text-xl font-bold uppercase tracking-tight text-gray-900 dark:text-white">Mission Discovery</h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-wide max-w-xl">
              Discover opportunities optimized for your trade and profile.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              className="flex-1 md:flex-none h-10 px-5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white hover:bg-gray-50 font-bold rounded-xl transition-all uppercase tracking-widest text-[10px]"
              onClick={() => {
                toast({
                  title: "Recovery List Active",
                  description: `Showing ${savedProjectIds.length} locked targets.`
                });
              }}
            >
              <Filter className="w-4 h-4 mr-2" /> RECOVERY LIST ({savedProjectIds.length})
            </Button>
          </div>
        </div>

        <Card className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5 shadow-sm rounded-xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-500 transition-colors w-4 h-4" />
                <Input
                  placeholder="Search projects or GC terminals..."
                  className="w-full h-10 pl-11 bg-gray-50 dark:bg-white/5 border-transparent focus:border-yellow-400 focus:ring-yellow-400 rounded-xl text-sm font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 lg:flex gap-4">
                <Select value={tradeFilter} onValueChange={setTradeFilter}>
                  <SelectTrigger className="h-10 lg:w-48 bg-gray-50 dark:bg-white/5 border-transparent rounded-xl font-bold uppercase text-[9px] tracking-widest">
                    <SelectValue placeholder="Trade Focus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ALL DEPARTMENTS</SelectItem>
                    <SelectItem value="hvac">HVAC SPECIALIST</SelectItem>
                    <SelectItem value="plumbing">PLUMBING SYSTEMS</SelectItem>
                    <SelectItem value="electrical">ELECTRICAL GRID</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={missionFilter} onValueChange={setMissionFilter}>
                  <SelectTrigger className="h-10 lg:w-48 bg-gray-50 dark:bg-white/5 border-transparent rounded-xl font-bold uppercase text-[9px] tracking-widest">
                    <SelectValue placeholder="Mission Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ALL MISSIONS</SelectItem>
                    <SelectItem value="commercial">COMMERCIAL BATTLE</SelectItem>
                    <SelectItem value="residential">RESIDENTIAL SITE</SelectItem>
                    <SelectItem value="public">PUBLIC WORKS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project List */}
        <div className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              Active Opportunities Found: <span className="text-yellow-600 dark:text-yellow-500">{filteredProjects.length} UNITS</span>
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sort:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-transparent border-none p-0 h-auto gap-1 text-[10px] font-bold uppercase tracking-widest outline-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">HIGHEST MATCH</SelectItem>
                  <SelectItem value="budget">MAX REVENUE</SelectItem>
                  <SelectItem value="deadline">URGENT BIDS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="group relative bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5 hover:border-yellow-400/50 transition-all duration-300 rounded-xl overflow-hidden shadow-sm hover:shadow-md"
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row">
                      {/* Project Status & Match */}
                      <div className="lg:w-16 bg-gray-50 dark:bg-white/5 flex lg:flex-col items-center justify-center p-3 gap-3 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-white/5">
                        <div className="flex flex-col items-center">
                          <span className="text-[11px] font-bold text-yellow-600 dark:text-yellow-500 tabular-nums">{project.match}%</span>
                          <div className="w-1 h-10 bg-gray-200 dark:bg-white/10 rounded-full relative overflow-hidden hidden lg:block mt-1.5">
                            <div className="absolute top-0 left-0 w-full bg-yellow-400 rounded-full transition-all duration-1000" style={{ height: `${project.match}%` }} />
                          </div>
                          <Bot className="w-4 h-4 text-gray-400 mt-1.5" />
                        </div>
                      </div>

                      <div className="flex-1 p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-3">
                          <div className="space-y-1">
                            <div className="flex flex-wrap gap-1.5 mb-1.5 text-primary">
                              <Badge className="bg-yellow-400/10 text-yellow-600 dark:text-yellow-500 border-none font-bold text-[8px] uppercase tracking-widest">
                                {project.type}
                              </Badge>
                              <Badge className="bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-none font-bold text-[8px] uppercase tracking-widest">
                                {project.trade}
                              </Badge>
                            </div>
                            <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-yellow-500 transition-colors uppercase tracking-tight">
                              {project.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              <span className="flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 text-yellow-500" />
                                {project.location}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Building className="w-3 h-3 text-yellow-500" />
                                {project.gc}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                {project.gcRating}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end">
                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Estimate</span>
                            <span className="text-xl font-bold text-gray-900 dark:text-white tabular-nums font-mono">{project.budget}</span>
                          </div>
                        </div>

                        <p className="text-gray-500 dark:text-gray-400 text-[11px] leading-relaxed mb-5 font-medium line-clamp-2 max-w-4xl">
                          {project.description}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5 gap-4">
                          <div className="flex flex-wrap items-center gap-5">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" />
                              <div className="flex flex-col">
                                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Deadline</span>
                                <span className="text-[10px] font-bold text-gray-900 dark:text-white uppercase">{project.deadline}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              <div className="flex flex-col">
                                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Posted</span>
                                <span className="text-[10px] font-bold text-gray-900 dark:text-white uppercase">{project.posted}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                              <div className="flex flex-col">
                                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Active</span>
                                <span className="text-[10px] font-bold text-green-500 uppercase">{project.bids} BIDS</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleSave(project.id)}
                              className={cn(
                                "h-10 w-10 rounded-xl transition-all",
                                savedProjectIds.includes(project.id)
                                  ? "bg-yellow-400/20 text-yellow-600 dark:text-yellow-500"
                                  : "bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-yellow-500 hover:bg-yellow-400/10"
                              )}
                            >
                              {savedProjectIds.includes(project.id) ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                            </Button>
                            <Button
                              onClick={() => handleInitiateBid(project)}
                              className="flex-1 sm:flex-none h-10 px-6 bg-black dark:bg-yellow-400 text-white dark:text-black font-bold uppercase tracking-widest text-[10px] rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all group"
                            >
                              INITIATE BID <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="p-20 text-center bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5 rounded-xl">
                <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">No Missions Found</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Try adjusting your signal filters or search query.</p>
                <Button variant="link" className="mt-4 text-yellow-600 dark:text-yellow-500 font-bold uppercase text-xs" onClick={() => { setSearchQuery(''); setTradeFilter('all'); setMissionFilter('all'); }}>
                  RESET TRANSMISSION
                </Button>
              </Card>
            )}
          </div>

          {/* Load More Section */}
          <div className="flex flex-col items-center py-6 gap-4">
            <div className="h-px w-24 bg-gray-200 dark:bg-white/10" />
            <Button variant="ghost" className="font-bold text-[10px] uppercase tracking-[0.4em] text-gray-400 hover:text-yellow-500 hover:bg-transparent">
              Download More Records
            </Button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white dark:bg-[#1c1e24] border-gray-100 dark:border-white/5 rounded-3xl p-8 text-center">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500 animate-bounce" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold uppercase tracking-tight text-center">Protocol Initiated</DialogTitle>
            <DialogDescription className="text-center font-medium text-gray-500 dark:text-gray-400">
              Draft asset for <span className="text-yellow-600 dark:text-yellow-500 font-bold">{lastInitiatedProject}</span> has been successfully logged to your terminal.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-6">
            <Button
              className="h-12 bg-black dark:bg-yellow-400 text-white dark:text-black font-bold uppercase text-xs tracking-widest rounded-xl"
              onClick={() => navigate('/subcontractor-dashboard/bid-management')}
            >
              GO TO PROTOCOLS
            </Button>
            <Button
              variant="ghost"
              className="h-12 font-bold uppercase text-xs tracking-widest text-gray-500"
              onClick={() => setIsSuccessModalOpen(false)}
            >
              CONTINUE DISCOVERY
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FindProjects;