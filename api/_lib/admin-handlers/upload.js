import crypto from "node:crypto";
import path from "node:path";
import { requireAdmin } from "../admin-auth.js";
import { cachePolicies, rejectIfCrossOriginWrite, setCommonSecurityHeaders, setCorsForRequest } from "../security.js";

// ---------------------------------------------------------------------------
// Environment
// ---------------------------------------------------------------------------
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_IMAGE_BUCKET = process.env.SUPABASE_IMAGE_BUCKET || process.env.SUPABASE_BUCKET || "jewelry-assets";
const SUPABASE_MODEL_BUCKET = process.env.SUPABASE_MODEL_BUCKET || process.env.SUPABASE_BUCKET || "jewelry-assets";

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15 MB raw binary limit
const ALLOWED_FOLDERS = new Set(["images", "models"]);

// Allowed MIME types for security (only images, 3D models, videos)
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml", "image/avif",
  "model/gltf-binary", "application/octet-stream",
  "video/mp4", "video/webm", "video/quicktime",
]);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const generateId = () => {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return crypto.randomBytes(16).toString("hex");
};

const parseDataUrl = (dataUrl, fallbackType) => {
  if (!dataUrl || typeof dataUrl !== "string" || !dataUrl.startsWith("data:")) return null;
  try {
    const commaIndex = dataUrl.indexOf(",");
    if (commaIndex === -1) return null;

    const meta = dataUrl.substring(0, commaIndex);
    const base64Data = dataUrl.substring(commaIndex + 1);

    const mimeMatch = meta.match(/data:([^;]+)/);
    const contentType = mimeMatch ? mimeMatch[1] : fallbackType || "application/octet-stream";

    return {
      contentType,
      buffer: Buffer.from(base64Data, "base64"),
    };
  } catch (err) {
    console.error("DataURL Parse Error:", err);
    return null;
  }
};

const sanitizeFilename = (filename) =>
  filename
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "upload";

const buildPublicUrl = (bucket, filePath) => {
  const base = SUPABASE_URL?.replace(/\/$/, "") || "";
  return `${base}/storage/v1/object/public/${bucket}/${filePath}`;
};

/**
 * Ensure the target bucket exists and is publicly readable.
 * Uses the Supabase Admin Storage API. Silently succeeds if already exists.
 */
const ensureBucketExists = async (bucketId) => {
  const base = SUPABASE_URL.replace(/\/$/, "");
  const headers = {
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    "Content-Type": "application/json",
  };

  // Try to create the bucket (idempotent — 409 means it already exists)
  const createRes = await fetch(`${base}/storage/v1/bucket`, {
    method: "POST",
    headers,
    body: JSON.stringify({ id: bucketId, name: bucketId, public: true }),
  });

  if (createRes.ok) {
    console.log(`Bucket "${bucketId}" created successfully.`);
  } else if (createRes.status === 409) {
    // Bucket already exists — make sure it's public
    await fetch(`${base}/storage/v1/bucket/${bucketId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ public: true }),
    }).catch(() => {});
  } else {
    const text = await createRes.text().catch(() => "");
    console.warn(`Bucket "${bucketId}" ensure failed (${createRes.status}):`, text);
  }
};

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------
export async function handleUpload(req, res) {
  setCommonSecurityHeaders(res, { cacheControl: cachePolicies.privateNoStore });
  setCorsForRequest(req, res, { allowedMethods: "POST,OPTIONS" });

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (rejectIfCrossOriginWrite(req, res)) {
    return;
  }

  if (!requireAdmin(req, res)) {
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // ── Environment checks ──────────────────────────────────────────────
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({
      message: "Supabase upload is not configured",
      hint: "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel environment variables.",
    });
  }

  // ── Parse & validate request body ───────────────────────────────────
  const { dataUrl, fileName, contentType, folder } = req.body || {};
  const targetFolder = String(folder || "").trim().toLowerCase();

  if (!ALLOWED_FOLDERS.has(targetFolder)) {
    return res.status(400).json({ message: "Invalid upload folder. Use 'images' or 'models'." });
  }

  const parsed = parseDataUrl(String(dataUrl || ""), contentType);
  if (!parsed) {
    return res.status(400).json({ message: "Invalid file payload. Expected a Base64 Data URL." });
  }

  // ── Security: validate MIME type ────────────────────────────────────
  if (!ALLOWED_MIME_TYPES.has(parsed.contentType)) {
    return res.status(400).json({
      message: `File type "${parsed.contentType}" is not allowed.`,
      hint: "Allowed types: JPEG, PNG, WebP, GIF, SVG, GLB, MP4, WebM.",
    });
  }

  if (parsed.buffer.length > MAX_UPLOAD_BYTES) {
    return res.status(413).json({
      message: `File too large (${(parsed.buffer.length / 1024 / 1024).toFixed(1)}MB). Max 15MB.`,
    });
  }

  // ── Build unique storage path ───────────────────────────────────────
  const safeName = sanitizeFilename(String(fileName || ""));
  const ext = path.extname(safeName) || "";
  const base = safeName.replace(ext, "");
  const key = `${targetFolder}/${base}-${generateId()}${ext}`;

  try {
    const bucket = targetFolder === "models" ? SUPABASE_MODEL_BUCKET : SUPABASE_IMAGE_BUCKET;
    const supabaseBase = SUPABASE_URL.replace(/\/$/, "");

    // Ensure the bucket exists and is public before uploading
    await ensureBucketExists(bucket);

    // ── Upload via Supabase Storage Admin API ─────────────────────────
    const uploadUrl = `${supabaseBase}/storage/v1/object/${bucket}/${key}`;
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        "Content-Type": parsed.contentType || "application/octet-stream",
        "x-upsert": "true",
      },
      body: parsed.buffer,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      console.error("Supabase Storage Upload Error:", {
        status: response.status,
        body: errorText,
        bucket,
        key,
      });

      // If still getting RLS error, provide actionable fix instructions
      if (response.status === 403 || errorText.includes("row-level security")) {
        return res.status(500).json({
          message: "Supabase Storage permission denied",
          details: "Row Level Security (RLS) is blocking uploads. Please run this SQL in your Supabase SQL Editor:",
          fix: [
            `CREATE POLICY "service_role_all" ON storage.objects FOR ALL TO service_role USING (bucket_id = '${bucket}') WITH CHECK (bucket_id = '${bucket}');`,
            `-- Or disable RLS on storage.objects: ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;`,
          ],
        });
      }

      return res.status(500).json({
        message: "Supabase upload failed",
        details: errorText,
        status: response.status,
      });
    }

    return res.status(200).json({
      url: buildPublicUrl(bucket, key),
      path: key,
      bucket,
    });
  } catch (error) {
    console.error("Upload Handler Exception:", error);
    return res.status(500).json({
      message: "Internal error during upload",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
