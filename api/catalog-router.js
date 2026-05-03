import { handleDiamonds } from "./_lib/public-handlers/diamonds.js";
import { handleJewelry } from "./_lib/public-handlers/jewelry.js";
import { handleContent } from "./_lib/public-handlers/content.js";
import { handleModel } from "./_lib/public-handlers/model.js";
import { handleDriveProxy } from "./_lib/public-handlers/drive-proxy.js";
import { handleUserState } from "./_lib/public-handlers/user-state.js";

export default async function handler(req, res) {
  try {
    const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
    let action = searchParams.get("action") || req.query?.action;

    if (!action) {
      const parts = req.url.split('?')[0].split('/');
      action = parts[parts.length - 1];
    }

    switch (action) {
      case "diamonds":
        return await handleDiamonds(req, res);
      case "jewelry":
        return await handleJewelry(req, res);
      case "content":
        return await handleContent(req, res);
      case "model":
        return await handleModel(req, res);
      case "drive-proxy":
        return await handleDriveProxy(req, res);
      case "user-state":
        return await handleUserState(req, res);
      default:
        return res.status(404).json({ message: `Catalog action "${action}" not found` });
    }
  } catch (error) {
    console.error("Catalog Router Error:", error);
    return res.status(500).json({ 
      message: "An internal error occurred in the catalog router",
      error: error.message 
    });
  }
}
