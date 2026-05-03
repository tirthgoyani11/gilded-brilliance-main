import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, TrendingUp, ArrowRight } from "lucide-react";
import type { JewelryItem } from "@/types/diamond";
import { loadJewelryItems, formatJewelryPrice, getJewelryMetalImage, getJewelryHoverImage, fallbackJewelryItems } from "@/lib/jewelry-catalog";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const pickTopSelling = (all: JewelryItem[]) => {
  const active = all.filter((i) => i.isActive !== false);
  const sorted = [...active].sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999) || b.price - a.price);
  return sorted.slice(0, 6);
};

/** Small product card with crossfade hover */
const SmallCard = ({ item }: { item: JewelryItem }) => {
  const mainImg = getJewelryMetalImage(item, item.metal);
  const hoverImg = getJewelryHoverImage(item, item.metal);
  const hasAlt = Boolean(hoverImg && hoverImg !== mainImg);

  return (
    <Link to={`/jewelry/item/${item.id}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary/30 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.1)] transition-shadow duration-500 group-hover:shadow-[0_14px_36px_-12px_rgba(0,0,0,0.18)]">
        <img
          src={mainImg}
          alt={item.name}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${hasAlt ? "group-hover:opacity-0" : ""}`}
          loading="lazy"
        />
        {hasAlt && (
          <img
            src={hoverImg}
            alt={`${item.name} – alternate view`}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            loading="lazy"
          />
        )}
        <button
          className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border/30 bg-white/80 opacity-0 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white group-hover:opacity-100"
          onClick={(e) => e.preventDefault()}
        >
          <Heart className="h-3 w-3 text-foreground" />
        </button>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="pointer-events-none absolute inset-0 rounded-2xl border-[1.5px] border-transparent transition-colors duration-500 group-hover:border-primary/25" />
      </div>
      <div className="mt-3 space-y-0.5">
        <p className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground">{item.category}</p>
        <h3 className="line-clamp-1 font-heading text-xs text-foreground transition-colors duration-300 group-hover:text-primary sm:text-sm">
          {item.name}
        </h3>
        <p className="text-xs font-medium tabular-nums text-foreground sm:text-sm">{formatJewelryPrice(item.price)}</p>
      </div>
    </Link>
  );
};

const TopSellingJewelry = () => {
  const [items, setItems] = useState<JewelryItem[]>(() => pickTopSelling(fallbackJewelryItems));
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

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

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#F7F2EA] py-20 lg:py-28">
      {/* Marble texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30 mix-blend-multiply"
        style={{
          backgroundImage: "url(/marble-bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />
      {/* Floating ring accents */}
      <div className="pointer-events-none absolute left-[10%] top-20 h-60 w-60 rounded-full border border-primary/[0.06]" />
      <div className="pointer-events-none absolute bottom-10 right-[8%] h-40 w-40 rounded-full border border-primary/[0.08]" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="mb-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1">
              <TrendingUp className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Trending Now</span>
            </div>
            <h2 className="font-heading text-3xl leading-tight text-foreground sm:text-4xl lg:text-5xl">
              Most Popular Pieces
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">
              The pieces our clients love the most — refined, radiant, and ready to wear.
            </p>
          </motion.div>
        </div>

        {/* Asymmetric Layout: Hero + Grid */}
        <div className="grid gap-5 lg:grid-cols-2 lg:gap-7">
          {/* Hero Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            <Link to={`/jewelry/item/${heroItem.id}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-secondary/30 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.12)] transition-shadow duration-500 group-hover:shadow-[0_20px_50px_-16px_rgba(0,0,0,0.22)]">
                {/* Bestseller badge */}
                <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full border border-primary/15 bg-background/90 px-3 py-1.5 backdrop-blur-md">
                  <span className="text-xs font-semibold text-primary">★</span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground">Bestseller</span>
                </div>
                {/* Main image */}
                <img
                  src={heroMainImg}
                  alt={heroItem.name}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-600 ${heroHasAlt ? "group-hover:opacity-0" : ""}`}
                  loading="lazy"
                />
                {/* Hover alternate image */}
                {heroHasAlt && (
                  <img
                    src={heroHoverImg}
                    alt={`${heroItem.name} – alternate view`}
                    className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-600 group-hover:opacity-100"
                    loading="lazy"
                  />
                )}
                {/* Wishlist */}
                <button
                  className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border/30 bg-white/80 opacity-0 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white group-hover:opacity-100"
                  onClick={(e) => e.preventDefault()}
                >
                  <Heart className="h-4 w-4 text-foreground" />
                </button>
                {/* Gradient overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                {/* Bottom info bar on hover */}
                <div className="absolute inset-x-0 bottom-0 z-10 translate-y-4 p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="rounded-xl border border-white/10 bg-white/90 p-4 backdrop-blur-lg">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{heroItem.category}</p>
                    <p className="mt-1 font-heading text-base text-foreground">{heroItem.name}</p>
                    <p className="mt-1 text-sm font-semibold text-primary">{formatJewelryPrice(heroItem.price)}</p>
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-transparent transition-colors duration-500 group-hover:border-primary/20" />
              </div>
              <div className="mt-4 lg:hidden">
                <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{heroItem.category}</p>
                <h3 className="font-heading text-sm text-foreground">{heroItem.name}</h3>
                <p className="text-sm font-medium tabular-nums text-foreground">{formatJewelryPrice(heroItem.price)}</p>
              </div>
            </Link>
          </motion.div>

          {/* 2x2 Grid */}
          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            {gridItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 + i * 0.1 }}
              >
                <SmallCard item={item} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <Link
            to="/jewelry"
            className="group inline-flex items-center gap-2.5 rounded-full border border-primary/20 bg-primary/5 px-7 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:shadow-lg"
          >
            Explore Full Collection
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default TopSellingJewelry;
