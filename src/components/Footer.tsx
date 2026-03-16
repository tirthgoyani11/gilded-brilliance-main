import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-heading text-lg mb-4 text-foreground">VMORA</h4>
            <p className="font-body text-xs text-muted-foreground leading-relaxed">
              Luxury diamond and silver jewelry crafted with certified brilliance.
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] font-body font-medium text-foreground mb-4">Shop</p>
            <div className="space-y-2">
              {["Shop Jewelry", "Loose Diamonds", "Custom Ring Builder", "Wishlist"].map(l => (
                <Link key={l} to="/jewelry" className="block text-xs font-body text-muted-foreground hover:text-foreground luxury-transition">{l}</Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] font-body font-medium text-foreground mb-4">Learn</p>
            <div className="space-y-2">
              {["Diamond Education", "Certification Guide", "Certificate Verification", "Blog"].map(l => (
                <Link key={l} to="/education" className="block text-xs font-body text-muted-foreground hover:text-foreground luxury-transition">{l}</Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] font-body font-medium text-foreground mb-4">Company</p>
            <div className="space-y-2">
              {["About Brand", "User Account", "Cart & Checkout", "Privacy Policy"].map(l => (
                <Link key={l} to="/about" className="block text-xs font-body text-muted-foreground hover:text-foreground luxury-transition">{l}</Link>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.15em] font-body text-muted-foreground">
            © 2026 Vmora. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
