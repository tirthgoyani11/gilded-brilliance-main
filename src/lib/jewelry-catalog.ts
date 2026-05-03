import type { JewelryItem } from "@/types/diamond";
import productRing from "@/assets/product-ring.jpg";
import productEarrings from "@/assets/product-earrings.jpg";
import productBracelet from "@/assets/product-bracelet.jpg";
import productNecklace from "@/assets/product-necklace.jpg";

export const jewelryCategories = ["All", "Rings", "Necklaces", "Bracelets", "Earrings"] as const;
export const jewelryMetalOptions = ["Silver", "Gold", "Rose Gold"] as const;
export const jewelryMetalSwatches: Record<(typeof jewelryMetalOptions)[number], string> = {
  Silver: "#e6e6e6",
  Gold: "#e3b868",
  "Rose Gold": "#d9a092",
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

export const formatJewelryPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price || 0);

export const getJewelryMetalImages = (item: JewelryItem, metal: string) => {
  const value = item.metalImages?.[metal as keyof NonNullable<JewelryItem["metalImages"]>];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
};

export const getJewelryMetalImage = (item: JewelryItem, metal: string) =>
  getJewelryMetalImages(item, metal)[0] || item.imageUrl || item.galleryImages?.[0] || "";

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
