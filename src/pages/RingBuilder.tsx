import { Canvas } from "@react-three/fiber";
import { OrbitControls, Torus, MeshDistortMaterial } from "@react-three/drei";
import SiteLayout from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useStore } from "@/contexts/StoreContext";
import { currency } from "@/lib/diamond-utils";
import { useMemo, useState } from "react";
import { Check, MessageCircle, Save } from "lucide-react";

const WHATSAPP_NUMBER = "+91XXXXXXXXXX";

const settings = [
  { key: "Solitaire" as const, desc: "A single diamond, elevated to perfection" },
  { key: "Halo" as const, desc: "Center stone encircled by brilliant pavé" },
  { key: "Pave" as const, desc: "Diamonds set along the entire band" },
  { key: "Three Stone" as const, desc: "Past, present, future — in brilliant symmetry" },
];

const metals = [
  { key: "Silver" as const, color: "#C0C0C0", label: "Sterling Silver" },
  { key: "White Gold" as const, color: "#E8E8E8", label: "14K White Gold" },
  { key: "Yellow Gold" as const, color: "#FFD700", label: "14K Yellow Gold" },
  { key: "Rose Gold" as const, color: "#E8A090", label: "14K Rose Gold" },
];

const metalToThreeColor: Record<string, string> = {
  Silver: "#C0C0C0",
  "White Gold": "#E8E8E8",
  "Yellow Gold": "#D4AF37",
  "Rose Gold": "#B76E79",
};

const settingPrices: Record<string, number> = {
  Solitaire: 200,
  Halo: 450,
  Pave: 550,
  "Three Stone": 700,
};

const metalPrices: Record<string, number> = {
  Silver: 150,
  "White Gold": 800,
  "Yellow Gold": 900,
  "Rose Gold": 850,
};

const stepLabels = ["Select Diamond", "Choose Setting", "Choose Metal", "Preview"];

const RingBuilder = () => {
  const { ringBuilder, setRingBuilder, diamonds, addToCart } = useStore();
  const [saved, setSaved] = useState(false);

  const selectedDiamond = useMemo(
    () => diamonds.find((d) => d.stoneId === ringBuilder.diamondStoneId),
    [diamonds, ringBuilder.diamondStoneId]
  );

  const currentStep = useMemo(() => {
    if (!ringBuilder.diamondStoneId) return 0;
    if (!ringBuilder.setting) return 1;
    if (!ringBuilder.metal) return 2;
    return 3;
  }, [ringBuilder]);

  const totalPrice = useMemo(() => {
    let price = selectedDiamond?.price ?? 0;
    if (ringBuilder.setting) price += settingPrices[ringBuilder.setting] ?? 0;
    if (ringBuilder.metal) price += metalPrices[ringBuilder.metal] ?? 0;
    return price;
  }, [selectedDiamond, ringBuilder.setting, ringBuilder.metal]);

  const threeColor = metalToThreeColor[ringBuilder.metal ?? "Silver"] ?? "#c6a87d";

  const handleSaveDesign = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const openRingWhatsApp = () => {
    const message = encodeURIComponent(
      `Hello Vmora Team,\n\nI've designed a custom ring and would like to inquire:\n\n` +
        `Ring Design:\n` +
        `- Diamond: ${selectedDiamond ? `${selectedDiamond.shape} ${selectedDiamond.carat.toFixed(2)}ct (${selectedDiamond.stoneId})` : "Not selected"}\n` +
        `- Setting: ${ringBuilder.setting ?? "Not selected"}\n` +
        `- Metal: ${ringBuilder.metal ?? "Not selected"}\n` +
        `- Estimated Total: ${currency(totalPrice)}\n\n` +
        `Please assist me further.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${message}`, "_blank");
  };

  return (
    <SiteLayout>
      <section className="container mx-auto px-6 lg:px-12 py-10 space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block h-px w-8 bg-primary" />
            <span className="font-accent italic text-primary text-sm">Design Your Dream</span>
          </div>
          <h1 className="font-heading text-3xl lg:text-4xl">Custom Ring Builder</h1>
        </div>

        {/* Step Progress */}
        <div className="flex items-center gap-0 mb-2">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex items-center flex-1">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-body font-medium luxury-transition ${
                  i <= currentStep
                    ? "bg-foreground text-background"
                    : "bg-secondary border border-border text-muted-foreground"
                }`}>
                  {i < currentStep ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className={`hidden sm:block text-[10px] uppercase tracking-[0.12em] font-body luxury-transition ${
                  i <= currentStep ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {label}
                </span>
              </div>
              {i < stepLabels.length - 1 && (
                <div className={`flex-1 h-px mx-3 luxury-transition ${
                  i < currentStep ? "bg-foreground" : "bg-border"
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Steps */}
          <div className="space-y-6">
            {/* Step 1: Diamond */}
            <div className="rounded-2xl border border-border p-5 luxury-transition hover:border-primary/15">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-foreground text-background text-[10px] flex items-center justify-center font-body font-medium">1</span>
                <h2 className="font-heading text-lg">Select Diamond</h2>
              </div>
              <select
                className="w-full h-11 px-3 rounded-xl border border-border bg-background text-sm font-body focus:border-primary focus:ring-1 focus:ring-primary/20 luxury-transition appearance-none"
                value={ringBuilder.diamondStoneId ?? ""}
                onChange={(e) => setRingBuilder({ diamondStoneId: e.target.value })}
              >
                <option value="">Choose a diamond from inventory</option>
                {diamonds.map((d) => (
                  <option key={d.stoneId} value={d.stoneId}>
                    {d.stoneId} — {d.shape} {d.carat.toFixed(2)}ct · {d.color}/{d.clarity} · {currency(d.price)}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Setting */}
            <div className="rounded-2xl border border-border p-5 luxury-transition hover:border-primary/15">
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-6 h-6 rounded-full text-[10px] flex items-center justify-center font-body font-medium ${currentStep >= 1 ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"}`}>2</span>
                <h2 className="font-heading text-lg">Choose Setting</h2>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {settings.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setRingBuilder({ setting: s.key })}
                    className={`p-3 rounded-xl border text-left luxury-transition ${
                      ringBuilder.setting === s.key
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <p className="font-heading text-sm mb-0.5">{s.key}</p>
                    <p className="text-[10px] text-muted-foreground font-body">{s.desc}</p>
                    <p className="text-[10px] text-primary font-body mt-1.5">+{currency(settingPrices[s.key])}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Metal */}
            <div className="rounded-2xl border border-border p-5 luxury-transition hover:border-primary/15">
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-6 h-6 rounded-full text-[10px] flex items-center justify-center font-body font-medium ${currentStep >= 2 ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"}`}>3</span>
                <h2 className="font-heading text-lg">Choose Metal</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {metals.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setRingBuilder({ metal: m.key })}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border luxury-transition ${
                      ringBuilder.metal === m.key
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full border border-border/50"
                      style={{ background: m.color }}
                    />
                    <div className="text-left">
                      <p className="text-xs font-body font-medium">{m.label}</p>
                      <p className="text-[10px] text-primary font-body">+{currency(metalPrices[m.key])}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Summary */}
            <div className="rounded-2xl border border-border bg-secondary/20 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-6 h-6 rounded-full text-[10px] flex items-center justify-center font-body font-medium ${currentStep >= 3 ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"}`}>4</span>
                <h2 className="font-heading text-lg">Design Summary</h2>
              </div>
              <dl className="space-y-2 text-sm font-body mb-4">
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <dt className="text-muted-foreground">Diamond</dt>
                  <dd className="font-medium">{selectedDiamond ? `${selectedDiamond.shape} ${selectedDiamond.carat.toFixed(2)}ct` : "Not selected"}</dd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <dt className="text-muted-foreground">Setting</dt>
                  <dd className="font-medium">{ringBuilder.setting ?? "Not selected"}</dd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <dt className="text-muted-foreground">Metal</dt>
                  <dd className="font-medium">{ringBuilder.metal ?? "Not selected"}</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="font-heading text-base">Estimated Total</dt>
                  <dd className="font-heading text-xl">{currency(totalPrice)}</dd>
                </div>
              </dl>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="luxury"
                  className="flex-1"
                  disabled={currentStep < 3}
                  onClick={() => {
                    if (selectedDiamond) {
                      addToCart({
                        id: `ring-${selectedDiamond.stoneId}-${ringBuilder.setting}-${ringBuilder.metal}`,
                        title: `Custom ${ringBuilder.setting} Ring — ${selectedDiamond.shape} ${selectedDiamond.carat}ct`,
                        type: "diamond",
                        price: totalPrice,
                        imageUrl: selectedDiamond.imageUrl,
                      });
                    }
                  }}
                >
                  Add to Cart
                </Button>
                <button
                  onClick={openRingWhatsApp}
                  disabled={currentStep < 3}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366] text-white text-[11px] uppercase tracking-[0.12em] font-body font-medium hover:bg-[#20BD5A] luxury-transition disabled:opacity-40"
                >
                  <MessageCircle className="w-4 h-4" />
                  Inquire
                </button>
                <button
                  onClick={handleSaveDesign}
                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-border text-[11px] uppercase tracking-[0.12em] font-body text-foreground/60 hover:text-foreground hover:border-foreground/20 luxury-transition"
                >
                  {saved ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Save className="w-3.5 h-3.5" />}
                  {saved ? "Saved!" : "Save"}
                </button>
              </div>
            </div>
          </div>

          {/* Right: 3D Preview */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-border overflow-hidden bg-[#0A0A0A] h-[500px] sticky top-28">
              <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.6} />
                <pointLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
                <pointLight position={[-5, -3, 3]} intensity={0.4} color="#C6A87D" />
                <Torus args={[1.25, 0.28, 32, 96]}>
                  <MeshDistortMaterial
                    color={threeColor}
                    roughness={0.15}
                    metalness={0.95}
                    distort={0.12}
                    speed={0.8}
                  />
                </Torus>
                <OrbitControls enablePan={false} autoRotate autoRotateSpeed={1.5} />
              </Canvas>
            </div>
            <p className="text-center text-[10px] uppercase tracking-[0.15em] font-body text-muted-foreground">
              Interactive 3D Preview · Drag to rotate
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default RingBuilder;
