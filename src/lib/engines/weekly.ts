import type { AthleteState, WeeklyProgress } from "@/lib/types";
import { dateFor } from "@/lib/selectors";

function dateForDay(state: AthleteState, day: number) {
  if (!state.profile) return dateFor(state);
  const start = new Date(`${state.profile.startDate}T00:00:00`);
  start.setDate(start.getDate() + (day - 1));
  return start.toISOString().slice(0, 10);
}

export function weekOf(day: number) {
  return Math.max(1, Math.ceil(day / 7));
}

export function buildWeeklyProgress(state: AthleteState): WeeklyProgress[] {
  const weeks = weekOf(state.currentDay);
  const proteinTarget = state.targets?.proteinG ?? 140;

  return Array.from({ length: weeks }, (_, i) => {
    const week = i + 1;
    const startDay = (week - 1) * 7 + 1;
    const endDay = Math.min(week * 7, 365);
    const visibleEnd = Math.min(endDay, state.currentDay);
    const daysCompleted = state.completedDays.filter((d) => d >= startDay && d <= visibleEnd).length;

    const workoutsCompleted = state.workouts.filter(
      (w) => w.day >= startDay && w.day <= visibleEnd && w.exercises.every((e) => e.completed),
    ).length;

    let proteinHitDays = 0;
    for (let day = startDay; day <= visibleEnd; day += 1) {
      const date = dateForDay(state, day);
      const protein = state.nutrition
        .filter((n) => n.date === date)
        .reduce((sum, n) => sum + n.protein, 0);
      if (protein >= proteinTarget) proteinHitDays += 1;
    }

    const weekDates = new Set(
      Array.from({ length: visibleEnd - startDay + 1 }, (_, j) => dateForDay(state, startDay + j)),
    );

    const weights = state.measurements.filter((m) => weekDates.has(m.date)).map((m) => m.weightKg);
    const sleeps = state.sleep.filter((s) => weekDates.has(s.date));
    const waters = state.water.filter((w) => weekDates.has(w.date));
    const runs = state.runs.filter((r) => weekDates.has(r.date));

    const avg = (nums: number[]) =>
      nums.length ? Number((nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1)) : undefined;

    const row: WeeklyProgress = {
      week,
      startDay,
      endDay: visibleEnd,
      daysCompleted,
      workoutsCompleted,
      proteinHitDays,
      avgWeightKg: avg(weights),
      avgSleepHours: avg(sleeps.map((s) => s.hours)),
      waterAvgL: avg(waters.map((w) => w.liters)),
      runKm: Number(runs.reduce((sum, r) => sum + r.distanceKm, 0).toFixed(2)),
      xpEarned: daysCompleted * 100 + workoutsCompleted * 50,
      streak: state.streak,
      summary:
        daysCompleted >= 6
          ? "Strong week. The lock held."
          : daysCompleted >= 3
            ? "Partial week. Finish the open days."
            : week === weeks
              ? "This week is still being written."
              : "Light week. The year still counts the ones you won.",
    };
    return row;
  });
}
