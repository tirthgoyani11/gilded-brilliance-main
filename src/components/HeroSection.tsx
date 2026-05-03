import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Diamond } from "lucide-react";
import { useRef } from "react";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

const trustBadges = [
  { iconImage: "/icons/logo_only_IGI.png", label: "Independently Certified" },
  { iconImage: "/icons/customer-care_6012388.png", label: "From Source To You" },
  { iconImage: "/icons/360-degrees_8200057.png", label: "360° Diamond View" },
];

const FloatingDiamonds = () => {
  const diamonds = [
    { src: "/shapes/round-Diamond.png", pos: "top-[12%] left-[8%]", size: "w-14 h-14 md:w-20 md:h-20", blur: "blur-[1.5px]", opacity: "opacity-25", anim: { y: [0, -30, 0], x: [0, 15, 0], rotate: [0, 8, -8, 0] }, dur: 14 },
    { src: "/shapes/cushion-Diamond.png", pos: "top-[55%] left-[3%]", size: "w-16 h-16 md:w-28 md:h-28", blur: "blur-[3px]", opacity: "opacity-15", anim: { y: [0, -40, 0], x: [0, -10, 0], rotate: [0, -12, 8, 0] }, dur: 18, delay: 2 },
    { src: "/shapes/emerald-Diamond.png", pos: "top-[18%] right-[6%]", size: "w-12 h-12 md:w-16 md:h-16", blur: "blur-[1px]", opacity: "opacity-30", anim: { y: [0, 20, 0], x: [0, -15, 0], rotate: [0, 15, -5, 0] }, dur: 16, delay: 1 },
    { src: "/shapes/pear-Diamond.png", pos: "bottom-[15%] right-[12%]", size: "w-20 h-20 md:w-28 md:h-28", blur: "blur-[4px]", opacity: "opacity-10", anim: { y: [0, -35, 0], x: [0, 20, 0], rotate: [0, -8, 12, 0] }, dur: 20, delay: 3 },
    { src: "/shapes/oval-Diamond.png", pos: "top-[40%] right-[25%]", size: "w-10 h-10 md:w-14 md:h-14", blur: "blur-[2px]", opacity: "opacity-20 hidden md:block", anim: { y: [0, -25, 0], rotate: [0, 20, 0] }, dur: 12, delay: 4 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {diamonds.map((d, i) => (
        <motion.img
          key={i}
          src={d.src}
          className={`absolute ${d.pos} ${d.size} ${d.blur} ${d.opacity} object-contain drop-shadow-2xl`}
          animate={d.anim}
          transition={{ duration: d.dur, repeat: Infinity, ease: "easeInOut", delay: d.delay || 0 }}
        />
      ))}
    </div>
  );
};

const HeroSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#FAFAFA]"
    >
      {/* Background image with parallax */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        style={{ y: imageY, scale: imageScale }}
      >
        <img
          src="/hero-vmora.png"
          alt="VMORA Luxury Diamond"
          className="h-full w-full object-cover"
        />
        {/* Light overlay for text readability */}
        <div className="hero-video-overlay-light absolute inset-0" />
      </motion.div>

      {/* Floating diamonds */}
      <FloatingDiamonds />

      {/* Sparkle overlay */}
      <div className="sparkle-overlay-light absolute inset-0 pointer-events-none z-[2]" />

      {/* Main content */}
      <motion.div
        className="relative z-10 container mx-auto px-5 sm:px-6 lg:px-12"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="max-w-2xl">
          {/* Accent line + tagline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: luxuryEase, delay: 0.3 }}
            className="mb-5 flex items-center gap-4"
          >
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, ease: luxuryEase, delay: 0.5 }}
              className="inline-block h-[1.5px] w-10 origin-left bg-primary sm:w-14"
            />
            <span className="font-accent text-sm italic tracking-[0.15em] text-primary sm:text-base lg:text-lg">
              Luxury Without Intermediaries
            </span>
          </motion.div>

          {/* Brand name */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: luxuryEase, delay: 0.5 }}
            className="font-heading text-[3.5rem] leading-[1] tracking-tight text-foreground sm:text-7xl lg:text-[5.5rem]"
          >
            VMORA
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: luxuryEase, delay: 0.7 }}
            className="mt-1 font-accent text-2xl italic tracking-wide text-muted-foreground sm:text-3xl lg:text-4xl"
          >
            Crafted Brilliance
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: luxuryEase, delay: 0.9 }}
            className="mt-6 max-w-lg text-[13px] leading-relaxed text-foreground/60 sm:mt-8 sm:text-sm lg:text-base"
          >
            Direct access to certified diamonds & sculpted jewelry. Custom creations sourced directly, delivered globally. No middlemen. Just mastery.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: luxuryEase, delay: 1.1 }}
            className="mt-8 flex flex-wrap gap-3 sm:mt-10 sm:gap-4"
          >
            <Button
              asChild
              variant="luxury"
              size="xl"
              className="bg-foreground text-background border-0 group hover:bg-primary hover:text-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_-4px_rgba(198,168,125,0.4)] transition-all duration-500"
            >
              <Link to="/diamonds">
                <Diamond className="w-4 h-4 mr-2" />
                Shop Diamonds
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="luxury-outline"
              size="xl"
              className="border-foreground/20 text-foreground backdrop-blur-sm group hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-500"
            >
              <Link to="/jewelry">
                Explore Jewelry
                <ArrowRight className="w-4 h-4 ml-2 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="luxury-outline"
              size="xl"
              className="border-foreground/20 text-foreground backdrop-blur-sm group hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-500 hidden sm:flex"
            >
              <Link to="/custom-jewelry-generator">
                Create Your Ring
                <ArrowRight className="w-4 h-4 ml-2 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: luxuryEase, delay: 1.5 }}
            className="mt-12 sm:mt-16"
          >
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              {trustBadges.map((badge, i) => (
                <div key={badge.label} className="flex items-center gap-2 group">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-foreground/8 bg-foreground/[0.03] transition-all duration-300 group-hover:border-primary/20 group-hover:bg-primary/5 sm:h-8 sm:w-8">
                    <img
                      src={badge.iconImage}
                      alt={`${badge.label} icon`}
                      className="w-3.5 h-3.5 object-contain transition-transform duration-300 group-hover:scale-110 sm:w-4 sm:h-4"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-foreground/50 transition-colors duration-300 group-hover:text-foreground/70 sm:text-[10px] sm:tracking-[0.15em]">
                    {badge.label}
                  </span>
                  {i < trustBadges.length - 1 && (
                    <span className="hidden h-4 w-px bg-foreground/8 sm:block sm:ml-2" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom gradient fade — blends into CategorySection */}
      <div className="absolute bottom-0 left-0 right-0 h-40 z-[11] bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/60 to-transparent pointer-events-none" />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 left-1/2 z-[12] hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[8px] font-medium uppercase tracking-[0.3em] text-foreground/40">Scroll</span>
          <div className="h-10 w-[1.5px] rounded-full bg-gradient-to-b from-foreground/30 via-foreground/10 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
