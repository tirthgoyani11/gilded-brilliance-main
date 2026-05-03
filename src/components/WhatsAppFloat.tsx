import { useState } from "react";
import { X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { WHATSAPP_NUMBER } from "@/lib/diamond-utils";



const WhatsAppFloat = () => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  if (location.pathname.includes('/jewelry/product/')) {
    return null;
  }

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      "Hello Vmora Team,\n\nI'm interested in learning more about your diamond collection. Please assist me."
    );
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${message}`,
      "_blank"
    );
  };

  return (
    <div className="whatsapp-float">
      {/* Expanded tooltip */}
      {expanded && (
        <div className="absolute bottom-16 right-0 mb-4 w-72 rounded-2xl bg-white border border-border/60 p-6 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.1)] diamond-glow z-50">
          <button
            onClick={() => setExpanded(false)}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground luxury-transition"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#FAFAFA] border border-border flex items-center justify-center">
              <span className="text-xl">💎</span>
            </div>
            <div>
              <p className="font-heading text-base text-foreground font-semibold leading-tight">
                Diamond Expert
              </p>
              <p className="text-[10px] uppercase font-medium text-[#25D366] tracking-wider">
                Online
              </p>
            </div>
          </div>
          <p className="font-body text-[12px] text-muted-foreground mb-5 leading-[1.6]">
            <strong>Need help choosing?</strong> Speak directly with our experts. We are available to help you find the perfect diamond or create a custom ring.
          </p>
          <button
            onClick={openWhatsApp}
            className="w-full py-3 rounded-xl bg-[#25D366] text-white text-[11px] uppercase tracking-[0.14em] font-body font-semibold hover:bg-[#20BD5A] hover:shadow-[0_4px_12px_rgba(37,211,102,0.3)] luxury-transition flex items-center justify-center gap-2.5"
          >
            <img src="/whatsapp-icon.png" alt="WhatsApp" className="w-4 h-4 object-contain" />
            Chat on WhatsApp
          </button>
        </div>
      )}

      {/* Float button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_8px_20px_rgba(37,211,102,0.3)] hover:shadow-[0_12px_30px_rgba(37,211,102,0.4)] luxury-transition hover:scale-110 flex items-center justify-center group relative z-50"
        aria-label="Chat with Diamond Expert"
      >
        <img src="/whatsapp-icon.png" alt="WhatsApp" className="w-7 h-7 object-contain" />
        {/* Pulse ring relative to whatsapp float */}
        <span className="absolute inset-0 rounded-full animate-[pulse-gold_3s_ease-in-out_infinite] opacity-50 pointer-events-none" />
      </button>

      {/* Label */}
      <div className="absolute top-1/2 -translate-y-1/2 right-16 hidden lg:flex items-center opacity-0 pointer-events-none group-hover:opacity-100 luxury-transition">
        <span className="text-[10px] uppercase tracking-[0.12em] font-body font-medium text-foreground whitespace-nowrap bg-white border border-border rounded-full px-4 py-2 shadow-sm">
          Talk to Diamond Expert
        </span>
      </div>
    </div>
  );
};

export default WhatsAppFloat;
