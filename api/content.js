import { ensureCoreTables, sql } from "./_lib/db.js";

const mapRow = (row) => ({
  key: row.content_key,
  payload: row.payload ?? {},
  updatedAt: row.updated_at,
});

export default async function handler(req, res) {
  try {
    await ensureCoreTables();

    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }

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
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch content",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
