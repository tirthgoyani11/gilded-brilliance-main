import { Link } from "react-router-dom";
import { ArrowRight, Clock3, Diamond, Gem } from "lucide-react";

const offerings = [
  {
    title: "Bespoke Jewelry",
    description:
      "From signature rings to statement necklaces, each piece is tailored to your vision with atelier-level finishing.",
    icon: Gem,
    iconImage: "/icons/jewelry.png",
    to: "/design-line-up",
    cta: "Discover The Line Up",
  },
  {
    title: "Private Watch Creations",
    description:
      "Refined watch concepts crafted with custom materials, dial direction, and detail language built around your taste.",
    icon: Clock3,
    iconImage: "/icons/luxury.png",
    to: "/design-line-up",
    cta: "View Timepiece Editions",
  },
  {
    title: "Loose Diamonds",
    description:
      "Select from certified natural and lab-grown diamonds curated for brilliance, precision, and confidence.",
    icon: Diamond,
    iconImage: "/icons/diamond_5033075.png",
    to: "/diamonds",
    cta: "Explore Certified Stones",
  },
];

const CustomJewelrySection = () => {
  return (
    <section className="relative overflow-hidden bg-[#F7F2EA] py-16 lg:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-45 mix-blend-multiply"
        style={{
          backgroundImage: "url(/marble-bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />
      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto mb-10 max-w-4xl text-center lg:mb-14">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">Design Line Up</p>
          <h2 className="font-heading text-3xl leading-tight text-foreground sm:text-4xl lg:text-6xl">Luxury Jewelry and Timepieces, Crafted Around You</h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Create extraordinary jewelry and watches with one-on-one design guidance, certified stones, and uncompromising craftsmanship.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3 lg:gap-6">
          {offerings.map(({ title, description, icon: Icon, iconImage, to, cta }) => (
            <article
              key={title}
              className="group flex h-full flex-col rounded-2xl border border-[#d8c9b1]/45 bg-[#fffdf9]/95 p-6 shadow-[0_10px_28px_-16px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.3)]"
            >
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15">
                {iconImage ? (
                  <img src={iconImage} alt={`${title} logo`} className="h-7 w-7 object-contain" loading="lazy" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
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
