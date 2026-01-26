import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Calendar,
  MapPin,
  Building,
  Eye,
  Download,
  Upload,
  Edit,
  Trash2,
  AlertCircle,
  TrendingUp,
  Plus,
  Target,
  Award,
  Activity,
  Zap,
  ArrowRight,
  ShieldCheck,
  Search,
  Inbox,
  FileSearch
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { scDashboardService, Bid } from '@/services/scDashboardService';
import { useToast } from '@/hooks/use-toast';

const BidManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('deadline');
  const [bids, setBids] = useState<Bid[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBid, setEditingBid] = useState<Bid | null>(null);

  // Form State
  const [formState, setFormState] = useState({
    projectName: '',
    gc: '',
    location: '',
    bidAmount: '',
    status: 'DRAFT' as Bid['status']
  });

  useEffect(() => {
    setBids(scDashboardService.getBids());
  }, []);

  const filteredBids = useMemo(() => {
    return bids
      .filter(bid => {
        const matchesTab = activeTab === 'active' ? bid.status !== 'WON' && bid.status !== 'LOST' : bid.status === 'WON' || bid.status === 'LOST';
        const matchesSearch = bid.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bid.gc.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bid.id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'deadline') return new Date(a.deadlineDate).getTime() - new Date(b.deadlineDate).getTime();
        if (sortBy === 'amount') return b.budgetValue - a.budgetValue;
        return 0;
      });
  }, [activeTab, searchQuery, sortBy, bids]);

  const handleCreateOrUpdate = () => {
    if (!formState.projectName || !formState.gc || !formState.bidAmount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newBid: Bid = {
      id: editingBid?.id || `BID-${Math.floor(Math.random() * 10000)}`,
      projectName: formState.projectName,
      gc: formState.gc,
      location: formState.location || 'Remote/TBD',
      bidAmount: `$${parseInt(formState.bidAmount).toLocaleString()}`,
      budgetValue: parseInt(formState.bidAmount),
      deadline: 'Oct 30, 2024',
      deadlineDate: '2024-10-30',
      status: formState.status,
      daysLeft: 7,
      lastModified: 'JUST NOW',
      probability: editingBid?.probability || 50,
      type: (formState.status === 'WON' || formState.status === 'LOST') ? 'completed' : 'active'
    };

    const updatedBids = scDashboardService.saveBid(newBid);
    setBids(updatedBids);
    setIsModalOpen(false);
    setEditingBid(null);
    setFormState({ projectName: '', gc: '', location: '', bidAmount: '', status: 'DRAFT' });

    toast({
      title: editingBid ? "Protocol Updated" : "Protocol Initiated",
      description: `${newBid.projectName} has been saved to your assets.`
    });
  };

  const handleDelete = (id: string) => {
    const updatedBids = scDashboardService.deleteBid(id);
    setBids(updatedBids);
    toast({
      title: "Protocol Deleted",
      description: "Electronic record has been purged from terminal.",
      variant: "destructive"
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'DRAFT': return "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400";
      case 'SUBMITTED': return "bg-blue-400/10 text-blue-600 dark:text-blue-400";
      case 'IN-REVIEW': return "bg-yellow-400/10 text-yellow-600 dark:text-yellow-500";
      case 'WON': return "bg-green-400/10 text-green-600 dark:text-green-500";
      case 'LOST': return "bg-red-400/10 text-red-600 dark:text-red-500";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-full bg-gray-50 dark:bg-[#0f1115] p-4 sm:p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-yellow-400 rounded-lg">
                <FileSearch className="w-4 h-4 text-black" />
              </div>
              <h1 className="text-xl font-bold uppercase tracking-tight text-gray-900 dark:text-white">Protocol Assets</h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-wide max-w-xl">
              Monitor, refine, and deploy mission-critical proposals.
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingBid(null);
              setFormState({ projectName: '', gc: '', location: '', bidAmount: '', status: 'DRAFT' });
              setIsModalOpen(true);
            }}
            className="h-10 px-6 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-xl shadow-lg shadow-yellow-500/20 transition-all uppercase tracking-widest text-[10px]"
          >
            <Plus className="w-4 h-4 mr-2" /> NEW PROTOCOL
          </Button>
        </div>

        {/* Tactical Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'ACTIVE PROTOCOLS', value: bids.filter(b => b.type === 'active').length.toString().padStart(2, '0'), sub: 'LIVE TRANSMISSIONS', icon: Target, color: 'text-yellow-500' },
            { label: 'WIN PROBABILITY', value: '0%', sub: 'NO DATA YET', icon: Award, color: 'text-gray-500' },
            { label: 'EVALUATION PENDING', value: bids.filter(b => b.status === 'IN-REVIEW').length.toString().padStart(2, '0'), sub: 'AWAITING RESPONSE', icon: Eye, color: 'text-blue-500' },
            { label: 'COMMITTED VALUE', value: `$${(bids.reduce((acc, b) => acc + b.budgetValue, 0) / 1000000).toFixed(1)}M`, sub: 'TOTAL ACTIVE SCALE', icon: DollarSign, color: 'text-yellow-500' },
          ].map((stat, i) => (
            <Card key={i} className="bg-white dark:bg-[#1c1e24] border-gray-100 dark:border-white/5 shadow-sm rounded-xl overflow-hidden group hover:border-yellow-400/50 transition-all">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg group-hover:bg-yellow-400 group-hover:text-black transition-all">
                    <stat.icon className="w-4 h-4 transition-colors" />
                  </div>
                  <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-400">{stat.label}</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white tabular-nums font-mono">{stat.value}</h3>
                  <p className={cn("text-[9px] font-bold uppercase tracking-widest", stat.color)}>{stat.sub}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Interface */}
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
              <TabsList className="bg-white dark:bg-white/5 p-1 rounded-xl border border-gray-100 dark:border-white/5 h-auto">
                <TabsTrigger value="active" className="px-5 py-2.5 rounded-xl font-bold uppercase text-[9px] tracking-widest data-[state=active]:bg-yellow-400 data-[state=active]:text-black transition-all">
                  Active Protocols
                </TabsTrigger>
                <TabsTrigger value="completed" className="px-5 py-2.5 rounded-xl font-bold uppercase text-[9px] tracking-widest data-[state=active]:bg-yellow-400 data-[state=active]:text-black transition-all">
                  Archived Logs
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="flex-1 lg:flex-none relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-500 w-3.5 h-3.5 transition-colors" />
                  <Input
                    placeholder="Filter IDs..."
                    className="h-10 pl-9 lg:w-44 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-xl font-bold uppercase text-[9px] tracking-widest focus:border-yellow-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-10 lg:w-44 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-xl font-bold uppercase text-[9px] tracking-widest">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deadline">SORT: DEADLINE</SelectItem>
                    <SelectItem value="amount">SORT: REVENUE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="active" className="space-y-4">
              {filteredBids.length > 0 ? (
                filteredBids.map((bid) => (
                  <Card key={bid.id} className="group bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5 hover:border-yellow-400/50 transition-all rounded-xl overflow-hidden shadow-sm hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row justify-between gap-6">
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="text-[9px] font-bold text-yellow-600 dark:text-yellow-500 uppercase tracking-widest">{bid.id}</span>
                            <h3 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-tight">{bid.projectName}</h3>
                            <Badge className={cn("border-none font-bold text-[8px] uppercase tracking-[0.2em] px-2.5 py-0.5", getStatusStyle(bid.status))}>
                              {bid.status}
                            </Badge>
                            {bid.daysLeft > 0 && bid.daysLeft <= 5 && (
                              <Badge className="bg-red-500/10 text-red-500 border-none font-bold text-[8px] uppercase tracking-[0.2em] px-2.5 py-0.5">
                                URGENT: {bid.daysLeft} CYCLES REMAINING
                              </Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-0.5">
                              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block">GC Terminal</span>
                              <div className="flex items-center gap-1.5">
                                <Building className="w-3.5 h-3.5 text-yellow-500" />
                                <span className="text-xs font-bold text-gray-900 dark:text-white uppercase line-clamp-1">{bid.gc}</span>
                              </div>
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block">Zone</span>
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-yellow-500" />
                                <span className="text-xs font-bold text-gray-900 dark:text-white uppercase line-clamp-1">{bid.location}</span>
                              </div>
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block">Value</span>
                              <div className="flex items-center gap-1.5 text-green-600">
                                <DollarSign className="w-3.5 h-3.5" />
                                <span className="text-xs font-bold tabular-nums uppercase font-mono">{bid.bidAmount}</span>
                              </div>
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block">Probability</span>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-1 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                  <div className="h-full bg-yellow-400" style={{ width: `${bid.probability}%` }} />
                                </div>
                                <span className="text-[10px] font-bold text-gray-900 dark:text-white tabular-nums">{bid.probability}%</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-white/5 pt-5 lg:pt-0 lg:pl-6 min-w-[180px]">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex flex-col">
                              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Modified</span>
                              <span className="text-[9px] font-bold text-gray-900 dark:text-white">{bid.lastModified}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500 hover:bg-red-500/10"
                              onClick={() => handleDelete(bid.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>

                          <div className="flex flex-col gap-2">
                            <Button
                              onClick={() => {
                                setEditingBid(bid);
                                setFormState({
                                  projectName: bid.projectName,
                                  gc: bid.gc,
                                  location: bid.location,
                                  bidAmount: bid.budgetValue.toString(),
                                  status: bid.status
                                });
                                setIsModalOpen(true);
                              }}
                              className="h-9 w-full bg-black dark:bg-yellow-400 text-white dark:text-black font-bold uppercase text-[9px] tracking-widest rounded-xl hover:scale-[1.02] transition-all"
                            >
                              Refine Data
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="p-20 text-center bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5 rounded-xl">
                  <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">No Protocols Logged</h3>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">Your active transmission logs will appear here.</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {filteredBids.map((bid) => (
                <Card key={bid.id} className="group bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5 hover:border-yellow-400/50 transition-all rounded-xl overflow-hidden shadow-sm hover:shadow-md grayscale hover:grayscale-0">
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row justify-between gap-8 opacity-70 hover:opacity-100 transition-opacity">
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{bid.id}</span>
                          <h3 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-tight">{bid.projectName}</h3>
                          <Badge className={cn("border-none font-bold text-[9px] uppercase tracking-[0.2em] px-3 py-1", getStatusStyle(bid.status))}>
                            {bid.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">GC TERMINAL</span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white uppercase">{bid.gc}</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">FINAL VALUE</span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white font-mono">{bid.bidAmount}</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">CLOUSER</span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white">{bid.lastModified}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center min-w-[200px] lg:pl-8 lg:border-l border-gray-100 dark:border-white/5">
                        <Button variant="outline" className="h-11 w-full border-gray-200 dark:border-white/10 font-bold uppercase text-[10px] tracking-widest rounded-xl">
                          VIEW ARCHIVE
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredBids.length === 0 && (
                <Card className="p-20 text-center bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5 rounded-xl">
                  <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">No Archives Found</h3>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* New/Edit Protocol Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-[#1c1e24] border-gray-100 dark:border-white/5 rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold uppercase tracking-tight">
              {editingBid ? 'Refine Protocol' : 'Initiate New Protocol'}
            </DialogTitle>
            <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Terminal Asset Synchronization
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="projectName" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Project Name</Label>
              <Input
                id="projectName"
                placeholder="Target Site Name"
                value={formState.projectName}
                onChange={(e) => setFormState({ ...formState, projectName: e.target.value })}
                className="bg-gray-50 dark:bg-white/5 border-transparent focus:border-yellow-400 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gc" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">General Contractor</Label>
              <Input
                id="gc"
                placeholder="GC Terminal Name"
                value={formState.gc}
                onChange={(e) => setFormState({ ...formState, gc: e.target.value })}
                className="bg-gray-50 dark:bg-white/5 border-transparent focus:border-yellow-400 rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bidAmount" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Bid Amount ($)</Label>
                <Input
                  id="bidAmount"
                  type="number"
                  placeholder="250000"
                  value={formState.bidAmount}
                  onChange={(e) => setFormState({ ...formState, bidAmount: e.target.value })}
                  className="bg-gray-50 dark:bg-white/5 border-transparent focus:border-yellow-400 rounded-xl font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Initial Status</Label>
                <Select
                  value={formState.status}
                  onValueChange={(val: any) => setFormState({ ...formState, status: val })}
                >
                  <SelectTrigger className="bg-gray-50 dark:bg-white/5 border-transparent focus:border-yellow-400 rounded-xl uppercase text-[10px] font-bold tracking-widest h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">DRAFT</SelectItem>
                    <SelectItem value="SUBMITTED">SUBMITTED</SelectItem>
                    <SelectItem value="IN-REVIEW">IN-REVIEW</SelectItem>
                    <SelectItem value="WON">WON</SelectItem>
                    <SelectItem value="LOST">LOST</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold uppercase text-xs tracking-widest h-12 rounded-xl"
              onClick={handleCreateOrUpdate}
            >
              {editingBid ? 'SYNC CHANGES' : 'DEPLOY PROTOCOL'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BidManagement;