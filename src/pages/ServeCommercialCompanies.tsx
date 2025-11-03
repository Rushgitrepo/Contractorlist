import ReduxHeader from "@/components/ReduxHeader";
import Footer from "@/components/Footer";
import { 
  Factory, 
  CheckCircle2, 
  Briefcase, 
  Coins,
  Target,
  Clock,
  Shield,
  BarChart3,
  DollarSign,
  Zap,
  Eye,
  Handshake,
  TrendingUp,
  ArrowRight,
  FileText,
  Calculator,
  Wrench,
  ClipboardCheck,
  Building,
  Award,
  MessageSquare,
  BookOpen,
  FileStack,
  ClipboardPen,
  CalendarRange,
  UserCheck,
  PieChart,
  GitBranch,
  Monitor,
  Server,
  MapPin,
  Home,
  Store,
  Warehouse,
  HardHat,
  Layers,
  Users
} from "lucide-react";

const ServeCommercialCompanies = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50">
      <ReduxHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mb-6">
            <Factory className="w-4 h-4 mr-2" /> Commercial Companies
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Reliable Partners for Capital Projects
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From tenant improvements to ground-up builds, we deliver predictable, reportable progress with financial transparency and operational excellence.
          </p>
        </div>

        {/* Value Proposition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Coins, title: "Cost Control", desc: "Maintain budget certainty with transparent financial management" },
            { icon: Clock, title: "Schedule Adherence", desc: "Keep projects on track with disciplined timeline management" },
            { icon: Shield, title: "Risk Mitigation", desc: "Proactive identification and management of project risks" }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mb-4">
                <item.icon className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Services Section */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Comprehensive Commercial Project Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { 
                icon: Calculator, 
                title: "Proven Schedule and Cost Control",
                description: "Advanced tracking systems that maintain project timelines and budgets with real-time reporting and forecasting."
              },
              { 
                icon: FileText, 
                title: "Clear Documentation and Governance",
                description: "Comprehensive documentation protocols that ensure transparency, compliance, and audit-ready project records."
              },
              { 
                icon: Shield, 
                title: "Risk Management and Compliance",
                description: "Systematic risk assessment and mitigation strategies that protect your investment and ensure regulatory compliance."
              },
              { 
                icon: Users, 
                title: "Vendor Coordination and Procurement",
                description: "End-to-end management of vendor selection, contract negotiation, and performance monitoring."
              },
              { 
                icon: BarChart3, 
                title: "Capital Planning and Budgeting",
                description: "Strategic financial planning that aligns capital projects with organizational goals and resource allocation."
              },
              { 
                icon: ClipboardCheck, 
                title: "Project Controls and Reporting",
                description: "Customized dashboards and reporting systems that provide stakeholders with actionable insights."
              },
              { 
                icon: Layers, 
                title: "Facility Programming and Space Planning",
                description: "Optimization of space utilization and functional requirements to support business operations."
              },
              { 
                icon: Handshake, 
                title: "Stakeholder Communication",
                description: "Structured communication plans that keep all parties informed and engaged throughout the project lifecycle."
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Project Types */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Commercial Project Expertise</h2>
          <p className="text-gray-600 mb-8">We support a wide range of commercial construction and renovation projects</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Tenant Improvements", icon: Building },
              { name: "Office Build-outs", icon: Briefcase },
              { name: "Retail Spaces", icon: Store },
              { name: "Industrial Facilities", icon: Factory },
              { name: "Ground-Up Construction", icon: HardHat },
              { name: "Facility Expansions", icon: Home },
              { name: "Warehouse & Distribution", icon: Warehouse },
              { name: "Site Development", icon: MapPin }
            ].map((project, idx) => {
              const Icon = project.icon;
              return (
                <div key={idx} className="text-center p-4 rounded-xl bg-gray-50">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-lg mb-2 shadow-sm">
                    <Icon className="w-5 h-5 text-yellow-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm">{project.name}</h3>
                </div>
              );
            })}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Why Commercial Companies Choose Us</h3>
            <ul className="space-y-4">
              {[
                "Deep understanding of commercial real estate dynamics",
                "Experience across multiple industries and project types",
                "Financial acumen with focus on ROI and value engineering",
                "Scalable support from small TI projects to large developments",
                "Minimal disruption to ongoing business operations",
                "Transparent reporting aligned with corporate standards",
                "Vendor management that ensures quality and accountability",
                "Long-term partnership approach beyond individual projects"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-yellow-50 rounded-2xl p-8 border border-yellow-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Commercial Project Results</h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-yellow-600" />
                <span className="font-medium">98% Projects delivered on budget</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="font-medium">92% Projects completed on schedule</span>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-yellow-600" />
                <span className="font-medium">15% Average cost savings through value engineering</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-yellow-600" />
                <span className="font-medium">100% Compliance with regulatory requirements</span>
              </div>
            </div>
            <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
              View Commercial Case Studies <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </section>

        {/* Industry Expertise */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Industry-Specific Expertise</h2>
          <p className="text-gray-600 mb-8">We understand the unique requirements of different commercial sectors</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Corporate Office", icon: Briefcase },
              { name: "Retail & Hospitality", icon: Store },
              { name: "Healthcare", icon: Shield },
              { name: "Industrial", icon: Factory },
              { name: "Technology", icon: Monitor },
              { name: "Education", icon: BookOpen },
              { name: "Financial Services", icon: Coins },
              { name: "Life Sciences", icon: PieChart }
            ].map((industry, idx) => {
              const Icon = industry.icon;
              return (
                <div key={idx} className="text-center p-4 rounded-xl bg-gray-50">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-lg mb-2 shadow-sm">
                    <Icon className="w-5 h-5 text-yellow-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm">{industry.name}</h3>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-12 border border-yellow-100">
          <TrendingUp className="w-12 h-12 text-yellow-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Transform Your Capital Projects?</h2>
          <p className="text-gray-700 max-w-2xl mx-auto mb-8">
            Partner with us to bring predictability, transparency, and excellence to your commercial construction projects. Let's build what matters for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center">
              <MessageSquare className="w-5 h-5 mr-2" /> Discuss Your Project
            </button>
            <button className="bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-6 rounded-lg border border-gray-300 transition-colors flex items-center justify-center">
              <FileText className="w-5 h-5 mr-2" /> Download Services Overview
            </button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ServeCommercialCompanies;
