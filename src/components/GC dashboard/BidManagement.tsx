import { useState, useEffect } from 'react';

import { getMyBids, getBidDetail, updateBidItems, Bid as ApiBid, BidItem, finalizeBidSubmission, withdrawBid, deleteBid } from '@/api/gc-apis/backend';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Gavel,
    Search,
    Filter,
    Plus,
    Clock,
    CheckCircle2,
    FileText,
    DollarSign,
    ArrowUpRight,
    Eye,
    PlayCircle,
    MapPin,
    Building2,
    Users,
    XCircle,
    AlertCircle,
    Edit,
    Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/components/ui/use-toast";
import { bidItemEditSchema } from "@/validation/gcBidSchemas";

// Map backend status to frontend view

type BidStatus = 'draft' | 'submitted' | 'viewed' | 'accepted' | 'started' | 'rejected' | 'withdrawn';

// Extended local interface for display (though we mostly use ApiBid)
interface DisplayBid extends ApiBid {
    // Add any frontend-computed fields if necessary
}

const BidManagement = () => {
    const { toast } = useToast();
    const [activeStage, setActiveStage] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [bids, setBids] = useState<DisplayBid[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Detail Modal State
    const [selectedBid, setSelectedBid] = useState<DisplayBid | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [bidDetails, setBidDetails] = useState<any>(null); // Full details including items
    const [isDetailOpen, setIsDetailOpen] = useState(false);


    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [editableItems, setEditableItems] = useState<any[]>([]);
    const [editItemsError, setEditItemsError] = useState<string | null>(null);


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

    const confirmAction = (title: string, description: string, onConfirm: () => void, variant: 'default' | 'destructive' = 'default') => {
        setAlertConfig({ isOpen: true, title, description, onConfirm, variant });
    };

    const handleEditItems = () => {
        if (!bidDetails) return;
        // Map backend fields (item_name, item_description, item_price) to frontend fields (name, description, price)
        const mappedItems = (bidDetails.items || []).map((item: any) => ({
            id: item.id,
            name: item.item_name || '',
            description: item.item_description || '',
            price: Number(item.item_price) || 0
        }));
        setEditableItems(mappedItems);
        setIsEditing(true);
    };

    const handleSaveItems = async () => {
        if (!selectedBid) return;
        try {
            // The API expects { name, description, price } which matches our editableItems state
            await updateBidItems(selectedBid.id, editableItems);
            toast({
                title: "Draft Updated",
                description: "Your bid proposal items have been successfully saved.",
            });
            setIsEditing(false);

            // Reload details to show updated data
            const details = await getBidDetail(selectedBid.id);
            setBidDetails(details);
            loadBids(); // Refresh main list for amounts
        } catch (error) {
            console.error("Failed to update items", error);
            toast({
                title: "Update Failed",
                description: "We encountered an error while saving your changes.",
                variant: "destructive"
            });
        }
    };

    useEffect(() => {
        loadBids();
    }, []);

    const loadBids = async () => {
        try {
            setIsLoading(true);
            const data = await getMyBids();
            setBids(data);
        } catch (error) {
            console.error("Failed to load bids", error);
            toast({
                title: "Connection Error",
                description: "Unable to retrieve your bids. Please check your connection.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewDetails = async (bid: DisplayBid) => {
        try {
            setSelectedBid(bid);
            setIsDetailOpen(true);
            setDetailLoading(true);
            setIsEditing(false); // Reset editing state when opening new detail
            const details = await getBidDetail(bid.id);
            setBidDetails(details);
        } catch (error) {
            console.error("Failed to load bid details", error);
            toast({
                title: "Error",
                description: "Failed to load detailed bid information.",
                variant: "destructive"
            });
        } finally {
            setDetailLoading(false);
        }
    };

    const handleSubmitBid = async () => {
        if (!selectedBid) return;
        try {
            await finalizeBidSubmission(selectedBid.id);
            toast({
                title: "Proposal Submitted",
                description: "Your bid has been officially submitted to the project owner.",
            });
            setIsDetailOpen(false);
            loadBids();
        } catch (error) {
            console.error("Failed to submit bid", error);
            toast({
                title: "Submission Error",
                description: "There was a problem submitting your proposal.",
                variant: "destructive"
            });
        }
    };

    const handleWithdrawBid = async () => {
        if (!selectedBid) return;
        try {
            await withdrawBid(selectedBid.id);
            toast({
                title: "Bid Withdrawn",
                description: "Your proposal has been retracted.",
            });
            setIsDetailOpen(false);
            loadBids();
        } catch (error) {
            console.error("Failed to withdraw bid", error);
            toast({
                title: "Error",
                description: "Could not withdraw bid at this time.",
                variant: "destructive"
            });
        }
    };

    const handleDeleteBid = async (id: string) => {
        confirmAction(
            "Delete Bid?",
            "Are you sure you want to delete this bid? This action cannot be undone.",
            async () => {
                try {
                    await deleteBid(id);
                    toast({
                        title: "Bid Deleted",
                        description: "Your proposal has been removed from the system.",
                    });
                    if (isDetailOpen) setIsDetailOpen(false);
                    loadBids();
                } catch (error: any) {
                    console.error("Failed to delete bid", error);
                    toast({
                        title: "Error",
                        description: error.message || "Failed to delete bid.",
                        variant: "destructive"
                    });
                }
            },
            "destructive"
        );
    };

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'draft':
                return { label: 'Draft', color: 'bg-gray-100 text-gray-800', icon: Clock };
            case 'submitted':
                return { label: 'Submitted', color: 'bg-blue-100 text-blue-800', icon: FileText };
            case 'viewed':
                return { label: 'Viewed', color: 'bg-indigo-100 text-indigo-800', icon: Eye };
            case 'accepted':
                return { label: 'Accepted', color: 'bg-green-100 text-green-800', icon: CheckCircle2 };
            case 'started':
                return { label: 'Project Started', color: 'bg-purple-100 text-purple-800', icon: PlayCircle };
            case 'rejected':
                return { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle };
            case 'withdrawn':
                return { label: 'Withdrawn', color: 'bg-amber-100 text-amber-800', icon: AlertCircle };
            default:
                return { label: status, color: 'bg-gray-100 text-gray-800', icon: FileText };
        }
    };

    const filteredBids = bids.filter(bid => {
        if (!bid || !bid.project_name) return false;
        const matchesSearch = bid.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (bid.client_name && bid.client_name.toLowerCase().includes(searchQuery.toLowerCase()));

        if (activeStage === 'all') return matchesSearch;
        if (activeStage === 'submitted') return matchesSearch && (bid.status === 'submitted');
        if (activeStage === 'viewed') return matchesSearch && (bid.status === 'viewed');
        if (activeStage === 'accepted') return matchesSearch && (bid.status === 'accepted');
        if (activeStage === 'started') return matchesSearch && (bid.status === 'started');
        if (activeStage === 'draft') return matchesSearch && (bid.status === 'draft');
        return matchesSearch;
    });

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Gavel className="w-6 h-6" /> Bid Management
                    </h1>
                    <p className="text-gray-500 text-sm">Track and manage your project proposals</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm font-medium text-gray-500">Total Bids</p>
                        <p className="text-2xl font-bold">{bids.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm font-medium text-gray-500">Submitted</p>
                        <p className="text-2xl font-bold text-blue-600">{bids.filter(b => b.status === 'submitted').length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm font-medium text-gray-500">Wait/Viewed</p>
                        <p className="text-2xl font-bold text-indigo-600">{bids.filter(b => b.status === 'viewed').length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm font-medium text-gray-500">Project Started</p>
                        <p className="text-2xl font-bold text-purple-600">{bids.filter(b => b.status === 'started').length}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Tabs */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search by project or client..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-md overflow-x-auto">
                        {['all', 'submitted', 'viewed', 'accepted', 'started', 'draft'].map(stage => (
                            <button
                                key={stage}
                                onClick={() => setActiveStage(stage)}
                                className={cn(
                                    "px-4 py-1.5 text-sm font-medium rounded-md transition-all capitalize",
                                    activeStage === stage
                                        ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"
                                        : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                )}
                            >
                                {stage}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bids List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-12">Loading Bids...</div>
                ) : filteredBids.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No bids found matching your criteria.</p>
                    </div>
                ) : (
                    filteredBids.map(bid => {
                        const info = getStatusInfo(bid.status);
                        return (
                            <Card
                                key={bid.id}
                                className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden border-l-4"
                                style={{ borderLeftColor: bid.status === 'accepted' ? '#10b981' : bid.status === 'submitted' ? '#3b82f6' : '#9ca3af' }}
                                onClick={() => handleViewDetails(bid)}
                            >
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-lg font-bold">{bid.project_name}</h3>
                                                <Badge className={cn("text-[10px] px-2", info.color)}>{info.label}</Badge>
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {bid.location}</span>
                                                <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {bid.project_type}</span>
                                                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {bid.client_name}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400">Proposed Amount</p>
                                                <p className="text-xl font-bold">${Number(bid.amount).toLocaleString()}</p>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-gray-300 hover:text-red-500"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteBid(bid.id);
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>

            {/* Bid Details Modal */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-2xl bg-white dark:bg-[#1c1e24] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{selectedBid?.project_name}</DialogTitle>
                        <DialogDescription>
                            {isEditing ? 'Update your bid proposal items.' : 'Review your bid details and items.'}
                        </DialogDescription>
                    </DialogHeader>

                    {detailLoading ? (
                        <div className="py-8 text-center">Loading details...</div>
                    ) : bidDetails ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/10">
                                    <p className="text-xs text-gray-500 mb-1">Status</p>
                                    <Badge className={getStatusInfo(bidDetails?.status || 'draft').color}>
                                        {(bidDetails?.status || 'draft').toUpperCase()}
                                    </Badge>
                                </div>
                                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/10 text-right">
                                    <p className="text-xs text-gray-500 mb-1">Total Quote</p>
                                    <p className="text-lg font-bold text-accent">${Number(bidDetails.total_price).toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Proposals Details / Pitch */}
                            <div className="space-y-4 pt-1 border-t border-gray-100 dark:border-white/5">
                                {(bidDetails.company_highlights || bidDetails.credentials) && (
                                    <div className="grid grid-cols-2 gap-4">
                                        {bidDetails.company_highlights && (
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Company Highlights</p>
                                                <p className="text-sm font-medium">{bidDetails.company_highlights}</p>
                                            </div>
                                        )}
                                        {bidDetails.credentials && (
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Credentials & Licensing</p>
                                                <p className="text-sm font-medium">{bidDetails.credentials}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {bidDetails.relevant_experience && (
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Relevant Experience</p>
                                        <div className="p-3 bg-blue-50/30 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-900/20 rounded-xl">
                                            <p className="text-xs leading-relaxed italic">{bidDetails.relevant_experience}</p>
                                        </div>
                                    </div>
                                )}

                                {bidDetails.notes && (
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Executive Summary</p>
                                        <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">{bidDetails.notes}</p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-lg font-bold">Line Items</h3>
                                    {isEditing && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setEditableItems([...editableItems, { name: '', description: '', price: 0 }])}
                                            className="h-8"
                                        >
                                            <Plus className="w-3 h-3 mr-1" /> Add Item
                                        </Button>
                                    )}
                                </div>

                                {editItemsError && (
                                    <div className="mb-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2 text-xs text-red-700 dark:text-red-200">
                                        {editItemsError}
                                    </div>
                                )}

                                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">

                                    {isEditing ? (
                                        <div className="space-y-4">
                                            {editableItems.map((item, index) => (
                                                <div key={index} className="flex gap-2 items-start p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
                                                    <div className="flex-1 space-y-2">
                                                        <Input
                                                            placeholder="Item Name"
                                                            value={item.name}
                                                            onChange={(e) => {
                                                                const newItems = [...editableItems];
                                                                newItems[index].name = e.target.value;
                                                                setEditableItems(newItems);
                                                            }}
                                                            className="h-8 bg-white dark:bg-black/20"
                                                        />
                                                        <Input
                                                            placeholder="Description (optional)"
                                                            value={item.description || ''}
                                                            onChange={(e) => {
                                                                const newItems = [...editableItems];
                                                                newItems[index].description = e.target.value;
                                                                setEditableItems(newItems);
                                                            }}
                                                            className="h-8 bg-white dark:bg-black/20"
                                                        />
                                                    </div>
                                                    <div className="w-24">
                                                        <Input
                                                            type="number"
                                                            placeholder="Price"
                                                            value={item.price}
                                                            onChange={(e) => {
                                                                const newItems = [...editableItems];
                                                                newItems[index].price = parseFloat(e.target.value) || 0;
                                                                setEditableItems(newItems);
                                                            }}
                                                            className="h-8 bg-white dark:bg-black/20"
                                                        />
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-500"
                                                        onClick={() => {
                                                            const newItems = editableItems.filter((_, i) => i !== index);
                                                            setEditableItems(newItems);
                                                        }}
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                            {editableItems.length === 0 && (
                                                <div className="text-center py-4 text-sm text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
                                                    No items. Click "Add Item" to start.
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        bidDetails.items?.length > 0 ? (
                                            bidDetails.items.map((item: any) => (
                                                <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                                                    <div>
                                                        <p className="font-bold">{item.item_name}</p>
                                                        {item.item_description && (
                                                            <p className="text-xs text-gray-500">{item.item_description}</p>
                                                        )}
                                                    </div>
                                                    <p className="font-bold">${Number(item.item_price).toLocaleString()}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 italic">No line items added so far.</p>
                                        )
                                    )}
                                </div>
                            </div>

                            {!isEditing && bidDetails.history && bidDetails.history.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold mb-2 border-b pb-1">Status History</h3>
                                    <div className="space-y-2">
                                        {bidDetails.history.map((h: any, i: number) => (
                                            <div key={i} className="text-[11px] text-gray-500 flex justify-between">
                                                <span><span className="font-semibold text-accent">{h.new_status.toUpperCase()}</span> by {h.changed_by_name}</span>
                                                <span>{new Date(h.changed_at).toLocaleDateString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : null}

                    <DialogFooter className="gap-2">
                        {isEditing ? (
                            <>
                                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                                <Button onClick={handleSaveItems} className="bg-green-600 text-white hover:bg-green-700">Save Changes</Button>
                            </>
                        ) : (
                            <>
                                {selectedBid?.status === 'draft' && (
                                    <>
                                        <Button onClick={handleEditItems} variant="secondary">
                                            Edit Items
                                        </Button>
                                        <Button onClick={handleSubmitBid} className="bg-accent text-white hover:bg-accent/90">
                                            Submit Bid
                                        </Button>
                                    </>
                                )}
                                {selectedBid?.status === 'submitted' && (
                                    <Button onClick={handleWithdrawBid} variant="destructive">
                                        Withdraw Bid
                                    </Button>
                                )}
                                <Button
                                    variant="ghost"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => selectedBid && handleDeleteBid(selectedBid.id)}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Bid
                                </Button>
                                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                                    Close
                                </Button>
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={alertConfig.isOpen} onOpenChange={(open) => {
                if (!open) setAlertConfig(prev => ({ ...prev, isOpen: false }));
            }}>
                <AlertDialogContent className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{alertConfig.title}</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-500 dark:text-gray-400">
                            {alertConfig.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                alertConfig.onConfirm();
                                setAlertConfig(prev => ({ ...prev, isOpen: false }));
                            }}
                            className={cn(alertConfig.variant === 'destructive' ? "bg-red-600 hover:bg-red-700 focus:ring-red-600 border-none" : "bg-accent hover:bg-accent/90 text-accent-foreground")}
                        >
                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default BidManagement;
