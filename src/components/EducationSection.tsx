import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Palette, ArrowRight } from "lucide-react";

const topics = [
  {
    iconImage: "/icons/money_15109816.png",
    title: "The 4Cs",
    description: "Cut, Color, Clarity, and Carat — the universal measures of diamond quality.",
    link: "/education",
  },
  {
    iconImage: "/icons/logo_only_IGI.png",
    title: "IGI Certification",
    description: "Independent grading by the International Gemological Institute — your assurance of authenticity.",
    link: "/certificate-verification",
  },
  {
    icon: Palette,
    iconImage: "/shapes/heart-Diamond.png",
    title: "Diamond Shapes",
    description: "Round, Oval, Cushion, Emerald — discover which shape speaks to you.",
    link: "/education",
  },
  {
    iconImage: "/icons/victory_14424850.png",
    title: "Lab vs Natural",
    description: "Optically identical, chemically pure — understand the difference and make an informed choice.",
    link: "/education",
  },
];

const EducationSection = () => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden bg-[#FAFAFA]">
      {/* Marble Background Texture */}
      <div 
        className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: 'url(/marble-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
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
                className="group relative block rounded-2xl border border-border bg-background p-8 shadow-luxury luxury-transition hover:shadow-luxury-hover hover:border-[#C6A87D]/30 h-full diamond-glow"
              >
                <div className="w-12 h-12 rounded-[14px] bg-secondary flex items-center justify-center mb-6 luxury-transition group-hover:bg-[#FFF9F0]">
                  {"iconImage" in topic ? (
                    <img
                      src={topic.iconImage}
                      alt={topic.title}
                      className="w-7 h-7 object-contain luxury-transition group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <topic.icon className="w-5 h-5 text-primary group-hover:text-[#C6A87D] luxury-transition group-hover:-rotate-3 group-hover:scale-110" strokeWidth={1.5} />
                  )}
                </div>
                <h3 className="font-heading text-[1.1rem] mb-2.5 text-foreground group-hover:text-foreground luxury-transition leading-tight">{topic.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-[1.7] mb-6">{topic.description}</p>
                
                <div className="absolute bottom-8 left-8 right-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] font-bold text-[#C6A87D] group-hover:opacity-100 opacity-70 luxury-transition">
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 luxury-transition" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="flex justify-center"
        >
          <Link
            to="/education"
            className="px-8 py-4 rounded-xl border-2 border-border text-foreground text-xs uppercase tracking-[0.15em] font-medium hover:bg-foreground hover:text-background hover:border-foreground luxury-transition inline-flex items-center gap-3 group"
          >
            Explore Diamond Education
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 luxury-transition" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default EducationSection;
