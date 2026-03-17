import { motion } from "framer-motion";
import { ShieldCheck, BadgeCheck, Truck, Globe, RotateCcw, Heart } from "lucide-react";

const trustItems = [
  {
    icon: BadgeCheck,
    title: "IGI Certified",
    description: "Every diamond is independently certified with full traceability.",
  },
  {
    icon: ShieldCheck,
    title: "No Middlemen",
    description: "Direct sourcing ensures transparent pricing, always.",
  },
  {
    icon: Globe,
    title: "Direct Sourcing",
    description: "From source to you. No compromises. Just mastery.",
  },
  {
    icon: Truck,
    title: "Discreet Shipping",
    description: "Delivered securely and discreetly to your doorstep, globally.",
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
              className="group relative rounded-2xl border border-border bg-background p-8 shadow-luxury luxury-transition hover:shadow-luxury-hover hover:border-[#C6A87D]/30 diamond-glow"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle_at_top_right,rgba(198,168,125,0.06),transparent_70%)] rounded-tr-2xl pointer-events-none" />
              
              <div className="w-12 h-12 rounded-[14px] bg-secondary flex items-center justify-center mb-6 luxury-transition group-hover:scale-110 group-hover:bg-[#FFF9F0]">
                <item.icon className="w-6 h-6 text-[#C6A87D] luxury-transition group-hover:rotate-3" strokeWidth={1.5} />
              </div>
              <h3 className="font-heading text-[1.15rem] mb-2.5 text-foreground leading-tight">{item.title}</h3>
              <p className="text-[13px] text-muted-foreground leading-[1.7]">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
