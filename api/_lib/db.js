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
