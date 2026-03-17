import { ensureDiamondsTable, sql } from "./_lib/db.js";
import { requireAdmin } from "./_lib/admin-auth.js";

export default async function handler(req, res) {
  try {
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
      // Expecting YYYY-MM-DD
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
      return res.status(400).json({ message: "Invalid deletion parameters provided. Must specify id, all=true, or from/to dates." });
    }

    return res.status(200).json({
      message: "Deletion successful",
      deletedCount
    });

  } catch (error) {
    console.error("Failed to delete diamonds Admin API:", error);
    return res.status(500).json({ message: "Failed to delete diamonds", error: error.message });
  }
}
