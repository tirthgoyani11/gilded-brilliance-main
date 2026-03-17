import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const shapes = ["Round", "Oval", "Emerald", "Pear", "Cushion", "Radiant"];

const sampleDiamonds = [
  { shape: "Round", carat: "1.01", cut: "Ideal", color: "D", clarity: "VVS1", price: "$4,820", cert: "IGI" },
  { shape: "Oval", carat: "1.52", cut: "Excellent", color: "E", clarity: "VVS2", price: "$6,340", cert: "GIA" },
  { shape: "Emerald", carat: "2.03", cut: "Ideal", color: "F", clarity: "VS1", price: "$8,150", cert: "IGI" },
  { shape: "Cushion", carat: "1.20", cut: "Very Good", color: "D", clarity: "IF", price: "$7,980", cert: "GIA" },
  { shape: "Pear", carat: "0.91", cut: "Excellent", color: "G", clarity: "VS2", price: "$3,250", cert: "IGI" },
];

const DiamondSearchPreview = () => {
  return (
    <section className="py-24 lg:py-32 bg-[#FAFAFA] relative border-y border-border/50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(198,168,125,0.03)_0%,transparent_70%)] pointer-events-none" />
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
            <span className="font-accent italic text-[#C6A87D] text-[15px] uppercase tracking-widest">
              The Diamond Finder
            </span>
            <span className="inline-block h-[1px] w-12 bg-[#C6A87D] ml-4" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="font-heading text-4xl lg:text-5xl text-foreground mb-5 tracking-tight"
          >
            Find Your Perfect Diamond
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="font-body text-muted-foreground text-[15px] max-w-lg mx-auto leading-[1.8]"
          >
            Experience our interactive diamond finder. Filter thousands of independently certified stones with precision to discover the one meant for you.
          </motion.p>
        </div>

        {/* Mock Visual Filters Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="bg-white rounded-2xl shadow-luxury border border-border/60 p-6 lg:p-8 mb-8 max-w-5xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Shapes */}
            <div className="col-span-1 md:col-span-2 lg:col-span-4">
              <p className="text-[10px] uppercase tracking-[0.14em] font-medium text-foreground mb-4">Diamond Shape</p>
              <div className="flex flex-wrap gap-2">
                {shapes.map((shape, i) => (
                  <button
                    key={shape}
                    className={`px-5 py-2.5 rounded-lg text-[11px] uppercase tracking-[0.12em] font-body luxury-transition ${
                      i === 0
                        ? "bg-foreground text-background shadow-md"
                        : "bg-[#FAFAFA] text-foreground/70 hover:bg-[#F0F0F0] border border-border"
                    }`}
                  >
                    {shape}
                  </button>
                ))}
              </div>
            </div>

            {/* Price & Carat Sliders */}
            <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-[10px] uppercase tracking-[0.14em] font-medium text-foreground">Price</p>
                  <p className="text-[11px] text-muted-foreground font-medium">$1,000 - $50,000+</p>
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-[#C6A87D] w-[60%] ml-[10%] rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-[10px] uppercase tracking-[0.14em] font-medium text-foreground">Carat</p>
                  <p className="text-[11px] text-muted-foreground font-medium">0.50 - 5.00+</p>
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-[#C6A87D] w-[50%] ml-[20%] rounded-full" />
                </div>
              </div>
            </div>

            {/* Color & Clarity */}
            <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] font-medium text-foreground mb-3">Color</p>
                <div className="flex rounded-md overflow-hidden h-6 text-[9px] font-medium uppercase tracking-wider text-center text-foreground/50 border border-border">
                  {['D','E','F','G','H','I','J'].map((c, i) => (
                    <div key={c} className={`flex-1 flex items-center justify-center ${i < 3 ? 'bg-[#FAFAFA]' : 'bg-[#FFF9F0]'}`}>{c}</div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] font-medium text-foreground mb-3">Clarity</p>
                <div className="flex rounded-md overflow-hidden h-6 text-[9px] font-medium uppercase tracking-wider text-center text-foreground/50 border border-border bg-[#FAFAFA]">
                  {['FL','IF','VVS1','VVS2','VS1','VS2','SI1'].map((c, i) => (
                    <div key={c} className={`flex-1 flex items-center justify-center border-r last:border-r-0 border-border ${i > 1 && i < 5 ? 'bg-[#F4F4F4] text-foreground font-semibold' : ''}`}>{c}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Table Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="bg-white rounded-2xl shadow-luxury border border-border/60 overflow-hidden max-w-5xl mx-auto"
        >
          <div className="overflow-x-auto max-h-[400px]">
            <table className="w-full relative">
              <thead className="sticky top-0 bg-[#FAFAFA] z-10 shadow-sm">
                <tr>
                  {["Shape", "Carat", "Cut", "Color", "Clarity", "Price", "Cert", "Actions"].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-[10px] uppercase tracking-[0.18em] font-body font-semibold text-muted-foreground">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white">
                {sampleDiamonds.map((d, i) => (
                  <tr key={i} className="border-b border-border/30 last:border-0 hover:bg-[#FAFAFA] hover:shadow-[inset_4px_0_0_0_#C6A87D] luxury-transition cursor-pointer group">
                    <td className="px-6 py-4.5 text-sm font-body text-foreground">{d.shape}</td>
                    <td className="px-6 py-4.5 text-sm font-body tabular-nums text-foreground">{d.carat}</td>
                    <td className="px-6 py-4.5 text-[13px] font-body text-muted-foreground">{d.cut}</td>
                    <td className="px-6 py-4.5 text-[13px] font-body text-muted-foreground">{d.color}</td>
                    <td className="px-6 py-4.5 text-[13px] font-body text-muted-foreground">{d.clarity}</td>
                    <td className="px-6 py-4.5 text-sm font-body font-medium tabular-nums text-foreground">{d.price}</td>
                    <td className="px-6 py-4.5">
                      <span className="text-[9px] uppercase tracking-wider font-body px-2.5 py-1 bg-secondary rounded-md text-foreground font-medium">
                        {d.cert}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 min-w-[140px]">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 luxury-transition">
                        <button className="text-[10px] uppercase tracking-[0.12em] font-semibold text-[#C6A87D] hover:text-[#A88B5E] luxury-transition px-3 py-1.5 border border-[#C6A87D]/30 rounded hover:bg-[#FAFAFA]">
                          Compare
                        </button>
                        <button className="text-[10px] uppercase tracking-[0.12em] font-semibold text-foreground hover:bg-foreground hover:text-white luxury-transition px-3 py-1.5 border border-border rounded">
                          View
                        </button>
                      </div>
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
