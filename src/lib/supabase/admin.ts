import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function supabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function persistableSnapshot(state: Record<string, unknown>) {
  const skip = new Set([
    "hydrated",
    "celebration",
    "hydrateFlag",
    "loadDemo",
    "reset",
    "completeOnboarding",
    "ensureToday",
    "toggleExercise",
    "addFood",
    "removeFood",
    "setWater",
    "logSleep",
    "toggleSunlight",
    "logRun",
    "addMeasurement",
    "completeMissionTask",
    "completeDay",
    "dismissCelebration",
    "sendCoach",
    "updateSettings",
    "toggleSupplement",
    "addBloodReport",
    "applyProtocol",
  ]);
  return Object.fromEntries(
    Object.entries(state).filter(([key]) => !skip.has(key)),
  );
}
