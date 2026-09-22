import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function sqlFiles() {
  const dir = join(process.cwd(), "supabase/migrations");
  return readdirSync(dir)
    .filter((file) => file.endsWith(".sql"))
    .sort()
    .map((file) => ({
      name: file,
      sql: readFileSync(join(dir, file), "utf8"),
    }));
}

export async function POST() {
  const url = process.env.DATABASE_URL;
  if (url) {
    const postgres = (await import("postgres")).default;
    const sql = postgres(url, { ssl: "require", max: 1 });
    try {
      for (const file of sqlFiles()) {
        await sql.unsafe(file.sql);
      }
      return NextResponse.json({ ok: true, method: "database_url", files: sqlFiles().map((f) => f.name) });
    } finally {
      await sql.end({ timeout: 5 });
    }
  }

  const db = supabaseAdmin();
  if (!db) {
    return NextResponse.json(
      { ok: false, error: "Add DATABASE_URL or Supabase service keys." },
      { status: 412 },
    );
  }

  const probe = await db.from("athletes").select("id").limit(1);
  if (!probe.error) {
    return NextResponse.json({ ok: true, method: "already_applied" });
  }

  return NextResponse.json(
    {
      ok: false,
      error:
        "API keys cannot run DDL. Add DATABASE_URL (Supabase → Settings → Database) and retry, or paste supabase/migrations into the SQL editor.",
      hint: probe.error.message,
    },
    { status: 412 },
  );
}

export async function GET() {
  const db = supabaseAdmin();
  const core = readFileSync(join(process.cwd(), "supabase/APPLY_NOW.sql"), "utf8");
  const profiles = readFileSync(join(process.cwd(), "supabase/APPLY_PROFILES.sql"), "utf8");
  if (!db) return NextResponse.json({ configured: false, ready: false, sql: core });
  const athletes = await db.from("athletes").select("id").limit(1);
  const profileTable = await db.from("profiles").select("athlete_id").limit(1);
  const needProfiles = Boolean(profileTable.error);
  return NextResponse.json({
    configured: true,
    ready: !athletes.error && !needProfiles,
    athletesReady: !athletes.error,
    profilesReady: !needProfiles,
    error: needProfiles ? "Run APPLY_PROFILES.sql for users and weekly progress." : athletes.error?.message ?? null,
    sql: needProfiles ? profiles : core,
    editor: "https://supabase.com/dashboard/project/dilpzlolaltuqjcgeyea/sql/new",
  });
}
