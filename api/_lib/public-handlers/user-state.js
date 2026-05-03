import { ensureUserStateTable, sql } from "../db.js";
import {
  cachePolicies,
  createMemoryRateLimiter,
  rejectIfCrossOriginWrite,
  setCommonSecurityHeaders,
  setCorsForRequest,
} from "../security.js";

const normalizeClientId = (value) => {
  const clientId = typeof value === "string" ? value.trim() : "";
  return clientId.length >= 8 && clientId.length <= 128 ? clientId : "";
};

const sanitizeArray = (value, maxItems) => {
  if (!Array.isArray(value)) return [];
  return value.slice(0, maxItems);
};

const tooLargeBody = (body) => {
  try {
    return JSON.stringify(body || {}).length > 1_000_000;
  } catch {
    return true;
  }
};

const isRateLimited = createMemoryRateLimiter({ windowMs: 60_000, maxRequests: 120 });

const toState = (row) => ({
  cart: Array.isArray(row?.cart) ? row.cart : [],
  wishlist: Array.isArray(row?.wishlist) ? row.wishlist : [],
  compare: Array.isArray(row?.compare) ? row.compare : [],
  updatedAt: row?.updated_at ?? null,
});

export async function handleUserState(req, res) {
  setCommonSecurityHeaders(res, { cacheControl: cachePolicies.privateNoStore });
  setCorsForRequest(req, res, { allowedMethods: "GET,POST,OPTIONS" });

  if (req.method === "OPTIONS") return res.status(204).end();

  const requester = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "anonymous";
  if (isRateLimited(requester)) return res.status(429).json({ message: "Too many requests" });

  if (rejectIfCrossOriginWrite(req, res)) return;

  await ensureUserStateTable();

  if (req.method === "GET") {
    const clientId = normalizeClientId(req.query?.clientId);
    if (!clientId) return res.status(400).json({ message: "Missing or invalid clientId" });

    const [row] = await sql`
      SELECT cart, wishlist, compare, updated_at
      FROM user_state
      WHERE client_id = ${clientId}
      LIMIT 1;
    `;
    return res.status(200).json({ state: row ? toState(row) : null });
  }

  if (req.method === "POST") {
    if (tooLargeBody(req.body)) return res.status(413).json({ message: "Payload too large" });

    const clientId = normalizeClientId(req.body?.clientId);
    if (!clientId) return res.status(400).json({ message: "Missing or invalid clientId" });

    const cart = sanitizeArray(req.body?.cart, 200);
    const wishlist = sanitizeArray(req.body?.wishlist, 200);
    const compare = sanitizeArray(req.body?.compare, 20);

    const [row] = await sql`
      INSERT INTO user_state (client_id, cart, wishlist, compare, updated_at)
      VALUES (
        ${clientId}, ${JSON.stringify(cart)}::jsonb, ${JSON.stringify(wishlist)}::jsonb,
        ${JSON.stringify(compare)}::jsonb, NOW()
      )
      ON CONFLICT (client_id)
      DO UPDATE SET
        cart = EXCLUDED.cart, wishlist = EXCLUDED.wishlist, compare = EXCLUDED.compare, updated_at = NOW()
      RETURNING *;
    `;
    return res.status(200).json({ state: toState(row) });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
