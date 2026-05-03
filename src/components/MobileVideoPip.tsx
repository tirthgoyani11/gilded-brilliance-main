import { useState } from "react";
import { Maximize2, Minimize2, Play, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

type MobileVideoPipProps = {
  src: string;
  title: string;
};

const MobileVideoPip = ({ src, title }: MobileVideoPipProps) => {
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isMobile || !src) return null;

  if (isMinimized) {
    return (
      <button
        type="button"
        aria-label="Open video preview"
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-24 right-4 z-[60] flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black text-white shadow-2xl md:hidden"
      >
        <Play className="h-5 w-5 fill-current" />
      </button>
    );
  }

  const toggleLabel = isExpanded ? "Minimize video" : "Maximize video";
  const ToggleIcon = isExpanded ? Minimize2 : Maximize2;

  return (
    <div
      className={
        isExpanded
          ? "fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm md:hidden"
          : "fixed bottom-24 right-4 z-[60] w-[46vw] min-w-[150px] max-w-[190px] md:hidden"
      }
    >
      <div
        className={
          isExpanded
            ? "relative w-full max-w-[430px] overflow-hidden rounded-[10px] border border-white/20 bg-black shadow-2xl"
            : "relative overflow-hidden rounded-[8px] border border-white/20 bg-black shadow-2xl"
        }
      >
        <video
          src={src}
          title={title}
          autoPlay
          muted
          loop
          playsInline
          className="aspect-video w-full bg-black object-contain"
        />
        <button
          type="button"
          aria-label={toggleLabel}
          onClick={() => setIsExpanded((value) => !value)}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md backdrop-blur luxury-transition hover:bg-background"
        >
          <ToggleIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Minimize video to icon"
          onClick={() => {
            setIsExpanded(false);
            setIsMinimized(true);
          }}
          className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md backdrop-blur luxury-transition hover:bg-background"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default MobileVideoPip;
