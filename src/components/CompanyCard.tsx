import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Shield,
  Star,
  Mail,
  Video,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

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
  serviceAreas?: any[];
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
  testimonials?: any[];
  reviews?: any[];
}

const CompanyCard = (props: CompanyCardProps) => {
  const {
    id,
    name = "Company Name",
    rating = 0,
    reviewsCount = 0,
    featuredReview,
    address,
    verifiedBusiness = false,
    images = [],
    hiredOnPlatform,
    respondsQuickly,
  } = props;

  const navigate = useNavigate();
  const defaultImages = [
    "/projects/kitchen-luxury.png",
    "/projects/living-room-modern.png",
    "/projects/bathroom-spa.png",
    "/projects/bedroom-suite.png",
    "/projects/exterior-modern.png"
  ];
  const displayImages = images && images.length > 0 ? images : defaultImages;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const numericRating =
    typeof rating === "number" && !Number.isNaN(rating)
      ? rating
      : Number(rating) || 0;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const handleReadMore = () => {
    navigate(`/contractors/${id || name.toLowerCase().replace(/\s+/g, "-")}`, {
      state: { company: props }
    });
  };

  const handleSendMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (props.email) {
      window.location.href = `mailto:${props.email}`;
    } else {
      handleReadMore();
    }
  };

  return (
    <div className="w-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 mb-6 rounded-none sm:rounded-lg overflow-hidden flex flex-col sm:flex-row">

      {/* 1. Left Column: Image Carousel (33% on desktop) */}
      <div className="sm:w-[280px] lg:w-[320px] relative h-64 sm:h-auto flex-shrink-0 bg-gray-100 group">
        <div
          className="absolute inset-x-0 bottom-0 top-0 cursor-pointer"
          onClick={handleReadMore}
        >
          <img
            src={displayImages[currentImageIndex]}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Carousel Controls */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {displayImages.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full shadow-sm ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* 2. Middle Column: Info (Flex Grow) */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col border-r border-gray-100">
        <div className="mb-1 flex items-start justify-between">
          <h2
            onClick={handleReadMore}
            className="text-xl font-bold text-gray-900 hover:text-yellow-600 cursor-pointer transition-colors line-clamp-1"
          >
            {name}
          </h2>
        </div>

        {/* Rating Row */}
        <div className="flex items-center gap-2 mb-3 text-sm">
          <div className="flex items-center text-primary">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.round(numericRating) ? "fill-primary" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="font-bold text-gray-900">{numericRating.toFixed(1)}</span>
          <span className="text-gray-500 border-l border-gray-300 pl-2 ml-1">
            {reviewsCount} Reviews
          </span>
        </div>

        {/* Badges / Category */}
        <div className="flex flex-wrap items-center gap-3 mb-3 text-xs sm:text-sm text-gray-600">
          {verifiedBusiness && (
            <span className="flex items-center gap-1 text-gray-700 font-medium">
              <Shield className="w-4 h-4 text-green-600" />
              Verified License
            </span>
          )}
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-gray-400" />
            {address || "New York, NY"}
          </span>
        </div>

        {/* Description Snippet */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {props.description || props.tagline || "We are a top-rated construction company dedicated to providing excellent service and quality workmanship for all your residential and commercial needs."}
          </p>
          <button onClick={handleReadMore} className="text-xs font-semibold text-gray-900 mt-1 hover:underline">
            Read More {'>'}
          </button>
        </div>

        {/* Recent Review Snippet (Bottom of Info) */}
        {featuredReview?.reviewText && (
          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-start gap-2">
              <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs italic text-gray-600 line-clamp-2">"{featuredReview.reviewText}"</p>
                <p className="text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-wide">
                  — {featuredReview.reviewer || "Recent Customer"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Right Column: Actions (Fixed Width on Desktop) */}
      <div className="w-full sm:w-[200px] bg-gray-50/50 p-5 sm:p-6 flex flex-col justify-start gap-3 border-l-0 sm:border-l border-b sm:border-b-0 border-gray-100">
        <Button
          onClick={handleSendMessage}
          variant="outline"
          className="w-full justify-center border-gray-300 font-semibold hover:border-yellow-600 hover:text-yellow-600 transition-all"
        >
          <Mail className="w-4 h-4 mr-2" />
          Send Message
        </Button>

        {props.phone && (
          <div className="text-center w-full">
            <span className="text-xs font-bold text-gray-900">
              Ph: <a href={`tel:${props.phone}`}>{props.phone}</a>
            </span>
          </div>
        )}

        <div className="mt-2 space-y-2">
          {respondsQuickly && (
            <div className="flex items-center gap-2 text-xs text-gray-700">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Responds Quickly
            </div>
          )}
          {hiredOnPlatform && (
            <div className="flex items-center gap-2 text-xs text-gray-700">
              <BadgeCheck className="w-4 h-4 text-primary" />
              Hired on Platform
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <Video className="w-4 h-4 text-black" />
            Video Meeting
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <CheckCircle className="w-4 h-4 text-black" />
            Free Estimates
          </div>
        </div>

        {/* Sponsored Label if needed */}
        {props.sponsored && (
          <div className="mt-auto text-right">
            <span className="text-[10px] uppercase text-gray-400 font-medium tracking-wider">Promoted</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyCard;
