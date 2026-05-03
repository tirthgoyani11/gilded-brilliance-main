import { useEffect, useState, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import type { JewelryItem } from "@/types/diamond";
import { loadJewelryItems, getJewelryMetalImage } from "@/lib/jewelry-catalog";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ringImg from "@/assets/product-ring.jpg";
import earringsImg from "@/assets/product-earrings.jpg";
import necklaceImg from "@/assets/product-necklace.jpg";
import braceletImg from "@/assets/product-bracelet.jpg";
import looseDiamondsImg from "@/assets/product-loose-diamonds.jpg";

const fallbackImages: Record<string, [string, string]> = {
  Rings: [ringImg, earringsImg],
  Earrings: [earringsImg, ringImg],
  Necklaces: [necklaceImg, braceletImg],
  Bracelets: [braceletImg, necklaceImg],
  "Loose Diamonds": [looseDiamondsImg, looseDiamondsImg],
};

const staticCategories = [
  { name: "Rings", href: "/jewelry/rings", accent: "Timeless bands" },
  { name: "Earrings", href: "/jewelry/earrings", accent: "Effortless sparkle" },
  { name: "Necklaces", href: "/jewelry/necklaces", accent: "Statement layers" },
  { name: "Bracelets", href: "/jewelry/bracelets", accent: "Wrist elegance" },
  { name: "Loose Diamonds", href: "/diamonds", accent: "Certified brilliance" },
];

/** Single category card with premium hover effects */
const CategoryCard = ({
  cat,
  mainImg,
  hoverImg,
  count,
  index,
  isInView,
}: {
  cat: (typeof staticCategories)[number];
  mainImg: string;
  hoverImg: string;
  count: number;
  index: number;
  isInView: boolean;
}) => {
  const hasAlt = hoverImg && hoverImg !== mainImg;
  const isWide = cat.name === "Loose Diamonds";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.2 + index * 0.1,
      }}
      className={isWide ? "col-span-2 md:col-span-1 lg:col-span-1" : ""}
    >
      <Link to={cat.href} className="group block">
        <div
          className={`relative overflow-hidden rounded-[20px] transition-all duration-700 ${
            isWide
              ? "aspect-[3/1] sm:aspect-[3/1] md:aspect-[4/5]"
              : "aspect-[4/5]"
          }`}
          style={{
            boxShadow: "0 8px 32px -8px rgba(0,0,0,0.12), 0 2px 8px -2px rgba(0,0,0,0.06)",
          }}
        >
          {/* Main image */}
          <img
            src={mainImg}
            alt={cat.name}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out ${
              hasAlt ? "group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-105"
            }`}
          />
          {/* Hover crossfade image */}
          {hasAlt && (
            <img
              src={hoverImg}
              alt={`${cat.name} – alternate`}
              className="absolute inset-0 h-full w-full object-cover opacity-0 scale-105 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-100"
            />
          )}

          {/* Cinematic gradient overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/5 transition-opacity duration-500 group-hover:from-black/80" />

          {/* Subtle inner glow on hover */}
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(ellipse_at_center,rgba(198,168,125,0.08),transparent_70%)]" />

          {/* Content overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
            {/* Category accent text */}
            <motion.p
              className="mb-1 text-[9px] font-medium uppercase tracking-[0.2em] text-white/40 transition-all duration-500 group-hover:text-primary/70 group-hover:tracking-[0.25em]"
            >
              {cat.accent}
            </motion.p>
            {/* Category name */}
            <h3 className="text-base font-semibold uppercase tracking-[0.08em] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:tracking-[0.12em] sm:text-lg">
              {cat.name}
            </h3>
            {/* Count / CTA line */}
            <div className="mt-2 flex items-center gap-2">
              <span className="h-[1px] w-0 bg-primary/60 transition-all duration-500 group-hover:w-6" />
              <p className="text-[10px] text-white/50 transition-all duration-500 group-hover:text-white/80">
                {count > 0 && (
                  <span className="inline group-hover:hidden">
                    {count} {count === 1 ? "piece" : "pieces"}
                  </span>
                )}
                <span
                  className={`uppercase tracking-[0.15em] ${
                    count > 0 ? "hidden group-hover:inline" : ""
                  }`}
                >
                  Explore →
                </span>
              </p>
            </div>
          </div>

          {/* Gold border on hover */}
          <div className="pointer-events-none absolute inset-0 rounded-[20px] border-[1.5px] border-transparent transition-all duration-700 group-hover:border-primary/30 group-hover:shadow-[inset_0_0_30px_rgba(198,168,125,0.06)]" />
        </div>
      </Link>
    </motion.div>
  );
};

const CategorySection = () => {
  const [catImages, setCatImages] = useState<Record<string, [string, string]>>({});
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  // Parallax for the heading
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const headingY = useTransform(scrollYProgress, [0, 0.5], [30, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);

  useEffect(() => {
    loadJewelryItems().then((all) => {
      const active = all.filter((i) => i.isActive !== false);
      const pairMap: Record<string, [string, string]> = {};
      const countMap: Record<string, number> = {};

      for (const cat of ["Rings", "Earrings", "Necklaces", "Bracelets"]) {
        const inCat = active.filter((i) => i.category === cat);
        countMap[cat] = inCat.length;

        if (inCat.length >= 2) {
          pairMap[cat] = [
            getJewelryMetalImage(inCat[0], inCat[0].metal),
            getJewelryMetalImage(inCat[1], inCat[1].metal),
          ];
        } else if (inCat.length === 1) {
          const item = inCat[0];
          const main = getJewelryMetalImage(item, item.metal);
          let alt = "";
          const metals = ["Gold", "Rose Gold", "Silver", "White Gold"];
          for (const m of metals) {
            if (m === item.metal) continue;
            const img = getJewelryMetalImage(item, m);
            if (img && img !== main) { alt = img; break; }
          }
          if (!alt && item.galleryImages) {
            for (const g of item.galleryImages) {
              if (g && g !== main) { alt = g; break; }
            }
          }
          pairMap[cat] = [main, alt || main];
        }
      }

      setCatImages(pairMap);
      setCategoryCounts(countMap);
      setTimeout(() => ScrollTrigger.refresh(), 200);
    });
  }, []);

  const getImages = (name: string): [string, string] => {
    return catImages[name] || fallbackImages[name] || [ringImg, ringImg];
  };

  return (
    <section ref={sectionRef} className="relative -mt-16 overflow-hidden pb-20 lg:pb-28">
      {/* Seamless gradient from hero (#FAFAFA) into page background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#FAFAFA] via-[#FAFAFA]/50 to-background" />
      {/* Luxury gold radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_60%,rgba(198,168,125,0.06),transparent)]" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header with parallax */}
        <motion.div
          className="mb-12 pt-10 text-center lg:mb-14 lg:pt-14"
          style={{ y: headingY, opacity: headingOpacity }}
        >
          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="mx-auto mb-5 h-[1px] w-12 origin-center bg-primary/40"
          />
          <motion.span
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={isInView ? { opacity: 1, letterSpacing: "0.25em" } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="mb-3 block text-[10px] font-semibold uppercase text-primary"
          >
            Collections
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="font-heading text-3xl leading-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Shop by Category
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base"
          >
            Discover our carefully organized collections, each crafted for a different kind of brilliance.
          </motion.p>
          {/* Bottom decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            className="mx-auto mt-6 h-[1px] w-20 origin-center bg-gradient-to-r from-transparent via-primary/30 to-transparent"
          />
        </motion.div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5 lg:gap-5">
          {staticCategories.map((cat, i) => {
            const [mainImg, hoverImg] = getImages(cat.name);
            return (
              <CategoryCard
                key={cat.name}
                cat={cat}
                mainImg={mainImg}
                hoverImg={hoverImg}
                count={categoryCounts[cat.name] || 0}
                index={i}
                isInView={isInView}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
