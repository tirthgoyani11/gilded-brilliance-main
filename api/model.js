import { Readable } from "node:stream";
import { cachePolicies, setCommonSecurityHeaders, setCorsForRequest } from "./_lib/security.js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_MODEL_BUCKET = process.env.SUPABASE_MODEL_BUCKET || process.env.SUPABASE_BUCKET || "jewelry-assets";

const MAX_PATH_LENGTH = 400;

const getQueryValue = (value) => {
  if (Array.isArray(value)) return String(value[0] ?? "");
  return value == null ? "" : String(value);
};

const sanitizePath = (value) => {
  const raw = String(value || "").replace(/^\/+/, "").trim();
  if (!raw || raw.length > MAX_PATH_LENGTH) return "";
  if (raw.includes("..")) return "";
  return raw;
};

const encodePath = (value) =>
  value
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

export default async function handler(req, res) {
  try {
    setCommonSecurityHeaders(res, { cacheControl: cachePolicies.privateNoStore });
    setCorsForRequest(req, res, { allowedMethods: "GET,OPTIONS" });

    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }

    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({ message: "Supabase model proxy is not configured" });
    }

    const rawPath = getQueryValue(req.query?.path);
    const modelPath = sanitizePath(rawPath);

    if (!modelPath) {
      return res.status(400).json({ message: "Missing model path" });
    }

    if (!modelPath.startsWith("models/")) {
      return res.status(403).json({ message: "Invalid model path" });
    }

    const objectUrl = `${SUPABASE_URL.replace(/\/$/, "")}/storage/v1/object/${SUPABASE_MODEL_BUCKET}/${encodePath(modelPath)}`;

    const response = await fetch(objectUrl, {
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        apikey: SUPABASE_SERVICE_ROLE_KEY,
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ message: "Model fetch failed" });
    }

    const contentType = response.headers.get("content-type");
    if (contentType) {
      res.setHeader("Content-Type", contentType);
    }

    const contentLength = response.headers.get("content-length");
    if (contentLength) {
      res.setHeader("Content-Length", contentLength);
    }

    if (response.body) {
      if (typeof Readable.fromWeb === "function") {
        Readable.fromWeb(response.body).pipe(res);
        return;
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      res.end(buffer);
      return;
    }

    return res.status(502).json({ message: "Model response had no body" });
  } catch (error) {
    return res.status(500).json({ message: "Model proxy failed" });
  }
}
