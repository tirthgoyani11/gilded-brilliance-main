import crypto from "node:crypto";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "../admin-auth.js";
import { cachePolicies, rejectIfCrossOriginWrite, setCommonSecurityHeaders, setCorsForRequest } from "../security.js";

const SUPABASE_URL = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const SUPABASE_IMAGE_BUCKET = process.env.SUPABASE_IMAGE_BUCKET || "jewelry-assets";
const SUPABASE_MODEL_BUCKET = process.env.SUPABASE_MODEL_BUCKET || "jewelry-assets";

const ALLOWED_FOLDERS = new Set(["images", "models"]);
const ALLOWED_TYPES = new Set([
  "image/jpeg","image/png","image/webp","image/gif","image/svg+xml","image/avif",
  "model/gltf-binary","application/octet-stream",
  "video/mp4","video/webm","video/quicktime",
]);

const generateId = () => crypto.randomBytes(12).toString("hex");

const sanitize = (name) =>
  name.trim().replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "file";

const parseDataUrl = (dataUrl, fallback) => {
  if (!dataUrl || !dataUrl.startsWith("data:")) return null;
  const i = dataUrl.indexOf(",");
  if (i === -1) return null;
  const m = dataUrl.substring(0, i).match(/data:([^;]+)/);
  return {
    contentType: m?.[1] || fallback || "application/octet-stream",
    buffer: Buffer.from(dataUrl.substring(i + 1), "base64"),
  };
};

// Create admin client once
let _admin = null;
const admin = () => {
  if (_admin) return _admin;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  _admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return _admin;
};

export async function handleUpload(req, res) {
  setCommonSecurityHeaders(res, { cacheControl: cachePolicies.privateNoStore });
  setCorsForRequest(req, res, { allowedMethods: "POST,OPTIONS" });
  if (req.method === "OPTIONS") return res.status(204).end();
  if (rejectIfCrossOriginWrite(req, res)) return;
  if (!requireAdmin(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ message: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars." });
  }

  const { dataUrl, fileName, contentType, folder } = req.body || {};
  const targetFolder = String(folder || "").trim().toLowerCase();
  if (!ALLOWED_FOLDERS.has(targetFolder)) {
    return res.status(400).json({ message: "Invalid folder." });
  }

  const parsed = parseDataUrl(String(dataUrl || ""), contentType);
  if (!parsed) return res.status(400).json({ message: "Invalid file data." });
  if (!ALLOWED_TYPES.has(parsed.contentType)) {
    return res.status(400).json({ message: `Type "${parsed.contentType}" not allowed.` });
  }

  const safe = sanitize(String(fileName || ""));
  const ext = path.extname(safe) || "";
  const base = safe.replace(ext, "");
  const key = `${targetFolder}/${base}-${generateId()}${ext}`;
  const bucket = targetFolder === "models" ? SUPABASE_MODEL_BUCKET : SUPABASE_IMAGE_BUCKET;

  // ── Try multiple upload strategies ──────────────────────────────────
  const errors = [];

  // Strategy 1: Official Supabase SDK
  try {
    const sb = admin();
    if (sb) {
      const { data, error } = await sb.storage.from(bucket).upload(key, parsed.buffer, {
        contentType: parsed.contentType, upsert: true,
      });
      if (!error) {
        const { data: pub } = sb.storage.from(bucket).getPublicUrl(key);
        return res.status(200).json({ url: pub?.publicUrl || "", path: data?.path || key, bucket });
      }
      errors.push(`SDK: ${error.message}`);
    }
  } catch (e) { errors.push(`SDK exception: ${e.message}`); }

  // Strategy 2: Direct REST API upload
  try {
    const url = `${SUPABASE_URL}/storage/v1/object/${bucket}/${key}`;
    const r = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        "Content-Type": parsed.contentType,
        "x-upsert": "true",
      },
      body: parsed.buffer,
    });
    if (r.ok) {
      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${key}`;
      return res.status(200).json({ url: publicUrl, path: key, bucket });
    }
    const t = await r.text().catch(() => "");
    errors.push(`REST(${r.status}): ${t}`);
  } catch (e) { errors.push(`REST exception: ${e.message}`); }

  // Strategy 3: Signed upload URL
  try {
    const sb = admin();
    if (sb) {
      const { data: signed, error: sErr } = await sb.storage.from(bucket).createSignedUploadUrl(key);
      if (signed?.signedUrl) {
        const r = await fetch(signed.signedUrl, {
          method: "PUT",
          headers: { "Content-Type": parsed.contentType },
          body: parsed.buffer,
        });
        if (r.ok) {
          const { data: pub } = sb.storage.from(bucket).getPublicUrl(key);
          return res.status(200).json({ url: pub?.publicUrl || "", path: key, bucket });
        }
        errors.push(`Signed upload(${r.status}): ${await r.text().catch(() => "")}`);
      } else {
        errors.push(`Signed URL creation: ${sErr?.message || "failed"}`);
      }
    }
  } catch (e) { errors.push(`Signed exception: ${e.message}`); }

  // All strategies failed
  console.error("All upload strategies failed:", errors);
  return res.status(500).json({
    message: "Upload failed — Supabase Storage RLS is blocking all writes.",
    bucket,
    strategies: errors,
    fix: `Go to Supabase Dashboard → Storage → "${bucket}" → Policies tab → Delete ALL existing policies → Add new policy: Target=service_role, Operation=ALL, USING=true, WITH CHECK=true`,
  });
}
