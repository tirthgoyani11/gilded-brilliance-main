import { constantTimeEqual } from "./security.js";

export function requireAdmin(req, res) {
  const expected = process.env.ADMIN_TOKEN;
  const provided = req.headers["x-admin-token"];

  if (!expected) {
    res.status(500).json({
      message: "Admin auth is not configured",
      hint: "Set ADMIN_TOKEN in environment variables.",
    });
    return false;
  }

  if (!provided || !constantTimeEqual(provided, expected)) {
    res.status(401).json({
      message: "Unauthorized admin request",
      hint: "Set x-admin-token header with your admin token.",
    });
    return false;
  }

  return true;
}
