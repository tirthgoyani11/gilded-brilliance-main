import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, User, Menu, X, Search, MessageCircle, Scale, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/contexts/StoreContext";
import { WHATSAPP_NUMBER } from "@/lib/diamond-utils";



const navLinks = [
  { label: "Loose Diamonds", href: "/diamonds" },
  { label: "Jewelry", href: "/jewelry", hasDropdown: true },
  { label: "Custom Generator", href: "/custom-jewelry-generator" },
  { label: "Education", href: "/education" },
  { label: "About", href: "/about" },
];

const jewelryLinks = [
  { label: "All Jewelry", href: "/jewelry" },
  { label: "Rings", href: "/jewelry/rings" },
  { label: "Necklaces", href: "/jewelry/necklaces" },
  { label: "Bracelets", href: "/jewelry/bracelets" },
  { label: "Earrings", href: "/jewelry/earrings" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { cart, wishlist, compare, diamonds } = useStore();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const normalizedQuery = query.trim().toLowerCase();
  const quickSearchResults = normalizedQuery
    ? diamonds
        .filter((diamond) => {
          const haystack = [diamond.stoneId, diamond.shape, diamond.color, diamond.clarity, diamond.cut]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          return haystack.includes(normalizedQuery);
        })
        .slice(0, 6)
    : [];

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
              {navLinks.map((link) =>
                link.hasDropdown ? (
                  <div key={link.href} className="group relative">
                    <Link
                      to={link.href}
                      className="gold-underline flex items-center gap-1 pb-1 font-body text-[11px] uppercase tracking-[0.14em] text-foreground/60 luxury-transition hover:text-foreground"
                    >
                      {link.label}
                      <ChevronDown className="h-3.5 w-3.5" />
                    </Link>
                    <div className="pointer-events-none absolute left-1/2 top-7 z-50 w-48 -translate-x-1/2 translate-y-2 rounded-[10px] border border-border bg-background p-2 opacity-0 shadow-luxury transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                      {jewelryLinks.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          className="block rounded-md px-3 py-2 text-xs uppercase tracking-[0.12em] text-foreground/65 transition-colors hover:bg-secondary hover:text-foreground"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="gold-underline text-[11px] uppercase tracking-[0.14em] font-body text-foreground/60 hover:text-foreground luxury-transition pb-1"
                  >
                    {link.label}
                  </Link>
                ),
              )}
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
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground/50 hover:text-foreground w-9 h-9"
                  onClick={() => setSearchOpen((prev) => !prev)}
                  aria-label="Search diamonds"
                >
                  <Search className="w-4 h-4" />
                </Button>
                <AnimatePresence>
                  {searchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 top-11 w-[88vw] max-w-sm rounded-xl border border-border bg-background shadow-luxury z-50"
                    >
                      <div className="p-3 border-b border-border">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            autoFocus
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by stone id, shape, color..."
                            className="w-full h-9 rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
                          />
                        </div>
                      </div>

                      <div className="max-h-80 overflow-auto p-2">
                        {normalizedQuery.length === 0 ? (
                          <p className="px-2 py-2 text-xs text-muted-foreground">Type to search diamonds instantly.</p>
                        ) : quickSearchResults.length === 0 ? (
                          <p className="px-2 py-2 text-xs text-muted-foreground">No diamonds found for "{query}".</p>
                        ) : (
                          quickSearchResults.map((diamond) => (
                            <Link
                              key={diamond.stoneId}
                              to={`/diamond/${diamond.stoneId}`}
                              onClick={() => {
                                setSearchOpen(false);
                                setQuery("");
                              }}
                              className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-secondary/60 luxury-transition"
                            >
                              <div>
                                <p className="text-xs font-medium">{diamond.stoneId}</p>
                                <p className="text-[11px] text-muted-foreground">{diamond.shape} · {diamond.carat.toFixed(2)}ct · {diamond.color} · {diamond.clarity}</p>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                            </Link>
                          ))
                        )}
                      </div>

                      <div className="border-t border-border p-2">
                        <Button asChild variant="ghost" size="sm" className="w-full justify-between">
                          <Link
                            to={normalizedQuery ? `/diamonds?search=${encodeURIComponent(query.trim())}` : "/diamonds"}
                            onClick={() => setSearchOpen(false)}
                          >
                            View all matching diamonds
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
                <div key={link.href}>
                  <Link
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-sm uppercase tracking-[0.14em] font-body text-foreground/70 hover:text-foreground luxury-transition"
                  >
                    {link.label}
                  </Link>
                  {link.hasDropdown ? (
                    <div className="mt-3 grid grid-cols-2 gap-2 pl-3">
                      {jewelryLinks.slice(1).map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="rounded border border-border px-3 py-2 text-xs uppercase tracking-[0.12em] text-muted-foreground"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
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
