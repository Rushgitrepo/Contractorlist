import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" }
  ];

  return (
    <footer className="bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Popular Searches */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 text-base">Popular Searches:</h3>
            <ul className="space-y-2 mb-6">
              <li><Link to="/contractors?service=Plumbing" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Plumbing Services</Link></li>
              <li><Link to="/contractors?service=Electrical" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Electrical Work</Link></li>
              <li><Link to="/contractors?service=HVAC" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">HVAC Services</Link></li>
              <li><Link to="/contractors?service=Roofing" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Roofing & Gutters</Link></li>
              <li><Link to="/contractors?service=Painting" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Painting Services</Link></li>
              <li><Link to="/contractors?service=Landscaping" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Landscaping</Link></li>
            </ul>
            <div className="mt-6">
              <h4 className="font-semibold text-gray-800 mb-3 text-sm">Popular Cities:</h4>
              <ul className="space-y-2">
                <li><Link to="/contractors?location=New York" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">New York, NY</Link></li>
                <li><Link to="/contractors?location=Los Angeles" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Los Angeles, CA</Link></li>
                <li><Link to="/contractors?location=Chicago" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Chicago, IL</Link></li>
                <li><Link to="/contractors?location=Houston" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Houston, TX</Link></li>
              </ul>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 text-base">Quick links:</h3>
            <ul className="space-y-2 mb-6">
              <li><Link to="/services" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Browse by category</Link></li>
              <li><Link to="/contractors" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Browse by location</Link></li>
              <li><Link to="/contractors" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Browse by neighbourhood</Link></li>
              <li><Link to="/products" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Browse by products</Link></li>
              <li><Link to="/articles" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Smart Tips</Link></li>
              <li><Link to="/articles" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Construction Articles</Link></li>
              <li><Link to="/contractors" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Contractor Lists</Link></li>
              <li><Link to="/case-studies" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Success Stories</Link></li>
            </ul>
            <div className="mt-6">
              <h4 className="font-semibold text-gray-800 mb-3 text-sm">Advertisers:</h4>
              <ul className="space-y-2">
                <li><Link to="/contact-us" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Advertise with us</Link></li>
                <li><Link to="/join-network" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Add a free listing</Link></li>
                <li><Link to="/contact-us" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Fraud Prevention</Link></li>
                <li><Link to="/about-us" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">About Us</Link></li>
                <li><Link to="/testimonials" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Customer Reviews</Link></li>
              </ul>
            </div>
          </div>

          {/* Popular Services */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 text-base">Popular Services:</h3>
            <ul className="space-y-2 mb-6">
              <li><Link to="/contractors?service=Additions" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Additions & Remodels</Link></li>
              <li><Link to="/contractors?service=Kitchen" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Kitchen Remodeling</Link></li>
              <li><Link to="/contractors?service=Bathroom" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Bathroom Renovation</Link></li>
              <li><Link to="/contractors?service=Architects" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Architects & Engineers</Link></li>
              <li><Link to="/contractors?service=Cabinets" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Cabinets & Countertops</Link></li>
              <li><Link to="/contractors?service=Carpentry" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Carpentry Services</Link></li>
              <li><Link to="/contractors?service=Concrete" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Concrete & Masonry</Link></li>
              <li><Link to="/contractors?service=Driveways" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Driveways & Patios</Link></li>
              <li><Link to="/contractors?service=Drywall" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Drywall & Insulation</Link></li>
              <li><Link to="/contractors?service=Fencing" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Fencing & Gates</Link></li>
              <li><Link to="/contractors?service=Flooring" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Flooring & Hardwood</Link></li>
              <li><Link to="/contractors?service=Windows" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Windows & Doors</Link></li>
            </ul>
          </div>

          {/* For Contractor */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 text-base">For Contractor:</h3>
            <ul className="space-y-2 mb-6">
              <li><Link to="/services" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Complete Website</Link></li>
              <li><Link to="/join-network" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Get Quality Leads</Link></li>
              <li><Link to="/services" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Digital Marketing</Link></li>
              <li><Link to="/services" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Graphic Design</Link></li>
              <li><Link to="/contact-us" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Get Quotations</Link></li>
              <li><Link to="/services" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Social Media Marketing</Link></li>
              <li><Link to="/services" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Email Marketing</Link></li>
              <li><Link to="/services" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">SMS Marketing</Link></li>
              <li><Link to="/contact-us" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Free Consultation</Link></li>
              <li><Link to="/services" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Google Ads</Link></li>
              <li><Link to="/services" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">SEO Services</Link></li>
              <li><Link to="/contact-us" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">24/7 Support</Link></li>
              <li><Link to="/products" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">AI Tools</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 text-base">Resources:</h3>
            <ul className="space-y-2 mb-6">
              <li><Link to="/glossary" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Construction Glossary</Link></li>
              <li><Link to="/articles" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">How-to Guides</Link></li>
              <li><Link to="/videos" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Video Tutorials</Link></li>
              <li><Link to="/case-studies" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Project Case Studies</Link></li>
              <li><Link to="/testimonials" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Client Testimonials</Link></li>
              <li><Link to="/products/ai-cost-estimation" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Cost Calculator</Link></li>
              <li><Link to="/products/ai-quantity-takeoff" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Quantity Takeoff</Link></li>
            </ul>
            <div className="mt-6">
              <h4 className="font-semibold text-gray-800 mb-3 text-sm">Legal:</h4>
              <ul className="space-y-2">
                <li><Link to="/contact-us" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Privacy Policy</Link></li>
                <li><Link to="/contact-us" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Terms of Service</Link></li>
                <li><Link to="/contact-us" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Cookie Policy</Link></li>
                <li><Link to="/contact-us" className="text-gray-600 hover:text-gray-800 hover:underline underline-offset-4 decoration-2 transition-colors text-sm">Disclaimer</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center space-x-4 mt-8 mb-8">
          {socialLinks.map((social, index) => {
            const Icon = social.icon;
            return (
              <a
                key={index}
                href={social.href}
                aria-label={social.label}
                className="p-2 bg-gray-200 hover:bg-yellow-400 text-gray-600 hover:text-black rounded-lg transition-all duration-300"
              >
                <Icon className="w-5 h-5" />
              </a>
            );
          })}
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-300 mt-12 pt-8">
          <div className="flex justify-center">
            <p className="text-gray-600 text-sm text-center">
              Copyright © 2004-2024 Contractor List - All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;