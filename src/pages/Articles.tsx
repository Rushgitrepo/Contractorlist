import ReduxHeader from "@/components/ReduxHeader";
import Footer from "@/components/Footer";
import { Calendar, Clock, User, TrendingUp, BookOpen, Search, Filter, ArrowRight } from "lucide-react";

const Articles = () => {
  const categories = [
    { name: "Industry Trends", count: 24, color: "bg-blue-100 text-blue-800" },
    { name: "Best Practices", count: 18, color: "bg-green-100 text-green-800" },
    { name: "Technology", count: 15, color: "bg-purple-100 text-purple-800" },
    { name: "Safety & Compliance", count: 12, color: "bg-red-100 text-red-800" },
    { name: "Project Management", count: 20, color: "bg-orange-100 text-orange-800" },
    { name: "Sustainability", count: 10, color: "bg-emerald-100 text-emerald-800" }
  ];

  const featuredArticle = {
    id: 1,
    title: "The Future of Construction: How AI and Automation Are Transforming the Industry",
    excerpt: "Explore the revolutionary impact of artificial intelligence and automation technologies on modern construction practices, from project planning to execution.",
    author: "Sarah Johnson",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Technology",
    image: "/api/placeholder/800/400",
    featured: true
  };

  const articles = [
    {
      id: 2,
      title: "Sustainable Construction Materials: Building for the Future",
      excerpt: "Discover eco-friendly materials and practices that are reshaping the construction industry while reducing environmental impact.",
      author: "Mike Davis",
      date: "2024-01-12",
      readTime: "6 min read",
      category: "Sustainability",
      image: "/api/placeholder/400/250"
    },
    {
      id: 3,
      title: "Project Management Excellence: 10 Strategies for Success",
      excerpt: "Learn proven project management techniques that ensure on-time, on-budget delivery of construction projects.",
      author: "John Smith",
      date: "2024-01-10",
      readTime: "7 min read",
      category: "Project Management",
      image: "/api/placeholder/400/250"
    },
    {
      id: 4,
      title: "Safety First: Latest OSHA Guidelines for Construction Sites",
      excerpt: "Stay compliant with the newest safety regulations and best practices to protect your workforce and projects.",
      author: "Lisa Chen",
      date: "2024-01-08",
      readTime: "5 min read",
      category: "Safety & Compliance",
      image: "/api/placeholder/400/250"
    },
    {
      id: 5,
      title: "BIM Technology: Revolutionizing Construction Planning",
      excerpt: "Understand how Building Information Modeling is transforming project visualization and coordination.",
      author: "David Wilson",
      date: "2024-01-05",
      readTime: "9 min read",
      category: "Technology",
      image: "/api/placeholder/400/250"
    },
    {
      id: 6,
      title: "Cost Control Strategies for Large-Scale Projects",
      excerpt: "Master the art of budget management with proven strategies for keeping construction costs under control.",
      author: "Emily Rodriguez",
      date: "2024-01-03",
      readTime: "6 min read",
      category: "Best Practices",
      image: "/api/placeholder/400/250"
    },
    {
      id: 7,
      title: "The Rise of Modular Construction: Benefits and Challenges",
      excerpt: "Explore how modular construction is changing the industry landscape with faster builds and improved quality.",
      author: "Robert Taylor",
      date: "2024-01-01",
      readTime: "8 min read",
      category: "Industry Trends",
      image: "/api/placeholder/400/250"
    }
  ];

  const stats = [
    { icon: BookOpen, value: "150+", label: "Articles Published" },
    { icon: User, value: "25+", label: "Expert Authors" },
    { icon: TrendingUp, value: "50K+", label: "Monthly Readers" },
    { icon: Calendar, value: "Weekly", label: "New Content" }
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
            alt="Construction professionals reading and learning" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="inline-flex items-center px-6 py-3 bg-yellow-500/20 backdrop-blur-sm rounded-full text-yellow-300 text-sm font-medium mb-8">
            📚 Knowledge Hub
          </div>
          <h1 className="text-6xl font-bold mb-8 leading-tight">
            Expert Insights &
            <span className="block text-yellow-400">Industry Trends</span>
          </h1>
          <p className="text-2xl mb-12 max-w-4xl mx-auto leading-relaxed opacity-90">
            Stay ahead of the curve with our comprehensive collection of articles covering the latest trends, 
            best practices, and innovations in the construction industry.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full pl-12 pr-4 py-4 rounded-full border-0 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-yellow-300"
                />
              </div>
              <button className="px-6 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full font-medium transition-colors text-white">
                <Filter className="w-5 h-5" />
              </button>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Article Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow cursor-pointer group">
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mb-3 ${category.color} group-hover:scale-105 transition-transform`}>
                  {category.name}
                </div>
                <div className="text-xl font-bold text-gray-900 mb-1">{category.count}</div>
                <div className="text-gray-600 text-sm">Articles</div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Article */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Article</h2>
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative">
                <img src={featuredArticle.image} alt={featuredArticle.title} className="w-full h-full object-cover min-h-[400px]" />
                <div className="absolute top-6 left-6 bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold">
                  FEATURED
                </div>
              </div>
              <div className="p-12">
                <div className="inline-flex px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-6">
                  {featuredArticle.category}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {featuredArticle.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4 text-gray-500">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      <span className="text-sm">{featuredArticle.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">{new Date(featuredArticle.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">{featuredArticle.readTime}</span>
                    </div>
                  </div>
                </div>
                <button className="inline-flex items-center bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-full transition-colors group">
                  Read Full Article
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Articles */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Recent Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <div key={article.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative">
                  <img src={article.image} alt={article.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      article.category === 'Technology' ? 'bg-purple-100 text-purple-800' :
                      article.category === 'Sustainability' ? 'bg-emerald-100 text-emerald-800' :
                      article.category === 'Project Management' ? 'bg-orange-100 text-orange-800' :
                      article.category === 'Safety & Compliance' ? 'bg-red-100 text-red-800' :
                      article.category === 'Best Practices' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-gray-500 text-sm mb-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{new Date(article.date).toLocaleDateString()}</span>
                    </div>
                    <button className="text-yellow-600 hover:text-yellow-700 font-medium text-sm group-hover:translate-x-1 transition-all">
                      Read More →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="bg-gradient-to-r from-gray-900 to-black rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Stay Informed with Our Newsletter</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Get the latest industry insights, expert tips, and trending topics delivered directly to your inbox every week.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-yellow-500"
            />
            <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-full transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Articles;
