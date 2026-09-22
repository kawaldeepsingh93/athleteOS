"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { defaultMeal, foodsForDiet, MEALS, QUICK_ADD_IDS, foodById } from "@/lib/data/foods";
import { SUPPLEMENTS } from "@/lib/data/supplements";
import { selectToday, useAthleteStore } from "@/lib/store";
import type { MealSlot } from "@/lib/types";
import { cn, percent } from "@/lib/utils";

export default function NutritionPage() {
  const state = useAthleteStore();
  const today = useMemo(() => selectToday(state), [state]);
  const [meal, setMeal] = useState<MealSlot>("breakfast");
  const foods = foodsForDiet(state.profile?.dietType ?? "eggetarian");
  const target = state.targets;
  const mealLog = today.nutrition.filter((n) => (n.meal ?? defaultMeal(n.foodId)) === meal);
  const stack = state.protocol?.supplementIds ?? ["vit-d3", "omega3", "mag", "creatine"];

  return (
    <div className="space-y-5">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-muted">Nutrition</div>
        <h1 className="display mt-1 text-3xl sm:text-4xl">Fuel like an athlete.</h1>
        {state.protocol && state.protocol.source !== "default" && (
          <p className="mt-2 max-w-2xl text-sm text-muted">{state.protocol.dietNotes}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [`${Math.round(today.calories)}/${target?.dailyCalories ?? "—"}`, "Calories", percent(today.calories, target?.dailyCalories ?? 1), "accent"],
          [`${Math.round(today.protein)}/${target?.proteinG ?? "—"}g`, "Protein", percent(today.protein, target?.proteinG ?? 1), "success"],
          [`${Math.round(today.carbs)}/${target?.carbsG ?? "—"}g`, "Carbs", percent(today.carbs, target?.carbsG ?? 1), "accent"],
          [`${Math.round(today.fat)}/${target?.fatG ?? "—"}g`, "Fat", percent(today.fat, target?.fatG ?? 1), "warning"],
        ].map(([label, name, value, tone]) => (
          <Card key={String(name)}>
            <div className="text-xs uppercase tracking-[0.16em] text-muted">{name}</div>
            <div className="mt-2 text-2xl font-semibold tabular tracking-tight">{label}</div>
            <Progress value={Number(value)} className="mt-4" tone={tone === "success" ? "success" : tone === "warning" ? "warning" : "accent"} />
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {MEALS.map((slot) => (
          <Button key={slot} size="sm" variant={meal === slot ? "primary" : "secondary"} onClick={() => setMeal(slot)}>
            {slot}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick add · {meal}</CardTitle>
        </CardHeader>
        <div className="flex flex-wrap gap-2">
          {QUICK_ADD_IDS.map((id) => {
            const food = foodById(id);
            if (!food) return null;
            return (
              <Button key={id} variant="secondary" onClick={() => state.addFood(id, 1, meal)}>
                + {food.name} · {food.protein}g
              </Button>
            );
          })}
        </div>
      </Card>

      <Card>
        <CardTitle className="mb-4">Indian food database</CardTitle>
        <div className="grid gap-2 sm:grid-cols-2">
          {foods.map((food) => (
            <button
              key={food.id}
              onClick={() => state.addFood(food.id, 1, meal)}
              className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-white/6 bg-white/3 px-4 py-3 text-left hover:bg-white/5"
            >
              <div className="min-w-0">
                <div className="truncate font-medium">{food.name}</div>
                <div className="truncate text-xs text-muted">
                  {food.serving} · {defaultMeal(food.id)}
                </div>
              </div>
              <div className="shrink-0 text-right text-sm tabular">
                {food.protein}g P
                <div className="text-muted">{food.calories} kcal</div>
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <CardTitle className="mb-4">Today · {meal}</CardTitle>
        <div className="space-y-2">
          {mealLog.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white/3 px-4 py-3">
              <div className="min-w-0">
                <div className="truncate font-medium">
                  {item.name} × {item.servings}
                </div>
                <div className="text-xs text-muted">
                  {Math.round(item.calories)} kcal · {item.protein.toFixed(1)}g P · {item.carbs.toFixed(1)}g C · {item.fat.toFixed(1)}g F
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => state.removeFood(item.id)}>
                Remove
              </Button>
            </div>
          ))}
          {mealLog.length === 0 && <p className="text-sm text-muted">Nothing logged in this meal yet.</p>}
        </div>
      </Card>

      <Card id="supplements">
        <CardTitle className="mb-2">Supplement stack</CardTitle>
        <p className="mb-4 text-sm text-muted">
          Default stack if no labs. Iron only appears when a report says ferritin or hemoglobin is low.
        </p>
        <div className="space-y-2">
          {SUPPLEMENTS.filter((s) => stack.includes(s.id) || s.id !== "iron").filter((s) => stack.includes(s.id)).map((item) => {
            const taken = state.supplements.some(
              (s) => s.supplementId === item.id && s.taken && s.date === today.date,
            );
            return (
              <button
                key={item.id}
                onClick={() => state.toggleSupplement(item.id)}
                className={cn(
                  "flex w-full items-start justify-between gap-3 rounded-2xl border px-4 py-3 text-left",
                  taken ? "border-success/30 bg-success/8" : "border-white/6 bg-white/3",
                )}
              >
                <div className="min-w-0">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-muted">
                    {item.dose} · {item.timing}
                  </div>
                  <div className="mt-1 text-sm text-muted">{item.why}</div>
                </div>
                <div className="shrink-0 text-xs uppercase tracking-[0.14em] text-muted">
                  {taken ? "Taken" : "Log"}
                </div>
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
