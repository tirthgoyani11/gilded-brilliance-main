import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Gem, Heart, Search, ShoppingBag, SlidersHorizontal } from "lucide-react";
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
  getJewelryMetalImage,
  jewelryMetalOptions,
  jewelryMetalSwatches,
  jewelryCategories,
  loadJewelryItems,
} from "@/lib/jewelry-catalog";

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price, low to high", value: "price-asc" },
  { label: "Price, high to low", value: "price-desc" },
  { label: "Alphabetically, A-Z", value: "az" },
] as const;

const Jewelry = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useStore();
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

  useEffect(() => {
    let active = true;

    const load = async () => {
      const items = await loadJewelryItems();
      if (active) setJewelryItems(items);
    };

    void load();

    return () => {
      active = false;
    };
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
      <section className="bg-background py-8 lg:py-12">
        <div className="container mx-auto px-4 lg:px-10">
          <div className="border-b border-border pb-6">
            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
              <Link to="/" className="hover:text-foreground">Home</Link>
              <span>/</span>
              <Link to="/jewelry" className="hover:text-foreground">Jewelry</Link>
              {activeCategory !== "All" ? (
                <>
                  <span>/</span>
                  <span className="text-foreground">{activeCategory}</span>
                </>
              ) : null}
            </div>

            <div className="flex flex-wrap items-end justify-between gap-5">
              <div className="max-w-3xl">
                <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  <Gem className="h-4 w-4" />
                  VMORA Collection
                </p>
                <h1 className="font-heading text-3xl leading-tight text-foreground sm:text-4xl lg:text-6xl">
                  Collection: {copy.title}
                </h1>
                <p className="mt-4 text-sm text-muted-foreground sm:text-base">{copy.description}</p>
              </div>

              <label className="flex w-full max-w-xs items-center gap-2 rounded border border-border bg-background px-3 py-2 text-sm">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <select
                  value={activeCategory}
                  onChange={(event) => handleCategoryChange(event.target.value)}
                  className="h-9 flex-1 bg-transparent text-sm outline-none"
                  aria-label="Filter jewelry category"
                >
                  {jewelryCategories.map((category) => (
                    <option key={category} value={category}>
                      {category === "All" ? "All Jewelry" : category}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            {jewelryCategories.map((category) => {
              const href = category === "All" ? "/jewelry" : `/jewelry/${categoryToSlug[category as JewelryItem["category"]]}`;
              return (
                <Link
                  key={category}
                  to={href}
                  className={`rounded-[8px] border px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${
                    activeCategory === category
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {category === "All" ? "All Jewelry" : category}
                </Link>
              );
            })}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="h-fit rounded-[8px] border border-border bg-background p-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h2 className="text-sm font-semibold uppercase tracking-[0.12em]">Filter</h2>
                <button
                  onClick={() => {
                    setMetalFilter("All");
                    setSearch("");
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </button>
              </div>

              <div className="mt-4 space-y-5">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Search</p>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search jewelry"
                      className="h-10 w-full rounded border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Gold Colour</p>
                  <div className="space-y-2">
                    {metals.map((metal) => (
                      <label key={metal} className="flex items-center justify-between gap-3 text-sm">
                        <span>{metal}</span>
                        <input
                          type="radio"
                          name="metal"
                          checked={metalFilter === metal}
                          onChange={() => setMetalFilter(metal)}
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Ready Status</p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>In Stock</p>
                    <p>Made To Order</p>
                    <p>Reserved</p>
                  </div>
                </div>
              </div>
            </aside>

            <div>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">{filteredJewelryItems.length} products</p>
                <label className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value as (typeof sortOptions)[number]["value"])}
                    className="h-10 rounded border border-border bg-background px-3 text-sm outline-none"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredJewelryItems.map((item) => (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-[8px] border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    <Link to={`/jewelry/product/${encodeURIComponent(item.id)}?metal=${encodeURIComponent(selectedMetals[item.id] || "Silver")}`} className="block">
                      <div className="relative aspect-[4/3] overflow-hidden bg-muted/40">
                        <img
                          src={getJewelryMetalImage(item, selectedMetals[item.id] || "Silver")}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                        />
                        {item.isFeatured ? (
                          <span className="absolute left-3 top-3 rounded bg-background/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                            Featured
                          </span>
                        ) : null}
                        <span className="absolute right-3 top-3 rounded-full bg-background/90 p-2 text-foreground">
                          <Heart className="h-4 w-4" />
                        </span>
                      </div>
                    </Link>
                    <div className="p-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary">
                        {item.category}
                        {item.subcategory ? ` / ${item.subcategory}` : ""}
                      </p>
                      <Link to={`/jewelry/product/${encodeURIComponent(item.id)}?metal=${encodeURIComponent(selectedMetals[item.id] || "Silver")}`} className="mt-2 block min-h-[3rem] font-heading text-xl leading-tight hover:text-primary">
                        {item.name}
                      </Link>
                      <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm text-muted-foreground">{item.description}</p>
                      <div className="mt-4 flex items-center gap-2">
                        {jewelryMetalOptions.map((metal) => (
                          <button
                            key={metal}
                            type="button"
                            onClick={() => setSelectedMetals((prev) => ({ ...prev, [item.id]: metal }))}
                            className={`h-6 w-6 rounded-full border transition-transform ${
                              (selectedMetals[item.id] || "Silver") === metal ? "scale-110 border-foreground ring-2 ring-primary/30" : "border-border"
                            }`}
                            style={{ backgroundColor: jewelryMetalSwatches[metal] }}
                            aria-label={`Show ${metal}`}
                          />
                        ))}
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <p>{selectedMetals[item.id] || "Silver"}</p>
                        <p className="text-right">{item.diamondWeight || item.stoneType || "Fine jewelry"}</p>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <p className="font-heading text-xl">{formatJewelryPrice(item.price)}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            addToCart({
                              id: item.id,
                              title: item.name,
                              type: "jewelry",
                              price: item.price,
                              imageUrl: getJewelryMetalImage(item, selectedMetals[item.id] || "Silver"),
                            })
                          }
                        >
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Jewelry;
