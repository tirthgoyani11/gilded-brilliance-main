import { diamondV360Src, diamondVideoOrFallback } from "@/lib/diamond-utils";
import type { Diamond } from "@/types/diamond";

const DiamondMediaPanel = ({ diamond }: { diamond: Diamond }) => {
  const hasV360 = Boolean(diamond.v360StoneId);
  const videoSrc = diamondVideoOrFallback(diamond);

  return (
    <div className="space-y-4">
      <div className="rounded-[12px] overflow-hidden border border-border bg-secondary/30">
        {hasV360 ? (
          <iframe
            title={`V360 ${diamond.stoneId}`}
            src={diamondV360Src(diamond.v360StoneId ?? diamond.stoneId)}
            className="w-full h-[380px]"
            loading="lazy"
          />
        ) : (
          <img src={diamond.imageUrl} alt={diamond.stoneId} className="w-full h-[380px] object-cover" />
        )}
      </div>

      <div className="rounded-[12px] overflow-hidden border border-border bg-black">
        <video src={videoSrc} controls autoPlay muted loop className="w-full h-[240px] object-cover" />
      </div>
    </div>
  );
};

export default DiamondMediaPanel;
