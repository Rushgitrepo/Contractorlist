import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MapPin,
  Building2,
  Star,
  List as ListIcon,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Layers,
  MoreHorizontal,
  Globe,
  Navigation,
  Hammer,
  RotateCcw,
  Clock,
  Briefcase,
  DollarSign,
  Phone,
  Mail,
  Calendar,
  ShieldCheck,
  Tag,
  Bookmark,
  BookmarkCheck,
  FileSearch,
  ChevronDown,
  Bot
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const ProjectDiscovery = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedProjectTypes, setSelectedProjectTypes] = useState<string[]>([]);
  const [maxMileage, setMaxMileage] = useState<string>('100');
  const [selectedTrades, setSelectedTrades] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [nigpCode, setNigpCode] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('card');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAllTrades, setShowAllTrades] = useState(false);
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [minSize, setMinSize] = useState('');
  const [maxSize, setMaxSize] = useState('');
  const [dueWithin, setDueWithin] = useState('any');
  const [multipleKeywords, setMultipleKeywords] = useState('');
  const [savedProjects, setSavedProjects] = useState<Set<number>>(new Set());

  // Industry-standard mock projects for Subcontractors
  const [projects] = useState([
    {
      id: 1,
      name: 'Downtown Medical Center Expansion',
      location: 'Austin, TX',
      distanceValue: 2.4,
      distance: '2.4 mi',
      budget: '$2.4M - $3M',
      category: 'Healthcare',
      projectType: 'Expansion',
      source: 'PlanHub',
      posted: '2 days ago',
      deadline: '2026-02-15',
      nigpCode: '914-00',
      matchScore: 98,
      isProfileMatch: true,
      trades: ['HVAC', 'Medical Gas', 'Energy Controls'],
      gc: 'Turner Construction',
      gcRating: 4.8,
      sqft: '150,000',
      status: 'Bidding',
      description: 'Seeking experienced HVAC contractor for 150,000 sq ft medical facility expansion. Project includes installation of advanced climate control systems, medical gas systems, and energy-efficient HVAC solutions.',
      views: 45,
      bids: 12
    },
    {
      id: 2,
      name: 'Riverside High School Renovation',
      location: 'San Marcos, TX',
      distanceValue: 15,
      distance: '15 mi',
      budget: '$850k',
      category: 'Education',
      projectType: 'Renovation',
      source: 'Dodge Construction',
      posted: '5 days ago',
      deadline: '2026-03-01',
      nigpCode: '910-36',
      matchScore: 92,
      isProfileMatch: true,
      trades: ['HVAC', 'Ductwork', 'Refrigeration'],
      gc: 'Skanska',
      gcRating: 4.9,
      sqft: '80,000',
      status: 'Open',
      description: 'Complete HVAC system upgrade for 80,000 sq ft high school facility. Includes new energy-efficient units, ductwork replacement, and smart climate controls.',
      views: 12,
      bids: 3
    },
    {
      id: 3,
      name: 'The Aurora Apartments Phase 2',
      location: 'Austin, TX',
      distanceValue: 30,
      distance: '30 mi',
      budget: '$1.2M',
      category: 'Multi-Family',
      projectType: 'New Project',
      source: 'PlanHub',
      posted: '1 week ago',
      deadline: '2026-02-10',
      nigpCode: '914-68',
      matchScore: 88,
      isProfileMatch: false,
      trades: ['Plumbing', 'Fixtures', 'Water Efficiency'],
      gc: 'D.R. Horton',
      gcRating: 4.7,
      sqft: '145,000',
      status: 'Bidding',
      description: 'Plumbing installation for 200-unit luxury apartment complex. Includes rough-in, fixtures, and water efficiency systems for all units and common areas.',
      views: 210,
      bids: 8
    }
  ]);

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

  const filteredProjects = projects
    .filter(p => {
      // 1. Header Search Phrase
      const matchesSearch = !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.trades.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      // 2. Multiple Keywords
      const keywordsList = multipleKeywords.split(',').map(k => k.trim().toLowerCase()).filter(k => k !== '');
      const matchesMultipleKeywords = keywordsList.length === 0 ||
        keywordsList.every(k =>
          p.name.toLowerCase().includes(k) ||
          p.description.toLowerCase().includes(k) ||
          p.trades.some(t => t.toLowerCase().includes(k))
        );

      // 3. Service Region
      const matchesLocation = !locationSearch || locationSearch === 'AllRegions' ||
        p.location.toLowerCase().includes(locationSearch.toLowerCase());

      // 4. NIGP Code
      const matchesNigp = !nigpCode || p.nigpCode.includes(nigpCode);

      // 5. Project Category
      const matchesType = selectedProjectTypes.length === 0 || selectedProjectTypes.includes(p.category);

      // 6. Solicitation Status
      const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(p.status);

      // 7. Marketplace Source
      const matchesSource = selectedSources.length === 0 || selectedSources.includes(p.source);

      // 8. Operational Radius
      const matchesMileage = p.distanceValue <= parseInt(maxMileage);

      // 9. Trades
      const matchesTrades = selectedTrades.length === 0 || p.trades.some(t => selectedTrades.includes(t));

      // 10. Budget Range
      const getBudgetValue = (b: string) => {
        const numeric = parseFloat(b.replace(/[^0-9.]/g, ''));
        if (isNaN(numeric)) return 0;
        if (b.toLowerCase().includes('m')) return numeric * 1000000;
        if (b.toLowerCase().includes('k')) return numeric * 1000;
        return numeric;
      };
      const projectPrice = getBudgetValue(p.budget.split('-')[0]);
      const filterMin = minBudget ? parseFloat(minBudget) : -Infinity;
      const filterMax = maxBudget ? parseFloat(maxBudget) : Infinity;
      const matchesBudget = projectPrice >= filterMin && projectPrice <= filterMax;

      // 11. Size Range (SQFT)
      const projectSqft = parseInt(p.sqft.replace(/[^0-9]/g, '')) || 0;
      const filterMinSize = minSize ? parseInt(minSize) : -Infinity;
      const filterMaxSize = maxSize ? parseInt(maxSize) : Infinity;
      const matchesSize = projectSqft >= filterMinSize && projectSqft <= filterMaxSize;

      // 12. Bid Due Urgency
      const deadlineDate = new Date(p.deadline);
      const today = new Date();
      const diffDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const matchesUrgency = dueWithin === 'any' ||
        (dueWithin === '7' && diffDays <= 7) ||
        (dueWithin === '30' && diffDays <= 30);

      return matchesSearch && matchesMultipleKeywords && matchesLocation && matchesNigp &&
        matchesType && matchesStatus && matchesSource && matchesMileage &&
        matchesTrades && matchesBudget && matchesSize && matchesUrgency;
    })
    .sort((a, b) => {
      if (a.isProfileMatch && !b.isProfileMatch) return -1;
      if (!a.isProfileMatch && b.isProfileMatch) return 1;
      return b.matchScore - a.matchScore;
    });

  const toggleFilter = (item: string, state: string[], setState: (val: string[]) => void) => {
    setState(state.includes(item) ? state.filter(i => i !== item) : [...state, item]);
  };

  const handleSaveSearch = () => {
    toast({
      title: "Search Criteria Saved",
      description: "You will receive alerts for new projects matching these industry filters.",
    });
  };

  const toggleSave = (projectId: number) => {
    const newSaved = new Set(savedProjects);
    if (newSaved.has(projectId)) {
      newSaved.delete(projectId);
    } else {
      newSaved.add(projectId);
    }
    setSavedProjects(newSaved);
  };

  return (
    <div className="flex h-full w-full flex-col bg-white dark:bg-[#0f1115] text-gray-900 dark:text-white transition-colors duration-500 overflow-hidden font-sans">

      {/* Header Section */}
      <div className="relative bg-gray-50/80 dark:bg-[#1c1e24]/80 border-b border-gray-200 dark:border-white/5 px-8 py-8 z-20 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center shadow-xl shadow-accent/20">
                <FileSearch className="text-accent-foreground" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-1 text-gray-900 dark:text-white">
                  Project <span className="text-accent">Discovery</span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-sm flex items-center gap-2">
                  <Globe size={14} className="text-accent" /> Bidding Network & Subcontractor Hub
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white dark:bg-white/5 p-2 rounded-2xl shadow-sm border border-gray-200 dark:border-white/10">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent transition-colors w-4 h-4" />
                <Input
                  placeholder="Keywords (HVAC, Austin, expansion...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-72 h-10 bg-transparent border-none focus-visible:ring-0 text-sm font-medium pl-11"
                />
              </div>
              <div className="w-px h-6 bg-gray-200 dark:bg-white/10"></div>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent transition-colors w-4 h-4" />
                <Input
                  placeholder="Region"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  className="w-48 h-10 bg-transparent border-none focus-visible:ring-0 text-sm font-medium pl-11"
                />
              </div>
              <Button onClick={handleSaveSearch} className="bg-accent text-accent-foreground rounded-xl px-6 h-10 font-semibold text-xs transition-all shadow-sm">
                Save Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Advanced Professional Filters */}
        <aside className="w-[320px] bg-gray-50/50 dark:bg-black/10 border-r border-gray-200 dark:border-white/5 overflow-y-auto hidden xl:block z-10">
          <div className="p-8 space-y-10 pb-20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Advanced Filters</h3>
              <Button variant="link" size="sm" onClick={() => {
                // ... reset logic
              }} className="text-[10px] uppercase font-semibold text-accent">Reset All</Button>
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Layers size={14} className="text-accent" /> Multiple Keywords (AND)
              </Label>
              <Input
                placeholder="Comma separated terms..."
                value={multipleKeywords}
                onChange={(e) => setMultipleKeywords(e.target.value)}
                className="bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-xs font-bold rounded-xl h-10"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Navigation size={14} className="text-accent" /> Operational Radius
              </Label>
              <div className="grid grid-cols-5 gap-1.5 p-1 bg-gray-200/50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5">
                {mileageOptions.map(m => (
                  <button
                    key={m}
                    onClick={() => setMaxMileage(m)}
                    className={cn(
                      "py-2 text-[9px] font-bold rounded-lg transition-all",
                      maxMileage === m ? "bg-white dark:bg-white/10 text-accent shadow-sm" : "text-gray-400 hover:text-gray-600"
                    )}
                  >{m}m</button>
                ))}
              </div>
            </div>

             <div className="space-y-4">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Trade / CSI Divisions</Label>
              <div className="flex flex-wrap gap-2">
                {trades.slice(0, showAllTrades ? undefined : 8).map(t => (
                  <Badge
                    key={t}
                    onClick={() => toggleFilter(t, selectedTrades, setSelectedTrades)}
                    className={cn(
                       "cursor-pointer px-3 py-1 text-[10px] font-medium border-none transition-all",
                      selectedTrades.includes(t) ? "bg-accent text-accent-foreground shadow-sm" : "bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10"
                    )}
                  >{t}</Badge>
                ))}
                <button
                  onClick={() => setShowAllTrades(!showAllTrades)}
                  className="text-[10px] font-semibold text-accent hover:underline p-1"
                >
                  {showAllTrades ? '- Less' : '+ More Divisions'}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <DollarSign size={14} className="text-accent" /> Budget Range
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Min $" value={minBudget} onChange={(e) => setMinBudget(e.target.value)} className="bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 h-10 text-[11px] font-bold" />
                <Input placeholder="Max $" value={maxBudget} onChange={(e) => setMaxBudget(e.target.value)} className="bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 h-10 text-[11px] font-bold" />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Building2 size={14} className="text-accent" /> Project Scale (SQFT)
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Min SQFT" value={minSize} onChange={(e) => setMinSize(e.target.value)} className="bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 h-10 text-[11px] font-bold" />
                <Input placeholder="Max SQFT" value={maxSize} onChange={(e) => setMaxSize(e.target.value)} className="bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 h-10 text-[11px] font-bold" />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Clock size={14} className="text-accent" /> Bid Due Urgency
              </Label>
              <Select value={dueWithin} onValueChange={setDueWithin}>
                <SelectTrigger className="h-10 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-xl text-[11px] font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/10 text-xs font-bold">
                  <SelectItem value="any">Anytime</SelectItem>
                  <SelectItem value="7">Next 7 Days</SelectItem>
                  <SelectItem value="30">Next 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Solicitation Status</Label>
              <div className="flex flex-wrap gap-2">
                {projectStatuses.map(s => (
                  <Badge
                    key={s}
                    onClick={() => toggleFilter(s, selectedStatus, setSelectedStatus)}
                    className={cn(
                      "cursor-pointer px-3 py-1 text-[9px] font-bold uppercase tracking-tight border-none transition-all",
                      selectedStatus.includes(s) ? "bg-black dark:bg-white text-white dark:text-black shadow-lg" : "bg-gray-200/50 dark:bg-white/5 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10"
                    )}
                  >{s}</Badge>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Feed Content */}
        <main className="flex-1 overflow-y-auto px-8 py-10 bg-gray-50/10 transition-all duration-500">
          <div className="max-w-[1200px] mx-auto">
            {/* Feed Statistics & Tools */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold tracking-tight flex items-center gap-2 text-gray-900 dark:text-white">
                  <TrendingUp className="text-accent" size={20} />
                  Live Bid Feed <span className="text-gray-400 ml-2 font-medium text-sm">/{filteredProjects.length} Opportunities found</span>
                </h2>
              </div>
               <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/10">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('card')}
                  className={cn("h-8 px-3 rounded-lg font-semibold text-xs", viewMode === 'card' ? "bg-white dark:bg-white/10 text-accent shadow-sm" : "text-gray-500")}
                >
                  <Layers className="w-3.5 h-3.5 mr-2" /> Extended
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className={cn("h-8 px-3 rounded-lg font-semibold text-xs", viewMode === 'table' ? "bg-white dark:bg-white/10 text-accent shadow-sm" : "text-gray-500")}
                >
                  <ListIcon className="w-3.5 h-3.5 mr-2" /> Compact
                </Button>
              </div>
            </div>

            {/* Project Feed */}
            <div className="space-y-6 pb-20">
              {filteredProjects.map((p) => (
                <Card
                  key={p.id}
                  className="group relative overflow-hidden bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5 hover:border-accent/40 transition-all duration-300 rounded-2xl shadow-sm hover:shadow-md cursor-pointer"
                  onClick={() => { setSelectedProject(p); setShowDetailsModal(true); }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 dark:bg-yellow-400/[0.02] rounded-bl-[100px] border-l border-b border-yellow-400/10 pointer-events-none"></div>

                  <CardContent className="p-10">
                    <div className="flex flex-col lg:flex-row justify-between gap-8 h-full">
                      <div className="flex items-start gap-8 flex-1 min-w-0">
                        <div className="relative group/avatar shrink-0">
                          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center transition-all group-hover/avatar:bg-yellow-400 overflow-hidden shadow-lg border border-gray-200 dark:border-white/10 group-hover/avatar:rotate-3">
                            <Building2 className="text-gray-400 group-hover:avatar:text-accent transition-colors" size={28} />
                          </div>
                          {p.isProfileMatch && (
                            <div className="absolute -top-3 -left-3 bg-accent text-accent-foreground text-[8px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 z-10 border-2 border-white dark:border-[#1c1e24]">
                              <Bot size={10} /> Profile Match
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge className="bg-accent/10 text-accent border-none font-bold text-[9px] uppercase tracking-widest px-3 py-1">{p.category}</Badge>
                            <Badge className="bg-accent/10 text-accent border-none font-bold text-[9px] uppercase tracking-widest px-3 py-1 flex items-center gap-1"><ShieldCheck size={10} /> {p.status}</Badge>
                            <Badge variant="outline" className="text-[9px] border-gray-200 dark:border-white/10 uppercase font-bold text-gray-400 tracking-widest">{p.posted}</Badge>
                          </div>

                          <h3 className="text-2xl font-bold tracking-tight leading-tight group-hover:text-accent transition-colors mb-3 uppercase truncate">{p.name}</h3>

                          <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">
                            <div className="flex items-center gap-2"><MapPin size={14} className="text-accent" /> {p.location} <span className="text-[8px] opacity-40">({p.distance})</span></div>
                            <div className="flex items-center gap-2"><Briefcase size={14} className="text-accent" /> {p.gc} <span className="flex items-center gap-1 text-accent"><Star size={10} fill="currentColor" /> {p.gcRating}</span></div>
                            <div className="flex items-center gap-2"><Tag size={14} className="text-accent" /> NIGP {p.nigpCode}</div>
                            <div className="flex items-center gap-2"><Layers size={14} className="text-accent" /> {p.sqft} SQFT</div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {p.trades.map(t => (
                              <div key={t} className="px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-400 border border-gray-100 dark:border-white/5 group-hover:border-yellow-400/20 group-hover:text-yellow-600/80 transition-all">{t}</div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between min-w-[240px] gap-6 pl-8 border-l border-gray-100 dark:border-white/5">
                        <div className="text-right">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Estimate Capacity</p>
                          <p className="text-3xl font-bold font-mono tracking-tighter text-gray-900 dark:text-white group-hover:text-accent transition-colors uppercase">{p.budget}</p>
                        </div>

                        <div className="flex flex-col gap-3 w-full group/actions">
                          <Button className="h-12 bg-accent text-accent-foreground font-bold uppercase text-[11px] tracking-widest rounded-xl shadow-sm transition-all w-full flex gap-3">
                            Review Project <ChevronDown size={18} />
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={(e) => { e.stopPropagation(); toggleSave(p.id); }}
                            className={cn(
                              "h-12 w-full flex items-center justify-center gap-3 font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all",
                              savedProjects.has(p.id)
                                ? "bg-accent text-accent-foreground border-none"
                                : "bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-accent hover:bg-accent/10"
                            )}
                          >
                            {savedProjects.has(p.id) ? (
                              <>Saved Signal <BookmarkCheck className="w-4 h-4" /></>
                            ) : (
                              <>Save Opportunity <Bookmark className="w-4 h-4" /></>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  {/* Status Bar */}
                  <div className="bg-gray-50/50 dark:bg-black/20 px-10 py-4 flex items-center justify-between border-t border-gray-100 dark:border-white/5 group-hover:bg-yellow-400/5 transition-colors">
                    <div className="flex gap-8 text-[9px] font-bold uppercase tracking-widest text-gray-400">
                      <span className="flex items-center gap-2"><Calendar size={14} className="text-accent" /> Deadline: {new Date(p.deadline).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="flex items-center gap-2"><Clock size={14} className="text-accent" /> {p.bids} Active Bidders</span>
                      <span className="flex items-center gap-2"><Tag size={14} /> From {p.source}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-green-600">Bidding Now</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="py-32 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-8 border border-gray-200 dark:border-white/5 animate-bounce">
                  <AlertCircle size={40} className="text-gray-300" />
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-tight mb-4">Zero Matching Signals</h3>
                <p className="text-gray-500 max-w-sm font-semibold text-sm tracking-wide leading-relaxed uppercase opacity-60">Adjust your industry filters or NIGP segments to expand the discovery radius. No projects currently match your exact profile criteria.</p>
                <Button variant="link" onClick={() => { setSearchQuery(''); setLocationSearch(''); }} className="mt-8 text-accent font-bold uppercase tracking-widest text-xs">Reset All Search Data</Button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modern Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-4xl bg-white dark:bg-[#1c1e24] border-none shadow-2xl rounded-3xl p-0 overflow-hidden">
          {selectedProject && (
            <div className="flex flex-col h-full">
              {/* Modal Banner */}
              <div className="p-10 bg-black dark:bg-yellow-400 text-white dark:text-black">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-2">
                    <Badge className="bg-white/10 text-white dark:text-black border-none font-bold text-[10px] uppercase tracking-widest px-4 py-1.5">{selectedProject.category}</Badge>
                    <Badge className="bg-accent text-accent-foreground border-none font-bold text-[10px] uppercase tracking-widest px-4 py-1.5">GC: {selectedProject.gc}</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest">
                      <Bot size={16} /> {selectedProject.matchScore}% Match
                    </div>
                  </div>
                </div>
                <h2 className="text-4xl font-bold uppercase tracking-tight leading-none mb-4">{selectedProject.name}</h2>
                <div className="flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest opacity-80">
                  <span className="flex items-center gap-2"><MapPin size={16} /> {selectedProject.location}</span>
                  <span className="flex items-center gap-2"><DollarSign size={16} /> {selectedProject.budget}</span>
                  <span className="flex items-center gap-2"><Layers size={16} /> {selectedProject.sqft} SQFT</span>
                </div>
              </div>

              {/* Modal Body */}
              <ScrollArea className="max-h-[60vh] p-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="md:col-span-2 space-y-10">
                    <div>
                      <h4 className="text-[10px] font-bold uppercase text-accent tracking-widest mb-6 flex items-center gap-2">
                        <Briefcase size={14} /> Project Scope & Specifications
                      </h4>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed italic border-l-4 border-accent pl-6 py-2 bg-gray-50/50 dark:bg-white/[0.02] rounded-r-2xl">
                        "{selectedProject.description}"
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
                        <p className="text-[10px] font-bold uppercase text-gray-400 mb-3 tracking-widest">Target Trades</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.trades.map(t => (
                            <Badge key={t} variant="secondary" className="bg-white dark:bg-black/20 text-gray-600 dark:text-gray-300 border-none text-[9px] font-bold">{t}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
                        <p className="text-[10px] font-bold uppercase text-gray-400 mb-3 tracking-widest">GC Profile</p>
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-xs font-bold uppercase">{selectedProject.gc}</p>
                            <div className="flex items-center gap-1 text-accent font-bold text-[9px] uppercase tracking-tight">
                              <Star size={10} fill="currentColor" /> {selectedProject.gcRating} Enterprise Verified
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-6">Bid Command Center</p>
                    <div className="space-y-4">
                      <Button className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-bold uppercase text-[10px] tracking-widest rounded-xl shadow-sm flex gap-2">
                        Respond to GC <Navigation size={14} />
                      </Button>
                      <Button variant="outline" className="w-full h-12 border-white/20 text-white hover:bg-white/10 font-bold uppercase text-[10px] tracking-widest rounded-xl flex gap-2 border-2">
                        Download Plans <MapPin size={14} />
                      </Button>
                    </div>

                    <div className="mt-8 space-y-3 pt-6 border-t border-white/10">
                      <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-tight opacity-60">
                        <span>Internal RFI Priority</span>
                        <span className="text-red-500">Urgent</span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-tight opacity-60">
                        <span>Security Clearance</span>
                        <span>Level 2 Required</span>
                      </div>
                    </div>

                    <Button variant="ghost" className="w-full h-12 font-bold uppercase text-[9px] tracking-widest text-gray-400 hover:text-accent gap-2">
                      <Mail size={14} /> Contact Prime Estimator
                    </Button>
                  </div>
                </div>
              </ScrollArea>

              {/* Sticky Modal Footer */}
              <div className="p-8 bg-gray-50/80 dark:bg-black/40 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">Live Bid Stream Enabled <span className="text-gray-200 dark:text-gray-800 ml-4 opacity-10">|</span> <span className="ml-4 text-emerald-500 uppercase">Secured by Antigravity SC Hub</span></p>
                </div>
                <Button onClick={() => setShowDetailsModal(false)} variant="link" className="font-bold uppercase text-[10px] tracking-widest text-gray-400 hover:text-black dark:hover:text-white">Close Workspace</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDiscovery;
