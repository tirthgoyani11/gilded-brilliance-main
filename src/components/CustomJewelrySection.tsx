import { Link } from "react-router-dom";
import { ArrowRight, Diamond, Gem, PenSquare } from "lucide-react";

const offerings = [
  {
    title: "Custom Jewelry Design",
    description:
      "Share your idea, budget, and style. We craft rings, pendants, earrings, and bracelets exactly for your needs.",
    icon: PenSquare,
    to: "/about",
    cta: "Start Consultation",
  },
  {
    title: "Loose Diamonds",
    description:
      "Explore certified natural and lab-grown loose diamonds with transparent details and expert support.",
    icon: Diamond,
    to: "/diamonds",
    cta: "Browse Loose Diamonds",
  },
  {
    title: "Jewelry Collections",
    description:
      "Discover ready inspiration, then personalize the final piece with your choice of center stone and setting details.",
    icon: Gem,
    to: "/about",
    cta: "View Custom Process",
  },
];

const CustomJewelrySection = () => {
  return (
    <section className="relative overflow-hidden bg-[#FAFAFA] py-16 lg:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-35 mix-blend-multiply"
        style={{
          backgroundImage: "url(/marble-bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />
      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto mb-10 max-w-3xl text-center lg:mb-14">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">What We Offer</p>
          <h2 className="font-heading text-3xl text-foreground sm:text-4xl lg:text-5xl">Custom Jewelry and Loose Diamonds</h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            We are not only selling products. We build jewelry around your vision, from stone selection to the final handcrafted piece.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3 lg:gap-6">
          {offerings.map(({ title, description, icon: Icon, to, cta }) => (
            <article
              key={title}
              className="group flex h-full flex-col rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-xl text-foreground">{title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
              <Link
                to={to}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors duration-200 hover:text-primary/80"
              >
                {cta}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomJewelrySection;
