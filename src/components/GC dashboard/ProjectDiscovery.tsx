import { useState, useEffect, useMemo } from 'react';

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
import { useNavigate } from 'react-router-dom';
import { createBid, finalizeBidSubmission, getProjectDiscovery } from '@/api/gc-apis/backend';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
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
  FileSearch,
  ChevronDown,
  Trash2,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { bidItemSchema, bidFormSchema } from '@/validation/gcBidSchemas';

import { cn } from '@/lib/utils';

import ProjectFilters, { ProjectFilterState, CSI_DIVISIONS } from '@/components/projects/ProjectFilters';

const ProjectDiscovery = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Advanced Filter States (Synced with Main Directory)
  const [filters, setFilters] = useState<ProjectFilterState>({
    location: "",
    radius: 100,
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
  const [viewMode, setViewMode] = useState<'table' | 'card'>('card');
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingBid, setIsCreatingBid] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // New Bid Form State
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidItems, setBidItems] = useState<any[]>([{ name: '', description: '', price: 0 }]);
  const [bidNotes, setBidNotes] = useState('');
  const [bidStartDate, setBidStartDate] = useState('');
  const [bidEndDate, setBidEndDate] = useState('');
  const [bidCompanyHighlights, setBidCompanyHighlights] = useState('');
  const [bidRelevantExperience, setBidRelevantExperience] = useState('');
  const [bidCredentials, setBidCredentials] = useState('');
  const [bidFormError, setBidFormError] = useState<string | null>(null);

  const calculateTotal = () => bidItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);


  const handleOpenBidModal = () => {
    setShowDetailsModal(false);
    setShowBidModal(true);
  };

  const handleSubmitBid = async () => {
    if (!selectedProject) return;

    try {
      setIsCreatingBid(true);
      setBidFormError(null);

      const normalizedItems = bidItems.map((item) => ({
        name: (item.name || '').trim(),
        description: (item.description || '').trim() || undefined,
        price: Number(item.price) || 0,
      }));

      const candidate = {
        items: normalizedItems,
        notes: bidNotes.trim() || undefined,
        estimatedStartDate: bidStartDate.trim() || undefined,
        estimatedEndDate: bidEndDate.trim() || undefined,
        companyHighlights: bidCompanyHighlights.trim() || undefined,
        relevantExperience: bidRelevantExperience.trim() || undefined,
        credentials: bidCredentials.trim() || undefined,
      };

      const parsed = bidFormSchema.safeParse(candidate);

      if (!parsed.success) {
        const messages = parsed.error.issues.map((issue) => issue.message);
        const summary = Array.from(new Set(messages)).join(' · ');
        setBidFormError(summary);
        toast({
          title: 'Please fix the bid details',
          description: summary,
          variant: 'destructive',
        });
        setIsCreatingBid(false);
        return;
      }

      const totalPrice = parsed.data.items.reduce((sum, item) => sum + item.price, 0);

      const bid = await createBid({
        projectId: selectedProject.id,
        totalPrice,
        notes: parsed.data.notes,
        items: parsed.data.items,
        estimatedStartDate: parsed.data.estimatedStartDate,
        estimatedEndDate: parsed.data.estimatedEndDate,
        companyHighlights: parsed.data.companyHighlights,
        relevantExperience: parsed.data.relevantExperience,
        credentials: parsed.data.credentials,
      });

      await finalizeBidSubmission(bid.id);

      toast({
        title: 'Proposal Submitted Successfully',
        description: `Your bid of $${totalPrice.toLocaleString()} has been sent to the project owner.`,
      });

      setShowBidModal(false);
      navigate('/gc-dashboard/bids');

    } catch (error: any) {
      console.error('Failed to submit bid:', error);
      toast({
        title: 'Submission Failed',
        description: error.response?.data?.message || 'We encountered an error while sending your proposal.',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingBid(false);
    }
  };


  // Fetch Projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const data = await getProjectDiscovery();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch marketplace projects:", error);
        toast({
          title: "Error",
          description: "Failed to load project feed. Using cached signals.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [toast]);

  // Combined Filtering Logic
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      // 1. Header Search Phrase
      const matchesSearch = !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.trades.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!filters) return matchesSearch;

      // 2. Keywords filter
      const keywords = filters.keywords?.toLowerCase() || "";
      const matchesKeywords = !keywords ||
        p.name.toLowerCase().includes(keywords) ||
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
        p.trades.some((t: string) => filters.trades.some(ft => t.toLowerCase().includes(ft.toLowerCase())));

      // 9. Budget
      const getBudgetValue = (b: string) => {
        const numeric = parseFloat(b.replace(/[^0-9.]/g, ''));
        if (isNaN(numeric)) return 0;
        if (b.toLowerCase().includes('m')) return numeric * 1000000;
        if (b.toLowerCase().includes('k')) return numeric * 1000;
        return numeric;
      };
      const projectPrice = getBudgetValue(p.budget || "0");
      const minB = filters.minBudget ? parseFloat(filters.minBudget) : -Infinity;
      const maxB = filters.maxBudget ? parseFloat(filters.maxBudget) : Infinity;
      const matchesBudget = projectPrice >= minB && projectPrice <= maxB;

      // 10. Size
      const projectSqft = parseInt((p.sqft || "0").replace(/[^0-9]/g, '')) || 0;
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
    }).sort((a, b) => {
      if (a.isProfileMatch && !b.isProfileMatch) return -1;
      if (!a.isProfileMatch && b.isProfileMatch) return 1;
      return b.matchScore - a.matchScore;
    });
  }, [projects, searchQuery, filters]);

  return (
    <div className="flex h-full w-full flex-col bg-white dark:bg-[#0f1115] text-gray-900 dark:text-white transition-colors overflow-hidden font-sans">

      {/* Re-themed Industry Search Header */}
      <div className="relative bg-gray-50 dark:bg-[#1c1e24] border-b border-gray-200 dark:border-white/5 px-8 py-8 z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-end gap-6">
            {/* Search Phrase */}
            <div className="flex-1 min-w-[280px] space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Search Phrase</label>
              <div className="relative">
                <Input
                  placeholder="Enter keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 bg-white dark:bg-black/20 border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-yellow-400 pr-10 shadow-sm"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-600 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            {/* Region Input */}
            <div className="w-64 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Service Region</label>
              <Input
                placeholder="Enter city or region..."
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                className="h-11 bg-white dark:bg-black/20 border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus-visible:ring-2 focus-visible:ring-yellow-400 shadow-sm"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col items-end gap-2">
              <Button
                className="h-11 px-10 bg-yellow-400 hover:bg-yellow-500 text-black font-black uppercase text-[11px] tracking-widest rounded-xl shadow-sm transition-all"
                onClick={() => {
                  toast({
                    title: "Fetching Results",
                    description: "Updating bid feed with real-time market signals.",
                  });
                }}
              >
                Search Market
              </Button>
              
            </div>

           
          </div>
          
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Industry Advanced Filters Sidebar */}
        <aside className="w-80 bg-gray-50 dark:bg-[#13151b] border-r border-gray-200 dark:border-white/10 hidden xl:flex flex-col overflow-y-auto custom-scrollbar">
          
          <ProjectFilters onFiltersChange={setFilters} initialFilters={filters} />
        </aside>

        {/* Project Feed */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white dark:bg-[#0f1115]">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              
              <div className="flex items-center gap-">
                <TrendingUp className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-black">Consolidated Bid Feed</h2>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-[9px] border-none text-gray-500 bg-gray-100 dark:bg-white/5 px-3 py-1 uppercase">{filteredProjects.length} Projects Available</Badge>
                </div>
              

              </div>
            
              
               {/* View Toggles */}
            <div className="ml-auto flex items-center self-center gap-2 bg-gray-100 dark:bg-black/20 p-1 rounded-lg border border-gray-200 dark:border-white/10">
              <Button variant="ghost" size="sm" onClick={() => setViewMode('card')} className={cn("rounded-md h-8 w-8 p-0", viewMode === 'card' ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm" : "text-gray-400")}><Layers size={16} /></Button>
              <Button variant="ghost" size="sm" onClick={() => setViewMode('table')} className={cn("rounded-md h-8 w-8 p-0", viewMode === 'table' ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm" : "text-gray-400")}><ListIcon size={16} /></Button>
            </div>
            
            </div>

            <div className={cn("grid gap-8", viewMode === 'card' ? "grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3" : "grid-cols-1")}>
              {filteredProjects.map((p) => (
                <Card
                  key={p.id}
                  className={cn(
                    "group relative overflow-hidden bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5 transition-all cursor-pointer rounded-2xl hover:shadow-lg",
                    p.isProfileMatch ? "ring-2 ring-yellow-400/30" : ""
                  )}
                  onClick={() => { setSelectedProject(p); setShowDetailsModal(true); }}
                >
                  <div className="absolute top-0 right-0 p-4 flex gap-2">
                    {p.isProfileMatch && (
                      <div className="bg-yellow-400 text-black text-[8px] font-black px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1">
                        <Star size={9} className="fill-current" /> PROFILE MATCH
                      </div>
                    )}
                    <div className="bg-black/60 backdrop-blur-md text-white text-[8px] font-black px-2 py-0.5 rounded-full">
                      DUE: {p.deadline}
                    </div>
                  </div>

                  <CardContent className="p-8">
                    <div className="flex flex-col h-full gap-6">
                      <div className="flex justify-between items-start">
                        <Badge className="bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white border-none font-black text-[9px] h-5 tracking-widest uppercase">{p.source}</Badge>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{p.posted}</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                          NIGP: {p.nigpCode}
                        </div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-tight group-hover:text-yellow-600 transition-colors line-clamp-2">{p.name}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-gray-400">
                          <span className="flex items-center gap-1"><MapPin size={12} className="text-yellow-600" /> {p.location} ({p.distance})</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-gray-900 dark:text-white"><ShieldCheck size={12} /> {p.status}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 focus-visible:ring-0">
                        {p.trades?.map((t: string) => (
                          <span key={t} className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/5 text-gray-500">{t}</span>
                        ))}
                      </div>

                      <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                        <div>
                          <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1">Project Valuation</p>
                          <p className="text-lg font-black font-mono text-gray-900 dark:text-white">{p.budget}</p>
                        </div>
                        <Button className="h-10 px-6 rounded-xl bg-black dark:bg-yellow-500 text-white dark:text-black font-black uppercase text-[10px] tracking-widest">View Bid Package</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredProjects.length === 0 && (
                <div className="col-span-full py-24 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-white/[0.02] rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/5">
                  <FileSearch size={48} className="text-gray-300 mb-4" />
                  <h4 className="text-2xl font-black tracking-tight mb-2">No Market Signals Found</h4>
                  <p className="text-gray-500 max-w-sm font-bold text-sm">No solicitations match your criteria. Try clearing some industry signals.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white dark:bg-[#111318] border-gray-200 dark:border-white/10 shadow-2xl rounded-2xl">
          {selectedProject && (
            <div className="flex flex-col">
              <div className="bg-gray-100/50 dark:bg-black/30 p-8 border-b border-gray-100 dark:border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-2">
                    <Badge className="bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white border-none font-black text-[9px] uppercase tracking-widest px-3">{selectedProject.source}</Badge>
                    <Badge className="bg-yellow-400 text-black border-none font-black text-[9px] uppercase tracking-widest px-3">verified solicitation</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-black dark:text-white" />
                    <span className="text-[10px] font-black uppercase text-black dark:text-white">Bids Due: {selectedProject.deadline}</span>
                  </div>
                </div>
                <h2 className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white leading-tight mb-2">
                  {selectedProject.name}
                </h2>
                <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                  <span className="flex items-center gap-1.5"><MapPin size={14} className="text-yellow-500" /> {selectedProject.location}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 border-l border-gray-300 dark:border-white/10 pl-4"><Tag size={14} className="text-gray-900 dark:text-white" /> NIGP Code: {selectedProject.nigpCode}</span>
                </div>
              </div>

              <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1">Est. Value</p>
                    <p className="text-sm font-black font-mono">{selectedProject.budget}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1">Scale</p>
                    <p className="text-sm font-black">{selectedProject.sqft} SQFT</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1">Phase</p>
                    <p className="text-sm font-black uppercase text-gray-900 dark:text-white">{selectedProject.status}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1">Urgency</p>
                    <p className="text-sm font-black uppercase text-yellow-600 dark:text-yellow-500">Active</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Executive Summary</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-semibold">
                    {selectedProject.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Classification Details</h4>
                  <div className="flex flex-wrap gap-2">
                    <div className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/5 text-[10px] font-bold text-gray-500">
                      NIGP Code: {selectedProject.nigpCode}
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/5 text-[10px] font-bold text-gray-500">
                      Sector: {selectedProject.category}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-gray-100 dark:bg-black/30 border-t border-gray-100 dark:border-white/5 flex gap-4">
                <Button onClick={() => setShowDetailsModal(false)} variant="outline" className="flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest dark:border-white/10">Dismiss</Button>
                <Button onClick={handleOpenBidModal} className="flex-[2] h-12 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-black font-black uppercase text-[10px] tracking-widest shadow-lg">
                  {isCreatingBid ? 'Starting Bid...' : 'Bid on Project'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bid Proposal Form Modal */}
      <Dialog open={showBidModal} onOpenChange={setShowBidModal}>
        <DialogContent className="max-w-3xl bg-white dark:bg-[#111318] p-0 overflow-hidden border-gray-200 dark:border-white/10 shadow-2xl rounded-2xl">
          <div className="flex flex-col max-h-[90vh]">
            <div className="p-8 bg-gray-100/50 dark:bg-black/30 border-b border-gray-100 dark:border-white/5">
              <div className="flex justify-between items-center mb-2">
                <Badge className="bg-yellow-400 text-black border-none font-black text-[9px] uppercase tracking-widest px-3">Official Proposal</Badge>
                <div className="text-right">
                  <p className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Total Bid Amount</p>
                  <p className="text-2xl font-black font-mono text-yellow-600">${calculateTotal().toLocaleString()}</p>
                </div>
              </div>
              <h2 className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white leading-tight">
                Submit Proposal
              </h2>
              <p className="text-xs font-bold text-gray-500 mt-1">Project: {selectedProject?.name}</p>
            </div>

            <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Estimated Start Date</Label>
                  <Input
                    type="date"
                    value={bidStartDate}
                    onChange={(e) => setBidStartDate(e.target.value)}
                    className="bg-white dark:bg-black/20 border-gray-200 dark:border-white/10 h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Estimated End Date</Label>
                  <Input
                    type="date"
                    value={bidEndDate}
                    onChange={(e) => setBidEndDate(e.target.value)}
                    className="bg-white dark:bg-black/20 border-gray-200 dark:border-white/10 h-11 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Line Items</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setBidItems([...bidItems, { name: '', description: '', price: 0 }])}
                    className="h-7 text-[10px] font-bold rounded-lg border-gray-200 dark:border-white/10"
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add Item
                  </Button>
                </div>
                <div className="space-y-3">
                  {bidItems.map((item, index) => (
                    <div key={index} className="flex gap-2 items-start p-4 bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/5">
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="Item Name"
                          value={item.name}
                          onChange={(e) => {
                            const newItems = [...bidItems];
                            newItems[index].name = e.target.value;
                            setBidItems(newItems);
                          }}
                          className="h-9 bg-white dark:bg-black/20 text-xs rounded-xl"
                        />
                        <Input
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => {
                            const newItems = [...bidItems];
                            newItems[index].description = e.target.value;
                            setBidItems(newItems);
                          }}
                          className="h-9 bg-white dark:bg-black/20 text-xs rounded-xl"
                        />
                      </div>
                      <div className="w-32 space-y-2">
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                          <Input
                            type="number"
                            placeholder="Price"
                            value={item.price}
                            onChange={(e) => {
                              const newItems = [...bidItems];
                              newItems[index].price = e.target.value;
                              setBidItems(newItems);
                            }}
                            className="pl-8 h-9 bg-white dark:bg-black/20 text-xs rounded-xl"
                          />
                        </div>
                        {bidItems.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setBidItems(bidItems.filter((_, i) => i !== index))}
                            className="w-full text-red-500 hover:text-red-600 text-[10px] font-bold h-7 rounded-lg"
                          >
                            <Trash2 className="w-3 h-3 mr-1" /> Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/20 space-y-6">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-600 fill-current" />
                  <h4 className="text-[11px] font-black uppercase tracking-tighter text-yellow-800 dark:text-yellow-500">The GC Edge</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase tracking-widest text-yellow-700/60">Company Highlights</Label>
                    <Input
                      placeholder="e.g. 20+ years, 500+ projects"
                      value={bidCompanyHighlights}
                      onChange={(e) => setBidCompanyHighlights(e.target.value)}
                      className="h-9 bg-white dark:bg-black/40 border-yellow-200 dark:border-yellow-900/30 text-xs rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase tracking-widest text-yellow-700/60">Credentials & Licensing</Label>
                    <Input
                      placeholder="Licensed, Insured, OSHA30"
                      value={bidCredentials}
                      onChange={(e) => setBidCredentials(e.target.value)}
                      className="h-9 bg-white dark:bg-black/40 border-yellow-200 dark:border-yellow-900/30 text-xs rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-yellow-700/60">Relevant Experience</Label>
                  <Textarea
                    placeholder="Describe similar projects..."
                    value={bidRelevantExperience}
                    onChange={(e) => setBidRelevantExperience(e.target.value)}
                    className="min-h-[80px] bg-white dark:bg-black/40 border-yellow-200 dark:border-yellow-900/30 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Proposal Summary</Label>
                <Textarea
                  placeholder="Summarize your expertise..."
                  value={bidNotes}
                  onChange={(e) => setBidNotes(e.target.value)}
                  className="min-h-[120px] bg-white dark:bg-black/20 border-gray-200 dark:border-white/10 rounded-2xl p-4 text-sm"
                />
              </div>
            </div>

            <div className="p-8 bg-gray-100 dark:bg-black/30 border-t border-gray-100 dark:border-white/5 flex gap-4">
              <Button onClick={() => setShowBidModal(false)} variant="outline" className="flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest dark:border-white/10">Cancel</Button>
              <Button
                onClick={handleSubmitBid}
                disabled={isCreatingBid || calculateTotal() <= 0}
                className="flex-[2] h-12 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-black font-black uppercase text-[10px] tracking-widest shadow-lg disabled:opacity-50"
              >
                <Briefcase className="w-4 h-4 mr-2" />
                {isCreatingBid ? 'Submitting...' : 'Submit Proposal'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDiscovery;
