import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

function loadEnv(path) {
  try {
    const out = {};
    for (const line of readFileSync(path, "utf8").split("\n")) {
      if (!line || line.startsWith("#") || !line.includes("=")) continue;
      const i = line.indexOf("=");
      out[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
    return out;
  } catch {
    return {};
  }
}

const env = { ...loadEnv(".env"), ...process.env };
const files = readdirSync("supabase/migrations")
  .filter((f) => f.endsWith(".sql"))
  .sort()
  .map((f) => ({ name: f, sql: readFileSync(join("supabase/migrations", f), "utf8") }));

if (!env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. API keys cannot run DDL.");
  console.error("Add the Postgres URI from Supabase → Settings → Database, then rerun npm run migrate.");
  process.exit(1);
}

const postgres = (await import("postgres")).default;
const sql = postgres(env.DATABASE_URL, { ssl: "require", max: 1 });
try {
  for (const file of files) {
    await sql.unsafe(file.sql);
    console.log(`applied ${file.name}`);
  }
  console.log("migrations applied");
} finally {
  await sql.end({ timeout: 5 });
}
