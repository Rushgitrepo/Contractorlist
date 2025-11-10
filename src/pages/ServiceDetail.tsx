import { useParams, Link } from "react-router-dom";
import ReduxHeader from "@/components/ReduxHeader";
import Footer from "@/components/Footer";
import {
  ArrowLeft,
  CheckCircle2,
  Star,
  Clock,
  Award,
  Target,
  Lightbulb,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { servicesData } from "@/data/servicesData";

const ServiceDetail = () => {
  const { serviceName } = useParams<{ serviceName: string }>();

  // Get service data or show not found
  const serviceKey = serviceName?.toLowerCase() || "";
  const service = servicesData[serviceKey];

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ReduxHeader />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Service Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The service you're looking for doesn't exist.
          </p>
          <Button onClick={() => window.location.href = "/services"}>
            Back to Services
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const Icon = service.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50">
      <ReduxHeader />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23fbbf24%22%20fill-opacity%3D%220.4%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/services"
            className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to All Services
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Icon className="w-12 h-12 text-black" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="inline-block px-4 py-1 bg-yellow-400/20 border border-yellow-400 rounded-full text-yellow-400 text-sm font-semibold mb-4">
                {service.category}
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                {service.name}
              </h1>
              <p className="text-xl text-gray-300">{service.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Duration</div>
                <div className="font-semibold text-gray-900">
                  {service.duration}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Expertise</div>
                <div className="font-semibold text-gray-900">
                  {service.expertise}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Pricing</div>
                <div className="font-semibold text-gray-900">
                  {service.pricing}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-12">
              {/* Overview */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Service Overview
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {service.fullDescription}
                </p>
              </div>

              {/* Benefits */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Key Benefits
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Features Included
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Star className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Process */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Our Process
                  </h2>
                </div>
                <div className="space-y-4">
                  {service.process.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {idx + 1}
                      </div>
                      <div className="flex-1 pt-2">
                        <p className="text-gray-700 text-lg">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* CTA Card */}
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl p-8 text-black shadow-2xl">
                  <h3 className="text-2xl font-bold mb-4">
                    Ready to Get Started?
                  </h3>
                  <p className="mb-6 text-black/90">
                    Contact us today for a free consultation and quote.
                  </p>
                  <Link to="/contact-us">
                    <Button className="w-full bg-black hover:bg-gray-900 text-white font-bold py-6 text-lg">
                      Request a Quote
                    </Button>
                  </Link>
                  <div className="mt-6 pt-6 border-t border-black/20">
                    <div className="flex items-center gap-2 text-black/90 mb-2">
                      <Phone className="w-5 h-5" />
                      <span className="font-semibold">Call Us</span>
                    </div>
                    <p className="text-xl font-bold">1-800-CONTRACTOR</p>
                  </div>
                </div>

                {/* Related Services */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Related Services
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(servicesData)
                      .filter(
                        ([key, s]) =>
                          s.category === service.category && key !== serviceKey
                      )
                      .slice(0, 4)
                      .map(([key, s]) => {
                        const RelatedIcon = s.icon;
                        return (
                          <Link
                            key={key}
                            to={`/services/${key}`}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                          >
                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                              <RelatedIcon className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors">
                                {s.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {s.description}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                  </div>
                  <Link to="/services">
                    <Button variant="outline" className="w-full mt-4">
                      View All Services
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServiceDetail;
