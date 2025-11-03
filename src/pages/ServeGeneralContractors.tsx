import ReduxHeader from "@/components/ReduxHeader";
import Footer from "@/components/Footer";
import { 
  Hammer, 
  CheckCircle2, 
  Layers, 
  HardHat, 
  ClipboardList, 
  Calendar,
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
  Users,
  FileText,
  Calculator,
  Wrench,
  ClipboardCheck,
  Building,
  Award,
  MessageSquare
} from "lucide-react";

const ServeGeneralContractors = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50">
      <ReduxHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mb-6">
            <Hammer className="w-4 h-4 mr-2" /> General Contractors
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Win More Bids. Build With Confidence.
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From bid day to closeout, we streamline delivery with expert scheduling, coordination, documentation and more to keep your projects on time and on budget.
          </p>
        </div>

        {/* Value Proposition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Target, title: "Competitive Bidding", desc: "Accurate estimates that help you win more profitable projects" },
            { icon: Clock, title: "Time Efficiency", desc: "Streamlined processes that save time and reduce delays" },
            { icon: Shield, title: "Risk Reduction", desc: "Proactive identification and management of project risks" }
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

        {/* Main Content Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">How We Help Contractors Succeed</h2>
            <div className="space-y-6">
              {[ 
                { 
                  icon: FileText, 
                  title: "Preconstruction Services",
                  description: "Detailed takeoffs, accurate estimates, and comprehensive bid packaging that gives you a competitive edge."
                },
                { 
                  icon: Calculator, 
                  title: "Cost Control & Budget Management",
                  description: "Real-time tracking of project costs, change order management, and financial reporting to maintain profitability."
                },
                { 
                  icon: ClipboardList, 
                  title: "Submittals, RFIs & Change Orders",
                  description: "Streamlined documentation processes that keep projects moving and protect your contractual interests."
                },
                { 
                  icon: Calendar, 
                  title: "Scheduling & Planning",
                  description: "Master schedules, look-ahead planning, and progress tracking to keep projects on time and efficiently sequenced."
                },
                { 
                  icon: Users, 
                  title: "Subcontractor Coordination",
                  description: "Effective management and coordination of subcontractors to ensure quality work and timely performance."
                },
                { 
                  icon: ClipboardCheck, 
                  title: "Quality Control & Assurance",
                  description: "Systematic processes to monitor work quality, ensure compliance with specifications, and reduce rework."
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Sidebar Tools & Outcomes */}
          <aside className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Industry Tool Expertise</h3>
              <ul className="space-y-4">
                {[
                  { icon: Layers, text: "BIM coordination & model checking" },
                  { icon: Calendar, text: "CPM scheduling & look-ahead planning" },
                  { icon: ClipboardList, text: "Digital submittals and document control" },
                  { icon: HardHat, text: "Safety and quality management platforms" },
                  { icon: BarChart3, text: "Project management and financial software" },
                  { icon: Wrench, text: "Field management and productivity tools" }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <item.icon className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-yellow-50 rounded-2xl p-8 border border-yellow-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contractor Results</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium">27% More Bids Won</span>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium">12% Higher Profit Margins</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium">98% On-Time Completion</span>
                </div>
              </div>
              <button className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                View Case Studies <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </aside>
        </section>

        {/* Process Section */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Our Contractor Support Process</h2>
          <p className="text-gray-600 mb-8">A comprehensive approach that supports you through every project phase</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: FileText, title: "Preconstruction", desc: "Bid preparation, estimating, value engineering" },
              { icon: Hammer, title: "Procurement", desc: "Subcontractor selection, buyout, scheduling" },
              { icon: Building, title: "Construction", desc: "Document control, coordination, cost management" },
              { icon: ClipboardCheck, title: "Closeout", desc: "Documentation, owner training, warranty management" }
            ].map((item, idx) => (
              <div key={idx} className="text-center p-6 rounded-xl bg-gray-50 group hover:bg-yellow-50 transition-colors">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-lg mb-4 shadow-sm group-hover:bg-yellow-100">
                  <item.icon className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-12 border border-yellow-100">
          <TrendingUp className="w-12 h-12 text-yellow-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Build Your Competitive Advantage?</h2>
          <p className="text-gray-700 max-w-2xl mx-auto mb-8">
            Connect with our team to discover how we can help you win more bids, improve project outcomes, and increase profitability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center">
              <MessageSquare className="w-5 h-5 mr-2" /> Schedule Consultation
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

export default ServeGeneralContractors;
