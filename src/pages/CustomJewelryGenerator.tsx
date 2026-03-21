import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Gem, MessageCircle, Sparkles } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useStore } from "@/contexts/StoreContext";
import { currency, getFallbackImage, WHATSAPP_NUMBER } from "@/lib/diamond-utils";
import type { Diamond } from "@/types/diamond";

const jewelryTypes = ["Ring", "Pendant", "Earrings", "Bracelet", "Watch"];
const metalOptions = ["White Gold", "Yellow Gold", "Rose Gold", "Silver", "Platinum"];
const styleOptions = ["Classic", "Minimal", "Vintage", "Halo", "Modern", "Statement"];

const CustomJewelryGenerator = () => {
  const { diamonds, ringBuilder } = useStore();

  const [search, setSearch] = useState("");
  const [shape, setShape] = useState("All");
  const [diamondType, setDiamondType] = useState<"All" | "natural" | "lab-grown">("All");
  const [color, setColor] = useState("All");
  const [clarity, setClarity] = useState("All");
  const [maxBudget, setMaxBudget] = useState(20000);
  const [caratMin, setCaratMin] = useState(0.3);
  const [caratMax, setCaratMax] = useState(3);

  const [selectedDiamond, setSelectedDiamond] = useState<Diamond | null>(null);
  const [jewelryType, setJewelryType] = useState("Ring");
  const [metal, setMetal] = useState("White Gold");
  const [style, setStyle] = useState("Classic");
  const [ringSize, setRingSize] = useState("US 6");
  const [engraving, setEngraving] = useState("");
  const [notes, setNotes] = useState("");

  const shapeOptions = useMemo(() => {
    const set = new Set(diamonds.map((d) => d.shape).filter(Boolean));
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [diamonds]);

  const colorOptions = useMemo(() => {
    const set = new Set(diamonds.map((d) => String(d.color || "").toUpperCase()).filter(Boolean));
    return ["All", ...Array.from(set).sort()];
  }, [diamonds]);

  const clarityOptions = useMemo(() => {
    const set = new Set(diamonds.map((d) => String(d.clarity || "").toUpperCase()).filter(Boolean));
    return ["All", ...Array.from(set).sort()];
  }, [diamonds]);

  const filteredDiamonds = useMemo(() => {
    const term = search.trim().toLowerCase();

    return diamonds
      .filter((d) => {
        if (shape !== "All" && d.shape !== shape) return false;
        if (diamondType !== "All" && d.type !== diamondType) return false;
        if (color !== "All" && String(d.color || "").toUpperCase() !== color) return false;
        if (clarity !== "All" && String(d.clarity || "").toUpperCase() !== clarity) return false;
        if (d.price > maxBudget) return false;
        if (d.carat < caratMin || d.carat > caratMax) return false;

        if (!term) return true;
        const haystack = [d.stoneId, d.shape, d.certNumber, d.color, d.clarity].join(" ").toLowerCase();
        return haystack.includes(term);
      })
      .sort((a, b) => a.price - b.price)
      .slice(0, 24);
  }, [diamonds, search, shape, diamondType, color, clarity, maxBudget, caratMin, caratMax]);

  const selectedDiamondImage = selectedDiamond?.imageUrl || (selectedDiamond ? getFallbackImage(selectedDiamond.shape) : null);

  const whatsappMessage = useMemo(() => {
    const lines = [
      "Hello Vmora Team,",
      "I want to build a custom jewelry piece.",
      "",
      "CUSTOM JEWELRY REQUIREMENTS:",
      `Jewelry Type: ${jewelryType}`,
      `Metal: ${metal}`,
      `Design Style: ${style}`,
      `Ring Size: ${ringSize}`,
      `Engraving: ${engraving || "Not specified"}`,
      `Additional Notes: ${notes || "None"}`,
      "",
      "SELECTED DIAMOND:",
    ];

    if (selectedDiamond) {
      lines.push(`Stone ID: ${selectedDiamond.stoneId}`);
      lines.push(`Type: ${selectedDiamond.type}`);
      lines.push(`Shape: ${selectedDiamond.shape}`);
      lines.push(`Carat: ${selectedDiamond.carat}`);
      lines.push(`Color: ${selectedDiamond.color}`);
      lines.push(`Clarity: ${selectedDiamond.clarity}`);
      lines.push(`Cut: ${selectedDiamond.cut}`);
      lines.push(`Lab: ${selectedDiamond.certLab}`);
      lines.push(`Certificate No: ${selectedDiamond.certNumber}`);
      lines.push(`Price: ${currency(selectedDiamond.price)}`);
      lines.push(`Image: ${selectedDiamond.imageUrl || "N/A"}`);
    } else {
      lines.push("No diamond selected yet (please suggest best matches).");
    }

    lines.push("");
    lines.push("Please assign an expert and share next steps with final quotation.");
    return lines.join("\n");
  }, [selectedDiamond, jewelryType, metal, style, ringSize, engraving, notes]);

  const sendToWhatsApp = () => {
    const encoded = encodeURIComponent(whatsappMessage);
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${encoded}`, "_blank");
  };

  useEffect(() => {
    if (!ringBuilder.diamondStoneId || selectedDiamond) return;
    const fromBuilder = diamonds.find((diamond) => diamond.stoneId === ringBuilder.diamondStoneId);
    if (fromBuilder) setSelectedDiamond(fromBuilder);
  }, [diamonds, ringBuilder.diamondStoneId, selectedDiamond]);

  return (
    <SiteLayout>
      <section className="bg-background py-10 lg:py-14 pb-28 md:pb-14">
        <div className="container mx-auto px-4 lg:px-10 space-y-8">
          <header className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-10">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Custom Jewelry Generator
            </p>
            <h1 className="font-heading text-3xl leading-tight text-foreground sm:text-4xl lg:text-6xl">
              Build Your Jewelry In Minutes
            </h1>
            <p className="mt-4 max-w-4xl text-sm text-muted-foreground sm:text-base">
              Select your ideal diamond using smart filters, choose metal and design style, preview your direction,
              and send complete requirements to a VMORA expert on WhatsApp.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-xs uppercase tracking-[0.12em] text-muted-foreground">
              <span className="rounded-full border border-border bg-background px-3 py-1">1. Select Diamond</span>
              <span className="rounded-full border border-border bg-background px-3 py-1">2. Customize Design</span>
              <span className="rounded-full border border-border bg-background px-3 py-1">3. Send To Expert</span>
            </div>
          </header>

          <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <h2 className="font-heading text-2xl">Step 1: Select Diamond</h2>
                <p className="mt-1 text-sm text-muted-foreground">Use filters to shortlist diamonds for your custom piece.</p>

                <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search stone ID, cert, shape..."
                    className="h-10 rounded border border-border bg-background px-3 text-sm lg:col-span-3"
                  />

                  <select value={shape} onChange={(e) => setShape(e.target.value)} className="h-10 rounded border border-border bg-background px-3 text-sm">
                    {shapeOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>

                  <select
                    value={diamondType}
                    onChange={(e) => setDiamondType(e.target.value as "All" | "natural" | "lab-grown")}
                    className="h-10 rounded border border-border bg-background px-3 text-sm"
                  >
                    <option value="All">All Types</option>
                    <option value="natural">Natural</option>
                    <option value="lab-grown">Lab-Grown</option>
                  </select>

                  <select value={color} onChange={(e) => setColor(e.target.value)} className="h-10 rounded border border-border bg-background px-3 text-sm">
                    {colorOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>

                  <select value={clarity} onChange={(e) => setClarity(e.target.value)} className="h-10 rounded border border-border bg-background px-3 text-sm">
                    {clarityOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>

                  <label className="flex items-center gap-2 rounded border border-border bg-background px-3 text-xs text-muted-foreground">
                    Budget
                    <input
                      type="range"
                      min={500}
                      max={50000}
                      step={100}
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(Number(e.target.value))}
                      className="w-full"
                    />
                    <span className="text-foreground">{currency(maxBudget)}</span>
                  </label>

                  <label className="flex items-center gap-2 rounded border border-border bg-background px-3 text-xs text-muted-foreground">
                    Carat Min
                    <input
                      type="number"
                      min={0.1}
                      max={10}
                      step={0.1}
                      value={caratMin}
                      onChange={(e) => setCaratMin(Number(e.target.value) || 0.1)}
                      className="w-20 rounded border border-border bg-background px-2 py-1 text-xs text-foreground"
                    />
                  </label>

                  <label className="flex items-center gap-2 rounded border border-border bg-background px-3 text-xs text-muted-foreground">
                    Carat Max
                    <input
                      type="number"
                      min={0.1}
                      max={10}
                      step={0.1}
                      value={caratMax}
                      onChange={(e) => setCaratMax(Number(e.target.value) || 0.1)}
                      className="w-20 rounded border border-border bg-background px-2 py-1 text-xs text-foreground"
                    />
                  </label>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredDiamonds.map((diamond) => {
                    const selected = selectedDiamond?.stoneId === diamond.stoneId;
                    return (
                      <article
                        key={diamond.stoneId}
                        className={`overflow-hidden rounded-xl border bg-card transition ${selected ? "border-primary shadow-md" : "border-border shadow-sm"}`}
                      >
                        <div className="aspect-[4/3] overflow-hidden bg-muted/30">
                          <img
                            src={diamond.imageUrl || getFallbackImage(diamond.shape)}
                            alt={`${diamond.shape} diamond ${diamond.stoneId}`}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="space-y-2 p-4">
                          <div className="flex items-center justify-between text-xs uppercase tracking-[0.12em] text-muted-foreground">
                            <span>{diamond.shape}</span>
                            <span>{diamond.type}</span>
                          </div>
                          <p className="font-semibold text-foreground">{diamond.stoneId}</p>
                          <p className="text-xs text-muted-foreground">
                            {diamond.carat} ct · {diamond.color} · {diamond.clarity} · {diamond.cut}
                          </p>
                          <p className="font-semibold text-foreground">{currency(diamond.price)}</p>
                          <Button
                            size="sm"
                            variant={selected ? "secondary" : "outline"}
                            className="w-full"
                            onClick={() => setSelectedDiamond(diamond)}
                          >
                            {selected ? "Selected" : "Select Diamond"}
                          </Button>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {!filteredDiamonds.length ? (
                  <p className="mt-5 rounded-xl border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
                    No diamonds match these filters right now. Try increasing budget or widening carat range.
                  </p>
                ) : null}
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <h2 className="font-heading text-2xl">Step 2: Customize Jewelry</h2>
                <p className="mt-1 text-sm text-muted-foreground">Define material, style, and personalized details.</p>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <select value={jewelryType} onChange={(e) => setJewelryType(e.target.value)} className="h-10 rounded border border-border bg-background px-3 text-sm">
                    {jewelryTypes.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>

                  <select value={metal} onChange={(e) => setMetal(e.target.value)} className="h-10 rounded border border-border bg-background px-3 text-sm">
                    {metalOptions.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>

                  <select value={style} onChange={(e) => setStyle(e.target.value)} className="h-10 rounded border border-border bg-background px-3 text-sm">
                    {styleOptions.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>

                  <input
                    value={ringSize}
                    onChange={(e) => setRingSize(e.target.value)}
                    placeholder="Ring size (if applicable)"
                    className="h-10 rounded border border-border bg-background px-3 text-sm"
                  />

                  <input
                    value={engraving}
                    onChange={(e) => setEngraving(e.target.value)}
                    placeholder="Engraving text (optional)"
                    className="h-10 rounded border border-border bg-background px-3 text-sm md:col-span-2"
                  />

                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder="Add your custom design notes, reference style, budget target, timeline, or any specific requests..."
                    className="rounded border border-border bg-background p-3 text-sm md:col-span-2"
                  />
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <h2 className="font-heading text-2xl">Live Preview</h2>
                <p className="mt-1 text-sm text-muted-foreground">Your selected diamond and custom direction.</p>

                <div className="mt-4 overflow-hidden rounded-xl border border-border bg-background">
                  {selectedDiamondImage ? (
                    <img src={selectedDiamondImage} alt="Selected diamond preview" className="h-56 w-full object-cover" />
                  ) : (
                    <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">
                      <Gem className="mr-2 h-4 w-4" />
                      Select a diamond to preview
                    </div>
                  )}
                </div>

                <div className="mt-4 space-y-2 rounded-xl border border-border bg-background p-4 text-sm">
                  <p><span className="text-muted-foreground">Jewelry:</span> {jewelryType}</p>
                  <p><span className="text-muted-foreground">Metal:</span> {metal}</p>
                  <p><span className="text-muted-foreground">Style:</span> {style}</p>
                  <p><span className="text-muted-foreground">Ring Size:</span> {ringSize}</p>
                  {selectedDiamond ? (
                    <>
                      <p><span className="text-muted-foreground">Stone ID:</span> {selectedDiamond.stoneId}</p>
                      <p><span className="text-muted-foreground">Specs:</span> {selectedDiamond.carat} ct · {selectedDiamond.color} · {selectedDiamond.clarity}</p>
                      <p><span className="text-muted-foreground">Price:</span> {currency(selectedDiamond.price)}</p>
                    </>
                  ) : (
                    <p className="text-muted-foreground">No diamond selected yet.</p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <h3 className="font-heading text-xl">Private Inquiry</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Share your selection with our expert team.
                </p>

                <Button onClick={sendToWhatsApp} className="mt-4 w-full" size="lg">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Send Inquiry
                </Button>

                <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                  <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Fast expert response</p>
                  <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Personalized guidance</p>
                  <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Discreet and direct</p>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Also Explore</p>
                <div className="mt-3 flex flex-col gap-2">
                  <Button asChild variant="outline">
                    <Link to="/diamonds">
                      Explore Loose Diamonds
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/design-line-up">View Design Line Up</Link>
                  </Button>
                </div>
              </div>
            </aside>
          </section>
        </div>
      </section>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-md p-3">
        <div className="container mx-auto flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Custom Builder</p>
            <p className="text-sm font-medium truncate">
              {selectedDiamond ? `${selectedDiamond.stoneId} · ${currency(selectedDiamond.price)}` : "Pick a diamond to continue"}
            </p>
          </div>
          <Button onClick={sendToWhatsApp} size="sm" className="shrink-0">
            <MessageCircle className="mr-1.5 h-4 w-4" />
            Send
          </Button>
        </div>
      </div>
    </SiteLayout>
  );
};

export default CustomJewelryGenerator;
