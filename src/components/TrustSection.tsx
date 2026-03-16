import { ShieldCheck, BadgeCheck, Truck } from "lucide-react";

const trustItems = [
  {
    icon: BadgeCheck,
    title: "IGI/GIA Certified",
    description: "Every listed stone is independently graded and traceable by report number.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description: "Enterprise-grade checkout with protected transactions and fraud screening.",
  },
  {
    icon: Truck,
    title: "Free Insured Shipping",
    description: "Complimentary, insured delivery with signature confirmation on all orders.",
  },
];

const TrustSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-10">
          <p className="font-accent italic text-primary text-sm mb-2">Trust & Assurance</p>
          <h2 className="font-heading text-3xl text-foreground">Confidence in Every Purchase</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {trustItems.map((item) => (
            <div key={item.title} className="rounded-[12px] border border-border bg-secondary/50 p-7 shadow-luxury">
              <item.icon className="w-5 h-5 text-primary mb-4" />
              <h3 className="font-heading text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
