import crypto from "node:crypto";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "../admin-auth.js";
import { cachePolicies, rejectIfCrossOriginWrite, setCommonSecurityHeaders, setCorsForRequest } from "../security.js";

// ---------------------------------------------------------------------------
// Environment
// ---------------------------------------------------------------------------
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_IMAGE_BUCKET = process.env.SUPABASE_IMAGE_BUCKET || process.env.SUPABASE_BUCKET || "jewelry-assets";
const SUPABASE_MODEL_BUCKET = process.env.SUPABASE_MODEL_BUCKET || process.env.SUPABASE_BUCKET || "jewelry-assets";

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const ALLOWED_FOLDERS = new Set(["images", "models"]);

// Allowed MIME types for security
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml", "image/avif",
  "model/gltf-binary", "application/octet-stream",
  "video/mp4", "video/webm", "video/quicktime",
]);

// ---------------------------------------------------------------------------
// Supabase Admin Client (service_role bypasses RLS)
// ---------------------------------------------------------------------------
let _supabaseAdmin = null;
const getSupabaseAdmin = () => {
  if (_supabaseAdmin) return _supabaseAdmin;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  _supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return _supabaseAdmin;
};

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
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return res.status(500).json({
      message: "Supabase upload is not configured",
      hint: "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel environment variables.",
    });
  }

  // ── Verify the key is actually a service_role key ───────────────────
  try {
    const parts = SUPABASE_SERVICE_ROLE_KEY.split(".");
    if (parts.length >= 2) {
      const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
      if (payload.role !== "service_role") {
        return res.status(500).json({
          message: `Wrong Supabase key! Your key has role "${payload.role}" but needs "service_role".`,
          hint: "Go to Supabase Dashboard → Settings → API → Copy the 'service_role' key (NOT the 'anon' key).",
        });
      }
    }
  } catch {
    // If we can't decode it, proceed anyway
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
      hint: "Allowed: JPEG, PNG, WebP, GIF, SVG, GLB, MP4, WebM.",
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
  const bucket = targetFolder === "models" ? SUPABASE_MODEL_BUCKET : SUPABASE_IMAGE_BUCKET;

  try {
    // ── Upload using official Supabase client (bypasses RLS) ──────────
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(key, parsed.buffer, {
        contentType: parsed.contentType,
        upsert: true,
      });

    if (error) {
      console.error("Supabase Storage Upload Error:", error);
      return res.status(500).json({
        message: "Supabase upload failed",
        details: error.message || String(error),
      });
    }

    // Build public URL
    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(key);
    const publicUrl = publicUrlData?.publicUrl || "";

    return res.status(200).json({
      url: publicUrl,
      path: data?.path || key,
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
