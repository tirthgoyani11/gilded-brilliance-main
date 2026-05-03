import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Environment
// ---------------------------------------------------------------------------
const SUPABASE_URL = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const SUPABASE_IMAGE_BUCKET = process.env.SUPABASE_IMAGE_BUCKET || "jewelry-assets";
const SUPABASE_MODEL_BUCKET = process.env.SUPABASE_MODEL_BUCKET || "jewelry-assets";

// ---------------------------------------------------------------------------
// Singleton Admin Client (service_role — bypasses RLS)
// ---------------------------------------------------------------------------
let _client = null;

/**
 * Returns a Supabase admin client using the service_role key.
 * This client bypasses Row Level Security (RLS).
 * Returns null if environment variables are not configured.
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

// ---------------------------------------------------------------------------
// Storage Helpers
// ---------------------------------------------------------------------------

/**
 * Extract the storage path from a Supabase public URL.
 * Example:
 *   "https://xxx.supabase.co/storage/v1/object/public/jewelry-assets/images/ring-abc.jpg"
 *   → "images/ring-abc.jpg"
 */
export const extractStoragePath = (url) => {
  if (!url || typeof url !== "string") return null;
  const marker = "/storage/v1/object/public/";
  const idx = url.indexOf(marker);
  if (idx === -1) return null;

  const afterMarker = url.substring(idx + marker.length);
  const slashIdx = afterMarker.indexOf("/");
  if (slashIdx === -1) return null;

  return afterMarker.substring(slashIdx + 1);
};

/**
 * Determine the correct bucket for a storage path.
 */
export const getBucketForPath = (filePath) => {
  if (!filePath) return SUPABASE_IMAGE_BUCKET;
  return filePath.startsWith("models/") ? SUPABASE_MODEL_BUCKET : SUPABASE_IMAGE_BUCKET;
};

/**
 * Delete a file from Supabase Storage.
 * Silently handles errors to prevent cascading failures.
 */
export const deleteStorageFile = async (filePath, bucket) => {
  const supabase = getSupabaseAdmin();
  if (!supabase || !filePath) return;

  const targetBucket = bucket || getBucketForPath(filePath);
  try {
    const { error } = await supabase.storage.from(targetBucket).remove([filePath]);
    if (error) console.warn(`Storage delete warning for "${filePath}":`, error.message);
  } catch (err) {
    console.warn(`Storage delete exception for "${filePath}":`, err.message);
  }
};

/**
 * Delete multiple files from Supabase Storage.
 * Groups files by bucket for efficient batch deletion.
 */
export const deleteStorageFiles = async (urls) => {
  if (!urls || urls.length === 0) return;

  const byBucket = new Map();
  for (const url of urls) {
    const path = extractStoragePath(url);
    if (!path) continue;
    const bucket = getBucketForPath(path);
    if (!byBucket.has(bucket)) byBucket.set(bucket, []);
    byBucket.get(bucket).push(path);
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  for (const [bucket, paths] of byBucket) {
    try {
      const { error } = await supabase.storage.from(bucket).remove(paths);
      if (error) console.warn(`Batch delete warning (${bucket}):`, error.message);
    } catch (err) {
      console.warn(`Batch delete exception (${bucket}):`, err.message);
    }
  }
};

// Re-export env values for use by other handlers
export { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_IMAGE_BUCKET, SUPABASE_MODEL_BUCKET };
