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
    <section className="py-28 lg:py-36 bg-white relative overflow-hidden">
      {/* Subtle decorative element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(198,168,125,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center mb-4"
          >
            <span className="inline-block h-[1px] w-12 bg-[#C6A87D] mr-4" />
            <span className="font-accent italic text-[#C6A87D] text-[17px] tracking-widest font-medium">
              {content.eyebrow}
            </span>
            <span className="inline-block h-[1px] w-12 bg-[#C6A87D] ml-4" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground mt-4 mb-8 leading-[1.1] tracking-tight"
          >
            {content.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="font-body text-foreground/70 text-[16px] md:text-[18px] leading-[1.8] mb-12 max-w-2xl mx-auto"
          >
            {content.body}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 hidden"
          >
            {/* Keeping the button hidden to emphasize the stats underneath as requested in the luxury layout */}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 lg:gap-8 pt-10 border-t border-border/80"
          >
            {[
              { value: "10K+", label: "Diamonds Available" },
              { value: "100%", label: "IGI Certified" },
              { value: "40+", label: "Countries Served" },
            ].map((stat) => (
              <div key={stat.label} className="text-center group p-6 rounded-2xl luxury-transition hover:bg-[#FAFAFA]">
                <p className="font-heading text-4xl lg:text-[2.75rem] text-foreground mb-3 luxury-transition group-hover:scale-105">
                  {stat.value}
                </p>
                <div className="w-8 h-[2px] bg-[#C6A87D] mx-auto mb-3 opacity-50 group-hover:opacity-100 group-hover:w-12 luxury-transition" />
                <p className="font-body text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
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
