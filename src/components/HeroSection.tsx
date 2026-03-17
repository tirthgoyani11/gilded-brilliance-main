import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BadgeCheck, RotateCcw, Globe } from "lucide-react";

const luxuryTransition = {
  duration: 1.2,
  ease: [0.16, 1, 0.3, 1] as const,
};

const heroVideoUrl =
  "https://cdn.pixabay.com/vimeo/345110515/diamond-24892.mp4?width=1280&hash=01bc724c965e6abefce4a123f15c7e84af314d3b";

const trustBadges = [
  { icon: BadgeCheck, label: "Independently Certified" },
  { icon: Globe, label: "From Source To You" },
  { icon: RotateCcw, label: "360° Diamond View" },
];

const HeroSection = () => {
  return (
    <section className="relative h-screen min-h-[700px] max-h-[1000px] flex items-center overflow-hidden bg-[#FAFAFA]">
      {/* Video background with slow zoom effect */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-60 scale-105 animate-[pulse_30s_ease-in-out_infinite_alternate]"
        >
          <source src={heroVideoUrl} type="video/mp4" />
        </video>
        <div className="hero-video-overlay-light absolute inset-0" />
      </div>

      {/* Sparkle overlay */}
      <div className="sparkle-overlay-light absolute inset-0 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...luxuryTransition, delay: 0.3 }}
            className="mb-6 flex items-center"
          >
            <span className="inline-block h-[2px] w-12 bg-[#C6A87D] mr-4" />
            <span className="font-accent italic text-[#C6A87D] text-lg lg:text-xl tracking-widest font-medium">
              Luxury Without Intermediaries
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...luxuryTransition, delay: 0.5 }}
            className="font-heading text-6xl md:text-7xl lg:text-[5.5rem] text-foreground leading-[1.05] mb-2 tracking-tighter"
          >
            VMORA
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...luxuryTransition, delay: 0.65 }}
            className="font-accent italic text-muted-foreground text-3xl md:text-4xl mb-8 tracking-wide"
          >
            Crafted Brilliance
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...luxuryTransition, delay: 0.8 }}
            className="font-body text-foreground/70 text-sm md:text-base leading-relaxed mb-10 max-w-lg"
          >
            Direct Access to Certified Diamonds. Sculpted jewelry and custom creations — sourced directly, delivered globally. No middlemen. Just mastery.
          </motion.p>

          {/* 3 Entry CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...luxuryTransition, delay: 1.0 }}
            className="flex flex-wrap gap-4 mb-16"
          >
            <Button
              asChild
              variant="luxury"
              size="xl"
              className="bg-foreground text-background hover:bg-[#C6A87D] hover:text-white border-0 group"
            >
              <Link to="/diamonds">
                Shop Diamonds
                <ArrowRight className="w-4 h-4 ml-2 luxury-transition group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="luxury-outline"
              size="xl"
              className="border-border text-foreground hover:bg-foreground hover:text-background group"
            >
              <Link to="/ring-builder">
                Create Your Ring
                <ArrowRight className="w-4 h-4 ml-2 opacity-0 luxury-transition group-hover:opacity-100 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="luxury-outline"
              size="xl"
              className="border-border text-foreground hover:bg-foreground hover:text-background group hidden sm:flex"
            >
              <Link to="/jewelry">
                Explore Jewelry
                <ArrowRight className="w-4 h-4 ml-2 opacity-0 luxury-transition group-hover:opacity-100 group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...luxuryTransition, delay: 1.3 }}
            className="flex flex-wrap items-center gap-6"
          >
            {trustBadges.map((badge, i) => (
              <div key={badge.label} className="flex items-center gap-2.5 group">
                <badge.icon className="w-4 h-4 text-[#C6A87D] luxury-transition group-hover:scale-110" />
                <span className="text-[10px] md:text-[11px] uppercase tracking-[0.15em] font-body text-foreground/70 font-medium">
                  {badge.label}
                </span>
                {i < trustBadges.length - 1 && (
                  <span className="hidden sm:block w-px h-4 bg-border ml-4" />
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAFAFA] to-transparent" />
    </section>
  );
};

export default HeroSection;
