import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CreditCard,
  Gem,
  Heart,
  MessageCircle,
  Minus,
  Play,
  Plus,
  Ruler,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  Wrench,
  RotateCcw,
} from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import MobileVideoPip from "@/components/MobileVideoPip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useStore } from "@/contexts/StoreContext";
import { WHATSAPP_NUMBER } from "@/lib/diamond-utils";
import type { JewelryItem } from "@/types/diamond";
import {
  categoryToSlug,
  fallbackJewelryItems,
  formatJewelryPrice,
  getJewelryMetalImages,
  getJewelryMetalImage,
  jewelryMetalOptions,
  jewelryMetalSwatches,
  loadJewelryItems,
} from "@/lib/jewelry-catalog";

const JewelryModelViewer = lazy(() => import("@/components/JewelryModelViewer"));

type GalleryMedia = {
  type: "image" | "video" | "model";
  src: string;
  label: string;
};

const RECENTLY_VIEWED_KEY = "vmora_recent_jewelry";

const estimatedDelivery = (item: JewelryItem) => {
  if (item.inventoryStatus === "In Stock") return "Ships in 2-4 business days";
  if (item.inventoryStatus === "Reserved") return "Concierge confirmation required";
  if (item.inventoryStatus === "Sold Out") return "Available by special request";
  return "Made for you in 3-5 weeks";
};

const sizeGuideRows = [
  ["US 4-5", "14.8-15.7 mm inner diameter"],
  ["US 6-7", "16.5-17.3 mm inner diameter"],
  ["US 8-9", "18.2-19.0 mm inner diameter"],
  ["Custom", "Confirm by concierge before production"],
];

const JewelryDetail = () => {
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const requestedMetal = searchParams.get("metal");
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [items, setItems] = useState<JewelryItem[]>(fallbackJewelryItems);
  const [quantity, setQuantity] = useState(1);
  const [selectedMetal, setSelectedMetal] = useState(
    requestedMetal === "Gold" || requestedMetal === "Rose Gold" || requestedMetal === "Silver" ? requestedMetal : "Silver",
  );
  const [selectedMedia, setSelectedMedia] = useState<GalleryMedia | null>(null);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const nextItems = await loadJewelryItems();
      if (active) setItems(nextItems);
    };

    void load();

    return () => {
      active = false;
    };
  }, []);

  const product = useMemo(
    () => items.find((item) => item.id === productId) || fallbackJewelryItems.find((item) => item.id === productId),
    [items, productId],
  );

  const relatedItems = useMemo(() => {
    if (!product) return [];
    return items.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  }, [items, product]);

  useEffect(() => {
    if (!product) return;
    setSelectedMedia({
      type: "image",
      src: getJewelryMetalImage(product, selectedMetal),
      label: selectedMetal,
    });
  }, [product, selectedMetal]);

  useEffect(() => {
    if (!product || typeof window === "undefined") return;
    const stored = window.localStorage.getItem(RECENTLY_VIEWED_KEY);
    let parsed: string[] = [];
    try {
      parsed = stored ? (JSON.parse(stored) as string[]) : [];
    } catch {
      parsed = [];
    }
    const next = [product.id, ...parsed.filter((id) => id !== product.id)].slice(0, 8);
    window.localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(next));
    setRecentlyViewedIds(next);
  }, [product]);

  if (!product) {
    return (
      <SiteLayout>
        <section className="container mx-auto px-4 py-16 lg:px-10">
          <h1 className="font-heading text-3xl">Jewelry item not found</h1>
          <Button asChild className="mt-6">
            <Link to="/jewelry">Back to Jewelry</Link>
          </Button>
        </section>
      </SiteLayout>
    );
  }

  const categoryHref = `/jewelry/${categoryToSlug[product.category]}`;
  const activeImage = getJewelryMetalImage(product, selectedMetal);
  const activeMedia = selectedMedia || { type: "image" as const, src: activeImage, label: selectedMetal };
  const delivery = estimatedDelivery(product);
  const wishlisted = isWishlisted(product.id);
  const galleryImages = [
    ...jewelryMetalOptions.flatMap((metal) => getJewelryMetalImages(product, metal)),
    ...(product.galleryImages || []),
  ].filter((image, index, all) => image && all.indexOf(image) === index);
  const galleryMedia: GalleryMedia[] = [
    ...galleryImages.map((image, index) => ({ type: "image" as const, src: image, label: `View ${index + 1}` })),
    ...(product.modelUrl ? [{ type: "model" as const, src: product.modelUrl, label: "360 View" }] : []),
    ...(product.videoUrl ? [{ type: "video" as const, src: product.videoUrl, label: "Video" }] : []),
  ];
  const recentlyViewedItems = recentlyViewedIds
    .filter((id) => id !== product.id)
    .map((id) => items.find((item) => item.id === id) || fallbackJewelryItems.find((item) => item.id === id))
    .filter((item): item is JewelryItem => Boolean(item))
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i += 1) {
      addToCart({
        id: product.id,
        title: product.name,
        type: "jewelry",
        price: product.price,
        imageUrl: activeImage,
      });
    }
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      `Hello VMORA Team,\n\n` +
        `I want details for ${product.name} (${product.id}).\n` +
        `Metal: ${selectedMetal}\n` +
        `Quantity: ${quantity}\n` +
        `Price: ${formatJewelryPrice(product.price)}\n` +
        `Image: ${activeImage}\n` +
        (product.modelUrl ? `360 Model: Available on product page\n` : "") +
        `Estimated Delivery: ${delivery}\n\n` +
        `Please connect me with a jewelry expert.`,
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${message}`, "_blank");
  };

  const productSections = [
    {
      key: "diamond",
      title: "Diamond Details",
      copy: `${product.stoneType || "Diamond"} stones selected for balanced brilliance, clean proportions, and everyday wear.`,
      rows: [
        ["Stone", product.stoneType || "Diamond"],
        ["Diamond Weight", product.diamondWeight || "Available on request"],
        ["Setting", product.setting || product.subcategory || "Fine jewelry setting"],
      ],
    },
    {
      key: "metal",
      title: "Metal and Craftsmanship",
      copy: `Hand finished by VMORA artisans in ${selectedMetal}, with polished surfaces and refined gallery detailing.`,
      rows: [
        ["Metal", selectedMetal],
        ["Collection", product.collection || "VMORA Fine Jewelry"],
        ["Finish", "High polish VMORA finish"],
      ],
    },
    {
      key: "sizing",
      title: "Sizing and Customization",
      copy: "Size, metal tone, stone preference, and small proportion changes can be confirmed before production.",
      rows: [
        ["Customization", "Available by concierge"],
        ["Size Support", product.category === "Rings" ? "Ring size confirmation included" : "Fit guidance included"],
        ["Production", product.inventoryStatus || "Made To Order"],
      ],
    },
    {
      key: "shipping",
      title: "Shipping and Returns",
      copy: "Every order is securely packed, insured in transit, and supported by VMORA aftercare.",
      rows: [
        ["Estimated Delivery", delivery],
        ["Shipping", "Free insured shipping"],
        ["Support", "Lifetime care guidance"],
      ],
    },
  ];

  const trustItems = [
    { icon: ShieldCheck, label: "Certified Stones" },
    { icon: Sparkles, label: "Lifetime Support" },
    { icon: CreditCard, label: "Secure Payment" },
    { icon: Truck, label: "Insured Delivery" },
    { icon: Wrench, label: "Custom Made" },
  ];

  return (
    <SiteLayout>
      <section className="bg-background py-6 pb-32 md:pb-12 lg:py-12">
        <div className="container mx-auto px-4 lg:px-10">
          <div className="mb-6 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link to="/jewelry" className="hover:text-foreground">Jewelry</Link>
            <span>/</span>
            <Link to={categoryHref} className="hover:text-foreground">{product.category}</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.06fr)_minmax(390px,0.94fr)] lg:gap-12">
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-[10px] border border-border bg-muted">
                <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2">
                  {["Made to Order", "Certified Diamonds", "Free Insured Shipping"].map((badge) => (
                    <span key={badge} className="rounded-full bg-background/90 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-foreground shadow-sm backdrop-blur">
                      {badge}
                    </span>
                  ))}
                </div>

                {activeMedia.type === "model" ? (
                  <Suspense
                    fallback={
                      <div className="flex aspect-square h-full w-full items-center justify-center bg-[#f5f2ec] text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        Loading 360 view
                      </div>
                    }
                  >
                    <JewelryModelViewer src={activeMedia.src} title={`${product.name} 360 view`} className="aspect-square h-full w-full" />
                  </Suspense>
                ) : activeMedia.type === "video" ? (
                  <video src={activeMedia.src} autoPlay muted loop playsInline className="aspect-square h-full w-full bg-black object-contain" />
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <button type="button" className="group block w-full cursor-zoom-in" aria-label="Zoom product image">
                        <img
                          src={activeMedia.src}
                          alt={product.name}
                          className="aspect-square h-full w-full object-contain p-3 transition duration-700 group-hover:scale-[1.04] sm:p-6"
                        />
                        <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md backdrop-blur">
                          <Search className="h-4 w-4" />
                        </span>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl border-border p-3 sm:p-5">
                      <DialogHeader>
                        <DialogTitle className="font-heading text-2xl">{product.name}</DialogTitle>
                        <DialogDescription>{selectedMetal} preview</DialogDescription>
                      </DialogHeader>
                      <img src={activeMedia.src} alt={product.name} className="max-h-[75vh] w-full rounded-[8px] object-contain" />
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
                {galleryMedia.map((media, index) => (
                  <button
                    key={`${media.type}-${media.src}-${index}`}
                    onClick={() => setSelectedMedia(media)}
                    className={`relative h-20 w-20 shrink-0 snap-start overflow-hidden rounded-[8px] border bg-muted transition sm:h-24 sm:w-24 ${
                      activeMedia.type === media.type && activeMedia.src === media.src ? "border-primary shadow-sm" : "border-border hover:border-primary/60"
                    }`}
                  >
                    {media.type === "model" ? (
                      <span className="flex h-full w-full flex-col items-center justify-center gap-1 bg-[#f5f2ec] text-foreground">
                        <RotateCcw className="h-5 w-5" />
                        <span className="text-[9px] font-semibold uppercase tracking-[0.1em]">360</span>
                      </span>
                    ) : media.type === "video" ? (
                      <span className="flex h-full w-full items-center justify-center bg-black text-white">
                        <Play className="h-6 w-6" />
                      </span>
                    ) : (
                      <img src={media.src} alt={`${product.name} ${media.label}`} className="h-full w-full object-contain p-1" />
                    )}
                  </button>
                ))}
              </div>

              <div className="rounded-[8px] border border-border bg-secondary/20 p-3">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Preview in Metal</p>
                <div className="grid grid-cols-1 gap-2 min-[480px]:grid-cols-3">
                  {jewelryMetalOptions.map((metal) => (
                    <button
                      key={metal}
                      type="button"
                      onClick={() => {
                        setSelectedMetal(metal);
                        setSelectedMedia({ type: "image", src: getJewelryMetalImage(product, metal), label: metal });
                      }}
                      className={`overflow-hidden rounded-[8px] border bg-background p-2 text-left transition ${
                        selectedMetal === metal ? "border-primary shadow-sm" : "border-border hover:border-primary/60"
                      }`}
                    >
                      <img src={getJewelryMetalImage(product, metal)} alt={`${metal} ${product.name}`} className="aspect-square w-full object-contain" />
                      <span className="mt-2 flex min-w-0 items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em]">
                        <span className="h-3 w-3 rounded-full border border-border" style={{ backgroundColor: jewelryMetalSwatches[metal] }} />
                        <span className="truncate">{metal}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  <Gem className="h-4 w-4" />
                  {product.collection || "VMORA Fine Jewelry"}
                </p>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
                    wishlisted ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:border-primary"
                  }`}
                  aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
                </button>
              </div>

              <h1 className="font-heading text-3xl leading-tight text-foreground sm:text-4xl lg:text-5xl">{product.name}</h1>
              <p className="mt-3 text-sm uppercase tracking-[0.14em] text-muted-foreground">
                {product.category}{product.subcategory ? ` / ${product.subcategory}` : ""} / {selectedMetal}
              </p>
              <p className="mt-5 font-heading text-3xl text-foreground">{formatJewelryPrice(product.price)}</p>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{product.description}</p>

              <div className="mt-5 grid gap-3 rounded-[8px] border border-border bg-secondary/20 p-4 sm:grid-cols-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Status</p>
                  <p className="mt-1 text-sm font-semibold">{product.inventoryStatus || "In Stock"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Delivery</p>
                  <p className="mt-1 text-sm font-semibold">{delivery}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Concierge</p>
                  <p className="mt-1 text-sm font-semibold">Expert review included</p>
                </div>
              </div>

              <div className="mt-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Metal Colour</p>
                <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-3">
                  {jewelryMetalOptions.map((metal) => (
                    <button
                      key={metal}
                      type="button"
                      onClick={() => {
                        setSelectedMetal(metal);
                        setSelectedMedia({ type: "image", src: getJewelryMetalImage(product, metal), label: metal });
                      }}
                      className={`flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-[8px] border px-3 py-2 text-sm font-medium transition ${
                        selectedMetal === metal ? "border-primary bg-primary/10" : "border-border hover:border-primary/60"
                      }`}
                    >
                      <span className="h-5 w-5 rounded-full border border-border" style={{ backgroundColor: jewelryMetalSwatches[metal] }} />
                      <span className="truncate">{metal}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
                {trustItems.map((item) => (
                  <div key={item.label} className="rounded-[8px] border border-border p-3">
                    <item.icon className="mb-2 h-5 w-5 text-primary" />
                    <p className="break-words text-[10px] font-semibold uppercase tracking-[0.06em] leading-4">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="flex h-12 items-center rounded-[8px] border border-border">
                  <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="flex h-12 w-12 items-center justify-center">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-semibold">{quantity}</span>
                  <button type="button" onClick={() => setQuantity((value) => value + 1)} className="flex h-12 w-12 items-center justify-center">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <Button variant="luxury" className="h-12 flex-1 min-w-[220px]" onClick={handleAddToCart}>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Add To Cart
                </Button>

                <Button variant="outline" className="h-12 min-w-[190px]" onClick={openWhatsApp}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Speak with Jewelry Expert
                </Button>
              </div>

              <div className="mt-8 rounded-[8px] border border-border bg-secondary/20 p-5">
                <div className="flex items-start gap-3">
                  <BadgeCheck className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <h2 className="font-heading text-2xl">Hand Finished by VMORA Artisans</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Each piece is inspected for stone security, polish, proportion, and comfort before it leaves our studio.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 md:hidden">
                <Accordion type="single" collapsible defaultValue="diamond" className="rounded-[8px] border border-border px-4">
                  {productSections.map((section) => (
                    <AccordionItem key={section.key} value={section.key}>
                      <AccordionTrigger className="text-left font-heading text-lg hover:no-underline">{section.title}</AccordionTrigger>
                      <AccordionContent>
                        <p className="mb-4 text-sm leading-6 text-muted-foreground">{section.copy}</p>
                        <div className="divide-y divide-border">
                          {section.rows.map(([label, value]) => (
                            <div key={label} className="flex justify-between gap-4 py-2 text-sm">
                              <span className="text-muted-foreground">{label}</span>
                              <span className="text-right font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              <div className="mt-8 hidden grid-cols-2 gap-4 md:grid">
                {productSections.map((section) => (
                  <div key={section.key} className="rounded-[8px] border border-border p-4">
                    <h2 className="font-heading text-xl">{section.title}</h2>
                    <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">{section.copy}</p>
                    <div className="mt-4 divide-y divide-border">
                      {section.rows.map(([label, value]) => (
                        <div key={label} className="flex justify-between gap-4 py-2 text-sm">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="text-right font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {product.category === "Rings" ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="h-11">
                        <Ruler className="mr-2 h-4 w-4" />
                        Ring Size Guide
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="font-heading text-2xl">Size Guidance</DialogTitle>
                        <DialogDescription>Use this as a starting point. VMORA will confirm the final fit before production.</DialogDescription>
                      </DialogHeader>
                      <div className="divide-y divide-border rounded-[8px] border border-border">
                        {sizeGuideRows.map(([size, detail]) => (
                          <div key={size} className="grid grid-cols-[100px_minmax(0,1fr)] gap-3 px-4 py-3 text-sm">
                            <span className="font-semibold">{size}</span>
                            <span className="text-muted-foreground">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : null}
                <div className="inline-flex h-11 items-center gap-2 rounded-[8px] border border-border px-4 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  {delivery}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-border pt-8">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Compare Metals</p>
                <h2 className="mt-1 font-heading text-3xl">Choose the Finish</h2>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {jewelryMetalOptions.map((metal) => (
                <button
                  key={metal}
                  type="button"
                  onClick={() => {
                    setSelectedMetal(metal);
                    setSelectedMedia({ type: "image", src: getJewelryMetalImage(product, metal), label: metal });
                  }}
                  className={`group rounded-[8px] border bg-card p-3 text-left transition hover:shadow-md ${
                    selectedMetal === metal ? "border-primary" : "border-border"
                  }`}
                >
                  <img src={getJewelryMetalImage(product, metal)} alt={`${metal} comparison`} className="aspect-[4/3] w-full rounded-[6px] object-contain transition group-hover:scale-[1.02]" />
                  <p className="mt-3 font-heading text-xl">{metal}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {metal === "Silver" && "Bright, crisp, and modern."}
                    {metal === "Gold" && "Warm, classic, and timeless."}
                    {metal === "Rose Gold" && "Soft, romantic, and distinctive."}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-5 border-t border-border pt-8 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Client Notes</p>
              <h2 className="mt-1 font-heading text-3xl">Loved for Everyday Brilliance</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["The concierge helped me choose the right metal and size before checkout.", "Anaya M."],
                ["Beautiful finish, secure packaging, and the diamond sparkle was exactly what I hoped for.", "Rohan S."],
              ].map(([quote, name]) => (
                <div key={name} className="rounded-[8px] border border-border p-4">
                  <div className="mb-3 flex gap-1 text-primary">
                    {[0, 1, 2, 3, 4].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">{quote}</p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em]">{name}</p>
                </div>
              ))}
            </div>
          </div>

          {relatedItems.length > 0 ? (
            <div className="mt-12 border-t border-border pt-8">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Complete the Look</p>
                  <h2 className="mt-1 font-heading text-3xl">Pair with {product.category}</h2>
                </div>
                <Link to={categoryHref} className="hidden items-center gap-2 text-sm font-semibold text-primary sm:inline-flex">
                  View Collection
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {relatedItems.map((item) => (
                  <Link key={item.id} to={`/jewelry/product/${encodeURIComponent(item.id)}`} className="group rounded-[8px] border border-border bg-card p-3 transition hover:shadow-md">
                    <img src={getJewelryMetalImage(item, item.metal)} alt={item.name} className="aspect-[4/3] w-full rounded-[6px] object-contain transition group-hover:scale-[1.02]" />
                    <p className="mt-3 font-heading text-xl">{item.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{formatJewelryPrice(item.price)}</p>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          {recentlyViewedItems.length > 0 ? (
            <div className="mt-12 border-t border-border pt-8">
              <h2 className="font-heading text-3xl">Recently Viewed</h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {recentlyViewedItems.map((item) => (
                  <Link key={item.id} to={`/jewelry/product/${encodeURIComponent(item.id)}`} className="rounded-[8px] border border-border bg-card p-3 transition hover:shadow-md">
                    <img src={getJewelryMetalImage(item, item.metal)} alt={item.name} className="aspect-[4/3] w-full rounded-[6px] object-contain" />
                    <p className="mt-3 font-heading text-xl">{item.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{formatJewelryPrice(item.price)}</p>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 p-3 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{selectedMetal} / Qty {quantity}</p>
            <p className="font-heading text-lg">{formatJewelryPrice(product.price)}</p>
          </div>
          <button type="button" onClick={openWhatsApp} className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-[#25D366] text-white" aria-label="Speak with jewelry expert">
            <MessageCircle className="h-4 w-4" />
          </button>
          <Button variant="luxury" size="sm" className="h-11 px-4" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </div>
      </div>

      {product.videoUrl ? <MobileVideoPip src={product.videoUrl} title={`${product.name} video`} /> : null}
    </SiteLayout>
  );
};

export default JewelryDetail;
