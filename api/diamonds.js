import { ensureDiamondsTable, sql } from "./_lib/db.js";

const toDiamond = (row) => ({
  stoneId: row.stone_id,
  type: row.type,
  shape: row.shape,
  carat: Number(row.carat),
  color: row.color,
  clarity: row.clarity,
  cut: row.cut,
  polish: row.polish,
  symmetry: row.symmetry,
  fluorescence: row.fluorescence,
  price: Number(row.price),
  ratio: Number(row.ratio),
  depthPct: Number(row.depth_pct),
  tablePct: Number(row.table_pct),
  measurements: row.measurements,
  certLab: row.cert_lab,
  certNumber: row.cert_number,
  certLink: row.cert_link ?? undefined,
  imageUrl: row.image_url,
  videoUrl: row.video_url ?? undefined,
  v360StoneId: row.v360_stone_id ?? undefined,
});

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const rows = await sql`
      SELECT stone_id, type, shape, carat, color, clarity, cut, polish, symmetry,
             fluorescence, price, ratio, depth_pct, table_pct, measurements, cert_lab,
             cert_number, cert_link, image_url, video_url, v360_stone_id
      FROM diamonds
      ORDER BY updated_at DESC
      LIMIT 20000;
    `;

    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({ diamonds: rows.map(toDiamond) });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch diamonds",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
