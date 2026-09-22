"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createBlankState, createDemoState, DEFAULT_SLEEP } from "@/lib/data/demo";
import { defaultMeal, foodById } from "@/lib/data/foods";
import { supplementById } from "@/lib/data/supplements";
import { buildStandards, buildTargets } from "@/lib/engines/calories";
import { applyProtocolToTargets, protocolFromLabs } from "@/lib/engines/protocol";
import {
  evaluateAchievements,
  XP,
} from "@/lib/engines/gamification";
import { generateYear, isMissionComplete } from "@/lib/engines/missions";
import { paceFrom } from "@/lib/engines/running";
import { generateWorkout } from "@/lib/engines/workouts";
import { haptic } from "@/lib/haptics";
import type {
  AthleteState,
  MissionCategory,
  BloodReport,
  MealSlot,
  Profile,
  Protocol,
  RunMode,
  Settings,
} from "@/lib/types";
import { dateFor } from "@/lib/selectors";
import { todayISO, uid } from "@/lib/utils";

interface Actions {
  hydrateFlag: () => void;
  loadDemo: () => void;
  reset: () => void;
  completeOnboarding: (profile: Profile) => void;
  ensureToday: () => void;
  toggleExercise: (exerciseId: string) => void;
  addFood: (foodId: string, servings?: number, meal?: MealSlot) => void;
  removeFood: (logId: string) => void;
  setWater: (liters: number) => void;
  logSleep: (hours: number, sunlight?: boolean) => void;
  toggleSunlight: () => void;
  logRun: (input: { mode: RunMode; distanceKm: number; durationMin: number }) => void;
  addMeasurement: (weightKg: number, extras?: Partial<{ waistCm: number; chestCm: number; armsCm: number; thighCm: number; bodyFat: number }>) => void;
  completeMissionTask: (category: MissionCategory) => void;
  completeDay: () => void;
  dismissCelebration: () => void;
  sendCoach: (role: "user" | "coach", content: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  toggleSupplement: (supplementId: string) => void;
  addBloodReport: (report: BloodReport) => void;
  applyProtocol: (protocol: Protocol) => void;
}

export type Store = AthleteState & Actions;


function proteinToday(state: AthleteState) {
  const date = dateFor(state);
  return state.nutrition
    .filter((n) => n.date === date)
    .reduce((sum, n) => sum + n.protein, 0);
}

function syncMission(state: AthleteState, category: MissionCategory) {
  const mission = state.missions.find((m) => m.day === state.currentDay);
  if (!mission || mission.completed) return state.missions;
  return state.missions.map((m) => {
    if (m.day !== state.currentDay) return m;
    return {
      ...m,
      tasks: m.tasks.map((t) =>
        t.category === category ? { ...t, completed: true } : t,
      ),
    };
  });
}

function refreshAchievements(state: AthleteState): AthleteState {
  const pushUpsToday = state.workouts
    .flatMap((w) => w.exercises)
    .filter((e) => e.completed && e.name.toLowerCase().includes("push"))
    .reduce((sum, e) => sum + e.sets * e.reps, 0);
  const heaviest = state.workouts
    .flatMap((w) => w.exercises)
    .reduce((max, e) => Math.max(max, e.weightKg ?? 0), 0);
  const pullUpsLogged = state.workouts
    .flatMap((w) => w.exercises)
    .some((e) => e.completed && e.name.toLowerCase().includes("pull-up"));
  const bestFiveK = state.runs
    .filter((r) => Math.abs(r.distanceKm - 5) < 0.4)
    .reduce<number | null>(
      (best, r) => (best === null || r.durationMin < best ? r.durationMin : best),
      null,
    );
  const sunlightCount = state.sleep.filter((s) => s.sunlight).length;
  const proteinStreak = state.targets
    ? state.completedDays.slice(-7).length >= 7
      ? 7
      : Math.min(7, state.streak)
    : 0;

  return {
    ...state,
    achievements: evaluateAchievements({
      achievements: state.achievements,
      streak: state.streak,
      completedDays: state.completedDays,
      pullUpsLogged,
      pushUpsToday,
      bestFiveKMin: bestFiveK,
      heaviestLift: heaviest,
      proteinStreak,
      sunlightCount,
    }),
  };
}

export const useAthleteStore = create<Store>()(
  persist(
    (set, get) => ({
      ...createBlankState(),
      hydrated: false,

      hydrateFlag: () => set({ hydrated: true }),

      loadDemo: () => {
        set({ ...createDemoState(), hydrated: true });
        haptic("success");
      },

      reset: () => set({ ...createBlankState(), hydrated: true }),

      completeOnboarding: (profile) => {
        const startDate = todayISO();
        const nextProfile = { ...profile, startDate };
        const workout = generateWorkout(1, startDate, nextProfile.equipment);
        const athleteId = crypto.randomUUID();
        set({
          ...createBlankState(),
          athleteId,
          updatedAt: new Date().toISOString(),
          onboarded: true,
          hydrated: true,
          profile: nextProfile,
          targets: buildTargets(nextProfile),
          standards: buildStandards(nextProfile),
          currentDay: 1,
          workouts: [workout],
          measurements: [
            {
              id: uid("m"),
              date: startDate,
              weightKg: nextProfile.weightKg,
              bodyFat: nextProfile.bodyFat,
            },
          ],
          coachMessages: [
            {
              id: uid("c"),
              role: "coach",
              content: `${nextProfile.name.split(" ")[0]}, Day 1 is unlocked. Win the mission in front of you. Tomorrow stays dark until you do.`,
              createdAt: new Date().toISOString(),
            },
          ],
        });
      },

      ensureToday: () => {
        const state = get();
        if (!state.profile) return;
        const date = dateFor(state);
        const hasWorkout = state.workouts.some((w) => w.day === state.currentDay);
        if (hasWorkout) return;
        set({
          workouts: [
            ...state.workouts,
            generateWorkout(state.currentDay, date, state.profile.equipment, state.protocol),
          ],
        });
      },

      toggleExercise: (exerciseId) => {
        const state = get();
        const workouts = state.workouts.map((w) => {
          if (w.day !== state.currentDay) return w;
          return {
            ...w,
            exercises: w.exercises.map((e) =>
              e.id === exerciseId ? { ...e, completed: !e.completed } : e,
            ),
          };
        });
        const current = workouts.find((w) => w.day === state.currentDay);
        const justCompleted = current?.exercises.find((e) => e.id === exerciseId)?.completed;
        let xp = state.xp + (justCompleted ? XP.exercise : 0);
        let missions = state.missions;
        if (current && current.exercises.every((e) => e.completed)) {
          xp += XP.workout;
          missions = syncMission({ ...state, missions }, "strength");
          if (current.exercises.some((e) => e.category === "mobility")) {
            missions = syncMission({ ...state, missions }, "mobility");
          }
          if (current.exercises.some((e) => e.category === "run")) {
            missions = syncMission({ ...state, missions }, "run");
          }
        }
        haptic(justCompleted ? "success" : "light");
        set(refreshAchievements({ ...state, workouts, xp, missions }));
      },

      addFood: (foodId, servings = 1, meal) => {
        const food = foodById(foodId);
        if (!food) return;
        const state = get();
        const date = dateFor(state);
        const entry = {
          id: uid("n"),
          date,
          foodId: food.id,
          name: food.name,
          servings,
          calories: food.calories * servings,
          protein: food.protein * servings,
          carbs: food.carbs * servings,
          fat: food.fat * servings,
          meal: meal ?? defaultMeal(food.id),
        };
        const nutrition = [...state.nutrition, entry];
        let xp = state.xp;
        let missions = state.missions;
        const protein = proteinToday({ ...state, nutrition });
        if (state.targets && protein >= state.targets.proteinG) {
          missions = syncMission(state, "protein");
          if (!state.missions.find((m) => m.day === state.currentDay)?.tasks.find((t) => t.category === "protein")?.completed) {
            xp += XP.protein;
          }
        }
        haptic("light");
        set({ nutrition, xp, missions });
      },

      removeFood: (logId) =>
        set((state) => ({
          nutrition: state.nutrition.filter((n) => n.id !== logId),
        })),

      setWater: (liters) => {
        const state = get();
        const date = dateFor(state);
        const clamped = Math.max(0, Math.min(5, Number(liters.toFixed(1))));
        const water = [
          ...state.water.filter((w) => w.date !== date),
          { date, liters: clamped },
        ];
        let missions = state.missions;
        let xp = state.xp;
        if (state.targets && clamped >= state.targets.waterL) {
          const already = state.missions
            .find((m) => m.day === state.currentDay)
            ?.tasks.find((t) => t.category === "water")?.completed;
          missions = syncMission(state, "water");
          if (!already) xp += XP.water;
        }
        haptic("light");
        set({ water, missions, xp });
      },

      logSleep: (hours, sunlight) => {
        const state = get();
        const date = dateFor(state);
        const existing = state.sleep.find((s) => s.date === date);
        const recoveryScore = Math.max(
          40,
          Math.min(99, Math.round(50 + hours * 5 + (sunlight ?? existing?.sunlight ? 6 : 0))),
        );
        const entry = {
          date,
          hours,
          recoveryScore,
          sunlight: sunlight ?? existing?.sunlight ?? false,
        };
        const sleep = [...state.sleep.filter((s) => s.date !== date), entry];
        let missions = state.missions;
        let xp = state.xp;
        if (hours >= 7.5) {
          const already = state.missions
            .find((m) => m.day === state.currentDay)
            ?.tasks.find((t) => t.category === "sleep")?.completed;
          missions = syncMission(state, "sleep");
          if (!already) xp += XP.sleep;
        }
        haptic("medium");
        set(refreshAchievements({ ...state, sleep, missions, xp }));
      },

      toggleSunlight: () => {
        const state = get();
        const date = dateFor(state);
        const existing = state.sleep.find((s) => s.date === date) ?? {
          date,
          ...DEFAULT_SLEEP,
        };
        const sunlight = !existing.sunlight;
        get().logSleep(existing.hours, sunlight);
        if (sunlight) set({ xp: get().xp + XP.sunlight });
      },

      logRun: ({ mode, distanceKm, durationMin }) => {
        const state = get();
        const date = dateFor(state);
        const run = {
          id: uid("run"),
          date,
          mode,
          distanceKm,
          durationMin,
          paceMinPerKm: paceFrom(distanceKm, durationMin),
        };
        const missions = syncMission(state, "run");
        haptic("success");
        set(
          refreshAchievements({
            ...state,
            runs: [...state.runs, run],
            missions,
            xp: state.xp + XP.run,
          }),
        );
      },

      addMeasurement: (weightKg, extras = {}) => {
        const state = get();
        set({
          measurements: [
            ...state.measurements,
            {
              id: uid("m"),
              date: dateFor(state),
              weightKg,
              ...extras,
            },
          ],
        });
      },

      completeMissionTask: (category) => {
        const state = get();
        set({ missions: syncMission(state, category) });
      },

      completeDay: () => {
        const state = get();
        const mission = state.missions.find((m) => m.day === state.currentDay);
        if (!mission || !isMissionComplete(mission)) return;
        const completedDays = state.completedDays.includes(state.currentDay)
          ? state.completedDays
          : [...state.completedDays, state.currentDay];
        const nextDay = Math.min(365, state.currentDay + 1);
        const missions = generateYear(nextDay).map((m) => {
          const prev = state.missions.find((p) => p.day === m.day);
          if (m.day < nextDay) {
            return {
              ...m,
              unlocked: true,
              completed: true,
              completedAt: prev?.completedAt ?? new Date().toISOString(),
              tasks: m.tasks.map((t) => ({ ...t, completed: true })),
            };
          }
          if (m.day === nextDay) return { ...m, unlocked: true };
          return m;
        });
        const streak = state.streak + 1;
        haptic("success");
        set(
          refreshAchievements({
            ...state,
            completedDays,
            currentDay: nextDay,
            missions,
            streak,
            longestStreak: Math.max(state.longestStreak, streak),
            xp: state.xp + XP.dayComplete,
            celebration: { day: state.currentDay, xp: XP.dayComplete },
          }),
        );
      },

      dismissCelebration: () => set({ celebration: null }),

      sendCoach: (role, content) =>
        set((state) => ({
          coachMessages: [
            ...state.coachMessages,
            {
              id: uid("c"),
              role,
              content,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateSettings: (patch) =>
        set((state) => ({
          settings: { ...state.settings, ...patch },
          profile: state.profile
            ? {
                ...state.profile,
                unitSystem: patch.unitSystem ?? state.profile.unitSystem,
              }
            : state.profile,
        })),

      toggleSupplement: (supplementId) => {
        const state = get();
        const date = dateFor(state);
        const existing = state.supplements.find(
          (s) => s.date === date && s.supplementId === supplementId,
        );
        if (existing) {
          set({
            supplements: state.supplements.map((s) =>
              s.id === existing.id ? { ...s, taken: !s.taken } : s,
            ),
            updatedAt: new Date().toISOString(),
          });
          return;
        }
        const name = supplementById(supplementId)?.name ?? supplementId;
        set({
          supplements: [
            ...state.supplements,
            { id: uid("s"), date, supplementId, name, taken: true },
          ],
          updatedAt: new Date().toISOString(),
        });
      },

      addBloodReport: (report) => {
        const state = get();
        const reports = [...state.bloodReports, report];
        const protocol = protocolFromLabs(reports, state.profile);
        const base = state.profile ? buildTargets(state.profile) : state.targets;
        const targets = base ? applyProtocolToTargets(base, protocol) : state.targets;
        const date = dateFor(state);
        const current = state.workouts.find((w) => w.day === state.currentDay);
        const untouched = !current || current.exercises.every((e) => !e.completed);
        const workouts =
          untouched && state.profile
            ? [
                ...state.workouts.filter((w) => w.day !== state.currentDay),
                generateWorkout(state.currentDay, date, state.profile.equipment, protocol),
              ]
            : state.workouts;
        set({
          bloodReports: reports,
          protocol,
          targets,
          workouts,
          updatedAt: new Date().toISOString(),
        });
      },

      applyProtocol: (protocol) => {
        const state = get();
        const base = state.profile ? buildTargets(state.profile) : state.targets;
        const targets = base ? applyProtocolToTargets(base, protocol) : state.targets;
        set({ protocol, targets, updatedAt: new Date().toISOString() });
      },
    }),
    {
      name: "athleteos-v1",
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (!state.athleteId) state.athleteId = crypto.randomUUID();
        if (!state.supplements) state.supplements = [];
        if (!state.bloodReports) state.bloodReports = [];
        if (!state.protocol) state.protocol = null;
        state.nutrition = (state.nutrition ?? []).map((item) => ({
          ...item,
          meal: item.meal ?? defaultMeal(item.foodId),
        }));
        state.hydrateFlag();
      },
      partialize: (state) => {
        const skip = new Set(["hydrateFlag", "loadDemo", "reset", "completeOnboarding", "ensureToday", "toggleExercise", "addFood", "removeFood", "setWater", "logSleep", "toggleSunlight", "logRun", "addMeasurement", "completeMissionTask", "completeDay", "dismissCelebration", "sendCoach", "updateSettings", "toggleSupplement", "addBloodReport", "applyProtocol", "hydrated"]);
        return Object.fromEntries(
          Object.entries(state).filter(([key]) => !skip.has(key)),
        ) as AthleteState;
      },
    },
  ),
);

export { selectToday } from "@/lib/selectors";
