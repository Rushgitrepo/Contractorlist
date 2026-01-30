import ReduxHeader from "@/components/ReduxHeader";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import RoleSelectionSection from "@/components/RoleSelectionSection";
import PopularCategoriesSection from "@/components/PopularCategoriesSection";
import ChooseYourPathSection from "@/components/ChooseYourPathSection";
import AboutSection from "@/components/AboutSection";
import SolutionsSection from "@/components/SolutionsSection";
import FAQSection from "@/components/FAQSection";
import LocationsSection from "@/components/LocationsSection";
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
      <LocationsSection />
      <Footer />
    </div>
  );
};

export default Index;
