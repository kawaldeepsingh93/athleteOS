import type { Achievement, Rank } from "@/lib/types";

export const XP = {
  exercise: 12,
  workout: 50,
  protein: 20,
  water: 15,
  sleep: 25,
  run: 40,
  mobility: 15,
  dayComplete: 100,
  sunlight: 8,
} as const;

export function levelFromXp(xp: number) {
  return Math.floor(xp / 500) + 1;
}

export function xpIntoLevel(xp: number) {
  return xp % 500;
}

export function rankFromLevel(level: number): Rank {
  if (level >= 36) return "Diamond";
  if (level >= 21) return "Platinum";
  if (level >= 11) return "Gold";
  if (level >= 6) return "Silver";
  return "Bronze";
}

export function nextMilestone(xp: number) {
  const level = levelFromXp(xp);
  const need = 500 - xpIntoLevel(xp);
  return {
    label: `Level ${level + 1} · ${rankFromLevel(level + 1)}`,
    remainingXp: need,
    progress: xpIntoLevel(xp) / 500,
  };
}

export const ACHIEVEMENT_DEFS: Omit<Achievement, "unlockedAt">[] = [
  { id: "first-pullup", title: "First Pull-up", description: "You got your chin over the bar.", icon: "pull" },
  { id: "hundred-pushups", title: "100 Push-ups", description: "A hundred honest reps in a single day.", icon: "push" },
  { id: "sub30", title: "Sub-30 5K", description: "Five kilometers in under 30 minutes.", icon: "run" },
  { id: "eighty-club", title: "80kg Club", description: "Logged an 80kg compound lift.", icon: "lift" },
  { id: "streak-30", title: "30-Day Streak", description: "A month without breaking the chain.", icon: "flame" },
  { id: "protein-7", title: "Protein Professional", description: "Hit protein 7 days in a row.", icon: "egg" },
  { id: "sunrise", title: "Sunlight Operator", description: "Morning sunlight logged 10 times.", icon: "sun" },
  { id: "day-1", title: "The Door Opens", description: "You completed Day 1.", icon: "key" },
];

export function evaluateAchievements(input: {
  achievements: Achievement[];
  streak: number;
  completedDays: number[];
  pullUpsLogged: boolean;
  pushUpsToday: number;
  bestFiveKMin: number | null;
  heaviestLift: number;
  proteinStreak: number;
  sunlightCount: number;
}): Achievement[] {
  const unlocked = new Set(input.achievements.filter((a) => a.unlockedAt).map((a) => a.id));
  const now = new Date().toISOString();
  const next = input.achievements.map((a) => ({ ...a }));

  const grant = (id: string) => {
    if (unlocked.has(id)) return;
    const found = next.find((a) => a.id === id);
    if (found && !found.unlockedAt) found.unlockedAt = now;
  };

  if (input.completedDays.includes(1)) grant("day-1");
  if (input.pullUpsLogged) grant("first-pullup");
  if (input.pushUpsToday >= 100) grant("hundred-pushups");
  if (input.bestFiveKMin !== null && input.bestFiveKMin <= 30) grant("sub30");
  if (input.heaviestLift >= 80) grant("eighty-club");
  if (input.streak >= 30) grant("streak-30");
  if (input.proteinStreak >= 7) grant("protein-7");
  if (input.sunlightCount >= 10) grant("sunrise");

  return next;
}
