"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { selectToday, useAthleteStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function WorkoutPage() {
  const state = useAthleteStore();
  const today = useMemo(() => selectToday(state), [state]);
  const workout = today.workout;
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!activeTimer) return;
    const interval = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setActiveTimer(null);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [activeTimer]);

  if (!workout) {
    return (
      <EmptyState
        title="No workout generated"
        body="Complete onboarding to receive a progressive session."
        action="Go to onboarding"
        onAction={() => {
          window.location.href = "/onboarding";
        }}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted">Workout engine</div>
          <h1 className="display mt-1 text-4xl">{workout.title}</h1>
        </div>
        <div className="flex gap-2">
          {workout.focus.map((f) => (
            <Badge key={f} tone="accent">{f}</Badge>
          ))}
        </div>
      </div>

      <p className="max-w-2xl text-sm text-muted">
        Progressive overload is automatic. Week {Math.ceil(state.currentDay / 7)} increases volume,
        then upgrades the pattern. Bodyweight and dumbbells both work.
      </p>

      <div className="space-y-3">
        {workout.exercises.map((exercise) => (
          <Card key={exercise.id} className={cn(exercise.completed && "border-success/25")}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="display text-2xl">{exercise.name}</div>
                <div className="mt-1 text-sm text-muted">
                  {exercise.sets} sets · {exercise.reps} reps
                  {exercise.weightKg ? ` · ${exercise.weightKg} kg` : ""}
                  {exercise.durationSec ? ` · ${Math.round(exercise.durationSec / 60)} min` : ""}
                </div>
                {exercise.notes && <p className="mt-2 text-sm text-muted">{exercise.notes}</p>}
              </div>
              <div className="flex gap-2">
                {exercise.durationSec && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setActiveTimer(exercise.id);
                      setRemaining(exercise.durationSec ?? 0);
                    }}
                  >
                    <Timer className="size-4" />
                    Timer
                  </Button>
                )}
                <Button
                  variant={exercise.completed ? "success" : "primary"}
                  onClick={() => state.toggleExercise(exercise.id)}
                >
                  {exercise.completed ? "Completed" : "Mark done"}
                </Button>
              </div>
            </div>
            <AnimatePresence>
              {activeTimer === exercise.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 overflow-hidden rounded-2xl bg-white/4 px-4 py-3 font-mono text-2xl tabular"
                >
                  {Math.floor(remaining / 60)}:{(remaining % 60).toString().padStart(2, "0")}
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>
    </div>
  );
}
