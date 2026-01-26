import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
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
  Search,
  MapPin,
  Filter,
  Building2,
  Calendar,
  ArrowUpRight,
  DollarSign,
  Briefcase,
  Star,
  Zap,
  List as ListIcon,
  Gavel,
  Clock,
  FileText,
  Users,
  Grid3x3,
  X,
  Phone,
  Mail,
  Square,
  Ruler,
  HardHat,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Compass,
  Layers,
  MoreHorizontal
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const ProjectDiscovery = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('austin');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedBudgetRange, setSelectedBudgetRange] = useState<string[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('card');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [bidDuration, setBidDuration] = useState('');
  const [bidProposal, setBidProposal] = useState('');

  const projects = [
    {
      id: 1,
      name: 'Downtown Commercial Plaza Renovation',
      location: 'Austin, TX',
      zipCode: '78701',
      distance: '2.4 mi',
      budget: '$2.4M - $3.1M',
      budgetMin: 2400000,
      budgetMax: 3100000,
      type: 'Commercial',
      posted: '2 days ago',
      deadline: 'Oct 30, 2024',
      matchScore: 94,
      isHot: true,
      tags: ['Renovation', 'Electrical', 'HVAC'],
      trade: ['Electrical', 'HVAC', 'General Construction'],
      description: 'Complete renovation of 3-story commercial plaza including new electrical systems, HVAC overhaul, and exterior facade updates. Project requires GC with experience in commercial renovations.',
      owner: 'Metro Properties LLC',
      ownerEmail: 'contact@metroproperties.com',
      ownerPhone: '(512) 555-0100',
      sqft: '45,000',
      duration: '12-18 months',
      status: 'Bidding',
      requirements: ['Commercial license', '5+ years experience', 'Bonding capacity $3M+'],
      documents: ['Project Plans.pdf', 'Specifications.pdf', 'Bid Package.zip']
    },
    {
      id: 2,
      name: 'Oak Ridge Medical Center Annex',
      location: 'Round Rock, TX',
      zipCode: '78681',
      distance: '15 mi',
      budget: '$8.5M - $10M',
      budgetMin: 8500000,
      budgetMax: 10000000,
      type: 'Healthcare',
      posted: '5 hours ago',
      deadline: 'Nov 15, 2024',
      matchScore: 88,
      isHot: false,
      tags: ['New Construction', 'Healthcare'],
      trade: ['General Construction', 'Plumbing', 'Electrical'],
      description: 'New construction of a 20,000 sq ft medical annex. Requires specialized healthcare construction experience and medical gas certification.',
      owner: 'Oak Ridge Health',
      ownerEmail: 'facilities@oakridge.org',
      ownerPhone: '(512) 555-0250',
      sqft: '20,000',
      duration: '18 months',
      status: 'Open',
      requirements: ['Healthcare construction certification', 'Safety record < 0.8 EMR'],
      documents: ['Schematics.pdf']
    },
    {
      id: 3,
      name: 'Residential Complex Phase 2',
      location: 'San Marcos, TX',
      zipCode: '78666',
      distance: '30 mi',
      budget: '$12M - $15M',
      budgetMin: 12000000,
      budgetMax: 15000000,
      type: 'Multi-Family',
      posted: '1 week ago',
      deadline: 'Nov 01, 2024',
      matchScore: 76,
      isHot: true,
      tags: ['New Construction', 'Residential'],
      trade: ['General Construction', 'Concrete', 'Framing'],
      description: 'Phase 2 of Riverside Apartments. 4 buildings, 120 units total. Wood frame construction on slab on grade.',
      owner: 'Riverside Development',
      ownerEmail: 'bids@riverside.com',
      sqft: '145,000',
      duration: '24 months',
      status: 'Bidding',
      requirements: ['Multi-family experience', 'Bonding capacity $15M+'],
      documents: []
    }
  ];

  const projectTypes = ['Commercial', 'Residential', 'Industrial', 'Healthcare', 'Educational', 'Multi-Family', 'Government'];
  const budgetRanges = [
    { label: '< $100k', value: '0-100000' },
    { label: '$100k - $500k', value: '100000-500000' },
    { label: '$500k - $1M', value: '500000-1000000' },
    { label: '$1M - $5M', value: '1000000-5000000' },
    { label: '$5M+', value: '5000000+' }
  ];
  const tradeCategories = ['General Construction', 'Electrical', 'Plumbing', 'HVAC', 'Concrete', 'Masonry', 'Roofing', 'Flooring', 'Painting', 'Landscaping'];

  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);

  const filteredProjects = projects.filter(p => {
    // Search filter
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Project Type filter
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(p.type);

    // Location filter
    const matchesLocation = locationSearch === '' || p.location.toLowerCase().includes(locationSearch.toLowerCase());

    // Budget filter
    const matchesBudget = selectedBudgetRange.length === 0 || selectedBudgetRange.some(range => {
      const [min, max] = range.split('-').map(Number);
      const projMax = p.budgetMax || 0;
      if (range === '5000000+') return projMax >= 5000000;
      return projMax >= min && projMax <= max;
    });

    // Tier/Compliance filter (using tags or other props if available, or just mocking for now)
    // For this mock, we'll assume tiers match some project tags or properties
    const matchesTier = selectedTiers.length === 0 || selectedTiers.some(tier =>
      p.tags.includes(tier) || p.type.includes(tier) // Mocking tier matching
    );

    return matchesSearch && matchesType && matchesLocation && matchesBudget && matchesTier;
  });

  const handleViewDetails = (project: any) => {
    setSelectedProject(project);
    setShowDetailsModal(true);
  };

  const handleAddBid = (project: any) => {
    setSelectedProject(project);
    setShowBidModal(true);
  };

  const submitBid = () => {
    toast({
      title: "Bid Submitted Successfully",
      description: `Your bid of $${parseFloat(bidAmount).toLocaleString()} has been submitted for ${selectedProject?.name}.`,
    });
    setShowBidModal(false);
    setBidAmount('');
    setBidDuration('');
    setBidProposal('');
  };

  return (
    <div className="flex h-full w-full flex-col bg-white dark:bg-[#0f1115] text-gray-900 dark:text-white transition-colors duration-500 overflow-hidden font-sans">

      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none opacity-50">
        <div className="absolute top-[10%] right-[10%] w-[600px] h-[600px] bg-yellow-400/10 dark:bg-yellow-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] bg-blue-400/5 dark:bg-blue-600/5 blur-[100px] rounded-full" />
      </div>

      {/* Header & Search Banner */}
      <div className="relative bg-gray-50 dark:bg-[#1c1e24] border-b border-gray-200 dark:border-white/5 px-8 py-6 z-20">
        <div className="max-w-7xl mx-auto">


          {/* Unified Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 p-1.5 bg-white dark:bg-black/40 rounded-2xl border border-gray-200 dark:border-white/5 shadow-xl backdrop-blur-xl">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600 w-4 h-4" />
              <Input
                placeholder="Keywords (e.g. 'Renovation', 'Steel')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 border-none bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-700"
              />
            </div>
            <div className="hidden md:block w-[1px] h-6 bg-gray-200 dark:bg-white/10 self-center" />
            <div className="w-full md:w-[220px] relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600 w-4 h-4" />
              <Input
                placeholder="Search Location"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                className="pl-10 h-12 border-none bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-700 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
              />
            </div>
            <Button size="sm" className="h-12 px-8 bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-400 text-black font-black uppercase text-xs tracking-tighter rounded-xl shadow-lg active:scale-95 transition-all">
              Search Projects
            </Button>
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Left Filters - Slimmer Premium Version */}
        <aside className="hidden xl:flex w-80 flex-col border-r border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 overflow-y-auto p-8 custom-scrollbar">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black tracking-tight">FILTERS</h3>
            <button
              onClick={() => {
                setSelectedTypes([]);
                setSelectedBudgetRange([]);
                setSelectedTiers([]);
                setSearchQuery('');
                setLocationSearch('');
              }}
              className="text-[10px] font-black uppercase text-yellow-600 dark:text-yellow-500 hover:underline"
            >
              Reset
            </button>
          </div>

          <div className="space-y-10">
            <div>
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 block underline decoration-yellow-500/30 underline-offset-4">Project Categories</Label>
              <div className="space-y-3">
                {projectTypes.map(type => (
                  <div key={type} className="flex items-center group cursor-pointer" onClick={() => {
                    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
                  }}>
                    <div className={cn(
                      "w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 mr-3",
                      selectedTypes.includes(type) ? "bg-yellow-500 border-yellow-500 text-black" : "border-gray-300 dark:border-white/10 group-hover:border-yellow-400"
                    )}>
                      {selectedTypes.includes(type) && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <span className={cn("text-xs font-bold transition-all", selectedTypes.includes(type) ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400 group-hover:pl-1")}>{type}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 block underline decoration-yellow-500/30 underline-offset-4">Financial Class</Label>
              <div className="space-y-3">
                {budgetRanges.map(range => (
                  <div key={range.value} className="flex items-center group cursor-pointer" onClick={() => {
                    setSelectedBudgetRange(prev => prev.includes(range.value) ? prev.filter(r => r !== range.value) : [...prev, range.value]);
                  }}>
                    <div className={cn(
                      "w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 mr-3",
                      selectedBudgetRange.includes(range.value) ? "bg-yellow-500 border-yellow-500 text-black" : "border-gray-300 dark:border-white/10 group-hover:border-yellow-400"
                    )}>
                      {selectedBudgetRange.includes(range.value) && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <span className={cn("text-xs font-bold transition-all", selectedBudgetRange.includes(range.value) ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400 group-hover:pl-1")}>{range.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 block underline decoration-yellow-500/30 underline-offset-4">Compliance Tiers</Label>
              <div className="space-y-3">
                {['Public Works Only', 'Union Signatory', 'HUB / Minority Owned'].map(tier => (
                  <div key={tier} className="flex items-center group cursor-pointer" onClick={() => {
                    setSelectedTiers(prev => prev.includes(tier) ? prev.filter(t => t !== tier) : [...prev, tier]);
                  }}>
                    <div className={cn(
                      "w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 mr-3",
                      selectedTiers.includes(tier) ? "bg-yellow-500 border-yellow-500 text-black" : "border-gray-300 dark:border-white/10 group-hover:border-yellow-400"
                    )}>
                      {selectedTiers.includes(tier) && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <span className={cn("text-xs font-bold transition-all", selectedTiers.includes(tier) ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400 group-hover:pl-1")}>{tier}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Middle Feed */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-sm font-bold text-gray-500">Trending in <span className="text-gray-900 dark:text-white underline decoration-yellow-500 decoration-2 underline-offset-4">{locationSearch || 'Central Texas'}</span></span>
              </div>

              <div className="flex items-center bg-gray-100 dark:bg-black/40 p-1.5 rounded-2xl border border-gray-200 dark:border-white/5">
                <button onClick={() => setViewMode('card')} className={cn("p-2 rounded-xl transition-all", viewMode === 'card' ? "bg-white dark:bg-[#1c1e24] text-black dark:text-white shadow-xl" : "text-gray-400 hover:text-black dark:hover:text-white")}>
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button onClick={() => setViewMode('table')} className={cn("p-2 rounded-xl transition-all", viewMode === 'table' ? "bg-white dark:bg-[#1c1e24] text-black dark:text-white shadow-xl" : "text-gray-400 hover:text-black dark:hover:text-white")}>
                  <ListIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {filteredProjects.length > 0 ? (
              <div className={cn("grid gap-8", viewMode === 'card' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1")}>
                {filteredProjects.map((project) => (
                  <Card
                    key={project.id}
                    className={cn(
                      "group relative overflow-hidden bg-white dark:bg-[#1c1e24] border border-gray-200 dark:border-white/5 transition-all duration-500 hover:scale-[1.02] cursor-pointer rounded-[2.5rem] hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] cursor-pointer",
                      viewMode === 'table' ? "flex flex-row items-center p-2 rounded-3xl" : ""
                    )}
                    onClick={() => handleViewDetails(project)}
                  >
                    {/* Status Badges Overlay */}
                    <div className="px-8 pt-6 flex justify-between items-start">
                      <div className="flex gap-2">
                        {project.isHot && (
                          <Badge className="bg-red-500 text-white font-black text-[10px] uppercase tracking-tighter border-none px-2 shadow-lg">HOT</Badge>
                        )}
                        <Badge className="bg-yellow-400/10 text-yellow-600 dark:text-yellow-500 font-black text-[10px] uppercase tracking-tighter border-none px-2">{project.type}</Badge>
                      </div>
                      <div className="flex items-center gap-1.5 text-yellow-500 font-black text-xs uppercase tracking-widest">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {project.matchScore}% Match
                      </div>
                    </div>

                    <CardContent className={cn("px-8 pb-8 pt-4", viewMode === 'table' ? "flex-1 py-4" : "")}>
                      <div className="flex flex-col h-full">
                        <div className="mb-6 flex-1">
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-yellow-600 dark:text-yellow-500 tracking-widest mb-2">
                            <Layers className="w-3.5 h-3.5" />
                            ID: #DISC-{project.id}0922
                          </div>
                          <h4 className="text-xl font-black text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                            {project.name}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-gray-400 font-bold">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {project.location}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {project.posted}</span>
                          </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Target Budget</p>
                              <p className="text-lg font-black font-mono">{project.budget}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-black dark:hover:text-white">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button className="flex-1 bg-black dark:bg-yellow-500 text-white dark:text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-yellow-500 dark:hover:bg-yellow-400 transition-all h-10 shadow-lg" onClick={(e) => { e.stopPropagation(); handleAddBid(project) }}>
                              Submit Intent
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 bg-gray-50/50 dark:bg-black/20 rounded-[3rem] border-4 border-dashed border-gray-200 dark:border-white/5">
                <AlertCircle className="w-16 h-16 text-gray-200 dark:text-white/5 mb-6" />
                <h3 className="text-2xl font-black tracking-tight mb-2">Expanding Feed...</h3>
                <p className="text-gray-500 font-bold max-w-xs text-center">We couldn't find matches for this specific query. Try broadening your location or budget range.</p>
                <Button variant="link" onClick={() => { setSearchQuery(''); setSelectedTypes([]); }} className="mt-4 text-yellow-500 font-black uppercase tracking-widest text-xs">Clear Signals</Button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Small & Minimal Project Detail Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-md p-0 overflow-hidden bg-white dark:bg-[#111318] border-gray-200 dark:border-white/10 shadow-2xl rounded-[1.5rem]">
          {selectedProject && (
            <div className="flex flex-col">
              {/* Clean Header */}
              <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5 bg-gray-50/30">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-[9px] font-black tracking-widest border-yellow-500/20 text-yellow-600 dark:text-yellow-500 bg-yellow-400/5">
                      {selectedProject.type.toUpperCase()}
                    </Badge>
                    <span className="text-[9px] font-bold text-gray-400">#{selectedProject.id}0922</span>
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
                    {selectedProject.name}
                  </h2>
                  <p className="text-gray-500 flex items-center gap-1.5 text-xs">
                    <MapPin className="w-3 h-3" /> {selectedProject.location}
                  </p>
                </div>
              </div>

              <div className="px-6 py-5 space-y-6">
                {/* Compact Stats Row */}
                <div className="grid grid-cols-3 gap-2 text-center pb-4 border-b border-gray-100 dark:border-white/5">
                  <div>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Budget</p>
                    <p className="text-xs font-bold font-mono">{selectedProject.budget}</p>
                  </div>
                  <div className="border-l border-r border-gray-100 dark:border-white/5">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Scale</p>
                    <p className="text-xs font-bold font-mono">{selectedProject.sqft} sqft</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Duration</p>
                    <p className="text-xs font-bold font-mono">{selectedProject.duration}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-400">Scope</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-semibold">
                    {selectedProject.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/[0.02] p-2.5 rounded-xl border border-gray-100 dark:border-white/5">
                    <div className="h-8 w-8 rounded-lg bg-yellow-400 flex items-center justify-center text-black font-bold text-xs shrink-0">
                      {selectedProject.owner.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">{selectedProject.owner}</p>
                      <p className="text-[9px] text-gray-400">Project Owner</p>
                    </div>
                    <div className="flex gap-1.5">
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-md"><Mail className="w-3 h-3" /></Button>
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-md"><Phone className="w-3 h-3" /></Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="px-6 py-4 bg-gray-50/50 dark:bg-transparent border-t border-gray-100 dark:border-white/5 space-y-3">
                <Button className="w-full h-10 bg-yellow-400 hover:bg-yellow-500 text-black font-black uppercase text-[10px] tracking-widest rounded-lg shadow-lg" onClick={() => { setShowDetailsModal(false); handleAddBid(selectedProject); }}>
                  Submit Intent to Bid
                </Button>
                <div className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-green-500" />
                    <span className="text-[8px] font-black text-gray-400 uppercase">Verified Opportunity</span>
                  </div>
                  <button onClick={() => setShowDetailsModal(false)} className="text-[9px] font-black uppercase text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDiscovery;
