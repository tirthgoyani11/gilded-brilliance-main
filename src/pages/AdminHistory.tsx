import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { adminFetch } from "@/lib/admin";
import { Button } from "@/components/ui/button";
import { RefreshCcw, FileSpreadsheet } from "lucide-react";

type ImportLog = {
  id: number;
  source: string;
  totalRows: number;
  createdRows: number;
  updatedRows: number;
  failedRows: number;
  status: string;
  errorMessage?: string;
  createdAt: string;
  revertedAt?: string;
};

const AdminHistory = () => {
  const [logs, setLogs] = useState<ImportLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [revertingId, setRevertingId] = useState<number | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    setStatus("");
    try {
      const res = await adminFetch("/api/admin-imports");
      if (!res.ok) {
        setStatus("Failed to load import history.");
        return;
      }
      const data = await res.json();
      setLogs(data.logs || []);
    } catch {
      setStatus("Error loading import history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchHistory();
  }, []);

  const handleRevert = async (id: number) => {
    if (!window.confirm("Are you sure you want to revert this import batch? Any diamonds exclusively created in this batch will be permanently deleted. (Updated diamonds will NOT be restored to previous states).")) {
      return;
    }

    setRevertingId(id);
    setStatus("Reverting batch...");
    
    try {
      const res = await adminFetch(`/api/admin-import-revert?id=${id}`, {
        method: "POST"
      });
      const data = await res.json();
      
      if (res.ok) {
        setStatus(`Successfully reverted batch. Deleted ${data.deletedCount} items.`);
        void fetchHistory();
      } else {
        setStatus(data.message || "Failed to revert batch.");
      }
    } catch {
      setStatus("Error reverting batch.");
    } finally {
      setRevertingId(null);
    }
  };

  return (
    <AdminLayout>
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl">Import History</h1>
            <p className="text-muted-foreground">View all past imports and rollback errant batches.</p>
          </div>
          <Button variant="outline" onClick={fetchHistory} disabled={loading}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {status && <p className="text-sm p-3 bg-secondary/30 rounded border border-border">{status}</p>}

        {/* History Table */}
        <div className="rounded-[12px] border border-border bg-background overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/30 text-xs uppercase tracking-[0.12em] text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Source</th>
                  <th className="px-5 py-4">Summary</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">Loading history...</td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">No import history found.</td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className={`hover:bg-secondary/10 ${log.revertedAt ? "opacity-60" : ""}`}>
                      <td className="px-5 py-4">
                        <div className="font-medium">{new Date(log.createdAt).toLocaleDateString()}</div>
                        <div className="text-xs text-muted-foreground mt-1">{new Date(log.createdAt).toLocaleTimeString()}</div>
                      </td>
                      <td className="px-5 py-4 font-medium flex items-center gap-2">
                         <FileSpreadsheet className="w-4 h-4" />
                         {log.source || "admin-upload"}
                      </td>
                      <td className="px-5 py-4">
                        <p>Total: {log.totalRows}</p>
                        <p className="text-xs text-muted-foreground mt-1 text-primary">Created: {log.createdRows} / Updated: {log.updatedRows}</p>
                        {log.failedRows > 0 && <p className="text-xs text-destructive mt-1">Failed: {log.failedRows}</p>}
                      </td>
                      <td className="px-5 py-4">
                         {log.revertedAt ? (
                           <span className="inline-block px-2 py-0.5 rounded text-[10px] uppercase font-medium bg-red-500/10 text-red-600">
                             Reverted
                           </span>
                         ) : log.status === "success" ? (
                           <span className="inline-block px-2 py-0.5 rounded text-[10px] uppercase font-medium bg-green-500/10 text-green-600">
                             Success
                           </span>
                         ) : (
                           <span className="inline-block px-2 py-0.5 rounded text-[10px] uppercase font-medium bg-red-500/10 text-red-600">
                             {log.status}
                           </span>
                         )}
                         {log.errorMessage && <p className="text-xs mt-1 text-destructive italic max-w-[200px] truncate">{log.errorMessage}</p>}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {!log.revertedAt && log.createdRows > 0 && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-destructive border-destructive/20 hover:bg-destructive/10"
                            onClick={() => handleRevert(log.id)}
                            disabled={revertingId === log.id}
                          >
                           {revertingId === log.id ? "Reverting..." : "Revert"}
                          </Button>
                        )}
                        {log.revertedAt && (
                          <span className="text-xs text-muted-foreground">Reverted on<br/>{new Date(log.revertedAt).toLocaleDateString()}</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </section>
    </AdminLayout>
  );
};

export default AdminHistory;
