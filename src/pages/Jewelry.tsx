import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Heart, Search, ShoppingBag, SlidersHorizontal, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SiteLayout from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useStore } from "@/contexts/StoreContext";
import type { JewelryItem } from "@/types/diamond";
import {
  categorySlugMap,
  categoryToSlug,
  collectionCopy,
  fallbackJewelryItems,
  formatJewelryPrice,
  calculateJewelryPrice,
  getJewelryMetalImage,
  getJewelryHoverImage,
  jewelryMetalOptions,
  jewelryMetalSwatches,
  jewelryCategories,
  loadJewelryItems,
} from "@/lib/jewelry-catalog";
import { usePricingSettings } from "@/hooks/usePricingSettings";

const fionaEase = [0.3, 1, 0.3, 1] as const;

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price, low to high", value: "price-asc" },
  { label: "Price, high to low", value: "price-desc" },
  { label: "Alphabetically, A-Z", value: "az" },
] as const;

const ProductCard = ({ 
  item, 
  selectedMetal, 
  onMetalChange,
  pricingSettings,
}: { 
  item: JewelryItem; 
  selectedMetal?: string;
  onMetalChange: (metal: string) => void;
  pricingSettings: { multipliers: Record<string, number>; safetyBuffer: number };
}) => {
  const metal = selectedMetal || item.metal || "Silver";
  const displayPrice = calculateJewelryPrice(item, metal, "10K", pricingSettings);
  const mainImg = getJewelryMetalImage(item, metal);
  const hoverImg = getJewelryHoverImage(item, metal);
  const hasAlt = Boolean(hoverImg && hoverImg !== mainImg);
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const wishlisted = isWishlisted(item.id);

  return (
    <div className="group block">
      <Link to={`/jewelry/product/${item.id}?metal=${encodeURIComponent(metal)}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#F6F6F6] transition-all duration-500 group-hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)]">
          {item.isFeatured && (
            <div className="absolute left-2.5 top-2.5 z-10 rounded-full bg-[#a97a3a] px-2.5 py-[3px] shadow-sm">
              <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-white">Featured</span>
            </div>
          )}

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
            className={`absolute right-2.5 top-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-300 hover:scale-110 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] group-hover:opacity-100 ${wishlisted ? "bg-primary text-white opacity-100" : "bg-white text-[#072835] opacity-0"}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(item.id);
            }}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`h-3.5 w-3.5 ${wishlisted ? "fill-current" : ""}`} />
          </button>

          <div className="absolute inset-x-3 bottom-3 z-20 translate-y-3 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.3,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart({
                  id: item.id,
                  title: item.name,
                  type: "jewelry",
                  price: displayPrice,
                  imageUrl: mainImg,
                });
              }}
              className="flex w-full h-10 items-center justify-center rounded-[10rem] bg-black text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition-colors duration-300 hover:bg-[#072835]"
            >
              <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
              <span className="text-[11px] font-semibold tracking-[0.04em]">Add to Cart</span>
            </button>
          </div>

          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-black/[0.04] transition-all duration-500 group-hover:ring-[#a97a3a]/20" />
        </div>
      </Link>

      <div className="mt-3 space-y-1 px-0.5">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#516971]">
            {item.category} {item.subcategory ? `· ${item.subcategory}` : ""}
          </p>
          <div className="flex items-center gap-1.5">
            {jewelryMetalOptions.map((m) => (
              <button
                key={m}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onMetalChange(m);
                }}
                className={`h-3.5 w-3.5 rounded-full border transition-all duration-300 ${metal === m ? "scale-110 border-[#0A0A0A] shadow-[0_0_0_1px_rgba(10,10,10,0.1)]" : "border-black/10 hover:scale-110"}`}
                style={{ backgroundColor: jewelryMetalSwatches[m] }}
                title={m}
              />
            ))}
          </div>
        </div>
        <Link to={`/jewelry/product/${item.id}?metal=${encodeURIComponent(metal)}`}>
          <h3 className="line-clamp-1 text-[13px] font-semibold leading-snug text-[#0A0A0A] transition-colors duration-300 group-hover:text-[#a97a3a]">
            {item.name}
          </h3>
        </Link>
        <p className="text-sm font-bold tabular-nums text-[#0A0A0A]">{formatJewelryPrice(displayPrice)}</p>
      </div>
    </div>
  );
};

const Jewelry = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryCategory = searchParams.get("category") || "";
  const activeCategory = categorySlug
    ? categorySlugMap[categorySlug] || "All"
    : jewelryCategories.includes(queryCategory as (typeof jewelryCategories)[number])
      ? queryCategory
      : "All";
  const [jewelryItems, setJewelryItems] = useState<JewelryItem[]>(fallbackJewelryItems);
  const [sortBy, setSortBy] = useState<(typeof sortOptions)[number]["value"]>("featured");
  const [metalFilter, setMetalFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedMetals, setSelectedMetals] = useState<Record<string, string>>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { settings: pricingSettings } = usePricingSettings();

  useEffect(() => {
    let active = true;
    const load = async () => {
      const items = await loadJewelryItems();
      if (active) setJewelryItems(items);
    };
    void load();
    return () => { active = false; };
  }, []);

  const metals = useMemo(() => ["All", ...new Set(jewelryItems.map((item) => item.metal).filter(Boolean))], [jewelryItems]);

  const filteredJewelryItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const filtered = jewelryItems
      .filter((item) => activeCategory === "All" || item.category === activeCategory)
      .filter((item) => metalFilter === "All" || item.metal === metalFilter)
      .filter((item) => {
        if (!normalizedSearch) return true;
        return [item.name, item.category, item.subcategory, item.collection, item.metal, item.tags]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);
      });

    return [...filtered].sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "az") return a.name.localeCompare(b.name);
      if (Boolean(a.isFeatured) !== Boolean(b.isFeatured)) return a.isFeatured ? -1 : 1;
      return Number(a.sortOrder || 0) - Number(b.sortOrder || 0);
    });
  }, [activeCategory, jewelryItems, metalFilter, search, sortBy]);

  const copy = collectionCopy[activeCategory as keyof typeof collectionCopy] || collectionCopy.All;

  const handleCategoryChange = (category: string) => {
    if (category === "All") {
      navigate("/jewelry");
      return;
    }
    setSearchParams({});
    navigate(`/jewelry/${categoryToSlug[category as JewelryItem["category"]]}`);
  };

  return (
    <SiteLayout>
      {/* Luxury Hero Banner */}
      <section className="bg-[#FAFAFA] pt-8 pb-12 lg:pt-16 lg:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(169,122,58,0.03)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(169,122,58,0.02)_0%,transparent_50%)] pointer-events-none" />
        <div className="container mx-auto px-4 lg:px-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-4 inline-flex items-center gap-2 mx-auto">
              <span className="h-[1px] w-6 bg-[#a97a3a]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a97a3a]">VMORA Masterpieces</span>
              <span className="h-[1px] w-6 bg-[#a97a3a]" />
            </div>
            <h1 className="font-heading text-4xl leading-tight text-[#0A0A0A] sm:text-5xl lg:text-[4rem] mb-4">
              {copy.title}
            </h1>
            <p className="text-[13px] sm:text-sm text-[#516971] max-w-xl mx-auto leading-relaxed">
              {copy.description}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="bg-white py-8 lg:py-12">
        <div className="container mx-auto px-4 lg:px-12">
          
          {/* Category Navigation - Pill Style */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10 border-b border-black/[0.04] pb-8">
            {jewelryCategories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`rounded-[10rem] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] transition-all duration-400 ${
                    isActive
                      ? "bg-[#0A0A0A] text-white shadow-[0_4px_16px_rgba(0,0,0,0.15)]"
                      : "bg-[#F6F6F6] text-[#516971] hover:bg-[#a97a3a] hover:text-white"
                  }`}
                >
                  {category === "All" ? "All Collections" : category}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            
            {/* Mobile Filter Toggle */}
            <div className="w-full flex justify-between items-center lg:hidden border-b border-black/[0.04] pb-4 mb-4">
              <span className="text-[13px] font-semibold text-[#0A0A0A]">{filteredJewelryItems.length} Designs</span>
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0A0A0A]"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>

            {/* Sidebar Filters */}
            <AnimatePresence>
              {(isFilterOpen || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
                <motion.aside 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-full lg:w-[240px] shrink-0 space-y-8 lg:sticky lg:top-24 overflow-hidden lg:overflow-visible"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0A0A0A]">Filters</h2>
                      {(metalFilter !== "All" || search !== "") && (
                        <button
                          onClick={() => { setMetalFilter("All"); setSearch(""); }}
                          className="text-[10px] uppercase tracking-[0.1em] text-[#a97a3a] hover:text-[#0A0A0A] transition-colors"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    
                    {/* Search */}
                    <div className="relative mb-6">
                      <Search className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0A0A0A]" />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search collection..."
                        className="h-10 w-full border-b border-black/[0.1] bg-transparent pl-8 pr-3 text-[13px] outline-none transition-all focus:border-[#a97a3a] placeholder:text-[#516971]"
                      />
                    </div>
                  </div>

                  {/* Metal Filter */}
                  <div className="border-t border-black/[0.04] pt-6">
                    <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0A0A0A]">Metal Tone</h3>
                    <div className="space-y-3">
                      {metals.map((metal) => (
                        <label key={metal} className="flex items-center gap-3 cursor-pointer group">
                          <div className={`flex h-[14px] w-[14px] items-center justify-center border transition-colors ${metalFilter === metal ? "border-[#a97a3a] bg-[#a97a3a]" : "border-black/20 group-hover:border-[#0A0A0A]"}`}>
                            {metalFilter === metal && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                          </div>
                          <span className={`text-[12px] uppercase tracking-[0.05em] transition-colors ${metalFilter === metal ? "text-[#0A0A0A] font-semibold" : "text-[#516971] group-hover:text-[#0A0A0A]"}`}>{metal}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="border-t border-black/[0.04] pt-6">
                    <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0A0A0A]">Availability</h3>
                    <div className="space-y-3">
                      {["In Stock", "Made To Order"].map((status) => (
                        <label key={status} className="flex items-center gap-3 cursor-pointer group">
                          <div className="flex h-[14px] w-[14px] items-center justify-center border border-black/20 group-hover:border-[#0A0A0A] transition-colors" />
                          <span className="text-[12px] uppercase tracking-[0.05em] text-[#516971] group-hover:text-[#0A0A0A] transition-colors">{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>

            {/* Product Grid Area */}
            <div className="flex-1 w-full min-w-0">
              
              {/* Desktop Header/Sort */}
              <div className="hidden lg:flex items-center justify-between mb-8 pb-4 border-b border-black/[0.04]">
                <p className="text-[13px] font-semibold text-[#0A0A0A]">{filteredJewelryItems.length} Designs</p>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#516971]">Sort by</span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="h-9 appearance-none rounded-md border border-black/[0.08] bg-transparent pl-3 pr-8 text-[13px] font-medium text-[#0A0A0A] outline-none transition-colors focus:border-[#a97a3a]"
                    >
                      {sortOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#516971] pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Grid */}
              {filteredJewelryItems.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredJewelryItems.map((item, i) => (
                    <motion.div
                      key={`${item.id}-${i}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: fionaEase, delay: Math.min(i * 0.05, 0.3) }}
                    >
                      <ProductCard 
                        item={item} 
                        selectedMetal={selectedMetals[item.id]} 
                        onMetalChange={(metal) => setSelectedMetals(p => ({ ...p, [item.id]: metal }))} 
                        pricingSettings={pricingSettings}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <p className="font-heading text-2xl text-[#0A0A0A] mb-2">No designs found</p>
                  <p className="text-[13px] text-[#516971]">Try adjusting your filters or search criteria.</p>
                  <Button 
                    variant="luxury" 
                    className="mt-6 rounded-[10rem] bg-[#0A0A0A] text-white hover:bg-[#a97a3a]"
                    onClick={() => { setMetalFilter("All"); setSearch(""); }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Jewelry;
