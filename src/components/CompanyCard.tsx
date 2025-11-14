import React, { useState } from "react";
import {
  Mail,
  MapPin,
  Verified,
  Phone,
  Globe,
  Award,
  Briefcase,
  Calendar,
  CheckCircle,
  Shield,
  Star,
  Building,
  Languages,
  DollarSign,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

interface CompanyCardProps {
  id?: string;
  name?: string;
  rating?: number;
  reviewsCount?: number;
  verifiedHires?: number;
  tagline?: string;
  featuredReview?: {
    reviewer?: string;
    reviewText?: string;
  };
  address?: string;
  verifiedBusiness?: boolean;
  description?: string;
  yearsInBusiness?: number | null;
  licenseNumber?: string;
  certifications?: string[];
  awards?: string[];
  servicesOffered?: string[];
  specialties?: string[];
  serviceAreas?: Array<{ city?: string; zip_code?: string }>;
  respondsQuickly?: boolean;
  hiredOnPlatform?: boolean;
  provides3d?: boolean;
  ecoFriendly?: boolean;
  familyOwned?: boolean;
  locallyOwned?: boolean;
  offersCustomWork?: boolean;
  languages?: string[];
  budgetRange?: string;
  professionalCategory?: string;
  images?: string[];
  sponsored?: boolean;
  bannerText?: string;
  email?: string;
  phone?: string;
  website?: string;
}

const CompanyCard = ({
  id,
  name = "Company Name",
  rating = 0,
  reviewsCount = 0,
  verifiedHires = 0,
  tagline = "",
  featuredReview,
  address,
  verifiedBusiness = false,
  description,
  yearsInBusiness,
  licenseNumber,
  certifications = [],
  awards = [],
  servicesOffered = [],
  specialties = [],
  serviceAreas = [],
  respondsQuickly = false,
  hiredOnPlatform = false,
  provides3d = false,
  ecoFriendly = false,
  familyOwned = false,
  locallyOwned = false,
  offersCustomWork = false,
  languages = [],
  budgetRange,
  professionalCategory,
  images = [],
  sponsored = false,
  bannerText = "",
  email,
  phone,
  website,
}: CompanyCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const defaultImages = ["/home1.jpeg", "/home2.jpeg", "/home3.jpeg"];
  const displayImages = images && images.length > 0 ? images : defaultImages;

  const businessHighlights = [
    { label: "Responds Quickly", active: respondsQuickly, icon: CheckCircle },
    { label: "Hired on Platform", active: hiredOnPlatform, icon: Verified },
    { label: "3D Visualization", active: provides3d, icon: Sparkles },
    { label: "Eco-Friendly", active: ecoFriendly, icon: CheckCircle },
    { label: "Family Owned", active: familyOwned, icon: Building },
    { label: "Locally Owned", active: locallyOwned, icon: MapPin },
    { label: "Custom Work", active: offersCustomWork, icon: Award },
  ].filter((h) => h.active);

  const budgetDisplay = budgetRange
    ? budgetRange === "$"
      ? "Budget-Friendly"
      : budgetRange === "$$"
      ? "Low-to-Mid Price"
      : budgetRange === "$$$"
      ? "Mid-to-High Price"
      : "Premium"
    : null;

  return (
    <div className="w-full max-w-6xl border border-gray-200 shadow-lg overflow-hidden bg-white my-4 rounded-xl">
      {/* Preview Section - Always Visible */}
      <div className="p-6">
        {/* Company Header - Compact Preview */}
        <div className="flex items-start gap-4 mb-4">
          {/* Company Image/Logo */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200">
              <img
                src={displayImages[0] || defaultImages[0]}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Company Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-gray-900">{name}</h2>
              {verifiedBusiness && (
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                  <Shield className="w-3 h-3" />
                  Verified Business
                </span>
              )}
            </div>

            <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold text-gray-900">
                  {rating.toFixed(1)}
                </span>
                <span className="text-gray-500">({reviewsCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <Verified className="w-4 h-4 text-green-600" />
                <span>{verifiedHires} Verified Hires</span>
              </div>
              {address && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{address}</span>
                </div>
              )}
            </div>

            {tagline && (
              <p className="text-gray-700 text-sm font-medium leading-relaxed mb-2">
                {tagline}
              </p>
            )}

            {/* Featured Review - Compact */}
            {featuredReview?.reviewText && (
              <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-yellow-400 mt-2">
                <p className="text-gray-700 italic text-sm mb-1">
                  "{featuredReview.reviewText}"
                </p>
                <p className="text-xs text-gray-600 font-medium">
                  – {featuredReview.reviewer || "Client"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-6 space-y-6 bg-gray-50">
          {/* Full Image Gallery */}
          <div className="relative">
            <div className="grid grid-cols-3 gap-0 h-64 rounded-lg overflow-hidden">
              {displayImages.slice(0, 3).map((img, idx) => (
                <div key={idx} className="relative overflow-hidden">
                  <img
                    src={img}
                    alt={`${name} ${idx + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
            {bannerText && (
              <div className="absolute top-4 left-4 bg-black bg-opacity-80 text-white text-xs font-semibold px-4 py-2 rounded-lg z-10">
                {bannerText}
              </div>
            )}
            {sponsored && (
              <div className="absolute top-4 right-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full z-10">
                SPONSORED
              </div>
            )}
          </div>

        {/* Description */}
        {description && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase mb-2">
              About
            </h3>
            <p className="text-gray-700 leading-relaxed">{description}</p>
          </div>
        )}

        {/* Key Information Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {professionalCategory && (
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <Briefcase className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-blue-600 font-medium uppercase">Category</p>
                <p className="text-sm font-semibold text-gray-900">{professionalCategory}</p>
              </div>
            </div>
          )}
          {yearsInBusiness && (
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
              <Calendar className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-purple-600 font-medium uppercase">Experience</p>
                <p className="text-sm font-semibold text-gray-900">{yearsInBusiness}+ years</p>
              </div>
            </div>
          )}
          {licenseNumber && (
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
              <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-green-600 font-medium uppercase">License</p>
                <p className="text-sm font-semibold text-gray-900">{licenseNumber}</p>
              </div>
            </div>
          )}
          {budgetDisplay && (
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
              <DollarSign className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-yellow-600 font-medium uppercase">Budget</p>
                <p className="text-sm font-semibold text-gray-900">{budgetDisplay}</p>
              </div>
            </div>
          )}
        </div>

        {/* Services & Specialties */}
        {(servicesOffered.length > 0 || specialties.length > 0) && (
          <div className="grid md:grid-cols-2 gap-4">
            {servicesOffered.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Services Offered
                </h3>
                <div className="flex flex-wrap gap-2">
                  {servicesOffered.map((service, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {specialties.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Specialties
                </h3>
                <div className="flex flex-wrap gap-2">
                  {specialties.map((specialty, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-200"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Certifications & Awards */}
        {(certifications.length > 0 || awards.length > 0) && (
          <div className="grid md:grid-cols-2 gap-4">
            {certifications.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Certifications
                </h3>
                <div className="space-y-2">
                  {certifications.map((cert, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg"
                    >
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      {cert}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {awards.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Awards
                </h3>
                <div className="space-y-2">
                  {awards.map((award, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm text-gray-700 bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200"
                    >
                      <Award className="w-4 h-4 text-yellow-600" />
                      {award}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Service Areas */}
        {serviceAreas.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Service Areas
            </h3>
            <div className="flex flex-wrap gap-2">
              {serviceAreas.map((area, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                >
                  {area.city}
                  {area.zip_code && ` (${area.zip_code})`}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Business Highlights */}
        {businessHighlights.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase mb-3">
              Business Highlights
            </h3>
            <div className="flex flex-wrap gap-2">
              {businessHighlights.map((highlight, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 text-yellow-700 text-xs font-medium rounded-full border border-yellow-200"
                >
                  <highlight.icon className="w-3.5 h-3.5" />
                  {highlight.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase mb-3 flex items-center gap-2">
              <Languages className="w-4 h-4" />
              Languages Spoken
            </h3>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-200"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}

          {/* Contact Buttons */}
          {(phone || email || website) && (
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
              {phone && (
                <button
                  onClick={() => window.location.href = `tel:${phone}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call Now
                </button>
              )}
              {email && (
                <button
                  onClick={() => window.location.href = `mailto:${email}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Send Email
                </button>
              )}
              {website && (
                <button
                  onClick={() => window.open(website, "_blank")}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  Visit Website
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Expand/Collapse Button */}
      <div className="border-t border-gray-200 bg-white">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-5 h-5" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-5 h-5" />
              Show More Details
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CompanyCard;
