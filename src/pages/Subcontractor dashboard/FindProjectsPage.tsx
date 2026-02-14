import { useState, useEffect, useMemo } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Subcontractor dashboard/ui/card';
import { Button } from '@/components/Subcontractor dashboard/ui/button';
import { Input } from '@/components/Subcontractor dashboard/ui/input';
import { Badge } from '@/components/Subcontractor dashboard/ui/badge';
import { Label } from '@/components/Subcontractor dashboard/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/Subcontractor dashboard/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { createBid, finalizeBidSubmission, getProjectDiscovery } from '@/api/gc-apis/backend';
import { Textarea } from '@/components/Subcontractor dashboard/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/Subcontractor dashboard/ui/select";
import {
    Search,
    Plus,
    MapPin,
    Building2,
    Star,
    List as ListIcon,
    CheckCircle2,
    TrendingUp,
    Layers,
    Globe,
    Briefcase,
    DollarSign,
    Clock,
    ShieldCheck,
    Tag,
    FileSearch,
    Trash2,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { bidFormSchema } from '@/validation/gcBidSchemas';
import { cn } from '@/lib/utils';
import ProjectFilters, { ProjectFilterState } from '@/components/projects/ProjectFilters';
import StatCard from '@/components/Subcontractor dashboard/StatCard';

const FindProjectsPage = () => {
    const { toast } = useToast();
    const navigate = useNavigate();

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
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showBidModal, setShowBidModal] = useState(false);
    const [isCreatingBid, setIsCreatingBid] = useState(false);

    // Bid Form State
    const [bidItems, setBidItems] = useState<any[]>([{ name: '', description: '', price: 0 }]);
    const [bidNotes, setBidNotes] = useState('');
    const [bidStartDate, setBidStartDate] = useState('');
    const [bidEndDate, setBidEndDate] = useState('');
    const [bidCompanyHighlights, setBidCompanyHighlights] = useState('');
    const [bidCredentials, setBidCredentials] = useState('');
    const [bidRelevantExperience, setBidRelevantExperience] = useState('');
    const [bidFormError, setBidFormError] = useState<string | null>(null);

    const { data: projects = [], isLoading } = useQuery<any[]>({
        queryKey: ['project-discovery'],
        queryFn: () => getProjectDiscovery(),
    });

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
            navigate('/subcontractor-dashboard/bids');

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

    const filteredProjects = useMemo(() => {
        return projects.filter((p: any) => {
            const matchesSearch = !searchQuery ||
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.trades && p.trades.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase())));

            if (!filters) return matchesSearch;

            // Rest of filtering logic remains similar to original but cleaned up
            const keywords = filters.keywords?.toLowerCase() || "";
            const matchesKeywords = !keywords || p.name.toLowerCase().includes(keywords) || p.description.toLowerCase().includes(keywords);
            const matchesLocation = !filters.location || p.location.toLowerCase().includes(filters.location.toLowerCase());
            const matchesMileage = !filters.radius || (p.distanceValue || 0) <= filters.radius;
            const matchesType = filters.categories.length === 0 || filters.categories.includes(p.category);
            const matchesStatus = filters.solicitationStatus.length === 0 || filters.solicitationStatus.includes(p.status);

            return matchesSearch && matchesKeywords && matchesLocation && matchesMileage && matchesType && matchesStatus;
        });
    }, [projects, searchQuery, filters]);

    // KPIs for the top
    const totalAvailable = projects.length;
    const highMatch = projects.filter((p: any) => p.isProfileMatch).length;
    const dueThisWeek = projects.filter((p: any) => {
        const deadlineDate = new Date(p.deadline);
        const today = new Date();
        const diffDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays <= 7 && diffDays >= 0;
    }).length;

    return (
        <div className="p-6 animate-fade-in flex flex-col h-full overflow-hidden">
            {/* Page Header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Find Projects</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Discover new opportunities and bid on active solicitations in your region.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-64 md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder="Search projects, trades, NIGP..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-background border-border h-10 text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border">
                        <Button
                            variant={viewMode === 'card' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('card')}
                            className="h-8 w-8 p-0"
                        >
                            <Layers size={14} />
                        </Button>
                        <Button
                            variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('table')}
                            className="h-8 w-8 p-0"
                        >
                            <ListIcon size={14} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <StatCard
                    title="Total Opportunities"
                    value={totalAvailable}
                    subtitle="Active market solicitations"
                    icon={<Globe className="w-5 h-5" />}
                    variant="primary"
                />
                <StatCard
                    title="Priority Matches"
                    value={highMatch}
                    subtitle="Based on your profile"
                    icon={<Star className="w-5 h-5" />}
                    variant="success"
                />
                <StatCard
                    title="Due This Week"
                    value={dueThisWeek}
                    subtitle="Act fast - deadlines approaching"
                    icon={<Clock className="w-5 h-5" />}
                    variant="warning"
                />
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Filters Sidebar */}
                <aside className="w-72 hidden xl:flex flex-col bg-card border border-border rounded-xl overflow-hidden shrink-0">
                    <div className="p-4 border-b border-border bg-muted/30">
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary" /> Filters
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <ProjectFilters onFiltersChange={setFilters} initialFilters={filters} />
                    </div>
                </aside>

                {/* Project Feed */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-xl bg-muted/10">
                            <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                            <p className="text-sm text-muted-foreground">Scanning market for opportunities...</p>
                        </div>
                    ) : filteredProjects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-xl bg-muted/10 p-8 text-center">
                            <FileSearch className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
                            <h3 className="text-lg font-semibold">No Projects Found</h3>
                            <p className="text-sm text-muted-foreground max-w-xs mt-1">
                                Try adjusting your search or filters to find more opportunities.
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-4"
                                onClick={() => { setSearchQuery(''); /* Reset filters logic if needed */ }}
                            >
                                Clear Search
                            </Button>
                        </div>
                    ) : (
                        <div className={cn(
                            "grid gap-4 pb-8",
                            viewMode === 'card' ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
                        )}>
                            {filteredProjects.map((p: any) => (
                                <Card
                                    key={p.id}
                                    className={cn(
                                        "group relative overflow-hidden transition-all hover:shadow-md border-border",
                                        p.isProfileMatch ? "ring-1 ring-primary/20 bg-primary/5" : "bg-card"
                                    )}
                                    onClick={() => { setSelectedProject(p); setShowDetailsModal(true); }}
                                >
                                    <CardHeader className="p-5 pb-2">
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge variant="outline" className="text-[10px] font-medium h-5 px-2 bg-muted/50 border-border">
                                                {p.source}
                                            </Badge>
                                            <div className="flex gap-2">
                                                {p.isProfileMatch && (
                                                    <Badge className="bg-success/10 text-success hover:bg-success/20 border-none text-[10px] h-5 flex items-center gap-1">
                                                        <Star size={10} className="fill-current" /> MATCH
                                                    </Badge>
                                                )}
                                                <Badge variant="outline" className="text-[10px] h-5 border-border bg-background">
                                                    Due: {p.deadline}
                                                </Badge>
                                            </div>
                                        </div>
                                        <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-2">
                                            {p.name}
                                        </CardTitle>
                                        <CardDescription className="text-xs flex items-center gap-1.5 mt-1">
                                            <MapPin size={12} className="text-muted-foreground" /> {p.location} • {p.distance}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="p-5 pt-2 flex flex-col gap-4">
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {p.description}
                                        </p>

                                        <div className="flex flex-wrap gap-1.5">
                                            {p.trades?.slice(0, 4).map((t: string) => (
                                                <span key={t} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                                                    {t}
                                                </span>
                                            ))}
                                            {p.trades?.length > 4 && (
                                                <span className="text-[10px] text-muted-foreground font-medium">+{p.trades.length - 4} more</span>
                                            )}
                                        </div>

                                        <div className="pt-4 border-t border-border flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">EST. BUDGET</p>
                                                <p className="text-sm font-bold text-foreground">{p.budget}</p>
                                            </div>
                                            <Button
                                                size="sm"
                                                className="h-9 px-4 rounded-lg text-xs font-semibold gap-2"
                                            >
                                                View Details <ChevronRight size={14} />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Details Modal */}
            <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
                <DialogContent className="max-w-2xl p-0 overflow-hidden border-border bg-card">
                    {selectedProject && (
                        <div className="flex flex-col">
                            <div className="p-6 border-b border-border bg-muted/20">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex gap-2">
                                        <Badge variant="outline" className="text-[10px] px-2">{selectedProject.source}</Badge>
                                        <Badge className="bg-primary/10 text-primary border-none text-[10px] px-2">Market Solicitation</Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                        <Clock size={14} />
                                        <span>Bids Due: {selectedProject.deadline}</span>
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight text-foreground leading-tight">
                                    {selectedProject.name}
                                </h2>
                                <div className="flex items-center gap-4 mt-3 text-xs font-medium text-muted-foreground">
                                    <span className="flex items-center gap-1.5"><MapPin size={14} className="text-primary" /> {selectedProject.location}</span>
                                    <span className="flex items-center gap-1.5"><Tag size={14} /> NIGP Code: {selectedProject.nigpCode}</span>
                                </div>
                            </div>

                            <div className="p-6 space-y-6 max-h-[50vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {[
                                        { label: "Est. Value", val: selectedProject.budget, icon: DollarSign },
                                        { label: "Project Size", val: `${selectedProject.sqft} SQFT`, icon: Building2 },
                                        { label: "Status", val: selectedProject.status, icon: CheckCircle2 },
                                        { label: "ID", val: `#${selectedProject.id?.slice(0, 6)}`, icon: ShieldCheck },
                                    ].map((item, idx) => (
                                        <div key={idx} className="p-3 rounded-xl bg-muted/30 border border-border">
                                            <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">{item.label}</p>
                                            <p className="text-sm font-bold truncate">{item.val}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold">Project Description</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                        {selectedProject.description}
                                    </p>
                                </div>

                                {selectedProject.trades && (
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold">Scope of Work / Trades</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedProject.trades.map((t: string) => (
                                                <Badge key={t} variant="secondary" className="text-[10px] font-medium px-2 py-1">
                                                    {t}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 bg-muted/20 border-t border-border flex gap-3">
                                <Button onClick={() => setShowDetailsModal(false)} variant="ghost" className="flex-1">Close</Button>
                                <Button onClick={handleOpenBidModal} className="flex-[2] gap-2">
                                    <Briefcase size={16} /> Submit Proposal
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Bid Proposal Form Modal (Re-themed) */}
            <Dialog open={showBidModal} onOpenChange={setShowBidModal}>
                <DialogContent className="max-w-3xl p-0 overflow-hidden border-border bg-card">
                    <div className="flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-border bg-muted/20">
                            <div className="flex justify-between items-center mb-2">
                                <Badge className="bg-primary/10 text-primary border-none text-[10px] px-2 font-bold uppercase tracking-wider">Proposal Draft</Badge>
                                <div className="text-right">
                                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Est. Bid Total</p>
                                    <p className="text-xl font-bold text-primary">${calculateTotal().toLocaleString()}</p>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">Submit Proposal</h2>
                            <p className="text-xs text-muted-foreground mt-1">Project: {selectedProject?.name}</p>
                        </div>

                        <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold">Estimated Start Date</Label>
                                    <Input
                                        type="date"
                                        value={bidStartDate}
                                        onChange={(e) => setBidStartDate(e.target.value)}
                                        className="h-10 text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold">Estimated Completion Date</Label>
                                    <Input
                                        type="date"
                                        value={bidEndDate}
                                        onChange={(e) => setBidEndDate(e.target.value)}
                                        className="h-10 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label className="text-xs font-semibold">Line Items Breakdown</Label>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setBidItems([...bidItems, { name: '', description: '', price: 0 }])}
                                        className="h-8 text-xs gap-1.5"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Add Item
                                    </Button>
                                </div>
                                <div className="space-y-3">
                                    {bidItems.map((item, index) => (
                                        <div key={index} className="flex gap-3 items-start p-4 bg-muted/20 rounded-xl border border-border">
                                            <div className="flex-1 space-y-2">
                                                <Input
                                                    placeholder="Scope Item Name"
                                                    value={item.name}
                                                    onChange={(e) => {
                                                        const newItems = [...bidItems];
                                                        newItems[index].name = e.target.value;
                                                        setBidItems(newItems);
                                                    }}
                                                    className="h-9 text-xs"
                                                />
                                                <Input
                                                    placeholder="Brief work description"
                                                    value={item.description}
                                                    onChange={(e) => {
                                                        const newItems = [...bidItems];
                                                        newItems[index].description = e.target.value;
                                                        setBidItems(newItems);
                                                    }}
                                                    className="h-9 text-xs"
                                                />
                                            </div>
                                            <div className="w-32 space-y-2">
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                                    <Input
                                                        type="number"
                                                        placeholder="Price"
                                                        value={item.price}
                                                        onChange={(e) => {
                                                            const newItems = [...bidItems];
                                                            newItems[index].price = e.target.value;
                                                            setBidItems(newItems);
                                                        }}
                                                        className="pl-8 h-9 text-xs"
                                                    />
                                                </div>
                                                {bidItems.length > 1 && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setBidItems(bidItems.filter((_, i) => i !== index))}
                                                        className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 text-[10px] font-semibold h-8"
                                                    >
                                                        <Trash2 size={12} className="mr-1.5" /> Remove
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
                                <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-primary fill-current" />
                                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Company Highlights</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase">Key Stats</Label>
                                        <Input
                                            placeholder="e.g. 15 Years Exp, Zero Safety Incidents"
                                            value={bidCompanyHighlights}
                                            onChange={(e) => setBidCompanyHighlights(e.target.value)}
                                            className="h-9 text-xs"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase">Licensing</Label>
                                        <Input
                                            placeholder="e.g. OSHA 30, Master Electrician"
                                            value={bidCredentials}
                                            onChange={(e) => setBidCredentials(e.target.value)}
                                            className="h-9 text-xs"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-semibold text-muted-foreground uppercase">Past Performance Reference</Label>
                                    <Textarea
                                        placeholder="Briefly describe 1-2 similar projects you completed..."
                                        value={bidRelevantExperience}
                                        onChange={(e) => setBidRelevantExperience(e.target.value)}
                                        className="min-h-[60px] text-xs resize-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Proposal Summary / Notes</Label>
                                <Textarea
                                    placeholder="Tell the project owner why your company is the best fit for this scope..."
                                    value={bidNotes}
                                    onChange={(e) => setBidNotes(e.target.value)}
                                    className="min-h-[100px] text-sm"
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-border bg-muted/20 flex gap-4">
                            <Button onClick={() => setShowBidModal(false)} variant="ghost" className="flex-1">Cancel</Button>
                            <Button
                                onClick={handleSubmitBid}
                                disabled={isCreatingBid || calculateTotal() <= 0}
                                className="flex-[2] gap-2 font-semibold"
                            >
                                {isCreatingBid ? <Loader2 className="w-4 h-4 animate-spin" /> : <Briefcase className="w-4 h-4" />}
                                {isCreatingBid ? 'Submitting...' : 'Submit Final Proposal'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default FindProjectsPage;
