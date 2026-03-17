import { motion } from "framer-motion";
import { Gem, Scissors, BadgeCheck, Truck } from "lucide-react";

const steps = [
  {
    icon: Gem,
    step: "01",
    title: "Mined from Earth",
    subtitle: "Ethical Origins",
    description: "Every diamond begins its journey deep within the earth, or in state-of-the-art facilities, sourced with strict ethical standards.",
  },
  {
    icon: Scissors,
    step: "02",
    title: "Cut & Polished",
    subtitle: "Unleashing Brilliance",
    description: "Expert artisans masterfully cut and polish each rough stone to maximize its fire, brilliance, and scintillation.",
  },
  {
    icon: BadgeCheck,
    step: "03",
    title: "Master Craftsmanship",
    subtitle: "Jewelry Creation",
    description: "Your chosen diamond is securely set into precision-crafted jewelry, designed to illuminate the stone's beauty for a lifetime.",
  },
  {
    icon: Truck,
    step: "04",
    title: "Directly to You",
    subtitle: "Secure Delivery",
    description: "With no intermediaries, your bespoke piece travels straight from the jeweler to your hands — insured and discreetly packaged.",
  },
];

const DiamondJourney = () => {
  return (
    <section className="py-24 lg:py-32 bg-[#FAFAFA] relative overflow-hidden">
      {/* Subtle sparkle background */}
      <div className="sparkle-overlay-light absolute inset-0 opacity-40 pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center mb-3"
          >
            <span className="inline-block h-[1px] w-12 bg-[#C6A87D] mr-4" />
            <span className="font-accent italic text-[#C6A87D] text-sm md:text-base tracking-widest uppercase">
              The Vmora Process
            </span>
            <span className="inline-block h-[1px] w-12 bg-[#C6A87D] ml-4" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="font-heading text-4xl lg:text-5xl text-foreground mt-5 mb-5 tracking-tight"
          >
            From Earth to Elegance
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="font-body text-muted-foreground text-[15px] max-w-lg mx-auto leading-relaxed"
          >
            Transparency in every carat. Follow the meticulous journey your diamond takes, from its raw origin to your final masterpiece.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.15 + i * 0.12,
              }}
              className="relative group"
            >
              <div className="bg-white rounded-2xl p-8 lg:p-10 h-full shadow-luxury luxury-transition group-hover:shadow-luxury-hover border border-border/60 relative z-10 diamond-glow">
                {/* Step number */}
                <span className="block font-body text-[11px] uppercase tracking-[0.25em] text-[#C6A87D] font-medium mb-6">
                  Step {item.step}
                </span>

                {/* Icon */}
                <div className="w-12 h-12 rounded-[14px] bg-[#FFF9F0] flex items-center justify-center mb-6 luxury-transition group-hover:scale-110 group-hover:bg-[#C6A87D]/15">
                  <item.icon className="w-5 h-5 text-[#C6A87D] luxury-transition group-hover:-rotate-6" strokeWidth={1.5} />
                </div>

                {/* Content */}
                <h3 className="font-heading text-[1.4rem] text-foreground mb-1.5 leading-tight">
                  {item.title}
                </h3>
                <p className="font-accent italic text-[#C6A87D] text-[15px] mb-4">
                  {item.subtitle}
                </p>
                <p className="font-body text-muted-foreground text-[14px] leading-[1.8]">
                  {item.description}
                </p>
              </div>

              {/* Connector line (hidden on last item) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-[45%] -right-3 w-6 h-[2px] bg-gradient-to-r from-[#C6A87D]/50 to-transparent z-0" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiamondJourney;
