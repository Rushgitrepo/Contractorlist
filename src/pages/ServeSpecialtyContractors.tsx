import ReduxHeader from "@/components/ReduxHeader";
import Footer from "@/components/Footer";
import { 
  Wrench, 
  CheckCircle2, 
  ClipboardList, 
  FileText, 
  Users,
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
  Calendar,
  Calculator,
  Layers,
  HardHat,
  ClipboardCheck,
  Building,
  Award,
  MessageSquare,
  BookOpen,
  FileStack,
  ClipboardPen,
  CalendarRange,
  UserCheck
} from "lucide-react";

const ServeSpecialtyContractors = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50">
      <ReduxHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mb-6">
            <Wrench className="w-4 h-4 mr-2" /> Specialty Contractors
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Focus on Your Trade — We Handle the Paperwork
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Submittals, RFIs, scopes, change orders and closeout — delivered accurately and on time so you can focus on what you do best.
          </p>
        </div>

        {/* Value Proposition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Clock, title: "Time Savings", desc: "Reduce administrative burden by up to 20 hours per week" },
            { icon: Shield, title: "Risk Reduction", desc: "Ensure compliance and avoid costly documentation errors" },
            { icon: DollarSign, title: "Increased Profitability", desc: "Focus on billable work while we handle the paperwork" }
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
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Comprehensive Specialty Contractor Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { 
                icon: FileText, 
                title: "Trade Takeoffs and Scope Sheets",
                description: "Accurate quantity takeoffs and detailed scope documentation tailored to your specific trade."
              },
              { 
                icon: ClipboardList, 
                title: "Submittal Logs and Packages",
                description: "Professional preparation and management of product data, samples, and shop drawings."
              },
              { 
                icon: ClipboardPen, 
                title: "RFIs and Change Order Pricing",
                description: "Clear, concise requests for information and detailed change order documentation with accurate pricing."
              },
              { 
                icon: Users, 
                title: "Coordination and Meeting Notes",
                description: "Thorough documentation of coordination meetings with clear action items and responsibilities."
              },
              { 
                icon: BookOpen, 
                title: "Closeout Documents and O&M Manuals",
                description: "Complete closeout packages including warranties, as-builts, and operation & maintenance manuals."
              },
              { 
                icon: UserCheck, 
                title: "Workforce Planning and Scheduling Support",
                description: "Labor forecasting, crew scheduling, and productivity tracking to optimize your workforce."
              },
              { 
                icon: Calculator, 
                title: "Cost Tracking and Progress Billing",
                description: "Accurate cost monitoring and preparation of payment applications to maintain cash flow."
              },
              { 
                icon: FileStack, 
                title: "Document Management Systems",
                description: "Implementation of organized document control systems tailored to your trade requirements."
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

        {/* Trades We Support */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Trades We Support</h2>
          <p className="text-gray-600 mb-8">We have experience working with a wide range of specialty contractors across all disciplines</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Electrical", icon: Zap },
              { name: "Plumbing", icon: Wrench },
              { name: "HVAC", icon: Layers },
              { name: "Drywall", icon: ClipboardCheck },
              { name: "Painting", icon: Eye },
              { name: "Flooring", icon: HardHat },
              { name: "Landscaping", icon: Building },
              { name: "Concrete", icon: Shield }
            ].map((trade, idx) => {
              const Icon = trade.icon;
              return (
                <div key={idx} className="text-center p-4 rounded-xl bg-gray-50">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-lg mb-2 shadow-sm">
                    <Icon className="w-5 h-5 text-yellow-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">{trade.name}</h3>
                </div>
              );
            })}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Why Specialty Contractors Choose Us</h3>
            <ul className="space-y-4">
              {[
                "Trade-specific expertise in your field",
                "Familiarity with all major GC requirements",
                "Fast turnaround times (typically 24-48 hours)",
                "Scalable support for projects of all sizes",
                "Consistent formatting and professional presentation",
                "Direct liaison with general contractors",
                "Secure cloud-based document access",
                "Flexible engagement options"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-yellow-50 rounded-2xl p-8 border border-yellow-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Specialty Contractor Results</h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-yellow-600" />
                <span className="font-medium">42% Reduction in documentation errors</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="font-medium">15+ Hours saved weekly on paperwork</span>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-yellow-600" />
                <span className="font-medium">Faster payment cycles</span>
              </div>
              <div className="flex items-center gap-3">
                <Handshake className="w-5 h-5 text-yellow-600" />
                <span className="font-medium">Improved GC relationships</span>
              </div>
            </div>
            <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
              View Trade Case Studies <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-12 border border-yellow-100">
          <TrendingUp className="w-12 h-12 text-yellow-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Focus on Your Trade?</h2>
          <p className="text-gray-700 max-w-2xl mx-auto mb-8">
            Let us handle the paperwork so you can focus on what you do best. Get back to your trade while we ensure your documentation is accurate, compliant, and on time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center">
              <MessageSquare className="w-5 h-5 mr-2" /> Get Started Today
            </button>
            <button className="bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-6 rounded-lg border border-gray-300 transition-colors flex items-center justify-center">
              <FileText className="w-5 h-5 mr-2" /> Download Trade Services
            </button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ServeSpecialtyContractors;
