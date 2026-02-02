import ReduxHeader from "@/components/ReduxHeader";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import RoleSelectionSection from "@/components/RoleSelectionSection";
import FeaturedProjectsSection from "@/components/FeaturedProjectsSection";
import PopularCategoriesSection from "@/components/PopularCategoriesSection";
import AIPoweredSolutionsSection from "@/components/AIPoweredSolutionsSection";
import GuideAndValueSection from "@/components/GuideAndValueSection";
import SolutionsSection from "@/components/SolutionsSection";
import LocationsSection from "@/components/LocationsSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <ReduxHeader />
      <HeroSection />
      <StatsSection />
      <PopularCategoriesSection />
      <RoleSelectionSection />
      <FeaturedProjectsSection />
      <AIPoweredSolutionsSection />
      <GuideAndValueSection />
      <SolutionsSection />
      <FAQSection />
      <LocationsSection/>
      <Footer />
    </div>
  );
};

export default Index;
