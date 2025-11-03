import ReduxHeader from "@/components/ReduxHeader";
import Footer from "@/components/Footer";
import { Play, Clock, Eye, Calendar, Building2, Users, Award, TrendingUp } from "lucide-react";

const Videos = () => {
  const videoCategories = [
    { name: "Project Showcases", count: 24, color: "bg-blue-100 text-blue-800" },
    { name: "Company Insights", count: 18, color: "bg-green-100 text-green-800" },
    { name: "Client Testimonials", count: 15, color: "bg-purple-100 text-purple-800" },
    { name: "Industry Expertise", count: 12, color: "bg-orange-100 text-orange-800" }
  ];

  const featuredVideos = [
    {
      id: 1,
      title: "Downtown Commercial Complex - Complete Project Journey",
      description: "Follow our 18-month journey building a state-of-the-art commercial complex in the heart of downtown.",
      thumbnail: "/api/placeholder/400/225",
      duration: "12:45",
      views: "15.2K",
      category: "Project Showcases",
      date: "2024-01-15",
      featured: true
    },
    {
      id: 2,
      title: "Behind the Scenes: Our Project Management Process",
      description: "Discover how we coordinate complex construction projects with precision and efficiency.",
      thumbnail: "/api/placeholder/400/225",
      duration: "8:30",
      views: "8.7K",
      category: "Company Insights",
      date: "2024-01-10",
      featured: true
    },
    {
      id: 3,
      title: "Luxury Residential Development - Time-lapse Construction",
      description: "Watch 24 months of luxury home construction condensed into an amazing 5-minute time-lapse.",
      thumbnail: "/api/placeholder/400/225",
      duration: "5:20",
      views: "22.1K",
      category: "Project Showcases",
      date: "2024-01-05",
      featured: true
    }
  ];

  const allVideos = [
    {
      id: 4,
      title: "Client Success Story: TechManufacturing Facility",
      description: "Hear directly from our client about their experience with our industrial construction services.",
      thumbnail: "/api/placeholder/300/169",
      duration: "6:15",
      views: "5.3K",
      category: "Client Testimonials",
      date: "2023-12-28"
    },
    {
      id: 5,
      title: "Safety First: Our Comprehensive Safety Protocols",
      description: "Learn about our industry-leading safety measures that keep our teams and projects secure.",
      thumbnail: "/api/placeholder/300/169",
      duration: "9:40",
      views: "7.8K",
      category: "Company Insights",
      date: "2023-12-20"
    },
    {
      id: 6,
      title: "Sustainable Construction: Green Building Practices",
      description: "Explore our commitment to environmentally responsible construction methods and materials.",
      thumbnail: "/api/placeholder/300/169",
      duration: "11:25",
      views: "4.9K",
      category: "Industry Expertise",
      date: "2023-12-15"
    },
    {
      id: 7,
      title: "Team Spotlight: Meet Our Expert Engineers",
      description: "Get to know the talented engineers who bring our construction visions to life.",
      thumbnail: "/api/placeholder/300/169",
      duration: "7:55",
      views: "6.2K",
      category: "Company Insights",
      date: "2023-12-10"
    },
    {
      id: 8,
      title: "Innovation in Action: BIM Technology Implementation",
      description: "See how we use cutting-edge BIM technology to improve project accuracy and efficiency.",
      thumbnail: "/api/placeholder/300/169",
      duration: "10:30",
      views: "9.1K",
      category: "Industry Expertise",
      date: "2023-12-05"
    },
    {
      id: 9,
      title: "Client Testimonial: Premium Homes Development",
      description: "Premium Homes LLC shares their experience working with us on their luxury residential project.",
      thumbnail: "/api/placeholder/300/169",
      duration: "4:45",
      views: "3.7K",
      category: "Client Testimonials",
      date: "2023-11-30"
    }
  ];

  const stats = [
    { icon: Play, value: "69", label: "Total Videos" },
    { icon: Eye, value: "125K+", label: "Total Views" },
    { icon: Users, value: "2.8K", label: "Subscribers" },
    { icon: TrendingUp, value: "95%", label: "Positive Feedback" }
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
            alt="Video production and construction projects" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="inline-flex items-center px-6 py-3 bg-yellow-500/20 backdrop-blur-sm rounded-full text-yellow-300 text-sm font-medium mb-8">
            🎬 Video Library
          </div>
          <h1 className="text-6xl font-bold mb-8 leading-tight">
            Project Showcases &
            <span className="block text-yellow-400">Company Insights</span>
          </h1>
          <p className="text-2xl mb-12 max-w-4xl mx-auto leading-relaxed opacity-90">
            Explore our comprehensive video library featuring project time-lapses, behind-the-scenes content, 
            client testimonials, and industry expertise from our construction professionals.
          </p>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Video Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {videoCategories.map((category, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow cursor-pointer">
                <div className={`inline-flex px-4 py-2 rounded-full text-sm font-medium mb-4 ${category.color}`}>
                  {category.name}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">{category.count}</div>
                <div className="text-gray-600">Videos Available</div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Videos */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Videos</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredVideos.map((video) => (
              <div key={video.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-gray-900 ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
                    {video.duration}
                  </div>
                  <div className="absolute top-4 left-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                    FEATURED
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                      {video.category}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Eye className="w-4 h-4 mr-1" />
                      {video.views}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {video.description}
                  </p>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(video.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Videos */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">All Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allVideos.map((video) => (
              <div key={video.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 text-gray-900 ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {video.category}
                    </span>
                    <div className="flex items-center text-gray-500 text-xs">
                      <Eye className="w-3 h-3 mr-1" />
                      {video.views}
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                    {video.description}
                  </p>
                  <div className="flex items-center text-gray-500 text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(video.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-gray-900 to-black rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Subscribe for Latest Updates</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Stay updated with our latest project showcases, industry insights, and behind-the-scenes content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-full text-lg transition-colors">
              Subscribe Now
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-full text-lg transition-colors">
              View All Videos
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Videos;
