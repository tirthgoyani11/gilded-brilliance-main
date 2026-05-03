import { ensureImportLogsTable, sql } from "../db.js";
import { requireAdmin } from "../admin-auth.js";
import { cachePolicies, setCommonSecurityHeaders, setCorsForRequest } from "../security.js";

export async function handleImports(req, res) {
  setCommonSecurityHeaders(res, { cacheControl: cachePolicies.privateNoStore });
  setCorsForRequest(req, res, { allowedMethods: "GET,OPTIONS" });

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  await ensureImportLogsTable();
  if (!requireAdmin(req, res)) return;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
  
  const logs = await sql`
    SELECT * FROM import_logs ORDER BY created_at DESC LIMIT ${limit};
  `;

  const formatted = logs.map(l => ({
    id: Number(l.id),
    source: l.source,
    totalRows: l.total_rows,
    createdRows: l.created_rows,
    updatedRows: l.updated_rows,
    failedRows: l.failed_rows,
    status: l.status,
    errorMessage: l.error_message,
    createdAt: l.created_at,
    revertedAt: l.reverted_at
  }));

  return res.status(200).json({ logs: formatted });
}
