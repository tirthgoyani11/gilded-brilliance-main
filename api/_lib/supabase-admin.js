import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_IMAGE_BUCKET = process.env.SUPABASE_IMAGE_BUCKET || process.env.SUPABASE_BUCKET || "jewelry-assets";
const SUPABASE_MODEL_BUCKET = process.env.SUPABASE_MODEL_BUCKET || process.env.SUPABASE_BUCKET || "jewelry-assets";

let _client = null;

/**
 * Returns a Supabase admin client using the service_role key.
 * This client bypasses Row Level Security (RLS).
 * Returns null if environment variables are not set.
 */
export const getSupabaseAdmin = () => {
  if (_client) return _client;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  _client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return _client;
};

export const hasSupabase = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
export { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_IMAGE_BUCKET, SUPABASE_MODEL_BUCKET };

/**
 * Extract the storage path from a Supabase public URL.
 * e.g. "https://xxx.supabase.co/storage/v1/object/public/jewelry-assets/images/foo.jpg"
 *   → "images/foo.jpg"
 */
export const extractStoragePath = (url) => {
  if (!url || typeof url !== "string") return null;
  const marker = "/storage/v1/object/public/";
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  const afterMarker = url.substring(idx + marker.length);
  // Remove the bucket name prefix
  const slashIdx = afterMarker.indexOf("/");
  if (slashIdx === -1) return null;
  return afterMarker.substring(slashIdx + 1);
};

/**
 * Delete a file from Supabase Storage.
 */
export const deleteStorageFile = async (filePath, bucket) => {
  const supabase = getSupabaseAdmin();
  if (!supabase || !filePath) return;
  try {
    const { error } = await supabase.storage.from(bucket || SUPABASE_IMAGE_BUCKET).remove([filePath]);
    if (error) console.warn(`Storage delete failed for "${filePath}":`, error.message);
  } catch (err) {
    console.warn(`Storage delete exception for "${filePath}":`, err);
  }
};
