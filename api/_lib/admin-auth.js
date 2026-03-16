const defaultToken = "vmora-admin-2026";

export function requireAdmin(req, res) {
  const expected = process.env.ADMIN_TOKEN || defaultToken;
  const provided = req.headers["x-admin-token"];

  if (!provided || provided !== expected) {
    res.status(401).json({
      message: "Unauthorized admin request",
      hint: "Set x-admin-token header with your admin token.",
    });
    return false;
  }

  return true;
}
