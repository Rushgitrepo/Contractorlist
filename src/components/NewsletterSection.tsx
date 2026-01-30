import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HardHat, Mail, Bell, TrendingUp, Users, Award } from "lucide-react";

const NewsletterSection = () => {
  return (
    <div className="py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23fbbf24%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Stay Ahead with{" "}
              <span className="text-yellow-400">Industry Insights</span>
            </h2>
            <p className="text-base text-gray-300 leading-relaxed">
              Join thousands of construction professionals who receive our weekly newsletter with the latest industry trends, business tips, and exclusive platform updates.
            </p>
          </div>

          {/* Right - Newsletter Form */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl">
              {/* Hard Hat Icon */}
              <div className="absolute -top-3 -right-3 z-20">
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full p-3 shadow-lg">
                  <HardHat className="w-6 h-6 text-black" />
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-4">
                  Subscribe to Our Newsletter
                </h3>
                
                <div className="space-y-3">
                  {/* Email Input */}
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Mail className="w-4 h-4 text-gray-400" />
                    </div>
                    <Input 
                      type="email"
                      placeholder="Enter your email address"
                      className="pl-10 bg-white/90 border-0 text-gray-700 placeholder-gray-500 h-11 rounded-lg focus:bg-white focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>

                  {/* Subscribe Button */}
                  <Button 
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold px-6 py-2.5 h-11 rounded-lg text-base shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Subscribe Now
                  </Button>
                </div>

                <p className="text-gray-400 text-xs mt-3 text-center">
                  Join 25,000+ construction professionals. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSection;