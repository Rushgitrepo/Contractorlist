import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  Heart,
  Share2,
  X,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Briefcase,
  Home,
  Zap,
  Wrench
} from "lucide-react";

interface ContractorProfilePreviewProps {
  contractor: any;
  isOpen: boolean;
  onClose: () => void;
}

const ContractorProfilePreview = ({ contractor, isOpen, onClose }: ContractorProfilePreviewProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'reviews'>('overview');

  if (!contractor) return null;

  // Mock portfolio images
  const portfolioImages = [
    '/contractor.jpg',
    '/contractor-2.jpg',
    '/contractor-3.png',
    '/modern.jpg',
    '/constructionAboutUs.jpg'
  ];

  // Mock reviews data
  const mockReviews = [
    {
      id: 1,
      clientName: "Sarah Johnson",
      rating: 5,
      comment: "Excellent work on our kitchen remodel. Professional, on time, and exceeded expectations.",
      date: "2024-01-15",
      project: "Kitchen Remodel"
    },
    {
      id: 2,
      clientName: "Mike Chen",
      rating: 5,
      comment: "Outstanding plumbing work. Fixed our issues quickly and at a fair price.",
      date: "2024-01-10",
      project: "Plumbing Repair"
    },
    {
      id: 3,
      clientName: "Emily Davis",
      rating: 4,
      comment: "Great communication and quality work. Would definitely hire again.",
      date: "2024-01-05",
      project: "Bathroom Renovation"
    }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % portfolioImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + portfolioImages.length) % portfolioImages.length);
  };

  const rating = contractor.rating?.average ?? contractor.rating ?? 4.8;
  const reviewCount = contractor.reviewCount ?? mockReviews.length;
  const isVerified = contractor.credentials?.isVerified || contractor.badges?.isVerified || true;
  const licenseNumber = contractor.licenseNumber || contractor.license || "LIC-123456";
  const yearsInBusiness = contractor.yearsInBusiness || contractor.experienceYears || 12;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Contractor Profile
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Heart className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6">
          {/* Header Section */}
          <div className="flex gap-6 mb-6">
            <div className="flex-shrink-0 relative">
              <img
                src="/images.png"
                alt={contractor.name}
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
                <h1 className="text-3xl font-bold text-gray-900">{contractor.name}</h1>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Shield className="w-3 h-3 mr-1" />
                  Licensed & Insured
                </Badge>
              </div>

              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">
                    {contractor.location?.city || "Local Area"}, {contractor.location?.state || "State"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.round(rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="font-semibold">{rating.toFixed(1)}</span>
                  <span className="text-gray-500">({reviewCount} reviews)</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Briefcase className="w-3 h-3 mr-1" />
                  {yearsInBusiness} Years Experience
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  <Users className="w-3 h-3 mr-1" />
                  150+ Projects Completed
                </Badge>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                  <Clock className="w-3 h-3 mr-1" />
                  Available This Week
                </Badge>
              </div>

              <p className="text-gray-700 mb-4">
                {contractor.description || "Professional contractor with extensive experience in residential and commercial projects. Committed to quality workmanship and customer satisfaction."}
              </p>

              <div className="flex items-center gap-3">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
                <Button variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Quote
                </Button>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Starting from</div>
              <div className="text-2xl font-bold text-gray-900">$85/hr</div>
              <div className="text-sm text-gray-500">Free estimates</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: Home },
                { id: 'portfolio', label: 'Portfolio', icon: Camera },
                { id: 'reviews', label: 'Reviews', icon: MessageSquare }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === id
                      ? 'border-yellow-500 text-yellow-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
              {/* Services */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Services Offered</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(contractor.services || ['Plumbing', 'Electrical', 'HVAC', 'Carpentry', 'Painting', 'Flooring']).map((service: string) => (
                    <div key={service} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Wrench className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium">{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Credentials */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Credentials & Certifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                    <Shield className="w-6 h-6 text-green-600" />
                    <div>
                      <div className="font-medium text-green-900">Licensed Contractor</div>
                      <div className="text-sm text-green-700">License #{licenseNumber}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                    <div>
                      <div className="font-medium text-blue-900">Fully Insured</div>
                      <div className="text-sm text-blue-700">General Liability & Workers Comp</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Areas */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {(contractor.serviceAreas || ['Downtown', 'Suburbs', 'North Side', 'South Side', 'East End']).map((area: string) => (
                    <Badge key={area} variant="outline" className="text-sm">
                      <MapPin className="w-3 h-3 mr-1" />
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              {/* Featured Project */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Projects</h3>
                <div className="relative">
                  <img
                    src={portfolioImages[currentImageIndex]}
                    alt="Project"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {portfolioImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Project Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {portfolioImages.slice(0, 6).map((image, index) => (
                  <div key={index} className="relative group cursor-pointer">
                    <img
                      src={image}
                      alt={`Project ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all duration-300 flex items-center justify-center">
                      <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Review Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900">{rating.toFixed(1)}</div>
                    <div className="flex items-center justify-center mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.round(rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">{reviewCount} reviews</div>
                  </div>
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-2 mb-1">
                        <span className="text-sm w-8">{stars}★</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-500 h-2 rounded-full"
                            style={{ width: `${stars === 5 ? 80 : stars === 4 ? 15 : 5}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-8">
                          {stars === 5 ? '80%' : stars === 4 ? '15%' : '5%'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-4">
                {mockReviews.map((review) => (
                  <Card key={review.id} className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {review.clientName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-medium text-gray-900">{review.clientName}</div>
                            <div className="text-sm text-gray-500">{review.project}</div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                              ))}
                            </div>
                            <div className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractorProfilePreview;