import { useState } from "react";
import SiteLayout from "@/components/SiteLayout";
import { useStore } from "@/contexts/StoreContext";
import { currency, WHATSAPP_NUMBER } from "@/lib/diamond-utils";
import { MessageCircle, Copy, Check, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";



const Checkout = () => {
  const { cart, clearCart } = useStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [copied, setCopied] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const generateMessage = () => {
    const itemLines = cart
      .map((item, i) => {
        if (item.type === "diamond" && item.fullDiamond) {
          const d = item.fullDiamond;
          const lines = [
            `Item ${i + 1}: ${item.title}`,
            `═══ Diamond Details ═══`,
            `Stone ID: ${d.stoneId}`,
            `Shape: ${d.shape}`,
            `Carat: ${d.carat.toFixed(2)}`,
            `Color: ${d.color}`,
            `Clarity: ${d.clarity}`,
            `Cut: ${d.cut}`,
            `Polish: ${d.polish}`,
            `Symmetry: ${d.symmetry}`,
            `Fluorescence: ${d.fluorescence}`,
            `Measurements: ${d.measurements}`,
            `Depth: ${d.depthPct}%`,
            `Table: ${d.tablePct}%`,
            `Ratio: ${d.ratio.toFixed(2)}`,
            `Type: ${d.type}`,
            ``,
            `═══ Media & Cert ═══`,
            `Lab: ${d.certLab}`,
            `Report: ${d.certNumber}`,
            `Verify: https://${d.certLab.toLowerCase() === "igi" ? "www.igi.org/verify-your-report/?r=" : "www.gia.edu/report-check?reportno="}${d.certNumber}`,
            `Image: ${d.imageUrl}`,
            d.v360StoneId ? `360 View: https://v360.in/diamondview.aspx?cid=vd&d=${encodeURIComponent(d.v360StoneId)}` : ``,
            `Online: https://vmorajewels.com/diamond/${d.stoneId}`,
            `Price: ${currency(item.price * item.quantity)}`,
          ].filter(Boolean);
          return lines.join("\n");
        }

        return [
          `Item ${i + 1}: ${item.title}`,
          `  Type: ${item.type === "diamond" ? "Diamond" : "Jewelry"}`,
          `  Qty: ${item.quantity}`,
          `  Price: ${currency(item.price * item.quantity)}`,
        ].join("\n");
      })
      .join("\n\n────────────────\n\n");

    return [
      `Hello Vmora Team,`,
      ``,
      `I would like to inquire about the following selection:`,
      ``,
      name ? `Customer: ${name}` : "",
      phone ? `Contact: ${phone}` : "",
      ``,
      `═══ Selection Details ═══`,
      ``,
      itemLines,
      ``,
      `═══ Summary ═══`,
      `Total Items: ${cart.length}`,
      `Estimated Total: ${currency(subtotal)}`,
      ``,
      `Please assist me further.`,
      `Thank you.`,
    ]
      .filter(Boolean)
      .join("\n");
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent(generateMessage());
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${message}`, "_blank");
  };

  const copyMessage = () => {
    navigator.clipboard.writeText(generateMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (cart.length === 0) {
    return (
      <SiteLayout>
        <section className="container mx-auto px-6 lg:px-12 py-16 text-center">
          <ShoppingBag className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="font-heading text-3xl mb-3">Your Selection is Empty</h1>
          <p className="text-muted-foreground mb-6 font-body">Add diamonds or jewelry to your cart before proceeding.</p>
          <Button asChild variant="luxury">
            <Link to="/diamonds">Browse Diamonds</Link>
          </Button>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="container mx-auto px-6 lg:px-12 py-10 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block h-px w-8 bg-primary" />
            <span className="font-accent italic text-primary text-sm">Complete Your Inquiry</span>
          </div>
          <h1 className="font-heading text-3xl lg:text-4xl">Checkout</h1>
          <p className="text-sm text-muted-foreground mt-1 font-body">
            Review your selection and send a detailed inquiry to our diamond experts via WhatsApp.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Left: Items & message preview */}
          <div className="space-y-6">
            {/* Customer info */}
            <div className="rounded-2xl border border-border p-5">
              <h3 className="font-heading text-lg mb-4">Your Details (Optional)</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.15em] font-body text-muted-foreground mb-1.5">Full Name</label>
                  <input
                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-body focus:border-primary focus:ring-1 focus:ring-primary/20 luxury-transition"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.15em] font-body text-muted-foreground mb-1.5">Phone / WhatsApp</label>
                  <input
                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-body focus:border-primary focus:ring-1 focus:ring-primary/20 luxury-transition"
                    placeholder="Your number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Cart items */}
            <div className="rounded-2xl border border-border p-5">
              <h3 className="font-heading text-lg mb-4">Your Selection</h3>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                    <img src={item.imageUrl} alt={item.title} className="w-14 h-14 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium font-body truncate">{item.title}</p>
                      <p className="text-[10px] uppercase text-muted-foreground font-body">
                        {item.type} · Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium tabular-nums text-sm">{currency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Message preview */}
            <div className="rounded-2xl border border-border p-5 bg-secondary/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-lg">Message Preview</h3>
                <button
                  onClick={copyMessage}
                  className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] font-body text-muted-foreground hover:text-foreground luxury-transition"
                >
                  {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <pre className="text-xs text-muted-foreground font-body leading-relaxed whitespace-pre-wrap bg-background rounded-xl p-4 border border-border/50 max-h-64 overflow-auto">
                {generateMessage()}
              </pre>
            </div>
          </div>

          {/* Right: Summary + CTA */}
          <aside className="space-y-4 sticky top-28 h-fit">
            <div className="rounded-2xl border border-border p-6 bg-secondary/20">
              <h3 className="font-heading text-lg mb-4">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-body py-1">
                  <span className="text-muted-foreground">Items ({cart.length})</span>
                  <span className="font-medium">{currency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm font-body py-1">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-primary font-medium">Free</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-heading text-lg">Total</span>
                  <span className="font-heading text-xl">{currency(subtotal)}</span>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <button
              onClick={openWhatsApp}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-[#25D366] text-white text-sm uppercase tracking-[0.12em] font-body font-medium hover:bg-[#20BD5A] luxury-transition shadow-lg hover:shadow-xl"
            >
              <MessageCircle className="w-5 h-5" />
              Send Inquiry via WhatsApp
            </button>
            <p className="text-[10px] text-center text-muted-foreground font-body">
              Opens WhatsApp with your complete order details pre-filled
            </p>

            {/* Trust info */}
            <div className="rounded-2xl border border-border p-4">
              <div className="space-y-2.5">
                {[
                  "No online payment required",
                  "Speak directly with our experts",
                  "Get personalized pricing",
                  "Free insured worldwide shipping",
                ].map((text) => (
                  <div key={text} className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-primary flex-shrink-0" />
                    <span className="text-xs text-muted-foreground font-body">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Checkout;
