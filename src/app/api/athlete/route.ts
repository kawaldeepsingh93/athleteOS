import { NextResponse } from "next/server";
import { persistableSnapshot, supabaseAdmin } from "@/lib/supabase/admin";
import { profileFromRow, profileRow, weeklyRows } from "@/lib/supabase/persist";
import { buildWeeklyProgress } from "@/lib/engines/weekly";
import type { AthleteState } from "@/lib/types";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ configured: false });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const athlete = await db.from("athletes").select("snapshot, updated_at").eq("id", id).maybeSingle();
  if (athlete.error) {
    return NextResponse.json({ configured: true, error: athlete.error.message }, { status: 500 });
  }

  const profile = await db.from("profiles").select("*").eq("athlete_id", id).maybeSingle();
  const weeks = await db
    .from("weekly_progress")
    .select("*")
    .eq("athlete_id", id)
    .order("week", { ascending: true });

  return NextResponse.json({
    configured: true,
    snapshot: athlete.data?.snapshot ?? null,
    updatedAt: athlete.data?.updated_at ?? null,
    profile: profile.data && !profile.error ? profileFromRow(profile.data) : null,
    weeks: weeks.error ? [] : weeks.data ?? [],
  });
}

export async function PUT(request: Request) {
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ configured: false, saved: false });
  const body = (await request.json()) as { athleteId?: string; state?: AthleteState };
  if (!body.athleteId || !body.state) {
    return NextResponse.json({ error: "athleteId and state required" }, { status: 400 });
  }

  const snapshot = persistableSnapshot(body.state as unknown as Record<string, unknown>);
  const athlete = await db.from("athletes").upsert({
    id: body.athleteId,
    snapshot,
    updated_at: new Date().toISOString(),
  });
  if (athlete.error) {
    return NextResponse.json({ configured: true, saved: false, error: athlete.error.message }, { status: 500 });
  }

  const profile = profileRow(body.athleteId, body.state);
  let profileSaved = false;
  if (profile) {
    const result = await db.from("profiles").upsert(profile);
    profileSaved = !result.error;
  }

  const weeks = buildWeeklyProgress(body.state);
  const weekResult = await db.from("weekly_progress").upsert(weeklyRows(body.athleteId, weeks), {
    onConflict: "athlete_id,week",
  });

  const reports = body.state.bloodReports ?? [];
  const latest = reports.at(-1);
  if (latest?.id) {
    await db.from("blood_reports").upsert({
      id: latest.id,
      athlete_id: body.athleteId,
      logged_on: latest.date,
      lab_name: latest.labName ?? "Manual entry",
      notes: latest.notes ?? null,
      markers: latest.markers ?? [],
    });
  }

  return NextResponse.json({
    configured: true,
    saved: true,
    profileSaved,
    weeksSaved: !weekResult.error,
    weekError: weekResult.error?.message ?? null,
    weeks: weeks.length,
  });
}
