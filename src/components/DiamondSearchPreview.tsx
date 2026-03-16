import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const shapes = ["Round", "Oval", "Emerald", "Pear", "Cushion", "Princess", "Marquise", "Radiant"];

const sampleDiamonds = [
  { shape: "Round", carat: "1.01", cut: "Ideal", color: "D", clarity: "VS1", price: "$4,820", cert: "IGI" },
  { shape: "Oval", carat: "1.52", cut: "Excellent", color: "E", clarity: "VVS2", price: "$6,340", cert: "GIA" },
  { shape: "Emerald", carat: "2.03", cut: "Ideal", color: "F", clarity: "VS2", price: "$8,150", cert: "IGI" },
  { shape: "Cushion", carat: "1.20", cut: "Very Good", color: "D", clarity: "IF", price: "$7,980", cert: "GIA" },
  { shape: "Pear", carat: "0.91", cut: "Excellent", color: "G", clarity: "VS1", price: "$3,250", cert: "IGI" },
];

const DiamondSearchPreview = () => {
  return (
    <section className="py-24 lg:py-32 bg-secondary">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <p className="font-accent italic text-primary text-sm mb-3">The Marketplace</p>
          <h2 className="font-heading text-3xl lg:text-4xl text-foreground mb-4">Find Your Perfect Diamond</h2>
          <p className="font-body text-muted-foreground text-sm max-w-md mx-auto">
            Search our inventory of certified natural and lab-grown diamonds with advanced filters.
          </p>
        </div>

        {/* Shape filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {shapes.map((shape, i) => (
            <button
              key={shape}
              className={`px-5 py-2.5 rounded-[4px] text-xs uppercase tracking-[0.12em] font-body luxury-transition ${
                i === 0
                  ? "bg-foreground text-background"
                  : "bg-background text-foreground/70 hover:text-foreground shadow-luxury hover:shadow-luxury-hover"
              }`}
            >
              {shape}
            </button>
          ))}
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
          className="bg-background rounded-[12px] shadow-luxury overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["Shape", "Carat", "Cut", "Color", "Clarity", "Price", "Cert", ""].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-[10px] uppercase tracking-[0.15em] font-body font-medium text-muted-foreground">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sampleDiamonds.map((d, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-secondary/50 luxury-transition cursor-pointer group">
                    <td className="px-6 py-4 text-sm font-body">{d.shape}</td>
                    <td className="px-6 py-4 text-sm font-body tabular-nums">{d.carat}</td>
                    <td className="px-6 py-4 text-sm font-body">{d.cut}</td>
                    <td className="px-6 py-4 text-sm font-body">{d.color}</td>
                    <td className="px-6 py-4 text-sm font-body">{d.clarity}</td>
                    <td className="px-6 py-4 text-sm font-body font-medium tabular-nums">{d.price}</td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] uppercase tracking-wider font-body px-2 py-1 bg-secondary rounded text-muted-foreground">
                        {d.cert}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary luxury-transition" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="text-center mt-10">
          <Button variant="luxury" size="lg">
            View All Diamonds
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DiamondSearchPreview;
