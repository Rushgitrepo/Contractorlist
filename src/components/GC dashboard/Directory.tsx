import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  MapPin,
  Star,
  Filter,
  Phone,
  Mail,
  Building2,
  ShieldCheck,
  Trophy,
  CheckCircle2,
  Clock,
  Users,
  Grid3x3,
  List as ListIcon,
  SearchCode,
  AlertCircle,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Directory = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('Austin, TX');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContractor, setSelectedContractor] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('best');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);

  const contractors = [
    {
      id: 1,
      name: 'VoltMaster Electrical Services',
      location: 'Austin, TX',
      distance: '1.2 mi',
      rating: 4.9,
      reviews: 128,
      verified: true,
      tier: 'Gold',
      specialties: ['Electrical', 'Fire Alarm', 'Lighting'],
      status: 'Available',
      projects: 45,
      avatar: 'VM',
      phone: '(512) 555-0123',
      email: 'info@voltmaster.com',
      yearsExperience: 15,
      bonded: true,
      insured: true
    },
    {
      id: 2,
      name: 'Apex Wiring & Power',
      location: 'San Antonio, TX',
      distance: '45 mi',
      rating: 4.5,
      reviews: 42,
      verified: true,
      tier: 'Silver',
      specialties: ['Electrical', 'Low Voltage'],
      status: 'Busy',
      projects: 12,
      avatar: 'AW',
      phone: '(210) 555-0145',
      email: 'contact@apexwiring.com',
      yearsExperience: 8,
      bonded: true,
      insured: true
    },
    {
      id: 3,
      name: 'Bright Future Solar',
      location: 'Austin, TX',
      distance: '8 mi',
      rating: 4.8,
      reviews: 8,
      verified: true,
      tier: 'Bronze',
      specialties: ['Solar', 'Green Energy'],
      status: 'Available',
      projects: 5,
      avatar: 'BF',
      phone: '(512) 555-0167',
      email: 'hello@brightfuture.com',
      yearsExperience: 5,
      bonded: true,
      insured: true
    },
    {
      id: 4,
      name: 'Titan Concrete Pros',
      location: 'Dallas, TX',
      distance: '120 mi',
      rating: 4.7,
      reviews: 215,
      verified: true,
      tier: 'Platinum',
      specialties: ['Concrete', 'Foundation'],
      status: 'Available',
      projects: 89,
      avatar: 'TC',
      phone: '(214) 555-0189',
      email: 'info@titanconcrete.com',
      yearsExperience: 25,
      bonded: true,
      insured: true
    }
  ];

  const filteredContractors = contractors.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory.length === 0 ||
      c.specialties.some(s => selectedCategory.includes(s));

    const matchesLocation = selectedLocation === '' ||
      c.location.toLowerCase().includes(selectedLocation.toLowerCase());

    const matchesAvailability = selectedAvailability.length === 0 ||
      selectedAvailability.some(status => c.status.toLowerCase().includes(status.toLowerCase().replace(' now', '')));

    const matchesTier = selectedTiers.length === 0 ||
      selectedTiers.includes(c.tier);

    return matchesSearch && matchesCategory && matchesLocation && matchesAvailability && matchesTier;
  });

  const handleInvite = (name: string) => {
    toast({
      title: "Invitation Sent",
      description: `Successfully invited ${name} to bid on your project.`,
    });
  };

  const categories = ['Electrical', 'Plumbing', 'HVAC', 'Concrete', 'Masonry', 'Drywall', 'Roofing', 'Painting', 'Flooring'];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum': return 'from-gray-700 to-gray-900 text-white';
      case 'Gold': return 'from-yellow-400 to-yellow-600 text-black';
      case 'Silver': return 'from-slate-300 to-slate-400 text-black';
      default: return 'from-orange-400 to-orange-500 text-white';
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-white dark:bg-[#0f1115] text-gray-900 dark:text-white transition-colors duration-500 overflow-hidden font-sans">

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-50">
        <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-yellow-400/10 dark:bg-yellow-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-blue-400/5 dark:bg-blue-600/5 blur-[100px] rounded-full" />
      </div>

      {/* Modern Search Banner */}
      <div className="relative bg-gray-50/50 dark:bg-[#1c1e24]/50 border-b border-gray-200 dark:border-white/5 px-8 py-8 z-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
                <Building2 className="w-8 h-8 text-yellow-500" />
                B2B PARTNER DIRECTORY
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-bold text-sm mt-1">Verified sub-contractors and resource providers</p>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-black/30 p-1 rounded-xl border border-gray-200 dark:border-white/5">
              <button onClick={() => setViewMode('grid')} className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-yellow-400 text-black shadow-lg" : "text-gray-400 hover:text-black dark:hover:text-white")}>
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode('list')} className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-yellow-400 text-black shadow-lg" : "text-gray-400 hover:text-black dark:hover:text-white")}>
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 p-1.5 bg-white dark:bg-black/40 rounded-2xl border border-gray-200 dark:border-white/5 shadow-xl">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by company name or trade (e.g. 'Electrical')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 border-none bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
              />
            </div>
            <div className="hidden md:block w-[1px] h-6 bg-gray-200 dark:bg-white/10 self-center" />
            <div className="w-full md:w-[220px] relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Location Search"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="pl-10 h-12 border-none bg-transparent placeholder:text-gray-400 focus-visible:ring-0"
              />
            </div>
            <Button className="h-12 px-8 bg-black dark:bg-yellow-500 text-white dark:text-black font-black uppercase text-xs tracking-tighter rounded-xl hover:bg-yellow-500 transition-all">
              Find Partners
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Dynamic Filter Sidebar */}
        <aside className="hidden xl:flex w-80 flex-col border-r border-gray-200 dark:border-white/5 bg-gray-50/30 dark:bg-black/20 overflow-y-auto p-8 custom-scrollbar">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black tracking-tight">FILTERS</h3>
            <button
              onClick={() => {
                setSelectedCategory([]);
                setSelectedAvailability([]);
                setSelectedTiers([]);
                setSearchQuery('');
                setSelectedLocation('');
              }}
              className="text-[10px] font-black uppercase text-yellow-600 dark:text-yellow-500 hover:underline"
            >
              Reset
            </button>
          </div>

          <div className="space-y-10">
            <div>
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 block underline decoration-yellow-500/30 underline-offset-4">Core Trades</Label>
              <div className="grid grid-cols-1 gap-2">
                {categories.map(cat => (
                  <div key={cat} className="flex items-center group cursor-pointer" onClick={() => {
                    setSelectedCategory(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
                  }}>
                    <div className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center transition-all mr-3",
                      selectedCategory.includes(cat) ? "bg-yellow-500 border-yellow-500 text-black" : "border-gray-300 dark:border-white/10 group-hover:border-yellow-400"
                    )}>
                      {selectedCategory.includes(cat) && <CheckCircle2 className="w-3 h-3" />}
                    </div>
                    <span className={cn("text-xs font-bold transition-all", selectedCategory.includes(cat) ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400 group-hover:pl-1")}>{cat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 block underline decoration-yellow-500/30 underline-offset-4">Verification Level</Label>
              <div className="space-y-3">
                {['Platinum', 'Gold', 'Silver', 'Verified'].map(tier => (
                  <div key={tier} className="flex items-center group cursor-pointer" onClick={() => {
                    setSelectedTiers(prev => prev.includes(tier) ? prev.filter(t => t !== tier) : [...prev, tier]);
                  }}>
                    <div className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center transition-all mr-3",
                      selectedTiers.includes(tier) ? "bg-yellow-500 border-yellow-500 text-black" : "border-gray-300 dark:border-white/10 group-hover:border-yellow-400"
                    )}>
                      {selectedTiers.includes(tier) && <CheckCircle2 className="w-3 h-3" />}
                    </div>
                    <span className={cn("text-xs font-bold transition-all", selectedTiers.includes(tier) ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400 group-hover:pl-1")}>{tier} Tier</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 block underline decoration-yellow-500/30 underline-offset-4">Live Status</Label>
              <div className="space-y-3">
                {['Available Now', 'Accepting Bids', 'Busy'].map(status => (
                  <div key={status} className="flex items-center group cursor-pointer" onClick={() => {
                    setSelectedAvailability(prev => prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]);
                  }}>
                    <div className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center transition-all mr-3",
                      selectedAvailability.includes(status) ? "bg-yellow-500 border-yellow-500 text-black" : "border-gray-300 dark:border-white/10 group-hover:border-yellow-400"
                    )}>
                      {selectedAvailability.includes(status) && <CheckCircle2 className="w-3 h-3" />}
                    </div>
                    <span className={cn("text-xs font-bold transition-all", selectedAvailability.includes(status) ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400 group-hover:pl-1")}>{status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Feed */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-bold border-none px-3">
                  Showing {filteredContractors.length} Partners
                </Badge>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] h-10 border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 text-xs font-bold rounded-xl">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="best">Best Match</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="distance">Nearest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredContractors.length > 0 ? (
              <div className={cn(
                "grid gap-8",
                viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
              )}>
                {filteredContractors.map((contractor) => (
                  <Card
                    key={contractor.id}
                    onClick={() => { setSelectedContractor(contractor); setIsDetailModalOpen(true); }}
                    className={cn(
                      "group relative bg-white dark:bg-[#1c1e24] border border-gray-200 dark:border-white/5 transition-all duration-500 hover:scale-[1.02] cursor-pointer rounded-[2.5rem] hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] overflow-hidden",
                      viewMode === 'list' ? "flex flex-row items-center p-2 rounded-3xl h-40" : ""
                    )}
                  >
                    {/* Unique Tier Tag Overlay */}
                    <div className="absolute top-6 right-6 z-10">
                      <Badge className={cn("font-black text-[9px] uppercase tracking-tighter border-none px-3 py-1 shadow-lg bg-gradient-to-r", getTierColor(contractor.tier))}>
                        {contractor.tier}
                      </Badge>
                    </div>

                    <CardContent className={cn("p-8", viewMode === 'list' ? "flex-1 py-4 flex gap-6 items-center" : "")}>
                      <div className={cn("flex flex-col gap-5", viewMode === 'list' ? "flex-row flex-1 items-center" : "")}>

                        {/* Avatar Circle with Glow */}
                        <div className="relative shrink-0">
                          <div className="h-16 w-16 rounded-2xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5 flex items-center justify-center text-2xl font-black text-yellow-600 dark:text-yellow-400 shadow-xl group-hover:border-yellow-400 transition-all">
                            {contractor.avatar}
                          </div>
                          {contractor.verified && (
                            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#1c1e24] rounded-full p-1 border-2 border-green-500/20 shadow-md">
                              <ShieldCheck className="h-4 w-4 text-green-500 fill-green-500/10" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-yellow-600 tracking-widest mb-1">
                            <ShieldCheck className="w-3 h-3" />
                            Partner ID: #B2B-00{contractor.id}4
                          </div>
                          <h4 className="text-xl font-black text-gray-900 dark:text-white leading-tight mb-2 truncate group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                            {contractor.name}
                          </h4>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 font-bold">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {contractor.location}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-yellow-500"><Star className="w-3 h-3 fill-current" /> {contractor.rating} ({contractor.reviews})</span>
                          </div>
                        </div>

                        {viewMode === 'grid' && (
                          <div className="pt-5 mt-auto border-t border-gray-100 dark:border-white/5 flex flex-wrap gap-1.5">
                            {contractor.specialties.slice(0, 3).map(s => (
                              <Badge key={s} variant="outline" className="text-[9px] font-bold border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400">
                                {s.toUpperCase()}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className={cn("flex items-center justify-between gap-4 mt-2", viewMode === 'list' ? "flex-col justify-center items-end" : "")}>
                          {viewMode === 'grid' && (
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col">
                                <p className="text-[8px] font-black uppercase text-gray-400 tracking-tight">Status</p>
                                <p className={cn("text-[10px] font-bold", contractor.status === 'Available' ? "text-green-500" : "text-yellow-600")}>{contractor.status}</p>
                              </div>
                              <div className="flex flex-col">
                                <p className="text-[8px] font-black uppercase text-gray-400 tracking-tight">Exp.</p>
                                <p className="text-[10px] font-bold text-gray-900 dark:text-white">{contractor.yearsExperience}yr</p>
                              </div>
                            </div>
                          )}
                          <Button className="bg-black dark:bg-white text-white dark:text-black font-black uppercase text-[9px] tracking-widest rounded-xl hover:bg-yellow-500 dark:hover:bg-yellow-400 transition-all h-10 px-6 group-hover:shadow-2xl">
                            Send Invite
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 bg-gray-50/50 dark:bg-black/20 rounded-[3rem] border-4 border-dashed border-gray-200 dark:border-white/5">
                <AlertCircle className="w-16 h-16 text-gray-200 dark:text-white/5 mb-6" />
                <h3 className="text-2xl font-black tracking-tight mb-2">No matches found</h3>
                <p className="text-gray-500 font-bold max-w-xs text-center text-sm">We couldn't find any partners matching your criteria. Broaden your search signals.</p>
                <Button variant="link" onClick={() => { setSearchQuery(''); setSelectedCategory([]); }} className="mt-4 text-yellow-500 font-black uppercase tracking-widest text-xs">Clear Signals</Button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Unique Contractor Details Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden bg-white dark:bg-[#111318] border-gray-200 dark:border-white/10 shadow-2xl rounded-[1.5rem]">
          {selectedContractor && (
            <div className="flex flex-col">
              <div className="px-8 py-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/30">
                <div className="flex gap-4 items-center mb-4">
                  <div className="h-14 w-14 rounded-2xl bg-yellow-400 flex items-center justify-center text-black font-black text-xl">
                    {selectedContractor.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={cn("text-[8px] font-black tracking-widest border-none px-2 py-0.5", getTierColor(selectedContractor.tier))}>
                        {selectedContractor.tier.toUpperCase()}
                      </Badge>
                      {selectedContractor.verified && <ShieldCheck className="w-3 h-3 text-green-500" />}
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{selectedContractor.name}</h2>
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 space-y-6">
                <div className="grid grid-cols-3 gap-2 border-b border-gray-100 dark:border-white/5 pb-4">
                  <div className="text-center">
                    <p className="text-[8px] font-black text-gray-400 mb-0.5 uppercase">Rating</p>
                    <p className="text-xs font-bold flex items-center justify-center gap-1 text-yellow-500"><Star className="w-3 h-3 fill-current" /> {selectedContractor.rating}</p>
                  </div>
                  <div className="text-center border-l border-r border-gray-100 dark:border-white/5">
                    <p className="text-[8px] font-black text-gray-400 mb-0.5 uppercase">Experience</p>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">{selectedContractor.yearsExperience}yrs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[8px] font-black text-gray-400 mb-0.5 uppercase">Projects</p>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">{selectedContractor.projects}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Core Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedContractor.specialties.map((s: string) => (
                      <Badge key={s} className="bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-none font-bold text-[10px]">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 dark:bg-black/20 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">Contact Data</span>
                    <Badge className="bg-green-500/10 text-green-500 border-none text-[8px] uppercase">{selectedContractor.status}</Badge>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-500">Official Email</span>
                      <span className="text-[10px] font-bold text-gray-900 dark:text-white">{selectedContractor.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-500">Phone Signal</span>
                      <span className="text-[10px] font-bold text-gray-900 dark:text-white">{selectedContractor.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-8 py-4 bg-gray-50/50 dark:bg-transparent border-t border-gray-100 dark:border-white/5 flex flex-col gap-3">
                <Button onClick={() => { handleInvite(selectedContractor.name); setIsDetailModalOpen(false); }} className="w-full h-11 bg-black dark:bg-yellow-500 text-white dark:text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-yellow-600 transition-all">
                  Onboard to Project
                </Button>
                <div className="flex justify-between items-center opacity-60">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Insured & Bonded</span>
                  </div>
                  <button onClick={() => setIsDetailModalOpen(false)} className="text-[9px] font-black uppercase text-gray-400 hover:text-black transition-colors">
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

export default Directory;
