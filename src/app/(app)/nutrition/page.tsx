"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { defaultMeal, foodsForDiet, MEALS, QUICK_ADD_IDS, foodById } from "@/lib/data/foods";
import { SUPPLEMENTS } from "@/lib/data/supplements";
import {
  kcalFromMacros,
  macroPercents,
  macrosByMeal,
  mealOf,
  sumLogs,
} from "@/lib/nutrition-totals";
import { selectToday, useAthleteStore } from "@/lib/store";
import type { MealSlot } from "@/lib/types";
import { cn, percent } from "@/lib/utils";

function MacroLine({
  label,
  current,
  target,
  unit,
  tone,
}: {
  label: string;
  current: number;
  target: number;
  unit: string;
  tone: "accent" | "success" | "warning";
}) {
  const left = Math.max(0, target - current);
  return (
    <div className="min-w-0">
      <div className="flex items-baseline justify-between gap-2">
        <div className="text-xs uppercase tracking-[0.14em] text-muted">{label}</div>
        <div className="text-xs tabular text-muted">
          {left > 0 ? `${Math.round(left)}${unit} left` : "Hit"}
        </div>
      </div>
      <div className="mt-1 text-2xl font-semibold tabular tracking-tight">
        {Math.round(current)}
        <span className="text-sm font-medium text-muted">
          /{Math.round(target)}
          {unit}
        </span>
      </div>
      <Progress value={percent(current, target)} tone={tone} className="mt-3" />
    </div>
  );
}

export default function NutritionPage() {
  const state = useAthleteStore();
  const today = useMemo(() => selectToday(state), [state]);
  const [meal, setMeal] = useState<MealSlot>("breakfast");
  const foods = foodsForDiet(state.profile?.dietType ?? "eggetarian");
  const target = state.targets;
  const dayTotals = useMemo(() => sumLogs(today.nutrition), [today.nutrition]);
  const meals = useMemo(() => macrosByMeal(today.nutrition), [today.nutrition]);
  const mealLog = today.nutrition.filter((n) => mealOf(n) === meal);
  const mealTotals = meals[meal];
  const stack = state.protocol?.supplementIds ?? ["vit-d3", "omega3", "mag", "creatine"];
  const remainingKcal = Math.max(0, (target?.dailyCalories ?? 0) - dayTotals.calories);
  const over = dayTotals.calories > (target?.dailyCalories ?? 0);
  const split = macroPercents(dayTotals);
  const fromMacros = Math.round(kcalFromMacros(dayTotals));

  return (
    <div className="space-y-5">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-muted">Nutrition</div>
        <h1 className="display mt-1 text-3xl sm:text-4xl">Fuel like an athlete.</h1>
        {state.protocol && state.protocol.source !== "default" && (
          <p className="mt-2 max-w-2xl text-sm text-muted">{state.protocol.dietNotes}</p>
        )}
      </div>

      <Card>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.16em] text-muted">Total calories today</div>
            <div className="mt-2 text-5xl font-semibold tabular tracking-tight">
              {Math.round(dayTotals.calories)}
              <span className="text-xl font-medium text-muted">
                /{target?.dailyCalories ?? "—"}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted">
              {over
                ? `${Math.round(dayTotals.calories - (target?.dailyCalories ?? 0))} kcal over target`
                : `${Math.round(remainingKcal)} kcal remaining`}
              {" · "}
              Macros add to {fromMacros} kcal
            </p>
          </div>
          <div className="text-right text-sm tabular text-muted">
            <div>P {Math.round(split.protein * 100)}%</div>
            <div>C {Math.round(split.carbs * 100)}%</div>
            <div>F {Math.round(split.fat * 100)}%</div>
          </div>
        </div>
        <Progress
          value={percent(dayTotals.calories, target?.dailyCalories ?? 1)}
          tone={over ? "warning" : "accent"}
          className="mt-5"
        />
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          <MacroLine
            label="Protein"
            current={dayTotals.protein}
            target={target?.proteinG ?? 0}
            unit="g"
            tone="success"
          />
          <MacroLine
            label="Carbs"
            current={dayTotals.carbs}
            target={target?.carbsG ?? 0}
            unit="g"
            tone="accent"
          />
          <MacroLine
            label="Fat"
            current={dayTotals.fat}
            target={target?.fatG ?? 0}
            unit="g"
            tone="warning"
          />
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {MEALS.map((slot) => {
          const totals = meals[slot];
          const active = meal === slot;
          return (
            <button
              key={slot}
              onClick={() => setMeal(slot)}
              className={cn(
                "rounded-3xl border p-4 text-left transition",
                active ? "border-accent/40 bg-accent/10" : "border-white/6 bg-card",
              )}
            >
              <div className="text-xs uppercase tracking-[0.14em] text-muted">{slot}</div>
              <div className="mt-2 text-2xl font-semibold tabular">
                {Math.round(totals.calories)}
                <span className="text-sm font-medium text-muted"> kcal</span>
              </div>
              <div className="mt-2 text-xs tabular text-muted">
                {totals.protein.toFixed(0)}P · {totals.carbs.toFixed(0)}C · {totals.fat.toFixed(0)}F
              </div>
            </button>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick add · {meal}</CardTitle>
          <div className="text-xs tabular text-muted">
            {Math.round(mealTotals.calories)} kcal · {mealTotals.protein.toFixed(0)}P ·{" "}
            {mealTotals.carbs.toFixed(0)}C · {mealTotals.fat.toFixed(0)}F
          </div>
        </CardHeader>
        <div className="flex flex-wrap gap-2">
          {QUICK_ADD_IDS.map((id) => {
            const food = foodById(id);
            if (!food) return null;
            return (
              <Button key={id} variant="secondary" onClick={() => state.addFood(id, 1, meal)}>
                + {food.name} · {food.calories} kcal · {food.protein}P
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
                <div>{food.calories} kcal</div>
                <div className="text-xs text-muted">
                  {food.protein}P · {food.carbs}C · {food.fat}F
                </div>
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today · {meal}</CardTitle>
          <div className="text-sm tabular text-muted">
            {Math.round(mealTotals.calories)} kcal total
          </div>
        </CardHeader>
        <div className="space-y-2">
          {mealLog.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white/3 px-4 py-3">
              <div className="min-w-0">
                <div className="truncate font-medium">
                  {item.name} × {item.servings}
                </div>
                <div className="text-xs tabular text-muted">
                  {Math.round(item.calories)} kcal · {item.protein.toFixed(1)}g P · {item.carbs.toFixed(1)}g C ·{" "}
                  {item.fat.toFixed(1)}g F
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => state.removeFood(item.id)}>
                Remove
              </Button>
            </div>
          ))}
          {mealLog.length === 0 && <p className="text-sm text-muted">Nothing logged in this meal yet.</p>}
        </div>
        {mealLog.length > 0 && (
          <div className="mt-4 rounded-2xl border border-white/6 px-4 py-3 text-sm tabular">
            Meal total · {Math.round(mealTotals.calories)} kcal · {mealTotals.protein.toFixed(1)}g P ·{" "}
            {mealTotals.carbs.toFixed(1)}g C · {mealTotals.fat.toFixed(1)}g F
          </div>
        )}
      </Card>

      <Card>
        <CardTitle className="mb-4">Day total</CardTitle>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm tabular">
            <thead className="text-xs uppercase tracking-[0.14em] text-muted">
              <tr>
                <th className="pb-2 font-medium">Meal</th>
                <th className="pb-2 font-medium">Calories</th>
                <th className="pb-2 font-medium">Protein</th>
                <th className="pb-2 font-medium">Carbs</th>
                <th className="pb-2 font-medium">Fat</th>
              </tr>
            </thead>
            <tbody>
              {MEALS.map((slot) => (
                <tr key={slot} className="border-t border-white/6">
                  <td className="py-2 capitalize">{slot}</td>
                  <td>{Math.round(meals[slot].calories)}</td>
                  <td>{meals[slot].protein.toFixed(1)}g</td>
                  <td>{meals[slot].carbs.toFixed(1)}g</td>
                  <td>{meals[slot].fat.toFixed(1)}g</td>
                </tr>
              ))}
              <tr className="border-t border-white/10 font-semibold">
                <td className="py-3">Total</td>
                <td>
                  {Math.round(dayTotals.calories)} / {target?.dailyCalories ?? "—"}
                </td>
                <td>
                  {dayTotals.protein.toFixed(1)} / {target?.proteinG ?? "—"}g
                </td>
                <td>
                  {dayTotals.carbs.toFixed(1)} / {target?.carbsG ?? "—"}g
                </td>
                <td>
                  {dayTotals.fat.toFixed(1)} / {target?.fatG ?? "—"}g
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <Card id="supplements">
        <CardTitle className="mb-2">Supplement stack</CardTitle>
        <p className="mb-4 text-sm text-muted">
          Default stack if no labs. Iron only appears when a report says ferritin or hemoglobin is low.
        </p>
        <div className="space-y-2">
          {SUPPLEMENTS.filter((s) => stack.includes(s.id)).map((item) => {
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
