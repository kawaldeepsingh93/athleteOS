"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { buildRoadmap, buildStandards, buildTargets } from "@/lib/engines/calories";
import { useAthleteStore } from "@/lib/store";
import type { ActivityLevel, DietType, Equipment, Profile } from "@/lib/types";
import { cn } from "@/lib/utils";

const STEPS = ["Identity", "Body", "Lifestyle", "Roadmap"];

const empty: Profile = {
  name: "",
  age: 28,
  heightCm: 175,
  weightKg: 78,
  bodyFat: 22,
  goalWeightKg: 72,
  goalBodyFat: 14,
  activityLevel: "moderate",
  equipment: "dumbbells",
  dietType: "eggetarian",
  wakeTime: "05:30",
  sleepTime: "22:00",
  unitSystem: "metric",
  startDate: "",
};

function Choice<T extends string>({
  value,
  current,
  onChange,
  label,
}: {
  value: T;
  current: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={cn(
        "rounded-2xl border px-3 py-2 text-sm capitalize transition",
        current === value
          ? "border-accent bg-accent/15 text-ink"
          : "border-white/8 text-muted hover:bg-white/4",
      )}
    >
      {label}
    </button>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const completeOnboarding = useAthleteStore((s) => s.completeOnboarding);
  const loadDemo = useAthleteStore((s) => s.loadDemo);
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Profile>(empty);

  const targets = useMemo(() => buildTargets(profile), [profile]);
  const standards = useMemo(() => buildStandards(profile), [profile]);
  const roadmap = useMemo(() => buildRoadmap(profile), [profile]);
  const frames = [profile.bodyFat, 25, 20, 15, 12].map((bf) =>
    Math.max(profile.goalBodyFat, Math.min(profile.bodyFat, bf)),
  );

  const patch = (partial: Partial<Profile>) => setProfile((p) => ({ ...p, ...partial }));

  const next = () => {
    if (step < 3) setStep(step + 1);
    else {
      completeOnboarding({ ...profile, name: profile.name || "Athlete" });
      router.push("/dashboard");
    }
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted">Onboarding</div>
          <h1 className="display mt-2 text-4xl">{STEPS[step]}</h1>
        </div>
        <Button
          variant="ghost"
          onClick={() => {
            loadDemo();
            router.push("/dashboard");
          }}
        >
          Preview Day 27
        </Button>
      </div>
      <Progress value={((step + 1) / 4) * 100} className="mb-8" />

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
      >
        {step === 0 && (
          <Card className="grid gap-5">
            <Field label="Name">
              <Input
                value={profile.name}
                onChange={(e) => patch({ name: e.target.value })}
                placeholder="What should the coach call you?"
              />
            </Field>
            <Field label="Age">
              <Input
                type="number"
                value={profile.age}
                onChange={(e) => patch({ age: Number(e.target.value) })}
              />
            </Field>
          </Card>
        )}

        {step === 1 && (
          <Card className="grid gap-5 sm:grid-cols-2">
            <Field label="Height (cm)">
              <Input type="number" value={profile.heightCm} onChange={(e) => patch({ heightCm: Number(e.target.value) })} />
            </Field>
            <Field label="Weight (kg)">
              <Input type="number" value={profile.weightKg} onChange={(e) => patch({ weightKg: Number(e.target.value) })} />
            </Field>
            <Field label="Body fat %">
              <Input type="number" value={profile.bodyFat} onChange={(e) => patch({ bodyFat: Number(e.target.value) })} />
            </Field>
            <Field label="Goal weight (kg)">
              <Input type="number" value={profile.goalWeightKg} onChange={(e) => patch({ goalWeightKg: Number(e.target.value) })} />
            </Field>
            <Field label="Goal body fat %">
              <Input type="number" value={profile.goalBodyFat} onChange={(e) => patch({ goalBodyFat: Number(e.target.value) })} />
            </Field>
          </Card>
        )}

        {step === 2 && (
          <Card className="space-y-6">
            <div>
              <div className="mb-2 text-xs uppercase tracking-[0.16em] text-muted">Activity</div>
              <div className="flex flex-wrap gap-2">
                {(["sedentary", "light", "moderate", "active", "athlete"] as ActivityLevel[]).map((v) => (
                  <Choice key={v} value={v} current={profile.activityLevel} onChange={(activityLevel) => patch({ activityLevel })} label={v} />
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-xs uppercase tracking-[0.16em] text-muted">Equipment</div>
              <div className="flex flex-wrap gap-2">
                {(["bodyweight", "dumbbells", "gym"] as Equipment[]).map((v) => (
                  <Choice key={v} value={v} current={profile.equipment} onChange={(equipment) => patch({ equipment })} label={v} />
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-xs uppercase tracking-[0.16em] text-muted">Diet</div>
              <div className="flex flex-wrap gap-2">
                {(["vegetarian", "eggetarian", "non_vegetarian", "vegan"] as DietType[]).map((v) => (
                  <Choice key={v} value={v} current={profile.dietType} onChange={(dietType) => patch({ dietType })} label={v.replace("_", " ")} />
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Wake time">
                <Input type="time" value={profile.wakeTime} onChange={(e) => patch({ wakeTime: e.target.value })} />
              </Field>
              <Field label="Sleep time">
                <Input type="time" value={profile.sleepTime} onChange={(e) => patch({ sleepTime: e.target.value })} />
              </Field>
            </div>
          </Card>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <Card>
              <div className="text-xs uppercase tracking-[0.16em] text-muted">Estimated operating targets</div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  [targets.maintenanceCalories, "Maintain"],
                  [targets.dailyCalories, "Daily kcal"],
                  [targets.proteinG, "Protein g"],
                  [targets.waterL, "Water L"],
                ].map(([value, label]) => (
                  <div key={String(label)} className="rounded-2xl bg-white/4 p-3">
                    <div className="display text-2xl tabular">{value}</div>
                    <div className="text-[11px] uppercase tracking-[0.14em] text-muted">{label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 text-sm text-muted">
                Opening standards: {standards.pushUps} push-ups · {standards.pullUps} pull-ups · {standards.fiveKMin} min 5K
              </div>
            </Card>
            <Card>
              <div className="mb-3 flex items-center justify-between">
                <div className="text-xs uppercase tracking-[0.16em] text-muted">Athlete prediction</div>
                <Badge tone="warning">Visual estimates</Badge>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {["Now", "25%", "20%", "15%", "12%"].map((label, i) => (
                  <div key={label} className="text-center">
                    <div
                      className="mx-auto h-28 w-10 rounded-full"
                      style={{
                        background: `linear-gradient(180deg, #4F8CFF 0%, #22C55E 100%)`,
                        opacity: 0.35 + (1 - frames[i] / 30) * 0.65,
                        transform: `scaleY(${0.72 + (1 - frames[i] / 35) * 0.28})`,
                      }}
                    />
                    <div className="mt-2 text-xs text-muted">{label}</div>
                    <div className="text-sm tabular">{frames[i]}%</div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted">
                These silhouettes are directional estimates, not medical imaging or guaranteed outcomes.
              </p>
            </Card>
            <Card>
              <div className="text-xs uppercase tracking-[0.16em] text-muted">12-month roadmap</div>
              <div className="mt-4 space-y-3">
                {roadmap.slice(0, 4).map((month) => (
                  <div key={month.month} className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-medium">Month {month.month} · {month.title}</div>
                      <div className="text-sm text-muted">{month.focus}</div>
                    </div>
                    <div className="text-right text-sm tabular text-muted">
                      {month.expectedWeightKg}kg
                      <div>{month.expectedBodyFat}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </motion.div>

      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
          Back
        </Button>
        <Button onClick={next}>{step === 3 ? "Unlock Day 1" : "Continue"}</Button>
      </div>
    </div>
  );
}
