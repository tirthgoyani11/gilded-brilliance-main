import { ensureDiamondsTable, sql } from "../db.js";
import { requireAdmin } from "../admin-auth.js";
import { cachePolicies, rejectIfCrossOriginWrite, setCommonSecurityHeaders, setCorsForRequest } from "../security.js";

export async function handleDiamondsDelete(req, res) {
  setCommonSecurityHeaders(res, { cacheControl: cachePolicies.privateNoStore });
  setCorsForRequest(req, res, { allowedMethods: "DELETE,OPTIONS" });

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (rejectIfCrossOriginWrite(req, res)) {
    return;
  }

  await ensureDiamondsTable();
  if (!requireAdmin(req, res)) return;

  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const id = searchParams.get("id");
  const all = searchParams.get("all") === "true";
  const fromDate = searchParams.get("from");
  const toDate = searchParams.get("to");

  let deletedCount = 0;

  if (id) {
    const result = await sql`DELETE FROM diamonds WHERE stone_id = ${id} RETURNING stone_id;`;
    deletedCount = result.length;
  } else if (all) {
    const result = await sql`DELETE FROM diamonds RETURNING stone_id;`;
    deletedCount = result.length;
  } else if (fromDate && toDate) {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999);
    const result = await sql`
      DELETE FROM diamonds 
      WHERE created_at >= ${from.toISOString()} 
        AND created_at <= ${to.toISOString()} 
      RETURNING stone_id;
    `;
    deletedCount = result.length;
  } else {
    return res.status(400).json({ message: "Invalid deletion parameters" });
  }

  return res.status(200).json({ message: "Deletion successful", deletedCount });
}
