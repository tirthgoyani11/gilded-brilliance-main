import { Readable } from "node:stream";
import { cachePolicies, setCommonSecurityHeaders, setCorsForRequest } from "../security.js";

const DRIVE_HOSTS = new Set(["drive.google.com", "www.drive.google.com", "drive.usercontent.google.com"]);

const getQueryValue = (value) => {
  if (Array.isArray(value)) return String(value[0] ?? "");
  return value == null ? "" : String(value);
};

const extractDriveId = (rawUrl) => {
  try {
    const url = new URL(rawUrl);
    if (!DRIVE_HOSTS.has(url.hostname)) return "";
    const fileMatch = url.pathname.match(/\/file\/d\/([^/]+)/i);
    if (fileMatch?.[1]) return fileMatch[1];
    const id = url.searchParams.get("id");
    return id || "";
  } catch {
    return "";
  }
};

const buildDownloadUrl = (id, confirmToken) => {
  const url = new URL("https://drive.google.com/uc");
  url.searchParams.set("export", "download");
  url.searchParams.set("id", id);
  if (confirmToken) url.searchParams.set("confirm", confirmToken);
  return url.toString();
};

const extractConfirmUrl = (html, id) => {
  const hrefMatch = html.match(/href=\"(\/uc\?export=download[^\"]+)\"/i);
  if (hrefMatch?.[1]) {
    const decoded = hrefMatch[1].replace(/&amp;/g, "&");
    return decoded.startsWith("http") ? decoded : `https://drive.google.com${decoded}`;
  }
  const confirmMatch = html.match(/confirm=([0-9A-Za-z_]+)&/i) || html.match(/name=\"confirm\"\s+value=\"([^\"]+)\"/i);
  if (confirmMatch?.[1]) return buildDownloadUrl(id, confirmMatch[1]);
  return "";
};

const fetchDriveFile = async (id) => {
  let response = await fetch(buildDownloadUrl(id), { redirect: "follow" });
  const contentType = response.headers.get("content-type") || "";
  if (response.ok && contentType.includes("text/html")) {
    const html = await response.text();
    const confirmUrl = extractConfirmUrl(html, id);
    if (confirmUrl) response = await fetch(confirmUrl, { redirect: "follow" });
  }
  return response;
};

export async function handleDriveProxy(req, res) {
  setCommonSecurityHeaders(res, { cacheControl: cachePolicies.publicShort });
  setCorsForRequest(req, res, { allowedMethods: "GET,OPTIONS" });

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  const rawId = getQueryValue(req.query?.id);
  const rawUrl = getQueryValue(req.query?.url);
  const driveId = rawId || extractDriveId(rawUrl) || "";

  if (!driveId) return res.status(400).json({ message: "Missing or invalid Google Drive file id." });

  const response = await fetchDriveFile(driveId);
  if (!response.ok) return res.status(response.status).json({ message: "Drive download failed." });

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("text/html")) return res.status(403).json({ message: "Drive file is not publicly accessible." });

  res.status(200);
  res.setHeader("Content-Type", contentType || "application/octet-stream");
  const contentLength = response.headers.get("content-length");
  if (contentLength) res.setHeader("Content-Length", contentLength);
  const disposition = response.headers.get("content-disposition");
  if (disposition) res.setHeader("Content-Disposition", disposition);

  if (response.body) {
    if (typeof Readable.fromWeb === "function") {
      Readable.fromWeb(response.body).pipe(res);
      return;
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    res.end(buffer);
    return;
  }
  res.status(502).json({ message: "Drive response had no body." });
}
