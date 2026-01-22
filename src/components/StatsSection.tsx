const StatsSection = () => {
  const stats = [
    { number: "10,000+", label: "Verified Contractors" },
    { number: "50,000+", label: "Projects Completed" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: "$2B+", label: "Project Value Managed" },
  ];

  return (
    <div className="py-4 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center"
            >
              <div className="text-lg sm:text-xl font-extrabold bg-gradient-to-br from-orange-600 to-yellow-500 bg-clip-text text-transparent mb-0.5">
                {stat.number}
              </div>
              <div className="text-gray-600 text-[10px] sm:text-xs font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
