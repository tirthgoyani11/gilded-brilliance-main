import type { Diamond } from "@/types/diamond";

export const currency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

export const certificateLink = (diamond: Diamond) => {
  if (diamond.certLink) {
    return diamond.certLink;
  }

  if (diamond.certLab === "IGI") {
    return `https://www.igi.org/verify-your-report/?r=${encodeURIComponent(diamond.certNumber)}`;
  }

  return `https://www.gia.edu/report-check?reportno=${encodeURIComponent(diamond.certNumber)}`;
};

export const diamondVideoOrFallback = (diamond: Diamond) =>
  diamond.videoUrl ?? "https://cdn.coverr.co/videos/coverr-jewelry-shine-1579/1080p.mp4";

export const diamondV360Src = (stoneId: string) =>
  `https://v360.in/diamondview.aspx?cid=vd&d=${encodeURIComponent(stoneId)}`;

export const normalizedReportNo = (diamond: Diamond) => {
  const fromCert = String(diamond.certNumber ?? "").match(/\d+/g)?.join("");
  if (fromCert && fromCert.length > 0) return fromCert;
  return String(diamond.stoneId ?? "").replace(/\s+/g, "");
};

export const kiraImageZoomSrc = (diamond: Diamond) => {
  const reportNo = normalizedReportNo(diamond);
  const stoneNo = String(diamond.stoneId ?? "").replace(/\s+/g, "");
  return `https://diamonds.kiradiam.com/KOnline/DiaSearch/ImageZoom.jsp?ReportNo=${encodeURIComponent(reportNo)}&StoneNo=${encodeURIComponent(stoneNo)}`;
};
