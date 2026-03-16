import { ensureCoreTables, sql } from "./_lib/db.js";
import { requireAdmin } from "./_lib/admin-auth.js";

const mapRow = (row) => ({
  key: row.content_key,
  payload: row.payload ?? {},
  updatedAt: row.updated_at,
});

export default async function handler(req, res) {
  try {
    await ensureCoreTables();

    if (!requireAdmin(req, res)) {
      return;
    }

    if (req.method === "GET") {
      const key = typeof req.query?.key === "string" ? req.query.key : undefined;

      if (key) {
        const [row] = await sql`
          SELECT content_key, payload, updated_at
          FROM cms_content
          WHERE content_key = ${key}
          LIMIT 1;
        `;
        return res.status(200).json({ content: row ? mapRow(row) : null });
      }

      const rows = await sql`
        SELECT content_key, payload, updated_at
        FROM cms_content
        ORDER BY content_key ASC;
      `;
      return res.status(200).json({ contents: rows.map(mapRow) });
    }

    if (req.method === "PUT") {
      const key = String(req.body?.key || "").trim();
      const payload = req.body?.payload;

      if (!key || typeof payload !== "object" || payload === null || Array.isArray(payload)) {
        return res.status(400).json({ message: "Invalid key or payload" });
      }

      const [row] = await sql`
        INSERT INTO cms_content (content_key, payload, updated_at)
        VALUES (${key}, ${JSON.stringify(payload)}::jsonb, NOW())
        ON CONFLICT (content_key)
        DO UPDATE SET
          payload = EXCLUDED.payload,
          updated_at = NOW()
        RETURNING content_key, payload, updated_at;
      `;

      return res.status(200).json({ content: mapRow(row) });
    }

    if (req.method === "DELETE") {
      const key = String(req.query?.key || "").trim();
      if (!key) {
        return res.status(400).json({ message: "Missing key" });
      }

      await sql`DELETE FROM cms_content WHERE content_key = ${key};`;
      return res.status(200).json({ deleted: true, key });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to manage content",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
