import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import DiamondSearchPreview from "@/components/DiamondSearchPreview";
import BestSellers from "@/components/BestSellers";
import EducationSection from "@/components/EducationSection";
import BrandStory from "@/components/BrandStory";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <CategorySection />
        <DiamondSearchPreview />
        <BestSellers />
        <EducationSection />
        <BrandStory />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
