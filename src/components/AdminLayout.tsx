import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Gem, LayoutDashboard, Upload, List, History, FileText, LogOut, Loader2, ShieldCheck } from "lucide-react";
import { getAdminToken, setAdminToken, clearAdminToken, adminFetch } from "@/lib/admin";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Manage Listings", href: "/admin/listings", icon: List },
  { label: "Jewelry Listings", href: "/admin/jewelry", icon: Gem },
  { label: "Excel Import", href: "/admin/import", icon: Upload },
  { label: "Import History", href: "/admin/history", icon: History },
  { label: "Content Manager", href: "/admin/content", icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string>("");
  const [tokenInput, setTokenInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  const verifyToken = async (currentToken: string) => {
    setIsVerifying(true);
    setError("");
    try {
      const res = await fetch("/api/admin-stats", {
        headers: { "x-admin-token": currentToken }
      });
      if (res.ok) {
        setIsAuthenticated(true);
        setToken(currentToken);
        setAdminToken(currentToken);
      } else {
        setIsAuthenticated(false);
        clearAdminToken();
        if (currentToken) setError("Invalid admin token provided.");
      }
    } catch {
      setIsAuthenticated(false);
      setError("Network error while verifying token.");
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    const saved = getAdminToken();
    if (saved) {
      void verifyToken(saved);
    } else {
      setIsVerifying(false);
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    void verifyToken(tokenInput.trim());
  };

  const handleLogout = () => {
    clearAdminToken();
    setToken("");
    setIsAuthenticated(false);
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
         <Loader2 className="w-8 h-8 animate-spin text-primary" />
         <p className="text-sm uppercase tracking-[0.12em] text-muted-foreground">Verifying access</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
        {/* Luxury background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(198,168,125,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.4),transparent_50%)]" />
        
        <div className="w-full max-w-md relative z-10">
          <Link to="/" className="block text-center mb-8">
            <h1 className="font-heading text-4xl">VMORA<span className="font-accent italic text-primary text-3xl ml-2">Admin</span></h1>
          </Link>

          <form onSubmit={handleLogin} className="glass-card p-10 rounded-[16px] shadow-luxury space-y-6">
            <div className="text-center space-y-2">
              <ShieldCheck className="w-8 h-8 mx-auto text-primary mb-2" />
              <h2 className="font-heading text-2xl">Secure Access</h2>
              <p className="text-sm text-muted-foreground">Authorized personnel only.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.12em] text-muted-foreground ml-1">Admin Token</label>
                <input
                  type="password"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="Enter token"
                  className="w-full h-12 bg-background/50 border border-border/50 rounded-lg px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary luxury-transition"
                  autoFocus
                />
              </div>
              
              {error && <p className="text-xs text-destructive text-center">{error}</p>}
              
              <Button type="submit" variant="luxury" className="w-full h-12">
                Authenticate
              </Button>
            </div>
            
            <p className="text-xs text-center text-muted-foreground/60">
              Default for dev: vmora-admin-2026
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--secondary)/0.3)] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r border-border flex flex-col fixed inset-y-0 z-20">
        <div className="h-20 flex items-center px-6 border-b border-border">
          <Link to="/">
            <h1 className="font-heading text-2xl tracking-tight">VMORA<span className="font-accent italic text-primary ml-1 text-xl hover:text-primary luxury-transition">Admin</span></h1>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Topbar */}
        <header className="h-20 bg-background border-b border-border flex items-center justify-between px-8 sticky top-0 z-10">
           <h2 className="font-heading text-xl">
             {navItems.find(item => item.href === location.pathname)?.label || "Administration"}
           </h2>
           <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-green-500" />
               <span className="text-xs text-muted-foreground uppercase tracking-[0.1em]">System Online</span>
             </div>
           </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
