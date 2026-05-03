import type { Diamond } from "@/types/diamond";

export const WHATSAPP_NUMBER = "+919830551558";

export const currency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

export const certificateLink = (diamond: Diamond) => {
  if (diamond.certLink) {
    return diamond.certLink;
  }

  if (diamond.certLab === "IGI") {
    const compactReport = String(diamond.certNumber ?? "")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "");
    const igiReport = compactReport.startsWith("LG") ? compactReport : `LG${compactReport}`;
    return `https://api.igi.org/viewpdf.php?r=${encodeURIComponent(igiReport)}`;
  }

  return `https://www.gia.edu/report-check?reportno=${encodeURIComponent(diamond.certNumber)}`;
};

export const diamondVideoOrFallback = (diamond: Diamond) =>
  diamond.videoUrl ?? "https://cdn.coverr.co/videos/coverr-jewelry-shine-1579/1080p.mp4";

export const diamondV360Src = (stoneId: string) =>
  `https://v360.in/diamondview.aspx?cid=vd&d=${encodeURIComponent(stoneId)}`;

export const getFallbackImage = (shapeName: string): string => {
  const norm = shapeName.toLowerCase();
  if (norm.includes("asscher")) return "/shapes/asscher-Diamond.png";
  if (norm.includes("cushion")) return "/shapes/cushion-Diamond.png";
  if (norm.includes("emerald")) return "/shapes/emerald-Diamond.png";
  if (norm.includes("heart")) return "/shapes/heart-Diamond.png";
  if (norm.includes("marquise")) return "/shapes/marquise-Diamond.png";
  if (norm.includes("oval")) return "/shapes/oval-Diamond.png";
  if (norm.includes("pear")) return "/shapes/pear-Diamond.png";
  if (norm.includes("princess")) return "/shapes/princess-Diamond.png";
  if (norm.includes("radiant")) return "/shapes/radiant-Diamond.png";
  return "/shapes/round-Diamond.png";
};
