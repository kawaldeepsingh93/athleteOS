import type { AthleteState, Profile, Targets, WeeklyProgress } from "@/lib/types";

export function profileRow(athleteId: string, state: Pick<AthleteState, "profile" | "targets" | "currentDay" | "xp" | "streak" | "longestStreak">) {
  const profile = state.profile;
  if (!profile) return null;
  const targets = state.targets;
  return {
    athlete_id: athleteId,
    name: profile.name,
    age: profile.age,
    height_cm: profile.heightCm,
    weight_kg: profile.weightKg,
    body_fat: profile.bodyFat,
    goal_weight_kg: profile.goalWeightKg,
    goal_body_fat: profile.goalBodyFat,
    activity_level: profile.activityLevel,
    equipment: profile.equipment,
    diet_type: profile.dietType,
    wake_time: profile.wakeTime,
    sleep_time: profile.sleepTime,
    unit_system: profile.unitSystem,
    start_date: profile.startDate,
    current_day: state.currentDay,
    xp: state.xp,
    streak: state.streak,
    longest_streak: state.longestStreak,
    daily_calories: targets?.dailyCalories ?? null,
    protein_g: targets?.proteinG ?? null,
    water_l: targets?.waterL ?? null,
    updated_at: new Date().toISOString(),
  };
}

export function weeklyRows(athleteId: string, weeks: WeeklyProgress[]) {
  return weeks.map((week) => ({
    athlete_id: athleteId,
    week: week.week,
    start_day: week.startDay,
    end_day: week.endDay,
    days_completed: week.daysCompleted,
    workouts_completed: week.workoutsCompleted,
    protein_hit_days: week.proteinHitDays,
    avg_weight_kg: week.avgWeightKg ?? null,
    avg_sleep_hours: week.avgSleepHours ?? null,
    water_avg_l: week.waterAvgL ?? null,
    run_km: week.runKm,
    xp_earned: week.xpEarned,
    streak: week.streak,
    summary: week.summary,
    updated_at: new Date().toISOString(),
  }));
}

export function profileFromRow(row: Record<string, unknown>): { profile: Profile; targets: Partial<Targets> } {
  return {
    profile: {
      name: String(row.name),
      age: Number(row.age),
      heightCm: Number(row.height_cm),
      weightKg: Number(row.weight_kg),
      bodyFat: Number(row.body_fat ?? 0),
      goalWeightKg: Number(row.goal_weight_kg ?? row.weight_kg),
      goalBodyFat: Number(row.goal_body_fat ?? 15),
      activityLevel: row.activity_level as Profile["activityLevel"],
      equipment: row.equipment as Profile["equipment"],
      dietType: row.diet_type as Profile["dietType"],
      wakeTime: String(row.wake_time),
      sleepTime: String(row.sleep_time),
      unitSystem: (row.unit_system as Profile["unitSystem"]) ?? "metric",
      startDate: String(row.start_date).slice(0, 10),
    },
    targets: {
      dailyCalories: row.daily_calories != null ? Number(row.daily_calories) : undefined,
      proteinG: row.protein_g != null ? Number(row.protein_g) : undefined,
      waterL: row.water_l != null ? Number(row.water_l) : undefined,
    },
  };
}
