import ReduxHeader from "@/components/ReduxHeader";
import HeroSection from "@/components/HeroSection";
import PartnersSection from "@/components/PartnersSection";
import AboutSection from "@/components/AboutSection";
import SolutionsSection from "@/components/SolutionsSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <ReduxHeader />
      <HeroSection />
      <PartnersSection />
      <AboutSection />
      <SolutionsSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
