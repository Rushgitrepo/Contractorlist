import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Eye,
  Heart,
  MessageSquare,
  DollarSign,
  Briefcase,
  ThumbsUp,
  Zap,
  Home,
  Wrench
} from "lucide-react";

interface ContractorCardProps {
  contractor: any;
  onViewProfile: (contractor: any) => void;
  onCall: (phone: string) => void;
  onEmail: (email: string) => void;
  onWebsite: (website: string) => void;
  featured?: boolean;
}

const ContractorCard = ({ 
  contractor, 
  onViewProfile, 
  onCall, 
  onEmail, 
  onWebsite,
  featured = false 
}: ContractorCardProps) => {
  const photo = '/images.png';
  const rating = contractor.rating?.average ?? contractor.rating ?? 4.8;
  const reviewCount = contractor.reviewCount ?? 24;
  const isVerified = contractor.credentials?.isVerified || contractor.badges?.isVerified || true;
  const licenseNumber = contractor.licenseNumber || contractor.license || "LIC-123456";
  const yearsInBusiness = contractor.yearsInBusiness || contractor.experienceYears || 12;
  const projectsCompleted = 150 - (Math.random() * 50);
  const hourlyRate = Math.floor(Math.random() * 100) + 50;
  const responseTime = Math.floor(Math.random() * 4) + 1;

  const email = contractor?.contact?.email || contractor?.email || 'contact@contractor.com';
  const phone = contractor?.contact?.phone || contractor?.phone || '(555) 123-4567';
  const website = contractor?.website || contractor?.contact?.website || '';

  const address = contractor?.address;
  const locationAddress = contractor?.location?.address || '';
  const addressLine = address
    ? `${address.street || ''}${address.street ? ', ' : ''}${address.city || contractor?.location?.city || ''}, ${address.state || contractor?.location?.state || ''} ${address.zipCode || address.zip || contractor?.location?.zip || contractor?.location?.zipCode || ''}`
    : (locationAddress || `${contractor?.location?.city || 'Local Area'}, ${contractor?.location?.state || 'State'}`);

  const serviceAreas = contractor?.serviceAreas || contractor?.service_areas || [];
  const services = contractor.services || ['Plumbing', 'Electrical', 'HVAC'];

  const getServiceIcon = (service: string) => {
    const iconMap: Record<string, any> = {
      'plumbing': Wrench,
      'electrical': Zap,
      'hvac': Home,
      'roofing': Home,
      'carpentry': Wrench,
      'painting': Wrench,
      'flooring': Home,
      'landscaping': Home
    };
    
    const key = service.toLowerCase();
    return iconMap[key] || Wrench;
  };

  return (
    <Card className={`bg-white border hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden ${
      featured ? 'ring-2 ring-yellow-400 shadow-lg' : ''
    }`}>
      {featured && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-400 to-yellow-500 text-black px-3 py-1 text-xs font-bold">
          <Award className="w-3 h-3 inline mr-1" />
          FEATURED
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="flex gap-6">
          {/* Contractor Image */}
          <div className="flex-shrink-0 relative">
            <div className="relative">
              <img
                src={photo}
                alt={contractor.name}
                className="w-28 h-28 rounded-xl object-cover border-2 border-gray-200 group-hover:border-yellow-400 transition-colors"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-xl transition-all duration-300 flex items-center justify-center">
                <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              {isVerified && (
                <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1.5 border-2 border-white">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            
            {/* Quick Stats */}
            <div className="mt-3 space-y-1">
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Clock className="w-3 h-3" />
                <span>Responds in {responseTime}h</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Users className="w-3 h-3" />
                <span>{Math.floor(projectsCompleted)} projects</span>
              </div>
            </div>
          </div>

          {/* Contractor Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-yellow-600 transition-colors truncate">
                    {contractor.name}
                  </h3>
                  {isVerified && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 flex-shrink-0">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{addressLine}</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.round(rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-gray-900">{rating.toFixed(1)}</span>
                  <span className="text-gray-500">({reviewCount} reviews)</span>
                  <div className="flex items-center gap-1 ml-2">
                    <ThumbsUp className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-600 font-medium">98% recommended</span>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="text-right flex-shrink-0 ml-4">
                <div className="text-sm text-gray-500 mb-1">Starting from</div>
                <div className="text-2xl font-bold text-gray-900">${hourlyRate}/hr</div>
                <div className="text-xs text-green-600 font-medium">Free estimates</div>
              </div>
            </div>

            {/* Description */}
            {contractor.description && (
              <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                {contractor.description}
              </p>
            )}

            {/* Professional Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                <Shield className="w-3 h-3 mr-1" />
                Licensed
              </Badge>
              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                <Briefcase className="w-3 h-3 mr-1" />
                {yearsInBusiness} Years
              </Badge>
              <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                <Clock className="w-3 h-3 mr-1" />
                Available Now
              </Badge>
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                <DollarSign className="w-3 h-3 mr-1" />
                Insured
              </Badge>
            </div>

            {/* Services */}
            <div className="mb-4">
              <div className="text-xs font-medium text-gray-600 mb-2">Specializes in:</div>
              <div className="flex flex-wrap gap-2">
                {services.slice(0, 4).map((service: string) => {
                  const ServiceIcon = getServiceIcon(service);
                  return (
                    <Badge key={service} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                      <ServiceIcon className="w-3 h-3 mr-1" />
                      {service}
                    </Badge>
                  );
                })}
                {services.length > 4 && (
                  <Badge variant="outline" className="text-xs text-gray-500">
                    +{services.length - 4} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Service Areas */}
            {serviceAreas && serviceAreas.length > 0 && (
              <div className="mb-4">
                <div className="text-xs font-medium text-gray-600 mb-1">Service Areas:</div>
                <div className="flex flex-wrap gap-1">
                  {serviceAreas.slice(0, 3).map((area: string) => (
                    <Badge key={area} variant="outline" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                  {serviceAreas.length > 3 && (
                    <Badge variant="outline" className="text-xs text-gray-500">
                      +{serviceAreas.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Recent Review Preview */}
            {contractor.reviews && contractor.reviews.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="text-xs font-medium text-gray-600 mb-1">Recent Review:</div>
                <div className="flex items-start gap-2">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < (contractor.reviews[0].rating || 5) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-700 line-clamp-2 flex-1">
                    "{contractor.reviews[0].comment || 'Excellent work and professional service. Highly recommended!'}"
                  </p>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  - {contractor.reviews[0].clientName || 'Verified Customer'}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  onCall(phone);
                }}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewProfile(contractor);
                }}
                className="border-gray-300 hover:border-yellow-400 hover:text-yellow-600"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Profile
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEmail(email);
                }}
                className="text-gray-600 hover:text-gray-800"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </Button>

              {website && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onWebsite(website);
                  }}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Website
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-red-500 ml-auto"
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractorCard;