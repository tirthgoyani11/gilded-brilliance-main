import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Scale, SlidersHorizontal, X } from "lucide-react";
import { certificateLink, currency } from "@/lib/diamond-utils";
import { Button } from "@/components/ui/button";
import { useStore } from "@/contexts/StoreContext";
const labs = ["All", "natural", "lab-grown"];
const certs = ["All", "IGI", "GIA"];
const preferredShapeOrder = ["Round", "Oval", "Emerald", "Pear", "Radiant", "Marquise", "Cushion LG", "Cushion SQ", "Princess", "Heart", "Asscher"];

const shapeIndexByName: Record<string, number> = {
  round: 2,
  oval: 3,
  emerald: 4,
  pear: 5,
  radiant: 6,
  marquise: 7,
  cushion: 8,
  "cushion lg": 8,
  "cushion sq": 9,
  princess: 10,
  heart: 11,
  asscher: 12,
};

const normalizeShapeKey = (shape: string) => shape.trim().toLowerCase().replace(/\./g, "").replace(/\s+/g, " ");
const displayShapeLabel = (shape: string) => {
  const key = normalizeShapeKey(shape);
  if (key === "cushion lg") return "CUSHION LG.";
  if (key === "cushion sq") return "CUSHION SQ.";
  return shape.toUpperCase();
};

const kiraShapeIconSrc = (shape: string, active: boolean) => {
  const key = normalizeShapeKey(shape);
  const index = shapeIndexByName[key] ?? 2;
  const suffix = active ? "_Click" : "";
  return `https://diamonds.kiradiam.com/KOnline/images/search/ShapeNew/${index}${suffix}.png`;
};

const DiamondMarketplaceView = () => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
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
  const [caratMin, setCaratMin] = useState(0.5);
  const [caratMax, setCaratMax] = useState(3.5);
  const [priceMax, setPriceMax] = useState(10000);
  const [ratioMax, setRatioMax] = useState(2);
  const [depthMax, setDepthMax] = useState(72);
  const [tableMax, setTableMax] = useState(72);
  const [sortBy, setSortBy] = useState<"best" | "price-asc" | "price-desc" | "carat-asc" | "carat-desc">("best");
  const { diamonds, toggleCompare, isCompared } = useStore();

  const shapes = useMemo(() => {
    const fromData = [...new Set(diamonds.map((d) => d.shape))];
    const ordered = preferredShapeOrder.filter((name) => fromData.some((s) => normalizeShapeKey(s) === normalizeShapeKey(name)));
    const custom = fromData.filter((name) => !preferredShapeOrder.some((p) => normalizeShapeKey(p) === normalizeShapeKey(name)));
    return ["All", ...ordered, ...custom];
  }, [diamonds]);
  const colors = ["All", ...new Set(diamonds.map((d) => d.color))];
  const clarities = ["All", ...new Set(diamonds.map((d) => d.clarity))];
  const cuts = ["All", ...new Set(diamonds.map((d) => d.cut))];
  const polishGrades = ["All", ...new Set(diamonds.map((d) => d.polish))];
  const symmetryGrades = ["All", ...new Set(diamonds.map((d) => d.symmetry))];
  const fluorescenceGrades = ["All", ...new Set(diamonds.map((d) => d.fluorescence))];

  const filtered = useMemo(
    () =>
      diamonds.filter((d) => {
        if (shape !== "All" && d.shape !== shape) return false;
        if (color !== "All" && d.color !== color) return false;
        if (clarity !== "All" && d.clarity !== clarity) return false;
        if (cut !== "All" && d.cut !== cut) return false;
        if (polish !== "All" && d.polish !== polish) return false;
        if (symmetry !== "All" && d.symmetry !== symmetry) return false;
        if (fluorescence !== "All" && d.fluorescence !== fluorescence) return false;
        if (lab !== "All" && d.type !== lab) return false;
        if (cert !== "All" && d.certLab !== cert) return false;
        if (d.carat < caratMin || d.carat > caratMax) return false;
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

  return (
    <div className="container mx-auto px-6 lg:px-12 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-accent italic text-primary">Professional Diamond Search</p>
          <h1 className="font-heading text-3xl lg:text-4xl">Loose Diamonds</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="md:hidden" onClick={() => setMobileFiltersOpen((prev) => !prev)}>
            {mobileFiltersOpen ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />} Filters
          </Button>
          <Button variant={view === "table" ? "luxury" : "outline"} onClick={() => setView("table")}>Table View</Button>
          <Button variant={view === "grid" ? "luxury" : "outline"} onClick={() => setView("grid")}>Grid View</Button>
        </div>
      </div>

      <div className={`rounded-[12px] border border-border bg-secondary/40 p-5 mb-8 ${mobileFiltersOpen ? "block" : "hidden md:block"}`}>
        <div className="flex items-center gap-2 mb-4 text-sm uppercase tracking-[0.1em]">
          <SlidersHorizontal className="w-4 h-4 text-primary" /> Filters
        </div>

        <div className="mb-6 rounded-[16px] border border-[#8fd5ef] bg-white p-4">
          <div className="mb-3 flex items-center gap-3 text-[#1f4f83]">
            <span className="h-px flex-1 bg-[#8fd5ef]" />
            <span className="text-xs uppercase tracking-[0.22em]">Shape</span>
            <span className="h-px flex-1 bg-[#8fd5ef]" />
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {shapes.map((option) => {
              const active = shape === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setShape(option)}
                  className={`group min-w-[94px] bg-transparent px-2 pb-1 pt-2 text-[12px] font-semibold uppercase tracking-[0.04em] transition ${
                    active ? "text-[#ffffff]" : "text-[#4e6074] hover:text-[#1f8ab7]"
                  }`}
                  aria-pressed={active}
                >
                  <div className="mb-1 flex justify-center">
                    {option === "All" ? (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-current text-xs">All</div>
                    ) : (
                      <img
                        src={kiraShapeIconSrc(option, active)}
                        alt={`${option} shape`}
                        className="h-14 w-14 object-contain"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <span
                    className={`inline-block rounded-full border px-3 py-1 ${
                      active
                        ? "border-[#3048a4] bg-[#3048a4] text-white"
                        : "border-[#7ed7ff] bg-transparent text-[#4e6074]"
                    }`}
                  >
                    {option === "All" ? "ALL" : displayShapeLabel(option)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
          <select className="h-10 px-3 rounded border" value={color} onChange={(e) => setColor(e.target.value)}>{colors.map((v) => <option key={v}>{v}</option>)}</select>
          <select className="h-10 px-3 rounded border" value={clarity} onChange={(e) => setClarity(e.target.value)}>{clarities.map((v) => <option key={v}>{v}</option>)}</select>
          <select className="h-10 px-3 rounded border" value={cut} onChange={(e) => setCut(e.target.value)}>{cuts.map((v) => <option key={v}>{v}</option>)}</select>
          <select className="h-10 px-3 rounded border" value={polish} onChange={(e) => setPolish(e.target.value)}>{polishGrades.map((v) => <option key={v}>{v}</option>)}</select>
          <select className="h-10 px-3 rounded border" value={symmetry} onChange={(e) => setSymmetry(e.target.value)}>{symmetryGrades.map((v) => <option key={v}>{v}</option>)}</select>
          <select className="h-10 px-3 rounded border" value={fluorescence} onChange={(e) => setFluorescence(e.target.value)}>{fluorescenceGrades.map((v) => <option key={v}>{v}</option>)}</select>
          <select className="h-10 px-3 rounded border" value={lab} onChange={(e) => setLab(e.target.value)}>{labs.map((v) => <option key={v}>{v}</option>)}</select>
          <select className="h-10 px-3 rounded border" value={cert} onChange={(e) => setCert(e.target.value)}>{certs.map((v) => <option key={v}>{v}</option>)}</select>
          <select className="h-10 px-3 rounded border" value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}>
            <option value="best">Best Value</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="carat-asc">Carat: Low to High</option>
            <option value="carat-desc">Carat: High to Low</option>
          </select>
          <input className="h-10 px-3 rounded border" type="number" value={priceMax} min={1000} step={500} onChange={(e) => setPriceMax(Number(e.target.value))} placeholder="Max Price" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          <label className="text-sm text-muted-foreground">Carat Min: {caratMin.toFixed(2)}
            <input type="range" min="0.5" max="3.5" step="0.01" value={caratMin} onChange={(e) => setCaratMin(Number(e.target.value))} className="w-full" />
          </label>
          <label className="text-sm text-muted-foreground">Carat Max: {caratMax.toFixed(2)}
            <input type="range" min="0.5" max="3.5" step="0.01" value={caratMax} onChange={(e) => setCaratMax(Number(e.target.value))} className="w-full" />
          </label>
          <label className="text-sm text-muted-foreground">Ratio Max: {ratioMax.toFixed(2)}
            <input type="range" min="1" max="2" step="0.01" value={ratioMax} onChange={(e) => setRatioMax(Number(e.target.value))} className="w-full" />
          </label>
          <label className="text-sm text-muted-foreground">Depth Max: {depthMax.toFixed(1)}%
            <input type="range" min="55" max="75" step="0.1" value={depthMax} onChange={(e) => setDepthMax(Number(e.target.value))} className="w-full" />
          </label>
          <label className="text-sm text-muted-foreground">Table Max: {tableMax.toFixed(1)}%
            <input type="range" min="50" max="80" step="0.1" value={tableMax} onChange={(e) => setTableMax(Number(e.target.value))} className="w-full" />
          </label>
        </div>
      </div>

      {view === "table" ? (
        <div className="overflow-auto rounded-[12px] border border-border">
          <table className="w-full bg-background">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-[0.15em] text-muted-foreground">
                <th className="p-3">Shape</th>
                <th className="p-3">Carat</th>
                <th className="p-3">Color</th>
                <th className="p-3">Clarity</th>
                <th className="p-3">Cut</th>
                <th className="p-3">Price</th>
                <th className="p-3">Certificate</th>
                <th className="p-3">View</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((d) => (
                <tr key={d.stoneId} className="border-b border-border hover:bg-secondary/40">
                  <td className="p-3">{d.shape}</td>
                  <td className="p-3">{d.carat.toFixed(2)}</td>
                  <td className="p-3">{d.color}</td>
                  <td className="p-3">{d.clarity}</td>
                  <td className="p-3">{d.cut}</td>
                  <td className="p-3 font-medium">{currency(d.price)}</td>
                  <td className="p-3"><a href={certificateLink(d)} target="_blank" rel="noreferrer" className="text-primary underline">{d.certLab}</a></td>
                  <td className="p-3 flex items-center gap-2">
                    <Link to={`/diamond/${d.stoneId}`} className="text-primary underline">Open</Link>
                    <Button size="sm" variant={isCompared(d.stoneId) ? "secondary" : "outline"} onClick={() => toggleCompare(d)}>
                      {isCompared(d.stoneId) ? <Check className="w-3 h-3" /> : <Scale className="w-3 h-3" />} Compare
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sorted.map((d) => (
            <article key={d.stoneId} className="rounded-[12px] border border-border bg-background shadow-luxury overflow-hidden group">
              <img src={d.imageUrl} alt={d.stoneId} className="w-full aspect-[4/3] object-cover" />
              <div className="p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-1">{d.stoneId}</p>
                <h3 className="font-heading text-lg mb-2">{d.shape} {d.carat.toFixed(2)}ct</h3>
                <p className="text-sm text-muted-foreground mb-3">{d.color} • {d.clarity} • {d.cut}</p>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{currency(d.price)}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant={isCompared(d.stoneId) ? "secondary" : "outline"} onClick={() => toggleCompare(d)}>Compare</Button>
                    <Button asChild size="sm" variant="luxury"><Link to={`/diamond/${d.stoneId}`}>View</Link></Button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiamondMarketplaceView;
