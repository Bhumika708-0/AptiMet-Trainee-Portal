import { defineConfig } from "drizzle-kit";
import { fileURLToPath } from "url";
import path from "path";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set — ensure the database is provisioned");
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  schema: path.join(__dirname, "./src/schema/index.ts"),
  out: path.join(__dirname, "./drizzle"),
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
