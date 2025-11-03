import { Star, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const SolutionsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const testimonials = [
    {
      name: "Mike Rodriguez",
      role: "Home Owner",
      avatar: "M",
      avatarBg: "bg-gradient-to-br from-teal-500 to-teal-600",
      rating: 5,
      review: "It's such a relief to have these trusted resources when looking for reliable, honest, and professional contractors. The quality is outstanding and exceeded all my expectations."
    },
    {
      name: "Adrian Charles",
      role: "Home Owner",
      avatar: "A",
      avatarBg: "bg-gradient-to-br from-orange-500 to-orange-600",
      rating: 5,
      review: "What a blessing it is to have Randy and David providing such amazing service for homeowners. Their dedication to quality is unmatched in the industry."
    },
    {
      name: "Tactical Mav",
      role: "Property Manager",
      avatar: "T",
      avatarBg: "bg-gradient-to-br from-yellow-500 to-yellow-600",
      rating: 5,
      review: "The Contractor List is a top-tier service for homeowners! They vet contractors for licensing and reliability, ensuring quality work every single time."
    },
    {
      name: "Cesar Gonzalez",
      role: "Construction Pro",
      avatar: "C",
      avatarBg: "bg-gradient-to-br from-amber-600 to-amber-700",
      rating: 5,
      review: "We learned ways to better service our customers and became a bigger blessing to them. Here at MOMENTOUS Construction Group we appreciate this platform."
    },
    {
      name: "Admin Office",
      role: "Construction Pro",
      avatar: "A",
      avatarBg: "bg-gradient-to-br from-purple-600 to-purple-700",
      rating: 5,
      review: "Great company to be part of. Randy and David were extremely informative and have a heart for protecting consumers while maintaining the highest standards."
    },
    {
      name: "Sarah Johnson",
      role: "Property Manager",
      avatar: "S",
      avatarBg: "bg-gradient-to-br from-blue-500 to-blue-600",
      rating: 5,
      review: "Outstanding platform! The quality of contractors and seamless process made our commercial renovation project a huge success. Highly recommended!"
    },
    {
      name: "Robert Chen",
      role: "Home Owner",
      avatar: "R",
      avatarBg: "bg-gradient-to-br from-green-500 to-green-600",
      rating: 5,
      review: "Finally found reliable contractors through this platform. The vetting process gives me confidence in the quality of work I receive every time."
    }
  ];

  // Auto-scroll functionality
  useEffect(() => {
    if (isPlaying && !isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % testimonials.length;
          return nextIndex;
        });
      }, 4000); // Change every 4 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, isPaused, testimonials.length]);

  // Smooth scroll to current testimonial
  useEffect(() => {
    if (scrollContainerRef.current) {
      const cardWidth = 320; // w-80 = 320px
      const gap = 16; // gap-4 = 16px
      const scrollPosition = currentIndex * (cardWidth + gap);

      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23fbbf24%22%20fill-opacity%3D%220.4%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Home Owners & Construction Pros <span className="text-yellow-500">Love Us!</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Trusted by thousands of satisfied customers across the construction industry
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 mx-auto rounded-full"></div>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-4 mb-12">
          <button
            onClick={handlePrevious}
            className="p-4 rounded-full bg-white shadow-lg hover:shadow-xl border border-gray-200 hover:border-yellow-300 transition-all duration-300 group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-black transition-colors" />
          </button>

          <button
            onClick={togglePlayPause}
            className="p-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-black" />
            ) : (
              <Play className="w-6 h-6 text-black" />
            )}
          </button>

          <button
            onClick={handleNext}
            className="p-4 rounded-full bg-white shadow-lg hover:shadow-xl border border-gray-200 hover:border-yellow-300 transition-all duration-300 group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-black transition-colors" />
          </button>
        </div>

        {/* Testimonials Display - Show 3 at a time */}
        <div className="relative mb-12">
          <div className="grid md:grid-cols-3 gap-6">
            {[0, 1, 2].map((offset) => {
              const index = (currentIndex + offset) % testimonials.length;
              const testimonial = testimonials[index];
              const isCenter = offset === 1;

              return (
                <div
                  key={index}
                  className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transition-all duration-500 transform ${isCenter
                    ? 'scale-105 shadow-xl ring-2 ring-yellow-400 ring-opacity-30'
                    : 'hover:shadow-xl hover:-translate-y-2'
                    }`}
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  {/* Header with Avatar and Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 ${testimonial.avatarBg} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                      {testimonial.avatar}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-sm">{testimonial.name}</h4>
                      <p className="text-gray-500 text-xs">{testimonial.role}</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">5.0</span>
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {testimonial.review}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center items-center gap-2 mb-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                ? 'bg-yellow-500 scale-125 shadow-md'
                : 'bg-gray-300 hover:bg-gray-400'
                }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-yellow-600">
            Join Our Happy Customers
          </button>
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;