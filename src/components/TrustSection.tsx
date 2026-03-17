import { motion } from "framer-motion";
import { ShieldCheck, BadgeCheck, Truck, Globe, RotateCcw, Heart } from "lucide-react";

const trustItems = [
  {
    icon: BadgeCheck,
    title: "IGI Certified",
    description: "Every stone is independently graded by IGI with full traceability by report number.",
  },
  {
    icon: RotateCcw,
    title: "360° Diamond View",
    description: "Inspect every facet in immersive detail before you decide. No guesswork.",
  },
  {
    icon: Globe,
    title: "Direct Sourcing",
    description: "No middlemen. Diamonds travel directly from source to you — transparent pricing always.",
  },
  {
    icon: Truck,
    title: "Worldwide Shipping",
    description: "Complimentary insured delivery with signature confirmation to your doorstep, globally.",
  },
];

const TrustSection = () => {
  return (
    <section className="py-24 lg:py-32 bg-background relative">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-accent italic text-primary text-sm mb-3 block">
              Trust & Assurance
            </span>
            <h2 className="font-heading text-3xl lg:text-4xl text-foreground mb-3">
              Confidence in Every Carat
            </h2>
            <p className="font-body text-muted-foreground text-sm max-w-lg mx-auto">
              No middlemen. Just mastery. Every diamond is certified, every price is transparent.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {trustItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
              className="group rounded-2xl border border-border bg-background p-7 shadow-luxury luxury-transition hover:shadow-luxury-hover hover:border-primary/20"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center mb-5 luxury-transition group-hover:bg-primary/15">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading text-lg mb-2 text-foreground">{item.title}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
