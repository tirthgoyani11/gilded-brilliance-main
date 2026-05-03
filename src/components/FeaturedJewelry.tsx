import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, ArrowRight, Sparkles, ShoppingBag } from "lucide-react";
import type { JewelryItem } from "@/types/diamond";
import { loadJewelryItems, formatJewelryPrice, calculateJewelryPrice, getJewelryMetalImage, getJewelryHoverImage, fallbackJewelryItems } from "@/lib/jewelry-catalog";
import { usePricingSettings } from "@/hooks/usePricingSettings";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const luxuryEase = [0.16, 1, 0.3, 1] as const;
const fionaEase = [0.3, 1, 0.3, 1] as const;

const pickFeatured = (all: JewelryItem[]) => {
  const featured = all.filter((i) => i.isFeatured && i.isActive !== false);
  if (featured.length < 4) {
    const rest = all.filter((i) => !i.isFeatured && i.isActive !== false);
    featured.push(...rest.slice(0, 4 - featured.length));
  }
  return featured.slice(0, 8);
};

/** Fiona-inspired product card with crossfade hover, pill badges, and bold pricing */
const ProductCard = ({ item, badge, pricingSettings }: { item: JewelryItem; badge?: string; pricingSettings: any }) => {
  const mainImg = getJewelryMetalImage(item, item.metal);
  const hoverImg = getJewelryHoverImage(item, item.metal);
  const hasAlt = Boolean(hoverImg && hoverImg !== mainImg);
  const displayPrice = calculateJewelryPrice(item, item.metal, "10K", pricingSettings);

  return (
    <Link to={`/jewelry/product/${item.id}`} className="group block">
      {/* Image container — Fiona uses 1rem radius, soft shadow, 1s image transitions */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#F6F6F6] transition-all duration-500 group-hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)]">
        {/* Pill badge — Fiona style: 4rem radius, bold weight, compact */}
        {badge && (
          <div className="absolute left-2.5 top-2.5 z-10 rounded-full bg-[#a97a3a] px-2.5 py-[3px] shadow-sm">
            <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-white">{badge}</span>
          </div>
        )}

        {/* Main image — 1s crossfade like Fiona's --duration-image */}
        <img
          src={mainImg}
          alt={item.name}
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1000ms] ease-[cubic-bezier(0.3,1,0.3,1)] ${hasAlt ? "group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-[1.03]"}`}
          loading="lazy"
        />
        {/* Hover image */}
        {hasAlt && (
          <img
            src={hoverImg}
            alt={`${item.name} – alternate view`}
            className="absolute inset-0 h-full w-full object-cover opacity-0 scale-[1.02] transition-all duration-[1000ms] ease-[cubic-bezier(0.3,1,0.3,1)] group-hover:opacity-100 group-hover:scale-100"
            loading="lazy"
          />
        )}

        {/* Wishlist button — appears on hover */}
        <button
          className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white opacity-0 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-300 hover:scale-110 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] group-hover:opacity-100"
          onClick={(e) => e.preventDefault()}
        >
          <Heart className="h-3.5 w-3.5 text-[#072835]" />
        </button>

        {/* Quick add button — slides up on hover (Fiona pattern) */}
        <div className="absolute inset-x-3 bottom-3 z-10 translate-y-3 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.3,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex h-10 items-center justify-center rounded-[10rem] bg-black text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition-colors duration-300 hover:bg-[#072835]">
            <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
            <span className="text-[11px] font-semibold tracking-[0.04em]">Quick View</span>
          </div>
        </div>

        {/* Subtle inner border on hover */}
        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-black/[0.04] transition-all duration-500 group-hover:ring-[#a97a3a]/20" />
      </div>

      {/* Product info — Fiona style: tight spacing, serif title, bold price */}
      <div className="mt-3 space-y-1 px-0.5">
        {/* Category — small caps, muted */}
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#516971]">
          {item.category} {item.subcategory ? `· ${item.subcategory}` : ""}
        </p>
        {/* Product name — Fiona uses Figtree 600 for card titles */}
        <h3 className="line-clamp-1 text-[13px] font-semibold leading-snug text-[#0A0A0A] transition-colors duration-300 group-hover:text-[#a97a3a]">
          {item.name}
        </h3>
        {/* Price — Fiona uses font-weight: 700 for prices */}
        <p className="text-sm font-bold tabular-nums text-[#0A0A0A]">{formatJewelryPrice(displayPrice)}</p>
      </div>
    </Link>
  );
};

const FeaturedJewelry = () => {
  const [items, setItems] = useState<JewelryItem[]>(() => pickFeatured(fallbackJewelryItems));
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const { settings: pricingSettings } = usePricingSettings();

  useEffect(() => {
    loadJewelryItems().then((all) => {
      setItems(pickFeatured(all));
      setTimeout(() => ScrollTrigger.refresh(), 200);
    });
  }, []);

  if (items.length === 0) return null;

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white pt-16 pb-14 lg:pt-20 lg:pb-18">
      {/* Subtle background texture */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(169,122,58,0.03)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(169,122,58,0.02)_0%,transparent_50%)]" />
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header — Fiona style: centered subheading + serif heading */}
        <div className="mb-12 flex flex-col items-center text-center sm:flex-row sm:items-end sm:justify-between sm:text-left lg:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: fionaEase }}
          >
            {/* Subheading badge */}
            <div className="mb-4 inline-flex items-center gap-2">
              <span className="h-[1px] w-6 bg-[#a97a3a]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a97a3a]">Featured Collection</span>
              <span className="h-[1px] w-6 bg-[#a97a3a]" />
            </div>
            {/* Heading — Fraunces-style serif, proper hierarchy */}
            <h2 className="font-heading text-3xl leading-[1.15] text-[#0A0A0A] sm:text-4xl lg:text-[2.8rem]">
              Curated For You
            </h2>
            <p className="mt-3 max-w-md text-[13px] leading-relaxed text-[#516971] sm:text-sm">
              Handpicked pieces chosen for their exceptional craftsmanship and timeless appeal.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 sm:mt-0"
          >
            <Link
              to="/jewelry"
              className="group inline-flex items-center gap-2 rounded-[10rem] border border-[#0A0A0A] px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0A0A0A] transition-all duration-400 hover:bg-[#0A0A0A] hover:text-white"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>

        {/* Product Grid — Fiona uses even 4-col with consistent gaps */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {items.slice(0, 4).map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: fionaEase, delay: 0.1 + i * 0.08 }}
            >
              <ProductCard item={item} badge={i === 0 ? "Featured" : undefined} pricingSettings={pricingSettings} />
            </motion.div>
          ))}
        </div>

        {/* Second row */}
        {items.length > 4 && (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:mt-4 sm:gap-4 lg:grid-cols-4 lg:gap-5">
            {items.slice(4, 8).map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: fionaEase, delay: 0.4 + i * 0.08 }}
              >
                <ProductCard item={item} pricingSettings={pricingSettings} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedJewelry;
