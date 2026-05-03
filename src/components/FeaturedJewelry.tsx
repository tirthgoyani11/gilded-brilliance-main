import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, ArrowRight, Sparkles } from "lucide-react";
import type { JewelryItem } from "@/types/diamond";
import { loadJewelryItems, formatJewelryPrice, getJewelryMetalImage, getJewelryHoverImage, fallbackJewelryItems } from "@/lib/jewelry-catalog";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const pickFeatured = (all: JewelryItem[]) => {
  const featured = all.filter((i) => i.isFeatured && i.isActive !== false);
  if (featured.length < 4) {
    const rest = all.filter((i) => !i.isFeatured && i.isActive !== false);
    featured.push(...rest.slice(0, 4 - featured.length));
  }
  return featured.slice(0, 8);
};

/** Product card with crossfade hover to alternate image */
const ProductCard = ({ item, badge }: { item: JewelryItem; badge?: string }) => {
  const mainImg = getJewelryMetalImage(item, item.metal);
  const hoverImg = getJewelryHoverImage(item, item.metal);
  const hasAlt = Boolean(hoverImg && hoverImg !== mainImg);

  return (
    <Link to={`/jewelry/product/${item.id}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-secondary/30 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.1)] transition-shadow duration-500 group-hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.18)]">
        {/* Badge */}
        {badge && (
          <div className="absolute left-3 top-3 z-10 rounded-md border border-primary/10 bg-background/90 px-2.5 py-1 backdrop-blur-md">
            <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-primary">{badge}</span>
          </div>
        )}
        {/* Main image */}
        <img
          src={mainImg}
          alt={item.name}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${hasAlt ? "group-hover:opacity-0" : ""}`}
          loading="lazy"
        />
        {/* Hover image (different metal/angle) */}
        {hasAlt && (
          <img
            src={hoverImg}
            alt={`${item.name} – alternate view`}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            loading="lazy"
          />
        )}
        {/* Wishlist */}
        <button
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-border/30 bg-white/80 opacity-0 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white group-hover:opacity-100"
          onClick={(e) => e.preventDefault()}
        >
          <Heart className="h-3.5 w-3.5 text-foreground" />
        </button>
        {/* Gradient overlay on hover */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {/* Gold border on hover */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl border-[1.5px] border-transparent transition-colors duration-500 group-hover:border-primary/25" />
      </div>
      {/* Info */}
      <div className="mt-4 space-y-1">
        <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          {item.category} {item.subcategory ? `· ${item.subcategory}` : ""}
        </p>
        <h3 className="line-clamp-1 font-heading text-sm text-foreground transition-colors duration-300 group-hover:text-primary">
          {item.name}
        </h3>
        <p className="text-sm font-medium tabular-nums text-foreground">{formatJewelryPrice(item.price)}</p>
      </div>
    </Link>
  );
};

const FeaturedJewelry = () => {
  const [items, setItems] = useState<JewelryItem[]>(() => pickFeatured(fallbackJewelryItems));
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  useEffect(() => {
    loadJewelryItems().then((all) => {
      setItems(pickFeatured(all));
      setTimeout(() => ScrollTrigger.refresh(), 200);
    });
  }, []);

  if (items.length === 0) return null;

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-background pt-10 pb-10 lg:pt-14 lg:pb-14">
      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/[0.03] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-primary/[0.04] blur-3xl" />
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="mb-14 flex flex-col items-center text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1">
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Featured Collection</span>
            </div>
            <h2 className="font-heading text-3xl leading-tight text-foreground sm:text-4xl lg:text-5xl">
              Curated For You
            </h2>
            <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
              Handpicked pieces chosen for their exceptional craftsmanship and timeless appeal.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 sm:mt-0"
          >
            <Link
              to="/jewelry"
              className="group inline-flex items-center gap-2 rounded-full border border-primary/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary transition-all duration-300 hover:border-primary/40 hover:bg-primary/5"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-7">
          {items.slice(0, 4).map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.1 }}
            >
              <ProductCard item={item} badge={i === 0 ? "✦ Featured" : undefined} />
            </motion.div>
          ))}
        </div>

        {/* Second row */}
        {items.length > 4 && (
          <div className="mt-5 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-7">
            {items.slice(4, 8).map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.5 + i * 0.1 }}
              >
                <ProductCard item={item} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedJewelry;
