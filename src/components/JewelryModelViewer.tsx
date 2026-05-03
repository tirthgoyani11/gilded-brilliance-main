import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { Html, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { clearMaterialCache } from "@/lib/jewelry-render-materials";
import type { LoadedModel } from "@/types/jewelry-model";
import { JewelryEnvironment } from "./JewelryEnvironment";
import { JewelryRenderModel } from "./JewelryRenderModel";
import { ErrorBoundary } from "./ErrorBoundary";


type JewelryModelViewerProps = {
  src: string;
  title: string;
  className?: string;
};

const DEFAULT_DIAMOND_COLOR = "#ffffff";
const DEFAULT_ROUGHNESS = 0.05;

const metalOptions = [
  { label: "Silver", color: "#e6e6e6" },
  { label: "Gold", color: "#e3b868" }, // Soft, realistic 18K gold matching the photos
  { label: "Rose Gold", color: "#d9a092" },
];

const getAndroidMajorVersion = () => {
  if (typeof navigator === "undefined") return null;
  const match = navigator.userAgent.match(/Android\s(\d+)(?:\.\d+)?/i);
  return match ? Number.parseInt(match[1], 10) : null;
};

const normalizeModelUrl = (url: string) => {
  if (!url) return url;

  const driveFileMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
  if (driveFileMatch?.[1]) {
    return `https://drive.google.com/uc?export=download&id=${driveFileMatch[1]}`;
  }

  const driveIdMatch = url.match(/[?&]id=([^&]+)/i);
  if (url.includes("drive.google.com") && driveIdMatch?.[1]) {
    return `https://drive.google.com/uc?export=download&id=${driveIdMatch[1]}`;
  }

  return url;
};

const Loader = () => (
  <Html center>
    <div className="rounded-full border border-border bg-background/95 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground shadow-sm">
      Loading 360 view
    </div>
  </Html>
);

const JewelryModelViewer = ({ src, title, className = "" }: JewelryModelViewerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMetal, setSelectedMetal] = useState(metalOptions[1]);
  const [isOldAndroid, setIsOldAndroid] = useState(false);

  const modelUrl = useMemo(() => normalizeModelUrl(src), [src]);
  const model = useMemo<LoadedModel>(() => ({ meshes: [], type: "glb", url: modelUrl }), [modelUrl]);
  const dpr = isOldAndroid ? 1 : 1.5;

  useEffect(() => {
    setIsLoading(true);
    return () => {
      clearMaterialCache();
    };
  }, [src]);

  useEffect(() => {
    const androidVersion = getAndroidMajorVersion();
    if (androidVersion !== null && androidVersion < 13) {
      setIsOldAndroid(true);
    }
  }, []);

  const handleModelLoaded = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className={`relative overflow-hidden bg-white ${className}`}>
        {isLoading ? (
          <div className="pointer-events-none absolute inset-x-0 top-3 z-10 flex justify-center">
            <span className="rounded-full border border-border bg-background/95 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground shadow-sm">
              Loading 360 view
            </span>
          </div>
        ) : null}

        <ErrorBoundary>
          <Canvas
            aria-label={title}
            camera={{ position: [0, 0, 4], fov: 45 }}
            gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
            dpr={dpr}
            style={{ width: "100%", height: "100%" }}
            className="touch-none"
          >
            <color attach="background" args={["#ffffff"]} />
          <JewelryEnvironment />

          <Suspense fallback={<Loader />}>
            <JewelryRenderModel
              model={model}
              metalColor={selectedMetal.color}
              metalRoughness={DEFAULT_ROUGHNESS}
              diamondColor={DEFAULT_DIAMOND_COLOR}
              onLoad={handleModelLoaded}
            />
          </Suspense>

          <OrbitControls
            makeDefault
            autoRotate
            autoRotateSpeed={0.8}
            enablePan={false}
            minDistance={1.5}
            maxDistance={12}
          />
        </Canvas>
      </ErrorBoundary>


      <div className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-background/90 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground shadow-sm backdrop-blur">
        Drag to rotate
      </div>

      <div className="absolute inset-x-3 bottom-12 z-10 flex flex-col items-center gap-2 sm:bottom-4 sm:right-4 sm:left-auto sm:items-end">
        <div className="grid w-full max-w-[310px] grid-cols-3 gap-1 rounded-full border border-border bg-background/92 p-1 shadow-md backdrop-blur">
          {metalOptions.map((metal) => (
            <button
              key={metal.label}
              type="button"
              onClick={() => setSelectedMetal(metal)}
              className={`flex h-9 min-w-0 items-center justify-center gap-1.5 rounded-full px-2 text-[9px] font-semibold uppercase tracking-[0.04em] transition min-[390px]:text-[10px] ${
                selectedMetal.label === metal.label ? "bg-foreground text-background" : "text-foreground hover:bg-secondary"
              }`}
              aria-pressed={selectedMetal.label === metal.label}
            >
              <span className="h-3.5 w-3.5 shrink-0 rounded-full border border-border" style={{ backgroundColor: metal.color }} />
              <span className="truncate">{metal.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JewelryModelViewer;
