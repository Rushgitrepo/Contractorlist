import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getMyBids,
    getBidDetail,
    updateBidItems,
    finalizeBidSubmission,
    withdrawBid,
    deleteBid,
    Bid as ApiBid
} from '@/api/gc-apis/backend';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Subcontractor dashboard/ui/card';
import { Button } from '@/components/Subcontractor dashboard/ui/button';
import { Badge } from '@/components/Subcontractor dashboard/ui/badge';
import { Input } from '@/components/Subcontractor dashboard/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/Subcontractor dashboard/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/Subcontractor dashboard/ui/alert-dialog";
import {
    Gavel,
    Search,
    Clock,
    CheckCircle2,
    FileText,
    DollarSign,
    Eye,
    PlayCircle,
    MapPin,
    Building2,
    Users,
    XCircle,
    AlertCircle,
    Edit,
    Trash2,
    Loader2,
    ChevronRight,
    Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import StatCard from '@/components/Subcontractor dashboard/StatCard';

const BidsPage = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [activeStage, setActiveStage] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Detail Modal State
    const [selectedBidId, setSelectedBidId] = useState<string | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editableItems, setEditableItems] = useState<any[]>([]);

    // Alert Dialog State
    const [alertConfig, setAlertConfig] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        onConfirm: () => void;
        variant: 'default' | 'destructive';
    }>({
        isOpen: false,
        title: '',
        description: '',
        onConfirm: () => { },
        variant: 'default'
    });

    const { data: bids = [], isLoading } = useQuery({
        queryKey: ['my-bids'],
        queryFn: getMyBids,
    });

    const { data: bidDetails, isLoading: detailLoading } = useQuery({
        queryKey: ['bid-detail', selectedBidId],
        queryFn: () => selectedBidId ? getBidDetail(selectedBidId) : null,
        enabled: !!selectedBidId,
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, items }: { id: string, items: any[] }) => updateBidItems(id, items),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bid-detail', selectedBidId] });
            queryClient.invalidateQueries({ queryKey: ['my-bids'] });
            toast({ title: "Draft Updated", description: "Proposal items saved." });
            setIsEditing(false);
        }
    });

    const submitMutation = useMutation({
        mutationFn: (id: string) => finalizeBidSubmission(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-bids'] });
            toast({ title: "Proposal Submitted", description: "Bids sent to the owner." });
            setIsDetailOpen(false);
        }
    });

    const withdrawMutation = useMutation({
        mutationFn: (id: string) => withdrawBid(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-bids'] });
            toast({ title: "Bid Withdrawn", description: "Proposal retracted." });
            setIsDetailOpen(false);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteBid(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-bids'] });
            toast({ title: "Bid Deleted", description: "Removal successful." });
            setIsDetailOpen(false);
        }
    });

    const handleViewDetails = (bid: any) => {
        setSelectedBidId(bid.id);
        setIsDetailOpen(true);
        setIsEditing(false);
    };

    const handleEditItems = () => {
        if (!bidDetails) return;
        const mappedItems = (bidDetails.items || []).map((item: any) => ({
            id: item.id,
            name: item.item_name || '',
            description: item.item_description || '',
            price: Number(item.item_price) || 0
        }));
        setEditableItems(mappedItems);
        setIsEditing(true);
    };

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'draft':
                return { label: 'Draft', color: 'bg-muted text-muted-foreground', icon: Clock };
            case 'submitted':
                return { label: 'Submitted', color: 'bg-primary/10 text-primary', icon: FileText };
            case 'accepted':
                return { label: 'Accepted', color: 'bg-success/10 text-success', icon: CheckCircle2 };
            case 'rejected':
                return { label: 'Rejected', color: 'bg-destructive/10 text-destructive', icon: XCircle };
            default:
                return { label: status, color: 'bg-muted text-muted-foreground', icon: FileText };
        }
    };

    const filteredBids = bids.filter((bid: any) => {
        const matchesSearch = bid.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (bid.client_name && bid.client_name.toLowerCase().includes(searchQuery.toLowerCase()));
        if (activeStage === 'all') return matchesSearch;
        return matchesSearch && bid.status === activeStage;
    });

    return (
        <div className="p-6 animate-fade-in flex flex-col h-full overflow-hidden">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Bid Management</h1>
                    <p className="text-sm text-muted-foreground mt-1">Track and manage your submitted proposals and drafts.</p>
                </div>
                <div className="relative w-64 md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Search by project or client..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-background border-border h-10 text-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                <StatCard title="Total Bids" value={bids.length} icon={<Gavel className="w-5 h-5" />} variant="primary" />
                <StatCard title="Submitted" value={bids.filter((b: any) => b.status === 'submitted').length} icon={<FileText className="w-5 h-5" />} variant="primary" />
                <StatCard title="Accepted" value={bids.filter((b: any) => b.status === 'accepted').length} icon={<CheckCircle2 className="w-5 h-5" />} variant="success" />
                <StatCard title="Drafts" value={bids.filter((b: any) => b.status === 'draft').length} icon={<Clock className="w-5 h-5" />} variant="warning" />
            </div>

            <div className="flex-1 flex flex-col overflow-hidden bg-card border border-border rounded-xl">
                <div className="px-5 border-b border-border bg-muted/30">
                    <div className="flex items-center gap-6 h-12 overflow-x-auto no-scrollbar">
                        {['all', 'submitted', 'accepted', 'draft', 'rejected', 'withdrawn'].map(stage => (
                            <button
                                key={stage}
                                onClick={() => setActiveStage(stage)}
                                className={cn(
                                    "h-12 border-b-2 px-1 text-sm font-semibold transition-all whitespace-nowrap uppercase tracking-wider",
                                    activeStage === stage ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {stage}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : filteredBids.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-xl bg-muted/10 p-8 text-center">
                            <Gavel className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
                            <h3 className="text-lg font-semibold">No Bids Found</h3>
                            <p className="text-sm text-muted-foreground max-w-xs mt-1">You haven't submitted any bids matching this filter.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredBids.map((bid: any) => {
                                const info = getStatusInfo(bid.status);
                                return (
                                    <Card key={bid.id} className="group hover:shadow-md transition-all border-border overflow-hidden" onClick={() => handleViewDetails(bid)}>
                                        <CardContent className="p-0">
                                            <div className="flex flex-col md:flex-row md:items-center">
                                                <div className={cn("w-1 md:w-1.5 md:h-[100px] shrink-0", info.color.split(' ')[0].replace('bg-', 'bg-'))} />
                                                <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                    <div className="space-y-1.5 flex-1">
                                                        <div className="flex items-center gap-3">
                                                            <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{bid.project_name}</h4>
                                                            <Badge className={cn("text-[10px] h-5 border-none", info.color)}>{info.label}</Badge>
                                                        </div>
                                                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                                                            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-primary" /> {bid.location}</span>
                                                            <span className="flex items-center gap-1.5"><Building2 size={14} /> {bid.project_type}</span>
                                                            <span className="flex items-center gap-1.5"><Users size={14} /> {bid.client_name}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between md:justify-end gap-8 border-t md:border-t-0 pt-4 md:pt-0">
                                                        <div className="text-left md:text-right">
                                                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Proposed Total</p>
                                                            <p className="text-xl font-bold">${Number(bid.amount).toLocaleString()}</p>
                                                        </div>
                                                        <Button size="sm" variant="ghost" className="h-10 w-10 p-0 rounded-full hover:bg-muted group">
                                                            <ChevronRight size={20} className="text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Bid Detail Modal */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-2xl p-0 overflow-hidden border-border bg-card">
                    {selectedBidId && (
                        <div className="flex flex-col max-h-[90vh]">
                            <div className="p-6 border-b border-border bg-muted/20">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold tracking-tight">{bidDetails?.project_name || 'Loading...'}</h2>
                                        <p className="text-xs text-muted-foreground">Bid Reference: #{selectedBidId.slice(0, 8)}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <Badge className={cn("text-[10px] font-bold px-2", getStatusInfo(bidDetails?.status || 'draft').color)}>
                                        {(bidDetails?.status || 'draft').toUpperCase()}
                                    </Badge>
                                    <div className="text-right">
                                        <p className="text-[10px] font-semibold text-muted-foreground uppercase">Estimated Value</p>
                                        <p className="text-xl font-bold text-primary">${Number(bidDetails?.total_price || 0).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                                {detailLoading ? (
                                    <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {bidDetails?.company_highlights && (
                                                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                                                    <p className="text-[10px] font-bold text-primary uppercase mb-1">Company Highlights</p>
                                                    <p className="text-sm text-foreground/80">{bidDetails.company_highlights}</p>
                                                </div>
                                            )}
                                            {bidDetails?.credentials && (
                                                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Licensing</p>
                                                    <p className="text-sm text-foreground/80">{bidDetails.credentials}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <h4 className="text-sm font-semibold">Scope of Work Breakdown</h4>
                                                {isEditing && (
                                                    <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={() => setEditableItems([...editableItems, { name: '', description: '', price: 0 }])}>
                                                        <Plus size={14} /> Add Item
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                {isEditing ? (
                                                    editableItems.map((item, idx) => (
                                                        <div key={idx} className="flex gap-3 p-4 bg-muted/20 border border-border rounded-xl">
                                                            <div className="flex-1 space-y-2">
                                                                <Input placeholder="Item Name" value={item.name} onChange={(e) => { const n = [...editableItems]; n[idx].name = e.target.value; setEditableItems(n); }} className="h-9 text-sm" />
                                                                <Input placeholder="Description" value={item.description} onChange={(e) => { const n = [...editableItems]; n[idx].description = e.target.value; setEditableItems(n); }} className="h-9 text-xs" />
                                                            </div>
                                                            <div className="w-32 flex flex-col gap-2">
                                                                <div className="relative">
                                                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                                                    <Input type="number" value={item.price} onChange={(e) => { const n = [...editableItems]; n[idx].price = Number(e.target.value); setEditableItems(n); }} className="pl-8 h-9 text-sm" />
                                                                </div>
                                                                <Button variant="ghost" size="sm" className="h-8 text-destructive text-[10px]" onClick={() => setEditableItems(editableItems.filter((_, i) => i !== idx))}>Remove</Button>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    bidDetails?.items?.map((item: any, idx: number) => (
                                                        <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-muted/30 border border-border">
                                                            <div>
                                                                <p className="text-sm font-semibold">{item.item_name}</p>
                                                                <p className="text-xs text-muted-foreground">{item.item_description}</p>
                                                            </div>
                                                            <p className="text-sm font-bold">${Number(item.item_price).toLocaleString()}</p>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>

                                        {bidDetails?.notes && (
                                            <div className="space-y-1.5">
                                                <p className="text-xs font-semibold">Additional Notes</p>
                                                <p className="text-sm text-muted-foreground bg-muted/20 p-4 rounded-xl border border-border italic">
                                                    "{bidDetails.notes}"
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="p-6 border-t border-border bg-muted/20 flex gap-3">
                                {isEditing ? (
                                    <>
                                        <Button variant="ghost" className="flex-1" onClick={() => setIsEditing(false)}>Cancel</Button>
                                        <Button className="flex-[2]" onClick={() => updateMutation.mutate({ id: selectedBidId, items: editableItems })}>Save Changes</Button>
                                    </>
                                ) : (
                                    <>
                                        <Button variant="ghost" className="flex-1" onClick={() => setIsDetailOpen(false)}>Close</Button>
                                        {bidDetails?.status === 'draft' && (
                                            <>
                                                <Button variant="outline" className="flex-1" onClick={handleEditItems}>Edit Draft</Button>
                                                <Button className="flex-[2]" onClick={() => submitMutation.mutate(selectedBidId)}>Submit Final Bid</Button>
                                            </>
                                        )}
                                        {bidDetails?.status === 'submitted' && (
                                            <Button variant="destructive" className="flex-1" onClick={() => withdrawMutation.mutate(selectedBidId)}>Withdraw</Button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BidsPage;
