import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/diamond-utils";



const footerGroups = {
  shop: [
    { label: "Shop Jewelry", to: "/jewelry" },
    { label: "Loose Diamonds", to: "/diamonds" },
    { label: "Custom Ring Builder", to: "/custom-jewelry-generator" },
    { label: "Wishlist", to: "/wishlist" },
  ],
  learn: [
    { label: "Diamond Education", to: "/education" },
    { label: "Certification Guide", to: "/certificate-verification" },
    { label: "Certificate Verification", to: "/certificate-verification" },
    { label: "Blog", to: "/blog" },
  ],
  company: [
    { label: "About Vmora", to: "/about" },
    { label: "My Account", to: "/account" },
    { label: "Privacy Policy", to: "/about" },
  ],
};

const Footer = () => {
  const openWhatsApp = () => {
    const message = encodeURIComponent("Hello Vmora Team, I'd like to learn more about your diamond collection.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${message}`, "_blank");
  };

  return (
    <footer className="bg-[#0A0A0A] border-t border-white/5">
      <div className="container mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-2">
            <h4 className="font-heading text-2xl mb-3 text-white">VMORA</h4>
            <p className="font-accent italic text-[#C6A87D] text-sm mb-4">Crafted Brilliance</p>
            <p className="font-body text-xs text-white/40 leading-relaxed mb-6 max-w-xs">
              Direct access to certified diamonds and fine jewelry. No middlemen, no markups — just exceptional quality delivered to your doorstep.
            </p>
            <button
              onClick={openWhatsApp}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366] text-white text-[11px] uppercase tracking-[0.12em] font-body font-medium hover:bg-[#20BD5A] luxury-transition"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Speak with Expert
            </button>
          </div>

          {/* Shop */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] font-body font-medium text-white/60 mb-5">Shop</p>
            <div className="space-y-3">
              {footerGroups.shop.map((l) => (
                <Link key={l.label} to={l.to} className="block text-xs font-body text-white/35 hover:text-[#C6A87D] luxury-transition">{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Learn */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] font-body font-medium text-white/60 mb-5">Learn</p>
            <div className="space-y-3">
              {footerGroups.learn.map((l) => (
                <Link key={l.label} to={l.to} className="block text-xs font-body text-white/35 hover:text-[#C6A87D] luxury-transition">{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] font-body font-medium text-white/60 mb-5">Company</p>
            <div className="space-y-3">
              {footerGroups.company.map((l) => (
                <Link key={l.label} to={l.to} className="block text-xs font-body text-white/35 hover:text-[#C6A87D] luxury-transition">{l.label}</Link>
              ))}
            </div>
          </div>
        </div>

        {/* Brand positioning */}
        <div className="border-t border-white/5 pt-8 mb-8">
          <div className="flex flex-wrap justify-center gap-8 text-[10px] uppercase tracking-[0.2em] font-body text-white/20">
            <span>From Source to You</span>
            <span className="hidden sm:inline">·</span>
            <span>Transparency in Every Carat</span>
            <span className="hidden sm:inline">·</span>
            <span>Direct Access to Brilliance</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.18em] font-body text-white/15">
            © 2026 Vmora. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
