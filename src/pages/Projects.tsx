import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ReduxHeader from "@/components/ReduxHeader";
import Footer from "@/components/Footer";
import {
  Search,
  Grid3X3,
  List,
  SlidersHorizontal,
  ArrowUpDown,
  Bookmark,
  Bell,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react";
import ProductServiceTemplate from "@/components/projects/ProductServiceTemplate";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ProjectCard, { Project } from "@/components/projects/ProjectCard";
import ProjectFilters, { ProjectFilterState, CSI_DIVISIONS } from "@/components/projects/ProjectFilters";
import { getProjectDiscovery } from "@/api/gc-apis/backend";

// Mock data for demonstration
const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Downtown Medical Center Expansion - Phase 2",
    projectId: "CC-2024-15847",
    location: "456 Healthcare Blvd",
    city: "Austin",
    state: "TX",
    category: "Healthcare",
    subcategory: "Hospital",
    stage: "Bidding",
    bidDate: "Feb 15, 2025",
    estimatedValue: "$45M - $60M",
    description: "Major expansion of existing medical center including new surgical wing, patient rooms, and parking structure. Seeking qualified general contractors and specialty subcontractors.",
    owner: "Austin Healthcare Partners",
    trades: ["General Construction", "Electrical", "HVAC", "Plumbing", "Fire Protection", "Medical Equipment"],
    documentsAvailable: true,
    addendaAvailable: true,
    privatelyFunded: true,
    matchScore: 6,
    postedDate: "2 days ago",
    sector: "Private",
    constructionType: "Addition / Expansion",
    laborRequirements: "Prevailing Wage",
    country: "United States",
    county: "Travis",
    materials: ["Concrete", "Steel", "Glass"],
    experienceRequired: "10+ Years in Business",
    bondedRequired: true,
    insuredRequired: true
  },
  {
    id: "2",
    title: "Riverside Commercial Office Complex",
    projectId: "CC-2024-15892",
    location: "1200 River Walk Dr",
    city: "San Antonio",
    state: "TX",
    category: "Commercial",
    subcategory: "Office Building",
    stage: "Planning",
    estimatedValue: "$25M - $35M",
    description: "New 12-story Class A office building with underground parking, retail space on ground floor, and rooftop amenities. LEED Gold certification targeted.",
    owner: "Riverside Development LLC",
    trades: ["General Construction", "Structural Steel", "Curtain Wall", "Electrical", "HVAC"],
    documentsAvailable: true,
    addendaAvailable: false,
    privatelyFunded: true,
    matchScore: 5,
    postedDate: "5 days ago",
    experienceRequired: "5-10 Years in Business",
    bondedRequired: false,
    insuredRequired: true,
    status: "Bidding",
    source: "Dodge Construction",
    nigpCode: "912-00"
  },
  {
    id: "3",
    title: "Westfield Elementary School Renovation",
    projectId: "CC-2024-15756",
    location: "890 School Lane",
    city: "Houston",
    state: "TX",
    category: "Education",
    subcategory: "K-12 School",
    stage: "Bidding",
    bidDate: "Jan 30, 2025",
    estimatedValue: "$8M - $12M",
    description: "Complete interior renovation of 1970s elementary school including new HVAC, electrical upgrades, ADA compliance improvements, and modernized classrooms.",
    owner: "Houston ISD",
    trades: ["General Construction", "Electrical", "HVAC", "Flooring", "Painting"],
    documentsAvailable: true,
    addendaAvailable: true,
    privatelyFunded: false,
    matchScore: 7,
    postedDate: "1 week ago",
    sector: "Public (Local)",
    constructionType: "Renovation / Retrofit",
    laborRequirements: "Prevailing Wage",
    country: "United States",
    county: "Harris",
    materials: ["Plumbing Fixtures", "Electrical Gear", "Flooring"],
    experienceRequired: "1-5 Years in Business",
    bondedRequired: true,
    insuredRequired: true,
    status: "Open",
    source: "ConstructConnect",
    nigpCode: "910-00"
  },
  {
    id: "4",
    title: "Industrial Warehouse Distribution Center",
    projectId: "CC-2024-15901",
    location: "5500 Logistics Way",
    city: "Dallas",
    state: "TX",
    category: "Industrial",
    subcategory: "Warehouse",
    stage: "Post-Bid",
    estimatedValue: "$18M - $22M",
    description: "500,000 SF distribution warehouse with 36' clear height, cross-dock configuration, and automated conveyor systems. Fast-track construction schedule.",
    owner: "National Logistics Inc",
    trades: ["General Construction", "Concrete", "Steel Erection", "Electrical", "Conveyor Systems"],
    documentsAvailable: false,
    addendaAvailable: false,
    privatelyFunded: true,
    postedDate: "3 days ago",
    sector: "Private",
    constructionType: "New Construction",
    laborRequirements: "Non-Union",
    status: "Closed",
    source: "PlanHub",
    nigpCode: "914-38",
    country: "United States",
    county: "Dallas",
    materials: ["Steel", "Concrete", "Heavy Machinery"],
    experienceRequired: "5-10 Years in Business",
    bondedRequired: false,
    insuredRequired: true
  },
  {
    id: "5",
    title: "Luxury Apartment Complex - The Heights",
    projectId: "CC-2024-15823",
    location: "2100 Heights Blvd",
    city: "Houston",
    state: "TX",
    category: "Residential",
    subcategory: "Multi-Family",
    stage: "Planning",
    estimatedValue: "$55M - $70M",
    description: "280-unit luxury apartment community with resort-style amenities, clubhouse, fitness center, and structured parking. Modern architectural design.",
    owner: "Heights Living Partners",
    trades: ["General Construction", "Framing", "Electrical", "Plumbing", "HVAC", "Landscaping"],
    documentsAvailable: true,
    addendaAvailable: false,
    privatelyFunded: true,
    matchScore: 4,
    postedDate: "1 day ago",
    sector: "Private",
    constructionType: "New Construction",
    laborRequirements: "Non-Union",
    country: "United States",
    county: "Harris",
    materials: ["Lumber", "Plumbing Fixtures", "HVAC Equipment"],
    experienceRequired: "10+ Years in Business",
    bondedRequired: true,
    insuredRequired: true
  },
  {
    id: "6",
    title: "Highway 290 Interchange Improvements",
    projectId: "CC-2024-15678",
    location: "Highway 290 & Loop 610",
    city: "Houston",
    state: "TX",
    category: "Infrastructure",
    subcategory: "Highway",
    stage: "Bidding",
    bidDate: "Feb 28, 2025",
    estimatedValue: "$120M - $150M",
    description: "Major interchange reconstruction including new flyover ramps, drainage improvements, and frontage road modifications. DBE participation goals apply.",
    owner: "TxDOT Houston District",
    trades: ["Heavy Civil", "Bridge Construction", "Concrete", "Drainage", "Signage"],
    documentsAvailable: true,
    addendaAvailable: true,
    privatelyFunded: false,
    matchScore: 3,
    postedDate: "4 days ago",
    sector: "Public (State)",
    constructionType: "Renovation / Retrofit",
    laborRequirements: "Prevailing Wage",
    country: "United States",
    county: "Harris",
    materials: ["Concrete", "Steel", "Heavy Machinery"],
    experienceRequired: "10+ Years in Business",
    bondedRequired: true,
    insuredRequired: true
  },
  {
    id: "7",
    title: "Boutique Hotel & Conference Center",
    projectId: "CC-2024-15934",
    location: "300 Congress Ave",
    city: "Austin",
    state: "TX",
    category: "Hospitality",
    subcategory: "Hotel",
    stage: "Under Construction",
    estimatedValue: "$32M - $40M",
    description: "150-room boutique hotel with 15,000 SF conference center, restaurant, rooftop bar, and spa. Historic building facade preservation required.",
    owner: "Congress Hospitality Group",
    trades: ["General Construction", "MEP", "Elevator", "Kitchen Equipment", "FF&E"],
    documentsAvailable: true,
    addendaAvailable: false,
    privatelyFunded: true,
    postedDate: "2 weeks ago",
    sector: "Private",
    constructionType: "New Construction",
    laborRequirements: "Non-Union",
    country: "United States",
    county: "Travis",
    materials: ["Glass", "HVAC Equipment", "Electrical Gear"],
    experienceRequired: "5-10 Years in Business",
    bondedRequired: false,
    insuredRequired: true
  },
  {
    id: "8",
    title: "Municipal Water Treatment Plant Upgrade",
    projectId: "CC-2024-15789",
    location: "4500 Water Works Rd",
    city: "Fort Worth",
    state: "TX",
    category: "Government",
    subcategory: "Utilities",
    stage: "Bidding",
    bidDate: "Mar 15, 2025",
    estimatedValue: "$75M - $95M",
    description: "Comprehensive upgrade of existing water treatment facility including new filtration systems, chemical feed systems, and SCADA controls upgrade.",
    owner: "City of Fort Worth",
    trades: ["Process Piping", "Electrical", "Instrumentation", "Concrete", "Equipment"],
    documentsAvailable: true,
    addendaAvailable: true,
    privatelyFunded: false,
    matchScore: 5,
    postedDate: "6 days ago",
    sector: "Public (Local)",
    constructionType: "Renovation / Retrofit",
    laborRequirements: "Union",
    country: "United States",
    county: "Tarrant",
    materials: ["Concrete", "Process Piping", "Electrical Gear"],
    experienceRequired: "10+ Years in Business",
    bondedRequired: true,
    insuredRequired: true
  },
  {
    id: "9",
    title: "Seattle Tech Campus Headquarters",
    projectId: "CC-2024-16001",
    location: "1000 Innovation Dr",
    city: "Seattle",
    state: "Washington",
    category: "Commercial",
    subcategory: "Office",
    stage: "Planning",
    estimatedValue: "$200M - $250M",
    description: "New 500,000 SF tech campus comprising three 10-story towers, underground parking, and extensive landscaping. Seeking LEED Platinum certification.",
    owner: "Tech Giant Corp",
    trades: ["General Construction", "Glazing", "Electrical", "HVAC", "Landscaping"],
    documentsAvailable: false,
    addendaAvailable: false,
    privatelyFunded: true,
    postedDate: "1 day ago",
    sector: "Private",
    constructionType: "New Construction",
    laborRequirements: "Non-Union",
    country: "United States",
    county: "King",
    materials: ["Glass", "Steel", "Concrete"],
    experienceRequired: "10+ Years in Business",
    bondedRequired: true,
    insuredRequired: true
  },
  {
    id: "10",
    title: "Miami Beach Resort Renovation",
    projectId: "CC-2024-16002",
    location: "450 Ocean Dr",
    city: "Miami",
    state: "Florida",
    category: "Hospitality",
    subcategory: "Hotel",
    stage: "Bidding",
    bidDate: "Mar 01, 2025",
    estimatedValue: "$15M - $20M",
    description: "Interior and exterior renovation of historic Art Deco hotel. Includes pool deck resurfacing, room upgrades, and lobby modernization.",
    owner: "Miami Resorts Intl",
    trades: ["Renovation", "Painting", "Tile", "Pool", "Electrical"],
    documentsAvailable: true,
    addendaAvailable: true,
    privatelyFunded: true,
    matchScore: 6,
    postedDate: "3 days ago",
    sector: "Private",
    constructionType: "Renovation / Retrofit",
    laborRequirements: "Non-Union",
    country: "United States",
    county: "Miami-Dade",
    materials: ["Concrete", "Plumbing Fixtures", "Tile"],
    experienceRequired: "5-10 Years in Business",
    bondedRequired: true,
    insuredRequired: true
  },
  {
    id: "11",
    title: "Chicago Metro Line Extension",
    projectId: "CC-2024-16003",
    location: "Red Line Extension",
    city: "Chicago",
    state: "Illinois",
    category: "Infrastructure",
    subcategory: "Transportation",
    stage: "Bidding",
    bidDate: "Apr 10, 2025",
    estimatedValue: "$500M+",
    description: "5.6 mile extension of the Red Line rail service. Includes new stations, tracks, and signaling systems.",
    owner: "Chicago Transit Authority",
    trades: ["Heavy Civil", "Rail", "Concrete", "Electrical", "Signaling"],
    documentsAvailable: true,
    addendaAvailable: true,
    privatelyFunded: false,
    postedDate: "1 week ago",
    sector: "Public (Local)",
    constructionType: "New Construction",
    laborRequirements: "Union",
    country: "United States",
    county: "Cook",
    materials: ["Steel", "Concrete", "Electrical Gear"],
    experienceRequired: "10+ Years in Business",
    bondedRequired: true,
    insuredRequired: true
  },
  {
    id: "12",
    title: "Denver Public Library Modernization",
    projectId: "CC-2024-16004",
    location: "10 W 14th Ave Pkwy",
    city: "Denver",
    state: "Colorado",
    category: "Government",
    subcategory: "Library",
    stage: "Post-Bid",
    estimatedValue: "$10M - $15M",
    description: "Modernization of central library branch including new children's wing, technology center, and HVAC upgrades.",
    owner: "City of Denver",
    trades: ["General Construction", "HVAC", "Flooring", "Drywall", "Painting"],
    documentsAvailable: false,
    addendaAvailable: false,
    privatelyFunded: false,
    matchScore: 4,
    postedDate: "2 weeks ago",
    sector: "Public (Local)",
    constructionType: "Renovation / Retrofit",
    laborRequirements: "Prevailing Wage",
    country: "United States",
    county: "Denver",
    materials: ["HVAC Equipment", "Flooring", "Glass"],
    experienceRequired: "5-10 Years in Business",
    bondedRequired: true,
    insuredRequired: true
  },
  {
    id: "13",
    title: "Phoenix Solar Farm Project",
    projectId: "CC-2024-16005",
    location: "Desert Flats Rd",
    city: "Phoenix",
    state: "Arizona",
    category: "Infrastructure",
    subcategory: "Energy",
    stage: "Planning",
    estimatedValue: "$80M - $100M",
    description: "Development of a 50MW solar photovoltaic power plant. Includes ground grading, racking installation, and substation construction.",
    owner: "AZ Green Energy",
    trades: ["Solar", "Electrical", "Civil", "Fencing"],
    documentsAvailable: true,
    addendaAvailable: false,
    privatelyFunded: true,
    postedDate: "5 days ago",
    sector: "Private",
    constructionType: "New Construction",
    laborRequirements: "Non-Union",
    country: "United States",
    county: "Maricopa",
    materials: ["Solar Panels", "Steel", "Electrical Gear"],
    experienceRequired: "5-10 Years in Business",
    bondedRequired: true,
    insuredRequired: true
  },
  {
    id: "14",
    title: "NYC High-Rise Condo Tower",
    projectId: "CC-2024-16006",
    location: "5th Avenue",
    city: "New York",
    state: "New York",
    category: "Residential",
    subcategory: "Multi-Family",
    stage: "Under Construction",
    estimatedValue: "$150M - $200M",
    description: "60-story luxury condominium tower in Midtown. High-end finishes, curtain wall facade, and automated parking system.",
    owner: "Manhattan Developers",
    trades: ["Concrete", "Curtain Wall", "MEP", "Interior Finishes"],
    documentsAvailable: true,
    addendaAvailable: true,
    privatelyFunded: true,
    matchScore: 7,
    postedDate: "2 days ago",
    sector: "Private",
    constructionType: "New Construction",
    laborRequirements: "Union",
    country: "United States",
    county: "New York",
    materials: ["Concrete", "Glass", "Steel"],
    experienceRequired: "10+ Years in Business",
    bondedRequired: true,
    insuredRequired: true
  },
  {
    id: "15",
    title: "San Diego Naval Base Pier Upgrade",
    projectId: "CC-2024-16007",
    location: "Naval Base San Diego",
    city: "San Diego",
    state: "California",
    category: "Government",
    subcategory: "Military",
    stage: "Bidding",
    bidDate: "May 20, 2025",
    estimatedValue: "$60M - $80M",
    description: "Structural upgrades to Pier 12, including pile driving, concrete deck replacement, and utility upgrades.",
    owner: "US Navy & NAVFAC",
    trades: ["Marine Construction", "Piling", "Concrete", "Utilities"],
    documentsAvailable: true,
    addendaAvailable: true,
    privatelyFunded: false,
    matchScore: 5,
    postedDate: "4 days ago",
    sector: "Public (Federal)",
    constructionType: "Renovation / Retrofit",
    laborRequirements: "Prevailing Wage",
    country: "United States",
    county: "San Diego",
    materials: ["Concrete", "Steel", "Marine Hardware"],
    experienceRequired: "10+ Years in Business",
    bondedRequired: true,
    insuredRequired: true
  },
  {
    id: "16",
    title: "Atlanta Mixed-Use Development",
    projectId: "CC-2024-16008",
    location: "Peachtree St",
    city: "Atlanta",
    state: "Georgia",
    category: "Mixed-Use",
    subcategory: "Retail/Office",
    stage: "Planning",
    estimatedValue: "$40M - $55M",
    description: "Redevelopment of city block into mixed-use destination with ground floor retail, offices above, and rooftop park.",
    owner: "Peach State Properties",
    trades: ["Demolition", "General Construction", "Masonry", "Landscaping"],
    documentsAvailable: false,
    addendaAvailable: false,
    privatelyFunded: true,
    postedDate: "6 days ago",
    sector: "Private",
    constructionType: "Demolition",
    laborRequirements: "Non-Union",
    country: "United States",
    county: "Fulton",
    materials: ["Brick", "Steel", "Concrete"],
    experienceRequired: "5-10 Years in Business",
    bondedRequired: false,
    insuredRequired: true
  },
  {
    id: "17",
    title: "Las Vegas Casino Arena",
    projectId: "CC-2024-16009",
    location: "The Strip",
    city: "Las Vegas",
    state: "Nevada",
    category: "Hospitality",
    subcategory: "Entertainment",
    stage: "Bidding",
    bidDate: "Jun 15, 2025",
    estimatedValue: "$300M - $400M",
    description: "New 18,000 seat arena for concerts and sporting events adjacent to major resort. State-of-the-art acoustics and lighting.",
    owner: "Vegas Ent Group",
    trades: ["Steel Erection", "Concrete", "Acoustics", "Electrical", "HVAC"],
    documentsAvailable: true,
    addendaAvailable: true,
    privatelyFunded: true,
    matchScore: 6,
    postedDate: "1 week ago",
    sector: "Private",
    constructionType: "New Construction",
    laborRequirements: "Union",
    country: "United States",
    county: "Clark",
    materials: ["Steel", "Concrete", "Acoustic Panels"],
    experienceRequired: "10+ Years in Business",
    bondedRequired: true,
    insuredRequired: true
  },
  {
    id: "18",
    title: "Philadelphia Historic Townhouse Restoration",
    projectId: "CC-2024-16010",
    location: "Society Hill",
    city: "Philadelphia",
    state: "Pennsylvania",
    category: "Residential",
    subcategory: "Restoration",
    stage: "Under Construction",
    estimatedValue: "$2M - $3M",
    description: "Meticulous restoration of 18th-century townhomes. Brick repointing, window restoration, and interior modernization.",
    owner: "Philly Preservation Trust",
    trades: ["Masonry", "Carpentry", "Restoration", "Plastering"],
    documentsAvailable: true,
    addendaAvailable: false,
    privatelyFunded: true,
    postedDate: "2 weeks ago",
    sector: "Private",
    constructionType: "Renovation / Retrofit",
    laborRequirements: "Non-Union",
    country: "United States",
    county: "Philadelphia",
    materials: ["Brick", "Wood", "Plaster"],
    experienceRequired: "1-5 Years in Business",
    bondedRequired: false,
    insuredRequired: true
  },
  {
    id: "19",
    title: "Nashville Music Center",
    projectId: "CC-2024-16011",
    location: "Music Row",
    city: "Nashville",
    state: "Tennessee",
    category: "Commercial",
    subcategory: "Entertainment",
    stage: "Bidding",
    bidDate: "Apr 05, 2025",
    estimatedValue: "$55M - $65M",
    description: "New recording studio complex and office space for music industry professionals. Soundproof construction requirements.",
    owner: "Music City Dev",
    trades: ["General Construction", "Acoustics", "Electrical", "HVAC"],
    documentsAvailable: true,
    addendaAvailable: true,
    privatelyFunded: true,
    matchScore: 5,
    postedDate: "1 day ago",
    sector: "Private",
    constructionType: "New Construction",
    laborRequirements: "Non-Union",
    country: "United States",
    county: "Davidson",
    materials: ["Acoustic Panels", "Drywall", "HVAC Equipment"],
    experienceRequired: "5-10 Years in Business",
    bondedRequired: true,
    insuredRequired: true
  },
  {
    id: "20",
    title: "Detroit Automotive Plant Retooling",
    projectId: "CC-2024-16012",
    location: "Motor City Blvd",
    city: "Detroit",
    state: "Michigan",
    category: "Industrial",
    subcategory: "Manufacturing",
    stage: "Post-Bid",
    estimatedValue: "$150M - $180M",
    description: "Retooling of existing assembly plant for electric vehicle production. Equipment foundations, conveyor modifications, and utility upgrades.",
    owner: "AutoMaker Inc",
    trades: ["Industrial", "Electrical", "Mechanical", "Concrete"],
    documentsAvailable: false,
    addendaAvailable: false,
    privatelyFunded: true,
    postedDate: "3 days ago",
    sector: "Private",
    constructionType: "Renovation / Retrofit",
    laborRequirements: "Union",
    country: "United States",
    county: "Wayne",
    materials: ["Steel", "Concrete", "Electrical Gear"],
    experienceRequired: "10+ Years in Business",
    bondedRequired: true,
    insuredRequired: true
  },
  {
    id: "21",
    title: "Charlotte Banking Tower Renovation",
    projectId: "CC-2024-16013",
    location: "Tryon St",
    city: "Charlotte",
    state: "North Carolina",
    category: "Commercial",
    subcategory: "Office",
    stage: "Planning",
    estimatedValue: "$12M - $18M",
    description: "Lobby and common area renovation of 40-story office tower. High-end stone finishes and new lighting.",
    owner: "Bank Plaza LLC",
    trades: ["Interior Finishes", "Stone/Tile", "Electrical", "Painting"],
    documentsAvailable: true,
    addendaAvailable: false,
    privatelyFunded: true,
    matchScore: 4,
    postedDate: "5 days ago",
    sector: "Private",
    constructionType: "Renovation / Retrofit",
    laborRequirements: "Non-Union",
    country: "United States",
    county: "Mecklenburg",
    materials: ["Stone", "Glass", "Lighting Fixtures"],
    experienceRequired: "5-10 Years in Business",
    bondedRequired: true,
    insuredRequired: true
  },
  {
    id: "22",
    title: "Indianapolis Sports Complex",
    projectId: "CC-2024-16014",
    location: "Capitol Ave",
    city: "Indianapolis",
    state: "Indiana",
    category: "Recreation",
    subcategory: "Sports",
    stage: "Bidding",
    bidDate: "May 01, 2025",
    estimatedValue: "$25M - $30M",
    description: "New indoor sports facility with basketball courts, indoor soccer, and training rooms.",
    owner: "Indy Sports Prop",
    trades: ["General Construction", "Flooring", "HVAC", "Plumbing"],
    documentsAvailable: true,
    addendaAvailable: true,
    privatelyFunded: true,
    postedDate: "2 days ago",
    sector: "Private",
    constructionType: "New Construction",
    laborRequirements: "Non-Union",
    country: "United States",
    county: "Marion",
    materials: ["Sports Flooring", "Steel", "Concrete"],
    experienceRequired: "5-10 Years in Business",
    bondedRequired: true,
    insuredRequired: true
  },
  {
    id: "23",
    title: "New Orleans Flood Wall Reinforcement",
    projectId: "CC-2024-16015",
    location: "Canal St",
    city: "New Orleans",
    state: "Louisiana",
    category: "Infrastructure",
    subcategory: "Flood Control",
    stage: "Bidding",
    bidDate: "May 15, 2025",
    estimatedValue: "$90M - $110M",
    description: "Reinforcement and heightening of existing flood walls along major canal. Sheet pile driving and concrete capping.",
    owner: "US Army Corps of Engineers",
    trades: ["Heavy Civil", "Marine", "Piling", "Concrete"],
    documentsAvailable: true,
    addendaAvailable: true,
    privatelyFunded: false,
    postedDate: "1 week ago",
    sector: "Public (Federal)",
    constructionType: "Renovation / Retrofit",
    laborRequirements: "Davis-Bacon",
    country: "United States",
    county: "Orleans",
    materials: ["Sheet Pile", "Concrete", "Steel"],
    experienceRequired: "10+ Years in Business",
    bondedRequired: true,
    insuredRequired: true
  }
];

const features = [
  {
    title: "Project Discovery",
    description: "Access a centralized database of construction projects at various stages, from planning to bidding."
  },
  {
    title: "Comprehensive Details",
    description: "Get detailed information for each project, including descriptions, documents, required trades, and contact info."
  },
  {
    title: "Bid Management",
    description: "Easily submit bid inquiries and track your interactions with project owners and general contractors."
  },
  {
    title: "Filtering & Search",
    description: "Find projects that match your expertise and location using advanced filtering and search tools."
  },
  {
    title: "Document Access",
    description: "Download plans, specifications, and addenda directly from the project detail page."
  },
  {
    title: "Real-time Updates",
    description: "Stay informed with updates on project status, bid dates, and new document postings."
  }
];

const benefits = [
  "Uncover new business opportunities and grow your pipeline with a steady stream of project leads.",
  "Save time and effort by finding all relevant project information and documents in one place.",
  "Filter and choose projects that align perfectly with your company's specialties and resource availability.",
  "Streamline your bidding process by submitting inquiries and tracking your progress directly through the platform.",
  "Ensure you're bidding on the right projects by accessing detailed project specifications and requirements.",
  "Stay ahead of the competition with real-time notifications about new projects and critical updates."
];

const Projects = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const showListing = searchParams.get("view") === "listing";
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("query") || "");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list" as "list" | "grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [savedProjects, setSavedProjects] = useState<string[]>([]);
  const [filters, setFilters] = useState<ProjectFilterState | null>(() => {
    const loc = searchParams.get("location");
    if (loc) {
      return {
        location: loc,
        radius: 50,
        keywords: "",
        stages: [],
        solicitationStatus: [],
        categories: [],
        sectors: [],
        constructionTypes: [],
        laborRequirements: [],
        documentsOnly: false,
        savedOnly: false,
        state: "",
        city: "",
        county: "",
        publishDate: "any",
        biddingWithin: "any",
        materials: [],
        experienceLevel: "",
        bonded: false,
        insured: false,
        specAlerts: false,
      };
    }
    return null;
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const projectsPerPage = 10;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const data = await getProjectDiscovery();

        // Map backend data to local Project interface if necessary
        const mappedProjects: Project[] = data.map((p: any) => ({
          id: p.id.toString(),
          title: p.name,
          projectId: `PRJ-${p.id.toString().substring(0, 8)}`,
          location: p.location,
          city: p.location.split(',')[0].trim(),
          state: p.location.split(',')[1]?.trim() || "TX",
          category: p.category,
          subcategory: p.projectType,
          stage: p.status === 'Open' ? 'Bidding' :
            p.status === 'Bidding' ? 'Bidding' :
              p.status === 'Planning' ? 'Planning' :
                p.status === 'Closed' ? 'Post-Bid' :
                  p.status === 'Awarded' ? 'Under Construction' : 'Planning',
          bidDate: p.deadline,
          estimatedValue: p.budget,
          description: p.description,
          owner: p.owner,
          trades: p.trades || [],
          documentsAvailable: true, // DB shows documents linked elsewhere, defaulting to true for marketplace
          addendaAvailable: false,
          privatelyFunded: p.sector === 'private',
          matchScore: p.matchScore / 10, // Scale to 1-10
          postedDate: p.posted,
          sector: p.sector,
          status: p.status,
          source: p.source,
          nigpCode: p.nigpCode
        }));

        setProjects(mappedProjects);
      } catch (error) {
        console.error("Failed to fetch projects from database:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (showListing) {
      fetchProjects();
    }
  }, [showListing]);

  const filteredProjects = useMemo(() => {
    const source = projects.length > 0 ? projects : MOCK_PROJECTS;
    const filtered = source
      .filter(p => {
        // 1. Header Search Phrase
        const matchesSearch = !searchQuery ||
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.trades.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

        if (!filters) return matchesSearch;

        // 2. Keywords filter
        const keywords = filters.keywords?.toLowerCase() || "";
        const matchesKeywords = !keywords ||
          p.title.toLowerCase().includes(keywords) ||
          p.description.toLowerCase().includes(keywords);

        // 3. Location/Radius filter
        const matchesLocation = !filters.location ||
          p.city.toLowerCase().includes(filters.location.toLowerCase()) ||
          p.state.toLowerCase().includes(filters.location.toLowerCase());

        const matchesMileage = !filters.radius || (p.matchScore || 0) >= (10 - filters.radius / 20); // Mock radius match

        // 4. NIGP Code
        const matchesNigp = !filters.nigpCode || (p.nigpCode && p.nigpCode.includes(filters.nigpCode));

        // 5. Project Types / Categories
        const matchesType = filters.categories.length === 0 || filters.categories.includes(p.category);

        // 6. Status
        const matchesStatus = filters.solicitationStatus.length === 0 || filters.solicitationStatus.includes(p.status || "");

        // 7. Sources
        const matchesSource = filters.sources.length === 0 || filters.sources.includes(p.source || "");

        // 8. Trades
        const matchesTrades = filters.trades.length === 0 ||
          p.trades.some(t => filters.trades.some(ft => t.toLowerCase().includes(ft.toLowerCase())));

        // 9. Budget
        const getBudgetValue = (b: string) => {
          const numeric = parseFloat(b.replace(/[^0-9.]/g, ''));
          if (isNaN(numeric)) return 0;
          if (b.toLowerCase().includes('m')) return numeric * 1000000;
          if (b.toLowerCase().includes('k')) return numeric * 1000;
          return numeric;
        };
        const projectPrice = getBudgetValue(p.estimatedValue.split('-')[0]);
        const minB = filters.minBudget ? parseFloat(filters.minBudget) : -Infinity;
        const maxB = filters.maxBudget ? parseFloat(filters.maxBudget) : Infinity;
        const matchesBudget = projectPrice >= minB && projectPrice <= maxB;

        // 10. Size
        const sqftMatch = p.description.match(/(\d+,?\d*) SF/);
        const projectSqft = sqftMatch ? parseInt(sqftMatch[1].replace(/,/g, '')) : 0;
        const minS = filters.minSize ? parseInt(filters.minSize) : -Infinity;
        const maxS = filters.maxSize ? parseInt(filters.maxSize) : Infinity;
        const matchesSize = projectSqft >= minS && projectSqft <= maxS;

        // 11. Bid Due
        const bidDateObj = p.bidDate ? new Date(p.bidDate) : null;
        const today = new Date();
        const diffDays = bidDateObj ? Math.ceil((bidDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : Infinity;

        const matchesUrgency = !filters.biddingWithin || filters.biddingWithin === 'any' ||
          (filters.biddingWithin === '7' && diffDays <= 7) ||
          (filters.biddingWithin === '30' && diffDays <= 30);

        // 12. State/City/County (Region Specific)
        const matchesRegion = (filters.state === "All" || !filters.state || p.state === filters.state || (p.state === "TX" && filters.state === "Texas")) &&
          (filters.city === "All" || !filters.city || p.city === filters.city) &&
          (filters.county === "All" || !filters.county || p.county === filters.county);

        // 13. Other filters
        const matchesDocs = !filters.documentsOnly || p.documentsAvailable;
        const matchesSaved = !filters.savedOnly || savedProjects.includes(p.id);
        const matchesMaterials = filters.materials.length === 0 || p.materials?.some(m => filters.materials.includes(m));
        const matchesExp = !filters.experienceLevel || p.experienceRequired === filters.experienceLevel;
        const matchesBonded = !filters.bonded || p.bondedRequired === true;
        const matchesInsured = !filters.insured || p.insuredRequired === true;

        return matchesSearch && matchesKeywords && matchesLocation && matchesMileage &&
          matchesNigp && matchesType && matchesStatus && matchesSource &&
          matchesTrades && matchesBudget && matchesSize && matchesUrgency &&
          matchesRegion && matchesDocs && matchesSaved && matchesMaterials &&
          matchesExp && matchesBonded && matchesInsured;
      });

    const result = [...filtered];

    // Sort
    switch (sortBy) {
      case "newest":
        // Already sorted by newest in mock data
        break;
      case "bidDate":
        result.sort((a, b) => {
          if (!a.bidDate) return 1;
          if (!b.bidDate) return -1;
          return new Date(a.bidDate).getTime() - new Date(b.bidDate).getTime();
        });
        break;
      case "valueHigh":
        result.sort((a, b) => {
          const getMaxValue = (str: string) => {
            const match = str.match(/\$(\d+)M/g);
            if (match) {
              const values = match.map((m) => parseInt(m.replace(/\$|M/g, "")));
              return Math.max(...values);
            }
            return 0;
          };
          return getMaxValue(b.estimatedValue) - getMaxValue(a.estimatedValue);
        });
        break;
      case "valueLow":
        result.sort((a, b) => {
          const getMinValue = (str: string) => {
            const match = str.match(/\$(\d+)M/g);
            if (match) {
              const values = match.map((m) => parseInt(m.replace(/\$|M/g, "")));
              return Math.min(...values);
            }
            return 0;
          };
          return getMinValue(a.estimatedValue) - getMinValue(b.estimatedValue);
        });
        break;
      case "matchScore":
        result.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        break;
    }

    return result;
  }, [projects, searchQuery, sortBy, filters, savedProjects]);

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  );

  const handleSaveProject = (id: string) => {
    setSavedProjects((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  if (!showListing) {
    return (
      <ProductServiceTemplate
        title="Find Projects"
        subtitle="For Contractors"
        description="Our Find Projects page is the primary entry point for contractors and construction professionals to discover potential job opportunities. Browse through thousands of active projects, download documents, and submit bids directly."
        icon={Search}
        features={features}
        benefits={benefits}
        ctaText="Browse Projects"
        onCtaClick={() => {
          setSearchParams({ view: "listing" });
          window.scrollTo(0, 0);
        }}
        secondaryCtaText="Contact Us"
        secondaryCtaLink="/contact"
        accentColor="#EAB308"
        heroImage="/assets/projects-hero.png"
        secondaryImage="/assets/benefits-image.png"
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ReduxHeader />
      <section className="flex-1 py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="mb-8 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-border">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
              <div>
                <h2 className="text-3xl font-black text-foreground mb-2 uppercase tracking-tight">
                  Browse Projects
                </h2>
                <p className="text-muted-foreground font-medium">
                  {filteredProjects.length} construction opportunities found in your region
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="gap-2 rounded-xl h-11 px-5 border-border hover:bg-muted font-bold transition-all">
                  <Bookmark className={`w-4 h-4 ${savedProjects.length > 0 ? "fill-accent text-accent" : ""}`} />
                  Saved ({savedProjects.length})
                </Button>
                <Button variant="accent" className="gap-2 rounded-xl h-11 px-5 shadow-lg shadow-yellow-400/20 transition-all">
                  <Bell className="w-4 h-4" />
                  Alert Me
                </Button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-3xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by project name, ID, location, or trade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg rounded-xl border-border bg-muted/50 focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar - Desktop */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24">
                <ProjectFilters onFiltersChange={setFilters} initialFilters={filters} />
              </div>
            </aside>

            {/* Projects List */}
            <div className="flex-1 min-w-0">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-border shadow-sm">
                  <Loader2 className="w-12 h-12 text-accent animate-spin mb-4" />
                  <p className="text-muted-foreground font-medium animate-pulse">Establishing secure link to project database...</p>
                </div>
              ) : (
                <>
                  {/* Toolbar */}
                  <div className="flex items-center justify-between gap-4 mb-6 p-4 bg-white dark:bg-gray-900 rounded-xl border border-border shadow-sm">
                    <div className="flex items-center gap-3">
                      {/* Mobile Filter Button */}
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="outline" size="sm" className="lg:hidden gap-2 h-10 rounded-lg">
                            <SlidersHorizontal className="w-4 h-4" />
                            Filters
                          </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-full sm:w-96 p-0 border-r-0">
                          <SheetHeader className="p-4 border-b">
                            <SheetTitle className="text-xl font-black uppercase">Filter Projects</SheetTitle>
                          </SheetHeader>
                          <ProjectFilters onFiltersChange={setFilters} initialFilters={filters} />
                        </SheetContent>
                      </Sheet>

                      {/* Sort */}
                      <div className="flex items-center gap-2">
                        <ArrowUpDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger className="w-[180px] h-10 rounded-lg border-border font-medium">
                            <SelectValue placeholder="Sort by" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="newest" className="font-medium">Newest First</SelectItem>
                            <SelectItem value="bidDate" className="font-medium">Bid Date</SelectItem>
                            <SelectItem value="valueHigh" className="font-medium">Value: High to Low</SelectItem>
                            <SelectItem value="valueLow" className="font-medium">Value: Low to High</SelectItem>
                            <SelectItem value="matchScore" className="font-medium">Match Score</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1 border border-border">
                      <Button
                        variant={viewMode === "list" ? "white" : "ghost"}
                        size="sm"
                        className={`h-8 w-8 p-0 rounded-md transition-all ${viewMode === "list" ? "shadow-sm" : ""}`}
                        onClick={() => setViewMode("list")}
                      >
                        <List className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === "grid" ? "white" : "ghost"}
                        size="sm"
                        className={`h-8 w-8 p-0 rounded-md transition-all ${viewMode === "grid" ? "shadow-sm" : ""}`}
                        onClick={() => setViewMode("grid")}
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Project Cards */}
                  <div className={viewMode === "grid" ? "grid md:grid-cols-2 gap-6" : "space-y-6"}>
                    {paginatedProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onSave={handleSaveProject}
                        isSaved={savedProjects.includes(project.id)}
                      />
                    ))}
                  </div>

                  {/* Empty State */}
                  {paginatedProjects.length === 0 && (
                    <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-border shadow-sm">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-black text-foreground mb-2 uppercase">
                        No projects found
                      </h3>
                      <p className="text-muted-foreground mb-8 font-medium">
                        We couldn't find any projects matching your current search or filter criteria.
                      </p>
                      <Button
                        onClick={() => {
                          setSearchQuery("");
                          setSortBy("newest");
                        }}
                        variant="accent"
                        className="h-11 px-8 rounded-xl transition-all"
                      >
                        Reset All Filters
                      </Button>
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-12">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-10 h-10 rounded-xl"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                      <div className="flex items-center gap-2">
                        {[...Array(totalPages)].map((_, i) => (
                          <Button
                            key={i}
                            variant={currentPage === i + 1 ? "default" : "outline"}
                            className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPage === i + 1 ? "bg-black text-white hover:bg-black/90" : "hover:bg-muted"
                              }`}
                            onClick={() => setCurrentPage(i + 1)}
                          >
                            {i + 1}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-10 h-10 rounded-xl"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Projects;
