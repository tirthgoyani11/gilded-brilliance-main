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
  metal: "Silver" | "White Gold" | "Yellow Gold" | "Rose Gold";
  price: number;
  imageUrl: string;
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

export interface RingBuilderSelection {
  diamondStoneId?: string;
  setting?: "Solitaire" | "Halo" | "Pave" | "Three Stone";
  metal?: "Silver" | "White Gold" | "Yellow Gold" | "Rose Gold";
}
