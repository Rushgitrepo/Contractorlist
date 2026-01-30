import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-10 bg-primary w-full relative overflow-hidden">
      {/* Decorative Pattern - Subtle & Compact */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">

          {/* Left: Text & Actions */}
          <div className="text-left space-y-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-black mb-3 tracking-tight leading-tight">
                Ready to Transform Your <br className="hidden md:block" /> Construction Business?
              </h2>
              <p className="text-lg text-black/80 font-medium max-w-xl">
                Join thousands of professionals using ContractorList to streamline projects and grow their network.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/join-network">
                <Button className="bg-black text-white hover:bg-gray-800 font-bold h-12 px-8 rounded-full shadow-lg hover:scale-105 transition-all">
                  Join the Network
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/contact-us">
                <Button variant="outline" className="bg-transparent border-2 border-black text-black hover:bg-black/10 font-bold h-12 px-8 rounded-full">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Info Cards - Compact Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Card 1 */}
            <div className="bg-white/10 backdrop-blur-sm border border-black/5 rounded-2xl p-5 hover:bg-white/20 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-black/10 rounded-lg">
                  <Users className="w-5 h-5 text-black" />
                </div>
                <h3 className="text-lg font-bold text-black">For Contractors</h3>
              </div>
              <p className="text-sm text-black/75 leading-snug">
                Get more leads, manage team schedules, and grow your reputation with verified reviews.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white/10 backdrop-blur-sm border border-black/5 rounded-2xl p-5 hover:bg-white/20 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-black/10 rounded-lg">
                  <Building2 className="w-5 h-5 text-black" />
                </div>
                <h3 className="text-lg font-bold text-black">Project Owners</h3>
              </div>
              <p className="text-sm text-black/75 leading-snug">
                Find the perfect contractor with AI-powered matching.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CTASection; 