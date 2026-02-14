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
import * as scApi from '@/api/sc-apis';
import { useToast } from '@/hooks/use-toast';

// Internal bid format for the component (mapped from API)
interface InternalBid {
  id: string;
  projectName: string;
  gc: string;
  location: string;
  bidAmount: string;
  budgetValue: number;
  deadline: string;
  deadlineDate: string;
  status: 'DRAFT' | 'SUBMITTED' | 'IN-REVIEW' | 'WON' | 'LOST';
  daysLeft: number;
  lastModified: string;
  probability: number;
  type: 'active' | 'completed';
}

const BidManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('deadline');
  const [bids, setBids] = useState<InternalBid[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBid, setEditingBid] = useState<InternalBid | null>(null);

  // Form State
  const [formState, setFormState] = useState({
    projectName: '',
    gc: '',
    location: '',
    bidAmount: '',
    status: 'DRAFT' as InternalBid['status']
  });

  // Map API bid to internal format
  const mapApiBidToInternal = (apiBid: scApi.Bid): InternalBid => {
    // Map API status to internal status
    const statusMap: Record<string, InternalBid['status']> = {
      'draft': 'DRAFT',
      'submitted': 'SUBMITTED',
      'viewed': 'IN-REVIEW',
      'accepted': 'WON',
      'started': 'WON',
      'rejected': 'LOST',
      'withdrawn': 'LOST',
    };

    const internalStatus = statusMap[apiBid.status] || 'DRAFT';
    const isCompleted = internalStatus === 'WON' || internalStatus === 'LOST';

    // Calculate days since update
    const updatedAt = new Date(apiBid.updated_at);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24));
    const lastModified = daysDiff === 0 ? 'TODAY' : daysDiff === 1 ? 'YESTERDAY' : `${daysDiff} DAYS AGO`;

    return {
      id: apiBid.id,
      projectName: apiBid.project_name || 'Untitled Project',
      gc: apiBid.client_name || 'Unknown Client',
      location: apiBid.location || 'N/A',
      bidAmount: `$${(apiBid.amount || 0).toLocaleString()}`,
      budgetValue: apiBid.amount || 0,
      deadline: apiBid.estimated_end_date ? new Date(apiBid.estimated_end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
      deadlineDate: apiBid.estimated_end_date || new Date().toISOString(),
      status: internalStatus,
      daysLeft: apiBid.estimated_end_date ? Math.max(0, Math.floor((new Date(apiBid.estimated_end_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0,
      lastModified,
      probability: internalStatus === 'WON' ? 100 : internalStatus === 'LOST' ? 0 : 50,
      type: isCompleted ? 'completed' : 'active',
    };
  };

  // Fetch bids from API
  const fetchBids = async () => {
    try {
      setLoading(true);
      const apiBids = await scApi.getMyBids();
      const mappedBids = apiBids.map(mapApiBidToInternal);
      setBids(mappedBids);
    } catch (error: any) {
      console.error('Failed to fetch bids:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your bids. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBids();
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

    const newBid: InternalBid = {
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

    // Note: Creating bids from BidManagement is for local tracking only
    // Real bids should be created from Project Discovery
    setBids(prev => {
      const index = prev.findIndex(b => b.id === newBid.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = newBid;
        return updated;
      }
      return [...prev, newBid];
    });
    setIsModalOpen(false);
    setEditingBid(null);
    setFormState({ projectName: '', gc: '', location: '', bidAmount: '', status: 'DRAFT' });

    toast({
      title: editingBid ? "Bid Updated" : "Bid Created",
      description: `${newBid.projectName} has been saved successfully.`
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await scApi.deleteBid(id);
      setBids(prev => prev.filter(b => b.id !== id));
      toast({
        title: "Bid Deleted",
        description: "Bid has been removed successfully."
      });
    } catch (error: any) {
      console.error('Failed to delete bid:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete bid.",
        variant: "destructive"
      });
    }
  };

  const handleWithdraw = async (id: string) => {
    try {
      await scApi.withdrawBid(id);
      await fetchBids(); // Refresh bids
      toast({
        title: "Bid Withdrawn",
        description: "Your bid has been withdrawn successfully."
      });
    } catch (error: any) {
      console.error('Failed to withdraw bid:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to withdraw bid.",
        variant: "destructive"
      });
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'DRAFT': return "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400";
      case 'SUBMITTED': return "bg-accent/10 text-accent dark:text-accent-foreground";
      case 'IN-REVIEW': return "bg-accent/10 text-accent";
      case 'WON': return "bg-green-500/10 text-green-600 dark:text-green-400";
      case 'LOST': return "bg-red-500/10 text-red-600 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-full bg-gray-50 dark:bg-[#0f1115] p-6 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-accent/10 text-accent border-accent/20 font-medium uppercase text-[10px] tracking-wider px-2.5 py-0.5">
                Bid Management
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white leading-none">
              Project Pipeline
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mt-3 max-w-lg leading-relaxed">
              Track your active bids, draft new proposals, and manage your project history.
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingBid(null);
              setFormState({ projectName: '', gc: '', location: '', bidAmount: '', status: 'DRAFT' });
              setIsModalOpen(true);
            }}
            className="h-11 px-6 bg-accent text-accent-foreground font-semibold text-xs rounded-xl shadow-none"
          >
            <Plus className="w-4 h-4 mr-2" /> Create New Bid
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'ACTIVE BIDS', value: bids.filter(b => b.type === 'active').length.toString().padStart(2, '0'), sub: 'LIVE PROPOSALS', icon: Target, color: 'text-accent' },
            { label: 'WIN RATE', value: '0.0%', sub: 'MARKET AVERAGE', icon: Award, color: 'text-gray-500' },
            { label: 'PENDING REVIEW', value: bids.filter(b => b.status === 'IN-REVIEW').length.toString().padStart(2, '0'), sub: 'AWAITING RESPONSE', icon: Eye, color: 'text-accent' },
            { label: 'PROJECTED VALUE', value: `$${(bids.reduce((acc, b) => acc + b.budgetValue, 0) / 1000000).toFixed(1)}M`, sub: 'TOTAL PIPELINE', icon: DollarSign, color: 'text-accent' },
          ].map((stat, i) => (
            <Card key={i} className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5 shadow-sm rounded-2xl overflow-hidden group hover:border-accent/30 transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-gray-50 dark:bg-black/20 rounded-xl group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300 border border-gray-100 dark:border-white/5">
                    <stat.icon className="w-4 h-4 transition-colors" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{stat.label}</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{stat.value}</h3>
                  <p className={cn("text-[10px] font-semibold uppercase tracking-wider", stat.color)}>{stat.sub}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Interface */}
        <div className="space-y-6 pt-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
              <TabsList className="bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/5 h-auto">
                <TabsTrigger value="active" className="px-6 py-2.5 rounded-lg font-semibold text-xs data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all">
                  Active Bids
                </TabsTrigger>
                <TabsTrigger value="completed" className="px-6 py-2.5 rounded-lg font-semibold text-xs data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all">
                  Project History
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="flex-1 lg:flex-none relative group">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent w-4 h-4 transition-colors" />
                  <Input
                    placeholder="Search bids..."
                    className="h-11 pl-10 lg:w-56 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-xl font-bold text-sm focus:border-accent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-11 lg:w-48 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-xl font-semibold text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deadline">Sort: Deadline</SelectItem>
                    <SelectItem value="amount">Sort: Value</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="active" className="space-y-4 focus-visible:outline-none">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-4"></div>
                  <p className="text-gray-500 font-medium">Loading your bids...</p>
                </div>
              ) : filteredBids.length > 0 ? (
                filteredBids.map((bid) => (
                  <Card key={bid.id} className="group bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5 transition-all rounded-xl overflow-hidden shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row justify-between gap-6">
                        <div className="flex-1 space-y-5">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-[10px] font-bold text-accent">{bid.id}</span>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight group-hover:text-accent transition-colors">{bid.projectName}</h3>
                            <Badge className={cn("border-none font-semibold text-[9px] px-3 py-1 rounded-md", getStatusStyle(bid.status))}>
                              {bid.status}
                            </Badge>
                            {bid.daysLeft > 0 && bid.daysLeft <= 5 && (
                              <Badge className="bg-red-500/10 text-red-600 border-none font-semibold text-[9px] px-3 py-1 rounded-md">
                                URGENT: {bid.daysLeft} DAYS
                              </Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">GC Partner</span>
                              <div className="flex items-center gap-2">
                                <Building className="w-4 h-4 text-accent" />
                                <span className="text-sm font-semibold text-gray-900 dark:text-white uppercase line-clamp-1">{bid.gc}</span>
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Location</span>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-accent" />
                                <span className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{bid.location}</span>
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Bid Value</span>
                              <div className="flex items-center gap-2 text-accent">
                                <DollarSign className="w-4 h-4" />
                                <span className="text-sm font-bold tabular-nums font-mono">{bid.bidAmount}</span>
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Confidence</span>
                              <div className="flex items-center gap-3">
                                <div className="flex-1 h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                  <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${bid.probability}%` }} />
                                </div>
                                <span className="text-xs font-bold text-gray-900 dark:text-white tabular-nums">{bid.probability}%</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-white/5 pt-6 lg:pt-0 lg:pl-10 min-w-[200px]">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Last Updated</span>
                              <span className="text-[11px] font-bold text-gray-900 dark:text-white">{bid.lastModified}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                              onClick={() => handleDelete(bid.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

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
                            className="h-10 w-full bg-gray-900 dark:bg-accent text-white dark:text-accent-foreground font-semibold text-xs rounded-xl transition-all"
                          >
                            Edit Bid Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="py-32 flex flex-col items-center justify-center text-center bg-white dark:bg-[#1c1e24] rounded-2xl border border-dashed border-gray-200 dark:border-white/10 shadow-sm">
                  <div className="w-16 h-16 bg-gray-50 dark:bg-black/20 rounded-2xl flex items-center justify-center mb-6">
                    <Inbox className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight mb-2">No Active Bids</h3>
                  <p className="text-gray-500 dark:text-gray-400 font-semibold text-sm max-w-xs mx-auto">
                    Your current bidding activity will be listed here. Start by finding a project or creating a manual bid.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4 focus-visible:outline-none">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-4"></div>
                  <p className="text-gray-500 font-medium">Loading your history...</p>
                </div>
              ) : filteredBids.length > 0 ? (
                filteredBids.map((bid) => (
                  <Card key={bid.id} className="group bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5 transition-all rounded-xl overflow-hidden shadow-sm hover:shadow-md grayscale hover:grayscale-0">
                    <CardContent className="p-5">
                      <div className="flex flex-col lg:flex-row justify-between gap-8 opacity-70 hover:opacity-100 transition-opacity">
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{bid.id}</span>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-tight">{bid.projectName}</h3>
                            <Badge className={cn("border-none font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-md", getStatusStyle(bid.status))}>
                              {bid.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">GC Partner</span>
                              <span className="text-sm font-semibold text-gray-900 dark:text-white uppercase">{bid.gc}</span>
                            </div>
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Final Value</span>
                              <span className="text-sm font-bold text-gray-900 dark:text-white font-mono">{bid.bidAmount}</span>
                            </div>
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Completed On</span>
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">{bid.lastModified}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col justify-center min-w-[200px] lg:pl-10 lg:border-l border-gray-100 dark:border-white/5">
                          <Button variant="outline" className="h-11 w-full border-gray-200 dark:border-white/10 font-bold uppercase text-[10px] tracking-widest rounded-xl hover:bg-accent hover:text-accent-foreground transition-all">
                            Review Bid
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="py-24 text-center">
                  <h3 className="text-xl font-bold text-gray-400 uppercase tracking-tight">No historical records found.</h3>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* New/Edit Bid Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-[#1c1e24] border-none rounded-xl p-8 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold uppercase tracking-tight">
              {editingBid ? 'Edit Bid Details' : 'Create New Bid'}
            </DialogTitle>
            <DialogDescription className="text-xs font-semibold uppercase tracking-widest text-gray-500 mt-1">
              Update project information and status.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-6 font-sans">
            <div className="space-y-2">
              <Label htmlFor="projectName" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Project Name</Label>
              <Input
                id="projectName"
                placeholder="e.g. Austin Tech Center"
                value={formState.projectName}
                onChange={(e) => setFormState({ ...formState, projectName: e.target.value })}
                className="h-12 bg-gray-50 dark:bg-white/5 border-transparent focus:border-accent rounded-xl font-semibold text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gc" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">General Contractor</Label>
              <Input
                id="gc"
                placeholder="e.g. Turner Construction"
                value={formState.gc}
                onChange={(e) => setFormState({ ...formState, gc: e.target.value })}
                className="h-12 bg-gray-50 dark:bg-white/5 border-transparent focus:border-accent rounded-xl font-semibold text-sm"
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
                  className="h-12 bg-gray-50 dark:bg-white/5 border-transparent focus:border-accent rounded-xl font-bold font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Project Status</Label>
                <Select
                  value={formState.status}
                  onValueChange={(val: any) => setFormState({ ...formState, status: val })}
                >
                  <SelectTrigger className="h-12 bg-gray-50 dark:bg-white/5 border-transparent focus:border-accent rounded-xl uppercase text-[10px] font-bold tracking-widest">
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
              className="w-full h-14 bg-accent text-accent-foreground font-bold uppercase text-xs tracking-widest rounded-xl transition-all shadow-lg shadow-accent/10"
              onClick={handleCreateOrUpdate}
            >
              {editingBid ? 'Save Changes' : 'Create Bid Record'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BidManagement;
