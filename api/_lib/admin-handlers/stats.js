import { ensureCoreTables, hasConfiguredDatabase, sql } from "../db.js";
import { requireAdmin } from "../admin-auth.js";
import { listLocalJewelryItems } from "../local-jewelry-store.js";
import { cachePolicies, setCommonSecurityHeaders, setCorsForRequest } from "../security.js";

const toImportLog = (row) => ({
  id: Number(row.id),
  source: row.source ?? "admin-upload",
  totalRows: Number(row.total_rows),
  createdRows: Number(row.created_rows),
  updatedRows: Number(row.updated_rows),
  failedRows: Number(row.failed_rows),
  status: row.status,
  errorMessage: row.error_message ?? undefined,
  createdAt: row.created_at,
});

export async function handleStats(req, res) {
  setCommonSecurityHeaders(res, { cacheControl: cachePolicies.privateNoStore });
  setCorsForRequest(req, res, { allowedMethods: "GET,OPTIONS" });

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (!requireAdmin(req, res)) {
    return;
  }

  if (!hasConfiguredDatabase) {
    const jewelryItems = await listLocalJewelryItems();
    return res.status(200).json({
      stats: {
        totalDiamonds: 0,
        totalJewelry: jewelryItems.length,
        activeJewelry: jewelryItems.filter((item) => item.isActive !== false).length,
        naturalDiamonds: 0,
        labDiamonds: 0,
        inventoryValue: jewelryItems.reduce((total, item) => total + Number(item.price || 0), 0),
        importsLast24h: 0,
        failedRowsLast24h: 0,
      },
      recentImports: [],
      local: true,
    });
  }

  await ensureCoreTables();

  const [diamondCountRow] = await sql`SELECT COUNT(*)::int AS total FROM diamonds;`;
  const [jewelryCountRow] = await sql`SELECT COUNT(*)::int AS total FROM jewelry_items;`;
  const [activeJewelryCountRow] = await sql`SELECT COUNT(*)::int AS total FROM jewelry_items WHERE is_active = TRUE;`;
  const [naturalCountRow] = await sql`SELECT COUNT(*)::int AS total FROM diamonds WHERE type = 'natural';`;
  const [labCountRow] = await sql`SELECT COUNT(*)::int AS total FROM diamonds WHERE type = 'lab-grown';`;
  const [inventoryValueRow] = await sql`SELECT COALESCE(SUM(price), 0)::float8 AS total FROM diamonds;`;
  const [importsLast24hRow] = await sql`
    SELECT COUNT(*)::int AS total
    FROM import_logs
    WHERE created_at >= NOW() - INTERVAL '24 hours';
  `;
  const [failedRowsLast24hRow] = await sql`
    SELECT COALESCE(SUM(failed_rows), 0)::int AS total
    FROM import_logs
    WHERE created_at >= NOW() - INTERVAL '24 hours';
  `;

  const recentImports = await sql`
    SELECT id, source, total_rows, created_rows, updated_rows, failed_rows, status, error_message, created_at
    FROM import_logs
    ORDER BY created_at DESC
    LIMIT 8;
  `;

  return res.status(200).json({
    stats: {
      totalDiamonds: Number(diamondCountRow?.total || 0),
      totalJewelry: Number(jewelryCountRow?.total || 0),
      activeJewelry: Number(activeJewelryCountRow?.total || 0),
      naturalDiamonds: Number(naturalCountRow?.total || 0),
      labDiamonds: Number(labCountRow?.total || 0),
      inventoryValue: Number(inventoryValueRow?.total || 0),
      importsLast24h: Number(importsLast24hRow?.total || 0),
      failedRowsLast24h: Number(failedRowsLast24hRow?.total || 0),
    },
    recentImports: recentImports.map(toImportLog),
  });
}
