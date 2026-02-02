import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

const projectTypes = [
  { title: "Bathroom Remodeling", image: "/projects/types/bathroom.png" },
  { title: "Garage Building", image: "/projects/types/garage.png" },
  { title: "Kitchen Remodeling", image: "/projects/types/kitchen.png" },
  { title: "Custom Homes", image: "/projects/types/custom-home.png" },
  { title: "New Home Construction", image: "/projects/types/construction.png" },
  { title: "Garage Building", image: "/projects/types/garage.png" },
  { title: "Custom Homes", image: "/projects/types/custom-home.png" },
];

const ProjectTypeSelector = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 250;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const checkScrollPosition = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeft(scrollLeft > 0);
    setShowRight(scrollLeft + clientWidth < scrollWidth - 5);
  };

  useEffect(() => {
    checkScrollPosition();
    const ref = scrollRef.current;

    if (ref) {
      ref.addEventListener("scroll", checkScrollPosition);
      window.addEventListener("resize", checkScrollPosition);
    }

    return () => {
      if (ref) ref.removeEventListener("scroll", checkScrollPosition);
      window.removeEventListener("resize", checkScrollPosition);
    };
  }, []);

  return (
    <div className="py-5 relative">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Which of the following best matches your project?
      </h2>

      {/* Left Scroll Button */}
      {showLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute -left-6 top-[60%] -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10 hover:bg-gray-100 transition"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
      )}

      {/* Right Scroll Button */}
      {showRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute -right-6 top-[60%] -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10 hover:bg-gray-100 transition"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      )}

      {/* Scrollable Content */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-5 scrollbar-hide pb-2 scroll-smooth"
      >
        {projectTypes.map((project, index) => (
          <div
            key={index}
            className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex-shrink-0 hover:shadow-md transition-shadow duration-200 min-w-[230px]"
          >
            {/* Image Left */}
            <div className="w-20 h-20 flex-shrink-0">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text Right */}
            <div className="flex-1 px-4">
              <p className="text-gray-900 font-medium text-sm leading-snug">
                {project.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectTypeSelector;
