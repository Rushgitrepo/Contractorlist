import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  CheckCircle2,
  Globe,
  Navigation,
  Layers,
  DollarSign,
  ShieldCheck,
  Tag,
  FileSearch,
  ChevronDown,
  TrendingUp,
  RotateCcw,
  Mail,
  Smartphone, MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { scDashboardService, Bid } from '@/services/scDashboardService';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProjectFilters, { ProjectFilterState, CSI_DIVISIONS } from '@/components/projects/ProjectFilters';

const FindProjects = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [savedProjectIds, setSavedProjectIds] = useState<string[]>([]);
  // Advanced Filter States (Synced with Main Directory)
  const [filters, setFilters] = useState<ProjectFilterState>({
    location: "",
    radius: 50,
    keywords: "",
    stages: [],
    solicitationStatus: [],
    categories: [],
    sectors: [],
    constructionTypes: [],
    laborRequirements: [],
    trades: [],
    valueRanges: [],
    minBudget: "",
    maxBudget: "",
    minSize: "",
    maxSize: "",
    sources: [],
    nigpCode: "",
    bidDateFrom: "",
    bidDateTo: "",
    documentsOnly: false,
    savedOnly: false,
    state: "",
    city: "",
    county: "",
    publishDate: "",
    biddingWithin: "",
    materials: [],
    experienceLevel: "",
    bonded: false,
    insured: false,
    specAlerts: false
  });
  const [searchQuery, setSearchQuery] = useState('');

  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [sortBy, setSortBy] = useState('match');
  const [showAllTrades, setShowAllTrades] = useState(false);

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

  const projectCategories = ['Commercial', 'Residential', 'Industrial', 'Healthcare', 'Educational', 'Multi-Family', 'Government'];
  const sources = ['PlanHub', 'Dodge Construction'];
  const projectStatuses = ['Open', 'Bidding', 'Awarded', 'Closed'];
  const mileageOptions = ['10', '25', '50', '100', '250'];
  const trades = [
    'HVAC',
    'Plumbing',
    'Electrical',
    'Concrete',
    'Roofing',
    'Masonry',
    'Metals',
    'Wood & Plastics',
    'Finishes',
    'Specialties',
    'Fire Suppression',
    'Communications',
    'Electronic Safety',
    'Earthwork',
    'Exterior Improvements'
  ];

  const rawProjects = [
    {
      id: 'project-101',
      title: 'Austin Tech Center - HVAC Installation',
      location: 'Austin, TX',
      distanceValue: 2.4,
      distance: '2.4 mi',
      gc: 'Turner Construction',
      gcRating: 4.8,
      category: 'Commercial',
      projectType: 'Commercial',
      trade: 'HVAC',
      trades: ['HVAC', 'Controls', 'Ductwork'],
      match: 98,
      matchScore: 98,
      budget: '$2.4M - $3M',
      budgetValue: 2400000,
      deadline: '2024-10-30',
      deadlineDate: new Date('2024-10-30'),
      posted: '2 hours ago',
      views: 124,
      bids: 8,
      isProfileMatch: true,
      nigpCode: '914-00',
      sqft: '45,000',
      status: 'Bidding',
      source: 'PlanHub',
      description: 'Comprehensive HVAC installation for a new 10-story tech hub. Requires high-efficiency variable refrigerant flow (VRF) systems and advanced building automation interfaces.'
    },
    {
      id: 'project-202',
      title: 'University Annex - Climate Control Upgrade',
      location: 'San Marcos, TX',
      distanceValue: 15,
      distance: '15 mi',
      gc: 'Skanska',
      gcRating: 4.9,
      category: 'Educational',
      projectType: 'Educational',
      trade: 'HVAC',
      trades: ['HVAC', 'Refrigeration'],
      match: 92,
      matchScore: 92,
      budget: '$850k',
      budgetValue: 850000,
      deadline: '2024-11-05',
      deadlineDate: new Date('2024-11-05'),
      posted: '1 day ago',
      views: 45,
      bids: 3,
      isProfileMatch: true,
      nigpCode: '910-36',
      sqft: '20,000',
      status: 'Open',
      source: 'Dodge Construction',
      description: 'Upgrade of legacy climate control systems across 4 dormitory wings. Implementation of energy-efficient heat pumps and central monitoring station.'
    },
    {
      id: 'project-303',
      title: 'Downtown Austin Plaza - Maintenance Retrofit',
      location: 'Austin, TX',
      distanceValue: 4.8,
      distance: '4.8 mi',
      gc: 'Beck Group',
      gcRating: 4.7,
      category: 'Government',
      projectType: 'Government',
      trade: 'HVAC',
      trades: ['HVAC', 'Plumbing'],
      match: 85,
      matchScore: 85,
      budget: '$1.2M',
      budgetValue: 1200000,
      deadline: '2024-11-12',
      deadlineDate: new Date('2024-11-12'),
      posted: '3 days ago',
      views: 210,
      bids: 15,
      isProfileMatch: false,
      nigpCode: '914-68',
      sqft: '32,000',
      status: 'Bidding',
      source: 'PlanHub',
      description: 'Full retrofit of existing ventilation and chiller systems for the North Plaza complex. Project emphasizes non-disruptive installation during business hours.'
    }
  ];

  const filteredProjects = useMemo(() => {
    const filteredProjects = rawProjects
      .filter(p => {
        // 1. Header Search Phrase
        const matchesSearch = !searchQuery ||
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.trades.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

        // 2. Keywords filter
        const keywords = filters.keywords?.toLowerCase() || "";
        const matchesKeywords = !keywords ||
          p.title.toLowerCase().includes(keywords) ||
          p.description.toLowerCase().includes(keywords);

        // 3. Location/Radius filter
        const matchesLocation = !filters.location ||
          p.location.toLowerCase().includes(filters.location.toLowerCase());

        const matchesMileage = !filters.radius || (p.distanceValue || 0) <= filters.radius;

        // 4. NIGP Code
        const matchesNigp = !filters.nigpCode || (p.nigpCode && p.nigpCode.includes(filters.nigpCode));

        // 5. Project Types / Categories
        const matchesType = filters.categories.length === 0 || filters.categories.includes(p.category);

        // 6. Status
        const matchesStatus = filters.solicitationStatus.length === 0 || filters.solicitationStatus.includes(p.status);

        // 7. Sources
        const matchesSource = filters.sources.length === 0 || filters.sources.includes(p.source);

        // 8. Trades
        const matchesTrades = filters.trades.length === 0 ||
          p.trades.some(t => filters.trades.some(ft => t.toLowerCase().includes(ft.toLowerCase())));

        // 9. Budget
        const projectPrice = p.budgetValue || 0;
        const minB = filters.minBudget ? parseFloat(filters.minBudget) : -Infinity;
        const maxB = filters.maxBudget ? parseFloat(filters.maxBudget) : Infinity;
        const matchesBudget = projectPrice >= minB && projectPrice <= maxB;

        // 10. Size
        const projectSqft = parseInt(p.sqft.replace(/[^0-9]/g, '')) || 0;
        const minS = filters.minSize ? parseInt(filters.minSize) : -Infinity;
        const maxS = filters.maxSize ? parseInt(filters.maxSize) : Infinity;
        const matchesSize = projectSqft >= minS && projectSqft <= maxS;

        // 11. Bid Due Urgency
        const deadlineDate = new Date(p.deadline);
        const today = new Date();
        const diffDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const matchesUrgency = !filters.biddingWithin || filters.biddingWithin === 'any' ||
          (filters.biddingWithin === '7' && diffDays <= 7) ||
          (filters.biddingWithin === '30' && diffDays <= 30);

        return matchesSearch && matchesKeywords && matchesLocation && matchesMileage &&
          matchesNigp && matchesType && matchesStatus && matchesSource &&
          matchesTrades && matchesBudget && matchesSize && matchesUrgency;
      })
      .sort((a, b) => {
        if (sortBy === 'match') return b.match - a.match;
        if (sortBy === 'budget') return b.budgetValue - a.budgetValue;
        if (sortBy === 'deadline') return a.deadlineDate.getTime() - b.deadlineDate.getTime();
        return 0;
      });
    return filteredProjects;
  }, [searchQuery, filters, sortBy]);

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
    <div className="flex h-full w-full flex-col bg-white dark:bg-[#0f1115] text-gray-900 dark:text-white transition-colors duration-500 overflow-hidden">

      {/* Dynamic Header Section */}
      <div className="relative bg-gray-50/80 dark:bg-[#1c1e24]/80 border-b border-gray-200 dark:border-white/5 px-8 py-8 z-20 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center shadow-lg shadow-accent/5">
                <Search className="text-accent-foreground" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-1">Browse Projects</h1>
                <p className="text-xs font-medium text-gray-400 flex items-center gap-2">
                  <Globe size={12} className="text-accent" /> Project Marketplace & Opportunity Feed
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white dark:bg-black/20 p-2 rounded-2xl shadow-sm border border-gray-200 dark:border-white/10">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent transition-colors w-4 h-4" />
                <Input
                  placeholder="Keywords (HVAC, Austin, expansion...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-72 h-12 bg-transparent border-none focus-visible:ring-0 text-sm font-medium pl-11"
                />
              </div>
              <div className="w-px h-8 bg-gray-200 dark:bg-white/10"></div>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent transition-colors w-4 h-4" />
                <Input
                  placeholder="Region"
                  value={filters?.location || ""}
                  onChange={(e) => setFilters(prev => ({ ...prev!, location: e.target.value }))}
                  className="w-48 h-12 bg-transparent border-none focus-visible:ring-0 text-sm font-medium pl-11"
                />
              </div>
              <Button className="bg-accent text-accent-foreground rounded-xl px-8 h-12 font-semibold text-xs transition-all shadow-sm">
                Save Criteria
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Filters */}
        <aside className="w-80 bg-gray-50 dark:bg-[#13151b] border-r border-gray-200 dark:border-white/10 overflow-y-auto hidden xl:block custom-scrollbar">
          <ProjectFilters onFiltersChange={setFilters} initialFilters={filters} />
        </aside>

        {/* Main Opportunity Feed */}
        <main className="flex-1 overflow-y-auto px-8 py-10 bg-gray-50/10">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <TrendingUp className="text-accent" size={20} />
                Live Opportunities <span className="text-gray-400 ml-4 font-mono text-sm opacity-50">/ {filteredProjects.length} Projects Available</span>
              </h2>
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
                <Button variant="ghost" size="sm" onClick={() => setViewMode('card')} className={cn("h-8 px-4 font-semibold text-xs", viewMode === 'card' ? "bg-accent text-accent-foreground shadow-sm" : "text-gray-400")}><Layers size={14} className="mr-2" />Card</Button>
                <Button variant="ghost" size="sm" onClick={() => setViewMode('table')} className={cn("h-8 px-4 font-semibold text-xs", viewMode === 'table' ? "bg-accent text-accent-foreground shadow-sm" : "text-gray-400")}><RotateCcw size={14} className="mr-2" />Table</Button>
              </div>
            </div>

            <div className="space-y-6 pb-20">
              {filteredProjects.map((p) => (
                <Card
                  key={p.id}
                  className="group relative overflow-hidden bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5 hover:border-accent/40 transition-all duration-300 rounded-3xl shadow-sm"
                >
                  <CardContent className="p-10">
                    <div className="flex flex-col lg:flex-row justify-between gap-8 h-full">
                      <div className="flex items-start gap-8 flex-1">
                        <div className="relative shrink-0">
                          <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center transition-all group-hover:bg-accent/10 overflow-hidden shadow-sm border border-gray-100 dark:border-white/10">
                            <Briefcase className="text-gray-400 group-hover:text-accent transition-colors" size={28} />
                          </div>
                          {p.isProfileMatch && (
                            <div className="absolute -top-3 -left-3 bg-accent text-accent-foreground text-[8px] font-bold px-2.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 z-10 border-2 border-white dark:border-[#1c1e24]">
                              <Bot size={10} /> Top Match
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge className="bg-accent/10 text-accent dark:bg-accent/20 border-none font-semibold text-[9px] px-3 py-1">{p.category}</Badge>
                            <Badge className="bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 border-none font-semibold text-[9px] px-3 py-1 flex items-center gap-1"><ShieldCheck size={10} /> {p.status}</Badge>
                            <Badge variant="outline" className="text-[9px] border-gray-200 dark:border-white/10 font-semibold text-gray-400">{p.posted}</Badge>
                          </div>

                          <h3 className="text-2xl font-bold tracking-tight leading-tight group-hover:text-accent transition-colors mb-3">{p.title}</h3>

                          <div className="flex flex-wrap items-center gap-6 text-[10px] font-medium text-gray-500 tracking-wide mb-6 border-b border-gray-100 dark:border-white/5 pb-4">
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300"><MapPin size={14} className="text-accent" /> {p.location}</div>
                            <div className="flex items-center gap-2"><Building size={14} className="text-accent" /> GC: {p.gc}</div>
                            <div className="flex items-center gap-2"><Star size={14} className="text-yellow-400 fill-current" /> {p.gcRating}</div>
                            <div className="flex items-center gap-2 text-gray-400"><Tag size={14} /> NIGP {p.nigpCode}</div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {p.trades.map(t => (
                              <div key={t} className="px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-xl text-[9px] font-medium text-gray-500 border border-gray-100 dark:border-white/5 group-hover:border-accent/20 transition-all">{t}</div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between min-w-[240px] gap-6 pl-8 border-l border-gray-100 dark:border-white/5">
                        <div className="text-right">
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Estimate Value</p>
                          <p className="text-3xl font-bold font-mono tracking-tighter text-gray-900 dark:text-white group-hover:text-accent transition-colors">{p.budget}</p>
                        </div>

                        <div className="flex flex-col gap-3 w-full">
                          <Button
                            onClick={() => handleInitiateBid(p)}
                            className="h-12 bg-accent text-accent-foreground font-semibold text-xs rounded-xl transition-all w-full flex gap-3 shadow-none"
                          >
                            Start Bid <Zap size={18} />
                          </Button>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              onClick={(e: any) => { e.stopPropagation(); toggleSave(p.id); }}
                              className={cn(
                                "h-12 flex-1 flex items-center justify-center gap-2 font-bold text-[9px] uppercase tracking-widest rounded-xl transition-all border border-gray-100 dark:border-white/5",
                                savedProjectIds.includes(p.id) ? "bg-accent text-accent-foreground border-none" : "bg-white dark:bg-white/5 text-gray-400 hover:text-accent"
                              )}
                            >
                              {savedProjectIds.includes(p.id) ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                              {savedProjectIds.includes(p.id) ? 'Saved' : 'Save'}
                            </Button>
                            <Button variant="ghost" className="h-12 w-12 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 text-gray-400 hover:text-accent">
                              <MoreHorizontal size={18} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  {/* Status Interaction Bar */}
                  <div className="bg-gray-50/50 dark:bg-black/20 px-10 py-4 flex items-center justify-between border-t border-gray-100 dark:border-white/5">
                    <div className="flex gap-8 text-[9px] font-semibold text-gray-400">
                      <span className="flex items-center gap-2"><Calendar size={14} className="text-accent" /> Bid Due: {p.deadline}</span>
                      <span className="flex items-center gap-2"><Smartphone size={14} className="text-accent" /> {p.views} Views</span>
                      <span className="flex items-center gap-2"><Tag size={14} /> Source: {p.source}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2 mr-3">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-5 h-5 rounded-full border-2 border-white dark:border-[#1c1e24] bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[8px] font-bold text-white">{i}</div>
                        ))}
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-accent">{p.bids} Competing Bidders</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="py-32 flex flex-col items-center justify-center text-center">
                <Target size={60} className="text-gray-200 dark:text-white/5 mb-8" />
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">No Projects Found</h3>
                <p className="text-gray-500 max-w-sm font-bold text-sm tracking-wide leading-relaxed uppercase opacity-60">Adjust your search filters to find active marketplace bids.</p>
                <Button variant="link" size="sm" onClick={() => {
                  setSearchQuery('');
                }} className="text-[9px] uppercase font-bold text-accent">Reset Filters</Button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Success Modal */}
      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white dark:bg-[#1c1e24] border-none rounded-3xl p-10 text-center shadow-2xl">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-accent/20">
            <CheckCircle2 className="w-10 h-10 text-accent" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight text-center uppercase">Bid Draft Created</DialogTitle>
            <DialogDescription className="text-center font-semibold text-gray-500 dark:text-gray-400 mt-2">
              The bid for <span className="text-accent font-bold">{lastInitiatedProject}</span> has been added to your management portal.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-8">
            <Button
              className="h-12 bg-accent text-accent-foreground font-bold uppercase text-[11px] tracking-wider rounded-xl shadow-lg shadow-accent/10 transition-all"
              onClick={() => navigate('/subcontractor-dashboard/bid-management')}
            >
              Go to Bid Management
            </Button>
            <Button
              variant="ghost"
              className="h-12 font-bold uppercase text-[11px] tracking-widest text-gray-400"
              onClick={() => setIsSuccessModalOpen(false)}
            >
              Keep Browsing
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FindProjects;
