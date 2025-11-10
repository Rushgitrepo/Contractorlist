import { useParams, useNavigate, Link } from "react-router-dom";
import ReduxHeader from "@/components/ReduxHeader";
import Footer from "@/components/Footer";
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
  ArrowLeft,
  CheckCircle2,
  Star,
  Clock,
  Award,
  Target,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceData {
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

const ServiceDetail = () => {
  const { serviceName } = useParams<{ serviceName: string }>();
  const navigate = useNavigate();

  // Helper function to generate service slug
  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
  };

  // Service data mapping
  const servicesData: Record<string, ServiceData> = {
    "bid-management": {
      name: "Bid Management",
      icon: FileText,
      description: "Streamlined bidding processes",
      category: "Preconstruction & Management",
      fullDescription:
        "Our comprehensive bid management service streamlines the entire bidding process from initial RFP to final submission. We leverage cutting-edge technology and industry expertise to ensure your bids are competitive, compliant, and professionally presented. Our team manages all aspects of the bidding lifecycle, including document preparation, subcontractor coordination, and submission tracking.",
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
        "Precision cost estimating services that provide detailed, accurate project budgets. Our experienced estimators use industry-leading software and databases to deliver comprehensive cost breakdowns for projects of all sizes. From conceptual estimates to detailed quantity takeoffs, we ensure your project starts with a solid financial foundation.",
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
        "Complete tender management services that handle every aspect of the tendering process. From initial tender identification to final contract award, we manage documentation, compliance, submissions, and negotiations. Our systematic approach ensures nothing falls through the cracks and maximizes your success rate.",
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
    "procurement-pre-contract": {
      name: "Procurement & Pre-Contract",
      icon: ShoppingCart,
      description: "Strategic procurement solutions",
      category: "Preconstruction & Management",
      fullDescription:
        "Strategic procurement and pre-contract services that optimize your supply chain and vendor relationships. We handle everything from vendor selection and contract negotiations to material sourcing and logistics planning. Our approach ensures you get the best value while maintaining quality and schedule requirements.",
      benefits: [
        "Cost savings through strategic sourcing",
        "Reduced procurement cycle times",
        "Better vendor terms and conditions",
        "Quality assurance in material selection",
        "Risk mitigation in supply chain",
        "Improved project cash flow",
      ],
      features: [
        "Vendor qualification and selection",
        "Contract negotiation support",
        "Material sourcing and pricing",
        "Supply chain optimization",
        "Pre-qualification processes",
        "Contract document preparation",
        "Terms and conditions review",
        "Procurement strategy development",
      ],
      process: [
        "Procurement needs assessment",
        "Vendor research and qualification",
        "RFQ/RFP development and distribution",
        "Bid evaluation and comparison",
        "Contract negotiation and finalization",
        "Award and mobilization support",
      ],
      pricing: "Percentage of procurement value or fixed fee",
      duration: "4-8 weeks typical procurement cycle",
      expertise: "Certified procurement professionals",
    },
    "project-scheduling": {
      name: "Project Scheduling",
      icon: Calendar,
      description: "Optimized timelines and milestones",
      category: "Preconstruction & Management",
      fullDescription:
        "Professional project scheduling services using industry-standard tools like Primavera P6 and Microsoft Project. We create detailed, realistic schedules that account for all project activities, dependencies, and constraints. Our schedules serve as roadmaps for successful project execution and provide early warning of potential delays.",
      benefits: [
        "Realistic project timelines",
        "Better resource allocation",
        "Early identification of delays",
        "Improved coordination between trades",
        "Enhanced stakeholder communication",
        "Reduced project duration",
      ],
      features: [
        "Critical path analysis",
        "Resource leveling and optimization",
        "What-if scenario planning",
        "Progress tracking and updates",
        "Milestone management",
        "Schedule compression techniques",
        "Integration with project management tools",
        "Visual schedule presentations",
      ],
      process: [
        "Project scope and WBS development",
        "Activity identification and sequencing",
        "Duration and resource estimation",
        "Schedule development and optimization",
        "Baseline establishment",
        "Ongoing monitoring and updates",
      ],
      pricing: "$3,000 - $20,000 based on project complexity",
      duration: "2-4 weeks for initial schedule",
      expertise: "PSP certified scheduling professionals",
    },
    "design-drafting": {
      name: "Design & Drafting",
      icon: PenTool,
      description: "CAD drafting and detailing",
      category: "Design & Modeling",
      fullDescription:
        "Professional CAD drafting and design services for construction projects of all types. Our experienced drafters create accurate, detailed drawings that meet industry standards and local building codes. From concept sketches to construction documents, we deliver high-quality drawings that facilitate smooth project execution.",
      benefits: [
        "Accurate construction documentation",
        "Reduced field conflicts and RFIs",
        "Faster permit approvals",
        "Better cost control",
        "Improved constructability",
        "Professional presentation to clients",
      ],
      features: [
        "2D CAD drafting (AutoCAD)",
        "Construction detail drawings",
        "As-built documentation",
        "Shop drawing preparation",
        "Code compliance verification",
        "Coordination with other disciplines",
        "Revision management",
        "PDF and DWG deliverables",
      ],
      process: [
        "Project requirements gathering",
        "Preliminary design development",
        "Detailed drawing production",
        "Internal quality review",
        "Client review and revisions",
        "Final deliverable preparation",
      ],
      pricing: "$75 - $150 per hour or fixed price per sheet",
      duration: "1-6 weeks depending on scope",
      expertise: "Licensed architects and experienced drafters",
    },
    "bim-3d-modeling": {
      name: "BIM & 3D Modeling",
      icon: Layers,
      description: "Coordination and clash checks",
      category: "Design & Modeling",
      fullDescription:
        "Advanced Building Information Modeling (BIM) services that bring your project to life in 3D. We create intelligent models that contain rich data about every building component. Our BIM coordination services identify and resolve conflicts before construction begins, saving time and money while improving quality.",
      benefits: [
        "Reduced construction conflicts",
        "Better visualization for stakeholders",
        "Improved coordination between trades",
        "Accurate quantity takeoffs",
        "Enhanced facility management data",
        "Reduced change orders",
      ],
      features: [
        "3D BIM modeling (Revit, Navisworks)",
        "Clash detection and resolution",
        "4D scheduling integration",
        "5D cost integration",
        "MEP coordination",
        "Structural modeling",
        "Architectural modeling",
        "Virtual design reviews",
      ],
      process: [
        "Model requirements planning (BEP)",
        "Discipline model development",
        "Multi-discipline coordination",
        "Clash detection and resolution",
        "Model validation and QA/QC",
        "Final model delivery and training",
      ],
      pricing: "$5,000 - $50,000+ based on project size",
      duration: "4-12 weeks typical modeling timeline",
      expertise: "BIM certified professionals and coordinators",
    },
    "additions-remodels": {
      name: "Additions & Remodels",
      icon: Home,
      description: "Home expansion and renovation",
      category: "Construction Trades",
      fullDescription:
        "Transform your existing space with our professional addition and remodeling services. Whether you're adding a new room, expanding your kitchen, or renovating your entire home, our experienced team delivers quality craftsmanship and attention to detail. We handle everything from design to final finishes.",
      benefits: [
        "Increased home value and functionality",
        "Seamless integration with existing structure",
        "Quality craftsmanship guaranteed",
        "Minimal disruption to daily life",
        "Energy efficiency improvements",
        "Personalized design solutions",
      ],
      features: [
        "Custom design and planning",
        "Structural modifications",
        "Kitchen and bathroom remodels",
        "Room additions and extensions",
        "Basement finishing",
        "Permit acquisition and management",
        "Project management and coordination",
        "Quality materials and finishes",
      ],
      process: [
        "Initial consultation and site assessment",
        "Design development and planning",
        "Permit applications and approvals",
        "Demolition and preparation",
        "Construction and installation",
        "Final inspection and walkthrough",
      ],
      pricing: "$50,000 - $250,000+ depending on scope",
      duration: "2-6 months typical project timeline",
      expertise: "Licensed contractors with 20+ years experience",
    },
    "complete-website": {
      name: "Complete Website",
      icon: Globe,
      description: "Design, build and launch",
      category: "Marketing & Growth",
      fullDescription:
        "Full-service website design and development tailored for construction businesses. We create modern, mobile-responsive websites that showcase your work, generate leads, and establish your online presence. From initial concept to launch and beyond, we handle every aspect of your digital presence.",
      benefits: [
        "Professional online presence",
        "24/7 lead generation",
        "Mobile-optimized for all devices",
        "SEO-friendly architecture",
        "Easy content management",
        "Competitive advantage in your market",
      ],
      features: [
        "Custom responsive design",
        "Content management system (CMS)",
        "Project portfolio galleries",
        "Contact forms and lead capture",
        "Google Maps integration",
        "Social media integration",
        "SSL security certificate",
        "Analytics and tracking setup",
      ],
      process: [
        "Discovery and strategy session",
        "Design mockups and revisions",
        "Content development and photography",
        "Website development and testing",
        "SEO optimization and setup",
        "Launch and training",
      ],
      pricing: "$3,000 - $15,000 for complete website",
      duration: "6-12 weeks from start to launch",
      expertise: "Award-winning web design team",
    },
    "digital-marketing": {
      name: "Digital Marketing",
      icon: TrendingUp,
      description: "SEO, SEM and campaigns",
      category: "Marketing & Growth",
      fullDescription:
        "Comprehensive digital marketing services designed to grow your construction business online. We combine SEO, paid advertising, content marketing, and social media to create a powerful online presence that generates qualified leads and builds your brand. Our data-driven approach ensures maximum ROI.",
      benefits: [
        "Increased online visibility",
        "More qualified leads",
        "Better brand recognition",
        "Measurable ROI",
        "Competitive market advantage",
        "Long-term sustainable growth",
      ],
      features: [
        "Search engine optimization (SEO)",
        "Pay-per-click advertising (PPC)",
        "Social media marketing",
        "Content marketing strategy",
        "Email marketing campaigns",
        "Conversion rate optimization",
        "Analytics and reporting",
        "Reputation management",
      ],
      process: [
        "Marketing audit and analysis",
        "Strategy development",
        "Campaign setup and launch",
        "Ongoing optimization",
        "Performance monitoring",
        "Monthly reporting and consultation",
      ],
      pricing: "$1,500 - $10,000+ per month",
      duration: "Ongoing monthly service",
      expertise: "Certified digital marketing specialists",
    },
  };

  // Get service data or show not found
  const serviceKey = serviceName?.toLowerCase().replace(/ /g, "-") || "";
  const service = servicesData[serviceKey];

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ReduxHeader />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Service Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The service you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/services")}>
            Back to Services
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const Icon = service.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50">
      <ReduxHeader />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23fbbf24%22%20fill-opacity%3D%220.4%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/services"
            className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to All Services
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Icon className="w-12 h-12 text-black" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="inline-block px-4 py-1 bg-yellow-400/20 border border-yellow-400 rounded-full text-yellow-400 text-sm font-semibold mb-4">
                {service.category}
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                {service.name}
              </h1>
              <p className="text-xl text-gray-300">{service.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Duration</div>
                <div className="font-semibold text-gray-900">
                  {service.duration}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Expertise</div>
                <div className="font-semibold text-gray-900">
                  {service.expertise}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Pricing</div>
                <div className="font-semibold text-gray-900">
                  {service.pricing}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-12">
              {/* Overview */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Service Overview
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {service.fullDescription}
                </p>
              </div>

              {/* Benefits */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Key Benefits
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Features Included
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Star className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Process */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Our Process
                  </h2>
                </div>
                <div className="space-y-4">
                  {service.process.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {idx + 1}
                      </div>
                      <div className="flex-1 pt-2">
                        <p className="text-gray-700 text-lg">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* CTA Card */}
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl p-8 text-black shadow-2xl">
                  <h3 className="text-2xl font-bold mb-4">
                    Ready to Get Started?
                  </h3>
                  <p className="mb-6 text-black/90">
                    Contact us today for a free consultation and quote.
                  </p>
                  <Link to="/contact-us">
                    <Button className="w-full bg-black hover:bg-gray-900 text-white font-bold py-6 text-lg">
                      Request a Quote
                    </Button>
                  </Link>
                  <div className="mt-6 pt-6 border-t border-black/20">
                    <div className="flex items-center gap-2 text-black/90 mb-2">
                      <Phone className="w-5 h-5" />
                      <span className="font-semibold">Call Us</span>
                    </div>
                    <p className="text-xl font-bold">1-800-CONTRACTOR</p>
                  </div>
                </div>

                {/* Related Services */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Related Services
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(servicesData)
                      .filter(
                        ([key, s]) =>
                          s.category === service.category && key !== serviceKey
                      )
                      .slice(0, 4)
                      .map(([key, s]) => {
                        const RelatedIcon = s.icon;
                        return (
                          <Link
                            key={key}
                            to={`/services/${key}`}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                          >
                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                              <RelatedIcon className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors">
                                {s.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {s.description}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                  </div>
                  <Link to="/services">
                    <Button variant="outline" className="w-full mt-4">
                      View All Services
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServiceDetail;
