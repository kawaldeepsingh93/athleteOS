"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { buildWeeklyProgress } from "@/lib/engines/weekly";
import { useAthleteStore } from "@/lib/store";
import { formatWeight } from "@/lib/units";

export default function ProgressPage() {
  const state = useAthleteStore();
  const { measurements, achievements, addMeasurement, settings, profile } = state;
  const weeks = useMemo(() => buildWeeklyProgress(state), [state]);
  const [weight, setWeight] = useState(profile?.weightKg ?? 78);
  const [waist, setWaist] = useState(86);
  const latest = measurements.at(-1);
  const monthAgo = measurements[Math.max(0, measurements.length - 30)];
  const [slide, setSlide] = useState(0);
  const frames = [
    { label: "Current", bf: latest?.bodyFat ?? profile?.bodyFat ?? 22 },
    { label: "25%", bf: 25 },
    { label: "20%", bf: 20 },
    { label: "15%", bf: 15 },
    { label: "12%", bf: 12 },
  ];

  return (
    <div className="space-y-5">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-muted">Progress center</div>
        <h1 className="display mt-1 text-4xl">Proof, not hope.</h1>
      </div>

      {profile && (
        <Card>
          <CardHeader>
            <CardTitle>Saved profile</CardTitle>
            <Badge tone="accent">Supabase</Badge>
          </CardHeader>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [profile.name, "Name"],
              [`${profile.age} · ${Math.round(profile.heightCm)}cm`, "Identity"],
              [`${profile.weightKg} → ${profile.goalWeightKg}kg`, "Weight path"],
              [profile.dietType.replace("_", " "), "Diet"],
            ].map(([value, label]) => (
              <div key={String(label)} className="min-w-0">
                <div className="text-xs uppercase tracking-[0.14em] text-muted">{label}</div>
                <div className="mt-1 truncate font-medium capitalize">{value}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Week by week</CardTitle>
          <Badge>{weeks.length} weeks</Badge>
        </CardHeader>
        <div className="space-y-3">
          {weeks.slice().reverse().map((week) => (
            <div key={week.week} className="rounded-2xl border border-white/6 bg-white/3 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="font-medium">Week {week.week}</div>
                  <div className="text-xs text-muted">
                    Days {week.startDay}–{week.endDay} · {week.summary}
                  </div>
                </div>
                <Badge tone={week.daysCompleted >= 6 ? "success" : "default"}>
                  {week.daysCompleted}/7 days
                </Badge>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                <div>Workouts {week.workoutsCompleted}</div>
                <div>Protein hits {week.proteinHitDays}</div>
                <div>Run {week.runKm} km</div>
                <div>
                  Weight {week.avgWeightKg != null ? formatWeight(week.avgWeightKg, settings.unitSystem) : "—"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Monthly comparison</CardTitle>
            {latest && monthAgo && (
              <Badge tone="success">
                {formatWeight(latest.weightKg - monthAgo.weightKg, settings.unitSystem)} vs first log
              </Badge>
            )}
          </CardHeader>
          {latest ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                ["Weight", formatWeight(latest.weightKg, settings.unitSystem)],
                ["Waist", latest.waistCm ? `${latest.waistCm} cm` : "—"],
                ["Chest", latest.chestCm ? `${latest.chestCm} cm` : "—"],
                ["Arms", latest.armsCm ? `${latest.armsCm} cm` : "—"],
                ["Thigh", latest.thighCm ? `${latest.thighCm} cm` : "—"],
                ["Body fat", latest.bodyFat ? `${latest.bodyFat}%` : "—"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white/4 p-4">
                  <div className="text-xs uppercase tracking-[0.14em] text-muted">{label}</div>
                  <div className="display mt-2 text-2xl tabular">{value}</div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No measurements yet" body="Log your first weigh-in to start the timeline." />
          )}
        </Card>

        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Log measurements</CardTitle>
          </CardHeader>
          <div className="grid gap-3">
            <Field label="Weight (kg)">
              <Input type="number" step="0.1" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
            </Field>
            <Field label="Waist (cm)">
              <Input type="number" step="0.1" value={waist} onChange={(e) => setWaist(Number(e.target.value))} />
            </Field>
            <Button onClick={() => addMeasurement(weight, { waistCm: waist })}>Save check-in</Button>
          </div>
        </Card>

        <Card className="lg:col-span-6">
          <CardHeader>
            <CardTitle>Photo / prediction slider</CardTitle>
            <Badge tone="warning">Estimates</Badge>
          </CardHeader>
          <div className="flex items-end justify-center gap-3 py-4">
            {frames.map((frame, i) => (
              <button key={frame.label} onClick={() => setSlide(i)} className="text-center">
                <div
                  className="mx-auto w-8 rounded-full transition"
                  style={{
                    height: 96 + (12 - Math.min(frame.bf, 28)) * 2,
                    background: i === slide ? "#4F8CFF" : "rgba(255,255,255,0.12)",
                    opacity: 0.4 + (1 - frame.bf / 30) * 0.6,
                  }}
                />
                <div className="mt-2 text-xs text-muted">{frame.label}</div>
              </button>
            ))}
          </div>
          <p className="text-sm text-muted">
            {frames[slide].label} body-fat frame. Visual estimate only — not a medical scan.
          </p>
        </Card>

        <Card className="lg:col-span-6">
          <CardTitle className="mb-4">Achievement timeline</CardTitle>
          <div className="space-y-3">
            {achievements.map((a) => (
              <div key={a.id} className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{a.title}</div>
                  <div className="text-sm text-muted">{a.description}</div>
                </div>
                <Badge tone={a.unlockedAt ? "success" : "default"}>
                  {a.unlockedAt ? a.unlockedAt.slice(0, 10) : "Locked"}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
