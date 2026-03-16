import { Link } from "react-router-dom";

const footerGroups = {
  shop: [
    { label: "Shop Jewelry", to: "/jewelry" },
    { label: "Loose Diamonds", to: "/diamonds" },
    { label: "Custom Ring Builder", to: "/ring-builder" },
    { label: "Wishlist", to: "/wishlist" },
  ],
  learn: [
    { label: "Diamond Education", to: "/education" },
    { label: "Certification Guide", to: "/certificate-verification" },
    { label: "Certificate Verification", to: "/certificate-verification" },
    { label: "Blog", to: "/blog" },
  ],
  company: [
    { label: "About Brand", to: "/about" },
    { label: "User Account", to: "/account" },
    { label: "Cart & Checkout", to: "/checkout" },
    { label: "Privacy Policy", to: "/about" },
  ],
};

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
              {footerGroups.shop.map((l) => (
                <Link key={l.label} to={l.to} className="block text-xs font-body text-muted-foreground hover:text-foreground luxury-transition">{l.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] font-body font-medium text-foreground mb-4">Learn</p>
            <div className="space-y-2">
              {footerGroups.learn.map((l) => (
                <Link key={l.label} to={l.to} className="block text-xs font-body text-muted-foreground hover:text-foreground luxury-transition">{l.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] font-body font-medium text-foreground mb-4">Company</p>
            <div className="space-y-2">
              {footerGroups.company.map((l) => (
                <Link key={l.label} to={l.to} className="block text-xs font-body text-muted-foreground hover:text-foreground luxury-transition">{l.label}</Link>
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
