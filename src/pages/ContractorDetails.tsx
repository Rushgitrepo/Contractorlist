import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Star, Phone, Mail, Globe, BadgeCheck, Calendar, Award, Shield } from "lucide-react";
import { contractorDetailsData } from "@/data/contractorDetailsData";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type ContractorDetailsResponse = {
  success: boolean;
  data?: any;
  message?: string;
};

const ContractorDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contractor, setContractor] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchById = async () => {
      if (!id) return;
      
      // Check if we have local data for this contractor
      if (contractorDetailsData[id]) {
        setContractor(contractorDetailsData[id]);
        setLoading(false);
        return;
      }
      
      // Otherwise fetch from API
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:5000/api/contractors/${id}`);
        const json: ContractorDetailsResponse = await res.json();
        if (!json.success) {
          throw new Error(json.message || "Failed to load contractor");
        }
        setContractor(json.data);
      } catch (e: any) {
        setError(e.message || "Failed to load contractor");
      } finally {
        setLoading(false);
      }
    };
    fetchById();
  }, [id]);

  const email = contractor?.contact?.email || contractor?.email || '';
  const phone = contractor?.contact?.phone || contractor?.phone || '';
  const website = contractor?.website || contractor?.contact?.website || '';
  const licenseNumber = contractor?.licenseNumber || contractor?.license || contractor?.credentials?.licenseNumber || '';
  const yearsInBusiness = contractor?.yearsInBusiness || contractor?.experienceYears || contractor?.experience?.years || null;
  const serviceAreas: string[] = contractor?.serviceAreas || contractor?.service_areas || [];
  const address = contractor?.address;
  const addressLine = address
    ? `${address.street || ''}${address.street ? ', ' : ''}${address.city || contractor?.location?.city || ''}, ${address.state || contractor?.location?.state || ''} ${address.zipCode || address.zip || contractor?.location?.zip || contractor?.location?.zipCode || ''}`
    : (contractor?.location?.address || `${contractor?.location?.city || ''}, ${contractor?.location?.state || ''}`);
  const reviewCount = (typeof contractor?.reviewCount === 'number' ? contractor?.reviewCount : undefined) ?? contractor?.rating?.count ?? (Array.isArray(contractor?.reviews) ? contractor?.reviews.length : undefined);
  const isVerified = contractor?.credentials?.isVerified || contractor?.badges?.isVerified || false;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (window.history.length > 1) {
                    navigate(-1);
                  } else {
                    navigate('/contractors');
                  }
                }}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="ml-2">Back to results</span>
              </button>
            </div>
            <Link to="/">
              <img src="/main-logo.png" alt="Contractorlist Logo" className="h-8 w-auto" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading && (
          <div className="text-center text-gray-600">Loading contractor...</div>
        )}
        {error && (
          <div className="text-center text-red-600">{error}</div>
        )}
        {!loading && !error && contractor && (
          <>
            {/* Hero Section with Image Gallery */}
            {contractor.portfolio && contractor.portfolio.length > 0 && (
              <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 5000 }}
                  className="h-96"
                >
                  {contractor.portfolio.map((img: string, idx: number) => (
                    <SwiperSlide key={idx}>
                      <img
                        src={img}
                        alt={`${contractor.name} project ${idx + 1}`}
                        className="w-full h-96 object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}

            <Card className="bg-white border shadow-lg mb-6">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{contractor.name}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {addressLine}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                            <span className="text-lg font-semibold text-gray-900">
                              {(contractor.rating?.average ?? contractor.rating ?? 0).toFixed ? (contractor.rating?.average ?? contractor.rating ?? 0).toFixed(1) : Number(contractor.rating?.average ?? contractor.rating ?? 0).toFixed(1)}
                            </span>
                            {typeof reviewCount === 'number' && (
                              <span className="text-gray-500">({reviewCount} reviews)</span>
                            )}
                          </span>
                        </div>
                      </div>
                      {isVerified && (
                        <Badge className="bg-green-100 text-green-800 border-green-300 flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Verified Business
                        </Badge>
                      )}
                    </div>

                    {contractor.description && (
                      <p className="text-gray-700 text-lg leading-relaxed mb-6">{contractor.description}</p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <div>
                          <span className="text-sm text-gray-600">Years in Business</span>
                          <p className="font-semibold text-gray-900">{yearsInBusiness ?? 'N/A'} years</p>
                        </div>
                      </div>
                      {licenseNumber && (
                        <div className="flex items-center gap-3">
                          <BadgeCheck className="w-5 h-5 text-green-600" />
                          <div>
                            <span className="text-sm text-gray-600">License Number</span>
                            <p className="font-semibold text-gray-900">{licenseNumber}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Certifications */}
                    {contractor.credentials?.certifications && contractor.credentials.certifications.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Award className="w-5 h-5 text-yellow-600" />
                          Certifications & Credentials
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {contractor.credentials.certifications.map((cert: string) => (
                            <Badge key={cert} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Awards */}
                    {contractor.awards && contractor.awards.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Award className="w-5 h-5 text-yellow-600" />
                          Awards & Recognition
                        </h3>
                        <ul className="space-y-2">
                          {contractor.awards.map((award: string, idx: number) => (
                            <li key={idx} className="flex items-center gap-2 text-gray-700">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              {award}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {(contractor.services || []).length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Services Offered</h3>
                        <div className="flex flex-wrap gap-2">
                          {(contractor.services || []).map((s: string) => (
                            <Badge key={s} className="bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {contractor.specialties && contractor.specialties.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Specialties</h3>
                        <div className="flex flex-wrap gap-2">
                          {contractor.specialties.map((s: string) => (
                            <Badge key={s} variant="secondary" className="text-sm">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {serviceAreas && serviceAreas.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-red-600" />
                          Service Areas
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {serviceAreas.map((a: string) => (
                            <Badge key={a} variant="outline" className="text-sm">{a}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t">
                      {phone && (
                        <Button onClick={() => (window.location.href = `tel:${phone}`)} className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                          <Phone className="w-4 h-4 mr-2" /> Call Now
                        </Button>
                      )}
                      {email && (
                        <Button variant="outline" onClick={() => (window.location.href = `mailto:${email}`)} className="font-medium">
                          <Mail className="w-4 h-4 mr-2" /> Send Email
                        </Button>
                      )}
                      {website && (
                        <Button variant="outline" onClick={() => window.open(website, "_blank")} className="font-medium">
                          <Globe className="w-4 h-4 mr-2" /> Visit Website
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Reviews / Testimonials */}
            <Card className="bg-white border shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Client Reviews & Testimonials</h2>
                
                {/* Overall rating summary */}
                <div className="flex items-center gap-6 mb-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-900 mb-2">
                      {(contractor?.rating?.average ?? contractor?.rating ?? 0).toFixed ? (contractor?.rating?.average ?? contractor?.rating ?? 0).toFixed(1) : Number(contractor?.rating?.average ?? contractor?.rating ?? 0).toFixed(1)}
                    </div>
                    <div className="flex items-center justify-center mb-1">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const avg = Number(contractor?.rating?.average ?? contractor?.rating ?? 0);
                        const filled = i < Math.round(avg);
                        return (
                          <Star key={i} className={`w-6 h-6 ${filled ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                        );
                      })}
                    </div>
                    {typeof reviewCount === 'number' && (
                      <div className="text-sm text-gray-600">{reviewCount} reviews</div>
                    )}
                  </div>
                  <div className="flex-1 text-gray-700">
                    <p className="text-lg">
                      Highly rated by clients for quality work, professionalism, and excellent customer service.
                    </p>
                  </div>
                </div>

                {Array.isArray(contractor?.testimonials) || Array.isArray(contractor?.reviews) ? (
                  <div className="space-y-6">
                    {(contractor.testimonials || contractor.reviews || []).map((r: any, idx: number) => {
                      const reviewer = r.clientName || r.reviewer || r.author || r.name || 'Client';
                      const location = r.clientLocation || r.location || '';
                      const text = r.comment || r.text || r.review || '';
                      const stars = Number(r.rating ?? r.stars ?? 0);
                      const date = r.reviewDate || r.date || r.createdAt || null;
                      const project = r.project || '';
                      return (
                        <div key={idx} className="border-2 border-gray-100 rounded-xl bg-white p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                                {reviewer.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 text-lg">{reviewer}</div>
                                {location && <div className="text-sm text-gray-500 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {location}
                                </div>}
                                {date && <div className="text-xs text-gray-400 mt-1">
                                  {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`w-5 h-5 ${i < Math.round(stars) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                              ))}
                            </div>
                          </div>
                          {project && (
                            <div className="mb-3">
                              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                {project}
                              </Badge>
                            </div>
                          )}
                          {text && (
                            <p className="text-gray-700 leading-relaxed text-base italic">
                              "{text}"
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Star className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No reviews yet. Be the first to review this contractor!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default ContractorDetails;


