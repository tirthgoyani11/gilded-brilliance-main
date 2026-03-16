import { useMemo, useState } from "react";
import { diamondV360Src, diamondVideoOrFallback, kiraImageZoomSrc } from "@/lib/diamond-utils";
import type { Diamond } from "@/types/diamond";
import { Button } from "@/components/ui/button";

const DiamondMediaPanel = ({ diamond }: { diamond: Diamond }) => {
  const hasV360 = Boolean(diamond.v360StoneId);
  const videoSrc = diamondVideoOrFallback(diamond);
  const zoomSrc = useMemo(() => kiraImageZoomSrc(diamond), [diamond]);
  const [mediaMode, setMediaMode] = useState<"still" | "video" | "v360" | "zoom">("still");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant={mediaMode === "still" ? "luxury" : "outline"} onClick={() => setMediaMode("still")}>Still</Button>
        <Button size="sm" variant={mediaMode === "video" ? "luxury" : "outline"} onClick={() => setMediaMode("video")}>Video</Button>
        <Button size="sm" variant={mediaMode === "v360" ? "luxury" : "outline"} onClick={() => setMediaMode("v360")} disabled={!hasV360}>360 View</Button>
        <Button size="sm" variant={mediaMode === "zoom" ? "luxury" : "outline"} onClick={() => setMediaMode("zoom")}>Kira Zoom</Button>
      </div>

      <div className="rounded-[12px] overflow-hidden border border-border bg-secondary/30">
        {mediaMode === "still" ? <img src={diamond.imageUrl} alt={diamond.stoneId} className="w-full h-[420px] object-cover" /> : null}

        {mediaMode === "video" ? <video src={videoSrc} controls autoPlay muted loop className="w-full h-[420px] object-cover bg-black" /> : null}

        {mediaMode === "v360" && hasV360 ? (
          <iframe
            title={`V360 ${diamond.stoneId}`}
            src={diamondV360Src(diamond.v360StoneId ?? diamond.stoneId)}
            className="w-full h-[420px]"
            loading="lazy"
          />
        ) : null}

        {mediaMode === "zoom" ? (
          <iframe
            title={`Kira Zoom ${diamond.stoneId}`}
            src={zoomSrc}
            className="w-full h-[620px] bg-white"
            loading="lazy"
          />
        ) : null}
      </div>

      <div className="rounded-[12px] border border-border bg-background px-4 py-3 text-xs text-muted-foreground">
        Stone ID: <span className="font-medium text-foreground">{diamond.stoneId}</span>
      </div>
    </div>
  );
};

export default DiamondMediaPanel;
