import { sql } from "./_lib/db.js";
import { requireAdmin } from "./_lib/admin-auth.js";

export default async function handler(req, res) {
  try {
    if (!requireAdmin(req, res)) return;

    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
    const importId = parseInt(searchParams.get("id"), 10);

    if (isNaN(importId)) {
      return res.status(400).json({ message: "Invalid import ID provided." });
    }

    // Fetch the log
    const logs = await sql`SELECT * FROM import_logs WHERE id = ${importId} LIMIT 1;`;
    if (!logs.length) {
      return res.status(404).json({ message: "Import log not found." });
    }

    const log = logs[0];
    if (log.reverted_at) {
      return res.status(400).json({ message: "This import batch has already been reverted." });
    }

    let deletedCount = 0;

    // The details JSON contains createdIds
    const details = log.details || {};
    const createdIds = details.createdIds || [];

    if (createdIds.length > 0) {
      // Postgres IN clause binding trick using ANY
      // sql`... WHERE stone_id = ANY(${createdIds})`
      const result = await sql`
        DELETE FROM diamonds
        WHERE stone_id = ANY(${createdIds})
        RETURNING stone_id;
      `;
      deletedCount = result.length;
    }

    // Mark log as reverted
    await sql`
      UPDATE import_logs 
      SET reverted_at = NOW() 
      WHERE id = ${importId};
    `;

    return res.status(200).json({
      message: "Revert successful.",
      deletedCount,
      totalCreated: createdIds.length
    });

  } catch (error) {
    console.error("Failed to revert import batch:", error);
    return res.status(500).json({ message: "Failed to revert import batch", error: error.message });
  }
}
