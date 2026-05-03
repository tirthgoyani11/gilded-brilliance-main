import crypto from "node:crypto";
import path from "node:path";
import { requireAdmin } from "../admin-auth.js";
import { getSupabaseAdmin, SUPABASE_IMAGE_BUCKET, SUPABASE_MODEL_BUCKET } from "../supabase-admin.js";
import { cachePolicies, rejectIfCrossOriginWrite, setCommonSecurityHeaders, setCorsForRequest } from "../security.js";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const MAX_UPLOAD_BYTES = 4.5 * 1024 * 1024; // 4.5 MB (Vercel payload limit after base64 encoding)

/** Allowed upload sub-folders inside a storage bucket. */
const ALLOWED_FOLDERS = new Set(["images", "models"]);

/**
 * MIME type whitelist — only these file types can be uploaded.
 * Organized by category for clarity.
 */
const ALLOWED_MIME_TYPES = {
  // Photography & product images
  "image/jpeg": { ext: ".jpg", category: "images" },
  "image/png": { ext: ".png", category: "images" },
  "image/webp": { ext: ".webp", category: "images" },
  "image/avif": { ext: ".avif", category: "images" },
  "image/gif": { ext: ".gif", category: "images" },
  "image/svg+xml": { ext: ".svg", category: "images" },

  // 3D models (GLB / glTF)
  "model/gltf-binary": { ext: ".glb", category: "models" },
  "application/octet-stream": { ext: "", category: "models" },

  // Product videos
  "video/mp4": { ext: ".mp4", category: "images" },
  "video/webm": { ext: ".webm", category: "images" },
  "video/quicktime": { ext: ".mov", category: "images" },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Generate a short unique ID for file deduplication. */
const generateId = () => crypto.randomBytes(8).toString("hex");

/**
 * Sanitize a filename to only contain safe characters.
 * Prevents path traversal and shell injection attacks.
 */
const sanitizeFilename = (filename) =>
  filename
    .trim()
    .replace(/\.\./g, "") // block path traversal
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "upload";

/**
 * Parse a Base64 Data URL into a buffer and content type.
 * Example: "data:image/jpeg;base64,/9j/4AAQ..." → { contentType, buffer }
 */
const parseDataUrl = (dataUrl, fallbackType) => {
  if (!dataUrl || typeof dataUrl !== "string" || !dataUrl.startsWith("data:")) {
    return null;
  }

  const commaIndex = dataUrl.indexOf(",");
  if (commaIndex === -1) return null;

  try {
    const meta = dataUrl.substring(0, commaIndex);
    const base64Data = dataUrl.substring(commaIndex + 1);
    const mimeMatch = meta.match(/data:([^;]+)/);
    const contentType = mimeMatch?.[1] || fallbackType || "application/octet-stream";

    return {
      contentType,
      buffer: Buffer.from(base64Data, "base64"),
    };
  } catch {
    return null;
  }
};

/**
 * Build a date-based sub-path for organized storage.
 * Example: "images/2026/05/ring-photo-a1b2c3d4.jpg"
 */
const buildStoragePath = (folder, filename) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const safe = sanitizeFilename(filename);
  const ext = path.extname(safe) || "";
  const base = safe.replace(ext, "");

  return `${folder}/${year}/${month}/${base}-${generateId()}${ext}`;
};

// ---------------------------------------------------------------------------
// Upload Handler
// ---------------------------------------------------------------------------

export async function handleUpload(req, res) {
  // ── Security headers & CORS ─────────────────────────────────────────
  setCommonSecurityHeaders(res, { cacheControl: cachePolicies.privateNoStore });
  setCorsForRequest(req, res, { allowedMethods: "POST,OPTIONS" });

  if (req.method === "OPTIONS") return res.status(204).end();
  if (rejectIfCrossOriginWrite(req, res)) return;
  if (!requireAdmin(req, res)) return;
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // ── Verify Supabase configuration ───────────────────────────────────
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return res.status(500).json({
      message: "Supabase is not configured.",
      hint: "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (the secret service_role key, NOT the anon/publishable key) in your Vercel environment variables.",
    });
  }

  // ── Parse request body ──────────────────────────────────────────────
  const { dataUrl, fileName, contentType, folder } = req.body || {};
  const targetFolder = String(folder || "").trim().toLowerCase();

  if (!ALLOWED_FOLDERS.has(targetFolder)) {
    return res.status(400).json({
      message: `Invalid folder "${targetFolder}".`,
      hint: "Allowed folders: images, models.",
    });
  }

  // ── Parse and validate file ─────────────────────────────────────────
  const parsed = parseDataUrl(String(dataUrl || ""), contentType);
  if (!parsed) {
    return res.status(400).json({ message: "Invalid or missing file data." });
  }

  // Validate MIME type
  const typeInfo = ALLOWED_MIME_TYPES[parsed.contentType];
  if (!typeInfo) {
    return res.status(400).json({
      message: `File type "${parsed.contentType}" is not allowed.`,
      hint: "Allowed: JPEG, PNG, WebP, AVIF, GIF, SVG, GLB, MP4, WebM, MOV.",
    });
  }

  // Validate file size
  if (parsed.buffer.length > MAX_UPLOAD_BYTES) {
    const sizeMB = (parsed.buffer.length / 1024 / 1024).toFixed(1);
    return res.status(413).json({
      message: `File is ${sizeMB}MB — max allowed is 15MB.`,
    });
  }

  // Validate empty files
  if (parsed.buffer.length === 0) {
    return res.status(400).json({ message: "File is empty." });
  }

  // ── Build organized storage path ────────────────────────────────────
  const key = buildStoragePath(targetFolder, String(fileName || "upload"));
  const bucket = targetFolder === "models" ? SUPABASE_MODEL_BUCKET : SUPABASE_IMAGE_BUCKET;

  // ── Upload to Supabase Storage ──────────────────────────────────────
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(key, parsed.buffer, {
        contentType: parsed.contentType,
        upsert: true,
      });

    if (error) {
      console.error("Supabase upload error:", { bucket, key, error: error.message });

      // Provide clear fix for common issues
      if (error.message.includes("row-level security") || error.message.includes("Unauthorized")) {
        return res.status(500).json({
          message: "Storage permission denied.",
          hint: "Make sure SUPABASE_SERVICE_ROLE_KEY contains the service_role key (Settings → API → service_role), NOT the anon/publishable key.",
        });
      }

      return res.status(500).json({
        message: "Upload failed.",
        details: error.message,
      });
    }

    // Build the public URL for the uploaded file
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(key);

    return res.status(200).json({
      url: urlData?.publicUrl || "",
      path: data?.path || key,
      bucket,
    });
  } catch (error) {
    console.error("Upload exception:", error);
    return res.status(500).json({
      message: "Internal upload error.",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
