import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "How long does it take to build a new website?",
      answer:
        "After we've received the initial assets for your new website, it takes 4 to 6 weeks to complete the project.",
    },
    {
      question: "Do you use templates or do you do custom website designs?",
      answer:
        "We create custom website designs tailored to your specific business needs and brand identity. Each website is unique and built from scratch to ensure it perfectly represents your construction business.",
    },
    {
      question: "What type of marketing services do you offer?",
      answer:
        "We offer comprehensive digital marketing services including SEO, social media marketing, Google Ads, content marketing, email campaigns, and local business optimization to help grow your construction business.",
    },
    {
      question: "Do you work with all types of construction companies?",
      answer:
        "Yes, we work with all types of construction companies including general contractors, specialty contractors, home builders, commercial contractors, and construction service providers of all sizes.",
    },
    {
      question: "How much does it cost to build a new website?",
      answer:
        "Website costs vary based on your specific requirements, features needed, and complexity. We offer competitive pricing packages starting from basic websites to comprehensive business solutions. Contact us for a personalized quote.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Left Content - FAQ */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-black mb-8">
                Frequently Asked{" "}
                <span className="text-[#fce011]">Questions</span>:
              </h2>
            </div>

            {/* FAQ Items */}
            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFAQ === index;
                return (
                  <div
                    key={index}
                    className={`border-l-4 rounded-r-lg overflow-hidden shadow-sm ${isOpen
                      ? "border-[#fce011] bg-[#fce011]/10"
                      : "border-gray-200 bg-white"
                      }`}
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-opacity-80 transition-colors duration-200"
                    >
                      <span
                        className={`text-base font-medium pr-4 ${isOpen ? "text-gray-900" : "text-gray-700"
                          }`}
                      >
                        {faq.question}
                      </span>
                      <div className="flex-shrink-0">
                        {isOpen ? (
                          <Minus className="w-5 h-5 text-[#fce011]" />
                        ) : (
                          <Plus className="w-5 h-5 text-[#fce011]" />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-4">
                        <div className="pt-2">
                          <p className="text-gray-600 leading-relaxed text-sm">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Content - FAQ Image */}
          <div className="flex justify-center lg:justify-end items-center">
            <img
              src="/FAQS.png"
              alt="Construction professional"
              className="pt-10 w-full max-w-lg h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
