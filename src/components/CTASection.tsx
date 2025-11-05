import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <div className="py-20 bg-gradient-to-r from-yellow-400 to-yellow-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Construction Projects?
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Join thousands of construction professionals who are already using Contractorlist to streamline their projects, find reliable contractors, and deliver exceptional results.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/join-network">
              <Button 
                className="bg-white text-yellow-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg flex items-center space-x-2"
              >
                <span>Join Our Network</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/contact-us">
              <Button 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-yellow-600 font-semibold px-8 py-4 text-lg"
              >
                Contact Us
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <div className="flex items-center mb-4">
                <Users className="w-8 h-8 mr-3" />
                <h3 className="text-xl font-semibold">For Contractors</h3>
              </div>
              <p className="text-white/90">
                Expand your business, find new clients, and manage projects efficiently with our comprehensive platform.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <div className="flex items-center mb-4">
                <Building2 className="w-8 h-8 mr-3" />
                <h3 className="text-xl font-semibold">For Project Owners</h3>
              </div>
              <p className="text-white/90">
                Find verified contractors, get competitive quotes, and ensure your projects are completed on time and budget.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection; 