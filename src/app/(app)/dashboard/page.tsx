"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { Check, Droplets, Egg, Flame, FlaskConical, Sun } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSkeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { RingProgress } from "@/components/ui/ring-progress";
import { chartTheme } from "@/components/charts/theme";
import { QUICK_ADD_IDS, foodById } from "@/lib/data/foods";
import { levelFromXp, nextMilestone, rankFromLevel } from "@/lib/engines/gamification";
import { missionProgress } from "@/lib/engines/missions";
import { daypartGreeting } from "@/lib/greeting";
import { SUPPLEMENTS } from "@/lib/data/supplements";
import { selectToday, useAthleteStore } from "@/lib/store";
import { formatWeight } from "@/lib/units";
import { cn, percent } from "@/lib/utils";

export default function DashboardPage() {
  const state = useAthleteStore();
  const today = useMemo(() => selectToday(state), [state]);
  if (!state.hydrated || !state.profile || !state.targets || !today.mission || !today.workout) {
    return <DashboardSkeleton />;
  }

  const level = levelFromXp(state.xp);
  const rank = rankFromLevel(level);
  const milestone = nextMilestone(state.xp);
  const missionPct = missionProgress(today.mission) * 100;
  const proteinPct = percent(today.protein, state.targets.proteinG);
  const droplets = Array.from({ length: 7 }, (_, i) => (i + 1) * 0.5);
  const weightSeries = state.measurements.slice(-14).map((m) => ({
    date: m.date.slice(5),
    weight: m.weightKg,
  }));
  const avg7 =
    weightSeries.slice(-7).reduce((s, p) => s + p.weight, 0) /
    Math.max(1, weightSeries.slice(-7).length);

  return (
    <div className="space-y-5">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-muted">Daily home</div>
        <h1 className="display mt-1 max-w-full text-3xl sm:text-4xl">
          {daypartGreeting()}, {state.profile.name.split(" ")[0]}.
        </h1>
      </div>

      {state.protocol && state.protocol.source !== "default" && (
        <Card className="border-accent/25 bg-accent/8">
          <div className="text-xs uppercase tracking-[0.16em] text-accent">AI protocol live</div>
          <p className="mt-2 text-sm leading-6 text-ink/90">{state.protocol.summary}</p>
          <p className="mt-2 text-sm text-muted">{state.protocol.trainingNotes}</p>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-12">
        <motion.div
          layout
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-7"
        >
          <Card className="relative overflow-hidden">
            <div className="absolute -right-16 -top-16 size-56 rounded-full bg-accent/10 blur-3xl" />
            <CardHeader>
              <CardTitle>Hero card</CardTitle>
              <Badge tone="accent">{rank}</Badge>
            </CardHeader>
            <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr]">
              <RingProgress
                value={(state.currentDay / 365) * 100}
                label={`${state.currentDay}`}
                sublabel="of 365"
              />
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-muted">Today&apos;s mission</div>
                <div className="display mt-1 text-2xl sm:text-3xl">{today.mission.title}</div>
                <p className="mt-2 text-sm text-muted">{today.mission.brief}</p>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {[
                    [String(state.streak), "Streak"],
                    [state.xp.toLocaleString(), "XP"],
                    [`Lv ${level}`, "Next"],
                  ].map(([value, label]) => (
                    <div key={String(label)} className="min-w-0">
                      <div className="text-lg font-semibold tabular tracking-tight sm:text-xl">{value}</div>
                      <div className="truncate text-[11px] uppercase tracking-[0.14em] text-muted">{label}</div>
                    </div>
                  ))}
                </div>
                <p className="mt-2 truncate text-xs text-muted">{milestone.label}</p>
                <Progress value={missionPct} className="mt-5" />
                <div className="mt-4 flex gap-2">
                  <Link href="/mission">
                    <Button>Open mission</Button>
                  </Link>
                  <Link href="/workout">
                    <Button variant="secondary">Train</Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Today&apos;s workout</CardTitle>
            <Badge>{today.workout.focus.join(" · ")}</Badge>
          </CardHeader>
          <div className="display text-xl sm:text-2xl">{today.workout.title}</div>
          <div className="mt-4 space-y-2">
            {today.workout.exercises.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => state.toggleExercise(exercise.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-left transition",
                  exercise.completed
                    ? "border-success/30 bg-success/8"
                    : "border-white/6 bg-white/3 hover:bg-white/5",
                )}
              >
                <div>
                  <div className="font-medium">{exercise.name}</div>
                  <div className="text-xs text-muted">
                    {exercise.sets}×{exercise.reps}
                    {exercise.weightKg ? ` · ${exercise.weightKg}kg` : ""}
                    {exercise.durationSec ? ` · ${Math.round(exercise.durationSec / 60)}m` : ""}
                  </div>
                </div>
                <span
                  className={cn(
                    "grid size-7 place-items-center rounded-full border",
                    exercise.completed ? "border-success bg-success text-black" : "border-white/15",
                  )}
                >
                  {exercise.completed && <Check className="size-3.5" />}
                </span>
              </button>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Protein</CardTitle>
            <Egg className="size-4 text-accent" />
          </CardHeader>
          <div className="display text-4xl tabular">
            {Math.round(today.protein)}
            <span className="text-xl text-muted">/{state.targets.proteinG}g</span>
          </div>
          <Progress value={proteinPct} tone="success" className="mt-4" />
          <div className="mt-4 flex flex-wrap gap-2">
            {QUICK_ADD_IDS.map((id) => {
              const food = foodById(id);
              if (!food) return null;
              return (
                <Button key={id} size="sm" variant="secondary" onClick={() => state.addFood(id)}>
                  + {food.name}
                </Button>
              );
            })}
          </div>
        </Card>

        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Water</CardTitle>
            <Droplets className="size-4 text-accent" />
          </CardHeader>
          <div className="display text-4xl tabular">
            {today.water}
            <span className="text-xl text-muted">/3.5L</span>
          </div>
          <div className="mt-5 flex justify-between">
            {droplets.map((level) => {
              const filled = today.water + 0.01 >= level;
              return (
                <button
                  key={level}
                  aria-label={`${level} liters`}
                  onClick={() => state.setWater(today.water >= level ? level - 0.5 : level)}
                  className={cn(
                    "h-14 w-7 rounded-full border transition",
                    filled
                      ? "border-accent bg-accent shadow-[0_0_16px_rgba(79,140,255,0.35)]"
                      : "border-white/10 bg-white/3",
                  )}
                />
              );
            })}
          </div>
        </Card>

        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Sleep</CardTitle>
            <Sun className="size-4 text-warning" />
          </CardHeader>
          <div className="display text-4xl tabular">{today.sleep?.hours ?? "—"}h</div>
          <div className="mt-2 text-sm text-muted">
            Recovery {today.sleep?.recoveryScore ?? "—"}
          </div>
          <div className="mt-4 flex gap-2">
            {[7, 7.5, 8, 8.5].map((hours) => (
              <Button key={hours} size="sm" variant="secondary" onClick={() => state.logSleep(hours, today.sleep?.sunlight)}>
                {hours}h
              </Button>
            ))}
          </div>
          <button
            onClick={state.toggleSunlight}
            className={cn(
              "mt-4 w-full rounded-2xl border px-3 py-2 text-sm",
              today.sleep?.sunlight
                ? "border-warning/40 bg-warning/10 text-warning"
                : "border-white/8 text-muted",
            )}
          >
            Morning sunlight {today.sleep?.sunlight ? "complete" : "pending"}
          </button>
        </Card>

        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Supplements</CardTitle>
            <Link href="/nutrition#supplements" className="text-xs text-accent">Full stack</Link>
          </CardHeader>
          <div className="flex flex-wrap gap-2">
            {(state.protocol?.supplementIds ?? ["vit-d3", "omega3", "mag", "creatine"]).map((id) => {
              const def = SUPPLEMENTS.find((s) => s.id === id);
              const taken = state.supplements.some(
                (s) => s.supplementId === id && s.taken && s.date === today.date,
              );
              return (
                <Button
                  key={id}
                  size="sm"
                  variant={taken ? "success" : "secondary"}
                  onClick={() => state.toggleSupplement(id)}
                >
                  {taken ? "✓ " : ""}
                  {def?.name ?? id}
                </Button>
              );
            })}
          </div>
        </Card>

        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Blood report</CardTitle>
            <FlaskConical className="size-4 text-accent" />
          </CardHeader>
          {state.bloodReports.at(-1) ? (
            <div>
              <div className="text-sm">{state.bloodReports.at(-1)?.labName} · {state.bloodReports.at(-1)?.date}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {state.bloodReports.at(-1)?.markers.slice(0, 4).map((m) => (
                  <Badge key={m.id} tone={m.flag === "ok" ? "success" : m.flag === "low" ? "warning" : "danger"}>
                    {m.name} {m.value}
                  </Badge>
                ))}
              </div>
              <Link href="/labs">
                <Button className="mt-4" variant="secondary" size="sm">Open labs</Button>
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted">No report yet. Training and diet stay on the standard program until you add one.</p>
              <Link href="/labs">
                <Button className="mt-4" size="sm">Add blood report</Button>
              </Link>
            </div>
          )}
        </Card>

        <Card className="lg:col-span-12">
          <CardHeader>
            <CardTitle>Weight trend</CardTitle>
            <div className="text-sm text-muted">
              7-day avg {formatWeight(avg7, state.settings.unitSystem)}
            </div>
          </CardHeader>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightSeries}>
                <defs>
                  <linearGradient id="wt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartTheme.accent} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={chartTheme.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={chartTheme.tooltip}
                  formatter={(value) => [`${value} kg`, "Weight"]}
                />
                <Area type="monotone" dataKey="weight" stroke={chartTheme.accent} fill="url(#wt)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted">
            <Flame className="size-4 text-accent" />
            Monthly comparison lives in Progress.
          </div>
        </Card>
      </div>
    </div>
  );
}
