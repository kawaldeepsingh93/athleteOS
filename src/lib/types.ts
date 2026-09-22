export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "athlete";

export type DietType =
  | "vegetarian"
  | "eggetarian"
  | "non_vegetarian"
  | "vegan";

export type Equipment = "bodyweight" | "dumbbells" | "gym";

export type UnitSystem = "metric" | "imperial";

export type Rank = "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";

export type ExerciseCategory =
  | "push"
  | "pull"
  | "legs"
  | "core"
  | "run"
  | "mobility"
  | "full";

export type RunMode = "zone2" | "tempo" | "intervals" | "long";

export type MissionCategory =
  | "run"
  | "strength"
  | "protein"
  | "water"
  | "mobility"
  | "sleep";

export interface Profile {
  name: string;
  age: number;
  heightCm: number;
  weightKg: number;
  bodyFat: number;
  goalWeightKg: number;
  goalBodyFat: number;
  activityLevel: ActivityLevel;
  equipment: Equipment;
  dietType: DietType;
  wakeTime: string;
  sleepTime: string;
  unitSystem: UnitSystem;
  startDate: string;
}

export interface Targets {
  maintenanceCalories: number;
  dailyCalories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  waterL: number;
  sleepHours: number;
}

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  sets: number;
  reps: number;
  weightKg?: number;
  durationSec?: number;
  notes?: string;
  completed: boolean;
}

export interface Workout {
  id: string;
  date: string;
  day: number;
  title: string;
  focus: ExerciseCategory[];
  exercises: Exercise[];
}

export interface Food {
  id: string;
  name: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  tags: string[];
  vegetarian: boolean;
  vegan: boolean;
  containsEgg: boolean;
}

export type MealSlot = "breakfast" | "lunch" | "dinner" | "snack";

export interface NutritionLog {
  id: string;
  date: string;
  foodId: string;
  name: string;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal: MealSlot;
}

export interface SupplementDef {
  id: string;
  name: string;
  dose: string;
  timing: string;
  why: string;
}

export interface SupplementLog {
  id: string;
  date: string;
  supplementId: string;
  name: string;
  taken: boolean;
}

export type LabFlag = "low" | "ok" | "high";

export interface BloodMarker {
  id: string;
  name: string;
  value: number;
  unit: string;
  refLow: number;
  refHigh: number;
  flag: LabFlag;
}

export interface BloodReport {
  id: string;
  date: string;
  labName: string;
  notes?: string;
  markers: BloodMarker[];
}

export interface Protocol {
  source: "default" | "labs" | "ai";
  summary: string;
  calorieDelta: number;
  proteinDelta: number;
  intensity: number;
  preferZone2: boolean;
  dietNotes: string;
  trainingNotes: string;
  supplementIds: string[];
  createdAt: string;
}

export interface WaterLog {
  date: string;
  liters: number;
}

export interface SleepLog {
  date: string;
  hours: number;
  recoveryScore: number;
  sunlight: boolean;
}

export interface RunLog {
  id: string;
  date: string;
  mode: RunMode;
  distanceKm: number;
  durationMin: number;
  paceMinPerKm: number;
}

export interface Measurement {
  id: string;
  date: string;
  weightKg: number;
  waistCm?: number;
  chestCm?: number;
  armsCm?: number;
  thighCm?: number;
  bodyFat?: number;
  photoNote?: string;
}

export interface MissionTask {
  id: string;
  label: string;
  category: MissionCategory;
  completed: boolean;
}

export interface Mission {
  day: number;
  title: string;
  brief: string;
  unlocked: boolean;
  completed: boolean;
  completedAt?: string;
  tasks: MissionTask[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface CoachMessage {
  id: string;
  role: "user" | "coach";
  content: string;
  createdAt: string;
}

export interface Settings {
  darkMode: boolean;
  unitSystem: UnitSystem;
  notifications: boolean;
  morningBrief: boolean;
  eveningWindDown: boolean;
  reduceMotion: boolean;
}

export interface StrengthStandards {
  pushUps: number;
  pullUps: number;
  squatReps: number;
  fiveKMin: number;
}

export interface AthleteState {
  athleteId: string;
  updatedAt: string;
  onboarded: boolean;
  hydrated: boolean;
  profile: Profile | null;
  targets: Targets | null;
  standards: StrengthStandards | null;
  currentDay: number;
  xp: number;
  streak: number;
  longestStreak: number;
  completedDays: number[];
  workouts: Workout[];
  nutrition: NutritionLog[];
  water: WaterLog[];
  sleep: SleepLog[];
  runs: RunLog[];
  measurements: Measurement[];
  missions: Mission[];
  achievements: Achievement[];
  coachMessages: CoachMessage[];
  supplements: SupplementLog[];
  bloodReports: BloodReport[];
  protocol: Protocol | null;
  settings: Settings;
  celebration: { day: number; xp: number } | null;
}

export interface WeeklyProgress {
  week: number;
  startDay: number;
  endDay: number;
  daysCompleted: number;
  workoutsCompleted: number;
  proteinHitDays: number;
  avgWeightKg?: number;
  avgSleepHours?: number;
  waterAvgL?: number;
  runKm: number;
  xpEarned: number;
  streak: number;
  summary: string;
}

export interface RoadmapMonth {
  month: number;
  title: string;
  focus: string;
  expectedWeightKg: number;
  expectedBodyFat: number;
}
