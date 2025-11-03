import ReduxHeader from "@/components/ReduxHeader";
import Footer from "@/components/Footer";
import { Search, BookOpen, Filter, Hash, TrendingUp, Users, Star, CheckCircle } from "lucide-react";
import { useState } from "react";

const Glossary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("All");

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const glossaryTerms = [
    {
      term: "Aggregate",
      definition: "Granular materials such as sand, gravel, crushed stone, or slag that are mixed with cement and water to form concrete or mortar.",
      category: "Materials",
      popular: true
    },
    {
      term: "Blueprint",
      definition: "A detailed architectural or engineering drawing that shows the design, dimensions, and specifications of a construction project.",
      category: "Documentation",
      popular: true
    },
    {
      term: "Building Information Modeling (BIM)",
      definition: "A digital representation of physical and functional characteristics of a facility, used for design, construction, and facility management.",
      category: "Technology",
      popular: true
    },
    {
      term: "Cantilever",
      definition: "A structural element that extends horizontally and is supported at only one end, creating an overhang without external bracing.",
      category: "Structural",
      popular: false
    },
    {
      term: "Drywall",
      definition: "Interior wall construction material made of gypsum plaster pressed between two thick sheets of paper, used to create smooth wall surfaces.",
      category: "Materials",
      popular: true
    },
    {
      term: "Excavation",
      definition: "The process of removing earth, rock, or other materials from a construction site to create foundations, basements, or other below-grade structures.",
      category: "Site Work",
      popular: true
    },
    {
      term: "Footing",
      definition: "The bottom portion of a foundation that distributes the building's load to the soil, typically made of concrete and placed below the frost line.",
      category: "Foundation",
      popular: false
    },
    {
      term: "Grading",
      definition: "The process of leveling or sloping the ground surface around a building to ensure proper drainage and site preparation.",
      category: "Site Work",
      popular: false
    },
    {
      term: "HVAC",
      definition: "Heating, Ventilation, and Air Conditioning systems that provide thermal comfort and acceptable indoor air quality in buildings.",
      category: "Systems",
      popular: true
    },
    {
      term: "I-beam",
      definition: "A structural steel beam with an I-shaped cross-section, commonly used in construction for its high strength-to-weight ratio.",
      category: "Structural",
      popular: false
    },
    {
      term: "Joist",
      definition: "Horizontal structural members used to support floors and ceilings, typically made of wood, steel, or engineered materials.",
      category: "Structural",
      popular: false
    },
    {
      term: "Keystone",
      definition: "The central wedge-shaped stone at the top of an arch that locks the other stones in place and bears the weight of the structure above.",
      category: "Masonry",
      popular: false
    },
    {
      term: "Load-bearing Wall",
      definition: "A wall that supports the weight of the structure above it, including floors, ceilings, and roof loads, and cannot be removed without structural modifications.",
      category: "Structural",
      popular: true
    },
    {
      term: "Mortar",
      definition: "A mixture of cement, sand, and water used to bind masonry units such as bricks, stones, or concrete blocks together.",
      category: "Materials",
      popular: false
    },
    {
      term: "OSHA",
      definition: "Occupational Safety and Health Administration - the federal agency responsible for enforcing safety and health regulations in the workplace.",
      category: "Safety",
      popular: true
    },
    {
      term: "Plumb",
      definition: "Perfectly vertical or perpendicular to a horizontal surface, often checked using a plumb line or level during construction.",
      category: "Measurement",
      popular: false
    },
    {
      term: "Rebar",
      definition: "Reinforcing bar - steel bars or mesh used to strengthen concrete structures by providing tensile strength to complement concrete's compressive strength.",
      category: "Materials",
      popular: true
    },
    {
      term: "Soffit",
      definition: "The underside of an architectural element such as an arch, balcony, beam, or eave, often finished with decorative or protective materials.",
      category: "Architectural",
      popular: false
    },
    {
      term: "Truss",
      definition: "A structural framework of triangular units used to support roofs and bridges, designed to distribute loads efficiently across the span.",
      category: "Structural",
      popular: false
    },
    {
      term: "Underlayment",
      definition: "A layer of material installed beneath the finished flooring to provide moisture protection, sound dampening, or surface smoothing.",
      category: "Materials",
      popular: false
    }
  ];

  const categories = [
    { name: "All Categories", count: glossaryTerms.length, color: "bg-gray-100 text-gray-800" },
    { name: "Materials", count: glossaryTerms.filter(t => t.category === "Materials").length, color: "bg-blue-100 text-blue-800" },
    { name: "Structural", count: glossaryTerms.filter(t => t.category === "Structural").length, color: "bg-green-100 text-green-800" },
    { name: "Technology", count: glossaryTerms.filter(t => t.category === "Technology").length, color: "bg-purple-100 text-purple-800" },
    { name: "Safety", count: glossaryTerms.filter(t => t.category === "Safety").length, color: "bg-red-100 text-red-800" },
    { name: "Site Work", count: glossaryTerms.filter(t => t.category === "Site Work").length, color: "bg-orange-100 text-orange-800" }
  ];

  const filteredTerms = glossaryTerms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLetter = selectedLetter === "All" || term.term.charAt(0).toUpperCase() === selectedLetter;
    return matchesSearch && matchesLetter;
  });

  const popularTerms = glossaryTerms.filter(term => term.popular);

  const stats = [
    { icon: BookOpen, value: "500+", label: "Terms Defined" },
    { icon: Users, value: "15K+", label: "Monthly Users" },
    { icon: TrendingUp, value: "Weekly", label: "Updates" },
    { icon: Star, value: "4.9/5", label: "User Rating" }
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
            alt="Construction blueprints and terminology" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="inline-flex items-center px-6 py-3 bg-yellow-500/20 backdrop-blur-sm rounded-full text-yellow-300 text-sm font-medium mb-8">
            📖 Construction Dictionary
          </div>
          <h1 className="text-6xl font-bold mb-8 leading-tight">
            Complete Construction
            <span className="block text-yellow-400">Terminology Guide</span>
          </h1>
          <p className="text-2xl mb-12 max-w-4xl mx-auto leading-relaxed opacity-90">
            Your comprehensive resource for construction terms, definitions, and industry terminology. 
            From basic concepts to advanced technical terms, find everything you need to know.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search construction terms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-4 py-4 rounded-full border-0 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-yellow-300 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="inline-flex p-3 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl mb-4">
                  <Icon className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow cursor-pointer group">
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mb-3 ${category.color} group-hover:scale-105 transition-transform`}>
                  {category.name}
                </div>
                <div className="text-xl font-bold text-gray-900 mb-1">{category.count}</div>
                <div className="text-gray-600 text-sm">Terms</div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Terms */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Popular Terms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTerms.slice(0, 6).map((term, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">
                    {term.term}
                  </h3>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                    Popular
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                  {term.definition}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {term.category}
                  </span>
                  <button className="text-yellow-600 hover:text-yellow-700 font-medium text-sm">
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alphabet Filter */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Browse Alphabetically</h2>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setSelectedLetter("All")}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedLetter === "All" 
                  ? "bg-yellow-500 text-black" 
                  : "bg-white text-gray-700 hover:bg-yellow-100"
              }`}
            >
              All
            </button>
            {alphabet.map(letter => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`w-10 h-10 rounded-full font-medium transition-colors ${
                  selectedLetter === letter 
                    ? "bg-yellow-500 text-black" 
                    : "bg-white text-gray-700 hover:bg-yellow-100"
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* Terms List */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {searchTerm ? `Search Results (${filteredTerms.length})` : 
                 selectedLetter === "All" ? `All Terms (${filteredTerms.length})` : 
                 `Terms starting with "${selectedLetter}" (${filteredTerms.length})`}
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredTerms.length === 0 ? (
                <div className="p-12 text-center">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No terms found</h3>
                  <p className="text-gray-600">Try adjusting your search or browse by category</p>
                </div>
              ) : (
                filteredTerms.map((term, idx) => (
                  <div key={idx} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-xl font-bold text-gray-900">{term.term}</h4>
                      <div className="flex items-center space-x-2">
                        {term.popular && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                            Popular
                          </span>
                        )}
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {term.category}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {term.definition}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Contribution CTA */}
        <div className="bg-gradient-to-r from-gray-900 to-black rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Help Us Improve Our Glossary</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Have a construction term that's not in our glossary? Suggest new terms or improvements to help the construction community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-full text-lg transition-colors">
              Suggest a Term
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-full text-lg transition-colors">
              Download PDF Guide
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Glossary;
