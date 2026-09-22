import { weekdayIndex } from "@/lib/utils";
import type { Equipment, Exercise, ExerciseCategory, Protocol, Workout } from "@/lib/types";

function weekOf(day: number) {
  return Math.ceil(day / 7);
}

function cycle(week: number) {
  return ((week - 1) % 4) + 1;
}

function load(equipment: Equipment, dumbbell: number, gym: number) {
  if (equipment === "gym") return gym;
  if (equipment === "dumbbells") return dumbbell;
  return undefined;
}

function exercise(
  id: string,
  name: string,
  category: ExerciseCategory,
  sets: number,
  reps: number,
  extras: Partial<Exercise> = {},
): Exercise {
  return { id, name, category, sets, reps, completed: false, ...extras };
}

export function generateWorkout(
  day: number,
  date: string,
  equipment: Equipment,
  protocol?: Protocol | null,
): Workout {
  const week = weekOf(day);
  const phase = cycle(week);
  const wd = weekdayIndex(day);
  const bump = phase === 1 ? 0 : phase === 2 ? 2 : phase === 3 ? 5 : 2;

  const pushName =
    phase === 4
      ? equipment === "bodyweight"
        ? "Decline Push-ups"
        : "Incline Dumbbell Press"
      : equipment === "bodyweight"
        ? "Push-ups"
        : "Dumbbell Bench Press";

  const pullName =
    phase === 4
      ? equipment === "gym"
        ? "Weighted Pull-ups"
        : "Inverted Rows (feet elevated)"
      : equipment === "gym"
        ? "Pull-ups"
        : "Inverted Rows";

  const squatName =
    equipment === "gym"
      ? phase === 4
        ? "Front Squat"
        : "Back Squat"
      : equipment === "dumbbells"
        ? "Goblet Squat"
        : phase === 4
          ? "Bulgarian Split Squat"
          : "Bodyweight Squat";

  const templates: Record<
    number,
    { title: string; focus: ExerciseCategory[]; items: Exercise[] }
  > = {
    0: {
      title: "Push + Zone 2 Engine",
      focus: ["push", "run"],
      items: [
        exercise(`${day}-run`, "Zone 2 Run", "run", 1, 1, {
          durationSec: 30 * 60,
          notes: "Conversational pace. Nasal if you can.",
        }),
        exercise(`${day}-push`, pushName, "push", 4, 10 + bump, {
          weightKg: load(equipment, 16, 40),
        }),
        exercise(`${day}-ohp`, equipment === "bodyweight" ? "Pike Push-ups" : "Overhead Press", "push", 3, 8 + bump, {
          weightKg: load(equipment, 12, 24),
        }),
        exercise(`${day}-core`, "Hollow Body Hold", "core", 3, 1, {
          durationSec: 30 + phase * 5,
        }),
      ],
    },
    1: {
      title: "Pull + Mobility Armor",
      focus: ["pull", "mobility"],
      items: [
        exercise(`${day}-pull`, pullName, "pull", 4, Math.max(5, 6 + Math.floor(bump / 2))),
        exercise(`${day}-row`, equipment === "bodyweight" ? "Backpack Rows" : "One-Arm Dumbbell Row", "pull", 3, 10 + bump, {
          weightKg: load(equipment, 16, 28),
        }),
        exercise(`${day}-face`, "Face Pulls / Band Pull-Aparts", "pull", 3, 15),
        exercise(`${day}-mob`, "Hip 90/90 + Thoracic Openers", "mobility", 3, 8, {
          durationSec: 8 * 60,
        }),
      ],
    },
    2: {
      title: "Legs + Tempo",
      focus: ["legs", "run"],
      items: [
        exercise(`${day}-tempo`, "Tempo Run", "run", 1, 1, {
          durationSec: 25 * 60,
          notes: "Comfortably hard. Last 8 minutes at 7/10.",
        }),
        exercise(`${day}-squat`, squatName, "legs", 4, 8 + bump, {
          weightKg: load(equipment, 20, 60),
        }),
        exercise(`${day}-hinge`, equipment === "bodyweight" ? "Single-Leg RDL (slow)" : "Romanian Deadlift", "legs", 3, 8 + bump, {
          weightKg: load(equipment, 16, 70),
        }),
        exercise(`${day}-calf`, "Calf Raises", "legs", 3, 15),
      ],
    },
    3: {
      title: "Push Density + Core",
      focus: ["push", "core"],
      items: [
        exercise(`${day}-push2`, pushName, "push", 5, 8 + bump, {
          weightKg: load(equipment, 16, 42),
        }),
        exercise(`${day}-dip`, equipment === "gym" ? "Dips" : "Bench Dips", "push", 3, 8 + bump),
        exercise(`${day}-lunge`, "Walking Lunges", "legs", 3, 12, {
          weightKg: load(equipment, 10, 20),
        }),
        exercise(`${day}-core2`, "Dead Bug + Side Plank", "core", 3, 10, {
          durationSec: 40,
        }),
      ],
    },
    4: {
      title: "Pull Power + Intervals",
      focus: ["pull", "run"],
      items: [
        exercise(`${day}-int`, "Interval Run", "run", 8, 1, {
          durationSec: 60,
          notes: "8 x 60s hard / 90s walk.",
        }),
        exercise(`${day}-pull2`, pullName, "pull", 5, Math.max(4, 5 + Math.floor(bump / 2))),
        exercise(`${day}-curl`, equipment === "bodyweight" ? "Towel Curls" : "Hammer Curls", "pull", 3, 10, {
          weightKg: load(equipment, 10, 14),
        }),
        exercise(`${day}-posture`, "Y-T-W Raises", "mobility", 3, 10),
      ],
    },
    5: {
      title: "Full Body + Long Run",
      focus: ["full", "run"],
      items: [
        exercise(`${day}-long`, "Long Run", "run", 1, 1, {
          durationSec: (50 + phase * 5) * 60,
          notes: "Easy. Finish able to smile.",
        }),
        exercise(`${day}-fb1`, pushName, "push", 3, 10),
        exercise(`${day}-fb2`, squatName, "legs", 3, 10),
        exercise(`${day}-fb3`, pullName, "pull", 3, 6),
      ],
    },
    6: {
      title: "Recovery Mobility + Easy Aerobic",
      focus: ["mobility", "run"],
      items: [
        exercise(`${day}-easy`, "Easy Zone 2 Jog / Walk-Run", "run", 1, 1, {
          durationSec: 25 * 60,
        }),
        exercise(`${day}-flow`, "Athlete Mobility Flow", "mobility", 1, 1, {
          durationSec: 20 * 60,
          notes: "Hips, ankles, T-spine, shoulders.",
        }),
        exercise(`${day}-breath`, "Nasal Breathing + Dead Hang", "mobility", 4, 1, {
          durationSec: 45,
        }),
      ],
    },
  };

  const selected = templates[wd];
  return applyProtocolToWorkout(
    {
      id: `w_${day}`,
      date,
      day,
      title: selected.title,
      focus: selected.focus,
      exercises: selected.items,
    },
    protocol,
  );
}

export function applyProtocolToWorkout(workout: Workout, protocol?: Protocol | null): Workout {
  if (!protocol || protocol.source === "default") return workout;
  return {
    ...workout,
    title: protocol.preferZone2
      ? workout.title.replace(/Interval.*/, "Easy Zone 2").replace(/Tempo/, "Easy aerobic")
      : workout.title,
    exercises: workout.exercises.map((exercise) => {
      const runSwap =
        protocol.preferZone2 &&
        exercise.category === "run" &&
        /interval|tempo/i.test(exercise.name);
      return {
        ...exercise,
        name: runSwap ? "Easy Zone 2" : exercise.name,
        sets: Math.max(2, Math.round(exercise.sets * protocol.intensity)),
        notes: [exercise.notes, protocol.trainingNotes].filter(Boolean).join(" "),
      };
    }),
  };
}

export function workoutComplete(workout: Workout) {
  return workout.exercises.every((e) => e.completed);
}

export function workoutProgress(workout: Workout) {
  if (workout.exercises.length === 0) return 0;
  return workout.exercises.filter((e) => e.completed).length / workout.exercises.length;
}
