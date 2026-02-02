import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft, MapPin, Star, Phone, Mail, Globe, CheckCircle,
  Share2, Heart, Award, Shield, Hammer, Clock, Users, BadgeCheck
} from "lucide-react";
import { contractorDetailsData } from "@/data/contractorDetailsData";
import ReduxHeader from "@/components/ReduxHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { normalizeCompanyData } from "@/utils/normalizeCompany";

const ContractorDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize state from navigation location to prevent "Not found" flash
  const [contractor, setContractor] = useState<any | null>(location.state?.company || null);
  const [loading, setLoading] = useState(!location.state?.company);
  const [error, setError] = useState<string | null>(null);

  // State initialization
  useEffect(() => {
    const initData = async () => {
      // 1. Try to get data from navigation state first
      if (location.state?.company) {
        setContractor(location.state.company);
        setLoading(false);
        return;
      }

      // 2. Try to get data from local static data
      if (id && contractorDetailsData[id]) {
        setContractor(normalizeCompanyData(contractorDetailsData[id]));
        setLoading(false);
        return;
      }

      // 3. Fetch from API if neither (fallback)
      if (!id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${API_URL}/companies/${id}`);
        const json = await res.json();
        if (json.success) {
          setContractor(normalizeCompanyData(json.data));
        } else {
          throw new Error("Failed to load contractor data");
        }
      } catch (err) {
        console.error(err);
        // Fallback to a default mock for visualization if API fails in dev
        if (contractorDetailsData["grandeur-hills-group"]) {
          setContractor(normalizeCompanyData(contractorDetailsData["grandeur-hills-group"]));
        } else {
          setError("Could not load contractor details.");
        }
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [id, location.state]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!contractor && !loading) return <div className="p-10 text-center text-red-500">Contractor not found.</div>;

  // Data helpers
  const name = contractor.name || "Contractor Name";
  const description = contractor.description || "No description available.";
  const rating = Number(contractor.rating?.average ?? contractor.rating ?? 5.0);
  const reviewCount = contractor.rating?.count ?? contractor.reviewCount ?? contractor.reviewsCount ?? 20; // Default count match UI
  const address = contractor.address ?
    (typeof contractor.address === 'string' ? contractor.address : `${contractor.address.street || ''} ${contractor.address.city}, ${contractor.address.state}`)
    : (contractor.location ? `${contractor.location.city}, ${contractor.location.state}` : "New York, NY");

  const tags = contractor.servicesOffered || contractor.services || ["General Contractor", "Kitchen Remodeling", "Home Building"];
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const BASE_URL = API_URL.replace('/api', '');

  const projects = contractor.images || contractor.portfolio || [
    `${BASE_URL}/projects/kitchen-luxury.png`,
    `${BASE_URL}/projects/living-room-modern.png`,
    `${BASE_URL}/projects/bathroom-spa.png`,
    `${BASE_URL}/projects/bedroom-suite.png`,
    `${BASE_URL}/projects/exterior-modern.png`
  ];
  const reviews = contractor.testimonials || contractor.reviews || [];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <ReduxHeader />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Breadcrumb / Back */}
        <div className="mb-4">
          <button onClick={() => navigate(-1)} className="flex items-center text-sm text-gray-500 hover:text-black">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to results
          </button>
        </div>

        {/* Hero Gallery (New Grid Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8 h-[400px] overflow-hidden rounded-xl">
          <div className="md:col-span-2 h-full">
            <img src={projects[0] || "/home1.jpeg"} alt="Main Project" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" />
          </div>
          <div className="md:col-span-1 flex flex-col gap-2 h-full">
            <img src={projects[1] || "/home2.jpeg"} alt="Project 2" className="w-full h-[calc(50%-4px)] object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" />
            <img src={projects[2] || "/home3.jpeg"} alt="Project 3" className="w-full h-[calc(50%-4px)] object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" />
          </div>
          <div className="md:col-span-1 flex flex-col gap-2 h-full relative">
            <img src={projects[3] || "/home4.jpeg"} alt="Project 4" className="w-full h-[calc(50%-4px)] object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" />
            <div className="relative w-full h-[calc(50%-4px)] overflow-hidden cursor-pointer group">
              <img src={projects[4] || "/home5.jpeg"} alt="Project 5" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold text-lg group-hover:bg-black/50 transition-colors">
                View All Photos
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* LEFT COLUMN (Details) */}
          <div className="lg:col-span-8 space-y-10">

            {/* Header Info */}
            <div>
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  {/* Logo Box */}
                  <div className="w-24 h-24 bg-black rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-2xl border-4 border-white shadow-xl -mt-16 relative z-10">
                    {name.charAt(0)}
                  </div>
                  <div className="pt-2">
                    <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-1">{name}</h1>
                    <div className="flex items-center gap-3 text-sm mb-2">
                      <div className="flex text-[#fce011]">
                        {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.round(rating) ? "fill-current" : "text-gray-300 fill-none"}`} />)}
                      </div>
                      <span className="font-bold">{rating.toFixed(1)}</span>
                      <span className="text-gray-500 border-l border-gray-300 pl-3">{reviewCount} Reviews</span>
                      {contractor.isVerified && <span className="text-green-600 flex items-center gap-1 font-medium"><Shield className="w-3 h-3" /> Verified</span>}
                    </div>

                    <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1"><BadgeCheck className="w-4 h-4 text-primary" /> Premier Professional</span>
                      <span className="flex items-center gap-1">• Responds Quickly</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center gap-3 mt-6 pb-6 border-b border-gray-200">
                <Button variant="outline" className="h-9 px-4 text-sm font-semibold rounded-full border-gray-300 hover:border-black">Write a Review</Button>
                <Button variant="outline" className="h-9 px-4 text-sm font-semibold rounded-full border-gray-300 hover:border-black"><Share2 className="w-4 h-4 mr-2" /> Share</Button>
                <Button variant="outline" className="h-9 px-4 text-sm font-semibold rounded-full border-gray-300 hover:border-black"><Heart className="w-4 h-4 mr-2" /> Save</Button>
              </div>
            </div>

            {/* About Section */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4 uppercase tracking-wide">About Us</h2>
              <p className="text-gray-700 leading-relaxed text-base">
                {description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.slice(0, 5).map((tag: string, idx: number) => (
                  <Badge key={idx} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-normal px-3 py-1">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Projects Section */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-6 uppercase tracking-wide flex items-center justify-between">
                {projects.length} Projects
                <span className="text-xs font-normal text-primary lowercase cursor-pointer hover:underline">See all details</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {projects.slice(0, 4).map((img: string, idx: number) => (
                  <div key={idx} className="group cursor-pointer">
                    <div className="rounded-xl overflow-hidden mb-3 aspect-video relative bg-gray-100">
                      <img src={img} alt={`Project ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm flex items-center">
                        <Hammer className="w-3 h-3 mr-1" /> {Math.floor(Math.random() * 10) + 2} Photos
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 text-base group-hover:text-primary transition-colors">
                      {['Modern Kitchen Renovation', 'Master Suite Remodel', 'Custom Home Build', 'Outdoor Living Space'][idx] || 'General Renovation'}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" /> {contractor.serviceAreas?.[0] || "New York, NY"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Details */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-6 uppercase tracking-wide">Business Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">Business Name</h4>
                  <p className="text-sm text-gray-600">{name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">Typical Job Cost</h4>
                  <p className="text-sm text-gray-600">$50,000 - $250,000</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">Phone Number</h4>
                  <p className="text-sm text-gray-600 font-medium hover:text-primary cursor-pointer">{contractor.contact?.phone || contractor.phone || "(555) 123-4567"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">License Number</h4>
                  <p className="text-sm text-gray-600">{contractor.licenseNumber || "LIC-999999"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">Website</h4>
                  <a href={contractor.contact?.website || contractor.website || "#"} target="_blank" className="text-sm text-blue-600 hover:underline truncate block">
                    {contractor.contact?.website || contractor.website || "www.website.com"}
                  </a>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">Address</h4>
                  <p className="text-sm text-gray-600 flex items-start gap-1">
                    <MapPin className="w-3 h-3 mt-1 flex-shrink-0" /> {address}
                  </p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-6 uppercase tracking-wide">Featured Reviews</h2>

              {/* Review Summary Mock */}
              <div className="flex items-center gap-4 mb-8 bg-gray-50 p-4 rounded-lg">
                <div className="text-center px-4 border-r border-gray-200">
                  <span className="text-4xl font-bold text-gray-900 block">{rating.toFixed(1)}</span>
                  <div className="flex text-[#fce011] justify-center my-1"><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /></div>
                  <span className="text-xs text-gray-500">{reviewCount} Reviews</span>
                </div>
                <div className="flex-1 space-y-1">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs font-bold w-3">{star}</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#fce011]" style={{ width: star === 5 ? '80%' : star === 4 ? '15%' : '2%' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                {reviews.length === 0 ? <p className="text-gray-500 italic">No reviews yet.</p> :
                  reviews.map((comm: any, i: number) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-black flex-shrink-0">
                        {(comm.clientName || comm.reviewer || "U").charAt(0)}
                      </div>
                      <div className="flex-1 border-b border-gray-100 pb-6">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm">{comm.clientName || comm.reviewer || "Verified User"}</h4>
                            <div className="flex text-[#fce011] text-xs py-1">
                              {[...Array(5)].map((_, s) => <Star key={s} className="w-3 h-3 fill-current" />)}
                              <span className="text-gray-400 ml-2">{comm.reviewDate || comm.date || "Oct 2024"}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {comm.comment || comm.text || comm.review || "Great experience working with this team. They were professional, timely, and the quality of work exceeded my expectations."}
                        </p>
                        <button className="text-xs text-black font-semibold mt-2 hover:underline">Read More {'>'}</button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR (Sticky) */}
          <div className="lg:col-span-4 pl-4">
            <div className="sticky top-24 bg-white border border-gray-200 shadow-xl rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-base">Contact {name}</h3>
              <div className="space-y-4">
                <Input placeholder="Zip Code" defaultValue={contractor.address?.zipCode || "10001"} />
                <Input placeholder="What is your project?" />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Full Name" />
                  <Input placeholder="Email" type="email" />
                </div>
                <Input placeholder="Phone Number" type="tel" />
                <Textarea placeholder="Describe your project briefly..." className="min-h-[100px]" />

                <div className="text-xs text-gray-500 leading-tight">
                  By clicking Send, you agree to our Terms of Use and Privacy Policy.
                </div>

                <Button className="w-full bg-black text-white hover:bg-gray-800 h-12 text-base font-semibold">Send Message</Button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="font-bold text-black">{contractor.contact?.phone || "(555) 123-4567"}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* WHY HIRE SECTION */}
      <div className="mt-16 bg-[#fce011] py-12 text-center">
        <h2 className="text-2xl font-bold text-black mb-2">Ready to Transform Your Pre-Construction Process?</h2>
        <p className="text-black/80 mb-6 max-w-2xl mx-auto">Join thousands of contractors using our platform to win, manage, and deliver profitable projects.</p>
        <div className="flex justify-center gap-4">
          <Button className="bg-white text-black hover:bg-gray-100 border border-black/10 rounded-full px-8">Start Free Trial</Button>
          <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-8">Get Started</Button>
        </div>

        <div className="flex justify-center gap-6 mt-8 text-xs font-semibold text-black uppercase tracking-wide">
          <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Verified Pros</span>
          <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> 14-Day Free Trial</span>
          <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Cancel Anytime</span>
        </div>
      </div>

      {/* WHY HIRE ICONS ROW */}
      <div className="py-12 bg-white max-w-5xl mx-auto px-6">
        <h3 className="text-center font-bold text-lg mb-8 uppercase text-gray-900 border-b pb-4">Why hire General Contractors on Contractorlist?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Verified Licenses</h4>
            <p className="text-sm text-gray-500">We verify all licenses to ensure you're working with compliant pros.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Project Protection</h4>
            <p className="text-sm text-gray-500">Our platform offers protections for both owners and contractors.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Top-Rated Pros</h4>
            <p className="text-sm text-gray-500">Read reviews from real users to find the best match.</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContractorDetails;
