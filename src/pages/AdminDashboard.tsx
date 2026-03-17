import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Gem, Package, ShoppingBag, Users } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { adminFetch } from "@/lib/admin";

type AdminStatsResponse = {
  stats: {
    totalDiamonds: number;
    naturalDiamonds: number;
    labDiamonds: number;
    inventoryValue: number;
    importsLast24h: number;
    failedRowsLast24h: number;
  };
  recentImports: {
    id: number;
    source: string;
    totalRows: number;
    createdRows: number;
    updatedRows: number;
    failedRows: number;
    status: string;
    errorMessage?: string;
    createdAt: string;
  }[];
};

const tiles = [
  { title: "Product Manager", desc: "Manage jewelry and diamonds", to: "/admin/content", icon: Package },
  { title: "Inventory", desc: "Track stock and availability", to: "/admin", icon: Gem },
  { title: "Orders", desc: "Monitor order lifecycle", to: "/admin", icon: ShoppingBag },
  { title: "CMS", desc: "Manage blog, about, education", to: "/admin/content", icon: Users },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStatsResponse["stats"]>({
    totalDiamonds: 0,
    naturalDiamonds: 0,
    labDiamonds: 0,
    inventoryValue: 0,
    importsLast24h: 0,
    failedRowsLast24h: 0,
  });
  const [recentImports, setRecentImports] = useState<AdminStatsResponse["recentImports"]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  const loadStats = async () => {
    setLoading(true);
    setStatus("");

    try {
      const response = await adminFetch("/api/admin-stats");
      if (!response.ok) {
        if (response.status === 401) {
          setStatus("Unauthorized: check your admin token.");
        }
        return;
      }
      const payload = (await response.json()) as AdminStatsResponse;
      if (!payload?.stats) return;
      setStats(payload.stats);
      setRecentImports(Array.isArray(payload.recentImports) ? payload.recentImports : []);
    } catch {
      setStatus("Failed to load admin stats.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadStats();
  }, []);

  return (
    <AdminLayout>
      <section className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl">Admin Dashboard</h1>
            <p className="text-muted-foreground">Operations control center for VMORA.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/admin/import" className="px-4 py-2 rounded bg-foreground text-background text-sm uppercase tracking-[0.12em]">Excel Import</Link>
            <Link to="/admin/content" className="px-4 py-2 rounded border border-border text-sm uppercase tracking-[0.12em]">Content Manager</Link>
          </div>
        </div>


        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-[12px] border border-border p-5 bg-secondary/30">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-2">Loose Diamonds</p>
            <p className="font-heading text-3xl">{stats.totalDiamonds.toLocaleString()}</p>
          </div>
          <div className="rounded-[12px] border border-border p-5 bg-secondary/30">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-2">Natural vs Lab</p>
            <p className="font-heading text-2xl">{stats.naturalDiamonds} / {stats.labDiamonds}</p>
          </div>
          <div className="rounded-[12px] border border-border p-5 bg-secondary/30">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-2">Inventory Value</p>
            <p className="font-heading text-3xl">${Math.round(stats.inventoryValue).toLocaleString()}</p>
          </div>
          <div className="rounded-[12px] border border-border p-5 bg-secondary/30">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-2">Imports (24h)</p>
            <p className="font-heading text-3xl">{stats.importsLast24h}</p>
            <p className={`text-xs mt-1 ${stats.failedRowsLast24h > 0 ? "text-destructive" : "text-muted-foreground"}`}>
              Failed rows: {stats.failedRowsLast24h}
            </p>
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
          <h2 className="font-heading text-xl mb-3">Recent Import Activity</h2>
          {loading ? <p className="text-sm text-muted-foreground">Loading import activity...</p> : null}
          {!loading && recentImports.length === 0 ? <p className="text-sm text-muted-foreground">No import logs yet.</p> : null}
          <ul className="space-y-2 text-sm text-muted-foreground">
            {recentImports.map((entry) => (
              <li key={entry.id}>
                • {new Date(entry.createdAt).toLocaleString()} | {entry.source} | total {entry.totalRows}, created {entry.createdRows}, updated {entry.updatedRows}, failed {entry.failedRows}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminDashboard;
