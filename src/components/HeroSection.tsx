import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import heroDiamond from "@/assets/hero-diamond.jpg";

const luxuryTransition = {
  duration: 0.6,
  ease: [0.2, 0, 0, 1] as const,
};

const HeroSection = () => {
  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] flex items-center overflow-hidden bg-foreground">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroDiamond}
          alt="Brilliant cut diamond with rainbow light dispersion"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-6 lg:px-12">
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...luxuryTransition, delay: 0.2 }}
            className="font-accent italic text-primary text-lg mb-4"
          >
            Vmora Signature Collection
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...luxuryTransition, delay: 0.4 }}
            className="font-heading text-4xl md:text-5xl lg:text-6xl text-background leading-[1.1] mb-6"
          >
            Brilliance Beyond Time
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...luxuryTransition, delay: 0.6 }}
            className="font-body text-background/70 text-sm leading-relaxed mb-10 max-w-md"
          >
            Discover certified IGI and GIA diamonds, sculpted silver jewelry, and custom creations designed to become heirlooms.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...luxuryTransition, delay: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <Button variant="luxury" size="xl" className="bg-background text-foreground hover:bg-primary hover:text-primary-foreground">
              Shop Jewelry
            </Button>
            <Button variant="luxury-outline" size="xl" className="border-background/40 text-background hover:bg-background hover:text-foreground">
              Explore Diamonds
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
