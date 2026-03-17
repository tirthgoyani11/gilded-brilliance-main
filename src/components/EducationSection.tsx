import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Gem, Palette, Shield, Sparkles, ArrowRight } from "lucide-react";

const topics = [
  {
    icon: Gem,
    title: "The 4Cs",
    description: "Cut, Color, Clarity, and Carat — the universal measures of diamond quality.",
    link: "/education",
  },
  {
    icon: Shield,
    title: "IGI Certification",
    description: "Independent grading by the International Gemological Institute — your assurance of authenticity.",
    link: "/certificate-verification",
  },
  {
    icon: Palette,
    title: "Diamond Shapes",
    description: "Round, Oval, Cushion, Emerald — discover which shape speaks to you.",
    link: "/education",
  },
  {
    icon: Sparkles,
    title: "Lab vs Natural",
    description: "Optically identical, chemically pure — understand the difference and make an informed choice.",
    link: "/education",
  },
];

const EducationSection = () => {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-accent italic text-primary text-sm mb-3 block">Diamond Knowledge</span>
            <h2 className="font-heading text-3xl lg:text-4xl text-foreground mb-3">Buy with Confidence</h2>
            <p className="font-body text-muted-foreground text-sm max-w-md mx-auto">
              Understanding diamonds is the first step to choosing the perfect one. Explore our guides.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {topics.map((topic, i) => (
            <motion.div
              key={topic.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
            >
              <Link
                to={topic.link}
                className="group block rounded-2xl border border-border bg-background p-6 shadow-luxury luxury-transition hover:shadow-luxury-hover hover:border-primary/20 h-full"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center mb-5 luxury-transition group-hover:bg-primary/15">
                  <topic.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading text-lg mb-2 group-hover:text-primary luxury-transition">{topic.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">{topic.description}</p>
                <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] font-body text-primary group-hover:gap-2.5 luxury-transition">
                  Learn more
                  <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
