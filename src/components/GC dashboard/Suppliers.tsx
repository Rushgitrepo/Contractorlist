import { useState, useEffect } from 'react';
import { getProjectDiscovery } from '@/api/gc-apis';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Search,
    MapPin,
    Phone,
    Star,
    Package,
    CheckCircle2,
    Filter,
    Truck,
    Clock,
    Tag,
    Globe,
    FolderOpen,
    DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FilterAccordion from './FilterAccordion';

const Suppliers = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filter States
    const [materialCategory, setMaterialCategory] = useState<string>('');
    const [productType, setProductType] = useState<string>('');
    const [radius, setRadius] = useState<string>('50');
    const [inStock, setInStock] = useState<boolean>(false);
    const [deliveryAvailable, setDeliveryAvailable] = useState<boolean>(false);
    const [pricingType, setPricingType] = useState<string>('');
    const [brand, setBrand] = useState<string>('');
    const [leadTime, setLeadTime] = useState<string>('');

    useEffect(() => {
        loadSuppliers();
    }, [searchQuery, materialCategory, productType, radius, inStock, deliveryAvailable, pricingType, brand, leadTime]);

    const loadSuppliers = async () => {
        try {
            setIsLoading(true);
            const filters: any = {};
            if (searchQuery) filters.search = searchQuery;
            if (materialCategory) filters.category = materialCategory;
            if (radius) filters.radius = radius;
            filters.type = 'Supplier';

            // Mock API parameters for new filters if needed in future
            // filters.productType = productType;
            // filters.inStock = inStock;
            // filters.delivery = deliveryAvailable;

            const data = await getProjectDiscovery(filters);

            // In a real app, filtering happens on backend. 
            // For now, we'll map and display what we get.
            setSuppliers(data.map((s: any) => ({
                id: s.id,
                name: s.name,
                category: s.trade || 'General Supply',
                location: s.location || 'N/A',
                rating: s.rating || 0,
                inventory: s.specialties || ['Lumber', 'Drywall', 'Tools'],
                status: s.tier || 'Verified',
                logo: s.avatar || s.name.substring(0, 2).toUpperCase(),
                brand: 'Premium Brands', // Mock
                leadTime: '1-3 Days' // Mock
            })));
        } catch (error) {
            console.error("Failed to load suppliers", error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetFilters = () => {
        setMaterialCategory('');
        setProductType('');
        setRadius('50');
        setInStock(false);
        setDeliveryAvailable(false);
        setPricingType('');
        setBrand('');
        setLeadTime('');
        setSearchQuery('');
    };

    return (
        <div className="flex-1 w-full flex overflow-hidden">
            {/* Dynamic Filter Sidebar */}
            <aside className="hidden xl:flex w-80 flex-col border-r border-gray-200 dark:border-white/5 bg-gray-50/30 dark:bg-black/20 overflow-y-auto p-6 custom-scrollbar shrink-0">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={resetFilters}
                        className="text-[10px] font-black uppercase text-yellow-600 dark:text-yellow-500 hover:underline"
                    >
                        Reset
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Material Category */}
                    <FilterAccordion title="Material Category" icon={<FolderOpen className="w-4 h-4 text-muted-foreground" />}>
                        <Select value={materialCategory} onValueChange={setMaterialCategory}>
                            <SelectTrigger className="w-full h-11 border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 text-xs font-bold rounded-xl shadow-sm">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Lumber">Lumber & Wood</SelectItem>
                                <SelectItem value="Steel">Steel & Metals</SelectItem>
                                <SelectItem value="Electrical">Electrical Supplies</SelectItem>
                                <SelectItem value="Plumbing">Plumbing & Fixtures</SelectItem>
                                <SelectItem value="HVAC">HVAC Units</SelectItem>
                                <SelectItem value="Concrete">Concrete & Masonry</SelectItem>
                                <SelectItem value="Drywall">Drywall & Insulation</SelectItem>
                            </SelectContent>
                        </Select>
                    </FilterAccordion>

                    {/* Product Type */}
                    <FilterAccordion title="Product Type" icon={<Package className="w-4 h-4 text-muted-foreground" />}>
                        <Select value={productType} onValueChange={setProductType}>
                            <SelectTrigger className="w-full h-11 border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 text-xs font-bold rounded-xl">
                                <SelectValue placeholder="Standard Goods" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Standard">Standard / Stock</SelectItem>
                                <SelectItem value="Custom">Custom Fabricated</SelectItem>
                                <SelectItem value="Specialty">Specialty / Rare</SelectItem>
                                <SelectItem value="Bulk">Bulk Commodity</SelectItem>
                            </SelectContent>
                        </Select>
                    </FilterAccordion>

                    {/* Location (Radius) */}
                    <FilterAccordion title="Location (Radius)" icon={<MapPin className="w-4 h-4 text-muted-foreground" />}>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                <Input
                                    type="number"
                                    value={radius}
                                    onChange={(e) => setRadius(e.target.value)}
                                    placeholder="50"
                                    className="pl-9 h-11 border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 text-xs font-bold rounded-xl"
                                />
                            </div>
                            <span className="text-[10px] font-black text-gray-400">MILES</span>
                        </div>
                    </FilterAccordion>

                    {/* Stock & Delivery Availability */}
                    <FilterAccordion title="Inventory & Logistics" icon={<Truck className="w-4 h-4 text-muted-foreground" />}>
                        <div className="space-y-3">
                            <div
                                className="flex items-center group cursor-pointer"
                                onClick={() => setInStock(!inStock)}
                            >
                                <div className={cn(
                                    "w-4 h-4 rounded border flex items-center justify-center transition-all mr-3 shrink-0",
                                    inStock ? "bg-yellow-500 border-yellow-500 text-black shadow-lg" : "border-gray-300 dark:border-white/10 group-hover:border-yellow-400"
                                )}>
                                    {inStock && <CheckCircle2 className="w-3 h-3" />}
                                </div>
                                <span className={cn("text-xs font-bold transition-all", inStock ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400")}>In-Stock Only</span>
                            </div>
                            <div
                                className="flex items-center group cursor-pointer"
                                onClick={() => setDeliveryAvailable(!deliveryAvailable)}
                            >
                                <div className={cn(
                                    "w-4 h-4 rounded border flex items-center justify-center transition-all mr-3 shrink-0",
                                    deliveryAvailable ? "bg-yellow-500 border-yellow-500 text-black shadow-lg" : "border-gray-300 dark:border-white/10 group-hover:border-yellow-400"
                                )}>
                                    {deliveryAvailable && <Truck className="w-2.5 h-2.5" />}
                                </div>
                                <span className={cn("text-xs font-bold transition-all", deliveryAvailable ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400")}>Express Delivery Available</span>
                            </div>
                        </div>
                    </FilterAccordion>

                    {/* Pricing Type */}
                    <FilterAccordion title="Pricing Model" icon={<DollarSign className="w-4 h-4 text-muted-foreground" />}>
                        <Select value={pricingType} onValueChange={setPricingType}>
                            <SelectTrigger className="w-full h-11 border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 text-xs font-bold rounded-xl">
                                <SelectValue placeholder="Market Rate" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Wholesale">Wholesale Direct</SelectItem>
                                <SelectItem value="Retail">Retail</SelectItem>
                                <SelectItem value="Contract">Project / Contract</SelectItem>
                                <SelectItem value="Volume">Volume-Based</SelectItem>
                            </SelectContent>
                        </Select>
                    </FilterAccordion>

                    {/* Brand Selection */}
                    <FilterAccordion title="Brand Preference" icon={<Tag className="w-4 h-4 text-muted-foreground" />}>
                        <div className="relative">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                            <Input
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                placeholder="E.g. DeWalt, Bosch..."
                                className="pl-9 h-11 border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 text-xs font-bold rounded-xl"
                            />
                        </div>
                    </FilterAccordion>

                    {/* Lead Time */}
                    <FilterAccordion title="Lead Time" icon={<Clock className="w-4 h-4 text-muted-foreground" />}>
                        <Select value={leadTime} onValueChange={setLeadTime}>
                            <SelectTrigger className="w-full h-11 border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 text-xs font-bold rounded-xl">
                                <SelectValue placeholder="Select Window" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="24h">Under 24 Hours</SelectItem>
                                <SelectItem value="3d">1-3 Business Days</SelectItem>
                                <SelectItem value="1w">Within 1 Week</SelectItem>
                                <SelectItem value="4w">4+ Weeks (Pre-order)</SelectItem>
                            </SelectContent>
                        </Select>
                    </FilterAccordion>
                </div>
            </aside>

            {/* Main Feed Area */}
            <main className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white dark:bg-[#0f1115]">
                <div className="max-w-6xl mx-auto">
                    <div className="relative mb-12">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Procurement search: items, companies, or specifications..."
                            className="pl-16 h-16 bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5 rounded-3xl text-lg font-bold shadow-xl focus-visible:ring-yellow-400 transition-all border-b-4 border-b-transparent focus-visible:border-b-yellow-400"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
                        {isLoading ? (
                            <div className="col-span-full py-40 text-center flex flex-col items-center">
                                <div className="animate-spin h-10 w-10 border-4 border-yellow-500 border-t-transparent rounded-full mb-6" />
                                <p className="font-black text-gray-400 uppercase tracking-widest text-sm">Mapping local supply chain...</p>
                            </div>
                        ) : suppliers.length > 0 ? (
                            suppliers.map(s => (
                                <Card key={s.id} className="group relative bg-white dark:bg-[#1c1e24] border border-gray-200 dark:border-white/5 rounded-[3rem] overflow-hidden hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] transition-all duration-500 border-b-8 border-b-transparent hover:border-b-yellow-400">
                                    <div className="p-8">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-16 h-16 rounded-[1.5rem] bg-gray-50 dark:bg-black/40 flex items-center justify-center text-3xl font-black text-yellow-500 border border-gray-100 dark:border-white/5 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                                {s.logo}
                                            </div>
                                            <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-none font-black uppercase text-[9px] tracking-widest px-3 py-1 ring-1 ring-yellow-500/20">
                                                {s.status}
                                            </Badge>
                                        </div>

                                        <h3 className="text-2xl font-black mb-1 group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors tracking-tight">{s.name}</h3>
                                        <div className="flex flex-col gap-2 mb-8">
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                                <MapPin className="w-3.5 h-3.5 text-yellow-500" /> {s.location}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" /> {s.rating} <span className="text-[10px] text-gray-500">• (Avg. Lead: {s.leadTime})</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-6 border-t border-gray-50 dark:border-white/5">
                                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                                                <Package className="w-3 h-3" /> Active Inventory
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {s.inventory.map(item => (
                                                    <Badge key={item} variant="secondary" className="bg-gray-100 dark:bg-white/5 hover:bg-yellow-400 hover:text-black transition-colors rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-tighter cursor-default border-none">
                                                        {item}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-8 flex gap-3 pt-6 border-t border-gray-50 dark:border-white/5">
                                            <Button variant="outline" className="flex-1 rounded-2xl h-11 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 font-black uppercase text-[9px] tracking-widest">
                                                <Phone className="w-3.5 h-3.5 mr-2" /> Contact
                                            </Button>
                                            <Button className="flex-1 bg-black dark:bg-white text-white dark:text-black rounded-2xl h-11 hover:bg-yellow-500 hover:text-black transition-all font-black uppercase text-[10px] tracking-widest shadow-lg shadow-black/5 dark:shadow-white/5">
                                                Place Order
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full py-40 text-center bg-gray-50/50 dark:bg-black/20 rounded-[3rem] border-4 border-dashed border-gray-200 dark:border-white/10">
                                <Package className="mx-auto h-16 w-16 text-gray-200 dark:text-gray-700 mb-6 opacity-20" />
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Supply Link Inactive</h3>
                                <p className="text-gray-500 dark:text-gray-400 font-bold max-w-xs mx-auto text-sm">Adjust your procurement signals or location threshold to discover more providers.</p>
                                <Button onClick={resetFilters} variant="link" className="mt-6 text-yellow-500 font-black uppercase tracking-wider text-xs">Clear Procurement Signals</Button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Suppliers;
