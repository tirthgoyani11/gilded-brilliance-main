import { handleStats } from "./_lib/admin-handlers/stats.js";
import { handleUpload } from "./_lib/admin-handlers/upload.js";
import { handleContent } from "./_lib/admin-handlers/content.js";
import { handleJewelry } from "./_lib/admin-handlers/jewelry.js";
import { handleDiamondsList } from "./_lib/admin-handlers/diamonds-list.js";
import { handleDiamondsDelete } from "./_lib/admin-handlers/diamonds-delete.js";
import { handleImports } from "./_lib/admin-handlers/imports.js";
import { handleImportRevert } from "./_lib/admin-handlers/import-revert.js";
import { handleImportDiamonds } from "./_lib/admin-handlers/import-diamonds.js";

export default async function handler(req, res) {
  try {
    // Determine the action from query parameter or URL path
    const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
    let action = searchParams.get("action") || req.query?.action;

    // If no action in query, try to infer from the request URL (for rewrites)
    if (!action) {
      const parts = req.url.split('?')[0].split('/');
      const lastPart = parts[parts.length - 1];
      if (lastPart.startsWith('admin-')) {
        action = lastPart.replace('admin-', '');
      }
    }

    if (!action) {
      return res.status(400).json({ message: "Admin action is required" });
    }

    switch (action) {
      case "stats":
        return await handleStats(req, res);
      case "upload":
        return await handleUpload(req, res);
      case "content":
        return await handleContent(req, res);
      case "jewelry":
        return await handleJewelry(req, res);
      case "diamonds-list":
        return await handleDiamondsList(req, res);
      case "diamonds-delete":
        return await handleDiamondsDelete(req, res);
      case "imports":
        return await handleImports(req, res);
      case "import-revert":
        return await handleImportRevert(req, res);
      case "import-diamonds":
        return await handleImportDiamonds(req, res);
      default:
        return res.status(404).json({ message: `Admin action "${action}" not found` });
    }
  } catch (error) {
    console.error("Admin Router Error:", error);
    return res.status(500).json({ 
      message: "An internal error occurred in the admin router",
      error: error.message 
    });
  }
}
