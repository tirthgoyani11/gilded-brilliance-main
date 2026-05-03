import { useState } from "react";
import { diamondV360Src, diamondVideoOrFallback, getFallbackImage, WHATSAPP_NUMBER } from "@/lib/diamond-utils";
import type { Diamond } from "@/types/diamond";
import { RotateCcw, Play, Image as ImageIcon } from "lucide-react";

const DiamondMediaPanel = ({ diamond }: { diamond: Diamond }) => {
  const hasV360 = Boolean(diamond.v360StoneId);
  const videoSrc = diamondVideoOrFallback(diamond);
  const [isFallback, setIsFallback] = useState(!diamond.imageUrl);
  // Default to V360 if available (priority: v360 → video → still)
  const [mediaMode, setMediaMode] = useState<"still" | "video" | "v360">(
    hasV360 ? "v360" : "still"
  );

  const mediaTabs = [
    { key: "v360" as const, label: "360° View", icon: RotateCcw, disabled: !hasV360 },
    { key: "video" as const, label: "Video", icon: Play, disabled: false },
    { key: "still" as const, label: "Image", icon: ImageIcon, disabled: false },
  ];

  return (
    <div className="space-y-4">
      {/* Media tabs */}
      <div className="flex rounded-xl border border-border overflow-hidden">
        {mediaTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setMediaMode(tab.key)}
            disabled={tab.disabled}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[10px] uppercase tracking-[0.12em] font-body luxury-transition ${
              mediaMode === tab.key
                ? "bg-foreground text-background"
                : tab.disabled
                ? "bg-secondary/50 text-muted-foreground/30 cursor-not-allowed"
                : "bg-background text-foreground/60 hover:text-foreground hover:bg-secondary/50"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Media viewer */}
      <div className="rounded-2xl overflow-hidden border border-border bg-[#0A0A0A] relative group">
        {mediaMode === "still" ? (
          <>
            <img
              src={diamond.imageUrl || getFallbackImage(diamond.shape)}
              alt={diamond.stoneId}
              className={`h-[340px] w-full luxury-transition-slow group-hover:scale-105 sm:h-[440px] lg:h-[500px] ${isFallback ? "object-contain p-8 sm:p-12" : "object-contain"}`}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                const fallback = getFallbackImage(diamond.shape);
                if (!target.src.includes(fallback)) {
                  target.src = fallback;
                  setIsFallback(true);
                }
              }}
            />
            {isFallback && (
              <div className="absolute inset-x-4 bottom-4 z-10 p-4 rounded-xl border border-[#C6A87D]/30 bg-background/90 backdrop-blur-md shadow-luxury flex flex-col items-center text-center gap-2">
                <p className="text-xs font-body text-foreground">
                  This is a standard reference shape. For actual imagery and details of this specific diamond, please consult our experts.
                </p>
                <button
                  onClick={() => {
                    const message = encodeURIComponent(`Hello Vmora Team,\n\nI'm interested in viewing the real images/videos for diamond ${diamond.stoneId} (${diamond.shape} ${diamond.carat}ct).`);
                    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${message}`, "_blank");
                  }}
                  className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-medium text-white bg-[#25D366] hover:bg-[#20BD5A] px-3 py-1.5 rounded-md luxury-transition"
                >
                  Request Real Images via WhatsApp
                </button>
              </div>
            )}
          </>
        ) : null}

        {mediaMode === "video" ? (
          <video
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            className="h-[340px] w-full bg-black object-contain sm:h-[440px] lg:h-[500px]"
          />
        ) : null}

        {mediaMode === "v360" && hasV360 ? (
          <iframe
            title={`V360 ${diamond.stoneId}`}
            src={diamondV360Src(diamond.v360StoneId ?? diamond.stoneId)}
            className="h-[340px] w-full sm:h-[440px] lg:h-[500px]"
            loading="lazy"
          />
        ) : null}

        {/* Diamond glow effect on hover */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#C6A87D]/15 luxury-transition pointer-events-none" />
      </div>

      {/* Stone ID bar */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-[9px] uppercase tracking-[0.15em] font-body text-muted-foreground">Stone ID</span>
          <span className="text-xs font-medium text-foreground font-body">{diamond.stoneId}</span>
        </div>
        {hasV360 && mediaMode !== "v360" && (
          <button
            onClick={() => setMediaMode("v360")}
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] font-body text-primary hover:text-primary/80 luxury-transition"
          >
            <RotateCcw className="w-3 h-3" />
            View in 360°
          </button>
        )}
      </div>
    </div>
  );
};

export default DiamondMediaPanel;
