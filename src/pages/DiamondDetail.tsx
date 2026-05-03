import { Link, useParams } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import DiamondMediaPanel from "@/components/DiamondMediaPanel";
import { certificateLink, currency, WHATSAPP_NUMBER } from "@/lib/diamond-utils";
import { Button } from "@/components/ui/button";
import { useStore } from "@/contexts/StoreContext";
import { MessageCircle, ExternalLink, Ruler } from "lucide-react";
import { useState } from "react";



const DiamondDetail = () => {
  const { stoneId = "" } = useParams();
  const { diamonds, addToCart } = useStore();
  const diamond = diamonds.find((d) => d.stoneId === stoneId);
  const [activeTab, setActiveTab] = useState<"details" | "certificate" | "shipping">("details");

  if (!diamond) {
    return (
      <SiteLayout>
        <div className="container mx-auto px-6 lg:px-12 py-16 text-center">
          <h1 className="font-heading text-3xl mb-4">Diamond Not Found</h1>
          <p className="text-muted-foreground mb-6">The diamond you're looking for is no longer available or may have been sold.</p>
          <Button asChild variant="luxury">
            <Link to="/diamonds">Browse All Diamonds</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  const perCarat = diamond.carat > 0 ? diamond.price / diamond.carat : 0;

  const openDiamondWhatsApp = () => {
    const certUrl = certificateLink(diamond);
    const message = encodeURIComponent(
      `Hello Vmora Team,\n\n` +
        `I'm interested in the following diamond:\n\n` +
        `═══ Diamond Details ═══\n` +
        `Stone ID: ${diamond.stoneId}\n` +
        `Shape: ${diamond.shape}\n` +
        `Carat: ${diamond.carat.toFixed(2)}\n` +
        `Color: ${diamond.color}\n` +
        `Clarity: ${diamond.clarity}\n` +
        `Cut: ${diamond.cut}\n` +
        `Polish: ${diamond.polish}\n` +
        `Symmetry: ${diamond.symmetry}\n` +
        `Fluorescence: ${diamond.fluorescence}\n` +
        `Measurements: ${diamond.measurements}\n` +
        `Depth: ${diamond.depthPct}%\n` +
        `Table: ${diamond.tablePct}%\n` +
        `Ratio: ${diamond.ratio.toFixed(2)}\n` +
        `Type: ${diamond.type}\n\n` +
        `═══ Pricing ═══\n` +
        `Total Price: ${currency(diamond.price)}\n` +
        `Price/Carat: ${currency(perCarat)}\n\n` +
        `═══ Certificate ═══\n` +
        `Lab: ${diamond.certLab}\n` +
        `Report No: ${diamond.certNumber}\n` +
        `Verify: ${certUrl}\n\n` +
        `═══ Media ═══\n` +
        `Image: ${diamond.imageUrl || "Not available"}\n` +
        (diamond.v360StoneId ? `360° View: https://v360.in/diamondview.aspx?cid=vd&d=${encodeURIComponent(diamond.v360StoneId)}\n` : ``) +
        `\n═══ View Online ═══\n` +
        `https://vmorajewels.com/diamond/${diamond.stoneId}\n` +
        `\nPlease share real images/videos and assist me further. Thank you!`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${message}`, "_blank");
  };

  const tabs = [
    { key: "details" as const, label: "Details" },
    { key: "certificate" as const, label: "Certificate" },
    { key: "shipping" as const, label: "Shipping & Inquiry" },
  ];

  return (
    <SiteLayout>
      <div className="container mx-auto px-6 lg:px-12 py-10 space-y-8 pb-28 md:pb-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Media */}
          <DiamondMediaPanel diamond={diamond} />

          {/* Right: Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block h-px w-6 bg-primary" />
                <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-body">{diamond.stoneId}</span>
              </div>
              <h1 className="font-heading text-3xl lg:text-4xl mt-2">{diamond.shape} {diamond.carat.toFixed(2)} ct Diamond</h1>
              <p className="font-accent italic text-primary text-lg mt-2">Brilliance Beyond Time</p>
            </div>

            {/* Price block */}
            <div className="rounded-2xl border border-border bg-secondary/20 p-5">
              <p className="font-heading text-3xl">{currency(diamond.price)}</p>
              <p className="text-xs text-muted-foreground mt-1 font-body">Price per Carat: {currency(perCarat)}</p>
              <div className="flex flex-wrap gap-3 mt-4">
                <Button
                  variant="luxury"
                  size="lg"
                  className="flex-1"
                  onClick={() => addToCart({ id: `diamond-${diamond.stoneId}`, title: `${diamond.shape} ${diamond.carat}ct`, type: "diamond", price: diamond.price, imageUrl: diamond.imageUrl, fullDiamond: diamond })}
                >
                  Add to Cart
                </Button>
                <Button variant="luxury-outline" size="lg" asChild>
                  <Link to={`/custom-jewelry-generator?stoneId=${encodeURIComponent(diamond.stoneId)}`}>
                    Open Custom Builder
                  </Link>
                </Button>
              </div>
              <button
                onClick={openDiamondWhatsApp}
                className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#25D366] text-white text-[11px] uppercase tracking-[0.12em] font-body font-medium hover:bg-[#20BD5A] luxury-transition"
              >
                <MessageCircle className="w-4 h-4" />
                Speak with a Diamond Expert
              </button>
            </div>

            {/* Tabs */}
            <div className="rounded-2xl border border-border overflow-hidden">
              <div className="flex border-b border-border">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 px-4 py-3 text-[10px] uppercase tracking-[0.14em] font-body luxury-transition ${
                      activeTab === tab.key
                        ? "bg-foreground text-background"
                        : "bg-background text-foreground/60 hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-5">
                {/* Details tab */}
                {activeTab === "details" && (
                  <div>
                    <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                      {[
                        { label: "Carat", value: diamond.carat.toFixed(2) },
                        { label: "Shape", value: diamond.shape },
                        { label: "Color", value: diamond.color },
                        { label: "Clarity", value: diamond.clarity },
                        { label: "Cut", value: diamond.cut },
                        { label: "Polish", value: diamond.polish },
                        { label: "Symmetry", value: diamond.symmetry },
                        { label: "Fluorescence", value: diamond.fluorescence },
                        { label: "Table %", value: String(diamond.tablePct) },
                        { label: "Depth %", value: String(diamond.depthPct) },
                        { label: "Ratio", value: diamond.ratio.toFixed(2) },
                        { label: "Measurements", value: diamond.measurements },
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between py-2 border-b border-border/50">
                          <dt className="text-muted-foreground font-body">{item.label}</dt>
                          <dd className="font-medium text-foreground font-body">{item.value}</dd>
                        </div>
                      ))}
                    </dl>

                    {/* Size comparison */}
                    <div className="mt-6 p-4 rounded-xl bg-secondary/30 border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Ruler className="w-4 h-4 text-primary" />
                        <span className="text-[10px] uppercase tracking-[0.14em] font-body font-medium text-foreground/70">Size Reference</span>
                      </div>
                      <p className="text-xs text-muted-foreground font-body">
                        This {diamond.carat.toFixed(2)} carat {diamond.shape.toLowerCase()} diamond measures {diamond.measurements}
                        {diamond.carat < 0.5 && " — similar to a peppercorn"}
                        {diamond.carat >= 0.5 && diamond.carat < 1 && " — about the size of a pencil eraser"}
                        {diamond.carat >= 1 && diamond.carat < 2 && " — comparable to a standard aspirin tablet"}
                        {diamond.carat >= 2 && diamond.carat < 3 && " — approximately the width of a small blueberry"}
                        {diamond.carat >= 3 && " — exceptionally rare at this size"}.
                      </p>
                    </div>
                  </div>
                )}

                {/* Certificate tab */}
                {activeTab === "certificate" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <span className="font-heading text-sm text-primary">{diamond.certLab}</span>
                      </div>
                      <div>
                        <p className="font-heading text-base">{diamond.certLab} Certificate</p>
                        <p className="text-xs text-muted-foreground font-body">Report No. {diamond.certNumber}</p>
                      </div>
                    </div>
                    <dl className="grid grid-cols-2 gap-3 text-sm">
                      <div className="py-2 border-b border-border/50">
                        <dt className="text-muted-foreground font-body">Laboratory</dt>
                        <dd className="font-medium font-body">{diamond.certLab}</dd>
                      </div>
                      <div className="py-2 border-b border-border/50">
                        <dt className="text-muted-foreground font-body">Report Number</dt>
                        <dd className="font-medium font-body">{diamond.certNumber}</dd>
                      </div>
                      <div className="py-2 border-b border-border/50">
                        <dt className="text-muted-foreground font-body">Stone ID</dt>
                        <dd className="font-medium font-body">{diamond.stoneId}</dd>
                      </div>
                      <div className="py-2 border-b border-border/50">
                        <dt className="text-muted-foreground font-body">Type</dt>
                        <dd className="font-medium font-body capitalize">{diamond.type}</dd>
                      </div>
                    </dl>
                    <a
                      href={certificateLink(diamond)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary/10 text-primary text-[11px] uppercase tracking-[0.12em] font-body font-medium hover:bg-primary/20 luxury-transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Verify on {diamond.certLab}
                    </a>
                  </div>
                )}

                {/* Shipping tab */}
                {activeTab === "shipping" && (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {[
                        { title: "Free Insured Shipping", desc: "All orders ship with full insurance and signature confirmation, worldwide." },
                        { title: "Secure Packaging", desc: "Every diamond is securely packaged in our premium Vmora presentation case." },
                        { title: "Return Policy", desc: "We offer a 30-day return policy for all loose diamond purchases." },
                      ].map((item) => (
                        <div key={item.title} className="p-3 rounded-xl bg-secondary/30 border border-border/50">
                          <p className="font-heading text-sm mb-1">{item.title}</p>
                          <p className="text-xs text-muted-foreground font-body">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={openDiamondWhatsApp}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#25D366] text-white text-[11px] uppercase tracking-[0.12em] font-body font-medium hover:bg-[#20BD5A] luxury-transition"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Inquire About This Diamond
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky buy bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border p-3">
        <div className="container mx-auto flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-body">{diamond.shape} {diamond.carat.toFixed(2)}ct</p>
            <p className="font-heading text-lg">{currency(diamond.price)}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={openDiamondWhatsApp}
              className="w-10 h-10 rounded-lg bg-[#25D366] text-white flex items-center justify-center"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
            <Button
              size="sm"
              variant="luxury"
              onClick={() => addToCart({ id: `diamond-${diamond.stoneId}`, title: `${diamond.shape} ${diamond.carat}ct`, type: "diamond", price: diamond.price, imageUrl: diamond.imageUrl, fullDiamond: diamond })}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
};

export default DiamondDetail;
