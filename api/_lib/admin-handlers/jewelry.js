import { ensureCoreTables, hasConfiguredDatabase, sql } from "../db.js";
import { requireAdmin } from "../admin-auth.js";
import { deleteLocalJewelryItem, listLocalJewelryItems, upsertLocalJewelryItem } from "../local-jewelry-store.js";
import { cachePolicies, rejectIfCrossOriginWrite, setCommonSecurityHeaders, setCorsForRequest } from "../security.js";
import { extractStoragePath, deleteStorageFile, deleteStorageFiles, hasSupabase, getSupabaseAdmin, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_IMAGE_BUCKET, SUPABASE_MODEL_BUCKET } from "../supabase-admin.js";

const JEWELRY_CATEGORIES = new Set(["Rings", "Necklaces", "Bracelets", "Earrings"]);
const INVENTORY_STATUSES = new Set(["In Stock", "Made To Order", "Reserved", "Sold Out"]);
const METAL_OPTIONS = ["Silver", "Gold", "Rose Gold"];

const deleteSupabaseFile = async (filePath, bucket) => {
  await deleteStorageFile(filePath, bucket);
};

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

const pickPrimaryImage = (images = []) => (Array.isArray(images) ? images.find(Boolean) || "" : "");

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
  createdAt: row.created_at,
  updatedAt: row.updated_at,
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
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

const normalizeItemPayload = (body) => {
  const id = String(body.id || "").trim();
  const name = String(body.name || "").trim();
  const category = String(body.category || "").trim();
  const subcategory = String(body.subcategory || "").trim();
  const metal = String(body.metal || "").trim();
  let imageUrl = String(body.imageUrl || "").trim();
  const description = body.description ? String(body.description).trim() : "";
  const collection = String(body.collection || "").trim();
  const stoneType = String(body.stoneType || "").trim();
  const diamondWeight = String(body.diamondWeight || "").trim();
  const setting = String(body.setting || "").trim();
  const tags = String(body.tags || "").trim();
  const metalImages = normalizeMetalImages(body.metalImages, imageUrl);
  const galleryImages = normalizeGalleryImages(body.galleryImages);
  const videoUrl = String(body.videoUrl || "").trim();
  const modelUrl = String(body.modelUrl || "").trim();
  imageUrl =
    imageUrl ||
    pickPrimaryImage(metalImages.Silver) ||
    pickPrimaryImage(metalImages.Gold) ||
    pickPrimaryImage(metalImages["Rose Gold"]) ||
    "";
  const inventoryStatus = String(body.inventoryStatus || "In Stock").trim();
  const sortOrder = Number.parseInt(String(body.sortOrder ?? 0), 10);
  const price = Number(body.price);
  const isFeatured = body.isFeatured === true;
  const isActive = body.isActive !== false;

  return {
    id,
    name,
    category,
    subcategory,
    metal,
    imageUrl,
    description,
    collection,
    stoneType,
    diamondWeight,
    setting,
    tags,
    metalImages,
    galleryImages,
    videoUrl,
    modelUrl,
    inventoryStatus,
    sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    price,
    isFeatured,
    isActive,
  };
};

const isValidItem = (item) =>
  item.id &&
  item.name &&
  JEWELRY_CATEGORIES.has(item.category) &&
  METAL_OPTIONS.every((metal) => Array.isArray(item.metalImages?.[metal]) && item.metalImages[metal].length > 0) &&
  Number.isFinite(item.price) &&
  item.price >= 0 &&
  INVENTORY_STATUSES.has(item.inventoryStatus);

export async function handleJewelry(req, res) {
  setCommonSecurityHeaders(res, { cacheControl: cachePolicies.privateNoStore });
  setCorsForRequest(req, res, { allowedMethods: "GET,POST,PUT,DELETE,OPTIONS" });

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (rejectIfCrossOriginWrite(req, res)) {
    return;
  }

  if (!requireAdmin(req, res)) {
    return;
  }

  if (!hasConfiguredDatabase && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    const supabaseUrl = SUPABASE_URL.replace(/\/$/, "");
    const headers = {
      "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "apikey": SUPABASE_SERVICE_ROLE_KEY,
      "Content-Type": "application/json",
      "Prefer": "return=representation"
    };

    if (req.method === "GET") {
      const category = String(req.query?.category || "").trim();
      const search = String(req.query?.search || "").trim();
      let url = `${supabaseUrl}/rest/v1/jewelry_items?select=*&order=is_featured.desc,sort_order.asc,updated_at.desc`;
      if (category) url += `&category=eq.${encodeURIComponent(category)}`;
      if (search) url += `&or=(name.ilike.*${encodeURIComponent(search)}*,tags.ilike.*${encodeURIComponent(search)}*)`;
      
      const response = await fetch(url, { headers });
      const rows = await response.json().catch(() => []);
      return res.status(200).json({ items: rows.map(mapRow) });
    }

    if (req.method === "POST" || req.method === "PUT") {
      const item = normalizeItemPayload(req.body ?? {});
      if (!isValidItem(item)) return res.status(400).json({ message: "Missing or invalid jewelry fields" });
      
      const payload = {
        id: item.id,
        name: item.name,
        category: item.category,
        subcategory: item.subcategory,
        metal: item.metal,
        price: item.price,
        image_url: item.imageUrl,
        description: item.description,
        collection: item.collection,
        stone_type: item.stoneType,
        diamond_weight: item.diamondWeight,
        setting: item.setting,
        tags: item.tags,
        metal_images: item.metalImages,
        gallery_images: item.galleryImages,
        video_url: item.videoUrl,
        model_url: item.modelUrl,
        inventory_status: item.inventoryStatus,
        sort_order: item.sortOrder,
        is_featured: item.isFeatured,
        is_active: item.isActive,
        updated_at: new Date().toISOString()
      };

      const url = req.method === "POST" ? `${supabaseUrl}/rest/v1/jewelry_items` : `${supabaseUrl}/rest/v1/jewelry_items?id=eq.${encodeURIComponent(item.id)}`;
      const response = await fetch(url, {
        method: req.method,
        headers,
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        return res.status(500).json({ message: "Supabase DB error", details: err });
      }
      const [saved] = await response.json().catch(() => [payload]);
      return res.status(req.method === "POST" ? 201 : 200).json({ item: mapRow(saved) });
    }

    if (req.method === "DELETE") {
      const id = String(req.query?.id || "").trim();
      if (!id) return res.status(400).json({ message: "Missing item id" });

      // Clean up Supabase Storage first
      const getUrl = `${supabaseUrl}/rest/v1/jewelry_items?id=eq.${encodeURIComponent(id)}&select=*`;
      const itemResp = await fetch(getUrl, { headers });
      const [item] = await itemResp.json().catch(() => []);
      
      if (item) {
        const metalImages = normalizeMetalImages(item.metal_images, item.image_url);
        const galleryImages = normalizeGalleryImages(parseJsonField(item.gallery_images, []));
        const filesToDelete = [
          ...Object.values(metalImages).flat(),
          ...galleryImages,
          item.video_url,
          item.model_url
        ].filter(Boolean);

        for (const fileUrl of filesToDelete) {
          const path = extractStoragePath(fileUrl);
          if (path) {
            const isModel = path.startsWith("models/");
            await deleteSupabaseFile(path, isModel ? SUPABASE_MODEL_BUCKET : SUPABASE_IMAGE_BUCKET);
          }
        }
      }

      const response = await fetch(`${supabaseUrl}/rest/v1/jewelry_items?id=eq.${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers
      });
      return res.status(200).json({ deleted: true, id });
    }
  }

  if (!hasConfiguredDatabase) {
    if (req.method === "GET") {
      const items = await listLocalJewelryItems({
        category: String(req.query?.category || "").trim(),
        inventoryStatus: String(req.query?.status || "").trim(),
        search: String(req.query?.search || "").trim(),
      });
      return res.status(200).json({ items: items.map(mapLocalItem), local: true });
    }

    if (req.method === "POST" || req.method === "PUT") {
      const item = normalizeItemPayload(req.body ?? {});
      if (!isValidItem(item)) {
        return res.status(400).json({ message: "Missing or invalid jewelry fields" });
      }
      const saved = await upsertLocalJewelryItem(item);
      return res.status(req.method === "POST" ? 201 : 200).json({ item: mapLocalItem(saved), local: true });
    }

    if (req.method === "DELETE") {
      const id = String(req.query?.id || "").trim();
      if (!id) {
        return res.status(400).json({ message: "Missing item id" });
      }
      await deleteLocalJewelryItem(id);
      return res.status(200).json({ deleted: true, id, local: true });
    }
  }

  await ensureCoreTables();

  if (req.method === "GET") {
    const category = String(req.query?.category || "").trim();
    const search = String(req.query?.search || "").trim();
    const status = String(req.query?.status || "").trim();

    const rows = await sql`
      SELECT
        id, name, category, subcategory, metal, price, image_url, description,
        collection, stone_type, diamond_weight, setting, tags, metal_images,
        gallery_images, video_url, model_url, inventory_status, sort_order,
        is_featured, is_active, created_at, updated_at
      FROM jewelry_items
      WHERE (${category} = '' OR category = ${category})
        AND (${status} = '' OR inventory_status = ${status})
        AND (
          ${search} = ''
          OR id ILIKE ${`%${search}%`}
          OR name ILIKE ${`%${search}%`}
          OR category ILIKE ${`%${search}%`}
          OR subcategory ILIKE ${`%${search}%`}
          OR metal ILIKE ${`%${search}%`}
          OR collection ILIKE ${`%${search}%`}
          OR tags ILIKE ${`%${search}%`}
        )
      ORDER BY sort_order ASC, updated_at DESC;
    `;
    return res.status(200).json({ items: rows.map(mapRow) });
  }

  if (req.method === "POST") {
    const item = normalizeItemPayload(req.body ?? {});
    if (!isValidItem(item)) {
      return res.status(400).json({ message: "Missing or invalid jewelry fields" });
    }

    const [row] = await sql`
      INSERT INTO jewelry_items (
        id, name, category, subcategory, metal, price, image_url, description,
        collection, stone_type, diamond_weight, setting, tags, metal_images,
        gallery_images, video_url, model_url, inventory_status, sort_order,
        is_featured, is_active, updated_at
      )
      VALUES (
        ${item.id}, ${item.name}, ${item.category}, ${item.subcategory || null},
        ${item.metal}, ${item.price}, ${item.imageUrl}, ${item.description || null},
        ${item.collection || null}, ${item.stoneType || null}, ${item.diamondWeight || null},
        ${item.setting || null}, ${item.tags || null}, ${JSON.stringify(item.metalImages)}::jsonb,
        ${JSON.stringify(item.galleryImages)}::jsonb, ${item.videoUrl || null},
        ${item.modelUrl || null}, ${item.inventoryStatus}, ${item.sortOrder},
        ${item.isFeatured}, ${item.isActive}, NOW()
      )
      RETURNING *;
    `;
    return res.status(201).json({ item: mapRow(row) });
  }

  if (req.method === "PUT") {
    const item = normalizeItemPayload(req.body ?? {});
    if (!item.id) return res.status(400).json({ message: "Missing item id" });
    if (!isValidItem(item)) return res.status(400).json({ message: "Missing or invalid jewelry fields" });

    const [row] = await sql`
      UPDATE jewelry_items
      SET
        name = ${item.name}, category = ${item.category}, subcategory = ${item.subcategory || null},
        metal = ${item.metal}, price = ${item.price}, image_url = ${item.imageUrl},
        description = ${item.description || null}, collection = ${item.collection || null},
        stone_type = ${item.stoneType || null}, diamond_weight = ${item.diamondWeight || null},
        setting = ${item.setting || null}, tags = ${item.tags || null},
        metal_images = ${JSON.stringify(item.metalImages)}::jsonb,
        gallery_images = ${JSON.stringify(item.galleryImages)}::jsonb,
        video_url = ${item.videoUrl || null}, model_url = ${item.modelUrl || null},
        inventory_status = ${item.inventoryStatus}, sort_order = ${item.sortOrder},
        is_featured = ${item.isFeatured}, is_active = ${item.isActive}, updated_at = NOW()
      WHERE id = ${item.id}
      RETURNING *;
    `;
    if (!row) return res.status(404).json({ message: "Jewelry item not found" });
    return res.status(200).json({ item: mapRow(row) });
  }

  if (req.method === "DELETE") {
    const id = String(req.query?.id || "").trim();
    if (!id) return res.status(400).json({ message: "Missing item id" });

    // Fetch item first to get file paths for cleanup
    const [item] = await sql`SELECT * FROM jewelry_items WHERE id = ${id};`;
    if (item) {
      const metalImages = normalizeMetalImages(item.metal_images, item.image_url);
      const galleryImages = normalizeGalleryImages(parseJsonField(item.gallery_images, []));
      
      const allFileUrls = [
        ...Object.values(metalImages).flat(),
        ...galleryImages,
        item.video_url,
        item.model_url,
      ].filter(Boolean);

      // Batch delete all associated files from Supabase Storage
      await deleteStorageFiles(allFileUrls);
    }

    await sql`DELETE FROM jewelry_items WHERE id = ${id};`;
    return res.status(200).json({ deleted: true, id });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
