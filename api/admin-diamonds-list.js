import { ensureDiamondsTable, sql } from "./_lib/db.js";
import { requireAdmin } from "./_lib/admin-auth.js";

export default async function handler(req, res) {
  try {
    await ensureDiamondsTable();
    if (!requireAdmin(req, res)) return;

    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(500, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
    const search = searchParams.get("search") || "";
    
    const offset = (page - 1) * limit;

    let diamonds;
    let totalCount;

    if (search) {
      const tsQuery = `%${search.toLowerCase()}%`;
      const result = await sql`
        SELECT * FROM diamonds
        WHERE LOWER(stone_id) LIKE ${tsQuery}
           OR LOWER(shape) LIKE ${tsQuery}
           OR LOWER(color) LIKE ${tsQuery}
           OR LOWER(cert_lab) LIKE ${tsQuery}
        ORDER BY updated_at DESC
        LIMIT ${limit} OFFSET ${offset};
      `;
      const countResult = await sql`
        SELECT COUNT(*) FROM diamonds
        WHERE LOWER(stone_id) LIKE ${tsQuery}
           OR LOWER(shape) LIKE ${tsQuery}
           OR LOWER(color) LIKE ${tsQuery}
           OR LOWER(cert_lab) LIKE ${tsQuery};
      `;
      diamonds = result;
      totalCount = Number(countResult[0]?.count || 0);
    } else {
      diamonds = await sql`SELECT * FROM diamonds ORDER BY updated_at DESC LIMIT ${limit} OFFSET ${offset};`;
      const countResult = await sql`SELECT COUNT(*) FROM diamonds;`;
      totalCount = Number(countResult[0]?.count || 0);
    }

    // Convert keys from snake_case to camelCase
    const formatted = diamonds.map(d => ({
      stoneId: d.stone_id,
      type: d.type,
      shape: d.shape,
      carat: d.carat,
      color: d.color,
      clarity: d.clarity,
      cut: d.cut,
      polish: d.polish,
      symmetry: d.symmetry,
      fluorescence: d.fluorescence,
      price: d.price,
      ratio: d.ratio,
      depthPct: d.depth_pct,
      tablePct: d.table_pct,
      measurements: d.measurements,
      certLab: d.cert_lab,
      certNumber: d.cert_number,
      certLink: d.cert_link,
      imageUrl: d.image_url,
      videoUrl: d.video_url,
      v360StoneId: d.v360_stone_id
    }));

    return res.status(200).json({
      diamonds: formatted,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error("Failed to list diamonds Admin API:", error);
    return res.status(500).json({ message: "Failed to list diamonds", error: error.message });
  }
}
