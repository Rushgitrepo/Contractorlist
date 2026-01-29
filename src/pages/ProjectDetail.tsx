import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReduxHeader from "@/components/ReduxHeader";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    MapPin,
    Calendar,
    DollarSign,
    Building2,
    FileText,
    Clock,
    Star,
    Bookmark,
    Download,
    ChevronLeft,
    User,
    Phone,
    Mail,
    Globe,
    Briefcase,
    HardHat,
    FileCheck,
    AlertCircle,
    CheckCircle2,
    Upload,
    Send
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock project data - in real app this would come from database
const mockProject = {
    id: "proj-001",
    title: "Downtown Medical Center Expansion - Phase 2",
    projectId: "CC-2024-15847",
    location: "456 Healthcare Blvd",
    city: "Austin",
    state: "TX",
    zipCode: "78701",
    county: "Travis",
    category: "Healthcare",
    subcategory: "Hospital",
    stage: "Bidding" as const,
    bidDate: "Feb 15, 2024",
    bidTime: "2:00 PM CST",
    estimatedValue: "$45M - $55M",
    valueMin: 45000000,
    valueMax: 55000000,
    description: "Major expansion of the existing downtown medical center including a new 6-story patient tower, renovated emergency department, and updated surgical suites. The project encompasses approximately 180,000 square feet of new construction and 45,000 square feet of renovation work.",
    fullDescription: `This comprehensive healthcare expansion project represents a significant investment in the community's medical infrastructure. The project includes:

• New 6-story patient tower with 120 private patient rooms
• State-of-the-art surgical suite with 8 operating rooms
• Expanded emergency department with 40 treatment bays
• New imaging center with MRI, CT, and X-ray capabilities
• Upgraded HVAC and electrical systems throughout existing facility
• New central utility plant
• 500-space parking structure
• Landscaping and site improvements

The project will be constructed in phases to maintain hospital operations during construction. Strict infection control protocols must be followed throughout the project duration.`,
    owner: "Austin Regional Health System",
    ownerType: "Private Non-Profit",
    architect: "HKS Architects",
    architectPhone: "(512) 555-1234",
    architectEmail: "projects@hksarchitects.com",
    engineer: "Walter P Moore",
    constructionManager: "To Be Determined",
    trades: [
        "General Contracting",
        "Concrete",
        "Structural Steel",
        "HVAC/Mechanical",
        "Electrical",
        "Plumbing",
        "Fire Protection",
        "Medical Gas",
        "Flooring",
        "Drywall/Framing",
        "Painting",
        "Roofing",
        "Glass/Glazing",
        "Elevators"
    ],
    documentsAvailable: true,
    addendaAvailable: true,
    addendaCount: 3,
    privatelyFunded: true,
    matchScore: 6,
    postedDate: "Jan 10, 2024",
    lastUpdated: "Jan 25, 2024",
    sqFootage: "225,000 SF",
    stories: 6,
    buildingType: "New Construction & Renovation",
    deliveryMethod: "CM at Risk",
    prequalRequired: true,
    bondRequired: true,
    prevailingWage: false,
    targetStart: "April 2024",
    targetCompletion: "December 2026",
    documents: [
        { id: "doc-1", name: "Project Manual & Specifications", type: "PDF", size: "45.2 MB", date: "Jan 10, 2024" },
        { id: "doc-2", name: "Architectural Drawings", type: "PDF", size: "128.5 MB", date: "Jan 10, 2024" },
        { id: "doc-3", name: "Structural Drawings", type: "PDF", size: "67.8 MB", date: "Jan 10, 2024" },
        { id: "doc-4", name: "MEP Drawings", type: "PDF", size: "89.3 MB", date: "Jan 10, 2024" },
        { id: "doc-5", name: "Addendum #1", type: "PDF", size: "2.1 MB", date: "Jan 15, 2024" },
        { id: "doc-6", name: "Addendum #2", type: "PDF", size: "5.4 MB", date: "Jan 20, 2024" },
        { id: "doc-7", name: "Addendum #3", type: "PDF", size: "1.8 MB", date: "Jan 25, 2024" },
        { id: "doc-8", name: "Bid Form", type: "DOCX", size: "245 KB", date: "Jan 10, 2024" },
        { id: "doc-9", name: "Prequalification Application", type: "PDF", size: "890 KB", date: "Jan 10, 2024" },
    ],
    planHolders: 24,
    viewCount: 156,
};

const stageColors: Record<string, string> = {
    "Planning": "bg-blue-500/10 text-blue-600 border-blue-500/20",
    "Bidding": "bg-green-500/10 text-green-600 border-green-500/20",
    "Post-Bid": "bg-amber-500/10 text-amber-600 border-amber-500/20",
    "Under Construction": "bg-purple-500/10 text-purple-600 border-purple-500/20",
};

const ProjectDetail = () => {
    const { id } = useParams();
    const { toast } = useToast();
    const [isSaved, setIsSaved] = useState(false);
    const [bidFormData, setBidFormData] = useState({
        companyName: "",
        contactName: "",
        email: "",
        phone: "",
        selectedTrades: [] as string[],
        bidAmount: "",
        message: "",
    });

    // In real app, fetch project by id
    const project = mockProject;

    const handleSave = () => {
        setIsSaved(!isSaved);
        toast({
            title: isSaved ? "Removed from saved projects" : "Project saved",
            description: isSaved ? "This project has been removed from your saved list." : "You can find this project in your saved projects.",
        });
    };

    const handleBidSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Bid inquiry submitted",
            description: "Your bid inquiry has been sent to the project owner. They will contact you shortly.",
        });
    };

    const handleTradeToggle = (trade: string) => {
        setBidFormData(prev => ({
            ...prev,
            selectedTrades: prev.selectedTrades.includes(trade)
                ? prev.selectedTrades.filter(t => t !== trade)
                : [...prev.selectedTrades, trade]
        }));
    };

    return (
        <div className="min-h-screen bg-background">
            <ReduxHeader />

            <main className="pt-20">
                {/* Breadcrumb */}
                <div className="bg-muted/30 border-b border-border/50 relative z-10">
                    <div className="container mx-auto px-4 py-3">
                        <Button variant="ghost" size="sm" asChild className="pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground transition-colors">
                            <Link to="/projects">
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Back to Projects
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Project Header */}
                <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-8 border-b border-border/50">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <Badge variant="outline" className={stageColors[project.stage] || ""}>
                                        {project.stage}
                                    </Badge>
                                    {project.privatelyFunded && (
                                        <Badge variant="secondary">Private</Badge>
                                    )}
                                    {project.prequalRequired && (
                                        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                                            Prequal Required
                                        </Badge>
                                    )}
                                    {project.bondRequired && (
                                        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                                            Bond Required
                                        </Badge>
                                    )}
                                </div>

                                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                                    {project.title}
                                </h1>

                                <p className="text-muted-foreground mb-4">
                                    Project ID: {project.projectId}
                                </p>

                                <div className="flex flex-wrap gap-4 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <MapPin className="w-4 h-4" />
                                        <span>{project.location}, {project.city}, {project.state} {project.zipCode}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Building2 className="w-4 h-4" />
                                        <span>{project.category} - {project.subcategory}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <DollarSign className="w-4 h-4" />
                                        <span>{project.estimatedValue}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                {project.matchScore && (
                                    <div className="flex flex-col items-center justify-center bg-accent/10 rounded-lg p-3 min-w-[100px]">
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(7)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-3 h-3 ${i < project.matchScore! ? "fill-accent text-accent" : "text-muted-foreground/30"}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm font-medium text-accent mt-1">
                                            {project.matchScore}/7 Match
                                        </span>
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={handleSave}
                                        className={isSaved ? "text-accent border-accent" : ""}
                                    >
                                        <Bookmark className={`w-4 h-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
                                        {isSaved ? "Saved" : "Save"}
                                    </Button>
                                    <Button className="bg-accent hover:bg-accent/90">
                                        <FileText className="w-4 h-4 mr-2" />
                                        Get Plans
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <section className="py-8">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Left Column - Main Content */}
                            <div className="lg:col-span-2 space-y-6">
                                <Tabs defaultValue="overview" className="w-full">
                                    <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                                        <TabsTrigger
                                            value="overview"
                                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent py-3 px-4"
                                        >
                                            Overview
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="documents"
                                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent py-3 px-4"
                                        >
                                            Documents ({project.documents.length})
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="trades"
                                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent py-3 px-4"
                                        >
                                            Trades ({project.trades.length})
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="bid"
                                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent py-3 px-4"
                                        >
                                            Submit Bid
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* Overview Tab */}
                                    <TabsContent value="overview" className="mt-6 space-y-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg">Project Description</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-muted-foreground whitespace-pre-line">
                                                    {project.fullDescription}
                                                </p>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg">Project Specifications</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid sm:grid-cols-2 gap-4">
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between py-2 border-b border-border/50">
                                                            <span className="text-muted-foreground">Building Type</span>
                                                            <span className="font-medium">{project.buildingType}</span>
                                                        </div>
                                                        <div className="flex justify-between py-2 border-b border-border/50">
                                                            <span className="text-muted-foreground">Square Footage</span>
                                                            <span className="font-medium">{project.sqFootage}</span>
                                                        </div>
                                                        <div className="flex justify-between py-2 border-b border-border/50">
                                                            <span className="text-muted-foreground">Stories</span>
                                                            <span className="font-medium">{project.stories}</span>
                                                        </div>
                                                        <div className="flex justify-between py-2 border-b border-border/50">
                                                            <span className="text-muted-foreground">Delivery Method</span>
                                                            <span className="font-medium">{project.deliveryMethod}</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between py-2 border-b border-border/50">
                                                            <span className="text-muted-foreground">Target Start</span>
                                                            <span className="font-medium">{project.targetStart}</span>
                                                        </div>
                                                        <div className="flex justify-between py-2 border-b border-border/50">
                                                            <span className="text-muted-foreground">Target Completion</span>
                                                            <span className="font-medium">{project.targetCompletion}</span>
                                                        </div>
                                                        <div className="flex justify-between py-2 border-b border-border/50">
                                                            <span className="text-muted-foreground">Prevailing Wage</span>
                                                            <span className="font-medium">{project.prevailingWage ? "Yes" : "No"}</span>
                                                        </div>
                                                        <div className="flex justify-between py-2 border-b border-border/50">
                                                            <span className="text-muted-foreground">County</span>
                                                            <span className="font-medium">{project.county}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg">Project Team</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="grid sm:grid-cols-2 gap-4">
                                                    <div className="p-4 bg-muted/30 rounded-lg">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Briefcase className="w-4 h-4 text-accent" />
                                                            <span className="font-medium">Owner</span>
                                                        </div>
                                                        <p className="text-foreground">{project.owner}</p>
                                                        <p className="text-sm text-muted-foreground">{project.ownerType}</p>
                                                    </div>
                                                    <div className="p-4 bg-muted/30 rounded-lg">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <User className="w-4 h-4 text-accent" />
                                                            <span className="font-medium">Architect</span>
                                                        </div>
                                                        <p className="text-foreground">{project.architect}</p>
                                                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                                            <Phone className="w-3 h-3" />
                                                            <span>{project.architectPhone}</span>
                                                        </div>
                                                    </div>
                                                    <div className="p-4 bg-muted/30 rounded-lg">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <HardHat className="w-4 h-4 text-accent" />
                                                            <span className="font-medium">Engineer</span>
                                                        </div>
                                                        <p className="text-foreground">{project.engineer}</p>
                                                    </div>
                                                    <div className="p-4 bg-muted/30 rounded-lg">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Building2 className="w-4 h-4 text-accent" />
                                                            <span className="font-medium">Construction Manager</span>
                                                        </div>
                                                        <p className="text-foreground">{project.constructionManager}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    {/* Documents Tab */}
                                    <TabsContent value="documents" className="mt-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg flex items-center justify-between">
                                                    <span>Project Documents</span>
                                                    <Button variant="outline" size="sm">
                                                        <Download className="w-4 h-4 mr-2" />
                                                        Download All
                                                    </Button>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-2">
                                                    {project.documents.map((doc) => (
                                                        <div
                                                            key={doc.id}
                                                            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                                                                    <FileText className="w-5 h-5 text-accent" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-foreground group-hover:text-accent transition-colors">
                                                                        {doc.name}
                                                                    </p>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {doc.type} • {doc.size} • {doc.date}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Button variant="ghost" size="sm">
                                                                <Download className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    {/* Trades Tab */}
                                    <TabsContent value="trades" className="mt-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg">Required Trades</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                                                    {project.trades.map((trade) => (
                                                        <div
                                                            key={trade}
                                                            className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg"
                                                        >
                                                            <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                                                            <span className="text-sm">{trade}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    {/* Bid Submission Tab */}
                                    <TabsContent value="bid" className="mt-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg">Submit Bid Inquiry</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <form onSubmit={handleBidSubmit} className="space-y-6">
                                                    <div className="grid sm:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="companyName">Company Name *</Label>
                                                            <Input
                                                                id="companyName"
                                                                placeholder="Your company name"
                                                                value={bidFormData.companyName}
                                                                onChange={(e) => setBidFormData(prev => ({ ...prev, companyName: e.target.value }))}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="contactName">Contact Name *</Label>
                                                            <Input
                                                                id="contactName"
                                                                placeholder="Your full name"
                                                                value={bidFormData.contactName}
                                                                onChange={(e) => setBidFormData(prev => ({ ...prev, contactName: e.target.value }))}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="email">Email *</Label>
                                                            <Input
                                                                id="email"
                                                                type="email"
                                                                placeholder="your@email.com"
                                                                value={bidFormData.email}
                                                                onChange={(e) => setBidFormData(prev => ({ ...prev, email: e.target.value }))}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="phone">Phone *</Label>
                                                            <Input
                                                                id="phone"
                                                                type="tel"
                                                                placeholder="(555) 123-4567"
                                                                value={bidFormData.phone}
                                                                onChange={(e) => setBidFormData(prev => ({ ...prev, phone: e.target.value }))}
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    <Separator />

                                                    <div className="space-y-3">
                                                        <Label>Select Trades You're Bidding On *</Label>
                                                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                                                            {project.trades.map((trade) => (
                                                                <button
                                                                    key={trade}
                                                                    type="button"
                                                                    onClick={() => handleTradeToggle(trade)}
                                                                    className={`flex items-center gap-2 p-2 rounded-lg border text-left text-sm transition-colors ${bidFormData.selectedTrades.includes(trade)
                                                                        ? "bg-accent/10 border-accent text-accent"
                                                                        : "bg-muted/30 border-border hover:border-accent/50"
                                                                        }`}
                                                                >
                                                                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${bidFormData.selectedTrades.includes(trade)
                                                                        ? "bg-accent border-accent"
                                                                        : "border-muted-foreground/30"
                                                                        }`}>
                                                                        {bidFormData.selectedTrades.includes(trade) && (
                                                                            <CheckCircle2 className="w-3 h-3 text-white" />
                                                                        )}
                                                                    </div>
                                                                    <span>{trade}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <Separator />

                                                    <div className="space-y-2">
                                                        <Label htmlFor="bidAmount">Estimated Bid Amount (Optional)</Label>
                                                        <Input
                                                            id="bidAmount"
                                                            placeholder="$0.00"
                                                            value={bidFormData.bidAmount}
                                                            onChange={(e) => setBidFormData(prev => ({ ...prev, bidAmount: e.target.value }))}
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="message">Additional Message</Label>
                                                        <Textarea
                                                            id="message"
                                                            placeholder="Include any questions or additional information..."
                                                            value={bidFormData.message}
                                                            onChange={(e) => setBidFormData(prev => ({ ...prev, message: e.target.value }))}
                                                            rows={4}
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Attach Documents (Optional)</Label>
                                                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent/50 transition-colors cursor-pointer">
                                                            <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                                                            <p className="text-sm text-muted-foreground">
                                                                Drag & drop files here, or click to browse
                                                            </p>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                PDF, DOC, DOCX up to 10MB each
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
                                                        <Send className="w-4 h-4 mr-2" />
                                                        Submit Bid Inquiry
                                                    </Button>
                                                </form>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </Tabs>
                            </div>

                            {/* Right Column - Sidebar */}
                            <div className="space-y-6">
                                {/* Bid Information */}
                                <Card className="border-accent/20">
                                    <CardHeader className="bg-accent/5">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-accent" />
                                            Bid Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4 space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Bid Date</span>
                                            <span className="font-medium text-accent">{project.bidDate}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Bid Time</span>
                                            <span className="font-medium">{project.bidTime}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Est. Value</span>
                                            <span className="font-medium">{project.estimatedValue}</span>
                                        </div>
                                        {project.addendaAvailable && (
                                            <>
                                                <Separator />
                                                <div className="flex items-center justify-between">
                                                    <span className="text-muted-foreground">Addenda</span>
                                                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                                        {project.addendaCount} Available
                                                    </Badge>
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Project Stats */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Project Activity</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Plan Holders</span>
                                            <span className="font-medium">{project.planHolders}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Views</span>
                                            <span className="font-medium">{project.viewCount}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Posted</span>
                                            <span className="font-medium">{project.postedDate}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Last Updated</span>
                                            <span className="font-medium">{project.lastUpdated}</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Requirements */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Requirements</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            {project.prequalRequired ? (
                                                <AlertCircle className="w-4 h-4 text-amber-500" />
                                            ) : (
                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            )}
                                            <span className="text-sm">
                                                {project.prequalRequired ? "Prequalification Required" : "No Prequalification"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {project.bondRequired ? (
                                                <AlertCircle className="w-4 h-4 text-amber-500" />
                                            ) : (
                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            )}
                                            <span className="text-sm">
                                                {project.bondRequired ? "Bond Required" : "No Bond Required"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {project.prevailingWage ? (
                                                <AlertCircle className="w-4 h-4 text-amber-500" />
                                            ) : (
                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            )}
                                            <span className="text-sm">
                                                {project.prevailingWage ? "Prevailing Wage" : "Non-Prevailing Wage"}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Contact */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Contact for Questions</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <p className="font-medium">{project.architect}</p>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Phone className="w-4 h-4" />
                                            <span>{project.architectPhone}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Mail className="w-4 h-4" />
                                            <span>{project.architectEmail}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default ProjectDetail;
