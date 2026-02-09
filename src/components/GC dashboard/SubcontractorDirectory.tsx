import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
    CheckCircle2,
    Grid3x3,
    List as ListIcon,
    AlertCircle,
    Briefcase,
    Award,
    FileText,
    CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { companyService } from '@/api/companyService';
import { normalizeCompanyData } from '@/utils/normalizeCompany';
import FilterAccordion from './FilterAccordion';

const SubcontractorDirectory = () => {
    const { toast } = useToast();
    const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
    const [selectedLocation, setSelectedLocation] = useState('Austin, TX');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedContractor, setSelectedContractor] = useState<any>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [sortBy, setSortBy] = useState('best');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [inviteMethod, setInviteMethod] = useState<'email' | 'sms' | 'both'>('both');
    const [selectedProjectForInvite, setSelectedProjectForInvite] = useState('');

    const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
    const [selectedTiers, setSelectedTiers] = useState<string[]>([]);

    // New Filters
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [radius, setRadius] = useState('');
    const [serviceArea, setServiceArea] = useState('');
    const [projectExperience, setProjectExperience] = useState('');
    const [hasLicense, setHasLicense] = useState(false);
    const [hasInsurance, setHasInsurance] = useState(false);
    const [selectedCerts, setSelectedCerts] = useState<string[]>([]);
    const [minRating, setMinRating] = useState<number>(0);
    const [selectedTrade, setSelectedTrade] = useState<string>('');

    const [contractors, setContractors] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        loadContractors();
    }, [
        searchQuery,
        selectedLocation,
        selectedCategory,
        selectedAvailability,
        selectedTiers,
        selectedState,
        selectedCity,
        radius,
        serviceArea,
        projectExperience,
        hasLicense,
        hasInsurance,
        selectedCerts,
        minRating,
        selectedTrade
    ]);

    const loadContractors = async () => {
        try {
            setIsLoading(true);
            const filters: any = {
                limit: 50
            };
            if (searchQuery) filters.search = searchQuery;
            if (selectedLocation && selectedLocation !== 'All Locations') filters.location = selectedLocation;
            if (selectedCategory.length > 0) filters.professional_category = selectedCategory[0];

            // Apply New Filters
            if (selectedState) filters.state = selectedState;
            if (selectedCity) filters.city = selectedCity;
            if (radius) filters.radius = radius;
            if (serviceArea) filters.serviceArea = serviceArea;
            if (projectExperience) filters.project_type = projectExperience;
            if (hasLicense) filters.verified_license = true;
            if (hasInsurance) filters.insured = true;
            if (selectedCerts.length > 0) filters.certifications = selectedCerts.join(',');
            if (minRating > 0) filters.rating = minRating;
            if (selectedTrade) filters.professional_category = selectedTrade;
            if (selectedAvailability.length > 0) filters.availability = selectedAvailability[0];

            const response = await companyService.searchCompanies(filters);

            // Exclude current user's company from the directory
            const filteredData = response.data.filter((item: any) => {
                const c = item.company || item;
                const companyName = c.name || c.company_name;
                return companyName !== user?.company;
            });

            // Map backend data to local structure
            const mappedData = filteredData.map((item: any) => {
                const c = normalizeCompanyData(item);
                return {
                    id: c.id,
                    name: c.name,
                    location: c.address || 'N/A',
                    distance: 'N/A',
                    rating: c.rating || 0,
                    reviews: c.reviewsCount || 0,
                    verified: c.verifiedBusiness || false,
                    tier: c.rating >= 4.5 ? 'Platinum' : c.rating >= 4.0 ? 'Gold' : c.rating >= 3.0 ? 'Silver' : 'Bronze',
                    specialties: c.specialties.length > 0 ? c.specialties : c.professionalCategory ? [c.professionalCategory] : [],
                    status: 'Available',
                    projects: c.verifiedHires || 0,
                    avatar: c.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
                    phone: c.phone || 'N/A',
                    email: c.email || 'N/A',
                    yearsExperience: c.yearsInBusiness || 0,
                    bonded: true, // Mocked for now as not in normalized data
                    insured: true  // Mocked for now as not in normalized data
                };
            });

            setContractors(mappedData);
        } catch (error) {
            console.error("Failed to load contractors", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredContractors = contractors; // Already filtered by backend if we pass params correctly

    const handleInvitationAction = () => {
        const methods = inviteMethod === 'both' ? 'Email and SMS' : inviteMethod.toUpperCase();
        toast({
            title: "Invitation Transmitted",
            description: `Successfully sent project signals to ${selectedContractor?.name} via ${methods}.`,
        });
        setIsInviteModalOpen(false);
    };

    const handleInvite = (contractor: any) => {
        setSelectedContractor(contractor);
        setIsInviteModalOpen(true);
    };

    const categories = [
        'Procurement & Contracting',
        'General Requirements',
        'Existing Conditions',
        'Concrete',
        'Masonry',
        'Metals',
        'Wood, Plastics & Composites',
        'Thermal & Moisture Protection',
        'Openings',
        'Finishes',
        'Specialties',
        'Equipment',
        'Furnishings',
        'Special Construction',
        'Conveying Equipment',
        'Fire Suppression',
        'Plumbing',
        'HVAC',
        'Integrated Automation',
        'Electrical',
        'Communications',
        'Electronic Safety & Security',
        'Earthwork',
        'Exterior Improvements',
        'Utilities',
        'Transportation',
        'Waterway & Marine',
        'Process Interconnections',
        'Material Processing',
        'Process Heating/Cooling',
        'Gas/Liquid Handling',
        'Pollution Control',
        'Electrical Power Generation'
    ];

    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'Platinum': return 'from-gray-700 to-gray-900 text-white';
            case 'Gold': return 'from-yellow-400 to-yellow-600 text-black';
            case 'Silver': return 'from-gray-300 to-gray-400 text-black';
            default: return 'from-yellow-700 to-yellow-800 text-white';
        }
    };

    return (
        <div className="flex h-full w-full flex-col overflow-hidden">
            <div className="relative border-b border-gray-200 dark:border-white/5 py-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4">
                    <div className="flex items-center gap-2 bg-white dark:bg-black/30 p-1 rounded-xl border border-gray-200 dark:border-white/5 shrink-0">
                        <button onClick={() => setViewMode('grid')} className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-yellow-400 text-black shadow-lg" : "text-gray-400 hover:text-black dark:hover:text-white")}>
                            <Grid3x3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setViewMode('list')} className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-yellow-400 text-black shadow-lg" : "text-gray-400 hover:text-black dark:hover:text-white")}>
                            <ListIcon className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row items-center flex-1 max-w-4xl gap-4 p-1 bg-white dark:bg-black/40 rounded-2xl border border-gray-200 dark:border-white/5 shadow-lg">
                        <div className="flex-1 relative w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search by name or trade..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-10 border-none bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 w-full"
                            />
                        </div>
                        <div className="hidden md:block w-[1px] h-5 bg-gray-200 dark:bg-white/10" />
                        <div className="w-full md:w-[180px] relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Location"
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="pl-10 h-10 border-none bg-transparent text-sm placeholder:text-gray-400 focus-visible:ring-0 w-full"
                            />
                        </div>
                        <Button className="h-10 px-6 bg-black dark:bg-yellow-500 text-white dark:text-black font-black uppercase text-xs tracking-tighter rounded-xl hover:bg-yellow-500 transition-all shrink-0">
                            Find Partners
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Dynamic Filter Sidebar */}
                <aside className="hidden xl:flex w-72 flex-col border-r border-gray-200 dark:border-white/5 bg-gray-50/30 dark:bg-black/20 overflow-y-auto p-6 custom-scrollbar">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black tracking-tight">FILTERS</h3>
                        <button
                            onClick={() => {
                                setSelectedCategory([]);
                                setSelectedAvailability([]);
                                setSelectedTiers([]);
                                setSearchQuery('');
                                setSelectedLocation('');
                                setSelectedState('');
                                setSelectedCity('');
                                setRadius('');
                                setServiceArea('');
                                setProjectExperience('');
                                setHasLicense(false);
                                setHasInsurance(false);
                                setSelectedCerts([]);
                                setMinRating(0);
                                setSelectedTrade('');
                            }}
                            className="text-[10px] font-black uppercase text-yellow-600 dark:text-yellow-500 hover:underline"
                        >
                            Reset
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Trade / Professional Category */}
                        <FilterAccordion title="Trade" icon={<Briefcase className="w-4 h-4 text-muted-foreground" />}>
                            <Select value={selectedTrade} onValueChange={setSelectedTrade}>
                                <SelectTrigger className="w-full h-10 border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 text-xs font-bold rounded-xl">
                                    <SelectValue placeholder="Select Trade" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All Trades">All Trades</SelectItem>
                                    <SelectItem value="Electrical">Electrical</SelectItem>
                                    <SelectItem value="Plumbing">Plumbing</SelectItem>
                                    <SelectItem value="HVAC">HVAC</SelectItem>
                                    <SelectItem value="Roofing">Roofing</SelectItem>
                                    <SelectItem value="Masonry">Masonry</SelectItem>
                                    <SelectItem value="Framing">Framing</SelectItem>
                                    <SelectItem value="Painting">Painting</SelectItem>
                                </SelectContent>
                            </Select>
                        </FilterAccordion>

                        {/* Location Details */}
                        <FilterAccordion title="Location" icon={<MapPin className="w-4 h-4 text-muted-foreground" />}>
                            <div className="space-y-3">
                                <Select value={selectedState} onValueChange={setSelectedState}>
                                    <SelectTrigger className="w-full h-10 border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 text-xs font-bold rounded-xl">
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
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    className="h-10 border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 text-xs font-bold rounded-xl"
                                />
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        placeholder="Radius"
                                        value={radius}
                                        onChange={(e) => setRadius(e.target.value)}
                                        className="h-10 border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 text-xs font-bold rounded-xl"
                                    />
                                    <span className="text-[10px] font-bold text-gray-400">Miles</span>
                                </div>
                            </div>
                        </FilterAccordion>

                        {/* Service Area */}
                        <FilterAccordion title="Service Area" icon={<MapPin className="w-4 h-4 text-muted-foreground" />}>
                            <Input
                                placeholder="E.g. Austin Metro"
                                value={serviceArea}
                                onChange={(e) => setServiceArea(e.target.value)}
                                className="h-10 border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 text-xs font-bold rounded-xl"
                            />
                        </FilterAccordion>

                        {/* Availability */}
                        <FilterAccordion title="Availability" icon={<CheckCircle2 className="w-4 h-4 text-muted-foreground" />}>
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
                        </FilterAccordion>

                        {/* Project Type Experience */}
                        <FilterAccordion title="Experience" icon={<Building2 className="w-4 h-4 text-muted-foreground" />}>
                            <Select value={projectExperience} onValueChange={setProjectExperience}>
                                <SelectTrigger className="w-full h-10 border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 text-xs font-bold rounded-xl">
                                    <SelectValue placeholder="Select Experience" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Residential">Residential</SelectItem>
                                    <SelectItem value="Commercial">Commercial</SelectItem>
                                    <SelectItem value="Industrial">Industrial</SelectItem>
                                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                                </SelectContent>
                            </Select>
                        </FilterAccordion>

                        {/* Licensing & Insurance */}
                        <FilterAccordion title="Licensing" icon={<ShieldCheck className="w-4 h-4 text-muted-foreground" />}>
                            <div className="space-y-4">
                                <div className="flex items-center group cursor-pointer" onClick={() => setHasLicense(!hasLicense)}>
                                    <div className={cn(
                                        "w-4 h-4 rounded border flex items-center justify-center transition-all mr-3",
                                        hasLicense ? "bg-yellow-500 border-yellow-500 text-black" : "border-gray-300 dark:border-white/10 group-hover:border-yellow-400"
                                    )}>
                                        {hasLicense && <CheckCircle2 className="w-3 h-3" />}
                                    </div>
                                    <span className={cn("text-xs font-bold transition-all", hasLicense ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400 group-hover:pl-1")}>Licensed Professional</span>
                                </div>
                                <div className="flex items-center group cursor-pointer" onClick={() => setHasInsurance(!hasInsurance)}>
                                    <div className={cn(
                                        "w-4 h-4 rounded border flex items-center justify-center transition-all mr-3",
                                        hasInsurance ? "bg-yellow-500 border-yellow-500 text-black" : "border-gray-300 dark:border-white/10 group-hover:border-yellow-400"
                                    )}>
                                        {hasInsurance && <CheckCircle2 className="w-3 h-3" />}
                                    </div>
                                    <span className={cn("text-xs font-bold transition-all", hasInsurance ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400 group-hover:pl-1")}>Insured & Bonded</span>
                                </div>
                            </div>
                        </FilterAccordion>

                        {/* Certifications */}
                        <FilterAccordion title="Certifications" icon={<Award className="w-4 h-4 text-muted-foreground" />}>
                            <div className="space-y-3">
                                {['OSHA 30', 'LEED AP', 'NABCEP', 'EPA Lead-Safe'].map(cert => (
                                    <div key={cert} className="flex items-center group cursor-pointer" onClick={() => {
                                        setSelectedCerts(prev => prev.includes(cert) ? prev.filter(c => c !== cert) : [...prev, cert]);
                                    }}>
                                        <div className={cn(
                                            "w-4 h-4 rounded border flex items-center justify-center transition-all mr-3",
                                            selectedCerts.includes(cert) ? "bg-yellow-500 border-yellow-500 text-black" : "border-gray-300 dark:border-white/10 group-hover:border-yellow-400"
                                        )}>
                                            {selectedCerts.includes(cert) && <CheckCircle2 className="w-3 h-3" />}
                                        </div>
                                        <span className={cn("text-xs font-bold transition-all", selectedCerts.includes(cert) ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400 group-hover:pl-1")}>{cert}</span>
                                    </div>
                                ))}
                            </div>
                        </FilterAccordion>

                        {/* Rating */}
                        <FilterAccordion title="Rating" icon={<Star className="w-4 h-4 text-muted-foreground" />}>
                            <div className="flex items-center gap-1.5 mt-2">
                                {[4.5, 4.0, 3.0, 0].map((rating) => (
                                    <button
                                        key={rating}
                                        onClick={() => setMinRating(rating)}
                                        className={cn(
                                            "flex-1 py-2 rounded-lg text-[10px] font-black border transition-all",
                                            minRating === rating
                                                ? "bg-yellow-400 border-yellow-400 text-black shadow-md"
                                                : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400 hover:border-yellow-400/50"
                                        )}
                                    >
                                        {rating === 0 ? 'Any' : `${rating}+`}
                                    </button>
                                ))}
                            </div>
                        </FilterAccordion>

                        <FilterAccordion title="CSI Divisions" defaultOpen={false} icon={<ListIcon className="w-4 h-4 text-muted-foreground" />}>
                            <div className="grid grid-cols-1 gap-2">
                                {(showAllCategories ? categories : categories.slice(0, 10)).map(cat => (
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
                                <Button
                                    variant="link"
                                    size="sm"
                                    onClick={(e) => { e.stopPropagation(); setShowAllCategories(!showAllCategories); }}
                                    className="h-auto p-0 text-[10px] font-black uppercase text-yellow-600 dark:text-yellow-500 hover:no-underline flex items-center gap-1 mt-2 w-fit"
                                >
                                    {showAllCategories ? 'Show Less' : `+${categories.length - 10} More Divisions`}
                                </Button>
                            </div>
                        </FilterAccordion>

                        <FilterAccordion title="Verification" icon={<ShieldCheck className="w-4 h-4 text-muted-foreground" />}>
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
                        </FilterAccordion>

                        <FilterAccordion title="Live Status" icon={<AlertCircle className="w-4 h-4 text-muted-foreground" />}>
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
                        </FilterAccordion>
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

                        {isLoading ? (
                            <div className="col-span-full py-40 text-center">Identifying premium partners...</div>
                        ) : filteredContractors.length > 0 ? (
                            <div className={cn(
                                "grid gap-8",
                                viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2" : "grid-cols-1"
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
                                                        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#1c1e24] rounded-full p-1 border-2 border-yellow-500 shadow-md">
                                                            <ShieldCheck className="h-4 w-4 text-yellow-500 fill-yellow-500/10" />
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
                                                                <p className={cn("text-[10px] font-bold", contractor.status === 'Available' ? "text-black dark:text-white" : "text-gray-500")}>{contractor.status}</p>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <p className="text-[8px] font-black uppercase text-gray-400 tracking-tight">Exp.</p>
                                                                <p className="text-[10px] font-bold text-gray-900 dark:text-white">{contractor.yearsExperience}yr</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <Button
                                                        onClick={(e) => { e.stopPropagation(); handleInvite(contractor); }}
                                                        className="bg-black dark:bg-white text-white dark:text-black font-black uppercase text-[9px] tracking-widest rounded-xl hover:bg-yellow-500 dark:hover:bg-yellow-400 transition-all h-10 px-6 group-hover:shadow-2xl"
                                                    >
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
                                            {selectedContractor.verified && <ShieldCheck className="w-3 h-3 text-yellow-500" />}
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
                                        <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-none text-[8px] uppercase">{selectedContractor.status}</Badge>
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
                                <Button onClick={() => { handleInvite(selectedContractor); setIsDetailModalOpen(false); }} className="w-full h-11 bg-black dark:bg-yellow-500 text-white dark:text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-yellow-600 transition-all">
                                    Onboard to Project
                                </Button>
                                <div className="flex justify-between items-center opacity-60">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
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

            {/* Modern Invitation Modal */}
            <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
                <DialogContent className="max-w-md p-8 bg-white dark:bg-[#111318] border-gray-200 dark:border-white/10 shadow-3xl rounded-[2.5rem]">
                    <DialogHeader className="mb-6">
                        <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center mb-4">
                            <Mail className="w-6 h-6 text-black" />
                        </div>
                        <DialogTitle className="text-2xl font-black">Invite Partner</DialogTitle>
                        <DialogDescription className="font-bold text-gray-500">
                            Onboard {selectedContractor?.name} to your project via preferred channel.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Project Instance</Label>
                            <Select value={selectedProjectForInvite} onValueChange={setSelectedProjectForInvite}>
                                <SelectTrigger className="h-12 bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/5 rounded-xl font-bold">
                                    <SelectValue placeholder="Identify active project..." />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-[#1c1e24] dark:border-white/10">
                                    <SelectItem value="p1">Downtown Plaza Renovation</SelectItem>
                                    <SelectItem value="p2">Oak Ridge Medical Annex</SelectItem>
                                    <SelectItem value="p3">Riverside Phase 2</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Notification Pipeline</Label>
                            <div className="grid grid-cols-1 gap-3">
                                <button
                                    onClick={() => setInviteMethod('email')}
                                    className={cn(
                                        "flex items-center justify-between p-4 rounded-2xl border transition-all",
                                        inviteMethod === 'email' ? "bg-yellow-400 border-yellow-400 text-black shadow-lg" : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5 text-gray-500"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5" />
                                        <div className="text-left">
                                            <p className="text-sm font-black uppercase tracking-tighter">Email Dispatch</p>
                                            <p className="text-[10px] font-bold opacity-60">Send full digital bid package</p>
                                        </div>
                                    </div>
                                    {inviteMethod === 'email' && <CheckCircle2 className="w-5 h-5" />}
                                </button>

                                <button
                                    onClick={() => setInviteMethod('sms')}
                                    className={cn(
                                        "flex items-center justify-between p-4 rounded-2xl border transition-all",
                                        inviteMethod === 'sms' ? "bg-yellow-400 border-yellow-400 text-black shadow-lg" : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5 text-gray-500"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5" />
                                        <div className="text-left">
                                            <p className="text-sm font-black uppercase tracking-tighter">SMS Alert</p>
                                            <p className="text-[10px] font-bold opacity-60">Instant mobile notification</p>
                                        </div>
                                    </div>
                                    {inviteMethod === 'sms' && <CheckCircle2 className="w-5 h-5" />}
                                </button>

                                <button
                                    onClick={() => setInviteMethod('both')}
                                    className={cn(
                                        "flex items-center justify-between p-4 rounded-2xl border transition-all",
                                        inviteMethod === 'both' ? "bg-black text-white shadow-xl dark:bg-white dark:text-black" : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5 text-gray-500"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="w-5 h-5" />
                                        <div className="text-left">
                                            <p className="text-sm font-black uppercase tracking-tighter">Multi-Channel</p>
                                            <p className="text-[10px] font-bold opacity-60">Omni-channel invitation reach</p>
                                        </div>
                                    </div>
                                    {inviteMethod === 'both' && <CheckCircle2 className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-8 flex gap-3">
                        <Button variant="ghost" className="flex-1 font-black uppercase text-[10px] tracking-widest" onClick={() => setIsInviteModalOpen(false)}>Cancel</Button>
                        <Button className="flex-[2] h-12 bg-black dark:bg-yellow-500 text-white dark:text-black font-black uppercase text-[11px] tracking-widest rounded-xl" onClick={handleInvitationAction}>
                            Execute Invitation
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SubcontractorDirectory;
