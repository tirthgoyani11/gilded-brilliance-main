import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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
    <section className="py-24 lg:py-32 bg-secondary/50">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-accent italic text-primary text-sm mb-3 block">The Marketplace</span>
            <h2 className="font-heading text-3xl lg:text-4xl text-foreground mb-4">Find Your Perfect Diamond</h2>
            <p className="font-body text-muted-foreground text-sm max-w-md mx-auto">
              Search our inventory of certified natural and lab-grown diamonds with advanced filters. No middlemen — direct pricing.
            </p>
          </motion.div>
        </div>

        {/* Shape filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {shapes.map((shape, i) => (
            <button
              key={shape}
              className={`px-5 py-2.5 rounded-xl text-[10px] uppercase tracking-[0.12em] font-body luxury-transition shape-filter-hover ${
                i === 0
                  ? "bg-foreground text-background"
                  : "bg-background text-foreground/60 hover:text-foreground shadow-luxury hover:shadow-luxury-hover"
              }`}
            >
              {shape}
            </button>
          ))}
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="bg-background rounded-2xl shadow-luxury overflow-hidden"
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
                  <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-primary/[0.02] luxury-transition cursor-pointer group">
                    <td className="px-6 py-4 text-sm font-body">{d.shape}</td>
                    <td className="px-6 py-4 text-sm font-body tabular-nums">{d.carat}</td>
                    <td className="px-6 py-4 text-sm font-body">{d.cut}</td>
                    <td className="px-6 py-4 text-sm font-body">{d.color}</td>
                    <td className="px-6 py-4 text-sm font-body">{d.clarity}</td>
                    <td className="px-6 py-4 text-sm font-body font-medium tabular-nums">{d.price}</td>
                    <td className="px-6 py-4">
                      <span className="text-[9px] uppercase tracking-wider font-body px-2 py-1 bg-primary/8 rounded-md text-primary">
                        {d.cert}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary luxury-transition group-hover:translate-x-1" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="text-center mt-10">
          <Button asChild variant="luxury" size="lg" className="group">
            <Link to="/diamonds">
              View All Diamonds
              <ArrowRight className="w-4 h-4 ml-2 luxury-transition group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DiamondSearchPreview;
