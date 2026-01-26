import ReduxHeader from "@/components/ReduxHeader";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import RoleSelectionSection from "@/components/RoleSelectionSection";
import PopularCategoriesSection from "@/components/PopularCategoriesSection";
import AboutSection from "@/components/AboutSection";
import SolutionsSection from "@/components/SolutionsSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import ContractorSection from "@/components/ContractorSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <ReduxHeader />
      <HeroSection />
      <StatsSection />
      <RoleSelectionSection />
      <PopularCategoriesSection />
      <AboutSection />
      <ContractorSection />
      <SolutionsSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
