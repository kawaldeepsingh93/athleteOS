import type { RunLog, RunMode } from "@/lib/types";
import { round } from "@/lib/utils";

export const RUN_MODES: { id: RunMode; label: string; blurb: string }[] = [
  { id: "zone2", label: "Zone 2", blurb: "Easy aerobic. You can speak in sentences." },
  { id: "tempo", label: "Tempo", blurb: "Comfortably hard. Controlled discomfort." },
  { id: "intervals", label: "Intervals", blurb: "Repeat speed. Walk the recoveries honestly." },
  { id: "long", label: "Long Run", blurb: "Time on feet. Finish with something left." },
];

export function paceFrom(distanceKm: number, durationMin: number) {
  if (distanceKm <= 0) return 0;
  return round(durationMin / distanceKm, 2);
}

export function formatPace(minPerKm: number) {
  const min = Math.floor(minPerKm);
  const sec = Math.round((minPerKm - min) * 60)
    .toString()
    .padStart(2, "0");
  return `${min}:${sec}`;
}

export function personalBest(runs: RunLog[], distance = 5) {
  const candidates = runs.filter((r) => Math.abs(r.distanceKm - distance) < 0.4);
  if (candidates.length === 0) return null;
  return candidates.reduce((best, r) => (r.durationMin < best.durationMin ? r : best));
}

export function paceTrend(runs: RunLog[]) {
  return [...runs]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-12)
    .map((r) => ({
      date: r.date.slice(5),
      pace: r.paceMinPerKm,
      mode: r.mode,
    }));
}
