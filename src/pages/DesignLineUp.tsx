import { Link } from "react-router-dom";
import { ArrowRight, Clock3, Gem, MessageCircle, Sparkles } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { WHATSAPP_NUMBER } from "@/lib/diamond-utils";

const lineUpItems = [
  {
    id: "placeholder1",
    title: "Signature Watch Atelier",
    type: "Custom Watches",
    summary: "A refined watch direction with custom dial language, case architecture, and strap finish.",
    image: "/design-line-up/placeholder1-watch.jpeg",
  },
  {
    id: "placeholder2",
    title: "Diamond Watch Edition",
    type: "Custom Watches",
    summary: "Diamond-accented detailing and polished finishing designed for elevated statement wear.",
    image: "/design-line-up/placeholder2-watch.jpg",
  },
  {
    id: "placeholder3",
    title: "Bridal Jewelry Suite",
    type: "Custom Jewelry",
    summary: "Coordinated ring, necklace, and earrings curated to your style narrative.",
  },
  {
    id: "placeholder4",
    title: "Everyday Luxury Line",
    type: "Custom Jewelry",
    summary: "Elegant daily-wear pieces balancing comfort, proportion, and high-end presence.",
  },
  {
    id: "placeholder5",
    title: "Collector Timepiece",
    type: "Custom Watches",
    summary: "Collector-grade design expression with personalized materials and finishing codes.",
  },
  {
    id: "placeholder6",
    title: "Heirloom Redesign",
    type: "Custom Jewelry",
    summary: "Transform legacy family pieces into modern heirlooms with emotional value intact.",
  },
];

const DesignLineUp = () => {
  const openWhatsApp = () => {
    const message = encodeURIComponent(
      "Hello Vmora Team, I want to explore your Custom Jewelry and Watches Design Line Up. Please guide me with options and pricing."
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${message}`, "_blank");
  };

  return (
    <SiteLayout>
      <section className="bg-background py-10 lg:py-14">
        <div className="container mx-auto px-4 lg:px-10">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-10">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Design Line Up
            </p>
            <h1 className="font-heading text-3xl leading-tight text-foreground sm:text-4xl lg:text-6xl">
              Luxury Jewelry And Timepieces, Crafted For You
            </h1>
            <p className="mt-4 max-w-3xl text-sm text-muted-foreground sm:text-base">
              Explore a private design lineup where every ring, necklace, bracelet, and watch is built around your taste,
              certified stone preferences, and precision finishing standards.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="luxury" onClick={openWhatsApp} className="min-w-[220px]">
                <MessageCircle className="mr-2 h-4 w-4" />
                Begin Private Consultation
              </Button>
              <Button asChild variant="outline" className="min-w-[220px]">
                <Link to="/diamonds">View Certified Loose Diamonds</Link>
              </Button>
            </div>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {lineUpItems.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-muted/40">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <span className="rounded-full border border-border bg-background px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/75">{item.id}</span>
                  )}
                </div>
                <div className="p-5">
                  <p className="mb-2 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-primary">
                    {item.type === "Custom Watches" ? <Clock3 className="h-3.5 w-3.5" /> : <Gem className="h-3.5 w-3.5" />}
                    {item.type}
                  </p>
                  <h2 className="font-heading text-2xl leading-tight text-foreground">{item.title}</h2>
                  <p className="mt-3 text-sm text-muted-foreground">{item.summary}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-sm lg:p-8">
            <h3 className="font-heading text-2xl">Why We Are Best</h3>
            <p className="mt-3 max-w-4xl text-sm text-muted-foreground sm:text-base">
              From initial concept to final delivery, our team executes each custom creation with transparent consultation,
              strict quality control, and luxury-level finishing that you approve at every key stage.
            </p>
            <button
              onClick={openWhatsApp}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
            >
              Schedule Your Design Session
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default DesignLineUp;
