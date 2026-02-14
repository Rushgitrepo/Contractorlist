import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Subcontractor dashboard/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Subcontractor dashboard/ui/card';
import { Button } from '@/components/Subcontractor dashboard/ui/button';
import { Input } from '@/components/Subcontractor dashboard/ui/input';
import { Badge } from '@/components/Subcontractor dashboard/ui/badge';
import { Label } from '@/components/Subcontractor dashboard/ui/label';
import {
    Search,
    MapPin,
    Star,
    Users,
    Truck,
    ShieldCheck,
    Grid3x3,
    List as ListIcon,
    Phone,
    Mail,
    MoreVertical,
    Plus,
    Loader2,
    Package,
    Calendar,
    AlertCircle,
    ChevronDown,
    Briefcase,
    CheckCircle2,
    Building2,
    Award,
    Clock,
    Shield,
    Sparkles,
    Languages,
    DollarSign,
    CheckCircle,
    Wrench
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { companyService, CompanySearchFilters } from '@/api/companyService';
import { normalizeCompanyData } from '@/utils/normalizeCompany';
import { getProjectDiscovery } from '@/api/gc-apis/backend';
import FilterAccordion from '@/components/Subcontractor dashboard/FilterAccordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Subcontractor dashboard/ui/select';

// Internal Components for GCs, Subcontractors and Suppliers
const GCList = ({ filters }: { filters: any }) => {
    const { data: companies = [], isLoading } = useQuery<any[]>({
        queryKey: ['directory-gcs', filters],
        queryFn: async () => {
            const apiFilters: CompanySearchFilters = {
                search: filters.searchQuery || undefined,
                location: filters.location || undefined,
                professional_category: filters.professionalCategory || "General Contractors",
                budget: filters.budget || undefined,
                rating: filters.rating || undefined,
                verified_license: filters.verifiedLicense || undefined,
                responds_quickly: filters.respondsQuickly || undefined,
                hired_on_platform: filters.hiredOnPlatform || undefined,
                language: filters.language || undefined,
                provides_3d_visualization: filters.provides3d || undefined,
                eco_friendly: filters.ecoFriendly || undefined,
                family_owned: filters.familyOwned || undefined,
                locally_owned: filters.locallyOwned || undefined,
                offers_custom_work: filters.offersCustomWork || undefined,
                limit: 50
            };
            const response = await companyService.searchCompanies(apiFilters);
            if (response.success) {
                return response.data.map((item: any) => normalizeCompanyData(item.company || item));
            }
            return [];
        }
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-xl bg-muted/10">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Finding top general contractors...</p>
            </div>
        );
    }

    if (companies.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-xl bg-muted/10 p-8 text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-lg font-semibold">No General Contractors Found</h3>
                <p className="text-sm text-muted-foreground max-w-xs mt-1">Try broadening your search criteria or checking back later.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {companies.map((c: any) => (
                <Card key={c.id || c.name} className="group hover:shadow-md transition-all border-border overflow-hidden">
                    <CardHeader className="p-5 pb-3">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {(c.name || "GC").substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="font-bold text-base truncate max-w-[150px] group-hover:text-primary transition-colors">{c.name}</h4>
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <MapPin size={12} /> {c.location || 'Location Not Specified'}
                                    </div>
                                </div>
                            </div>
                            {c.verified && (
                                <Badge className="bg-primary/10 text-primary-foreground border-none h-5 px-1.5 font-black tracking-widest text-[10px]">
                                    <ShieldCheck size={12} className="mr-1" /> VERIFIED
                                </Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-5 pt-0 flex flex-col gap-4">
                        <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1 text-warning">
                                <Star size={12} className="fill-current" /> {c.rating || 'N/A'} <span className="text-muted-foreground">({c.reviews || 0})</span>
                            </div>
                            <div className="text-muted-foreground">•</div>
                            <div className="text-muted-foreground">
                                {c.projects || 0} Projects
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                            {(c.specialties || ['General Contracting']).slice(0, 3).map((s: string) => (
                                <Badge key={s} variant="secondary" className="text-[10px] font-medium h-5 bg-muted">
                                    {s}
                                </Badge>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-border flex items-center justify-between">
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Phone size={14} className="text-muted-foreground" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Mail size={14} className="text-muted-foreground" />
                                </Button>
                            </div>
                            <Button size="sm" variant="outline" className="h-8 text-xs font-semibold">
                                View Profile
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

const SubcontractorList = ({ filters }: { filters: any }) => {
    const { data: contractors = [], isLoading } = useQuery<any[]>({
        queryKey: ['directory-subcontractors', filters],
        queryFn: async () => {
            const apiFilters: CompanySearchFilters = {
                search: filters.searchQuery || undefined,
                location: filters.location || undefined,
                service: filters.trade !== 'All Trades' ? filters.trade : undefined,
                rating: filters.minRating || undefined,
                verified_license: filters.hasLicense || undefined,
                limit: 50
            };
            const response = await companyService.searchCompanies(apiFilters);
            if (response.success) {
                return response.data.map((item: any) => normalizeCompanyData(item.company || item));
            }
            return [];
        }
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-xl bg-muted/10">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Identifying premium partners...</p>
            </div>
        );
    }

    if (contractors.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-xl bg-muted/10 p-8 text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-lg font-semibold">No Subcontractors Found</h3>
                <p className="text-sm text-muted-foreground max-w-xs mt-1">Try broadening your search criteria.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {contractors.map((c: any) => (
                <Card key={c.id} className="group hover:shadow-md transition-all border-border overflow-hidden">
                    <CardHeader className="p-5 pb-3">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {(c.name || "SC").substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="font-bold text-base truncate max-w-[150px] group-hover:text-primary transition-colors">{c.name}</h4>
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <MapPin size={12} /> {c.location || 'Location Not Specified'}
                                    </div>
                                </div>
                            </div>
                            {c.verified && (
                                <Badge className="bg-primary/10 text-primary-foreground border-none h-5 px-1.5 font-black tracking-widest text-[10px]">
                                    <ShieldCheck size={12} className="mr-1" /> VERIFIED
                                </Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-5 pt-0 flex flex-col gap-4">
                        <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1 text-warning">
                                <Star size={12} className="fill-current" /> {c.rating || 'N/A'} <span className="text-muted-foreground">({c.reviews || 0})</span>
                            </div>
                            <div className="text-muted-foreground">•</div>
                            <div className="text-muted-foreground">
                                {c.projects || 0} Projects
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                            {(c.specialties || ['General Contracting']).slice(0, 3).map((s: string) => (
                                <Badge key={s} variant="secondary" className="text-[10px] font-medium h-5 bg-muted">
                                    {s}
                                </Badge>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-border flex items-center justify-between">
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Phone size={14} className="text-muted-foreground" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Mail size={14} className="text-muted-foreground" />
                                </Button>
                            </div>
                            <Button size="sm" variant="outline" className="h-8 text-xs font-semibold">
                                View Profile
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

const SupplierList = ({ filters }: { filters: any }) => {
    const { data: suppliers = [], isLoading } = useQuery<any[]>({
        queryKey: ['directory-suppliers', filters],
        queryFn: async () => {
            const apiFilters: CompanySearchFilters = {
                search: filters.searchQuery || undefined,
                location: filters.location || undefined,
                professional_category: "Suppliers",
                limit: 50
            };
            const response = await companyService.searchCompanies(apiFilters);
            if (response.success) {
                return response.data.map((item: any) => normalizeCompanyData(item.company || item));
            }
            return [];
        }
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-xl bg-muted/10">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Mapping supply chain partners...</p>
            </div>
        );
    }

    if (suppliers.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-xl bg-muted/10 p-8 text-center">
                <Package className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-lg font-semibold">No Suppliers Found</h3>
                <p className="text-sm text-muted-foreground max-w-xs mt-1">Try broadening your search criteria.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {suppliers.map((s: any) => (
                <Card key={s.id} className="group hover:shadow-md transition-all border-border overflow-hidden">
                    <CardHeader className="p-5 pb-3">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold uppercase">
                                    {(s.name || "SUP").substring(0, 2)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-base truncate max-w-[200px] group-hover:text-primary transition-colors">{s.name}</h4>
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <MapPin size={12} /> {s.location || 'Location Not Specified'}
                                    </div>
                                </div>
                            </div>
                            <Badge variant="outline" className="text-[10px] h-5 border-primary/20 text-primary bg-primary/5 font-bold uppercase tracking-widest px-1.5">
                                {s.status || 'Verified'}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-5 pt-0 flex flex-col gap-4">
                        <div className="flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-1 text-warning">
                                <Star size={12} className="fill-current" /> {s.rating || 'N/A'}
                            </div>
                            <div className="text-muted-foreground">•</div>
                            <div className="text-muted-foreground flex items-center gap-1">
                                <Truck size={12} /> Delivery Available
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Inventory Availability</p>
                            <div className="flex flex-wrap gap-1">
                                {(s.inventory || ['Materials']).slice(0, 5).map((item: string) => (
                                    <Badge key={item} variant="secondary" className="text-[10px] font-medium h-5 bg-muted">
                                        {item}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border flex items-center justify-between">
                            <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                                <Plus size={14} /> Compare Pricing
                            </Button>
                            <Button size="sm" className="h-8 px-4 text-xs font-semibold">
                                Request Quote
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

const DirectoryPage = () => {
    const { user } = useAppSelector((state) => state.auth);
    const [searchParams, setSearchParams] = useSearchParams();
    const isGC = user?.role === 'gc';

    // Default tab based on user role
    const defaultTab = isGC ? 'sc' : 'gc';
    const currentTab = (searchParams.get('tab') as 'sc' | 'suppliers' | 'gc') || defaultTab;

    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState('Austin, TX');

    // --- Subcontractor Filter States ---
    const [selectedTrade, setSelectedTrade] = useState<string>('All Trades');
    const [scState, setScState] = useState('');
    const [scCity, setScCity] = useState('');
    const [scRadius, setScRadius] = useState('');
    const [scMinRating, setScMinRating] = useState<number>(0);
    const [scHasLicense, setScHasLicense] = useState(false);
    const [scHasInsurance, setScHasInsurance] = useState(false);
    const [scAvailability, setScAvailability] = useState<string[]>([]);
    const [scExperience, setScExperience] = useState('');
    const [scCategories, setScCategories] = useState<string[]>([]);

    // --- Supplier Filter States ---
    const [supplierCategory, setSupplierCategory] = useState<string>('All Materials');
    const [supState, setSupState] = useState('');
    const [supCity, setSupCity] = useState('');
    const [supRadius, setSupRadius] = useState('');
    const [supMinRating, setSupMinRating] = useState<number>(0);
    const [supDelivery, setSupDelivery] = useState<string[]>([]);
    const [supInventory, setSupInventory] = useState<string[]>([]);

    // --- GC (General Contractor) Filter States ---
    const [gcProfessionalCategory, setGcProfessionalCategory] = useState<string>('General Contractors');
    const [gcBudget, setGcBudget] = useState<string>('');
    const [gcMinRating, setGcMinRating] = useState<number>(0);
    const [gcVerifiedLicense, setGcVerifiedLicense] = useState(false);
    const [gcRespondsQuickly, setGcRespondsQuickly] = useState(false);
    const [gcHiredOnPlatform, setGcHiredOnPlatform] = useState(false);
    const [gcLanguage, setGcLanguage] = useState<string>('');
    const [gcProvides3d, setGcProvides3d] = useState(false);
    const [gcEcoFriendly, setGcEcoFriendly] = useState(false);
    const [gcFamilyOwned, setGcFamilyOwned] = useState(false);
    const [gcLocallyOwned, setGcLocallyOwned] = useState(false);
    const [gcOffersCustomWork, setGcOffersCustomWork] = useState(false);

    const scFilters = {
        searchQuery,
        location,
        trade: selectedTrade,
        state: scState,
        city: scCity,
        radius: scRadius,
        minRating: scMinRating,
        hasLicense: scHasLicense,
        hasInsurance: scHasInsurance,
        availability: scAvailability,
        experience: scExperience,
        categories: scCategories
    };

    const supFilters = {
        searchQuery,
        location,
        category: supplierCategory,
        state: supState,
        city: supCity,
        radius: supRadius,
        minRating: supMinRating,
        delivery: supDelivery,
        inventory: supInventory,
    };

    const gcFilters = {
        searchQuery,
        location,
        professionalCategory: gcProfessionalCategory,
        budget: gcBudget,
        rating: gcMinRating,
        verifiedLicense: gcVerifiedLicense,
        respondsQuickly: gcRespondsQuickly,
        hiredOnPlatform: gcHiredOnPlatform,
        language: gcLanguage,
        provides3d: gcProvides3d,
        ecoFriendly: gcEcoFriendly,
        familyOwned: gcFamilyOwned,
        locallyOwned: gcLocallyOwned,
        offersCustomWork: gcOffersCustomWork,
    };

    const handleResetFilters = () => {
        setSearchQuery('');
        setLocation('Austin, TX');
        if (currentTab === 'sc') {
            setSelectedTrade('All Trades');
            setScState('');
            setScCity('');
            setScRadius('');
            setScMinRating(0);
            setScHasLicense(false);
            setScHasInsurance(false);
            setScAvailability([]);
            setScExperience('');
            setScCategories([]);
        } else if (currentTab === 'suppliers') {
            setSupplierCategory('All Materials');
            setSupState('');
            setSupCity('');
            setSupRadius('');
            setSupMinRating(0);
            setSupDelivery([]);
            setSupInventory([]);
        } else if (currentTab === 'gc') {
            setGcProfessionalCategory('General Contractors');
            setGcBudget('');
            setGcMinRating(0);
            setGcVerifiedLicense(false);
            setGcRespondsQuickly(false);
            setGcHiredOnPlatform(false);
            setGcLanguage('');
            setGcProvides3d(false);
            setGcEcoFriendly(false);
            setGcFamilyOwned(false);
            setGcLocallyOwned(false);
            setGcOffersCustomWork(false);
        }
    };

    return (
        <div className="p-6 animate-fade-in flex flex-col h-full overflow-hidden subcontractor-dashboard-theme">
            {/* Page Header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground font-black tracking-tight uppercase">Partner Directory</h1>
                    <p className="text-sm text-muted-foreground mt-1 font-medium">
                        Manage and discover verified partners, subcontractors and material suppliers in your network.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder={`Search ${currentTab === 'sc' ? 'subcontractors' : currentTab === 'suppliers' ? 'suppliers' : 'general contractors'}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-background border-border h-10 text-sm rounded-xl"
                        />
                    </div>
                    <div className="relative w-40">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-3.5 h-3.5" />
                        <Input
                            placeholder="Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="pl-8 bg-background border-border h-10 text-xs font-medium rounded-xl"
                        />
                    </div>
                </div>
            </div>

            {/* Directory Selection Tabs */}
            <div className="mb-6 bg-card border border-border rounded-xl px-4 h-14 flex items-center justify-between shadow-sm">
                <Tabs value={currentTab} onValueChange={(val) => setSearchParams({ tab: val })} className="h-full">
                    <TabsList className="bg-transparent h-full gap-8 p-0">
                        {!isGC && (
                            <TabsTrigger
                                value="gc"
                                className="h-full border-b-2 border-transparent rounded-none data-[state=active]:border-primary data-[state=active]:bg-transparent bg-transparent px-2 font-black uppercase text-xs tracking-tight transition-all"
                            >
                                <Building2 size={16} className="mr-2" /> General Contractors
                            </TabsTrigger>
                        )}
                        <TabsTrigger
                            value="sc"
                            className="h-full border-b-2 border-transparent rounded-none data-[state=active]:border-primary data-[state=active]:bg-transparent bg-transparent px-2 font-black uppercase text-xs tracking-tight transition-all"
                        >
                            <Users size={16} className="mr-2" /> Subcontractors
                        </TabsTrigger>
                        <TabsTrigger
                            value="suppliers"
                            className="h-full border-b-2 border-transparent rounded-none data-[state=active]:border-primary data-[state=active]:bg-transparent bg-transparent px-2 font-black uppercase text-xs tracking-tight transition-all"
                        >
                            <Truck size={16} className="mr-2" /> Suppliers
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="hidden md:flex items-center gap-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        Verified Partners
                    </div>
                </div>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Global Filter Sidebar */}
                <aside className="hidden xl:flex w-72 flex-col border border-border bg-card rounded-xl overflow-y-auto p-6 custom-scrollbar shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-sm font-black tracking-tight uppercase">Filters</h3>
                        <button
                            onClick={handleResetFilters}
                            className="text-[10px] font-black uppercase text-primary hover:underline hover:text-primary/80 transition-all"
                        >
                            Reset All
                        </button>
                    </div>

                    <div className="space-y-2">
                        {currentTab === 'gc' ? (
                            <>
                                {/* Professional Category */}
                                <FilterAccordion title="Professional Category" icon={<Briefcase className="w-4 h-4 text-muted-foreground" />}>
                                    <Select value={gcProfessionalCategory} onValueChange={setGcProfessionalCategory}>
                                        <SelectTrigger className="w-full h-10 border-border bg-background text-xs font-bold rounded-xl">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[
                                                "Architects & Building Designers",
                                                "Design-Build Firms",
                                                "General Contractors",
                                                "Home Builders",
                                                "Interior Designers & Decorators",
                                            ].map(cat => (
                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FilterAccordion>

                                {/* Budget */}
                                <FilterAccordion title="Budget" icon={<DollarSign className="w-4 h-4 text-muted-foreground" />}>
                                    <div className="space-y-2">
                                        {[
                                            { value: "$$$$ - I want the best results", label: "Premium" },
                                            { value: "$$$ - Mid-to-high price", label: "Mid-to-High" },
                                            { value: "$$ - Low-to-mid price", label: "Low-to-Mid" },
                                            { value: "$ - I want to minimize costs", label: "Budget-Friendly" },
                                        ].map((item) => (
                                            <div
                                                key={item.value}
                                                className={cn(
                                                    "flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer group",
                                                    gcBudget === item.value ? "bg-primary/5 border-primary" : "hover:bg-muted/50 border-transparent"
                                                )}
                                                onClick={() => setGcBudget(item.value === gcBudget ? '' : item.value)}
                                            >
                                                <span className="text-xs font-bold text-foreground">{item.label}</span>
                                                <span className="text-[10px] font-black text-muted-foreground group-hover:text-primary transition-colors">{item.value.split(' ')[0]}</span>
                                            </div>
                                        ))}
                                    </div>
                                </FilterAccordion>

                                {/* Business Highlights */}
                                <FilterAccordion title="Highlights" icon={<Sparkles className="w-4 h-4 text-muted-foreground" />}>
                                    <div className="space-y-3">
                                        {[
                                            { label: "Verified License", checked: gcVerifiedLicense, setter: setGcVerifiedLicense },
                                            { label: "Responds Quickly", checked: gcRespondsQuickly, setter: setGcRespondsQuickly },
                                            { label: "Hired on Platform", checked: gcHiredOnPlatform, setter: setGcHiredOnPlatform },
                                            { label: "Provides 3D", checked: gcProvides3d, setter: setGcProvides3d },
                                            { label: "Eco-friendly", checked: gcEcoFriendly, setter: setGcEcoFriendly },
                                            { label: "Locally Owned", checked: gcLocallyOwned, setter: setGcLocallyOwned },
                                            { label: "Offers Custom Work", checked: gcOffersCustomWork, setter: setGcOffersCustomWork },
                                        ].map(item => (
                                            <div key={item.label} className="flex items-center group cursor-pointer" onClick={() => item.setter(!item.checked)}>
                                                <div className={cn(
                                                    "w-4 h-4 rounded border flex items-center justify-center transition-all mr-3",
                                                    item.checked ? "bg-primary border-primary text-primary-foreground" : "border-border group-hover:border-primary/50"
                                                )}>
                                                    {item.checked && <CheckCircle2 className="w-3 h-3" />}
                                                </div>
                                                <span className={cn("text-xs font-bold transition-all", item.checked ? "text-foreground" : "text-muted-foreground group-hover:pl-0.5")}>{item.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </FilterAccordion>

                                <FilterAccordion title="Languages" icon={<Languages className="w-4 h-4 text-muted-foreground" />}>
                                    <Select value={gcLanguage} onValueChange={setGcLanguage}>
                                        <SelectTrigger className="w-full h-10 border-border bg-background text-xs font-bold rounded-xl">
                                            <SelectValue placeholder="Select Language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['English', 'Spanish', 'Russian', 'Italian'].map(lang => (
                                                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FilterAccordion>

                                <FilterAccordion title="Rating" icon={<Star className="w-4 h-4 text-muted-foreground" />}>
                                    <div className="space-y-2">
                                        {[5, 4, 3].map(r => (
                                            <div key={r} className="flex items-center group cursor-pointer" onClick={() => setGcMinRating(r === gcMinRating ? 0 : r)}>
                                                <div className={cn(
                                                    "w-4 h-4 rounded border flex items-center justify-center transition-all mr-3",
                                                    gcMinRating === r ? "bg-primary border-primary text-primary-foreground" : "border-border group-hover:border-primary/50"
                                                )}>
                                                    {gcMinRating === r && <CheckCircle2 className="w-3 h-3" />}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {[...Array(r)].map((_, i) => <Star key={i} className="w-3 h-3 fill-primary text-primary" />)}
                                                    <span className="text-[10px] font-black text-muted-foreground ml-1">& Up</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </FilterAccordion>
                            </>
                        ) : currentTab === 'sc' ? (
                            <>
                                <FilterAccordion title="Trade" icon={<Briefcase className="w-4 h-4 text-muted-foreground" />}>
                                    <Select value={selectedTrade} onValueChange={setSelectedTrade}>
                                        <SelectTrigger className="w-full h-10 border-border bg-background text-xs font-bold rounded-xl">
                                            <SelectValue placeholder="Select Trade" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['All Trades', 'Electrical', 'Plumbing', 'HVAC', 'Roofing', 'Masonry', 'Framing', 'Painting'].map(t => (
                                                <SelectItem key={t} value={t}>{t}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FilterAccordion>

                                <FilterAccordion title="Region" icon={<MapPin className="w-4 h-4 text-muted-foreground" />}>
                                    <div className="space-y-3">
                                        <Select value={scState} onValueChange={setScState}>
                                            <SelectTrigger className="w-full h-10 border-border bg-background text-xs font-bold rounded-xl">
                                                <SelectValue placeholder="Select State" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="TX">Texas</SelectItem>
                                                <SelectItem value="CA">California</SelectItem>
                                                <SelectItem value="NY">New York</SelectItem>
                                                <SelectItem value="FL">Florida</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            placeholder="City"
                                            value={scCity}
                                            onChange={(e) => setScCity(e.target.value)}
                                            className="h-10 border-border bg-background text-xs font-bold rounded-xl"
                                        />
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                placeholder="Radius"
                                                value={scRadius}
                                                onChange={(e) => setScRadius(e.target.value)}
                                                className="h-10 border-border bg-background text-xs font-bold rounded-xl"
                                            />
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Miles</span>
                                        </div>
                                    </div>
                                </FilterAccordion>

                                <FilterAccordion title="Availability" icon={<Clock className="w-4 h-4 text-muted-foreground" />}>
                                    <div className="space-y-3">
                                        {['Available Now', 'Accepting Bids', 'Busy'].map(status => (
                                            <div key={status} className="flex items-center group cursor-pointer" onClick={() => {
                                                setScAvailability(prev => prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]);
                                            }}>
                                                <div className={cn(
                                                    "w-4 h-4 rounded border flex items-center justify-center transition-all mr-3",
                                                    scAvailability.includes(status) ? "bg-primary border-primary text-primary-foreground" : "border-border group-hover:border-primary/50"
                                                )}>
                                                    {scAvailability.includes(status) && <CheckCircle2 className="w-3 h-3" />}
                                                </div>
                                                <span className={cn("text-xs font-bold transition-all", scAvailability.includes(status) ? "text-foreground" : "text-muted-foreground group-hover:pl-0.5")}>{status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </FilterAccordion>

                                <FilterAccordion title="Experience" icon={<Building2 className="w-4 h-4 text-muted-foreground" />}>
                                    <div className="space-y-2">
                                        {['Residential', 'Commercial', 'Industrial', 'Infrastructure'].map(exp => (
                                            <div key={exp} className="flex items-center group cursor-pointer" onClick={() => setScExperience(exp === scExperience ? '' : exp)}>
                                                <div className={cn(
                                                    "w-4 h-4 rounded border-full flex items-center justify-center transition-all mr-3",
                                                    scExperience === exp ? "bg-primary border-primary text-primary-foreground" : "border-border group-hover:border-primary/50"
                                                )}>
                                                    {scExperience === exp && <CheckCircle2 className="w-3 h-3" />}
                                                </div>
                                                <span className={cn("text-xs font-bold transition-all", scExperience === exp ? "text-foreground" : "text-muted-foreground group-hover:pl-0.5")}>{exp}</span>
                                            </div>
                                        ))}
                                    </div>
                                </FilterAccordion>

                                <FilterAccordion title="Compliance" icon={<ShieldCheck className="w-4 h-4 text-muted-foreground" />}>
                                    <div className="space-y-3">
                                        <div className="flex items-center group cursor-pointer" onClick={() => setScHasLicense(!scHasLicense)}>
                                            <div className={cn(
                                                "w-4 h-4 rounded border flex items-center justify-center transition-all mr-3",
                                                scHasLicense ? "bg-primary border-primary text-primary-foreground" : "border-border group-hover:border-primary/50"
                                            )}>
                                                {scHasLicense && <CheckCircle2 className="w-3 h-3" />}
                                            </div>
                                            <span className={cn("text-xs font-bold transition-all", scHasLicense ? "text-foreground" : "text-muted-foreground")}>Licensed</span>
                                        </div>
                                        <div className="flex items-center group cursor-pointer" onClick={() => setScHasInsurance(!scHasInsurance)}>
                                            <div className={cn(
                                                "w-4 h-4 rounded border flex items-center justify-center transition-all mr-3",
                                                scHasInsurance ? "bg-primary border-primary text-primary-foreground" : "border-border group-hover:border-primary/50"
                                            )}>
                                                {scHasInsurance && <CheckCircle2 className="w-3 h-3" />}
                                            </div>
                                            <span className={cn("text-xs font-bold transition-all", scHasInsurance ? "text-foreground" : "text-muted-foreground")}>Insured</span>
                                        </div>
                                    </div>
                                </FilterAccordion>

                                <FilterAccordion title="Rating" icon={<Star className="w-4 h-4 text-muted-foreground" />}>
                                    <div className="space-y-2">
                                        {[5, 4, 3].map(r => (
                                            <div key={r} className="flex items-center group cursor-pointer" onClick={() => setScMinRating(r === scMinRating ? 0 : r)}>
                                                <div className={cn(
                                                    "w-4 h-4 rounded border flex items-center justify-center transition-all mr-3",
                                                    scMinRating === r ? "bg-primary border-primary text-primary-foreground" : "border-border group-hover:border-primary/50"
                                                )}>
                                                    {scMinRating === r && <CheckCircle2 className="w-3 h-3" />}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {[...Array(r)].map((_, i) => <Star key={i} className="w-3 h-3 fill-primary text-primary" />)}
                                                    <span className="text-[10px] font-black text-muted-foreground ml-1">& Up</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </FilterAccordion>
                            </>
                        ) : (
                            <>
                                <FilterAccordion title="Category" icon={<Package className="w-4 h-4 text-muted-foreground" />}>
                                    <Select value={supplierCategory} onValueChange={setSupplierCategory}>
                                        <SelectTrigger className="w-full h-10 border-border bg-background text-xs font-bold rounded-xl">
                                            <SelectValue placeholder="Select Material" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['All Materials', 'Lumber', 'Concrete', 'Metals', 'Electrical', 'Plumbing', 'Roofing', 'Finishes'].map(m => (
                                                <SelectItem key={m} value={m}>{m}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FilterAccordion>

                                <FilterAccordion title="Region" icon={<MapPin className="w-4 h-4 text-muted-foreground" />}>
                                    <div className="space-y-3">
                                        <Input
                                            placeholder="City/State"
                                            value={supCity}
                                            onChange={(e) => setSupCity(e.target.value)}
                                            className="h-10 border-border bg-background text-xs font-bold rounded-xl"
                                        />
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                placeholder="Radius"
                                                value={supRadius}
                                                onChange={(e) => setSupRadius(e.target.value)}
                                                className="h-10 border-border bg-background text-xs font-bold rounded-xl"
                                            />
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Miles</span>
                                        </div>
                                    </div>
                                </FilterAccordion>

                                <FilterAccordion title="Delivery" icon={<Truck className="w-4 h-4 text-muted-foreground" />}>
                                    <div className="space-y-3">
                                        {['Local Delivery', 'Direct Shipping', 'Store Pickup'].map(status => (
                                            <div key={status} className="flex items-center group cursor-pointer" onClick={() => {
                                                setSupDelivery(prev => prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]);
                                            }}>
                                                <div className={cn(
                                                    "w-4 h-4 rounded border flex items-center justify-center transition-all mr-3",
                                                    supDelivery.includes(status) ? "bg-primary border-primary text-primary-foreground" : "border-border group-hover:border-primary/50"
                                                )}>
                                                    {supDelivery.includes(status) && <CheckCircle2 className="w-3 h-3" />}
                                                </div>
                                                <span className={cn("text-xs font-bold transition-all", supDelivery.includes(status) ? "text-foreground" : "text-muted-foreground")}>{status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </FilterAccordion>

                                <FilterAccordion title="Inventory Status" icon={<Package className="w-4 h-4 text-muted-foreground" />}>
                                    <div className="space-y-3">
                                        {['In Stock', 'Custom Order', 'Bulk Only'].map(status => (
                                            <div key={status} className="flex items-center group cursor-pointer" onClick={() => {
                                                setSupInventory(prev => prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]);
                                            }}>
                                                <div className={cn(
                                                    "w-4 h-4 rounded border flex items-center justify-center transition-all mr-3",
                                                    supInventory.includes(status) ? "bg-primary border-primary text-primary-foreground" : "border-border group-hover:border-primary/50"
                                                )}>
                                                    {supInventory.includes(status) && <CheckCircle2 className="w-3 h-3" />}
                                                </div>
                                                <span className={cn("text-xs font-bold transition-all", supInventory.includes(status) ? "text-foreground" : "text-muted-foreground")}>{status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </FilterAccordion>

                                <FilterAccordion title="Rating" icon={<Star className="w-4 h-4 text-muted-foreground" />}>
                                    <div className="space-y-2">
                                        {[5, 4, 3].map(r => (
                                            <div key={r} className="flex items-center group cursor-pointer" onClick={() => setSupMinRating(r === supMinRating ? 0 : r)}>
                                                <div className={cn(
                                                    "w-4 h-4 rounded border flex items-center justify-center transition-all mr-3",
                                                    supMinRating === r ? "bg-primary border-primary text-primary-foreground" : "border-border group-hover:border-primary/50"
                                                )}>
                                                    {supMinRating === r && <CheckCircle2 className="w-3 h-3" />}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {[...Array(r)].map((_, i) => <Star key={i} className="w-3 h-3 fill-primary text-primary" />)}
                                                    <span className="text-[10px] font-black text-muted-foreground ml-1">& Up</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </FilterAccordion>
                            </>
                        )}
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-hidden flex flex-col min-w-0">
                    {/* Active Filters Bar */}
                    <div className="mb-4 flex flex-wrap gap-2 items-center">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mr-2">Active:</span>
                        {currentTab === 'sc' && selectedTrade !== 'All Trades' && (
                            <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 transition-colors h-7 gap-1">
                                {selectedTrade} <Plus className="w-3 h-3 rotate-45 cursor-pointer" onClick={() => setSelectedTrade('All Trades')} />
                            </Badge>
                        )}
                        {/* More active filter badges could be added here */}
                        <div className="ml-auto flex items-center gap-4">
                            <div className="flex bg-muted/30 rounded-lg p-1 border border-border">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-primary rounded-md">
                                    <Grid3x3 size={16} />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-primary rounded-md">
                                    <ListIcon size={16} />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {currentTab === 'gc' ? (
                            <GCList filters={gcFilters} />
                        ) : currentTab === 'sc' ? (
                            <SubcontractorList filters={scFilters} />
                        ) : (
                            <SupplierList filters={supFilters} />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DirectoryPage;
