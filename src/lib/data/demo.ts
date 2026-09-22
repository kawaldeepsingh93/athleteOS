import { ACHIEVEMENT_DEFS } from "@/lib/engines/gamification";
import { generateYear } from "@/lib/engines/missions";
import { generateWorkout } from "@/lib/engines/workouts";
import { buildStandards, buildTargets } from "@/lib/engines/calories";
import { emptyProtocol } from "@/lib/engines/protocol";
import { uid } from "@/lib/utils";
import type { AthleteState, Measurement, Profile, RunLog } from "@/lib/types";

export const DEMO_PROFILE: Profile = {
  name: "Arjun",
  age: 28,
  heightCm: 178,
  weightKg: 82,
  bodyFat: 22,
  goalWeightKg: 74,
  goalBodyFat: 12,
  activityLevel: "moderate",
  equipment: "dumbbells",
  dietType: "eggetarian",
  wakeTime: "05:30",
  sleepTime: "22:00",
  unitSystem: "metric",
  startDate: "2026-08-27",
};

function dateForDay(day: number) {
  const start = new Date(`${DEMO_PROFILE.startDate}T00:00:00`);
  start.setDate(start.getDate() + (day - 1));
  return start.toISOString().slice(0, 10);
}

function measurements(): Measurement[] {
  return Array.from({ length: 27 }, (_, i) => {
    const day = i + 1;
    const t = i / 26;
    return {
      id: uid("m"),
      date: dateForDay(day),
      weightKg: Number((82 - 1.6 * t + Math.sin(i / 3) * 0.25).toFixed(1)),
      waistCm: Number((88 - 2.2 * t).toFixed(1)),
      chestCm: Number((98 + 0.6 * t).toFixed(1)),
      armsCm: Number((33.5 + 0.4 * t).toFixed(1)),
      thighCm: Number((56 - 0.3 * t).toFixed(1)),
      bodyFat: Number((22 - 1.4 * t).toFixed(1)),
    };
  });
}

function runs(): RunLog[] {
  return [3, 6, 10, 13, 17, 20, 24, 27].map((day, i) => ({
    id: uid("run"),
    date: dateForDay(day),
    mode: (["zone2", "tempo", "intervals", "long"] as const)[i % 4],
    distanceKm: i % 4 === 3 ? 10 : i % 4 === 2 ? 6 : 5,
    durationMin: Number((28.4 - i * 0.35 + (i % 4 === 3 ? 26 : 0)).toFixed(1)),
    paceMinPerKm: Number((5.7 - i * 0.06).toFixed(2)),
  }));
}

export function createDemoState(): AthleteState {
  const currentDay = 27;
  const profile = DEMO_PROFILE;
  const missions = generateYear(currentDay).map((mission) => {
    if (mission.day < currentDay) {
      return {
        ...mission,
        unlocked: true,
        completed: true,
        completedAt: `${dateForDay(mission.day)}T21:10:00.000Z`,
        tasks: mission.tasks.map((t) => ({ ...t, completed: true })),
      };
    }
    if (mission.day === currentDay) {
      return {
        ...mission,
        unlocked: true,
        tasks: mission.tasks.map((t) => ({
          ...t,
          completed: t.category === "water" || t.category === "mobility",
        })),
      };
    }
    return mission;
  });

  const workout = generateWorkout(currentDay, dateForDay(currentDay), profile.equipment);
  workout.exercises = workout.exercises.map((ex, i) => ({
    ...ex,
    completed: i === 0,
  }));

  return {
    athleteId: "11111111-1111-1111-1111-111111111111",
    updatedAt: new Date().toISOString(),
    onboarded: true,
    hydrated: true,
    profile,
    targets: buildTargets(profile),
    standards: buildStandards(profile),
    currentDay,
    xp: 4280,
    streak: 12,
    longestStreak: 12,
    completedDays: Array.from({ length: 26 }, (_, i) => i + 1),
    workouts: [workout],
    nutrition: [
      { id: uid("n"), date: dateForDay(currentDay), foodId: "egg", name: "Egg", servings: 3, calories: 234, protein: 18.9, carbs: 1.8, fat: 15.9, meal: "breakfast" },
      { id: uid("n"), date: dateForDay(currentDay), foodId: "oats", name: "Oats", servings: 1, calories: 150, protein: 5, carbs: 27, fat: 3, meal: "breakfast" },
      { id: uid("n"), date: dateForDay(currentDay), foodId: "milk", name: "Milk", servings: 1, calories: 150, protein: 8, carbs: 12, fat: 8, meal: "breakfast" },
    ],
    water: [{ date: dateForDay(currentDay), liters: 2 }],
    sleep: [
      { date: dateForDay(currentDay - 1), hours: 7.4, recoveryScore: 78, sunlight: true },
    ],
    runs: runs(),
    measurements: measurements(),
    missions,
    achievements: ACHIEVEMENT_DEFS.map((a) => ({
      ...a,
      unlockedAt: ["day-1", "sunrise", "protein-7"].includes(a.id)
        ? dateForDay(a.id === "day-1" ? 1 : 18)
        : undefined,
    })),
    coachMessages: [
      {
        id: uid("c"),
        role: "coach",
        content:
          "Day 27. The streak is 12. Water is already moving. Finish protein and the strength block — tomorrow stays locked until you do. No guilt. Just the work.",
        createdAt: `${dateForDay(currentDay)}T05:02:00.000Z`,
      },
    ],
    supplements: [
      { id: uid("s"), date: dateForDay(currentDay), supplementId: "vit-d3", name: "Vitamin D3", taken: true },
      { id: uid("s"), date: dateForDay(currentDay), supplementId: "omega3", name: "Omega-3", taken: false },
      { id: uid("s"), date: dateForDay(currentDay), supplementId: "mag", name: "Magnesium glycinate", taken: false },
      { id: uid("s"), date: dateForDay(currentDay), supplementId: "creatine", name: "Creatine monohydrate", taken: true },
    ],
    bloodReports: [],
    protocol: emptyProtocol(),
    settings: {
      darkMode: true,
      unitSystem: "metric",
      notifications: true,
      morningBrief: true,
      eveningWindDown: true,
      reduceMotion: false,
    },
    celebration: null,
  };
}

export function createBlankState(): AthleteState {
  return {
    athleteId: "",
    updatedAt: new Date().toISOString(),
    onboarded: false,
    hydrated: true,
    profile: null,
    targets: null,
    standards: null,
    currentDay: 1,
    xp: 0,
    streak: 0,
    longestStreak: 0,
    completedDays: [],
    workouts: [],
    nutrition: [],
    water: [],
    sleep: [],
    runs: [],
    measurements: [],
    missions: generateYear(1),
    achievements: ACHIEVEMENT_DEFS.map((a) => ({ ...a })),
    coachMessages: [],
    supplements: [],
    bloodReports: [],
    protocol: null,
    settings: {
      darkMode: true,
      unitSystem: "metric",
      notifications: true,
      morningBrief: true,
      eveningWindDown: true,
      reduceMotion: false,
    },
    celebration: null,
  };
}

export const DEFAULT_SLEEP = { hours: 7.6, recoveryScore: 74, sunlight: false };
