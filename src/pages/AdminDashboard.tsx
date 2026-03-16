import { Link } from "react-router-dom";
import { Gem, Package, ShoppingBag, Users } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import { mockDiamonds, mockJewelry } from "@/data/mockCatalog";

const tiles = [
  { title: "Product Manager", desc: "Manage jewelry and diamonds", to: "/admin", icon: Package },
  { title: "Inventory", desc: "Track stock and availability", to: "/admin", icon: Gem },
  { title: "Orders", desc: "Monitor order lifecycle", to: "/admin", icon: ShoppingBag },
  { title: "Customers", desc: "View customer profiles", to: "/admin", icon: Users },
];

const recentActivity = [
  "Diamond import queue checked",
  "Inventory counts synchronized",
  "Order monitor refreshed",
  "Certificate verification logs reviewed",
];

const AdminDashboard = () => {
  const totalDiamonds = mockDiamonds.length;
  const totalJewelry = mockJewelry.length;
  const inventoryValue = mockDiamonds.reduce((sum, item) => sum + item.price, 0);

  return (
    <SiteLayout>
      <section className="container mx-auto px-6 lg:px-12 py-10 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl">Admin Dashboard</h1>
            <p className="text-muted-foreground">Operations control center for VMORA.</p>
          </div>
          <Link to="/admin/import" className="px-4 py-2 rounded bg-foreground text-background text-sm uppercase tracking-[0.12em]">Excel Import</Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-[12px] border border-border p-5 bg-secondary/30">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-2">Loose Diamonds</p>
            <p className="font-heading text-3xl">{totalDiamonds}</p>
          </div>
          <div className="rounded-[12px] border border-border p-5 bg-secondary/30">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-2">Jewelry SKUs</p>
            <p className="font-heading text-3xl">{totalJewelry}</p>
          </div>
          <div className="rounded-[12px] border border-border p-5 bg-secondary/30">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-2">Inventory Value</p>
            <p className="font-heading text-3xl">${inventoryValue.toLocaleString()}</p>
          </div>
          <div className="rounded-[12px] border border-border p-5 bg-secondary/30">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-2">Import Status</p>
            <p className="font-heading text-3xl">Ready</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tiles.map((tile) => (
            <Link key={tile.title} to={tile.to} className="rounded-[12px] border border-border p-5 bg-secondary/30 hover:bg-secondary/50 luxury-transition">
              <tile.icon className="w-5 h-5 text-primary mb-3" />
              <h2 className="font-heading text-lg mb-2">{tile.title}</h2>
              <p className="text-sm text-muted-foreground">{tile.desc}</p>
            </Link>
          ))}
        </div>

        <div className="rounded-[12px] border border-border p-5 bg-background">
          <h2 className="font-heading text-xl mb-3">Recent Activity</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {recentActivity.map((entry) => (
              <li key={entry}>• {entry}</li>
            ))}
          </ul>
        </div>
      </section>
    </SiteLayout>
  );
};

export default AdminDashboard;
