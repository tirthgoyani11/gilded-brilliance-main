import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { adminFetch } from "@/lib/admin";
import { Button } from "@/components/ui/button";
import { Search, Trash2, Calendar, AlertTriangle } from "lucide-react";
import type { Diamond } from "@/types/diamond";

type PaginationDetails = {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
};

const AdminListings = () => {
  const [diamonds, setDiamonds] = useState<Diamond[]>([]);
  const [pagination, setPagination] = useState<PaginationDetails>({ total: 0, page: 1, totalPages: 1, limit: 50 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  
  // Bulk delete states
  const [deleteFromDate, setDeleteFromDate] = useState("");
  const [deleteToDate, setDeleteToDate] = useState("");

  const fetchDiamonds = async (page = 1, searchQuery = search) => {
    setLoading(true);
    setStatus("");
    try {
      const url = new URL("/api/admin-diamonds-list", window.location.origin);
      url.searchParams.set("page", page.toString());
      if (searchQuery.trim()) {
        url.searchParams.set("search", searchQuery.trim());
      }
      
      const res = await adminFetch(url.toString());
      if (!res.ok) {
        setStatus("Failed to load listings.");
        setDiamonds([]);
        return;
      }
      const data = await res.json();
      setDiamonds(data.diamonds || []);
      setPagination(data.pagination || { total: 0, page: 1, totalPages: 1, limit: 50 });
    } catch {
      setStatus("Error loading listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchDiamonds(1, search);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void fetchDiamonds(1, search);
  };

  const handleDeleteById = async (stoneId: string) => {
    if (!window.confirm(`Are you sure you want to delete diamond ${stoneId}?`)) return;
    try {
      const res = await adminFetch(`/api/admin-diamonds-delete?id=${encodeURIComponent(stoneId)}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setStatus(`${stoneId} deleted successfully.`);
        void fetchDiamonds(pagination.page, search);
      } else {
        setStatus(`Failed to delete ${stoneId}.`);
      }
    } catch {
      setStatus("Error deleting diamond.");
    }
  };

  const handleBulkDelete = async () => {
    if (!deleteFromDate || !deleteToDate) {
      setStatus("Please select a date range.");
      return;
    }
    
    if (!window.confirm(`Are you sure you want to delete all diamonds added between ${deleteFromDate} and ${deleteToDate}? This cannot be undone.`)) return;
    
    try {
      const res = await adminFetch(`/api/admin-diamonds-delete?from=${deleteFromDate}&to=${deleteToDate}`, {
        method: "DELETE"
      });
      if (res.ok) {
        const data = await res.json();
        setStatus(`Successfully deleted ${data.deletedCount} diamond(s).`);
        void fetchDiamonds(1, search);
      } else {
        setStatus("Bulk delete failed.");
      }
    } catch {
      setStatus("Error performing bulk delete.");
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("WARNING: Are you sure you want to delete EVERY diamond in your inventory? This cannot be undone.")) return;
    try {
      const res = await adminFetch(`/api/admin-diamonds-delete?all=true`, {
        method: "DELETE"
      });
      if (res.ok) {
        const data = await res.json();
        setStatus(`Successfully deleted all ${data.deletedCount} diamond(s).`);
        void fetchDiamonds(1, "");
      } else {
        setStatus("Delete all failed.");
      }
    } catch {
      setStatus("Error performing delete all.");
    }
  };

  return (
    <AdminLayout>
      <section className="space-y-6">
        <div>
          <h1 className="font-heading text-3xl">Manage Listings</h1>
          <p className="text-muted-foreground">Search, view, delete specific diamonds, or clear inventory by date range.</p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
             <input
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               placeholder="Search by Stone ID, shape, lab, color..."
               className="w-full h-12 pl-10 pr-4 rounded-lg border border-border bg-background focus:outline-none focus:border-primary"
             />
          </form>
          <Button onClick={handleSearchSubmit} className="h-12 px-6">Search</Button>
        </div>

        {status && <p className="text-sm text-primary p-2 bg-secondary/30 rounded border border-border">{status}</p>}

        {/* Bulk Actions */}
        <div className="rounded-[12px] border border-destructive/20 bg-destructive/5 p-5">
           <h2 className="text-destructive flex items-center gap-2 mb-4 font-medium"><AlertTriangle className="w-5 h-5" /> Danger Zone: Bulk Delete</h2>
           <div className="flex flex-wrap items-end gap-6">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Delete between Dates (YYYY-MM-DD)</p>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="date" value={deleteFromDate} onChange={(e) => setDeleteFromDate(e.target.value)} className="h-10 pl-9 pr-3 rounded border border-border bg-background" />
                  </div>
                  <span className="text-muted-foreground">to</span>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                     <input type="date" value={deleteToDate} onChange={(e) => setDeleteToDate(e.target.value)} className="h-10 pl-9 pr-3 rounded border border-border bg-background" />
                  </div>
                  <Button variant="outline" onClick={handleBulkDelete} className="text-destructive border-destructive/50 hover:bg-destructive/10">Delete By Date Range</Button>
                </div>
              </div>

              <div className="h-10 border-l border-border/50 hidden lg:block" />

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Clear Entire Inventory</p>
                <Button variant="destructive" onClick={handleDeleteAll} className="h-10">Delete All Listings</Button>
              </div>
           </div>
        </div>

        {/* Listings Table */}
        <div className="rounded-[12px] border border-border bg-background overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/30 text-xs uppercase tracking-[0.12em] text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-5 py-4">Stone ID</th>
                  <th className="px-5 py-4">Type / Cert</th>
                  <th className="px-5 py-4">Shape</th>
                  <th className="px-5 py-4">Carat / Info</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">Loading listings...</td>
                  </tr>
                ) : diamonds.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">No diamonds found.</td>
                  </tr>
                ) : (
                  diamonds.map((d) => (
                    <tr key={d.stoneId} className="hover:bg-secondary/10">
                      <td className="px-5 py-4 font-medium">{d.stoneId}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-medium ${d.type === 'natural' ? 'bg-primary/10 text-primary' : 'bg-blue-500/10 text-blue-600'}`}>
                          {d.type}
                        </span>
                        <div className="mt-1 text-xs text-muted-foreground">{d.certLab} {d.certNumber}</div>
                      </td>
                      <td className="px-5 py-4 capitalize">{d.shape}</td>
                      <td className="px-5 py-4">
                        {d.carat}ct
                        <div className="mt-1 text-xs text-muted-foreground">{d.color} / {d.clarity} / {d.cut}</div>
                      </td>
                      <td className="px-5 py-4 font-medium">${d.price.toLocaleString()}</td>
                      <td className="px-5 py-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteById(d.stoneId)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Context */}
          <div className="px-5 py-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
            <div>
              Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={pagination.page <= 1} 
                onClick={() => fetchDiamonds(pagination.page - 1, search)}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchDiamonds(pagination.page + 1, search)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>

      </section>
    </AdminLayout>
  );
};

export default AdminListings;
