export type CertificationLab = "IGI" | "GIA";

export interface Diamond {
  stoneId: string;
  type: "natural" | "lab-grown";
  shape: string;
  carat: number;
  color: string;
  clarity: string;
  cut: string;
  polish: string;
  symmetry: string;
  fluorescence: string;
  price: number;
  ratio: number;
  depthPct: number;
  tablePct: number;
  measurements: string;
  certLab: CertificationLab;
  certNumber: string;
  certLink?: string;
  imageUrl: string;
  videoUrl?: string;
  v360StoneId?: string;
}

export interface JewelryItem {
  id: string;
  name: string;
  category: "Rings" | "Earrings" | "Necklaces" | "Bracelets";
  subcategory?: string;
  metal: "Silver" | "Gold" | "Rose Gold" | string;
  price: number;
  imageUrl: string;
  description?: string;
  collection?: string;
  stoneType?: string;
  diamondWeight?: string;
  setting?: string;
  tags?: string;
  metalImages?: {
    Silver?: string[];
    Gold?: string[];
    "Rose Gold"?: string[];
  };
  galleryImages?: string[];
  videoUrl?: string;
  modelUrl?: string;
  inventoryStatus?: "In Stock" | "Made To Order" | "Reserved" | "Sold Out";
  sortOrder?: number;
  isFeatured?: boolean;
  isActive?: boolean;
}

export interface CartItem {
  id: string;
  title: string;
  type: "diamond" | "jewelry";
  price: number;
  quantity: number;
  imageUrl: string;
  fullDiamond?: Diamond;
}
