import { motion } from "framer-motion";
import { Gem, Scissors, BadgeCheck, Truck } from "lucide-react";

const steps = [
  {
    icon: Gem,
    step: "01",
    title: "Sourced",
    subtitle: "Ethically Grown",
    description: "Every diamond begins its journey in state-of-the-art facilities, grown with precision under controlled conditions.",
  },
  {
    icon: Scissors,
    step: "02",
    title: "Cut & Polished",
    subtitle: "Master Craftsmanship",
    description: "Expert artisans cut each stone to maximize brilliance, fire, and scintillation — revealing its inner beauty.",
  },
  {
    icon: BadgeCheck,
    step: "03",
    title: "Certified",
    subtitle: "IGI Verified",
    description: "Independent grading by IGI ensures every stone meets the highest standards of quality and authenticity.",
  },
  {
    icon: Truck,
    step: "04",
    title: "Delivered",
    subtitle: "Directly to You",
    description: "No middlemen. Your diamond travels directly from our hands to yours — insured, secured, worldwide.",
  },
];

const DiamondJourney = () => {
  return (
    <section className="py-24 lg:py-32 bg-[#0A0A0A] relative overflow-hidden">
      {/* Subtle sparkle background */}
      <div className="sparkle-overlay absolute inset-0 opacity-30 pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block h-px w-10 bg-[#C6A87D] mr-3 align-middle" />
            <span className="font-accent italic text-[#C6A87D] text-sm tracking-wide">
              The Vmora Process
            </span>
            <span className="inline-block h-px w-10 bg-[#C6A87D] ml-3 align-middle" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="font-heading text-3xl lg:text-4xl text-white mt-5 mb-4"
          >
            From Earth to Elegance
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="font-body text-white/40 text-sm max-w-md mx-auto"
          >
            Transparency in every carat. Follow the path from source to your hand.
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
              <div className="glass-card rounded-2xl p-8 h-full luxury-transition group-hover:border-[#C6A87D]/20">
                {/* Step number */}
                <span className="block font-body text-[10px] uppercase tracking-[0.25em] text-[#C6A87D]/50 mb-6">
                  Step {item.step}
                </span>

                {/* Icon */}
                <div className="w-10 h-10 rounded-full bg-[#C6A87D]/10 flex items-center justify-center mb-5 luxury-transition group-hover:bg-[#C6A87D]/20">
                  <item.icon className="w-4.5 h-4.5 text-[#C6A87D]" />
                </div>

                {/* Content */}
                <h3 className="font-heading text-xl text-white mb-1">
                  {item.title}
                </h3>
                <p className="font-accent italic text-[#C6A87D] text-sm mb-4">
                  {item.subtitle}
                </p>
                <p className="font-body text-white/40 text-xs leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Connector line (hidden on last item) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-px bg-gradient-to-r from-[#C6A87D]/30 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiamondJourney;
