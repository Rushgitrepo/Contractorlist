import { Link } from "react-router-dom";

const AboutSection = () => {
  return (
    <div className="py-16 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section - Header with CGS and Two Boxes */}
        <div className="grid lg:grid-cols-3 gap-8 items-start mb-12">
          {/* Left Content - CGS Logo and Description */}
          <div className="space-y-6">
            <div>
              <h1 className="text-7xl font-black text-black mb-1 leading-none">
                CGS<span className="text-yellow-500 text-5xl align-top font-black">ai</span>
              </h1>
              <h2 className="text-xl font-bold text-black mb-4 leading-tight">
                Contractor Growth Suite <span className="text-yellow-500">with AI</span>
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed mb-6">
                For 20+ years, Contractorlist helped construction professionals and
                agencies hit their growth goals with complete end-to-end solutions
                design, development, marketing, and ongoing support. With
                ConstructConnect subcontractors can grow their business by finding
                the right commercial construction projects, staying organized with
                real-time bid updates, and connecting with key decision-makers like
                General Contractors, Architects, and Owners.
              </p>
            </div>

            {/* Ask for Consultation Button */}
            <Link to="/contact-us">
              <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold px-6 py-3 rounded-full text-sm shadow-lg border-2 border-black">
                Ask for Consultation
              </button>
            </Link>
          </div>

          {/* Middle Content - Our Products Box with Button */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-7 border-4 border-black shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black">
                  Our <span className="text-yellow-500 font-extrabold">Products</span>
                </h3>
              </div>
              <p className="text-gray-700 text-sm mb-5 leading-relaxed">
                Launch and scale with modern commerce platforms and integrations
                built for speed and flexibility.
              </p>
              <ul className="space-y-2 text-sm text-gray-800 mb-5">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  AI Take Off & Cost Estimation
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  AI Assistant for contractorslist
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  Mojo rare
                </li>
              </ul>
              <Link to="/products" className="text-blue-600 text-sm font-semibold hover:text-blue-800 hover:underline transition-colors duration-200">
                learn more
              </Link>
            </div>
            {/* Products Button */}
            <div className="flex justify-center">
              <Link to="/products">
                <button className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-black font-bold px-8 py-4 rounded-full text-sm shadow-2xl border-3 border-black transform hover:scale-105 transition-all duration-200">
                  Complete Product Suite
                </button>
              </Link>
            </div>
          </div>

          {/* Right Content - Our Services Box with Button */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-7 border-4 border-black shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black">
                  Our <span className="text-yellow-500 font-extrabold">Services</span>
                </h3>
              </div>
              <p className="text-gray-700 text-sm mb-5 leading-relaxed">
                Launch and scale with modern commerce platforms and integrations
                built for speed and flexibility.
              </p>
              <ul className="space-y-2 text-sm text-gray-800 mb-5">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  AI Take Off & Cost Estimation
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  AI Assistant for contractorslist
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  Mojo rare
                </li>
              </ul>
            </div>
            {/* Services Button */}
            <div className="flex justify-center">
              <Link to="/services">
                <button className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-black font-bold px-8 py-4 rounded-full text-sm shadow-2xl border-3 border-black transform hover:scale-105 transition-all duration-200">
                  Explore Our Range of Services
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Middle Section - Manage your free listing */}
        <div className="text-left mb-16">
          <h2 className="text-4xl font-bold text-black">
            Manage your <span className="text-yellow-500">free</span> listing.
          </h2>
        </div>

        {/* Bottom Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-black leading-tight">
              We build <span className="text-yellow-500">websites</span>, <span className="text-yellow-500">marketing<br />campaigns</span> and <span className="text-yellow-500">full tech support</span><br />
              for Construction pros.
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              Stop investing in your website and marketing over and over again. No need to
              second guess what works, we already know.
            </p>

            {/* Awards/Badges - Real badge images */}
            <div className="flex gap-4 pt-4">
              <img
                src="/l.png"
                alt="Professional awards and certifications including Google 5-star reviews, Top Rated Local 2024, National Excellence 2023, and 2024 Best of the Best"
                className="h-32 w-auto object-contain"
              />
            </div>
          </div>

          {/* Right Content - Female Engineer Image */}
          <div className="flex justify-center lg:justify-end">
            <img
              src="/c.png"
              alt="Professional female engineer in blue shirt and yellow hard hat with award badges"
              className="w-full max-w-xl h-auto object-contain rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;