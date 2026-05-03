import crypto from "node:crypto";
import path from "node:path";
import { requireAdmin } from "../admin-auth.js";
import { cachePolicies, rejectIfCrossOriginWrite, setCommonSecurityHeaders, setCorsForRequest } from "../security.js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_IMAGE_BUCKET = process.env.SUPABASE_IMAGE_BUCKET || process.env.SUPABASE_BUCKET || "jewelry-assets";
const SUPABASE_MODEL_BUCKET = process.env.SUPABASE_MODEL_BUCKET || process.env.SUPABASE_BUCKET || "jewelry-assets";

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const ALLOWED_FOLDERS = new Set(["images", "models"]);

const parseDataUrl = (dataUrl, fallbackType) => {
  if (!dataUrl || !dataUrl.startsWith("data:")) return null;
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

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ message: "Supabase upload is not configured" });
  }

  const { dataUrl, fileName, contentType, folder } = req.body || {};
  const targetFolder = String(folder || "").trim().toLowerCase();

  if (!ALLOWED_FOLDERS.has(targetFolder)) {
    return res.status(400).json({ message: "Invalid upload folder" });
  }

  const parsed = parseDataUrl(String(dataUrl || ""), contentType);
  if (!parsed) {
    return res.status(400).json({ message: "Invalid file payload" });
  }

  if (parsed.buffer.length > MAX_UPLOAD_BYTES) {
    return res.status(413).json({ message: `File too large. Please keep files under 3MB.` });
  }

  const safeName = sanitizeFilename(String(fileName || ""));
  const ext = path.extname(safeName) || "";
  const base = safeName.replace(ext, "");
  const key = `${targetFolder}/${base}-${crypto.randomUUID()}${ext}`;

  try {
    const bucket = targetFolder === "models" ? SUPABASE_MODEL_BUCKET : SUPABASE_IMAGE_BUCKET;
    const uploadUrl = `${SUPABASE_URL.replace(/\/$/, "")}/storage/v1/object/${bucket}/${key}`;

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
      const text = await response.text().catch(() => "Unknown error");
      console.error("Supabase Storage Error:", {
        status: response.status,
        statusText: response.statusText,
        body: text,
        url: uploadUrl.replace(SUPABASE_SERVICE_ROLE_KEY || "", "***")
      });
      return res.status(500).json({ 
        message: "Supabase upload failed", 
        details: text,
        status: response.status
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
      stack: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.stack : undefined) : undefined
    });
  }
}
