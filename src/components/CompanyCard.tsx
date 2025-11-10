import React from "react";
import { Mail, MapPin, Verified, Video } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

import { useNavigate } from "react-router-dom";

const CompanyCard = ({
  id,
  name = "Company Name",
  rating = 0,
  reviews = 0,
  verifiedHires = 0,
  tagline = "",
  testimonial = "",
  reviewer = "Anonymous",
  location = "Unknown",
  projects = 0,
  images = [],
  sponsored = false,
  bannerText = "",
}) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col md:flex-row w-full max-w-5xl border-b border-gray-200 shadow-sm overflow-hidden bg-white h-[260px] my-3 rounded-lg">
      {/* Left Section (Swiper Images) */}
      <div className="relative w-full md:w-[40%]">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          className="w-full h-full"
        >
          {(images && images.length > 0 ? images : ["/placeholder.png"]).map(
            (img, idx) => (
              <SwiperSlide key={idx}>
                <img
                  src={img}
                  alt={`${name} image ${idx + 1}`}
                  className="object-cover w-full h-full"
                />
              </SwiperSlide>
            )
          )}
        </Swiper>

        {bannerText && (
          <div className="absolute top-0 left-0 bg-black bg-opacity-80 text-white text-xs font-semibold px-3 py-1 rounded-br-lg z-10">
            {bannerText}
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex flex-col justify-between p-5 w-full md:w-[60%]">
        <div className="flex justify-between items-start">
          {/* Left Content */}
          <div className="flex-1 pr-5 w-[75%]">
            <h2 className="text-lg font-semibold text-gray-900">{name}</h2>

            <div className="flex items-center mt-1 space-x-1">
              <span className="text-yellow-400 text-sm">
                {"★".repeat(Math.round(rating || 0))}
              </span>
              <span className="text-gray-600 text-sm">
                {rating ? rating.toFixed(1) : "0.0"}
              </span>
              <span className="text-gray-400 text-sm">• {reviews} Reviews</span>
            </div>

            <div className="mt-1">
              <button className="border bg-gray-200 rounded-md px-3 py-1 text-xs font-medium flex items-center hover:bg-gray-50">
                <Verified className="w-3.5 h-3.5 mr-1" /> {verifiedHires}{" "}
                Verified Hire
              </button>
            </div>

            <h3 className="font-semibold text-gray-800 text-sm mt-3 leading-tight">
              {tagline}
            </h3>

            <p className="text-gray-600 text-xs mt-1 italic leading-snug">
              “{testimonial}”
            </p>

            <div className="flex justify-between items-center mt-2">
              <p className="text-gray-500 text-xs">– {reviewer}</p>
              <button 
                onClick={() => id && navigate(`/contractors/${id}`)}
                className="text-gray-700 text-xs font-medium hover:underline"
              >
                Read More →
              </button>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex flex-col items-end space-y-2">
            <button className="border border-gray-500 rounded-sm px-3 py-1 text-xs font-medium flex items-center hover:bg-gray-50">
              <Mail className="w-3.5 h-3.5 mr-1" /> Send Message
            </button>
            <button className="border border-gray-500 rounded-sm px-3 py-1 text-xs font-medium flex items-center hover:bg-gray-50">
              <Video className="w-3.5 h-3.5 mr-1" /> Video Meeting
            </button>

            <div className="flex flex-col text-gray-600 text-xs items-end mt-1 leading-tight">
              <div className="flex items-center">
                <MapPin className="w-3 h-3.5 mr-1" />
                <span>{projects} projects</span>
              </div>
              <span>in the {location} area</span>
            </div>

            {sponsored && (
              <div className="text-gray-400 text-xs mt-3">
                <span>Sponsored</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
