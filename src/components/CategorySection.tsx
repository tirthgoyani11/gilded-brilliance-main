import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import type { JewelryItem } from "@/types/diamond";
import { loadJewelryItems, getJewelryMetalImage } from "@/lib/jewelry-catalog";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ringImg from "@/assets/product-ring.jpg";
import earringsImg from "@/assets/product-earrings.jpg";
import necklaceImg from "@/assets/product-necklace.jpg";
import braceletImg from "@/assets/product-bracelet.jpg";
import looseDiamondsImg from "@/assets/product-loose-diamonds.jpg";

const fallbackImages: Record<string, string> = {
  Rings: ringImg,
  Earrings: earringsImg,
  Necklaces: necklaceImg,
  Bracelets: braceletImg,
};

const staticCategories = [
  { name: "Rings", href: "/jewelry/rings" },
  { name: "Earrings", href: "/jewelry/earrings" },
  { name: "Necklaces", href: "/jewelry/necklaces" },
  { name: "Bracelets", href: "/jewelry/bracelets" },
  { name: "Loose Diamonds", href: "/diamonds" },
];

const CategorySection = () => {
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>({});
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  useEffect(() => {
    loadJewelryItems().then((all) => {
      const active = all.filter((i) => i.isActive !== false);
      const imgMap: Record<string, string> = {};
      const countMap: Record<string, number> = {};
      for (const cat of ["Rings", "Earrings", "Necklaces", "Bracelets"]) {
        const inCat = active.filter((i) => i.category === cat);
        countMap[cat] = inCat.length;
        if (inCat.length > 0) {
          imgMap[cat] = getJewelryMetalImage(inCat[0], inCat[0].metal);
        }
      }
      setCategoryImages(imgMap);
      setCategoryCounts(countMap);
      setTimeout(() => ScrollTrigger.refresh(), 200);
    });
  }, []);

  const getImage = (name: string) => {
    if (name === "Loose Diamonds") return looseDiamondsImg;
    return categoryImages[name] || fallbackImages[name] || ringImg;
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-background py-20 lg:py-28">
      {/* Subtle radial highlight */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(198,168,125,0.04),transparent_70%)]" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-12">
        <div className="mb-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="mb-3 block font-accent text-sm italic text-primary">Curated Collections</span>
            <h2 className="font-heading text-3xl leading-tight text-foreground sm:text-4xl lg:text-5xl">Shop by Category</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
              Discover our carefully organized collections, each crafted for a different kind of brilliance.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-5 lg:gap-6">
          {staticCategories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.12 + i * 0.08 }}
            >
              <Link to={cat.href} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-[0_4px_16px_-6px_rgba(0,0,0,0.1)] transition-shadow duration-500 group-hover:shadow-[0_16px_40px_-14px_rgba(0,0,0,0.2)]">
                  <img
                    src={getImage(cat.name)}
                    alt={cat.name}
                    className="h-full w-full object-cover brightness-[1.08] contrast-[1.03] transition-all duration-500 ease-out group-hover:brightness-[1.15]"
                    loading="lazy"
                  />
                  {/* Dark gradient */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
                  {/* Bottom label */}
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.1em] text-white drop-shadow-lg sm:text-base">
                      {cat.name}
                    </p>
                    <p className="mt-1 text-[10px] text-white/60 transition-all duration-300 group-hover:text-white/90">
                      {categoryCounts[cat.name] > 0 && (
                        <span className="inline group-hover:hidden">{categoryCounts[cat.name]} {categoryCounts[cat.name] === 1 ? "piece" : "pieces"}</span>
                      )}
                      <span className={`uppercase tracking-[0.15em] ${categoryCounts[cat.name] > 0 ? "hidden group-hover:inline" : ""}`}>View Collection →</span>
                    </p>
                  </div>
                  {/* Gold border on hover */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl border-[1.5px] border-transparent transition-colors duration-500 group-hover:border-primary/35" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
