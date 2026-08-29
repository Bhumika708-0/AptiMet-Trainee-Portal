import dotenv from "dotenv";
import path from "path"; 
import { fileURLToPath } from "url"; 
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

// Use DATABASE_URL from environment, or fallback to local postgres connection string
const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/aptimet";

export const pool = new Pool({
  connectionString,
  // Low timeout so it fails quickly if no external db is available
  connectionTimeoutMillis: 3000,
});

export const db = drizzle(pool, { schema });

export * from "./schema";
export * from "drizzle-orm";
