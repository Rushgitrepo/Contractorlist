import { useState, useEffect } from "react";
import {
    MapPin,
    Search,
    ChevronDown,
    X,
    RotateCcw,
    Calendar,
    Building2,
    Briefcase,
    DollarSign,
    Filter,
    Landmark,
    Hammer,
    Users,
    Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const PROJECT_STAGES = [
    "Planning",
    "Bidding",
    "Post-Bid",
    "Under Construction",
];

const PROJECT_CATEGORIES = [
    "Commercial",
    "Residential",
    "Industrial",
    "Healthcare",
    "Education",
    "Government",
    "Infrastructure",
    "Retail",
    "Hospitality",
    "Mixed-Use",
];

const PROJECT_SECTORS = [
    "Private",
    "Public (Federal)",
    "Public (State)",
    "Public (Local)",
];

const CONSTRUCTION_TYPES = [
    "New Construction",
    "Renovation / Retrofit",
    "Addition / Expansion",
    "Tenant Improvement (TI)",
    "Demolition",
];

const LABOR_REQUIREMENTS = [
    "Union",
    "Non-Union",
    "Prevailing Wage",
];

export const CSI_DIVISIONS = [
    { code: "00", name: "Procurement & Contracting" },
    { code: "01", name: "General Requirements" },
    { code: "02", name: "Existing Conditions" },
    { code: "03", name: "Concrete" },
    { code: "04", name: "Masonry" },
    { code: "05", name: "Metals" },
    { code: "06", name: "Wood, Plastics & Composites" },
    { code: "07", name: "Thermal & Moisture Protection" },
    { code: "08", name: "Openings" },
    { code: "09", name: "Finishes" },
    { code: "10", name: "Specialties" },
    { code: "11", name: "Equipment" },
    { code: "12", name: "Furnishings" },
    { code: "13", name: "Special Construction" },
    { code: "14", name: "Conveying Equipment" },
    { code: "21", name: "Fire Suppression" },
    { code: "22", name: "Plumbing" },
    { code: "23", name: "HVAC" },
    { code: "25", name: "Integrated Automation" },
    { code: "26", name: "Electrical" },
    { code: "27", name: "Communications" },
    { code: "28", name: "Electronic Safety & Security" },
    { code: "31", name: "Earthwork" },
    { code: "32", name: "Exterior Improvements" },
    { code: "33", name: "Utilities" },
    { code: "34", name: "Transportation" },
    { code: "35", name: "Waterway & Marine" },
    { code: "40", name: "Process Interconnections" },
    { code: "41", name: "Material Processing" },
    { code: "42", name: "Process Heating/Cooling" },
    { code: "43", name: "Gas/Liquid Handling" },
    { code: "44", name: "Pollution Control" },
    { code: "48", name: "Electrical Power Generation" },
];

const VALUE_RANGES = [
    "Under $100K",
    "$100K - $500K",
    "$500K - $1M",
    "$1M - $5M",
    "$5M - $10M",
    "$10M - $50M",
    "$50M - $100M",
    "Over $100M",
];

const SOURCES = [
    "PlanHub",
    "Dodge Construction",
    "ConstructConnect",
    "Internal",
];

const SOLICITATION_STATUS = [
    "Open",
    "Bidding",
    "Awarded",
    "Closed",
];


const PROJ_CITIES_BY_STATE: Record<string, string[]> = {
    "New York": ["New York"],
    "California": ["Los Angeles", "San Diego", "San Jose", "San Francisco", "Fresno", "Sacramento", "Long Beach", "Oakland"],
    "Illinois": ["Chicago"],
    "Texas": ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth", "El Paso", "Arlington"],
    "Arizona": ["Phoenix", "Tucson", "Mesa"],
    "Pennsylvania": ["Philadelphia"],
    "Florida": ["Jacksonville", "Miami", "Tampa"],
    "Ohio": ["Columbus"],
    "North Carolina": ["Charlotte", "Raleigh"],
    "Indiana": ["Indianapolis"],
    "Washington": ["Seattle"],
    "Colorado": ["Denver", "Colorado Springs"],
    "District of Columbia": ["Washington"],
    "Massachusetts": ["Boston"],
    "Tennessee": ["Nashville", "Memphis"],
    "Michigan": ["Detroit"],
    "Oklahoma": ["Oklahoma City", "Tulsa"],
    "Oregon": ["Portland"],
    "Nevada": ["Las Vegas"],
    "Kentucky": ["Louisville"],
    "Maryland": ["Baltimore"],
    "Wisconsin": ["Milwaukee"],
    "New Mexico": ["Albuquerque"],
    "Georgia": ["Atlanta"],
    "Missouri": ["Kansas City"],
    "Nebraska": ["Omaha"],
    "Virginia": ["Virginia Beach"],
    "Minnesota": ["Minneapolis"],
    "Louisiana": ["New Orleans"]
};

// Mock data for counties - in a real app this would come from an API
const PROJ_COUNTIES_BY_STATE: Record<string, string[]> = {
    "New York": ["New York", "Kings", "Queens", "Bronx", "Richmond"],
    "California": ["Los Angeles", "San Diego", "Santa Clara", "San Francisco", "Fresno", "Sacramento", "Alameda"],
    "Illinois": ["Cook", "DuPage", "Lake"],
    "Texas": ["Harris", "Bexar", "Dallas", "Travis", "Tarrant", "El Paso"],
    "Arizona": ["Maricopa", "Pima"],
    "Pennsylvania": ["Philadelphia", "Allegheny"],
    "Florida": ["Duval", "Miami-Dade", "Hillsborough", "Orange"],
    "Ohio": ["Franklin", "Cuyahoga", "Hamilton"],
    "North Carolina": ["Mecklenburg", "Wake"],
    "Indiana": ["Marion"],
    "Washington": ["King", "Pierce"],
    "Colorado": ["Denver", "El Paso"],
    "District of Columbia": ["District of Columbia"],
    "Massachusetts": ["Suffolk", "Middlesex"],
    "Tennessee": ["Davidson", "Shelby"],
    "Michigan": ["Wayne"],
    "Oklahoma": ["Oklahoma", "Tulsa"],
    "Oregon": ["Multnomah"],
    "Nevada": ["Clark"],
    "Kentucky": ["Jefferson"],
    "Maryland": ["Baltimore City", "Baltimore"],
    "Wisconsin": ["Milwaukee"],
    "New Mexico": ["Bernalillo"],
    "Georgia": ["Fulton", "DeKalb"],
    "Missouri": ["Jackson", "Clay"],
    "Nebraska": ["Douglas"],
    "Virginia": ["Virginia Beach City", "Fairfax"],
    "Minnesota": ["Hennepin"],
    "Louisiana": ["Orleans"]
};

const PROJ_STATES = Object.keys(PROJ_CITIES_BY_STATE).sort();


const PUBLISH_DATES = [
    { label: "Any time", value: "any" },
    { label: "Last 24 hours", value: "1" },
    { label: "Last 3 days", value: "3" },
    { label: "Last 7 days", value: "7" },
    { label: "Last 30 days", value: "30" },
    { label: "Last 3 months", value: "90" },
];

const BIDDING_WITHIN = [
    { label: "Any time", value: "any" },
    { label: "Next 7 days", value: "7" },
    { label: "Next 30 days", value: "30" },
    { label: "Next 60 days", value: "60" },
];

const MATERIALS_EQUIPMENT = [
    "Concrete",
    "Steel",
    "Lumber",
    "Glass",
    "HVAC Equipment",
    "Electrical Gear",
    "Plumbing Fixtures",
    "Heavy Machinery",
];

const EXPERIENCE_LEVELS = [
    "1-5 Years in Business",
    "5-10 Years in Business",
    "10+ Years in Business",
];

interface FilterSectionProps {
    title: string;
    icon?: React.ReactNode;
    defaultOpen?: boolean;
    count?: number;
    children: React.ReactNode;
}

const FilterSection = ({
    title,
    icon,
    defaultOpen = false,
    count,
    children,
}: FilterSectionProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border-b border-border last:border-0">
            <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-sm font-semibold text-foreground hover:text-accent transition-colors group">
                <div className="flex items-center gap-2">
                    {icon}
                    {title}
                    {count !== undefined && count > 0 && (
                        <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-xs font-medium">
                            {count}
                        </Badge>
                    )}
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pb-4">{children}</CollapsibleContent>
        </Collapsible>
    );
};

interface FilterCheckboxListProps<T> {
    items: T[];
    selectedItems: string[];
    onToggle: (item: string) => void;
    labelFn: (item: T) => React.ReactNode;
    valueFn: (item: T) => string;
    idPrefix: string;
    limit?: number;
}

const FilterCheckboxList = <T,>({
    items,
    selectedItems,
    onToggle,
    labelFn,
    valueFn,
    idPrefix,
    limit = 5
}: FilterCheckboxListProps<T>) => {
    const [showAll, setShowAll] = useState(false);

    // Always show all items if we are under the limit or if showAll is true
    // Also if limit is 0 or negative, assume show all (though default is 5)
    const shouldLimit = limit > 0 && items.length > limit && !showAll;
    const displayedItems = shouldLimit ? items.slice(0, limit) : items;
    const remainingCount = items.length - limit;

    return (
        <div className="space-y-2">
            {displayedItems.map((item) => {
                const value = valueFn(item);
                const id = `${idPrefix}-${value}`;
                return (
                    <div key={value} className="flex items-center space-x-2">
                        <Checkbox
                            id={id}
                            checked={selectedItems.includes(value)}
                            onCheckedChange={() => onToggle(value)}
                        />
                        <Label
                            htmlFor={id}
                            className="text-sm font-normal cursor-pointer flex-1 leading-normal"
                        >
                            {labelFn(item)}
                        </Label>
                    </div>
                );
            })}

            {items.length > limit && (
                <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs text-accent hover:text-accent/80"
                    onClick={() => setShowAll(!showAll)}
                >
                    {showAll ? "Show Less" : `See ${remainingCount} More`}
                </Button>
            )}
        </div>
    );
};

interface ProjectFiltersProps {
    onFiltersChange?: (filters: ProjectFilterState) => void;
    initialFilters?: ProjectFilterState | null;
}

export interface ProjectFilterState {
    location: string;
    radius: number;
    keywords: string;
    stages: string[];
    solicitationStatus: string[];
    categories: string[];
    sectors: string[];
    constructionTypes: string[];
    laborRequirements: string[];
    trades: string[];
    valueRanges: string[];
    minBudget: string;
    maxBudget: string;
    minSize: string;
    maxSize: string;
    sources: string[];
    nigpCode: string;
    bidDateFrom: string;
    bidDateTo: string;
    documentsOnly: boolean;
    savedOnly: boolean;

    state: string;
    city: string;
    county: string;
    publishDate: string;
    biddingWithin: string;
    materials: string[];
    experienceLevel: string;
    bonded: boolean;
    insured: boolean;
    specAlerts: boolean;
}

const ProjectFilters = ({ onFiltersChange, initialFilters }: ProjectFiltersProps) => {
    const [location, setLocation] = useState(initialFilters?.location || "");
    const [radius, setRadius] = useState([initialFilters?.radius || 50]);
    const [keywords, setKeywords] = useState(initialFilters?.keywords || "");
    const [selectedStages, setSelectedStages] = useState<string[]>(initialFilters?.stages || []);
    const [selectedSolicitationStatus, setSelectedSolicitationStatus] = useState<string[]>(initialFilters?.solicitationStatus || []);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(initialFilters?.categories || []);
    const [selectedSectors, setSelectedSectors] = useState<string[]>(initialFilters?.sectors || []);
    const [selectedConstructionTypes, setSelectedConstructionTypes] = useState<string[]>(initialFilters?.constructionTypes || []);
    const [selectedLaborRequirements, setSelectedLaborRequirements] = useState<string[]>(initialFilters?.laborRequirements || []);
    const [selectedTrades, setSelectedTrades] = useState<string[]>(initialFilters?.trades || []);
    const [selectedValueRanges, setSelectedValueRanges] = useState<string[]>(initialFilters?.valueRanges || []);
    const [minBudget, setMinBudget] = useState(initialFilters?.minBudget || "");
    const [maxBudget, setMaxBudget] = useState(initialFilters?.maxBudget || "");
    const [minSize, setMinSize] = useState(initialFilters?.minSize || "");
    const [maxSize, setMaxSize] = useState(initialFilters?.maxSize || "");
    const [selectedSources, setSelectedSources] = useState<string[]>(initialFilters?.sources || []);
    const [nigpCode, setNigpCode] = useState(initialFilters?.nigpCode || "");
    const [tradeSearch, setTradeSearch] = useState("");
    const [bidDateFrom, setBidDateFrom] = useState(initialFilters?.bidDateFrom || "");
    const [bidDateTo, setBidDateTo] = useState(initialFilters?.bidDateTo || "");
    const [documentsOnly, setDocumentsOnly] = useState(initialFilters?.documentsOnly || false);
    const [savedOnly, setSavedOnly] = useState(initialFilters?.savedOnly || false);

    const [state, setState] = useState(initialFilters?.state || "");
    const [city, setCity] = useState(initialFilters?.city || "");
    const [county, setCounty] = useState(initialFilters?.county || "");
    const [publishDate, setPublishDate] = useState(initialFilters?.publishDate || "");
    const [biddingWithin, setBiddingWithin] = useState(initialFilters?.biddingWithin || "");
    const [selectedMaterials, setSelectedMaterials] = useState<string[]>(initialFilters?.materials || []);
    const [experienceLevel, setExperienceLevel] = useState(initialFilters?.experienceLevel || "");
    const [bonded, setBonded] = useState(initialFilters?.bonded || false);
    const [insured, setInsured] = useState(initialFilters?.insured || false);
    const [specAlerts, setSpecAlerts] = useState(initialFilters?.specAlerts || false);

    useEffect(() => {
        if (onFiltersChange) {
            onFiltersChange({
                location,
                radius: radius[0],
                keywords,
                stages: selectedStages,
                solicitationStatus: selectedSolicitationStatus,
                categories: selectedCategories,
                sectors: selectedSectors,
                constructionTypes: selectedConstructionTypes,
                laborRequirements: selectedLaborRequirements,
                trades: selectedTrades,
                valueRanges: selectedValueRanges,
                minBudget,
                maxBudget,
                minSize,
                maxSize,
                sources: selectedSources,
                nigpCode,
                bidDateFrom,
                bidDateTo,
                documentsOnly,
                savedOnly,
                state,
                city,
                county,
                publishDate,
                biddingWithin,
                materials: selectedMaterials,
                experienceLevel,
                bonded,
                insured,
                specAlerts,
            });
        }
    }, [
        location,
        radius,
        keywords,
        selectedStages,
        selectedSolicitationStatus,
        selectedCategories,
        selectedSectors,
        selectedConstructionTypes,
        selectedLaborRequirements,
        selectedTrades,
        selectedValueRanges,
        minBudget,
        maxBudget,
        minSize,
        maxSize,
        selectedSources,
        nigpCode,
        bidDateFrom,
        bidDateTo,
        documentsOnly,
        savedOnly,
        state,
        city,
        county,
        publishDate,
        biddingWithin,
        selectedMaterials,
        experienceLevel,
        bonded,
        insured,
        specAlerts,
        onFiltersChange
    ]);

    const filteredTrades = CSI_DIVISIONS.filter((trade) =>
        trade.name.toLowerCase().includes(tradeSearch.toLowerCase()) ||
        trade.code.includes(tradeSearch)
    );

    const totalFilters =
        selectedStages.length +
        selectedSolicitationStatus.length +
        selectedCategories.length +
        selectedSectors.length +
        selectedConstructionTypes.length +
        selectedLaborRequirements.length +
        selectedTrades.length +
        selectedValueRanges.length +
        selectedSources.length +
        (location ? 1 : 0) +
        (keywords ? 1 : 0) +
        (minBudget ? 1 : 0) +
        (maxBudget ? 1 : 0) +
        (minSize ? 1 : 0) +
        (maxSize ? 1 : 0) +
        (nigpCode ? 1 : 0) +
        (bidDateFrom ? 1 : 0) +
        (bidDateTo ? 1 : 0) +
        (documentsOnly ? 1 : 0) +
        (savedOnly ? 1 : 0) +
        (state ? 1 : 0) +
        (city ? 1 : 0) +
        (county ? 1 : 0) +
        (publishDate ? 1 : 0) +
        (biddingWithin ? 1 : 0) +
        selectedMaterials.length +
        (experienceLevel ? 1 : 0) +
        (bonded ? 1 : 0) +
        (insured ? 1 : 0) +
        (specAlerts ? 1 : 0);

    const clearAllFilters = () => {
        setLocation("");
        setRadius([50]);
        setKeywords("");
        setSelectedStages([]);
        setSelectedSolicitationStatus([]);
        setSelectedCategories([]);
        setSelectedSectors([]);
        setSelectedConstructionTypes([]);
        setSelectedLaborRequirements([]);
        setSelectedTrades([]);
        setSelectedValueRanges([]);
        setMinBudget("");
        setMaxBudget("");
        setMinSize("");
        setMaxSize("");
        setSelectedSources([]);
        setNigpCode("");
        setTradeSearch("");
        setBidDateFrom("");
        setBidDateTo("");
        setDocumentsOnly(false);
        setSavedOnly(false);
        setState("");
        setCity("");
        setCounty("");
        setPublishDate("");
        setBiddingWithin("");
        setSelectedMaterials([]);
        setExperienceLevel("");
        setBonded(false);
        setInsured(false);
        setSpecAlerts(false);
    };

    const toggleArrayItem = (arr: string[], item: string, setter: (arr: string[]) => void) => {
        if (arr.includes(item)) {
            setter(arr.filter((i) => i !== item));
        } else {
            setter([...arr, item]);
        }
    };

    const currentCities = state && state !== "All"
        ? (PROJ_CITIES_BY_STATE[state] || [])
        : Object.values(PROJ_CITIES_BY_STATE).flat().sort();

    const currentCounties = state && state !== "All"
        ? (PROJ_COUNTIES_BY_STATE[state] || [])
        : Object.values(PROJ_COUNTIES_BY_STATE).flat().sort();

    return (
        <div className="bg-card border border-border rounded-xl">
            {/* Header */}
            <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-accent" />
                        <h3 className="font-semibold text-foreground">Filters</h3>
                        {totalFilters > 0 && (
                            <Badge variant="secondary" className="ml-1 bg-accent/20 text-accent">
                                {totalFilters}
                            </Badge>
                        )}
                    </div>
                       <button
                onClick={() => {
                  setSearchQuery('');
                  setFilters({
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
                }}
                className="text-yellow-600 dark:text-yellow-500 text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-1"
              >
                Clear Search
              </button>
                    {totalFilters > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearAllFilters}
                            className="text-muted-foreground hover:text-foreground h-8 px-2"
                        >
                            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                            Clear all
                        </Button>
                    )}
                </div>

                {/* Active Filters */}
                {totalFilters > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {location && (
                            <Badge variant="secondary" className="gap-1 pr-1">
                                {location}
                                <X
                                    className="w-3 h-3 cursor-pointer hover:text-destructive"
                                    onClick={() => setLocation("")}
                                />
                            </Badge>
                        )}
                        {selectedStages.map((stage) => (
                            <Badge key={stage} variant="secondary" className="gap-1 pr-1">
                                {stage}
                                <X
                                    className="w-3 h-3 cursor-pointer hover:text-destructive"
                                    onClick={() => toggleArrayItem(selectedStages, stage, setSelectedStages)}
                                />
                            </Badge>
                        ))}
                        {selectedCategories.map((cat) => (
                            <Badge key={cat} variant="secondary" className="gap-1 pr-1">
                                {cat}
                                <X
                                    className="w-3 h-3 cursor-pointer hover:text-destructive"
                                    onClick={() => toggleArrayItem(selectedCategories, cat, setSelectedCategories)}
                                />
                            </Badge>
                        ))}
                        {selectedSectors.map((sector) => (
                            <Badge key={sector} variant="secondary" className="gap-1 pr-1">
                                {sector}
                                <X
                                    className="w-3 h-3 cursor-pointer hover:text-destructive"
                                    onClick={() => toggleArrayItem(selectedSectors, sector, setSelectedSectors)}
                                />
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            <ScrollArea className="h-[calc(100vh-280px)]">
                
                <div className="p-4 space-y-0">
                    
                    <FilterSection
                        title="Search"
                        icon={<Search className="w-4 h-4" />}
                        defaultOpen={true}
                    >
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Complex Keywords (AND)</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="HVAC, Austin, Phase 2..."
                                        value={keywords}
                                        onChange={(e) => setKeywords(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                        </div>
                    </FilterSection>

                    {/* Location */}
                    <FilterSection
                        title="Radius Search"
                        icon={<MapPin className="w-4 h-4" />}
                        defaultOpen={true}
                    >
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="City, State or ZIP"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <Label>Radius</Label>
                                    <span className="text-muted-foreground">{radius[0]} miles</span>
                                </div>
                                <Slider
                                    value={radius}
                                    onValueChange={setRadius}
                                    min={5}
                                    max={250}
                                    step={5}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </FilterSection>

                    {/* Region */}
                    <FilterSection
                        title="Region"
                        icon={<Landmark className="w-4 h-4" />}
                        count={(state ? 1 : 0) + (city ? 1 : 0) + (county ? 1 : 0)}
                    >
                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">State</Label>
                                <Select value={state} onValueChange={setState}>
                                    <SelectTrigger className="w-full text-left h-9">
                                        <SelectValue placeholder="Select State" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All States</SelectItem>
                                        {PROJ_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">City</Label>
                                <Select value={city} onValueChange={setCity}>
                                    <SelectTrigger className="w-full text-left h-9">
                                        <SelectValue placeholder="Select City" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Cities</SelectItem>
                                        {currentCities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">County</Label>
                                <Select value={county} onValueChange={setCounty}>
                                    <SelectTrigger className="w-full text-left h-9">
                                        <SelectValue placeholder="Select County" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Counties</SelectItem>
                                        {currentCounties.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </FilterSection>

                    {/* Timing */}
                    <FilterSection
                        title="Dates & Timing"
                        icon={<Calendar className="w-4 h-4" />}
                        count={(publishDate ? 1 : 0) + (biddingWithin ? 1 : 0)}
                    >
                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">Publish Date</Label>
                                <Select value={publishDate} onValueChange={setPublishDate}>
                                    <SelectTrigger className="w-full text-left h-9">
                                        <SelectValue placeholder="Select Range" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PUBLISH_DATES.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">Bidding Within</Label>
                                <Select value={biddingWithin} onValueChange={setBiddingWithin}>
                                    <SelectTrigger className="w-full text-left h-9">
                                        <SelectValue placeholder="Select Range" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {BIDDING_WITHIN.map(b => <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </FilterSection>

                    {/* Project Stage */}
                    <FilterSection
                        title="Project Stage"
                        icon={<Briefcase className="w-4 h-4" />}
                        defaultOpen={false}
                        count={selectedStages.length}
                    >
                        <div className="space-y-2">
                            {PROJECT_STAGES.map((stage) => (
                                <div key={stage} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`stage-${stage}`}
                                        checked={selectedStages.includes(stage)}
                                        onCheckedChange={() => toggleArrayItem(selectedStages, stage, setSelectedStages)}
                                    />
                                    <Label
                                        htmlFor={`stage-${stage}`}
                                        className="text-sm font-normal cursor-pointer flex-1"
                                    >
                                        {stage}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </FilterSection>

                    {/* Solicitation Status */}
                    <FilterSection
                        title="Solicitation Status"
                        icon={<Briefcase className="w-4 h-4" />}
                        count={selectedSolicitationStatus.length}
                    >
                        <div className="space-y-2">
                            {SOLICITATION_STATUS.map((status) => (
                                <div key={status} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`solicitation-${status}`}
                                        checked={selectedSolicitationStatus.includes(status)}
                                        onCheckedChange={() => toggleArrayItem(selectedSolicitationStatus, status, setSelectedSolicitationStatus)}
                                    />
                                    <Label
                                        htmlFor={`solicitation-${status}`}
                                        className="text-sm font-normal cursor-pointer flex-1"
                                    >
                                        {status}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </FilterSection>

                    {/* Project Category */}
                    <FilterSection
                        title="Project Category"
                        icon={<Building2 className="w-4 h-4" />}
                        defaultOpen={true}
                        count={selectedCategories.length}
                    >
                        <FilterCheckboxList
                            items={PROJECT_CATEGORIES}
                            selectedItems={selectedCategories}
                            onToggle={(item) => toggleArrayItem(selectedCategories, item, setSelectedCategories)}
                            valueFn={(item) => item}
                            labelFn={(item) => item}
                            idPrefix="cat"
                        />
                    </FilterSection>

                    {/* Sector */}
                    <FilterSection
                        title="Sector"
                        icon={<Landmark className="w-4 h-4" />}
                        count={selectedSectors.length}
                    >
                        <div className="space-y-2">
                            {PROJECT_SECTORS.map((sector) => (
                                <div key={sector} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`sector-${sector}`}
                                        checked={selectedSectors.includes(sector)}
                                        onCheckedChange={() => toggleArrayItem(selectedSectors, sector, setSelectedSectors)}
                                    />
                                    <Label
                                        htmlFor={`sector-${sector}`}
                                        className="text-sm font-normal cursor-pointer flex-1"
                                    >
                                        {sector}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </FilterSection>

                    {/* Construction Type */}
                    <FilterSection
                        title="Construction Type"
                        icon={<Hammer className="w-4 h-4" />}
                        count={selectedConstructionTypes.length}
                    >
                        <div className="space-y-2">
                            {CONSTRUCTION_TYPES.map((type) => (
                                <div key={type} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`type-${type}`}
                                        checked={selectedConstructionTypes.includes(type)}
                                        onCheckedChange={() => toggleArrayItem(selectedConstructionTypes, type, setSelectedConstructionTypes)}
                                    />
                                    <Label
                                        htmlFor={`type-${type}`}
                                        className="text-sm font-normal cursor-pointer flex-1"
                                    >
                                        {type}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </FilterSection>

                    {/* Labor Requirements */}
                    <FilterSection
                        title="Labor Requirements"
                        icon={<Users className="w-4 h-4" />}
                        count={selectedLaborRequirements.length}
                    >
                        <div className="space-y-2">
                            {LABOR_REQUIREMENTS.map((req) => (
                                <div key={req} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`req-${req}`}
                                        checked={selectedLaborRequirements.includes(req)}
                                        onCheckedChange={() => toggleArrayItem(selectedLaborRequirements, req, setSelectedLaborRequirements)}
                                    />
                                    <Label
                                        htmlFor={`req-${req}`}
                                        className="text-sm font-normal cursor-pointer flex-1"
                                    >
                                        {req}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </FilterSection>

                    {/* Trade/CSI Division */}
                    <FilterSection
                        title="Trade / CSI Division"
                        count={selectedTrades.length}
                    >
                        <div className="space-y-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search trades..."
                                    value={tradeSearch}
                                    onChange={(e) => setTradeSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                <FilterCheckboxList
                                    items={filteredTrades}
                                    selectedItems={selectedTrades}
                                    onToggle={(item) => toggleArrayItem(selectedTrades, item, setSelectedTrades)}
                                    valueFn={(item) => item.code}
                                    labelFn={(item) => (
                                        <>
                                            <span className="text-muted-foreground mr-1">{item.code}</span>
                                            {item.name}
                                        </>
                                    )}
                                    idPrefix="trade"
                                    limit={tradeSearch ? 100 : 5} // Show all if searching
                                />
                            </div>
                        </div>
                    </FilterSection>

                    {/* Project Value */}
                    <FilterSection
                        title="Financial Data"
                        icon={<DollarSign className="w-4 h-4" />}
                        count={selectedValueRanges.length + (minBudget ? 1 : 0) + (maxBudget ? 1 : 0)}
                    >
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Revenue Potential</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input placeholder="Min $" value={minBudget} onChange={(e) => setMinBudget(e.target.value)} className="h-9 text-xs" />
                                    <Input placeholder="Max $" value={maxBudget} onChange={(e) => setMaxBudget(e.target.value)} className="h-9 text-xs" />
                                </div>
                            </div>
                            <div className="space-y-2 pt-2 border-t border-border">
                                <Label className="text-xs text-muted-foreground">Estimated Value Ranges</Label>
                                <FilterCheckboxList
                                    items={VALUE_RANGES}
                                    selectedItems={selectedValueRanges}
                                    onToggle={(item) => toggleArrayItem(selectedValueRanges, item, setSelectedValueRanges)}
                                    valueFn={(item) => item}
                                    labelFn={(item) => item}
                                    idPrefix="value"
                                />
                            </div>
                        </div>
                    </FilterSection>

                    {/* Project Size */}
                    <FilterSection
                        title="Project Scale"
                        icon={<Hammer className="w-4 h-4" />}
                        count={(minSize ? 1 : 0) + (maxSize ? 1 : 0)}
                    >
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Size Range (SQFT)</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Input placeholder="Min SQFT" value={minSize} onChange={(e) => setMinSize(e.target.value)} className="h-9 text-xs" />
                                <Input placeholder="Max SQFT" value={maxSize} onChange={(e) => setMaxSize(e.target.value)} className="h-9 text-xs" />
                            </div>
                        </div>
                    </FilterSection>

                    {/* Industry Signals */}
                    <FilterSection
                        title="Industry Signals"
                        icon={<Target className="w-4 h-4" />}
                        count={(nigpCode ? 1 : 0) + selectedSources.length}
                    >
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground uppercase tracking-widest font-bold">NIGP Codes</Label>
                                <Input
                                    placeholder="e.g. 914-00..."
                                    value={nigpCode}
                                    onChange={(e) => setNigpCode(e.target.value)}
                                    className="h-9 text-xs"
                                />
                            </div>
                            <div className="space-y-2 pt-2 border-t border-border">
                                <Label className="text-xs text-muted-foreground uppercase tracking-widest">Marketplace Source</Label>
                                <div className="flex flex-wrap gap-2">
                                    {SOURCES.map(source => (
                                        <Badge
                                            key={source}
                                            onClick={() => toggleArrayItem(selectedSources, source, setSelectedSources)}
                                            className={cn(
                                                "cursor-pointer px-3 py-1 text-[9px] font-bold uppercase tracking-tight border-none transition-all",
                                                selectedSources.includes(source) ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                                            )}
                                        >{source}</Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </FilterSection>

                    {/* Materials & Equipment */}
                    <FilterSection
                        title="Materials & Equipment"
                        icon={<Briefcase className="w-4 h-4" />}
                        count={selectedMaterials.length}
                    >
                        <div className="space-y-2">
                            {MATERIALS_EQUIPMENT.map((mat) => (
                                <div key={mat} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`mat-${mat}`}
                                        checked={selectedMaterials.includes(mat)}
                                        onCheckedChange={() => toggleArrayItem(selectedMaterials, mat, setSelectedMaterials)}
                                    />
                                    <Label
                                        htmlFor={`mat-${mat}`}
                                        className="text-sm font-normal cursor-pointer flex-1"
                                    >
                                        {mat}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </FilterSection>


                    {/* Contractor Requirements */}
                    <FilterSection
                        title="Contractor Requirements"
                        icon={<Users className="w-4 h-4" />}
                        count={(experienceLevel ? 1 : 0) + (bonded ? 1 : 0) + (insured ? 1 : 0)}
                    >
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <Label className="text-xs text-muted-foreground">Experience Required</Label>
                                <RadioGroup value={experienceLevel} onValueChange={setExperienceLevel}>
                                    {EXPERIENCE_LEVELS.map((level) => (
                                        <div key={level} className="flex items-center space-x-2">
                                            <RadioGroupItem value={level} id={`exp-${level}`} />
                                            <Label htmlFor={`exp-${level}`} className="font-normal cursor-pointer">
                                                {level}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                            <div className="space-y-3 pt-2 border-t border-border">
                                <Label className="text-xs text-muted-foreground">Credentials Required</Label>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="req-bonded"
                                            checked={bonded}
                                            onCheckedChange={(checked) => setBonded(checked as boolean)}
                                        />
                                        <Label htmlFor="req-bonded" className="font-normal cursor-pointer">
                                            Bonded Contractor
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="req-insured"
                                            checked={insured}
                                            onCheckedChange={(checked) => setInsured(checked as boolean)}
                                        />
                                        <Label htmlFor="req-insured" className="font-normal cursor-pointer">
                                            Insured Contractor
                                        </Label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FilterSection>

                    {/* Bid Date */}
                    <FilterSection
                        title="Bid Date"
                        icon={<Calendar className="w-4 h-4" />}
                    >
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">From</Label>
                                <Input
                                    type="date"
                                    value={bidDateFrom}
                                    onChange={(e) => setBidDateFrom(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">To</Label>
                                <Input
                                    type="date"
                                    value={bidDateTo}
                                    onChange={(e) => setBidDateTo(e.target.value)}
                                />
                            </div>
                        </div>
                    </FilterSection>

                    {/* Quick Filters */}
                    <FilterSection title="Quick Filters" defaultOpen={true}>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="documents-only"
                                    checked={documentsOnly}
                                    onCheckedChange={(checked) => setDocumentsOnly(checked as boolean)}
                                />
                                <Label
                                    htmlFor="documents-only"
                                    className="text-sm font-normal cursor-pointer"
                                >
                                    Documents Available
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="saved-only"
                                    checked={savedOnly}
                                    onCheckedChange={(checked) => setSavedOnly(checked as boolean)}
                                />
                                <Label
                                    htmlFor="saved-only"
                                    className="text-sm font-normal cursor-pointer"
                                >
                                    Saved Projects Only
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="spec-alerts"
                                    checked={specAlerts}
                                    onCheckedChange={(checked) => setSpecAlerts(checked as boolean)}
                                />
                                <Label
                                    htmlFor="spec-alerts"
                                    className="text-sm font-normal cursor-pointer"
                                >
                                    Spec Alerts
                                </Label>
                            </div>
                        </div>
                    </FilterSection>
                </div>
            </ScrollArea>

            {/* Mobile Apply Button */}
            <div className="p-4 border-t border-border lg:hidden">
                <Button className="w-full" variant="accent">
                    Show Results
                </Button>
            </div>
        </div>
    );
};

export default ProjectFilters;
