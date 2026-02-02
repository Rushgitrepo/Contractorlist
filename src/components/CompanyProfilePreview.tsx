import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MapPin,
  Phone,
  Star,
  Mail,
  Globe,
  BadgeCheck,
  Calendar,
  Shield,
  CheckCircle,
  Award,
  Users,
  Clock,
  Camera,
  MessageSquare,
  X,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Home,
  Wrench,
  Verified,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import companyService from "@/api/companyService";

interface CompanyProfilePreviewProps {
  companyName: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const CompanyProfilePreview = ({ companyName, isOpen, onClose }: CompanyProfilePreviewProps) => {
  const [company, setCompany] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'reviews'>('overview');

  useEffect(() => {
    const fetchCompany = async () => {
      if (!companyName || !isOpen) return;

      setLoading(true);
      setError(null);
      try {
        const response = await companyService.getCompanyByName(companyName);
        if (response.success) {
          setCompany(response.data);
        } else {
          throw new Error(response.message || "Failed to load company");
        }
      } catch (e: any) {
        setError(e.message || "Failed to load company details");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyName, isOpen]);

  if (!isOpen) return null;

  const defaultImages = ["/home1.jpeg", "/home2.jpeg", "/home3.jpeg"];
  const images = company?.images && company.images.length > 0
    ? company.images
    : defaultImages;

  const rating = company?.rating || 0;
  const reviews = company?.reviews || company?.reviewCount || 0;
  const verifiedHires = company?.verifiedHires || company?.verified_hires || 0;
  const location = company?.location || company?.city || company?.state || "Unknown";
  const projects = company?.projects || company?.project_count || 0;
  const tagline = company?.tagline || company?.description || "";
  const testimonial = company?.testimonial || company?.review || "";
  const reviewer = company?.reviewer || company?.reviewer_name || "Anonymous";
  const isVerified = company?.verified_license || company?.verifiedLicense || false;
  const email = company?.email || company?.contact?.email || "";
  const phone = company?.phone || company?.contact?.phone || "";
  const website = company?.website || company?.contact?.website || "";
  const services = company?.services || company?.service_areas || [];
  const professionalCategory = company?.professional_category || company?.category || "";
  const yearsInBusiness = company?.yearsInBusiness || company?.experience_years || null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Company Profile
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6">
          {loading && (
            <div className="text-center py-12">
              <div className="text-gray-500">Loading company details...</div>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="text-red-500 mb-2">Error loading company</div>
              <div className="text-gray-600 text-sm">{error}</div>
            </div>
          )}

          {!loading && !error && company && (
            <>
              {/* Header Section */}
              <div className="flex gap-6 mb-6">
                <div className="flex-shrink-0 relative">
                  <img
                    src={images[0] || "/images.png"}
                    alt={company.name}
                    className="w-32 h-32 rounded-xl object-cover border-2 border-gray-200"
                  />
                  {isVerified && (
                    <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-2">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
                    {isVerified && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified License
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">{location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="text-lg font-semibold text-gray-900">
                        {rating.toFixed(1)}
                      </span>
                      <span className="text-gray-500">({reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Verified className="w-4 h-4 text-green-600" />
                      <span className="text-gray-600">{verifiedHires} Verified Hires</span>
                    </div>
                  </div>

                  {tagline && (
                    <p className="text-gray-700 mb-3">{tagline}</p>
                  )}

                  <div className="flex gap-2">
                    {phone && (
                      <Button variant="outline" size="sm" onClick={() => window.location.href = `tel:${phone}`}>
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                    )}
                    {email && (
                      <Button variant="outline" size="sm" onClick={() => window.location.href = `mailto:${email}`}>
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </Button>
                    )}
                    {website && (
                      <Button variant="outline" size="sm" onClick={() => window.open(website, '_blank')}>
                        <Globe className="w-4 h-4 mr-2" />
                        Website
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex gap-4">
                  {[
                    { id: 'overview', label: 'Overview', icon: Home },
                    { id: 'portfolio', label: 'Portfolio', icon: Camera },
                    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id as any)}
                      className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${activeTab === id
                        ? 'border-yellow-500 text-yellow-600 font-medium'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Description */}
                  {company.description && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                      <p className="text-gray-700 leading-relaxed">{company.description}</p>
                    </div>
                  )}

                  {/* Services */}
                  {services.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Services Offered</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {services.map((service: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                            <Wrench className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm font-medium">{service}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Credentials */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Credentials & Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {isVerified && (
                        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                          <Shield className="w-6 h-6 text-green-600" />
                          <div>
                            <div className="font-medium text-green-900">Verified License</div>
                            <div className="text-sm text-green-700">Licensed & Insured</div>
                          </div>
                        </div>
                      )}
                      {professionalCategory && (
                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <Briefcase className="w-6 h-6 text-blue-600" />
                          <div>
                            <div className="font-medium text-blue-900">Category</div>
                            <div className="text-sm text-blue-700">{professionalCategory}</div>
                          </div>
                        </div>
                      )}
                      {yearsInBusiness && (
                        <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                          <Calendar className="w-6 h-6 text-purple-600" />
                          <div>
                            <div className="font-medium text-purple-900">Years in Business</div>
                            <div className="text-sm text-purple-700">{yearsInBusiness} years</div>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <Award className="w-6 h-6 text-yellow-600" />
                        <div>
                          <div className="font-medium text-yellow-900">Projects Completed</div>
                          <div className="text-sm text-yellow-700">{projects} projects</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Business Highlights */}
                  {(company.responds_quickly || company.family_owned || company.eco_friendly || company.locally_owned) && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Highlights</h3>
                      <div className="flex flex-wrap gap-2">
                        {company.responds_quickly && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            <Clock className="w-3 h-3 mr-1" />
                            Responds Quickly
                          </Badge>
                        )}
                        {company.family_owned && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <Users className="w-3 h-3 mr-1" />
                            Family Owned
                          </Badge>
                        )}
                        {company.eco_friendly && (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Eco-Friendly
                          </Badge>
                        )}
                        {company.locally_owned && (
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                            <MapPin className="w-3 h-3 mr-1" />
                            Locally Owned
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Testimonial */}
                  {testimonial && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Client Testimonial</h3>
                      <p className="text-gray-700 italic mb-2">"{testimonial}"</p>
                      <p className="text-gray-600 text-sm">– {reviewer}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'portfolio' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Portfolio</h3>
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 3000 }}
                    className="w-full h-64 rounded-lg"
                  >
                    {images.map((img: string, idx: number) => (
                      <SwiperSlide key={idx}>
                        <img
                          src={img}
                          alt={`${company.name} project ${idx + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Reviews ({reviews})</h3>
                  <div className="space-y-4">
                    {testimonial && (
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <span className="text-yellow-600 font-semibold">
                                  {reviewer.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${i < Math.round(rating)
                                        ? "text-yellow-500 fill-yellow-500"
                                        : "text-gray-300"
                                        }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm font-semibold text-gray-900">{reviewer}</span>
                              </div>
                              <p className="text-gray-700 mb-2">{testimonial}</p>
                              <p className="text-xs text-gray-500">Verified Hire</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    {reviews === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No reviews available yet.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyProfilePreview;

