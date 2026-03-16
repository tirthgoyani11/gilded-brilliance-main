import { ensureCoreTables, sql } from "./_lib/db.js";
import { requireAdmin } from "./_lib/admin-auth.js";

const mapRow = (row) => ({
  id: row.id,
  name: row.name,
  category: row.category,
  metal: row.metal,
  price: Number(row.price),
  imageUrl: row.image_url,
  description: row.description ?? "",
  isActive: Boolean(row.is_active),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export default async function handler(req, res) {
  try {
    await ensureCoreTables();

    if (!requireAdmin(req, res)) {
      return;
    }

    if (req.method === "GET") {
      const rows = await sql`
        SELECT id, name, category, metal, price, image_url, description, is_active, created_at, updated_at
        FROM jewelry_items
        ORDER BY updated_at DESC;
      `;
      return res.status(200).json({ items: rows.map(mapRow) });
    }

    if (req.method === "POST") {
      const body = req.body ?? {};
      const id = String(body.id || "").trim();
      const name = String(body.name || "").trim();
      const category = String(body.category || "").trim();
      const metal = String(body.metal || "").trim();
      const imageUrl = String(body.imageUrl || "").trim();
      const description = body.description ? String(body.description) : "";
      const price = Number(body.price);

      if (!id || !name || !category || !metal || !imageUrl || !Number.isFinite(price)) {
        return res.status(400).json({ message: "Missing or invalid jewelry fields" });
      }

      const [row] = await sql`
        INSERT INTO jewelry_items (id, name, category, metal, price, image_url, description, is_active, updated_at)
        VALUES (${id}, ${name}, ${category}, ${metal}, ${price}, ${imageUrl}, ${description || null}, TRUE, NOW())
        RETURNING id, name, category, metal, price, image_url, description, is_active, created_at, updated_at;
      `;

      return res.status(201).json({ item: mapRow(row) });
    }

    if (req.method === "PUT") {
      const body = req.body ?? {};
      const id = String(body.id || "").trim();
      if (!id) {
        return res.status(400).json({ message: "Missing item id" });
      }

      const name = String(body.name || "").trim();
      const category = String(body.category || "").trim();
      const metal = String(body.metal || "").trim();
      const imageUrl = String(body.imageUrl || "").trim();
      const description = body.description ? String(body.description) : "";
      const price = Number(body.price);
      const isActive = body.isActive !== false;

      if (!name || !category || !metal || !imageUrl || !Number.isFinite(price)) {
        return res.status(400).json({ message: "Missing or invalid jewelry fields" });
      }

      const [row] = await sql`
        UPDATE jewelry_items
        SET
          name = ${name},
          category = ${category},
          metal = ${metal},
          price = ${price},
          image_url = ${imageUrl},
          description = ${description || null},
          is_active = ${isActive},
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING id, name, category, metal, price, image_url, description, is_active, created_at, updated_at;
      `;

      if (!row) {
        return res.status(404).json({ message: "Jewelry item not found" });
      }

      return res.status(200).json({ item: mapRow(row) });
    }

    if (req.method === "DELETE") {
      const id = String(req.query?.id || "").trim();
      if (!id) {
        return res.status(400).json({ message: "Missing item id" });
      }

      await sql`DELETE FROM jewelry_items WHERE id = ${id};`;
      return res.status(200).json({ deleted: true, id });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to manage jewelry",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
