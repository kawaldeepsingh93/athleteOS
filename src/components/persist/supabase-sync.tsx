"use client";

import { useEffect, useRef } from "react";
import { sendJson } from "@/lib/runtime";
import { useAthleteStore } from "@/lib/store";

export function SupabaseSync() {
  const syncKey = useAthleteStore(
    (s) =>
      `${s.onboarded}:${s.athleteId}:${s.updatedAt}:${s.xp}:${s.nutrition.length}:${s.bloodReports.length}:${s.currentDay}`,
  );
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const [onboarded, athleteId] = syncKey.split(":");
    if (onboarded !== "true" || !athleteId) return;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const state = useAthleteStore.getState();
      if (!state.onboarded || !state.athleteId) return;
      void sendJson("/api/athlete", { athleteId: state.athleteId, state }, "PUT");
    }, 1200);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [syncKey]);

  return null;
}
