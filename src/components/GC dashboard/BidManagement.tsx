import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Gavel,
    Search,
    Filter,
    Plus,
    Clock,
    CheckCircle2,
    AlertCircle,
    FileText,
    DollarSign,
    Briefcase,
    ChevronRight,
    ArrowUpRight,
    Eye,
    UserCheck,
    PlayCircle,
    Calendar,
    MapPin,
    Building2,
    Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

type BidCycleStatus = 'submitted' | 'viewed' | 'accepted' | 'project_started';

interface Bid {
    id: string;
    project: string;
    contractor: string;
    contractorAvatar?: string;
    amount: string;
    status: BidCycleStatus;
    deadline: string;
    submittedDate: string;
    viewedDate?: string;
    acceptedDate?: string;
    projectStartDate?: string;
    confidence: number;
    items: number;
    location: string;
    projectType: string;
    clientName: string;
}

const BidManagement = () => {
    const [activeStage, setActiveStage] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const bids: Bid[] = [
        {
            id: "BID-90210",
            project: "Riverside Tech Complex",
            contractor: "Titan Concrete Pros",
            contractorAvatar: "TC",
            amount: "$245,000",
            status: "submitted",
            deadline: "2026-02-15",
            submittedDate: "2026-01-20",
            confidence: 94,
            items: 12,
            location: "Austin, TX",
            projectType: "Commercial",
            clientName: "TechCorp Industries"
        },
        {
            id: "BID-90211",
            project: "Downtown Plaza Renovation",
            contractor: "VoltMaster Electrical",
            contractorAvatar: "VE",
            amount: "$120,500",
            status: "viewed",
            deadline: "2026-02-10",
            submittedDate: "2026-01-18",
            viewedDate: "2026-01-22",
            confidence: 88,
            items: 8,
            location: "Houston, TX",
            projectType: "Renovation",
            clientName: "Metro Development"
        },
        {
            id: "BID-90212",
            project: "Oak Ridge Annex",
            contractor: "Structural Steel Inc",
            contractorAvatar: "SS",
            amount: "$890,000",
            status: "accepted",
            deadline: "2026-02-05",
            submittedDate: "2026-01-15",
            viewedDate: "2026-01-17",
            acceptedDate: "2026-01-25",
            confidence: 100,
            items: 24,
            location: "Dallas, TX",
            projectType: "Industrial",
            clientName: "Oak Ridge Corp"
        },
        {
            id: "BID-90213",
            project: "Luxury Residential Complex",
            contractor: "Elite Builders Group",
            contractorAvatar: "EB",
            amount: "$1,250,000",
            status: "project_started",
            deadline: "2026-01-30",
            submittedDate: "2026-01-10",
            viewedDate: "2026-01-12",
            acceptedDate: "2026-01-18",
            projectStartDate: "2026-01-20",
            confidence: 95,
            items: 35,
            location: "San Antonio, TX",
            projectType: "Residential",
            clientName: "Luxury Homes LLC"
        }
    ];

    const getStatusInfo = (status: BidCycleStatus) => {
        switch (status) {
            case 'submitted':
                return {
                    label: 'Bid Submitted',
                    icon: FileText,
                    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
                    borderColor: 'border-blue-200 dark:border-blue-800',
                    description: 'Waiting for client to view'
                };
            case 'viewed':
                return {
                    label: 'Client Viewed',
                    icon: Eye,
                    color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
                    borderColor: 'border-yellow-200 dark:border-yellow-800',
                    description: 'Client is reviewing your bid'
                };
            case 'accepted':
                return {
                    label: 'Bid Accepted',
                    icon: CheckCircle2,
                    color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
                    borderColor: 'border-green-200 dark:border-green-800',
                    description: 'Client accepted your bid'
                };
            case 'project_started':
                return {
                    label: 'Project Started',
                    icon: PlayCircle,
                    color: 'bg-accent/20 dark:bg-accent/30 text-accent dark:text-accent',
                    borderColor: 'border-accent/30 dark:border-accent/50',
                    description: 'Project is now active'
                };
        }
    };

    const getCycleProgress = (bid: Bid) => {
        const steps = [
            { key: 'submitted', label: 'Submitted', completed: true },
            { key: 'viewed', label: 'Viewed', completed: bid.status !== 'submitted' },
            { key: 'accepted', label: 'Accepted', completed: bid.status === 'accepted' || bid.status === 'project_started' },
            { key: 'project_started', label: 'Started', completed: bid.status === 'project_started' }
        ];
        return steps;
    };

    const filteredBids = bids.filter(bid => {
        const matchesSearch = bid.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bid.contractor.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bid.clientName.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (activeStage === 'all') return matchesSearch;
        if (activeStage === 'active') return matchesSearch && (bid.status === 'submitted' || bid.status === 'viewed');
        if (activeStage === 'accepted') return matchesSearch && (bid.status === 'accepted' || bid.status === 'project_started');
        return matchesSearch;
    });

    return (
        <div className="flex-1 w-full bg-white dark:bg-[#0f1115] text-gray-900 dark:text-white pb-20">
            <div className="bg-gray-50/50 dark:bg-[#1c1e24]/50 border-b border-gray-200 dark:border-white/5 px-8 py-10 mb-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                            <Gavel className="w-8 h-8 text-accent" />
                            Bid Management
                        </h1>
                        <p className="text-gray-500 font-bold text-sm mt-1">Track, evaluate, and award project bids</p>
                    </div>
                    <Button className="bg-black dark:bg-accent text-white dark:text-accent-foreground font-black uppercase text-xs tracking-widest rounded-xl px-8 h-12 shadow-xl hover:bg-accent/90 transition-all">
                        <Plus className="w-4 h-4 mr-2" /> Invite New Bids
                    </Button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        { label: 'Active Bids', value: '18', icon: Clock, color: 'text-accent' },
                        { label: 'Under Review', value: '05', icon: Filter, color: 'text-gray-900 dark:text-white' },
                        { label: 'Total Value', value: '$3.4M', icon: DollarSign, color: 'text-accent' }
                    ].map(stat => (
                        <Card key={stat.label} className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5 rounded-[2rem] p-6">
                            <div className="flex items-center gap-4">
                                <div className={cn("p-3 rounded-2xl bg-gray-100 dark:bg-white/5", stat.color)}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{stat.label}</p>
                                    <p className="text-3xl font-black">{stat.value}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="bg-white dark:bg-[#1c1e24] border border-gray-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden">
                    <div className="p-8 border-b border-gray-50 dark:border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex-1 max-w-md relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search bids by contractor, project, or client..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-12 bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 rounded-2xl font-bold"
                            />
                        </div>
                        <div className="flex gap-2 p-1 bg-gray-50 dark:bg-black/20 rounded-xl">
                            {[
                                { key: 'all', label: 'All Bids' },
                                { key: 'active', label: 'Active' },
                                { key: 'accepted', label: 'Accepted' }
                            ].map(stage => (
                                <button
                                    key={stage.key}
                                    onClick={() => setActiveStage(stage.key)}
                                    className={cn(
                                        "px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                                        activeStage === stage.key ? "bg-white dark:bg-accent text-black shadow-md" : "text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                    )}
                                >
                                    {stage.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 space-y-4">
                        {filteredBids.length === 0 ? (
                            <div className="text-center py-12">
                                <Gavel className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400 font-semibold">No bids found</p>
                            </div>
                        ) : (
                            filteredBids.map(bid => {
                                const statusInfo = getStatusInfo(bid.status);
                                const StatusIcon = statusInfo.icon;
                                const cycleSteps = getCycleProgress(bid);

                                return (
                                    <Card key={bid.id} className="group bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5 hover:border-accent/30 dark:hover:border-accent/20 transition-all duration-300 overflow-hidden">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col lg:flex-row gap-6">
                                                {/* Left Section - Project Info */}
                                                <div className="flex-1 space-y-4">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 dark:from-accent/30 dark:to-accent/20 flex items-center justify-center text-accent font-black text-sm border border-accent/20 shrink-0">
                                                            {bid.contractorAvatar || bid.id.split('-')[1]}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h3 className="font-black text-lg text-gray-900 dark:text-white truncate">
                                                                    {bid.project}
                                                                </h3>
                                                                <Badge className={cn(
                                                                    "rounded-lg px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border",
                                                                    statusInfo.color,
                                                                    statusInfo.borderColor
                                                                )}>
                                                                    <StatusIcon className="w-3 h-3 mr-1 inline" />
                                                                    {statusInfo.label}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                                                {bid.contractor}
                                                            </p>
                                                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                                                <div className="flex items-center gap-1.5">
                                                                    <MapPin className="w-3.5 h-3.5" />
                                                                    <span>{bid.location}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1.5">
                                                                    <Building2 className="w-3.5 h-3.5" />
                                                                    <span>{bid.projectType}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1.5">
                                                                    <Users className="w-3.5 h-3.5" />
                                                                    <span>{bid.clientName}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Contractor Cycle Timeline */}
                                                    <div className="pt-4 border-t border-gray-100 dark:border-white/5">
                                                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
                                                            Contractor Cycle
                                                        </p>
                                                        <div className="flex items-center gap-2">
                                                            {cycleSteps.map((step, index) => {
                                                                const isLast = index === cycleSteps.length - 1;
                                                                const StepIcon = getStatusInfo(step.key as BidCycleStatus).icon;
                                                                
                                                                return (
                                                                    <div key={step.key} className="flex items-center flex-1">
                                                                        <div className="flex flex-col items-center flex-1">
                                                                            <div className={cn(
                                                                                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                                                                step.completed
                                                                                    ? "bg-accent/20 border-accent text-accent"
                                                                                    : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-400"
                                                                            )}>
                                                                                <StepIcon className={cn(
                                                                                    "w-4 h-4",
                                                                                    step.completed ? "text-accent" : "text-gray-400"
                                                                                )} />
                                                                            </div>
                                                                            <p className={cn(
                                                                                "text-[10px] font-bold mt-2 text-center",
                                                                                step.completed ? "text-gray-900 dark:text-white" : "text-gray-400"
                                                                            )}>
                                                                                {step.label}
                                                                            </p>
                                                                            {step.completed && (
                                                                                <p className="text-[9px] text-gray-500 dark:text-gray-400 mt-1">
                                                                                    {step.key === 'submitted' && bid.submittedDate}
                                                                                    {step.key === 'viewed' && bid.viewedDate}
                                                                                    {step.key === 'accepted' && bid.acceptedDate}
                                                                                    {step.key === 'project_started' && bid.projectStartDate}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                        {!isLast && (
                                                                            <div className={cn(
                                                                                "h-0.5 flex-1 mx-2 transition-all duration-300",
                                                                                cycleSteps[index + 1].completed
                                                                                    ? "bg-accent"
                                                                                    : "bg-gray-200 dark:bg-gray-700"
                                                                            )} />
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right Section - Bid Details */}
                                                <div className="lg:w-64 space-y-4 border-l border-gray-100 dark:border-white/5 pl-6">
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                                                            Bid Amount
                                                        </p>
                                                        <p className="text-2xl font-black text-gray-900 dark:text-white">
                                                            {bid.amount}
                                                        </p>
                                                        <p className="text-[10px] font-semibold text-gray-400 mt-1">
                                                            {bid.items} Line Items
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <div className="flex items-center justify-between mb-2">
                                                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                AI Confidence
                                                            </p>
                                                            <span className="text-xs font-black text-gray-900 dark:text-white">
                                                                {bid.confidence}%
                                                            </span>
                                                        </div>
                                                        <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-accent rounded-full transition-all duration-500"
                                                                style={{ width: `${bid.confidence}%` }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="pt-2">
                                                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                                                            {statusInfo.description}
                                                        </p>
                                                        <Button 
                                                            variant="outline" 
                                                            className="w-full rounded-xl h-10 border-accent/20 hover:bg-accent hover:text-black dark:hover:text-accent-foreground font-semibold"
                                                        >
                                                            View Details
                                                            <ArrowUpRight className="w-4 h-4 ml-2" />
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
                </div>
            </div>
        </div>
    );
};

export default BidManagement;
