import { Link } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";

const tiles = [
  { title: "Product Manager", desc: "Manage jewelry and diamonds" },
  { title: "Inventory", desc: "Track stock and availability" },
  { title: "Orders", desc: "Monitor order lifecycle" },
  { title: "Customers", desc: "View customer profiles" },
];

const AdminDashboard = () => {
  return (
    <SiteLayout>
      <section className="container mx-auto px-6 lg:px-12 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl">Admin Dashboard</h1>
            <p className="text-muted-foreground">Operations control center for VMORA.</p>
          </div>
          <Link to="/admin/import" className="px-4 py-2 rounded bg-foreground text-background text-sm uppercase tracking-[0.12em]">Excel Import</Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tiles.map((tile) => (
            <div key={tile.title} className="rounded-[12px] border border-border p-5 bg-secondary/30">
              <h2 className="font-heading text-lg mb-2">{tile.title}</h2>
              <p className="text-sm text-muted-foreground">{tile.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
};

export default AdminDashboard;
