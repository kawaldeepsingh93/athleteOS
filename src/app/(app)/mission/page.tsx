"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Lock, Unlock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { isMissionComplete, missionProgress } from "@/lib/engines/missions";
import { selectToday, useAthleteStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const categoryHref: Record<string, string> = {
  run: "/run",
  strength: "/workout",
  protein: "/nutrition",
  water: "/dashboard",
  mobility: "/workout",
  sleep: "/dashboard",
};

export default function MissionPage() {
  const state = useAthleteStore();
  const today = useMemo(() => selectToday(state), [state]);
  const mission = today.mission;
  if (!mission) return null;

  const pct = missionProgress(mission) * 100;
  const complete = isMissionComplete(mission);
  const nearby = state.missions.filter(
    (m) => m.day >= Math.max(1, state.currentDay - 2) && m.day <= state.currentDay + 3,
  );

  return (
    <div className="space-y-5">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-muted">Mission brief</div>
        <h1 className="display mt-1 text-5xl">Day {mission.day} — {mission.title}</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted">{mission.brief}</p>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-muted">{Math.round(pct)}% of today closed</div>
          <Badge tone={complete ? "success" : "accent"}>
            {complete ? "Ready to unlock" : "In progress"}
          </Badge>
        </div>
        <Progress value={pct} />
        <div className="mt-6 space-y-2">
          {mission.tasks.map((task, i) => (
            <motion.a
              key={task.id}
              href={categoryHref[task.category]}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn(
                "flex items-center justify-between rounded-2xl border px-4 py-3",
                task.completed ? "border-success/30 bg-success/8" : "border-white/6 bg-white/3",
              )}
            >
              <div>
                <div className="font-medium">{task.label}</div>
                <div className="text-xs uppercase tracking-[0.16em] text-muted">{task.category}</div>
              </div>
              <div className={cn("text-sm", task.completed ? "text-success" : "text-muted")}>
                {task.completed ? "Done" : "Open"}
              </div>
            </motion.a>
          ))}
        </div>
        <Button className="mt-6 w-full" size="lg" disabled={!complete} onClick={state.completeDay}>
          {complete ? "Complete day · Unlock tomorrow" : "Finish every task to unlock tomorrow"}
        </Button>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        {nearby.map((m) => (
          <div
            key={m.day}
            className={cn(
              "rounded-3xl border p-4",
              m.day === state.currentDay
                ? "border-accent/40 bg-accent/10"
                : m.unlocked
                  ? "border-white/6 bg-card"
                  : "border-white/6 bg-white/2 opacity-60",
            )}
          >
            <div className="flex items-center justify-between text-xs text-muted">
              Day {m.day}
              {m.unlocked ? <Unlock className="size-3.5" /> : <Lock className="size-3.5" />}
            </div>
            <div className="mt-2 font-medium">{m.title}</div>
            <div className="mt-1 text-xs text-muted">
              {m.completed ? "Won" : m.unlocked ? "Active" : "Locked"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
