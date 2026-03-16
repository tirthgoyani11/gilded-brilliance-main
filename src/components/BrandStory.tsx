import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const BrandStory = () => {
  const [content, setContent] = useState({
    eyebrow: "Our Heritage",
    title: "Where Vmora Precision Meets Passion",
    body: "Vmora curates exceptional diamonds and silver artistry with uncompromising standards. Every stone is hand-selected, independently certified, and paired with expert craftsmanship. Our commitment to transparency ensures each acquisition is more than a purchase; it is an investment in enduring beauty.",
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
    <section className="py-24 lg:py-32 bg-foreground">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-2xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
            className="font-accent italic text-primary text-lg mb-6"
          >
            {content.eyebrow}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.2, 0, 0, 1], delay: 0.1 }}
            className="font-heading text-3xl lg:text-4xl text-background mb-8 leading-tight"
          >
            {content.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.2, 0, 0, 1], delay: 0.2 }}
            className="font-body text-background/60 text-sm leading-relaxed mb-10"
          >
            {content.body}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.2, 0, 0, 1], delay: 0.3 }}
          >
            <Button variant="luxury-outline" size="lg" className="border-background/30 text-background hover:bg-background hover:text-foreground">
              {content.buttonText}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
