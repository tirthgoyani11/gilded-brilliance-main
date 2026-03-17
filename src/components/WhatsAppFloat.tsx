import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

const WHATSAPP_NUMBER = "+91XXXXXXXXXX"; // TODO: Replace with actual number

const WhatsAppFloat = () => {
  const [expanded, setExpanded] = useState(false);

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
        <div className="absolute bottom-16 right-0 mb-2 w-64 rounded-2xl bg-[#0A0A0A] border border-white/10 p-5 shadow-2xl">
          <button
            onClick={() => setExpanded(false)}
            className="absolute top-3 right-3 text-white/40 hover:text-white luxury-transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <p className="font-heading text-sm text-white mb-1">
            Diamond Expert
          </p>
          <p className="font-body text-[11px] text-white/50 mb-4 leading-relaxed">
            Have a question? Our expert consultants are available to help you
            find the perfect diamond.
          </p>
          <button
            onClick={openWhatsApp}
            className="w-full py-2.5 rounded-lg bg-[#25D366] text-white text-xs uppercase tracking-[0.12em] font-body font-medium hover:bg-[#20BD5A] luxury-transition flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Chat on WhatsApp
          </button>
        </div>
      )}

      {/* Float button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl luxury-transition hover:scale-105 flex items-center justify-center group relative"
        aria-label="Chat with Diamond Expert"
      >
        <MessageCircle className="w-6 h-6" />
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full animate-pulse-gold pointer-events-none" />
      </button>

      {/* Label */}
      <div className="absolute bottom-0 right-16 hidden lg:flex items-center opacity-0 pointer-events-none group-hover:opacity-100">
        <span className="text-[10px] uppercase tracking-[0.12em] font-body text-foreground/60 whitespace-nowrap bg-background/90 rounded-full px-3 py-1.5 shadow-luxury">
          Talk to Expert
        </span>
      </div>
    </div>
  );
};

export default WhatsAppFloat;
