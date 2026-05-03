import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, TrendingUp, ArrowRight, ShoppingBag } from "lucide-react";
import type { JewelryItem } from "@/types/diamond";
import { loadJewelryItems, formatJewelryPrice, calculateJewelryPrice, getJewelryMetalImage, getJewelryHoverImage, fallbackJewelryItems } from "@/lib/jewelry-catalog";
import { usePricingSettings } from "@/hooks/usePricingSettings";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const fionaEase = [0.3, 1, 0.3, 1] as const;

const pickTopSelling = (all: JewelryItem[]) => {
  const active = all.filter((i) => i.isActive !== false);
  const sorted = [...active].sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999) || b.price - a.price);
  return sorted.slice(0, 6);
};

/** Fiona-inspired small product card */
const SmallCard = ({ item, pricingSettings }: { item: JewelryItem; pricingSettings: any }) => {
  const mainImg = getJewelryMetalImage(item, item.metal);
  const hoverImg = getJewelryHoverImage(item, item.metal);
  const hasAlt = Boolean(hoverImg && hoverImg !== mainImg);
  const displayPrice = calculateJewelryPrice(item, item.metal, "10K", pricingSettings);

  return (
    <Link to={`/jewelry/product/${item.id}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-[#F6F6F6] transition-all duration-500 group-hover:shadow-[0_12px_36px_-10px_rgba(0,0,0,0.15)]">
        <img
          src={mainImg}
          alt={item.name}
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1000ms] ease-[cubic-bezier(0.3,1,0.3,1)] ${hasAlt ? "group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-[1.03]"}`}
          loading="lazy"
        />
        {hasAlt && (
          <img
            src={hoverImg}
            alt={`${item.name} – alternate view`}
            className="absolute inset-0 h-full w-full object-cover opacity-0 scale-[1.02] transition-all duration-[1000ms] ease-[cubic-bezier(0.3,1,0.3,1)] group-hover:opacity-100 group-hover:scale-100"
            loading="lazy"
          />
        )}
        <button
          className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white opacity-0 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-300 hover:scale-110 group-hover:opacity-100"
          onClick={(e) => e.preventDefault()}
        >
          <Heart className="h-3 w-3 text-[#072835]" />
        </button>
        {/* Quick view pill */}
        <div className="absolute inset-x-2 bottom-2 z-10 translate-y-2 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.3,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex h-8 items-center justify-center rounded-[10rem] bg-black text-white shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
            <ShoppingBag className="mr-1 h-3 w-3" />
            <span className="text-[10px] font-semibold tracking-[0.03em]">Quick View</span>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-black/[0.04] transition-all duration-500 group-hover:ring-[#a97a3a]/20" />
      </div>
      <div className="mt-2.5 space-y-0.5 px-0.5">
        <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-[#516971]">{item.category}</p>
        <h3 className="line-clamp-1 text-[12px] font-semibold leading-snug text-[#0A0A0A] transition-colors duration-300 group-hover:text-[#a97a3a] sm:text-[13px]">
          {item.name}
        </h3>
        <p className="text-xs font-bold tabular-nums text-[#0A0A0A] sm:text-sm">{formatJewelryPrice(displayPrice)}</p>
      </div>
    </Link>
  );
};

const TopSellingJewelry = () => {
  const [items, setItems] = useState<JewelryItem[]>(() => pickTopSelling(fallbackJewelryItems));
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const { settings: pricingSettings } = usePricingSettings();

  useEffect(() => {
    loadJewelryItems().then((all) => {
      setItems(pickTopSelling(all));
      setTimeout(() => ScrollTrigger.refresh(), 200);
    });
  }, []);

  if (items.length === 0) return null;

  const heroItem = items[0];
  const gridItems = items.slice(1, 5);
  const heroMainImg = getJewelryMetalImage(heroItem, heroItem.metal);
  const heroHoverImg = getJewelryHoverImage(heroItem, heroItem.metal);
  const heroHasAlt = Boolean(heroHoverImg && heroHoverImg !== heroMainImg);
  const heroDisplayPrice = calculateJewelryPrice(heroItem, heroItem.metal, "10K", pricingSettings);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#F7F2EA] py-16 lg:py-20">
      {/* Subtle marble texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20 mix-blend-multiply"
        style={{
          backgroundImage: "url(/marble-bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Decorative rings */}
      <div className="pointer-events-none absolute left-[10%] top-20 h-60 w-60 rounded-full border border-[#a97a3a]/[0.06]" />
      <div className="pointer-events-none absolute bottom-10 right-[8%] h-40 w-40 rounded-full border border-[#a97a3a]/[0.08]" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header — Fiona-style centered with decorative lines */}
        <div className="mb-12 text-center lg:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: fionaEase }}
          >
            <div className="mx-auto mb-4 inline-flex items-center gap-2">
              <span className="h-[1px] w-8 bg-[#a97a3a]" />
              <TrendingUp className="h-3.5 w-3.5 text-[#a97a3a]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a97a3a]">Trending Now</span>
              <span className="h-[1px] w-8 bg-[#a97a3a]" />
            </div>
            <h2 className="font-heading text-3xl leading-[1.15] text-[#0A0A0A] sm:text-4xl lg:text-[2.8rem]">
              Most Popular Pieces
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[13px] leading-relaxed text-[#516971] sm:text-sm">
              The pieces our clients love the most — refined, radiant, and ready to wear.
            </p>
          </motion.div>
        </div>

        {/* Asymmetric Layout: Hero + Grid */}
        <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
          {/* Hero Card — large featured product */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: fionaEase, delay: 0.1 }}
          >
            <Link to={`/jewelry/product/${heroItem.id}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#F6F6F6] transition-all duration-500 group-hover:shadow-[0_16px_48px_-14px_rgba(0,0,0,0.18)]">
                {/* Bestseller badge — Fiona gold pill */}
                <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-[#a97a3a] px-3 py-1 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-white">★ Bestseller</span>
                </div>
                {/* Main image */}
                <img
                  src={heroMainImg}
                  alt={heroItem.name}
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1000ms] ease-[cubic-bezier(0.3,1,0.3,1)] ${heroHasAlt ? "group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-[1.03]"}`}
                  loading="lazy"
                />
                {heroHasAlt && (
                  <img
                    src={heroHoverImg}
                    alt={`${heroItem.name} – alternate view`}
                    className="absolute inset-0 h-full w-full object-cover opacity-0 scale-[1.02] transition-all duration-[1000ms] ease-[cubic-bezier(0.3,1,0.3,1)] group-hover:opacity-100 group-hover:scale-100"
                    loading="lazy"
                  />
                )}
                {/* Wishlist */}
                <button
                  className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white opacity-0 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-300 hover:scale-110 group-hover:opacity-100"
                  onClick={(e) => e.preventDefault()}
                >
                  <Heart className="h-4 w-4 text-[#072835]" />
                </button>
                {/* Bottom info bar on hover — glass card */}
                <div className="absolute inset-x-3 bottom-3 z-10 translate-y-3 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.3,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="rounded-xl bg-white/95 p-4 shadow-[0_8px_24px_rgba(0,0,0,0.1)] backdrop-blur-sm">
                    <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#516971]">{heroItem.category}</p>
                    <p className="mt-1 text-[15px] font-semibold text-[#0A0A0A]">{heroItem.name}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-base font-bold tabular-nums text-[#0A0A0A]">{formatJewelryPrice(heroDisplayPrice)}</p>
                      <div className="flex h-8 items-center rounded-[10rem] bg-black px-4 text-white transition-colors duration-300 hover:bg-[#072835]">
                        <span className="text-[10px] font-semibold tracking-[0.04em]">View Details</span>
                        <ArrowRight className="ml-1.5 h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-black/[0.04] transition-all duration-500 group-hover:ring-[#a97a3a]/20" />
              </div>
              {/* Mobile product info */}
              <div className="mt-3 px-0.5 lg:hidden">
                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#516971]">{heroItem.category}</p>
                <h3 className="text-[13px] font-semibold text-[#0A0A0A]">{heroItem.name}</h3>
                <p className="text-sm font-bold tabular-nums text-[#0A0A0A]">{formatJewelryPrice(heroDisplayPrice)}</p>
              </div>
            </Link>
          </motion.div>

          {/* 2x2 Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {gridItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: fionaEase, delay: 0.25 + i * 0.08 }}
              >
                <SmallCard item={item} pricingSettings={pricingSettings} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA — Fiona pill button style */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-12 text-center"
        >
          <Link
            to="/jewelry"
            className="group inline-flex items-center gap-2 rounded-[10rem] border border-[#0A0A0A] bg-[#0A0A0A] px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-all duration-400 hover:bg-transparent hover:text-[#0A0A0A]"
          >
            Explore Full Collection
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default TopSellingJewelry;
