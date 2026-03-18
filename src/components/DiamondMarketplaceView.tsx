import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Scale, SlidersHorizontal, X, RotateCcw, MessageCircle, Eye } from "lucide-react";
import { certificateLink, currency } from "@/lib/diamond-utils";
import { Button } from "@/components/ui/button";
import { useStore } from "@/contexts/StoreContext";

const labs = ["All", "natural", "lab-grown"];
const certs = ["All", "IGI", "GIA"];
const CARAT_SLIDER_MIN = 0;
const CARAT_SLIDER_MAX = 50;
const WHATSAPP_NUMBER = "+91XXXXXXXXXX";



const shapeIconByKey: Record<string, { normal: string; active: string }> = {
  round: {
    normal: "https://diamonds.kiradiam.com/KOnline/images/search/ShapeNew/2.png",
    active: "https://diamonds.kiradiam.com/KOnline/images/search/ShapeNew/2_Click.png",
  },
  oval: {
    normal: "https://diamonds.kiradiam.com/KOnline/images/search/ShapeNew/3.png",
    active: "https://diamonds.kiradiam.com/KOnline/images/search/ShapeNew/3_Click.png",
  },
  emerald: {
    normal: "https://diamonds.kiradiam.com/KOnline/images/search/ShapeNew/4.png",
    active: "https://diamonds.kiradiam.com/KOnline/images/search/ShapeNew/4_Click.png",
  },
  pear: {
    normal: "https://diamonds.kiradiam.com/KOnline/images/search/ShapeNew/5.png",
    active: "https://diamonds.kiradiam.com/KOnline/images/search/ShapeNew/5_Click.png",
  },
  radiant: {
    normal: "https://diamonds.kiradiam.com/KOnline/images/search/ShapeNew/6.png",
    active: "https://diamonds.kiradiam.com/KOnline/images/search/ShapeNew/6_Click.png",
  },
  marquise: {
    normal: "https://diamonds.kiradiam.com/KOnline/images/search/ShapeNew/7.png",
    active: "https://diamonds.kiradiam.com/KOnline/images/search/ShapeNew/7_Click.png",
  },
  cushion: {
    normal: "https://diamonds.kiradiam.com/KOnline/images/search/ShapeNew/8.png",
    active: "https://diamonds.kiradiam.com/KOnline/images/search/ShapeNew/8_Click.png",
  },
  "cushion lg": {
    normal: "https://diamonds.kiradiam.com/KOnline/images/search/ShapeNew/8.png",
    active: "https://diamonds.kiradiam.com/KOnline/images/search/ShapeNew/8_Click.png",
  },
  "cushion sq": {
    normal: "https://diamonds.kiradiam.com/KOnline/images/search/ShapeNew/9.png",
    active: "https://diamonds.kiradiam.com/KOnline/images/search/ShapeNew/9_Click.png",
  },
  princess: {
    normal: "https://diamonds.kiradiam.com/KOnline/images/search/ShapeNew/11.png",
    active: "https://diamonds.kiradiam.com/KOnline/images/search/ShapeNew/11_Click.png",
  },
  heart: {
    normal: "https://diamonds.kiradiam.com/KOnline/images/search/ShapeNew/13.png",
    active: "https://diamonds.kiradiam.com/KOnline/images/search/ShapeNew/13_Click.png",
  },
  other: {
    normal: "/other.png",
    active: "/other.png",
  },
};

const preferredShapeOrder = [
  "round",
  "oval",
  "emerald",
  "pear",
  "radiant",
  "marquise",
  "cushion lg",
  "cushion sq",
  "princess",
  "heart",
  "other"
];

const normalizeShapeKey = (shape: string) => shape.trim().toLowerCase().replace(/\./g, "").replace(/\s+/g, " ").replace(/_/g, "-");
const canonicalShapeKey = (shape: string) => {
  const key = normalizeShapeKey(shape);
  if (key === "cushion") return "cushion lg";
  if (key === "lg radiant") return "lg-radiant";
  if (key === "lg cmb") return "lg-cmb";
  if (key === "cushion-l g" || key === "cushion-l g") return "cushion lg";
  return key;
};

const displayShapeLabel = (shape: string) => {
  const key = canonicalShapeKey(shape);
  if (key === "cushion lg") return "CUSHION LG.";
  if (key === "cushion sq") return "CUSHION SQ.";
  if (key === "lg-radiant") return "LG-RADIANT";
  if (key === "lg-cmb") return "LG-CMB";
  return key.toUpperCase();
};

const kiraShapeIconSrc = (shape: string, active: boolean) => {
  const key = shape === "Other" ? "other" : canonicalShapeKey(shape);
  const icon = shapeIconByKey[key] || shapeIconByKey["other"];
  if (!icon) return null;
  return active ? icon.active : icon.normal;
};

const hasKiraIcon = (shape: string) => true;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/* Scales and Ordering */
const colorScale = ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
const clarityScale = ["IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "SI3", "I1", "I2", "I3"];
const cutScale = ["8X", "Ideal", "Excellent", "Very Good", "Good", "Fair", "Poor"];
const polishScale = ["8X", "Ideal", "Excellent", "Very Good", "Good", "Fair", "Poor"];
const symmetryScale = ["8X", "3X+", "3VG+", "Ideal", "Excellent", "Very Good", "Good", "Fair", "Poor"];
const fluorescenceScale = ["None", "Faint", "Medium", "Strong", "V Strong"];

const DiamondMarketplaceView = () => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(true);
  const [view, setView] = useState<"table" | "grid">("table");
  const [shape, setShape] = useState("All");
  const [color, setColor] = useState("All");
  const [clarity, setClarity] = useState("All");
  const [cut, setCut] = useState("All");
  const [polish, setPolish] = useState("All");
  const [symmetry, setSymmetry] = useState("All");
  const [fluorescence, setFluorescence] = useState("All");
  const [lab, setLab] = useState("All");
  const [cert, setCert] = useState("All");
  const [caratMin, setCaratMin] = useState(0);
  const [caratMax, setCaratMax] = useState(0);
  const [priceMax, setPriceMax] = useState(0);
  const [ratioMax, setRatioMax] = useState(0);
  const [depthMax, setDepthMax] = useState(0);
  const [tableMax, setTableMax] = useState(0);
  const [sortBy, setSortBy] = useState<"best" | "price-asc" | "price-desc" | "carat-asc" | "carat-desc">("best");
  const [page, setPage] = useState(1);
  const { diamonds, toggleCompare, isCompared } = useStore();

  const hasInitializedBounds = useRef(false);

  const rangeBounds = useMemo(() => {
    const valid = diamonds.filter((d) => Number.isFinite(d.carat) && Number.isFinite(d.price));
    if (!valid.length) {
      return {
        caratMin: 0,
        caratMax: 5,
        priceMax: 10000,
        ratioMax: 2,
        depthMax: 75,
        tableMax: 80,
      };
    }

    const caratMinValue = Math.min(...valid.map((d) => d.carat));
    const caratMaxValue = Math.max(...valid.map((d) => d.carat));
    const priceMaxValue = Math.max(...valid.map((d) => d.price));
    const ratioMaxValue = Math.max(...valid.map((d) => d.ratio));
    const depthMaxValue = Math.max(...valid.map((d) => d.depthPct));
    const tableMaxValue = Math.max(...valid.map((d) => d.tablePct));

    return {
      caratMin: Number(caratMinValue.toFixed(2)),
      caratMax: Number(caratMaxValue.toFixed(2)),
      priceMax: Math.ceil(priceMaxValue),
      ratioMax: Number(ratioMaxValue.toFixed(2)),
      depthMax: Number(depthMaxValue.toFixed(1)),
      tableMax: Number(tableMaxValue.toFixed(1)),
    };
  }, [diamonds]);

  useEffect(() => {
    if (!diamonds.length) return;

    if (!hasInitializedBounds.current) {
      setCaratMin(CARAT_SLIDER_MIN);
      setCaratMax(CARAT_SLIDER_MAX);
      setPriceMax(rangeBounds.priceMax);
      setRatioMax(rangeBounds.ratioMax);
      setDepthMax(rangeBounds.depthMax);
      setTableMax(rangeBounds.tableMax);
      hasInitializedBounds.current = true;
      return;
    }

    setPriceMax((prev) => clamp(prev, 0, rangeBounds.priceMax));
    setRatioMax((prev) => clamp(prev, 0, rangeBounds.ratioMax));
    setDepthMax((prev) => clamp(prev, 0, rangeBounds.depthMax));
    setTableMax((prev) => clamp(prev, 0, rangeBounds.tableMax));
  }, [diamonds.length, rangeBounds]);

  const resetFilters = () => {
    setShape("All");
    setColor("All");
    setClarity("All");
    setCut("All");
    setPolish("All");
    setSymmetry("All");
    setFluorescence("All");
    setLab("All");
    setCert("All");
    setCaratMin(CARAT_SLIDER_MIN);
    setCaratMax(CARAT_SLIDER_MAX);
    setPriceMax(rangeBounds.priceMax);
    setRatioMax(rangeBounds.ratioMax);
    setDepthMax(rangeBounds.depthMax);
    setTableMax(rangeBounds.tableMax);
    setSortBy("best");
    setPage(1);
  };

  const caratSliderMinValue = clamp(caratMin, CARAT_SLIDER_MIN, CARAT_SLIDER_MAX);
  const caratSliderMaxValue = clamp(caratMax, CARAT_SLIDER_MIN, CARAT_SLIDER_MAX);

  const shapes = useMemo(() => {
    const keySet = new Set(diamonds.map((d) => canonicalShapeKey(d.shape)));
    const coreShapes = preferredShapeOrder.filter((key) => key !== "other");
    const ordered = coreShapes.filter((key) => keySet.has(key));
    const custom = [...keySet].filter((key) => !coreShapes.includes(key));
    const result = ["All", ...ordered.map(displayShapeLabel)];
    if (custom.length > 0) result.push("Other");
    return result;
  }, [diamonds]);

  const colors = ["All", ...colorScale.filter((c) => diamonds.some((d) => d.color?.toUpperCase().includes(c)))];
  const clarities = ["All", ...clarityScale.filter((c) => diamonds.some((d) => d.clarity?.toUpperCase().includes(c)))];
  
  const cuts = ["All", ...cutScale.filter((c) => diamonds.some((d) => d.cut?.toUpperCase() === c.toUpperCase() || (c === "8X" && d.cut?.toUpperCase().includes("8X")))), ...new Set(diamonds.map((d) => d.cut).filter((c) => !cutScale.some(s => s.toUpperCase() === c?.toUpperCase() || (s === "8X" && c?.toUpperCase().includes("8X")))))];
  
  const polishGrades = ["All", ...polishScale.filter((c) => diamonds.some((d) => d.polish?.toUpperCase() === c.toUpperCase() || (c === "8X" && d.polish?.toUpperCase().includes("8X")))), ...new Set(diamonds.map((d) => d.polish).filter((c) => !polishScale.some(s => s.toUpperCase() === c?.toUpperCase() || (s === "8X" && c?.toUpperCase().includes("8X")))))];
  
  const symmetryGrades = ["All", ...symmetryScale.filter((c) => diamonds.some((d) => d.symmetry?.toUpperCase() === c.toUpperCase() || (c === "8X" && d.symmetry?.toUpperCase().includes("8X")) || (c === "3X+" && d.symmetry?.toUpperCase().includes("3X+")) || (c === "3VG+" && d.symmetry?.toUpperCase().includes("3VG+")))), ...new Set(diamonds.map((d) => d.symmetry).filter((c) => !symmetryScale.some(s => s.toUpperCase() === c?.toUpperCase() || (s === "8X" && c?.toUpperCase().includes("8X")) || (s === "3X+" && c?.toUpperCase().includes("3X+")) || (s === "3VG+" && c?.toUpperCase().includes("3VG+")))))];
  
  const fluorescenceGrades = ["All", ...fluorescenceScale.filter((c) => diamonds.some((d) => d.fluorescence?.toUpperCase().includes(c.toUpperCase()))), ...new Set(diamonds.map((d) => d.fluorescence).filter((c) => !fluorescenceScale.some(s => c?.toUpperCase().includes(s.toUpperCase()))))];

  const filtered = useMemo(
    () =>
      diamonds.filter((d) => {
        if (shape !== "All") {
          const coreShapes = preferredShapeOrder.filter((key) => key !== "other");
          const isOther = shape === "Other";
          const dKey = canonicalShapeKey(d.shape);
          if (isOther) {
            if (coreShapes.includes(dKey)) return false;
          } else {
            if (dKey !== canonicalShapeKey(shape)) return false;
          }
        }
        if (color !== "All" && !d.color?.toUpperCase().includes(color)) return false;
        if (clarity !== "All" && !d.clarity?.toUpperCase().includes(clarity)) return false;
        if (cut !== "All" && d.cut !== cut) return false;
        if (polish !== "All" && d.polish !== polish) return false;
        if (symmetry !== "All" && d.symmetry !== symmetry) return false;
        if (fluorescence !== "All" && d.fluorescence !== fluorescence) return false;
        if (lab !== "All" && d.type !== lab) return false;
        if (cert !== "All" && d.certLab !== cert) return false;
        const minCarat = Math.min(caratMin, caratMax);
        const maxCarat = Math.max(caratMin, caratMax);
        if (d.carat < minCarat || d.carat > maxCarat) return false;
        if (d.price > priceMax) return false;
        if (d.ratio > ratioMax) return false;
        if (d.depthPct > depthMax) return false;
        if (d.tablePct > tableMax) return false;
        return true;
      }),
    [shape, color, clarity, cut, polish, symmetry, fluorescence, lab, cert, caratMin, caratMax, priceMax, ratioMax, depthMax, tableMax],
  );

  const sorted = useMemo(() => {
    const withScore = [...filtered];
    switch (sortBy) {
      case "price-asc":
        return withScore.sort((a, b) => a.price - b.price);
      case "price-desc":
        return withScore.sort((a, b) => b.price - a.price);
      case "carat-asc":
        return withScore.sort((a, b) => a.carat - b.carat);
      case "carat-desc":
        return withScore.sort((a, b) => b.carat - a.carat);
      default:
        return withScore.sort((a, b) => a.price / a.carat - b.price / b.carat);
    }
  }, [filtered, sortBy]);

  useEffect(() => {
    setPage(1);
  }, [shape, color, clarity, cut, polish, symmetry, fluorescence, lab, cert, caratMin, caratMax, priceMax, ratioMax, depthMax, tableMax, sortBy]);

  const paginatedDiamonds = useMemo(() => {
    return sorted.slice(0, page * 50);
  }, [sorted, page]);

  const openExpertWhatsApp = () => {
    const message = encodeURIComponent(
      "Hello Vmora Team,\n\nI'm looking for a diamond with specific requirements. Please assist me in finding the perfect stone."
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${message}`, "_blank");
  };

  return (
    <div className="container mx-auto px-6 lg:px-12 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block h-px w-8 bg-primary" />
            <span className="font-accent italic text-primary text-sm">Direct Access to Certified Diamonds</span>
          </div>
          <h1 className="font-heading text-3xl lg:text-4xl">Loose Diamonds</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">
            {sorted.length.toLocaleString()} diamonds available · Instant filtering · No page reloads
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="md:hidden border-border"
            onClick={() => setMobileFiltersOpen((prev) => !prev)}
          >
            {mobileFiltersOpen ? <X className="w-4 h-4 mr-1" /> : <SlidersHorizontal className="w-4 h-4 mr-1" />}
            Filters
          </Button>
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setView("table")}
              className={`px-3 py-2 text-[11px] uppercase tracking-[0.1em] font-body luxury-transition ${
                view === "table" ? "bg-foreground text-background" : "bg-background text-foreground/60 hover:text-foreground"
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setView("grid")}
              className={`px-3 py-2 text-[11px] uppercase tracking-[0.1em] font-body luxury-transition ${
                view === "grid" ? "bg-foreground text-background" : "bg-background text-foreground/60 hover:text-foreground"
              }`}
            >
              Grid
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Filter Panel */}
      <div className={`sticky top-0 z-40 rounded-2xl border border-border bg-background/95 backdrop-blur-md p-5 mb-8 shadow-luxury ${mobileFiltersOpen ? "block" : "hidden md:block"}`}>
        {/* Shape Filter - Premium */}
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.18em] font-body font-medium text-foreground/60">Shape</span>
              <span className="text-[10px] uppercase tracking-[0.12em] font-body text-primary tabular-nums">{sorted.length} results</span>
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] font-body text-muted-foreground hover:text-foreground luxury-transition"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
          <div className="flex flex-wrap justify-start gap-2">
            {shapes.map((option) => {
              const active = shape === option;
              const iconReady = hasKiraIcon(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setShape(option)}
                  className={`group min-w-[80px] rounded-xl px-2 pb-1.5 pt-2 text-[10px] font-medium uppercase tracking-[0.06em] outline-none luxury-transition shape-filter-hover ${
                    active
                      ? "shape-filter-active text-white"
                      : "bg-secondary/60 text-foreground/60 hover:text-foreground hover:bg-secondary"
                  }`}
                  aria-pressed={active}
                >
                  <div className="mb-1.5 flex min-h-[52px] items-center justify-center">
                    {option === "All" ? (
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full border text-xs luxury-transition ${active ? "border-white/30 text-white" : "border-border text-foreground/50"}`}>
                        All
                      </div>
                    ) : (
                      (() => {
                        const iconSrc = kiraShapeIconSrc(option, active);
                        if (!iconSrc) return null;
                        return (
                          <div className="h-12 w-12 overflow-hidden luxury-transition group-hover:scale-110">
                            <img
                              src={iconSrc}
                              alt={`${option} shape`}
                              className="block h-12 w-12 object-contain"
                              loading="lazy"
                            />
                          </div>
                        );
                      })()
                    )}
                  </div>
                  {option === "All" || !iconReady ? (
                    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[9px] ${
                      active ? "border-white/30 text-white" : "border-border text-foreground/50"
                    }`}>
                      {option === "All" ? "ALL" : displayShapeLabel(option)}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Chips Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-2 mb-4">
          {/* Color visual scale */}
          <div>
            <label className="block text-[9px] uppercase tracking-[0.15em] font-body text-muted-foreground mb-1.5">Color</label>
            <select
              className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs font-body focus:border-primary focus:ring-1 focus:ring-primary/20 luxury-transition appearance-none"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            >
              {colors.map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[9px] uppercase tracking-[0.15em] font-body text-muted-foreground mb-1.5">Clarity</label>
            <select className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs font-body focus:border-primary focus:ring-1 focus:ring-primary/20 luxury-transition appearance-none" value={clarity} onChange={(e) => setClarity(e.target.value)}>
              {clarities.map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[9px] uppercase tracking-[0.15em] font-body text-muted-foreground mb-1.5">Cut</label>
            <select className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs font-body focus:border-primary focus:ring-1 focus:ring-primary/20 luxury-transition appearance-none" value={cut} onChange={(e) => setCut(e.target.value)}>
              {cuts.map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[9px] uppercase tracking-[0.15em] font-body text-muted-foreground mb-1.5">Polish</label>
            <select className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs font-body focus:border-primary focus:ring-1 focus:ring-primary/20 luxury-transition appearance-none" value={polish} onChange={(e) => setPolish(e.target.value)}>
              {polishGrades.map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[9px] uppercase tracking-[0.15em] font-body text-muted-foreground mb-1.5">Symmetry</label>
            <select className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs font-body focus:border-primary focus:ring-1 focus:ring-primary/20 luxury-transition appearance-none" value={symmetry} onChange={(e) => setSymmetry(e.target.value)}>
              {symmetryGrades.map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[9px] uppercase tracking-[0.15em] font-body text-muted-foreground mb-1.5">Fluorescence</label>
            <select className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs font-body focus:border-primary focus:ring-1 focus:ring-primary/20 luxury-transition appearance-none" value={fluorescence} onChange={(e) => setFluorescence(e.target.value)}>
              {fluorescenceGrades.map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[9px] uppercase tracking-[0.15em] font-body text-muted-foreground mb-1.5">Type</label>
            <select className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs font-body focus:border-primary focus:ring-1 focus:ring-primary/20 luxury-transition appearance-none" value={lab} onChange={(e) => setLab(e.target.value)}>
              {labs.map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[9px] uppercase tracking-[0.15em] font-body text-muted-foreground mb-1.5">Lab</label>
            <select className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs font-body focus:border-primary focus:ring-1 focus:ring-primary/20 luxury-transition appearance-none" value={cert} onChange={(e) => setCert(e.target.value)}>
              {certs.map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[9px] uppercase tracking-[0.15em] font-body text-muted-foreground mb-1.5">Sort</label>
            <select className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs font-body focus:border-primary focus:ring-1 focus:ring-primary/20 luxury-transition appearance-none" value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}>
              <option value="best">Best Value</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
              <option value="carat-asc">Carat ↑</option>
              <option value="carat-desc">Carat ↓</option>
            </select>
          </div>
        </div>

        {/* Carat & Range Sliders */}
        <div className="flex flex-col gap-5">
          {/* Carat Input Row */}
          <div className="flex items-center justify-between border-y border-border/40 py-4">
            <span className="text-base font-body text-foreground">Carats</span>
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="FROM"
                value={caratMin === CARAT_SLIDER_MIN ? "" : caratMin}
                onChange={(e) => {
                  const val = e.target.value === "" ? CARAT_SLIDER_MIN : Number(e.target.value);
                  setCaratMin(val);
                }}
                className="w-24 h-10 px-4 rounded-full border border-border bg-background text-sm text-center font-body focus:border-primary focus:ring-1 focus:ring-primary/20 luxury-transition outline-none placeholder:text-muted-foreground/70"
              />
              <input
                type="number"
                placeholder="TO"
                value={caratMax === CARAT_SLIDER_MAX ? "" : caratMax}
                onChange={(e) => {
                  const val = e.target.value === "" ? CARAT_SLIDER_MAX : Number(e.target.value);
                  setCaratMax(val);
                }}
                className="w-24 h-10 px-4 rounded-full border border-border bg-background text-sm text-center font-body focus:border-primary focus:ring-1 focus:ring-primary/20 luxury-transition outline-none placeholder:text-muted-foreground/70"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="block">
              <span className="text-[9px] uppercase tracking-[0.15em] font-body text-muted-foreground">Max Price: <span className="text-foreground font-medium">{currency(priceMax)}</span></span>
              <input type="range" min="0" max={rangeBounds.priceMax} step="100" value={priceMax} onChange={(e) => setPriceMax(Number(e.target.value))} className="w-full mt-2 accent-[#C6A87D] h-1" />
            </label>
            <label className="block">
              <span className="text-[9px] uppercase tracking-[0.15em] font-body text-muted-foreground">Ratio: <span className="text-foreground font-medium">{ratioMax.toFixed(2)}</span></span>
              <input type="range" min="0" max={rangeBounds.ratioMax} step="0.01" value={ratioMax} onChange={(e) => setRatioMax(Number(e.target.value))} className="w-full mt-2 accent-[#C6A87D] h-1" />
            </label>
            <label className="block">
              <span className="text-[9px] uppercase tracking-[0.15em] font-body text-muted-foreground">Depth: <span className="text-foreground font-medium">{depthMax.toFixed(1)}%</span></span>
              <input type="range" min="0" max={rangeBounds.depthMax} step="0.1" value={depthMax} onChange={(e) => setDepthMax(Number(e.target.value))} className="w-full mt-2 accent-[#C6A87D] h-1" />
            </label>
            <label className="block">
              <span className="text-[9px] uppercase tracking-[0.15em] font-body text-muted-foreground">Table: <span className="text-foreground font-medium">{tableMax.toFixed(1)}%</span></span>
              <input type="range" min="0" max={rangeBounds.tableMax} step="0.1" value={tableMax} onChange={(e) => setTableMax(Number(e.target.value))} className="w-full mt-2 accent-[#C6A87D] h-1" />
            </label>
          </div>
        </div>
      </div>

      {/* Results */}
      {view === "table" ? (
        <div className="overflow-auto rounded-2xl border border-border shadow-luxury">
          <table className="w-full bg-background">
            <thead>
              <tr className="border-b border-border text-left">
                {["Shape", "Carat", "Color", "Clarity", "Cut", "Price", "Certificate", ""].map((h) => (
                  <th key={h} className="px-4 py-3.5 text-[10px] uppercase tracking-[0.15em] font-body font-medium text-muted-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedDiamonds.map((d) => (
                <tr key={d.stoneId} className="border-b border-border/50 hover:bg-primary/[0.03] luxury-transition group cursor-pointer">
                  <td className="px-4 py-3.5 text-sm font-body">{d.shape}</td>
                  <td className="px-4 py-3.5 text-sm font-body tabular-nums">{d.carat.toFixed(2)}</td>
                  <td className="px-4 py-3.5 text-sm font-body">{d.color}</td>
                  <td className="px-4 py-3.5 text-sm font-body">{d.clarity}</td>
                  <td className="px-4 py-3.5 text-sm font-body">{d.cut}</td>
                  <td className="px-4 py-3.5 font-medium text-sm tabular-nums">{currency(d.price)}</td>
                  <td className="px-4 py-3.5">
                    <a href={certificateLink(d)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-body px-2.5 py-1 bg-primary/8 rounded-md text-primary hover:bg-primary/15 luxury-transition">
                      {d.certLab}
                    </a>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <Link
                        to={`/diamond/${d.stoneId}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-foreground text-background text-[10px] uppercase tracking-[0.1em] font-body hover:bg-primary hover:text-white luxury-transition"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </Link>
                      <button
                        onClick={() => toggleCompare(d)}
                        className={`inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] uppercase tracking-[0.1em] font-body luxury-transition ${
                          isCompared(d.stoneId)
                            ? "bg-primary/15 text-primary"
                            : "bg-secondary text-foreground/60 hover:text-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {isCompared(d.stoneId) ? <Check className="w-3 h-3" /> : <Scale className="w-3 h-3" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {paginatedDiamonds.map((d) => (
            <article key={d.stoneId} className="rounded-2xl border border-border bg-background shadow-luxury overflow-hidden group luxury-transition hover:shadow-luxury-hover hover:border-primary/15">
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-secondary/30">
                <img
                  src={d.imageUrl}
                  alt={d.stoneId}
                  className="w-full h-full object-cover luxury-transition-slow group-hover:scale-110"
                  loading="lazy"
                />
                {/* 360 badge */}
                {d.v360StoneId && (
                  <Link
                    to={`/diamond/${d.stoneId}`}
                    className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0A0A0A]/80 backdrop-blur-sm text-white text-[9px] uppercase tracking-[0.12em] font-body hover:bg-[#0A0A0A] luxury-transition"
                  >
                    <RotateCcw className="w-3 h-3" />
                    360°
                  </Link>
                )}
                {/* Compare */}
                <button
                  onClick={() => toggleCompare(d)}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center luxury-transition ${
                    isCompared(d.stoneId)
                      ? "bg-primary text-white"
                      : "bg-white/80 backdrop-blur-sm text-foreground/60 hover:text-foreground opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {isCompared(d.stoneId) ? <Check className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5" />}
                </button>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/50 to-transparent opacity-0 group-hover:opacity-100 luxury-transition" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 luxury-transition">
                  <Link
                    to={`/diamond/${d.stoneId}`}
                    className="block w-full py-2.5 bg-white/95 backdrop-blur-sm text-[#0A0A0A] text-[10px] uppercase tracking-[0.14em] font-body font-medium rounded-lg text-center hover:bg-white luxury-transition"
                  >
                    Select Diamond
                  </Link>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground font-body">{d.stoneId}</p>
                  <a href={certificateLink(d)} target="_blank" rel="noreferrer" className="text-[9px] uppercase tracking-wider font-body px-2 py-0.5 bg-primary/8 rounded text-primary hover:bg-primary/15 luxury-transition">
                    {d.certLab}
                  </a>
                </div>
                <h3 className="font-heading text-base mb-1.5">{d.shape} {d.carat.toFixed(2)} ct</h3>
                <p className="text-xs text-muted-foreground mb-3 font-body">
                  {d.color} · {d.clarity} · {d.cut}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-heading text-lg">{currency(d.price)}</span>
                  <Link
                    to={`/diamond/${d.stoneId}`}
                    className="text-[10px] uppercase tracking-[0.12em] font-body text-primary hover:text-primary/80 luxury-transition"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {paginatedDiamonds.length < sorted.length && (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => setPage((p) => p + 1)}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-white luxury-transition"
          >
            Load More Options ({sorted.length - paginatedDiamonds.length} remaining)
          </Button>
        </div>
      )}

      {/* Expert CTA */}
      <div className="mt-12 text-center">
        <div className="inline-flex flex-col items-center gap-3 rounded-2xl border border-border bg-secondary/30 px-8 py-6">
          <p className="font-accent italic text-primary text-sm">Need help finding the perfect diamond?</p>
          <button
            onClick={openExpertWhatsApp}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#25D366] text-white text-[11px] uppercase tracking-[0.12em] font-body font-medium hover:bg-[#20BD5A] luxury-transition"
          >
            <MessageCircle className="w-4 h-4" />
            Speak with a Diamond Expert
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiamondMarketplaceView;
