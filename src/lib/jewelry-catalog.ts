import type { JewelryItem } from "@/types/diamond";
import { getCurrencyConfig } from "@/lib/currency-store";
import productRing from "@/assets/product-ring.jpg";
import productEarrings from "@/assets/product-earrings.jpg";
import productBracelet from "@/assets/product-bracelet.jpg";
import productNecklace from "@/assets/product-necklace.jpg";

export const jewelryCategories = ["All", "Rings", "Necklaces", "Bracelets", "Earrings"] as const;
export const jewelryMetalOptions = ["Silver", "Gold", "Rose Gold", "White Gold"] as const;
export const jewelryMetalSwatches: Record<(typeof jewelryMetalOptions)[number], string> = {
  Silver: "#e6e6e6",
  Gold: "#e3b868",
  "Rose Gold": "#d9a092",
  "White Gold": "#f5f5f5",
};


export const categorySlugMap: Record<string, JewelryItem["category"]> = {
  rings: "Rings",
  necklaces: "Necklaces",
  bracelets: "Bracelets",
  earrings: "Earrings",
};

export const categoryToSlug: Record<JewelryItem["category"], string> = {
  Rings: "rings",
  Necklaces: "necklaces",
  Bracelets: "bracelets",
  Earrings: "earrings",
};

export const collectionCopy: Record<JewelryItem["category"] | "All", { title: string; description: string }> = {
  All: {
    title: "Jewelry",
    description: "Explore VMORA rings, necklaces, bracelets, and earrings in one clean catalog.",
  },
  Rings: {
    title: "Rings",
    description: "Shop signature solitaires, bridal rings, stackable bands, and diamond-led statement pieces.",
  },
  Necklaces: {
    title: "Necklaces",
    description: "Explore pendants, tennis necklaces, chains, and luminous daily layers.",
  },
  Bracelets: {
    title: "Bracelets",
    description: "Browse tennis bracelets, bangles, cuffs, and refined diamond essentials.",
  },
  Earrings: {
    title: "Earrings",
    description: "Discover studs, hoops, drops, huggies, and occasion earrings built for brilliance.",
  },
};

export const fallbackJewelryItems: JewelryItem[] = [
  {
    id: "vmora-solitaire-ring",
    name: "Signature Solitaire Diamond Ring",
    category: "Rings",
    subcategory: "Solitaire",
    metal: "Silver",
    price: 2850,
    imageUrl: productRing,
    description: "A refined solitaire profile with a bright center diamond focus and clean gallery detailing.",
    collection: "Bridal Essentials",
    stoneType: "Natural Diamond",
    diamondWeight: "1.00 ctw",
    setting: "Prong",
    metalImages: {
      Silver: [productRing],
      Gold: [productRing],
      "Rose Gold": [productRing],
    },
    galleryImages: [productRing],
    videoUrl: "",
    modelUrl: "",
    inventoryStatus: "Made To Order",
    isFeatured: true,
    isActive: true,
  },
  {
    id: "vmora-diamond-pendant",
    name: "Diamond Pendant Necklace",
    category: "Necklaces",
    subcategory: "Pendant",
    metal: "Gold",
    price: 1650,
    imageUrl: productNecklace,
    description: "A luminous everyday pendant designed for elegant layering and private gifting.",
    collection: "Diamond Essentials",
    stoneType: "Lab-Grown Diamond",
    diamondWeight: "0.70 ctw",
    setting: "Bezel",
    metalImages: {
      Silver: [productNecklace],
      Gold: [productNecklace],
      "Rose Gold": [productNecklace],
    },
    galleryImages: [productNecklace],
    videoUrl: "",
    modelUrl: "",
    inventoryStatus: "In Stock",
    isFeatured: true,
    isActive: true,
  },
  {
    id: "vmora-tennis-bracelet",
    name: "Classic Diamond Tennis Bracelet",
    category: "Bracelets",
    subcategory: "Tennis",
    metal: "Silver",
    price: 4200,
    imageUrl: productBracelet,
    description: "A balanced tennis bracelet with matched stones, secure clasping, and polished daily wear comfort.",
    collection: "Tennis Collection",
    stoneType: "Natural Diamond",
    diamondWeight: "3.00 ctw",
    setting: "Shared Prong",
    metalImages: {
      Silver: [productBracelet],
      Gold: [productBracelet],
      "Rose Gold": [productBracelet],
    },
    galleryImages: [productBracelet],
    videoUrl: "",
    modelUrl: "",
    inventoryStatus: "Made To Order",
    isFeatured: false,
    isActive: true,
  },
  {
    id: "vmora-diamond-studs",
    name: "Round Diamond Stud Earrings",
    category: "Earrings",
    subcategory: "Studs",
    metal: "Silver",
    price: 2250,
    imageUrl: productEarrings,
    description: "Timeless round diamond studs selected for crisp brilliance and clean everyday proportion.",
    collection: "Diamond Essentials",
    stoneType: "Natural Diamond",
    diamondWeight: "1.20 ctw",
    setting: "Basket",
    metalImages: {
      Silver: [productEarrings],
      Gold: [productEarrings],
      "Rose Gold": [productEarrings],
    },
    galleryImages: [productEarrings],
    videoUrl: "",
    modelUrl: "",
    inventoryStatus: "In Stock",
    isFeatured: true,
    isActive: true,
  },
];

export const formatJewelryPrice = (price: number) => {
  const { currency, rate } = getCurrencyConfig();
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format((price || 0) * rate);
};

export const calculateJewelryPrice = (
  item: JewelryItem,
  selectedMetal: string,
  selectedPurity: string,
  pricingSettings: { multipliers: Record<string, number>; safetyBuffer: number }
) => {
  if (selectedMetal === "Silver") {
    return item.pricing?.["Silver"] ?? item.price;
  }
  const comboKey = `${selectedMetal} ${selectedPurity}`;
  if (item.pricing && typeof item.pricing[comboKey] === "number") {
    return item.pricing[comboKey];
  }
  if (item.pricing && typeof item.pricing[selectedPurity] === "number") {
    return item.pricing[selectedPurity];
  }
  const finalMultiplier = (pricingSettings.multipliers[selectedPurity] || 1) * pricingSettings.safetyBuffer;
  const baseSilver = item.pricing?.["baseSilver"] ?? item.price;
  const designCost = item.pricing?.["designCost"] ?? 0;
  return (baseSilver * finalMultiplier) + designCost;
};

export const getJewelryMetalImages = (item: JewelryItem, metal: string): string[] => {
  let value = item.metalImages?.[metal as keyof NonNullable<JewelryItem["metalImages"]>];
  
  // Clean up initial value
  if (Array.isArray(value)) value = value.filter(v => typeof v === "string" && v.trim().length > 0);
  else if (typeof value === "string" && value.trim()) value = [value.trim()];
  else value = undefined;

  // Strict fallback to Silver if White Gold is missing
  if ((!value || value.length === 0) && metal === "White Gold") {
    let silverValue = item.metalImages?.["Silver"];
    if (Array.isArray(silverValue)) silverValue = silverValue.filter(v => typeof v === "string" && v.trim().length > 0);
    else if (typeof silverValue === "string" && silverValue.trim()) silverValue = [silverValue.trim()];
    else silverValue = undefined;
    
    if (silverValue && silverValue.length > 0) return silverValue as string[];
  }

  if (value && value.length > 0) return value as string[];
  return [];
};

export const getJewelryMetalImage = (item: JewelryItem, metal: string) => {
  const imgs = getJewelryMetalImages(item, metal);
  if (imgs.length > 0) return imgs[0];
  
  // If absolutely no metal image is found, gracefully fallback to the main image
  return item.imageUrl || item.galleryImages?.[0] || "";
};

/** Pick an alternate image for hover — different metal finish or gallery angle */
export const getJewelryHoverImage = (item: JewelryItem, currentMetal: string): string => {
  const mainImage = getJewelryMetalImage(item, currentMetal);
  const candidates: string[] = [];

  // Collect images from other metal finishes
  const metals = ["Silver", "Gold", "Rose Gold", "White Gold"] as const;
  for (const m of metals) {
    if (m === currentMetal) continue;
    const imgs = getJewelryMetalImages(item, m);
    for (const img of imgs) {
      if (img && img !== mainImage) candidates.push(img);
    }
  }

  // Add gallery images that aren't the main one
  if (item.galleryImages) {
    for (const img of item.galleryImages) {
      if (img && img !== mainImage && !candidates.includes(img)) candidates.push(img);
    }
  }

  // Same-metal alternate angles
  const sameMetalImgs = getJewelryMetalImages(item, currentMetal);
  for (const img of sameMetalImgs) {
    if (img && img !== mainImage && !candidates.includes(img)) candidates.push(img);
  }

  if (candidates.length === 0) return "";
  // Pick a deterministic "random" based on item id hash so it doesn't flicker
  let hash = 0;
  for (let i = 0; i < item.id.length; i++) hash = (hash * 31 + item.id.charCodeAt(i)) | 0;
  return candidates[Math.abs(hash) % candidates.length];
};
export async function loadJewelryItems() {
  try {
    const response = await fetch("/api/jewelry");
    if (!response.ok) return fallbackJewelryItems;
    const payload = await response.json();
    if (Array.isArray(payload?.items) && payload.items.length > 0) {
      return payload.items as JewelryItem[];
    }
  } catch {
    // Keep fallback catalog when the API is unavailable.
  }

  return fallbackJewelryItems;
}
