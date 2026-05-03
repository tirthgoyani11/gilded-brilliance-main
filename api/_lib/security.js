import crypto from "node:crypto";

const DEFAULT_ALLOWED_METHODS = "GET,POST,PUT,DELETE,OPTIONS";
const PUBLIC_MAX_AGE = "public, s-maxage=60, stale-while-revalidate=300";
const PRIVATE_NO_STORE = "no-store";

export function setCommonSecurityHeaders(res, options = {}) {
  const cacheControl = options.cacheControl || PRIVATE_NO_STORE;

  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=() ");
  res.setHeader("Cache-Control", cacheControl);
}

export function setCorsForRequest(req, res, options = {}) {
  const allowedMethods = options.allowedMethods || DEFAULT_ALLOWED_METHODS;
  const allowedOrigin = resolveAllowedOrigin(req);

  if (allowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-admin-token");
  res.setHeader("Access-Control-Allow-Methods", allowedMethods);
}

export function resolveAllowedOrigin(req) {
  const envAllowed = String(process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  const host = req.headers.host;
  if (host) {
    envAllowed.push(`https://${host}`);
    envAllowed.push(`http://${host}`);
  }

  const origin = typeof req.headers.origin === "string" ? req.headers.origin : "";
  if (!origin) return envAllowed[0] || "";

  return envAllowed.includes(origin) ? origin : "";
}

export function rejectIfCrossOriginWrite(req, res) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method || "")) {
    return false;
  }

  const origin = typeof req.headers.origin === "string" ? req.headers.origin : "";
  const referer = typeof req.headers.referer === "string" ? req.headers.referer : "";
  const allowed = resolveAllowedOrigin(req);

  if (!allowed) {
    res.status(403).json({ message: "Forbidden origin" });
    return true;
  }

  const originOk = !origin || origin === allowed;
  const refererOk = !referer || referer.startsWith(allowed);

  if (!originOk || !refererOk) {
    res.status(403).json({ message: "Forbidden origin" });
    return true;
  }

  return false;
}

export function constantTimeEqual(left, right) {
  const a = Buffer.from(String(left || ""));
  const b = Buffer.from(String(right || ""));

  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function createMemoryRateLimiter({ windowMs, maxRequests }) {
  const hits = new Map();

  return function isRateLimited(identifier) {
    const now = Date.now();
    const key = String(identifier || "anonymous");
    const record = hits.get(key);

    if (!record || now - record.windowStart >= windowMs) {
      hits.set(key, { windowStart: now, count: 1 });
      return false;
    }

    record.count += 1;
    hits.set(key, record);
    return record.count > maxRequests;
  };
}

export const cachePolicies = {
  publicShort: PUBLIC_MAX_AGE,
  privateNoStore: PRIVATE_NO_STORE,
};
