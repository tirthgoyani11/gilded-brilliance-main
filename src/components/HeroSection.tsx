import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BadgeCheck, RotateCcw, Globe } from "lucide-react";

const luxuryTransition = {
  duration: 0.8,
  ease: [0.16, 1, 0.3, 1] as const,
};

const heroVideoUrl =
  "https://videos.pexels.com/video-files/4812205/4812205-uhd_3840_2160_30fps.mp4";

const trustBadges = [
  { icon: BadgeCheck, label: "IGI Certified" },
  { icon: RotateCcw, label: "360° Diamond View" },
  { icon: Globe, label: "Direct Sourcing" },
];

const HeroSection = () => {
  return (
    <section className="relative h-screen min-h-[700px] max-h-[1000px] flex items-center overflow-hidden bg-[#0A0A0A]">
      {/* Video background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster=""
          className="w-full h-full object-cover opacity-50"
        >
          <source src={heroVideoUrl} type="video/mp4" />
        </video>
        <div className="hero-video-overlay absolute inset-0" />
      </div>

      {/* Sparkle overlay */}
      <div className="sparkle-overlay absolute inset-0 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...luxuryTransition, delay: 0.3 }}
            className="mb-6"
          >
            <span className="inline-block h-px w-12 bg-[#C6A87D] mr-4 align-middle" />
            <span className="font-accent italic text-[#C6A87D] text-lg tracking-wide">
              Luxury Without Intermediaries
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...luxuryTransition, delay: 0.5 }}
            className="font-heading text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] mb-4 tracking-tight"
          >
            VMORA
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...luxuryTransition, delay: 0.65 }}
            className="font-accent italic text-white/60 text-2xl md:text-3xl mb-8 tracking-wide"
          >
            Crafted Brilliance
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...luxuryTransition, delay: 0.8 }}
            className="font-body text-white/50 text-sm leading-relaxed mb-10 max-w-md"
          >
            Certified diamonds, sculpted jewelry, and custom creations — sourced
            directly, delivered globally. No middlemen. Just mastery.
          </motion.p>

          {/* 3 Entry CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...luxuryTransition, delay: 1.0 }}
            className="flex flex-wrap gap-3 mb-16"
          >
            <Button
              asChild
              variant="luxury"
              size="xl"
              className="bg-white text-[#0A0A0A] hover:bg-[#C6A87D] hover:text-white border-0 group"
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
              className="border-white/20 text-white hover:bg-white hover:text-[#0A0A0A] group"
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
              className="border-white/20 text-white hover:bg-white hover:text-[#0A0A0A] group"
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
              <div key={badge.label} className="flex items-center gap-2.5">
                <badge.icon className="w-4 h-4 text-[#C6A87D]" />
                <span className="text-[11px] uppercase tracking-[0.15em] font-body text-white/50">
                  {badge.label}
                </span>
                {i < trustBadges.length - 1 && (
                  <span className="hidden sm:block w-px h-4 bg-white/10 ml-4" />
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
