import { createImportLog, ensureCoreTables, sql } from "./_lib/db.js";
import { requireAdmin } from "./_lib/admin-auth.js";

const normalizeLab = (value) => (value === "lab-grown" ? "lab-grown" : "natural");
const normalizeCert = (value) => (String(value).toUpperCase().includes("GIA") ? "GIA" : "IGI");
const stoneImageUrl = (stoneId) => `https://v3601514.v360.in/imaged/${encodeURIComponent(stoneId)}/still.jpg`;

export default async function handler(req, res) {
  try {
    await ensureCoreTables();

    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    if (!requireAdmin(req, res)) {
      return;
    }

    const payload = req.body;
    const diamonds = Array.isArray(payload?.diamonds) ? payload.diamonds : [];
    const importSource = payload?.source ? String(payload.source) : "admin-upload";

    if (!diamonds.length) {
      return res.status(400).json({ message: "No diamonds provided" });
    }

    let created = 0;
    let updated = 0;
    const createdIds = [];
    const updatedIds = [];

    for (const d of diamonds) {
      const normalizedStoneId = String(d.stoneId || "").trim();
      if (!normalizedStoneId) {
        continue;
      }

      const exists = await sql`SELECT stone_id FROM diamonds WHERE stone_id = ${normalizedStoneId} LIMIT 1;`;

      await sql`
        INSERT INTO diamonds (
          stone_id, type, shape, carat, color, clarity, cut, polish, symmetry,
          fluorescence, price, ratio, depth_pct, table_pct, measurements, cert_lab,
          cert_number, cert_link, image_url, video_url, v360_stone_id, updated_at
        ) VALUES (
          ${normalizedStoneId},
          ${normalizeLab(d.type)},
          ${String(d.shape)},
          ${Number(d.carat) || 0},
          ${String(d.color)},
          ${String(d.clarity)},
          ${String(d.cut || "N/A")},
          ${String(d.polish)},
          ${String(d.symmetry)},
          ${String(d.fluorescence || "None")},
          ${Number(d.price) || 0},
          ${Number(d.ratio) || 1},
          ${Number(d.depthPct) || 0},
          ${Number(d.tablePct) || 0},
          ${String(d.measurements || "")},
          ${normalizeCert(d.certLab || d.certNumber || "")},
          ${String(d.certNumber)},
          ${d.certLink ? String(d.certLink) : null},
          ${stoneImageUrl(normalizedStoneId)},
          ${d.videoUrl ? String(d.videoUrl) : null},
          ${normalizedStoneId},
          NOW()
        )
        ON CONFLICT (stone_id)
        DO UPDATE SET
          type = EXCLUDED.type,
          shape = EXCLUDED.shape,
          carat = EXCLUDED.carat,
          color = EXCLUDED.color,
          clarity = EXCLUDED.clarity,
          cut = EXCLUDED.cut,
          polish = EXCLUDED.polish,
          symmetry = EXCLUDED.symmetry,
          fluorescence = EXCLUDED.fluorescence,
          price = EXCLUDED.price,
          ratio = EXCLUDED.ratio,
          depth_pct = EXCLUDED.depth_pct,
          table_pct = EXCLUDED.table_pct,
          measurements = EXCLUDED.measurements,
          cert_lab = EXCLUDED.cert_lab,
          cert_number = EXCLUDED.cert_number,
          cert_link = EXCLUDED.cert_link,
          image_url = EXCLUDED.image_url,
          video_url = EXCLUDED.video_url,
          v360_stone_id = EXCLUDED.v360_stone_id,
          updated_at = NOW();
      `;

      if (exists.length) {
        updated += 1;
        updatedIds.push(normalizedStoneId);
      } else {
        created += 1;
        createdIds.push(normalizedStoneId);
      }
    }

    await createImportLog({
      source: importSource,
      totalRows: diamonds.length,
      createdRows: created,
      updatedRows: updated,
      failedRows: 0,
      status: "success",
      errorMessage: null,
      details: { createdIds, updatedIds }
    });

    return res.status(200).json({
      message: "Import completed",
      total: diamonds.length,
      created,
      updated,
    });
  } catch (error) {
    const payload = req.body;
    const diamonds = Array.isArray(payload?.diamonds) ? payload.diamonds : [];
    const importSource = payload?.source ? String(payload.source) : "admin-upload";

    await createImportLog({
      source: importSource,
      totalRows: diamonds.length,
      createdRows: 0,
      updatedRows: 0,
      failedRows: diamonds.length,
      status: "failed",
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    });

    return res.status(500).json({
      message: "Failed to import diamonds",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
