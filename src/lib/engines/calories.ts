import { round } from "@/lib/utils";
import type {
  ActivityLevel,
  Profile,
  RoadmapMonth,
  StrengthStandards,
  Targets,
} from "@/lib/types";

const ACTIVITY: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9,
};

export function mifflinStJeor(weightKg: number, heightCm: number, age: number) {
  return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
}

export function buildTargets(profile: Profile): Targets {
  const bmr = mifflinStJeor(profile.weightKg, profile.heightCm, profile.age);
  const maintenance = Math.round(bmr * ACTIVITY[profile.activityLevel]);
  const deficit = profile.weightKg > profile.goalWeightKg ? 400 : 200;
  const dailyCalories = Math.max(1600, maintenance - deficit);
  const proteinG = Math.round(Math.max(profile.weightKg, profile.goalWeightKg) * 1.9);
  const fatG = Math.round((dailyCalories * 0.28) / 9);
  const carbsG = Math.round((dailyCalories - proteinG * 4 - fatG * 9) / 4);

  return {
    maintenanceCalories: maintenance,
    dailyCalories,
    proteinG,
    carbsG,
    fatG,
    waterL: 3.5,
    sleepHours: 8,
  };
}

export function buildStandards(profile: Profile): StrengthStandards {
  const lean = profile.weightKg * (1 - profile.bodyFat / 100);
  return {
    pushUps: Math.max(12, Math.round(lean / 3.2)),
    pullUps: profile.bodyFat > 22 ? 1 : profile.bodyFat > 16 ? 4 : 8,
    squatReps: 20,
    fiveKMin: profile.activityLevel === "sedentary" ? 36 : 32,
  };
}

export function buildRoadmap(profile: Profile): RoadmapMonth[] {
  const months = 12;
  const weightDelta = profile.weightKg - profile.goalWeightKg;
  const fatDelta = profile.bodyFat - profile.goalBodyFat;
  const titles = [
    "Foundation & posture",
    "Aerobic base",
    "Visible leanness",
    "Strength density",
    "Engine building",
    "Athletic shape",
    "Pace breakthrough",
    "Armor & mobility",
    "Race readiness",
    "Precision cutting",
    "Peak discipline",
    "The athlete you built",
  ];
  const focuses = [
    "Win the morning. Learn the language of sets, sleep, and protein.",
    "Zone 2 becomes identity. Joints get quiet. Streaks start compounding.",
    "Waist drops first. Clothes fit differently. Push-ups feel like skill.",
    "Progressive overload is automatic. Pull-ups enter the room.",
    "Long run Saturday. Tempo Thursday. You stop negotiating with weather.",
    "Shoulders, posture, and gait look athletic before they look 'gym'.",
    "5K personal best window. Breathing stays calm at old redline.",
    "Hips and thoracic spine unlock speed you already earned.",
    "You can suffer on purpose and recover on purpose.",
    "Body-fat estimate approaches the visual you were promised.",
    "The system runs you. Discipline is cheaper than motivation.",
    "Day 365. You are hard to kill — and harder to stop.",
  ];

  return Array.from({ length: months }, (_, i) => {
    const t = (i + 1) / months;
    const ease = 1 - Math.pow(1 - t, 1.15);
    return {
      month: i + 1,
      title: titles[i],
      focus: focuses[i],
      expectedWeightKg: round(profile.weightKg - weightDelta * ease, 1),
      expectedBodyFat: round(profile.bodyFat - fatDelta * ease, 1),
    };
  });
}

export function leanMass(weightKg: number, bodyFat: number) {
  return round(weightKg * (1 - bodyFat / 100), 1);
}
