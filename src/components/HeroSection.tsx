import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BadgeCheck, RotateCcw, Globe } from "lucide-react";
import { useRef } from "react";

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

const FloatingDiamonds = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Diamond 1 */}
      <motion.img
        src="/shapes/round-Diamond.png"
        className="absolute top-[15%] left-[10%] w-16 h-16 md:w-24 md:h-24 opacity-30 object-contain drop-shadow-2xl blur-[2px]"
        animate={{
          y: [0, -40, 0],
          x: [0, 20, 0],
          rotate: [0, 10, -10, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Diamond 2 */}
      <motion.img
        src="/shapes/cushion-Diamond.png"
        className="absolute top-[60%] left-[5%] w-20 h-20 md:w-32 md:h-32 opacity-20 object-contain drop-shadow-2xl blur-[4px]"
        animate={{
          y: [0, -60, 0],
          x: [0, -15, 0],
          rotate: [0, -15, 10, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      {/* Diamond 3 */}
      <motion.img
        src="/shapes/emerald-Diamond.png"
        className="absolute top-[20%] right-[8%] w-14 h-14 md:w-20 md:h-20 opacity-40 object-contain drop-shadow-lg blur-[1px]"
        animate={{
          y: [0, 30, 0],
          x: [0, -20, 0],
          rotate: [0, 20, -5, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      {/* Diamond 4 */}
      <motion.img
        src="/shapes/pear-Diamond.png"
        className="absolute bottom-[10%] right-[15%] w-24 h-24 md:w-36 md:h-36 opacity-15 object-contain drop-shadow-xl blur-[5px]"
        animate={{
          y: [0, -50, 0],
          x: [0, 30, 0],
          rotate: [0, -10, 15, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
    </div>
  );
};

const HeroSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax transformations
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={containerRef} className="relative h-screen min-h-[700px] max-h-[1000px] flex items-center overflow-hidden bg-[#FAFAFA]">
      {/* Image background with parallax & slow zoom effect */}
      <motion.div 
        className="absolute inset-0 overflow-hidden bg-white"
        style={{ y: imageY, scale: imageScale }}
      >
        <img
          src="/hero-vmora.png"
          alt="VMORA Luxury Diamond"
          className="w-full h-full object-cover animate-[pulse_30s_ease-in-out_infinite_alternate]"
        />
        <div className="hero-video-overlay-light absolute inset-0" />
      </motion.div>

      {/* Floating 3D Diamonds layer */}
      <FloatingDiamonds />

      {/* Sparkle overlay */}
      <div className="sparkle-overlay-light absolute inset-0 pointer-events-none" />

      {/* Content */}
      <motion.div 
        className="relative z-10 container mx-auto px-6 lg:px-12"
        style={{ y: contentY, opacity: contentOpacity }}
      >
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
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAFAFA] to-transparent" />
    </section>
  );
};

export default HeroSection;
