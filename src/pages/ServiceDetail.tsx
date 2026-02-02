import { useParams, Link } from "react-router-dom";
import ReduxHeader from "@/components/ReduxHeader";
import Footer from "@/components/Footer";
import {
  ArrowLeft,
  CheckCircle2,
  Star,
  MapPin,
  Phone,
  Mail,
  Award,
  Users,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const ServiceDetail = () => {
  const { serviceName } = useParams<{ serviceName: string }>();
  const [zipCode, setZipCode] = useState("");

  // Convert URL slug to proper service name
  const formattedServiceName = serviceName
    ?.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') || '';

  // Mock contractors for this service
  const contractors = [
    {
      id: 1,
      name: "Elite " + formattedServiceName + " Pros",
      rating: 4.9,
      reviews: 127,
      responseTime: "Responds in about 2 hours",
      hires: 45,
      yearsInBusiness: 15,
      verified: true,
      description: `We are professional ${formattedServiceName.toLowerCase()} experts with over 15 years of experience. Our team is dedicated to providing top-quality service and customer satisfaction.`,
      services: [formattedServiceName, "Consultation", "Emergency Service"],
      zipCodes: ["90001", "90002", "90003"]
    },
    {
      id: 2,
      name: "Premium " + formattedServiceName + " Services",
      rating: 4.8,
      reviews: 98,
      responseTime: "Responds in about 3 hours",
      hires: 38,
      yearsInBusiness: 12,
      verified: true,
      description: `Trusted ${formattedServiceName.toLowerCase()} professionals serving the community for over a decade. We pride ourselves on quality workmanship and reliability.`,
      services: [formattedServiceName, "Maintenance", "Repair"],
      zipCodes: ["90004", "90005", "90006"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ReduxHeader />

      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link to="/services">
            <Button variant="ghost" className="mb-4 hover:bg-gray-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Services
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Check out 2 affordable {formattedServiceName.toLowerCase()} in your area
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Answer a few questions and we'll match you with top-rated professionals near you.
              </p>

              {/* ZIP Code Input */}
              <div className="flex gap-3 max-w-md">
                <div className="flex-1">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="ZIP code"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="pl-10 py-6 text-lg"
                    />
                  </div>
                </div>
                <Button className="bg-[#fce011] hover:bg-[#fce011]/90 text-black font-semibold px-8 py-6 text-lg">
                  Get quotes
                </Button>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="w-64 h-64 bg-gradient-to-br from-[#fce011]/20 to-gray-100 rounded-full flex items-center justify-center">
                <Briefcase className="w-32 h-32 text-[#fce011]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-[#fce011]">Home</Link>
            <span>/</span>
            <Link to="/services" className="hover:text-[#fce011]">Services</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{formattedServiceName}</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Affordable {formattedServiceName.toLowerCase()} near you
            </h2>
            <p className="text-gray-600">
              Top pros for your project
            </p>
          </div>

          {/* Contractors List */}
          <div className="space-y-6">
            {contractors.map((contractor) => (
              <div key={contractor.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Contractor Image/Logo */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#fce011]/20 to-gray-100 rounded-full flex items-center justify-center">
                      <Users className="w-10 h-10 text-[#fce011]" />
                    </div>
                  </div>

                  {/* Contractor Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between flex-wrap gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{contractor.name}</h3>
                          {contractor.verified && (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="font-semibold">{contractor.rating}</span>
                            <span>({contractor.reviews})</span>
                          </div>
                          <span>•</span>
                          <span>{contractor.hires} hires on platform</span>
                        </div>
                        <p className="text-sm text-gray-600">{contractor.responseTime}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 mb-4">
                      {contractor.description}
                    </p>

                    {/* Services Offered */}
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-900 mb-2">Services offered:</p>
                      <div className="flex flex-wrap gap-2">
                        {contractor.services.map((service, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-gray-100">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Service Areas */}
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-900 mb-2">Serves:</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-[#fce011]" />
                        <span>ZIP codes: {contractor.zipCodes.join(", ")}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button className="bg-[#fce011] hover:bg-[#fce011]/90 text-black font-semibold">
                      View profile
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sponsored Notice */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <div className="text-sm text-gray-700">
                <p className="font-semibold mb-1">Sponsored results</p>
                <p>These professionals pay to advertise their services. Learn more about how we rank pros and how we make money.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">FAQs</h2>
          
          <div className="space-y-4">
            <details className="group border border-gray-200 rounded-lg">
              <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50">
                <span className="font-semibold text-gray-900">How much do {formattedServiceName.toLowerCase()} cost?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-6 text-gray-600">
                <p>The cost of {formattedServiceName.toLowerCase()} varies depending on the scope of work, location, and specific requirements. On average, you can expect to pay between $100-$500 for basic services. Get free quotes from local professionals to get accurate pricing for your project.</p>
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg">
              <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50">
                <span className="font-semibold text-gray-900">How do I choose the best {formattedServiceName.toLowerCase()} company?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-6 text-gray-600">
                <p>Look for professionals with high ratings, verified reviews, proper licensing and insurance. Compare multiple quotes, check their portfolio of past work, and ensure they communicate clearly about timeline and costs.</p>
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg">
              <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50">
                <span className="font-semibold text-gray-900">How far in advance should I hire {formattedServiceName.toLowerCase()}?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-6 text-gray-600">
                <p>It's recommended to book {formattedServiceName.toLowerCase()} at least 2-4 weeks in advance, especially during peak seasons. However, many professionals offer emergency or same-day services for urgent needs.</p>
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg">
              <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50">
                <span className="font-semibold text-gray-900">What is considered a long distance move?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-6 text-gray-600">
                <p>This depends on the specific service requirements. Contact local professionals to discuss your project details and get personalized recommendations.</p>
              </div>
            </details>

            <details className="group border border-gray-200 rounded-lg">
              <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50">
                <span className="font-semibold text-gray-900">Where can I get {formattedServiceName.toLowerCase()} boxes?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-6 text-gray-600">
                <p>Many {formattedServiceName.toLowerCase()} professionals provide all necessary materials and supplies as part of their service. Ask your chosen professional about what's included in their quote.</p>
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why hire professionals on our platform?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#fce011] rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Free quotes</h3>
              <p className="text-gray-600">
                Tell us what you need and receive free quotes from local professionals. No obligation to hire.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#fce011] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Compare prices side by side</h3>
              <p className="text-gray-600">
                Compare quotes, profiles, and reviews to hire the right professional for your project.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#fce011] rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Hire with confidence</h3>
              <p className="text-gray-600">
                Read verified reviews from real customers and hire professionals with confidence.
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button className="bg-[#fce011] hover:bg-[#fce011]/90 text-black font-semibold px-8 py-6 text-lg">
              Get started
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServiceDetail;
