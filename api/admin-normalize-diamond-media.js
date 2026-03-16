import { ensureCoreTables, sql } from "./_lib/db.js";
import { requireAdmin } from "./_lib/admin-auth.js";

export default async function handler(req, res) {
  try {
    await ensureCoreTables();

    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    if (!requireAdmin(req, res)) {
      return;
    }

    const updatedRows = await sql`
      UPDATE diamonds
      SET
        image_url = 'https://v3601514.v360.in/imaged/' || stone_id || '/still.jpg',
        v360_stone_id = stone_id,
        updated_at = NOW()
      WHERE stone_id IS NOT NULL AND TRIM(stone_id) <> ''
      RETURNING stone_id;
    `;

    return res.status(200).json({
      message: "Diamond media normalized",
      updated: updatedRows.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to normalize diamond media",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
