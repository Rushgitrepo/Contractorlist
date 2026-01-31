import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <div className="py-12 bg-gradient-to-r from-yellow-400 to-yellow-600">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Ready to Transform Your Pre-Construction Process?
          </h2>
          <p className="text-base text-black/80 max-w-2xl mx-auto mb-6">
            Join thousands of contractors using AI to discover leads, automate takeoffs, and win more profitable projects.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Link to="/join-network">
              <Button
                className="bg-white text-black hover:bg-gray-100 font-semibold px-6 py-3 text-base flex items-center space-x-2"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/contact-us">
              <Button
                className="bg-black text-white hover:bg-gray-900 font-semibold px-6 py-3 text-base"
              >
                Schedule Demo
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-black/70">
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection; 