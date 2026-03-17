import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import LooseDiamondsCarousel from "@/components/LooseDiamondsCarousel";
import CategorySection from "@/components/CategorySection";
import DiamondSearchPreview from "@/components/DiamondSearchPreview";
import BestSellers from "@/components/BestSellers";
import EducationSection from "@/components/EducationSection";
import BrandStory from "@/components/BrandStory";
import Footer from "@/components/Footer";
import TrustSection from "@/components/TrustSection";
import DiamondJourney from "@/components/DiamondJourney";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { motion } from "framer-motion";

const FadeInReveal = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FadeInReveal>
          <LooseDiamondsCarousel />
        </FadeInReveal>
        <FadeInReveal>
          <CategorySection />
        </FadeInReveal>
        <FadeInReveal>
          <DiamondSearchPreview />
        </FadeInReveal>
        <FadeInReveal>
          <BestSellers />
        </FadeInReveal>
        <FadeInReveal>
          <TrustSection />
        </FadeInReveal>
        <DiamondJourney />
        <FadeInReveal>
          <EducationSection />
        </FadeInReveal>
        <FadeInReveal>
          <BrandStory />
        </FadeInReveal>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Index;
