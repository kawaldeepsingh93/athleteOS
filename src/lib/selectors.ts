import { generateWorkout } from "@/lib/engines/workouts";
import type { AthleteState } from "@/lib/types";
import { todayISO } from "@/lib/utils";

export function dateFor(state: AthleteState) {
  if (!state.profile) return todayISO();
  const start = new Date(`${state.profile.startDate}T00:00:00`);
  start.setDate(start.getDate() + (state.currentDay - 1));
  return start.toISOString().slice(0, 10);
}

export function selectToday(state: AthleteState) {
  const date = dateFor(state);
  const workout =
    state.workouts.find((w) => w.day === state.currentDay) ??
    (state.profile
      ? generateWorkout(state.currentDay, date, state.profile.equipment, state.protocol)
      : null);
  const mission = state.missions.find((m) => m.day === state.currentDay);
  const nutrition = state.nutrition.filter((n) => n.date === date);
  return {
    date,
    workout,
    mission,
    nutrition,
    protein: nutrition.reduce((sum, n) => sum + n.protein, 0),
    calories: nutrition.reduce((sum, n) => sum + n.calories, 0),
    carbs: nutrition.reduce((sum, n) => sum + n.carbs, 0),
    fat: nutrition.reduce((sum, n) => sum + n.fat, 0),
    water: state.water.find((w) => w.date === date)?.liters ?? 0,
    sleep: state.sleep.find((s) => s.date === date),
  };
}
