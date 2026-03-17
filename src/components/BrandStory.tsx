import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const BrandStory = () => {
  const [content, setContent] = useState({
    eyebrow: "Why Vmora",
    title: "Direct Access to Brilliance",
    body: "We believe luxury should never come with a hidden cost. Vmora connects you directly to the source — certified diamonds, expert craftsmanship, and transparent pricing — without the layers of intermediaries that inflate prices. Every stone is hand-selected, independently graded, and delivered with the assurance that you're getting exceptional value.",
    buttonText: "Discover Our Story",
  });

  useEffect(() => {
    let active = true;

    const loadContent = async () => {
      try {
        const response = await fetch("/api/content?key=brandStory");
        if (!response.ok || !active) return;
        const payload = await response.json();
        const cms = payload?.content?.payload;
        if (cms && typeof cms === "object") {
          setContent((prev) => ({
            eyebrow: typeof cms.eyebrow === "string" && cms.eyebrow.trim() ? cms.eyebrow : prev.eyebrow,
            title: typeof cms.title === "string" && cms.title.trim() ? cms.title : prev.title,
            body: typeof cms.body === "string" && cms.body.trim() ? cms.body : prev.body,
            buttonText: typeof cms.buttonText === "string" && cms.buttonText.trim() ? cms.buttonText : prev.buttonText,
          }));
        }
      } catch {
        // Keep fallback brand story content when API is unavailable.
      }
    };

    void loadContent();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="py-28 lg:py-36 bg-[#0A0A0A] relative overflow-hidden">
      {/* Subtle decorative element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#C6A87D]/[0.02] blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block h-px w-10 bg-[#C6A87D] mr-3 align-middle" />
            <span className="font-accent italic text-[#C6A87D] text-lg tracking-wide">
              {content.eyebrow}
            </span>
            <span className="inline-block h-px w-10 bg-[#C6A87D] ml-3 align-middle" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="font-heading text-3xl lg:text-4xl text-white mt-6 mb-8 leading-tight"
          >
            {content.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="font-body text-white/40 text-sm leading-[1.8] mb-10"
          >
            {content.body}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button
              asChild
              variant="luxury-outline"
              size="lg"
              className="border-white/15 text-white hover:bg-white hover:text-[#0A0A0A] group"
            >
              <Link to="/about">
                {content.buttonText}
                <ArrowRight className="w-4 h-4 ml-2 luxury-transition group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="mt-16 grid grid-cols-3 gap-8"
          >
            {[
              { value: "10K+", label: "Diamonds Available" },
              { value: "100%", label: "IGI Certified" },
              { value: "40+", label: "Countries Served" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-heading text-2xl lg:text-3xl luxury-gradient-text mb-1">
                  {stat.value}
                </p>
                <p className="font-body text-[10px] uppercase tracking-[0.18em] text-white/30">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
