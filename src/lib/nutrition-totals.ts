import { defaultMeal } from "@/lib/data/foods";
import type { MealSlot, NutritionLog } from "@/lib/types";

export type MacroTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export function emptyMacros(): MacroTotals {
  return { calories: 0, protein: 0, carbs: 0, fat: 0 };
}

export function addMacros(a: MacroTotals, b: Pick<NutritionLog, "calories" | "protein" | "carbs" | "fat">): MacroTotals {
  return {
    calories: a.calories + b.calories,
    protein: a.protein + b.protein,
    carbs: a.carbs + b.carbs,
    fat: a.fat + b.fat,
  };
}

export function sumLogs(logs: NutritionLog[]): MacroTotals {
  return logs.reduce((acc, item) => addMacros(acc, item), emptyMacros());
}

export function mealOf(item: NutritionLog): MealSlot {
  return item.meal ?? defaultMeal(item.foodId);
}

export function macrosByMeal(logs: NutritionLog[]): Record<MealSlot, MacroTotals> {
  const buckets: Record<MealSlot, MacroTotals> = {
    breakfast: emptyMacros(),
    lunch: emptyMacros(),
    dinner: emptyMacros(),
    snack: emptyMacros(),
  };
  for (const item of logs) {
    const slot = mealOf(item);
    buckets[slot] = addMacros(buckets[slot], item);
  }
  return buckets;
}

export function kcalFromMacros(totals: MacroTotals) {
  return totals.protein * 4 + totals.carbs * 4 + totals.fat * 9;
}

export function macroPercents(totals: MacroTotals) {
  const kcal = Math.max(1, kcalFromMacros(totals));
  return {
    protein: (totals.protein * 4) / kcal,
    carbs: (totals.carbs * 4) / kcal,
    fat: (totals.fat * 9) / kcal,
  };
}
