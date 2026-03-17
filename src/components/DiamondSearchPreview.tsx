import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Scale, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "@/contexts/StoreContext";
import { currency } from "@/lib/diamond-utils";

const displayShapes = ["Round", "Oval", "Emerald", "Pear", "Cushion", "Radiant"];
const displayColors = ['D','E','F','G','H','I','J'];
const displayClarities = ['FL','IF','VVS1','VVS2','VS1','VS2','SI1'];

const DiamondSearchPreview = () => {
  const { diamonds, toggleCompare, isCompared } = useStore();
  const navigate = useNavigate();

  const [shape, setShape] = useState("Round");
  const [priceMax, setPriceMax] = useState(25000);
  const [caratMin, setCaratMin] = useState(1.0);
  const [color, setColor] = useState("All");
  const [clarity, setClarity] = useState("All");

  const filtered = useMemo(() => {
    return diamonds.filter(d => {
      // Shape filter
      if (shape !== "All") {
        const dKey = d.shape.toLowerCase().replace(/[^a-z]/g, "");
        const sKey = shape.toLowerCase().replace(/[^a-z]/g, "");
        if (!dKey.includes(sKey)) return false;
      }
      // Color
      if (color !== "All" && !d.color?.toUpperCase().includes(color)) return false;
      // Clarity
      if (clarity !== "All" && !d.clarity?.toUpperCase().includes(clarity)) return false;
      // Price
      if (d.price > priceMax) return false;
      // Carat
      if (d.carat < caratMin) return false;
      
      return true;
    }).slice(0, 7); // only top 7 items for preview table
  }, [diamonds, shape, color, clarity, priceMax, caratMin]);


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

        {/* Functional Filters Panel */}
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
                <button
                  onClick={() => setShape("All")}
                  className={`px-5 py-2.5 rounded-lg text-[11px] uppercase tracking-[0.12em] font-body luxury-transition ${
                    shape === "All"
                      ? "bg-foreground text-background shadow-md"
                      : "bg-[#FAFAFA] text-foreground/70 hover:bg-[#F0F0F0] border border-border"
                  }`}
                >
                  All
                </button>
                {displayShapes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setShape(shape === s ? "All" : s)}
                    className={`px-5 py-2.5 rounded-lg text-[11px] uppercase tracking-[0.12em] font-body luxury-transition ${
                      shape === s
                        ? "bg-foreground text-background shadow-md"
                        : "bg-[#FAFAFA] text-foreground/70 hover:bg-[#F0F0F0] border border-border"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Price & Carat Sliders */}
            <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-[10px] uppercase tracking-[0.14em] font-medium text-foreground">Max Price</p>
                  <p className="text-[11px] text-muted-foreground font-medium">{currency(priceMax)}</p>
                </div>
                <input 
                  type="range" 
                  min="500" 
                  max="100000" 
                  step="500" 
                  value={priceMax} 
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full h-1.5 accent-[#C6A87D] bg-secondary rounded-full appearance-none outline-none"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-[10px] uppercase tracking-[0.14em] font-medium text-foreground">Min Carat</p>
                  <p className="text-[11px] text-muted-foreground font-medium">{caratMin.toFixed(2)} ct</p>
                </div>
                <input 
                  type="range" 
                  min="0.3" 
                  max="10.0" 
                  step="0.10" 
                  value={caratMin} 
                  onChange={(e) => setCaratMin(Number(e.target.value))}
                  className="w-full h-1.5 accent-[#C6A87D] bg-secondary rounded-full appearance-none outline-none"
                />
              </div>
            </div>

            {/* Color & Clarity */}
            <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] font-medium text-foreground mb-3">Color</p>
                <div className="flex rounded-md overflow-hidden h-8 text-[10px] font-medium uppercase tracking-wider text-center text-foreground/50 border border-border">
                  <button
                    onClick={() => setColor("All")}
                    className={`flex-1 flex items-center justify-center border-r border-border luxury-transition ${color === "All" ? 'bg-foreground text-background' : 'bg-[#FAFAFA] hover:bg-[#EAEAEA]'}`}
                  >
                    All
                  </button>
                  {displayColors.map((c) => (
                    <button 
                      key={c} 
                      onClick={() => setColor(c === color ? "All" : c)}
                      className={`flex-1 flex items-center justify-center border-r last:border-r-0 border-border luxury-transition ${color === c ? 'bg-foreground text-background' : 'bg-[#FAFAFA] hover:bg-[#EAEAEA]'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] font-medium text-foreground mb-3">Clarity</p>
                <div className="flex rounded-md overflow-hidden h-8 text-[10px] font-medium uppercase tracking-wider text-center text-foreground/50 border border-border">
                  <button
                    onClick={() => setClarity("All")}
                    className={`flex-1 flex items-center justify-center border-r border-border luxury-transition ${clarity === "All" ? 'bg-foreground text-background' : 'bg-[#FAFAFA] hover:bg-[#EAEAEA]'}`}
                  >
                    All
                  </button>
                  {displayClarities.map((c) => (
                    <button 
                      key={c} 
                      onClick={() => setClarity(c === clarity ? "All" : c)}
                      className={`flex-1 flex items-center justify-center border-r last:border-r-0 border-border luxury-transition ${clarity === c ? 'bg-foreground text-background' : 'bg-[#FAFAFA] hover:bg-[#EAEAEA]'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dynamic Table */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="bg-white rounded-2xl shadow-luxury border border-border/60 overflow-hidden max-w-5xl mx-auto"
        >
          <div className="overflow-x-auto max-h-[450px]">
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
                {filtered.length > 0 ? (
                  filtered.map((d) => (
                    <tr 
                      key={d.stoneId} 
                      onClick={() => navigate(`/diamond/${d.stoneId}`)} 
                      className="border-b border-border/30 last:border-0 hover:bg-[#FAFAFA] hover:shadow-[inset_4px_0_0_0_#C6A87D] luxury-transition cursor-pointer group"
                    >
                      <td className="px-6 py-4.5 text-sm font-body text-foreground capitalize">{d.shape}</td>
                      <td className="px-6 py-4.5 text-sm font-body tabular-nums text-foreground">{d.carat.toFixed(2)}</td>
                      <td className="px-6 py-4.5 text-[13px] font-body text-muted-foreground">{d.cut || '-'}</td>
                      <td className="px-6 py-4.5 text-[13px] font-body text-muted-foreground">{d.color || '-'}</td>
                      <td className="px-6 py-4.5 text-[13px] font-body text-muted-foreground">{d.clarity || '-'}</td>
                      <td className="px-6 py-4.5 text-sm font-body font-medium tabular-nums text-foreground">{currency(d.price)}</td>
                      <td className="px-6 py-4.5">
                        <span className="text-[9px] uppercase tracking-wider font-body px-2.5 py-1 bg-secondary rounded-md text-foreground font-medium">
                          {d.certLab || 'LAB'}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 min-w-[140px]">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 luxury-transition">
                          <button 
                            onClick={(e) => { e.stopPropagation(); toggleCompare(d); }}
                            className={`text-[10px] uppercase tracking-[0.12em] font-semibold luxury-transition flex items-center gap-1.5 px-3 py-1.5 rounded border ${isCompared(d.stoneId) ? 'bg-[#C6A87D]/10 text-[#C6A87D] border-[#C6A87D]/30' : 'text-foreground/70 border-border hover:bg-[#FAFAFA] hover:text-foreground'}`}
                          >
                            {isCompared(d.stoneId) ? <Check className="w-3 h-3"/> : <Scale className="w-3 h-3"/>}
                            Compare
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); navigate(`/diamond/${d.stoneId}`); }}
                            className="text-[10px] uppercase tracking-[0.12em] font-semibold text-foreground hover:bg-foreground hover:text-white luxury-transition px-3 py-1.5 border border-border rounded flex items-center gap-1.5"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground font-body text-sm">
                      No diamonds found matching your criteria. Try adjusting your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="text-center mt-10">
          <Button asChild variant="luxury" size="lg" className="group">
            <Link to="/diamonds">
              View All {diamonds.length.toLocaleString()} Diamonds
              <ArrowRight className="w-4 h-4 ml-2 luxury-transition group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DiamondSearchPreview;
