import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, User, Menu, X, Search, MessageCircle, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/contexts/StoreContext";
import { WHATSAPP_NUMBER } from "@/lib/diamond-utils";



const navLinks = [
  { label: "Loose Diamonds", href: "/diamonds" },
  { label: "Custom Generator", href: "/custom-jewelry-generator" },
  { label: "Design Line Up", href: "/design-line-up" },
  { label: "Education", href: "/education" },
  { label: "About", href: "/about" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cart, wishlist, compare } = useStore();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const openWhatsApp = () => {
    const message = encodeURIComponent("Hello Vmora Team, I'd like to speak with a diamond expert.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${message}`, "_blank");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md">
      <div className="border-b border-border/50">
        {/* Top bar */}
        <div className="hidden md:flex items-center justify-center py-2 bg-[#0A0A0A]">
          <p className="text-[10px] tracking-[0.22em] uppercase text-white/60 font-body">
            Direct Access to Certified Diamonds · <span className="text-[#C6A87D]">No Middlemen</span> · Free Insured Shipping
          </p>
        </div>

        {/* Main nav */}
        <nav className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-foreground/70 hover:text-foreground"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="font-heading text-xl lg:text-2xl tracking-[0.02em] text-foreground">
                VMORA
              </span>
              <span className="hidden sm:block h-4 w-px bg-border mx-1" />
              <span className="font-accent italic text-primary text-xs hidden sm:inline tracking-wide">
                Crafted Brilliance
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="gold-underline text-[11px] uppercase tracking-[0.14em] font-body text-foreground/60 hover:text-foreground luxury-transition pb-1"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Icons */}
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground/50 hover:text-foreground w-9 h-9"
                onClick={openWhatsApp}
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-foreground/50 hover:text-foreground w-9 h-9">
                <Search className="w-4 h-4" />
              </Button>
              <Button asChild variant="ghost" size="icon" className="text-foreground/50 hover:text-foreground w-9 h-9">
                <Link to="/wishlist">
                  <span className="relative inline-flex">
                    <Heart className="w-4 h-4" />
                    {wishlist.length > 0 ? (
                      <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-primary text-primary-foreground text-[9px] rounded-full flex items-center justify-center font-medium">
                        {wishlist.length > 9 ? "9+" : wishlist.length}
                      </span>
                    ) : null}
                  </span>
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon" className="text-foreground/50 hover:text-foreground w-9 h-9">
                <Link to="/compare">
                  <span className="relative inline-flex">
                    <Scale className="w-4 h-4" />
                    {compare.length > 0 ? (
                      <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-primary text-primary-foreground text-[9px] rounded-full flex items-center justify-center font-medium">
                        {compare.length}
                      </span>
                    ) : null}
                  </span>
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon" className="text-foreground/50 hover:text-foreground w-9 h-9">
                <Link to="/account">
                  <User className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon" className="text-foreground/50 hover:text-foreground w-9 h-9 relative">
                <Link to="/cart">
                  <ShoppingBag className="w-4 h-4" />
                  {cartCount > 0 ? (
                    <span className="absolute top-1 right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[9px] rounded-full flex items-center justify-center font-medium">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  ) : null}
                </Link>
              </Button>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm uppercase tracking-[0.14em] font-body text-foreground/70 hover:text-foreground luxury-transition"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="luxury-divider my-4" />
              <button
                onClick={() => { openWhatsApp(); setMobileOpen(false); }}
                className="flex items-center gap-2 text-sm uppercase tracking-[0.14em] font-body text-[#25D366]"
              >
                <MessageCircle className="w-4 h-4" />
                Speak with Expert
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
