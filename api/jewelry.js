import { ensureCoreTables, hasConfiguredDatabase, sql } from "./_lib/db.js";
import { listLocalJewelryItems } from "./_lib/local-jewelry-store.js";
import { cachePolicies, setCommonSecurityHeaders, setCorsForRequest } from "./_lib/security.js";

const METAL_OPTIONS = ["Silver", "Gold", "Rose Gold"];

const parseJsonField = (value, fallback) => {
  if (value == null) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }
  return value;
};

const normalizeMetalImageList = (value, fallbackImage = "") => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? [trimmed] : fallbackImage ? [fallbackImage] : [];
  }
  return fallbackImage ? [fallbackImage] : [];
};

const normalizeMetalImages = (value, fallbackImage = "") => {
  const source = parseJsonField(value, {});
  const images = {};
  for (const metal of METAL_OPTIONS) {
    const list = normalizeMetalImageList(source?.[metal], fallbackImage);
    if (list.length) images[metal] = list;
  }
  return images;
};

const normalizeGalleryImages = (value) =>
  Array.isArray(value)
    ? value.map((item) => String(item || "").trim()).filter(Boolean)
    : [];

const mapRow = (row) => ({
  id: row.id,
  name: row.name,
  category: row.category,
  subcategory: row.subcategory ?? "",
  metal: row.metal,
  price: Number(row.price),
  imageUrl: row.image_url,
  description: row.description ?? "",
  collection: row.collection ?? "",
  stoneType: row.stone_type ?? "",
  diamondWeight: row.diamond_weight ?? "",
  setting: row.setting ?? "",
  tags: row.tags ?? "",
  metalImages: normalizeMetalImages(row.metal_images, row.image_url),
  galleryImages: normalizeGalleryImages(parseJsonField(row.gallery_images, [])),
  videoUrl: row.video_url ?? "",
  modelUrl: row.model_url ?? "",
  inventoryStatus: row.inventory_status ?? "In Stock",
  sortOrder: Number(row.sort_order ?? 0),
  isFeatured: Boolean(row.is_featured),
  isActive: Boolean(row.is_active),
});

const mapLocalItem = (item) => ({
  id: item.id,
  name: item.name,
  category: item.category,
  subcategory: item.subcategory ?? "",
  metal: item.metal,
  price: Number(item.price),
  imageUrl: item.imageUrl,
  description: item.description ?? "",
  collection: item.collection ?? "",
  stoneType: item.stoneType ?? "",
  diamondWeight: item.diamondWeight ?? "",
  setting: item.setting ?? "",
  tags: item.tags ?? "",
  metalImages: normalizeMetalImages(item.metalImages, item.imageUrl),
  galleryImages: normalizeGalleryImages(item.galleryImages),
  videoUrl: item.videoUrl ?? "",
  modelUrl: item.modelUrl ?? "",
  inventoryStatus: item.inventoryStatus ?? "In Stock",
  sortOrder: Number(item.sortOrder ?? 0),
  isFeatured: Boolean(item.isFeatured),
  isActive: item.isActive !== false,
});

export default async function handler(req, res) {
  try {
    setCommonSecurityHeaders(res, { cacheControl: cachePolicies.publicShort });
    setCorsForRequest(req, res, { allowedMethods: "GET,OPTIONS" });

    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }

    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const category = String(req.query?.category || "").trim();
    const search = String(req.query?.search || "").trim();

    if (!hasConfiguredDatabase) {
      const items = await listLocalJewelryItems({ activeOnly: true, category, search });
      return res.status(200).json({ items: items.map(mapLocalItem), local: true });
    }

    await ensureCoreTables();

    const rows = await sql`
      SELECT
        id,
        name,
        category,
        subcategory,
        metal,
        price,
        image_url,
        description,
        collection,
        stone_type,
        diamond_weight,
        setting,
        tags,
        metal_images,
        gallery_images,
        video_url,
        model_url,
        inventory_status,
        sort_order,
        is_featured,
        is_active
      FROM jewelry_items
      WHERE is_active = TRUE
        AND (${category} = '' OR category = ${category})
        AND (
          ${search} = ''
          OR name ILIKE ${`%${search}%`}
          OR category ILIKE ${`%${search}%`}
          OR subcategory ILIKE ${`%${search}%`}
          OR metal ILIKE ${`%${search}%`}
          OR collection ILIKE ${`%${search}%`}
          OR tags ILIKE ${`%${search}%`}
        )
      ORDER BY is_featured DESC, sort_order ASC, updated_at DESC;
    `;

    return res.status(200).json({ items: rows.map(mapRow) });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch jewelry",
    });
  }
}
