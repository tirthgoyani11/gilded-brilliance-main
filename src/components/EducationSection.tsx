import { motion } from "framer-motion";
import { Diamond, Gem, Award, BookOpen } from "lucide-react";

const cards = [
  { icon: Diamond, title: "The 4Cs", desc: "Understanding Carat, Cut, Color, and Clarity — the universal language of diamond quality." },
  { icon: Gem, title: "Diamond Shapes", desc: "From Round Brilliant to Emerald — discover which shape reflects your personal style." },
  { icon: Award, title: "Certification", desc: "Why IGI and GIA certificates matter, and how to read them with confidence." },
  { icon: BookOpen, title: "Buying Guide", desc: "Expert insights on selecting the perfect diamond for any occasion or budget." },
];

const EducationSection = () => {
  return (
    <section className="py-24 lg:py-32 bg-secondary">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <p className="font-accent italic text-primary text-sm mb-3">Knowledge</p>
          <h2 className="font-heading text-3xl lg:text-4xl text-foreground">Diamond Education</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.2, 0, 0, 1], delay: i * 0.1 }}
              className="group cursor-pointer bg-background rounded-[12px] p-8 shadow-luxury luxury-transition hover:shadow-luxury-hover"
            >
              <card.icon className="w-6 h-6 text-primary mb-6" />
              <h3 className="font-heading text-lg text-foreground mb-3">{card.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
