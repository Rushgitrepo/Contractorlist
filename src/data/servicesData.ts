import {
  FileText,
  Calculator,
  ClipboardList,
  ShoppingCart,
  Calendar,
  ShieldCheck,
  HardHat,
  PenTool,
  Layers,
  FileCog,
  Briefcase,
  FileSearch,
  Home,
  Wrench,
  Building2,
  Hammer,
  Car,
  Shield,
  Palette,
  TreePine,
  Snowflake,
  Warehouse,
  Zap,
  Square,
  Globe,
  Users,
  Mail,
  Phone,
  Search,
  TrendingUp,
} from "lucide-react";

export interface ServiceData {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  category: string;
  fullDescription: string;
  benefits: string[];
  features: string[];
  process: string[];
  pricing: string;
  duration: string;
  expertise: string;
}

// Default service template for services without detailed data
const createDefaultService = (
  name: string,
  icon: React.ComponentType<{ className?: string }>,
  description: string,
  category: string
): ServiceData => ({
  name,
  icon,
  description,
  category,
  fullDescription: `Our ${name.toLowerCase()} service provides comprehensive solutions tailored to your construction project needs. We combine industry expertise with modern technology to deliver exceptional results that exceed expectations. Our team of professionals ensures quality, efficiency, and attention to detail in every aspect of the service.`,
  benefits: [
    "Professional expertise and quality service",
    "Timely project completion",
    "Cost-effective solutions",
    "Experienced team of specialists",
    "Comprehensive project support",
    "Customer satisfaction guaranteed",
  ],
  features: [
    "Detailed project planning",
    "Quality materials and workmanship",
    "Regular progress updates",
    "Compliance with regulations",
    "Safety protocols",
    "Warranty and support",
    "Flexible scheduling",
    "Competitive pricing",
  ],
  process: [
    "Initial consultation and assessment",
    "Detailed proposal and planning",
    "Project execution and management",
    "Quality control and inspection",
    "Final delivery and walkthrough",
    "Post-project support",
  ],
  pricing: "Contact us for a custom quote",
  duration: "Varies based on project scope",
  expertise: "Experienced professionals with proven track record",
});

export const servicesData: Record<string, ServiceData> = {
  // Preconstruction & Management Services
  "bid-management": {
    name: "Bid Management",
    icon: FileText,
    description: "Streamlined bidding processes",
    category: "Preconstruction & Management",
    fullDescription:
      "Our comprehensive bid management service streamlines the entire bidding process from initial RFP to final submission. We leverage cutting-edge technology and industry expertise to ensure your bids are competitive, compliant, and professionally presented.",
    benefits: [
      "Increased win rates with professionally prepared bids",
      "Time savings through automated workflows",
      "Better cost control and budget accuracy",
      "Improved collaboration with subcontractors",
      "Comprehensive bid tracking and analytics",
      "Reduced errors and omissions",
    ],
    features: [
      "Automated bid document generation",
      "Real-time collaboration tools",
      "Subcontractor management portal",
      "Bid comparison and analysis",
      "Compliance checking and validation",
      "Digital signature integration",
      "Cloud-based document storage",
      "Mobile access for on-the-go bidding",
    ],
    process: [
      "Initial consultation and requirements gathering",
      "RFP/RFQ analysis and breakdown",
      "Subcontractor solicitation and coordination",
      "Cost estimation and pricing strategy",
      "Document preparation and review",
      "Final submission and follow-up",
    ],
    pricing: "Starting at $2,500 per bid",
    duration: "2-4 weeks typical turnaround",
    expertise: "15+ years of bid management experience",
  },

  "cost-estimating": {
    name: "Cost Estimating",
    icon: Calculator,
    description: "Accurate project cost analysis",
    category: "Preconstruction & Management",
    fullDescription:
      "Precision cost estimating services that provide detailed, accurate project budgets. Our experienced estimators use industry-leading software and databases to deliver comprehensive cost breakdowns for projects of all sizes.",
    benefits: [
      "Accurate budgeting prevents cost overruns",
      "Detailed material and labor breakdowns",
      "Competitive pricing intelligence",
      "Risk identification and mitigation",
      "Value engineering opportunities",
      "Faster decision-making with reliable data",
    ],
    features: [
      "3D model-based quantity takeoffs",
      "Historical cost database access",
      "Material pricing updates",
      "Labor rate analysis by region",
      "Equipment cost calculations",
      "Contingency planning",
      "What-if scenario modeling",
      "Detailed cost reports and visualizations",
    ],
    process: [
      "Project scope review and clarification",
      "Quantity takeoff from plans/models",
      "Material and labor pricing research",
      "Equipment and overhead calculations",
      "Risk assessment and contingencies",
      "Final estimate delivery and presentation",
    ],
    pricing: "From $1,500 - $15,000 based on project size",
    duration: "1-3 weeks depending on complexity",
    expertise: "Certified Professional Estimators on staff",
  },

  "tenders-management": {
    name: "Tenders Management",
    icon: ClipboardList,
    description: "Efficient tender workflows",
    category: "Preconstruction & Management",
    fullDescription:
      "Complete tender management services that handle every aspect of the tendering process. From initial tender identification to final contract award, we manage documentation, compliance, submissions, and negotiations.",
    benefits: [
      "Higher tender success rates",
      "Reduced administrative burden",
      "Improved compliance and quality",
      "Better vendor relationships",
      "Streamlined approval processes",
      "Enhanced competitive positioning",
    ],
    features: [
      "Tender opportunity monitoring",
      "Document preparation and review",
      "Compliance verification",
      "Multi-party coordination",
      "Deadline tracking and alerts",
      "Submission management",
      "Post-tender negotiations support",
      "Contract award assistance",
    ],
    process: [
      "Tender identification and qualification",
      "Requirements analysis and planning",
      "Documentation preparation",
      "Internal and external coordination",
      "Quality assurance and compliance check",
      "Submission and follow-up",
    ],
    pricing: "Custom pricing based on tender complexity",
    duration: "Varies by tender requirements",
    expertise: "Specialized tender management team",
  },

  "procurement-pre-contract": createDefaultService(
    "Procurement & Pre-Contract",
    ShoppingCart,
    "Strategic procurement solutions",
    "Preconstruction & Management"
  ),

  "project-scheduling": createDefaultService(
    "Project Scheduling",
    Calendar,
    "Optimized timelines and milestones",
    "Preconstruction & Management"
  ),

  "quality-control": createDefaultService(
    "Quality Control",
    ShieldCheck,
    "Standards, testing and compliance",
    "Preconstruction & Management"
  ),

  "safety-management": createDefaultService(
    "Safety Management",
    HardHat,
    "On-site safety programs",
    "Preconstruction & Management"
  ),

  "contract-administration": createDefaultService(
    "Contract Administration",
    FileCog,
    "Contracts, changes and docs",
    "Preconstruction & Management"
  ),

  "site-supervision": createDefaultService(
    "Site Supervision",
    Briefcase,
    "Daily coordination and oversight",
    "Preconstruction & Management"
  ),

  "permits-approvals": createDefaultService(
    "Permits & Approvals",
    FileSearch,
    "Regulatory submissions",
    "Preconstruction & Management"
  ),

  "risk-management": createDefaultService(
    "Risk Management",
    Shield,
    "Project risk assessment and mitigation",
    "Preconstruction & Management"
  ),

  "value-engineering": createDefaultService(
    "Value Engineering",
    TrendingUp,
    "Cost optimization and efficiency",
    "Preconstruction & Management"
  ),

  "feasibility-studies": createDefaultService(
    "Feasibility Studies",
    Search,
    "Project viability analysis",
    "Preconstruction & Management"
  ),

  "environmental-planning": createDefaultService(
    "Environmental Planning",
    TreePine,
    "Environmental impact assessments",
    "Preconstruction & Management"
  ),

  "zoning-land-use": createDefaultService(
    "Zoning & Land Use",
    Building2,
    "Land development planning",
    "Preconstruction & Management"
  ),

  // Design & Modeling Services
  "design-drafting": createDefaultService(
    "Design & Drafting",
    PenTool,
    "CAD drafting and detailing",
    "Design & Modeling"
  ),

  "bim-3d-modeling": createDefaultService(
    "BIM & 3D Modeling",
    Layers,
    "Coordination and clash checks",
    "Design & Modeling"
  ),

  "architects-engineers": createDefaultService(
    "Architects & Engineers",
    Building2,
    "Full design and engineering",
    "Design & Modeling"
  ),

  "structural-engineering": createDefaultService(
    "Structural Engineering",
    Building2,
    "Structural design and analysis",
    "Design & Modeling"
  ),

  "mep-engineering": createDefaultService(
    "MEP Engineering",
    Zap,
    "Mechanical, electrical, plumbing design",
    "Design & Modeling"
  ),

  "interior-design": createDefaultService(
    "Interior Design",
    Palette,
    "Interior space planning and design",
    "Design & Modeling"
  ),

  "landscape-architecture": createDefaultService(
    "Landscape Architecture",
    TreePine,
    "Outdoor space design",
    "Design & Modeling"
  ),

  "3d-visualization": createDefaultService(
    "3D Visualization",
    Layers,
    "Photorealistic renderings",
    "Design & Modeling"
  ),

  "virtual-reality-tours": createDefaultService(
    "Virtual Reality Tours",
    Globe,
    "Immersive project walkthroughs",
    "Design & Modeling"
  ),

  "drone-surveying": createDefaultService(
    "Drone Surveying",
    Search,
    "Aerial site mapping and surveys",
    "Design & Modeling"
  ),

  // Construction Trades
  "additions-remodels": createDefaultService(
    "Additions & Remodels",
    Home,
    "Home expansion and renovation",
    "Construction Trades"
  ),

  "carpentry": createDefaultService(
    "Carpentry",
    Hammer,
    "Framing and finish carpentry",
    "Construction Trades"
  ),

  "plumbing": createDefaultService(
    "Plumbing",
    Wrench,
    "Installations and repairs",
    "Construction Trades"
  ),

  "driveways-patios": createDefaultService(
    "Driveways & Patios",
    Car,
    "Concrete and paving",
    "Construction Trades"
  ),

  "drywall-insulation": createDefaultService(
    "Drywall & Insulation",
    Shield,
    "Walls, ceilings and insulation",
    "Construction Trades"
  ),

  "flooring-hardwood": createDefaultService(
    "Flooring & Hardwood",
    Square,
    "Install and refinishing",
    "Construction Trades"
  ),

  "cabinets-countertops": createDefaultService(
    "Cabinets & Countertops",
    Palette,
    "Custom fabrication and install",
    "Construction Trades"
  ),

  "garages-sheds": createDefaultService(
    "Garages & Sheds",
    Warehouse,
    "Storage and accessory buildings",
    "Construction Trades"
  ),

  "heating-cooling": createDefaultService(
    "Heating & Cooling",
    Snowflake,
    "HVAC install and service",
    "Construction Trades"
  ),

  "appliances": createDefaultService(
    "Appliances",
    Zap,
    "Installation and maintenance",
    "Construction Trades"
  ),

  "fencing-landscaping": createDefaultService(
    "Fencing & Landscaping",
    TreePine,
    "Outdoor structures and yards",
    "Construction Trades"
  ),

  "electrical-services": createDefaultService(
    "Electrical Services",
    Zap,
    "Wiring, panels, and fixtures",
    "Construction Trades"
  ),

  "roofing-gutters": createDefaultService(
    "Roofing & Gutters",
    Home,
    "Roof installation and repair",
    "Construction Trades"
  ),

  "windows-doors": createDefaultService(
    "Windows & Doors",
    Square,
    "Installation and replacement",
    "Construction Trades"
  ),

  "painting-finishing": createDefaultService(
    "Painting & Finishing",
    Palette,
    "Interior and exterior painting",
    "Construction Trades"
  ),

  "tile-stone-work": createDefaultService(
    "Tile & Stone Work",
    Square,
    "Ceramic, marble, and stone installation",
    "Construction Trades"
  ),

  "demolition-services": createDefaultService(
    "Demolition Services",
    Hammer,
    "Safe structure removal",
    "Construction Trades"
  ),

  "waterproofing": createDefaultService(
    "Waterproofing",
    Shield,
    "Basement and foundation sealing",
    "Construction Trades"
  ),

  "pool-spa-construction": createDefaultService(
    "Pool & Spa Construction",
    Snowflake,
    "Swimming pool installation",
    "Construction Trades"
  ),

  "solar-installation": createDefaultService(
    "Solar Installation",
    Zap,
    "Solar panel systems",
    "Construction Trades"
  ),

  // Marketing & Growth Services
  "complete-website": createDefaultService(
    "Complete Website",
    Globe,
    "Design, build and launch",
    "Marketing & Growth"
  ),

  "get-leads": createDefaultService(
    "Get Leads",
    Users,
    "Targeted lead generation",
    "Marketing & Growth"
  ),

  "digital-marketing": createDefaultService(
    "Digital Marketing",
    TrendingUp,
    "SEO, SEM and campaigns",
    "Marketing & Growth"
  ),

  "graphic-designing": createDefaultService(
    "Graphic Designing",
    Palette,
    "Logos, ads and creatives",
    "Marketing & Growth"
  ),

  "get-quotations": createDefaultService(
    "Get Quotations",
    FileText,
    "Request and compare quotes",
    "Marketing & Growth"
  ),

  "social-marketing": createDefaultService(
    "Social Marketing",
    Users,
    "Social media growth",
    "Marketing & Growth"
  ),

  "email-marketing": createDefaultService(
    "Email Marketing",
    Mail,
    "Automations and newsletters",
    "Marketing & Growth"
  ),

  "sms-marketing": createDefaultService(
    "SMS Marketing",
    Phone,
    "Promotions by text",
    "Marketing & Growth"
  ),

  "consultation": createDefaultService(
    "Consultation",
    Users,
    "Strategy and planning",
    "Marketing & Growth"
  ),

  "google-ads": createDefaultService(
    "Google Ads",
    TrendingUp,
    "High‑intent traffic",
    "Marketing & Growth"
  ),

  "seo": createDefaultService(
    "SEO",
    Search,
    "Rank and grow organically",
    "Marketing & Growth"
  ),

  "support-center": createDefaultService(
    "Support Center",
    Users,
    "Help when you need it",
    "Marketing & Growth"
  ),

  "content-marketing": createDefaultService(
    "Content Marketing",
    FileText,
    "Blog posts and articles",
    "Marketing & Growth"
  ),

  "video-production": createDefaultService(
    "Video Production",
    Globe,
    "Promotional and training videos",
    "Marketing & Growth"
  ),

  "photography-services": createDefaultService(
    "Photography Services",
    Palette,
    "Professional project photography",
    "Marketing & Growth"
  ),

  "brand-development": createDefaultService(
    "Brand Development",
    TrendingUp,
    "Brand identity and positioning",
    "Marketing & Growth"
  ),

  "crm-integration": createDefaultService(
    "CRM Integration",
    Users,
    "Customer relationship management",
    "Marketing & Growth"
  ),

  "analytics-reporting": createDefaultService(
    "Analytics & Reporting",
    TrendingUp,
    "Performance tracking and insights",
    "Marketing & Growth"
  ),

  "online-reputation": createDefaultService(
    "Online Reputation",
    Users,
    "Review management and monitoring",
    "Marketing & Growth"
  ),

  "trade-show-marketing": createDefaultService(
    "Trade Show Marketing",
    Globe,
    "Event marketing and displays",
    "Marketing & Growth"
  ),

  "print-marketing": createDefaultService(
    "Print Marketing",
    FileText,
    "Brochures, flyers, and catalogs",
    "Marketing & Growth"
  ),

  "other-services": createDefaultService(
    "Other Services",
    ClipboardList,
    "Custom requests",
    "Marketing & Growth"
  ),
};
