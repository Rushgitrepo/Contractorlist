import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

const SolutionsSection = () => {
  const scrollRef = useRef(null);
  const [scrollX, setScrollX] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  const testimonials = [
    {
      name: "Mike",
      date: "16 August 2025",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review:
        "It's such a relief to have a trusted resource when looking for reliable, honest, and professional contractors. The contractors are knowledgeable...",
    },
    {
      name: "Adrian Charles",
      date: "16 August 2025",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review:
        "What a blessing it is to have Randy and David providing such an amazing service for homeowners! Putting them first is why I chose...",
    },
    {
      name: "Tactical Mav",
      date: "16 August 2025",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review:
        "The Good Contractors List is a top-tier service for homeowners! They vet contractors for licensing and reliability, ensuring quality work. The...",
    },
    {
      name: "Cesar Gonzalez",
      date: "15 August 2025",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review:
        "We learned of ways to service our customers and become a bigger blessing to them. Here at MOMENTOUS Construction Group we...",
    },
    {
      name: "Sarah Mitchell",
      date: "15 August 2025",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review:
        "Great company to be a part of. Randy and David were extremely informative and have a heart of protecting the consumer.",
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (scrollRef.current) {
        setMaxScroll(
          scrollRef.current.scrollWidth - scrollRef.current.clientWidth
        );
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleScroll = () => {
    if (scrollRef.current) setScrollX(scrollRef.current.scrollLeft);
  };

  const scroll = (dir) => {
    const { current } = scrollRef;
    if (current) {
      const width = current.clientWidth;
      const scrollAmount = dir === "left" ? -width : width;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Home Owners & Construction Pros Love Us!
          </h2>
        </div>

        {/* Scrollable Cards */}
        <div className="relative flex items-center">
          {/* Left Arrow */}
          {scrollX > 0 && (
            <button
              onClick={() => scroll("left")}
              className="absolute -left-10 z-10 bg-white border border-gray-300 p-2 rounded-full shadow-md hover:scale-110 transition"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
          )}

          {/* Cards */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth px-12"
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="relative flex-none w-[280px] bg-white border border-gray-200 rounded-2xl shadow-md p-5 h-[240px] mb-10 mt-12 flex flex-col justify-start"
              >
                {/* Avatar */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-16 h-16 rounded-full object-cover shadow-lg border-4 border-white"
                  />
                  <div className="absolute -bottom-1 right-0 bg-white p-[2px] rounded-full">
                    <img
                      src="google.png"
                      alt="Google logo"
                      className="w-5 h-5 rounded-3xl"
                    />
                  </div>
                </div>

                {/* Name & Date */}
                <h3 className="text-base font-semibold text-gray-900 text-center mt-8">
                  {t.name}
                </h3>
                <p className="text-xs text-gray-500 text-center mb-2">
                  {t.date}
                </p>

                {/* Rating */}
                <div className="flex justify-center mb-2">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star
                      key={j}
                      className="w-4 h-4 text-[#fce011] fill-[#fce011]"
                    />
                  ))}
                  <svg
                    className="w-4 h-4 ml-1 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9.5 16.5L5 12l1.4-1.4L9.5 13.7l8.1-8.1L19 7l-9.5 9.5z" />
                  </svg>
                </div>

                {/* Review */}
                <p className="text-gray-700 text-sm text-center leading-snug line-clamp-3 mb-2">
                  {t.review}
                </p>
                <p className="text-center text-gray-500 text-xs font-medium cursor-pointer hover:text-[#fce011]">
                  Read more
                </p>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          {scrollX < maxScroll - 10 && (
            <button
              onClick={() => scroll("right")}
              className="absolute -right-10 z-10 bg-white border border-gray-300 p-2 rounded-full shadow-md hover:scale-110 transition"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 border-t border-gray-200" />
    </section>
  );
};

export default SolutionsSection;
