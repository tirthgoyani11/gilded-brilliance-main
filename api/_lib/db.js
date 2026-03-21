import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DATABASE_URL. Set it in Vercel project environment variables.");
}

export const sql = neon(connectionString);

export async function ensureDiamondsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS diamonds (
      stone_id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      shape TEXT NOT NULL,
      carat DOUBLE PRECISION NOT NULL,
      color TEXT NOT NULL,
      clarity TEXT NOT NULL,
      cut TEXT NOT NULL,
      polish TEXT NOT NULL,
      symmetry TEXT NOT NULL,
      fluorescence TEXT NOT NULL,
      price DOUBLE PRECISION NOT NULL,
      ratio DOUBLE PRECISION NOT NULL,
      depth_pct DOUBLE PRECISION NOT NULL,
      table_pct DOUBLE PRECISION NOT NULL,
      measurements TEXT NOT NULL,
      cert_lab TEXT NOT NULL,
      cert_number TEXT NOT NULL,
      cert_link TEXT,
      image_url TEXT NOT NULL,
      video_url TEXT,
      v360_stone_id TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_diamonds_shape ON diamonds(shape);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_diamonds_price ON diamonds(price);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_diamonds_carat ON diamonds(carat);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_diamonds_cert_number ON diamonds(cert_number);`;
}

export async function ensureImportLogsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS import_logs (
      id BIGSERIAL PRIMARY KEY,
      source TEXT,
      total_rows INTEGER NOT NULL,
      created_rows INTEGER NOT NULL,
      updated_rows INTEGER NOT NULL,
      failed_rows INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL,
      error_message TEXT,
      details JSONB DEFAULT '{}'::jsonb,
      reverted_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  try {
    await sql`ALTER TABLE import_logs ADD COLUMN IF NOT EXISTS details JSONB DEFAULT '{}'::jsonb;`;
    await sql`ALTER TABLE import_logs ADD COLUMN IF NOT EXISTS reverted_at TIMESTAMPTZ;`;
  } catch (err) {
    // Ignore schema modification errors if running restricted permissions
  }

  await sql`CREATE INDEX IF NOT EXISTS idx_import_logs_created_at ON import_logs(created_at DESC);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_import_logs_status ON import_logs(status);`;
}

export async function ensureCmsContentTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS cms_content (
      content_key TEXT PRIMARY KEY,
      payload JSONB NOT NULL DEFAULT '{}'::jsonb,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
}

export async function ensureJewelryTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS jewelry_items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      metal TEXT NOT NULL,
      price DOUBLE PRECISION NOT NULL,
      image_url TEXT NOT NULL,
      description TEXT,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_jewelry_items_category ON jewelry_items(category);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_jewelry_items_active ON jewelry_items(is_active);`;
}

export async function ensureUserStateTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS user_state (
      client_id TEXT PRIMARY KEY,
      cart JSONB NOT NULL DEFAULT '[]'::jsonb,
      wishlist JSONB NOT NULL DEFAULT '[]'::jsonb,
      compare JSONB NOT NULL DEFAULT '[]'::jsonb,
      ring_builder JSONB NOT NULL DEFAULT '{}'::jsonb,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_user_state_updated_at ON user_state(updated_at DESC);`;
}

export async function ensureCoreTables() {
  await ensureDiamondsTable();
  await ensureImportLogsTable();
  await ensureCmsContentTable();
  await ensureJewelryTable();
  await ensureUserStateTable();
}

export async function createImportLog({ source, totalRows, createdRows, updatedRows, failedRows, status, errorMessage, details }) {
  await ensureImportLogsTable();

  const [inserted] = await sql`
    INSERT INTO import_logs (
      source,
      total_rows,
      created_rows,
      updated_rows,
      failed_rows,
      status,
      error_message,
      details
    ) VALUES (
      ${source ?? null},
      ${Number(totalRows) || 0},
      ${Number(createdRows) || 0},
      ${Number(updatedRows) || 0},
      ${Number(failedRows) || 0},
      ${String(status || "success")},
      ${errorMessage ?? null},
      ${details ? JSON.stringify(details) : '{}'}::jsonb
    ) RETURNING id;
  `;
  return inserted;
}
