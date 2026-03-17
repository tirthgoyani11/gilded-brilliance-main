import { ensureImportLogsTable, sql } from "./_lib/db.js";
import { requireAdmin } from "./_lib/admin-auth.js";

export default async function handler(req, res) {
  try {
    await ensureImportLogsTable();
    if (!requireAdmin(req, res)) return;

    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
    
    const logs = await sql`
      SELECT 
        id, source, total_rows, created_rows, updated_rows, failed_rows, 
        status, error_message, created_at, reverted_at
      FROM import_logs 
      ORDER BY created_at DESC 
      LIMIT ${limit};
    `;

    // Convert snake_case to camelCase
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

  } catch (error) {
    console.error("Failed to fetch import history:", error);
    return res.status(500).json({ message: "Failed to fetch import history", error: error.message });
  }
}
