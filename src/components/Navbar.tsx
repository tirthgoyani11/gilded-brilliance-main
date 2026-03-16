import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, User, Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Shop Jewelry", href: "/jewelry" },
  { label: "Loose Diamonds", href: "/diamonds" },
  { label: "Custom Ring Builder", href: "/ring-builder" },
  { label: "Diamond Education", href: "/education" },
  { label: "Verify Certificate", href: "/certificate-verification" },
  { label: "About Brand", href: "/about" },
  { label: "Blog", href: "/blog" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="border-b border-border">
        {/* Top bar */}
        <div className="hidden md:flex items-center justify-center py-2 bg-foreground">
          <p className="text-xs tracking-[0.2em] uppercase text-background font-body">
            Complimentary Shipping on All Orders · <span className="font-accent italic">Vmora Certified Brilliance</span>
          </p>
        </div>

        {/* Main nav */}
        <nav className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="font-heading text-xl lg:text-2xl tracking-tight text-foreground">
                VMORA
              </span>
              <span className="font-accent italic text-primary text-sm ml-2 hidden sm:inline">
                Atelier
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="gold-underline text-xs uppercase tracking-[0.15em] font-body text-foreground/80 hover:text-foreground luxury-transition pb-1"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Icons */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-foreground">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-foreground">
                <Heart className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-foreground">
                <User className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-foreground relative">
                <ShoppingBag className="w-4 h-4" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                  0
                </span>
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
            transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
            className="lg:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm uppercase tracking-[0.15em] font-body text-foreground/80 hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
