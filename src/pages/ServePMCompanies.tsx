import ReduxHeader from "@/components/ReduxHeader";
import Footer from "@/components/Footer";
import { 
  ClipboardList, 
  CheckCircle2, 
  Users, 
  Calendar, 
  Layers,
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
  Server
} from "lucide-react";

const ServePMCompanies = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50">
      <ReduxHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mb-6">
            <ClipboardList className="w-4 h-4 mr-2" /> Project Management Companies
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Extend Your Team with Reliable Delivery Support
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We integrate seamlessly into your processes to provide comprehensive documentation, scheduling, reporting, and model coordination that scales with your project needs.
          </p>
        </div>

        {/* Value Proposition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Users, title: "Team Augmentation", desc: "Scale your capabilities without increasing overhead" },
            { icon: Clock, title: "Efficiency Boost", desc: "Streamlined processes that accelerate project delivery" },
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
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Comprehensive PM Support Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { 
                icon: Users, 
                title: "Stakeholder Coordination & Reporting",
                description: "Facilitation of stakeholder meetings, detailed minute-taking, and comprehensive reporting to keep all parties informed and aligned."
              },
              { 
                icon: Calendar, 
                title: "Master & Look-Ahead Scheduling",
                description: "Development of detailed project schedules, progress tracking, and look-ahead planning to maintain project timelines."
              },
              { 
                icon: FileText, 
                title: "Submittals, RFIs & Change Control",
                description: "Management of the entire documentation lifecycle including submittals, RFIs, and change order processes."
              },
              { 
                icon: Layers, 
                title: "BIM Coordination & Issue Tracking",
                description: "Coordination of BIM processes, clash detection, and systematic tracking of design issues through resolution."
              },
              { 
                icon: UserCheck, 
                title: "Team Augmentation & Training",
                description: "Flexible staffing solutions and training programs to enhance your team's capabilities and knowledge."
              },
              { 
                icon: PieChart, 
                title: "Performance Metrics & Reporting",
                description: "Development of KPIs, dashboard reporting, and performance analytics to measure project health."
              },
              { 
                icon: Monitor, 
                title: "Technology Implementation",
                description: "Selection and implementation of project management software and tools tailored to your needs."
              },
              { 
                icon: GitBranch, 
                title: "Process Optimization",
                description: "Evaluation and improvement of project delivery processes to increase efficiency and effectiveness."
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

        {/* Integration Approach */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our Integration Approach</h2>
          <p className="text-gray-600 mb-8">We seamlessly integrate with your existing teams and processes to deliver maximum value</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Users, title: "Assessment", desc: "Understand your processes, team structure, and project requirements" },
              { icon: Server, title: "Integration", desc: "Embed our experts into your workflow with minimal disruption" },
              { icon: ClipboardCheck, title: "Execution", desc: "Deliver services using your preferred tools and methodologies" },
              { icon: BarChart3, title: "Optimization", desc: "Continuously improve processes based on performance data" }
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

        {/* Benefits Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Why PM Companies Partner With Us</h3>
            <ul className="space-y-4">
              {[
                "Seamless integration with your existing processes",
                "Flexible engagement models (project-based or ongoing)",
                "Expertise across multiple project management methodologies",
                "Familiarity with all major PM software platforms",
                "Scalable support that grows with your project needs",
                "Consistent quality and attention to detail",
                "Enhanced reporting capabilities",
                "Cost-effective alternative to full-time hires"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-yellow-50 rounded-2xl p-8 border border-yellow-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Measurable Results</h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-yellow-600" />
                <span className="font-medium">35% Increase in team productivity</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="font-medium">28% Faster project delivery</span>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-yellow-600" />
                <span className="font-medium">22% Reduction in project overhead</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-yellow-600" />
                <span className="font-medium">45% Fewer documentation errors</span>
              </div>
            </div>
            <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
              View Client Success Stories <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </section>

        {/* Technology Partners */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Technology & Platform Expertise</h2>
          <p className="text-gray-600 mb-8">We're proficient in all major project management platforms and tools</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Procore", icon: Monitor },
              { name: "Bluebeam", icon: FileStack },
              { name: "Autodesk BIM", icon: Layers },
              { name: "Microsoft Project", icon: Calendar },
              { name: "Primavera P6", icon: BarChart3 },
              { name: "Asana", icon: ClipboardList },
              { name: "Smartsheet", icon: PieChart },
              { name: "PlanGrid", icon: Building }
            ].map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <div key={idx} className="text-center p-4 rounded-xl bg-gray-50">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-lg mb-2 shadow-sm">
                    <Icon className="w-5 h-5 text-yellow-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">{tech.name}</h3>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-12 border border-yellow-100">
          <TrendingUp className="w-12 h-12 text-yellow-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Extend Your Team's Capabilities?</h2>
          <p className="text-gray-700 max-w-2xl mx-auto mb-8">
            Discover how our project management support services can help you deliver better results, increase efficiency, and scale your operations without increasing overhead.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center">
              <MessageSquare className="w-5 h-5 mr-2" /> Schedule a Consultation
            </button>
            <button className="bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-6 rounded-lg border border-gray-300 transition-colors flex items-center justify-center">
              <FileText className="w-5 h-5 mr-2" /> Download Capabilities Deck
            </button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ServePMCompanies;
