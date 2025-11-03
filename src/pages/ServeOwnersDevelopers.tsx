import ReduxHeader from "@/components/ReduxHeader";
import Footer from "@/components/Footer";
import { 
  Building2, 
  CheckCircle2, 
  FileText, 
  ClipboardList, 
  Calculator, 
  Users, 
  Target,
  Clock,
  Shield,
  BarChart3,
  DollarSign,
  Zap,
  Eye,
  Handshake,
  Calendar,
  TrendingUp,
  MapPin,
  Lightbulb,
  ArrowRight
} from "lucide-react";

const ServeOwnersDevelopers = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50">
      <ReduxHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mb-6">
            <Building2 className="w-4 h-4 mr-2" /> Owners & Developers
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Delivering Certainty from Concept to Handover
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We help owners and developers reduce risk, accelerate schedules, and achieve predictable outcomes across the entire project lifecycle with our integrated cost management expertise.
          </p>
        </div>

        {/* Value Proposition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Target, title: "Cost Certainty", desc: "Accurate forecasting and budget management" },
            { icon: Clock, title: "Time Efficiency", desc: "Accelerated schedules without compromising quality" },
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

        {/* Main Content Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Comprehensive Owner & Developer Services</h2>
            <div className="space-y-6">
              {[ 
                { 
                  icon: FileText, 
                  title: "Feasibility Studies & Budget Validation",
                  description: "Early-stage analysis to validate project viability, establish realistic budgets, and identify potential challenges before commitment."
                },
                { 
                  icon: Calculator, 
                  title: "Cost Planning & Estimating",
                  description: "Detailed quantity surveying and cost modeling to establish accurate budgets and maintain financial control throughout the project."
                },
                { 
                  icon: ClipboardList, 
                  title: "Procurement Strategy & tender Management",
                  description: "Development of optimal procurement pathways, tender documentation, bid analysis, and contractor selection."
                },
                { 
                  icon: Users, 
                  title: "Contract Administration & Stakeholder Coordination",
                  description: "Management of contractual relationships, payment certifications, variations, and coordination between all project stakeholders."
                },
                { 
                  icon: BarChart3, 
                  title: "Value Engineering",
                  description: "Systematic approach to optimize project value by evaluating alternatives without compromising function or quality."
                },
                { 
                  icon: DollarSign, 
                  title: "Lifecycle Cost Analysis",
                  description: "Evaluation of total cost of ownership to make informed decisions that optimize long-term value."
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
          
          {/* Sidebar Outcomes */}
          <aside className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Tangible Outcomes</h3>
              <ul className="space-y-4">
                {[
                  "Cost certainty and transparent financial reporting",
                  "Competitive tenders with qualified contractor alignment",
                  "Compliant documentation and reduced contractual risk",
                  "Informed decision-making with real-time cost data",
                  "Accelerated project timelines through efficient processes",
                  "Enhanced value without compromising quality"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-yellow-50 rounded-2xl p-8 border border-yellow-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Project Spotlight</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium">15% Cost Savings</span>
                </div>
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium">Full Budget Transparency</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium">3 Months Ahead of Schedule</span>
                </div>
              </div>
              <button className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                View Case Study <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </aside>
        </section>

        {/* Process Section */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Our Proven Process</h2>
          <p className="text-gray-600 mb-8">A structured approach that delivers predictable outcomes at every project phase</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Lightbulb, title: "Concept", desc: "Feasibility studies, budget validation, and strategic planning" },
              { icon: MapPin, title: "Design", desc: "Cost planning, value engineering, and procurement strategy" },
              { title: "Construction", desc: "Contract administration, cost control, and variation management" },
              { icon: Handshake, title: "Operation", desc: "Final account settlement, lifecycle costing, and post-occupancy evaluation" }
            ].map((item, idx) => (
              <div key={idx} className="text-center p-6 rounded-xl bg-gray-50">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-lg mb-4 shadow-sm">
                  {item.icon ? <item.icon className="w-6 h-6 text-yellow-600" /> : <span className="font-bold text-yellow-600">{idx + 1}</span>}
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Achieve Project Certainty?</h2>
          <p className="text-gray-700 max-w-2xl mx-auto mb-8">
            Connect with our team of experts to discuss how we can bring financial clarity and risk mitigation to your development project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
              Schedule Consultation
            </button>
            <button className="bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-6 rounded-lg border border-gray-300 transition-colors">
              Download Capability Statement
            </button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ServeOwnersDevelopers;
