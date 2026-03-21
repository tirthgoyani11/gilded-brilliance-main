import { ensureCoreTables, sql } from "./_lib/db.js";
import { cachePolicies, setCommonSecurityHeaders, setCorsForRequest } from "./_lib/security.js";

const mapRow = (row) => ({
  id: row.id,
  name: row.name,
  category: row.category,
  metal: row.metal,
  price: Number(row.price),
  imageUrl: row.image_url,
  description: row.description ?? "",
  isActive: Boolean(row.is_active),
});

export default async function handler(req, res) {
  try {
    setCommonSecurityHeaders(res, { cacheControl: cachePolicies.publicShort });
    setCorsForRequest(req, res, { allowedMethods: "GET,OPTIONS" });

    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }

    await ensureCoreTables();

    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const rows = await sql`
      SELECT id, name, category, metal, price, image_url, description, is_active
      FROM jewelry_items
      WHERE is_active = TRUE
      ORDER BY updated_at DESC;
    `;

    return res.status(200).json({ items: rows.map(mapRow) });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch jewelry",
    });
  }
}
