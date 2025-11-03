import ReduxHeader from "@/components/ReduxHeader";
import Footer from "@/components/Footer";
import { Building2, Clock, DollarSign, Users, CheckCircle, TrendingUp, Award, Target } from "lucide-react";

const CaseStudies = () => {
  const caseStudies = [
    {
      id: 1,
      title: "Downtown Commercial Complex",
      category: "Commercial Construction",
      client: "Metro Development Corp",
      duration: "18 months",
      budget: "$12.5M",
      teamSize: "45 professionals",
      image: "/api/placeholder/600/400",
      challenge: "Complex multi-phase construction in busy downtown area with strict timeline requirements and minimal disruption to surrounding businesses.",
      solution: "Implemented advanced project scheduling, 24/7 coordination system, and specialized noise reduction techniques. Used BIM modeling for precise planning.",
      results: [
        "Completed 2 weeks ahead of schedule",
        "15% under budget due to efficient resource management",
        "Zero safety incidents throughout the project",
        "98% client satisfaction rating"
      ],
      technologies: ["BIM Modeling", "Project Management Software", "Real-time Coordination", "Safety Management Systems"]
    },
    {
      id: 2,
      title: "Luxury Residential Development",
      category: "Residential Construction",
      client: "Premium Homes LLC",
      duration: "24 months",
      budget: "$8.2M",
      teamSize: "32 professionals",
      image: "/api/placeholder/600/400",
      challenge: "High-end residential project requiring premium finishes, custom designs, and coordination with multiple specialty contractors.",
      solution: "Established dedicated quality control processes, implemented vendor management system, and created detailed milestone tracking for custom work.",
      results: [
        "100% quality standards met",
        "All 12 units sold before completion",
        "Featured in Architectural Digest",
        "Client awarded 'Developer of the Year'"
      ],
      technologies: ["Quality Management", "Vendor Coordination", "Custom Design Integration", "Timeline Optimization"]
    },
    {
      id: 3,
      title: "Industrial Manufacturing Facility",
      category: "Industrial Construction",
      client: "TechManufacturing Inc",
      duration: "15 months",
      budget: "$22M",
      teamSize: "68 professionals",
      image: "/api/placeholder/600/400",
      challenge: "Large-scale industrial facility with specialized equipment installation, strict environmental regulations, and operational timeline constraints.",
      solution: "Coordinated with equipment manufacturers, implemented environmental compliance tracking, and used modular construction techniques for efficiency.",
      results: [
        "Facility operational 1 month early",
        "100% environmental compliance achieved",
        "20% reduction in construction waste",
        "LEED Gold certification obtained"
      ],
      technologies: ["Environmental Monitoring", "Equipment Integration", "Modular Construction", "Sustainability Tracking"]
    }
  ];

  const stats = [
    { icon: Building2, value: "150+", label: "Projects Completed" },
    { icon: DollarSign, value: "$500M+", label: "Total Project Value" },
    { icon: Users, value: "95%", label: "Client Retention Rate" },
    { icon: Award, value: "25+", label: "Industry Awards" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50">
      <ReduxHeader />
      
      {/* Hero Section with Background Image */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/api/placeholder/1920/600" 
            alt="Successful construction projects showcase" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="inline-flex items-center px-6 py-3 bg-yellow-500/20 backdrop-blur-sm rounded-full text-yellow-300 text-sm font-medium mb-8">
            🏆 Success Stories
          </div>
          <h1 className="text-6xl font-bold mb-8 leading-tight">
            Real Project
            <span className="block text-yellow-400">Success Stories</span>
          </h1>
          <p className="text-2xl mb-12 max-w-4xl mx-auto leading-relaxed opacity-90">
            Discover how we've helped construction professionals deliver exceptional results across diverse projects, 
            from commercial complexes to residential developments. Each story represents our commitment to excellence.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="inline-flex p-4 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl mb-4">
                  <Icon className="w-8 h-8 text-yellow-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Case Studies */}
        <div className="space-y-20">
          {caseStudies.map((study, idx) => (
            <div key={study.id} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="p-12">
                  <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mb-6">
                    {study.category}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{study.title}</h2>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Building2 className="w-4 h-4 mr-2" />
                        <span className="text-sm">Client</span>
                      </div>
                      <div className="font-semibold text-gray-900">{study.client}</div>
                    </div>
                    <div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="text-sm">Duration</span>
                      </div>
                      <div className="font-semibold text-gray-900">{study.duration}</div>
                    </div>
                    <div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <DollarSign className="w-4 h-4 mr-2" />
                        <span className="text-sm">Budget</span>
                      </div>
                      <div className="font-semibold text-gray-900">{study.budget}</div>
                    </div>
                    <div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Users className="w-4 h-4 mr-2" />
                        <span className="text-sm">Team Size</span>
                      </div>
                      <div className="font-semibold text-gray-900">{study.teamSize}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">Challenge</h3>
                      <p className="text-gray-600 leading-relaxed">{study.challenge}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">Solution</h3>
                      <p className="text-gray-600 leading-relaxed">{study.solution}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-12">
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Key Results</h3>
                    <div className="space-y-3">
                      {study.results.map((result, resultIdx) => (
                        <div key={resultIdx} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{result}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Technologies Used</h3>
                    <div className="flex flex-wrap gap-2">
                      {study.technologies.map((tech, techIdx) => (
                        <span key={techIdx} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-gray-900 to-black rounded-3xl p-12 text-center text-white mt-20">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your Success Story?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the construction professionals who trust us to deliver exceptional results on their most important projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-full text-lg transition-colors">
              Start Your Project
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-full text-lg transition-colors">
              Schedule Consultation
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CaseStudies;
