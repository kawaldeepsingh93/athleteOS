import type { Mission, MissionTask } from "@/lib/types";

const TITLES = [
  "Become Hard to Kill",
  "Earn the Morning",
  "Quiet the Noise",
  "Build the Engine",
  "Armor the Joints",
  "Win the Unseen Hour",
  "Leave No Reps Behind",
  "Make Discipline Cheap",
  "Outlast Yesterday",
  "Stay Unnegotiable",
  "Train Like Weather",
  "Collect the Miles",
  "Eat Like an Athlete",
  "Sleep Like a Weapon",
  "Posture Is Presence",
  "The Standard Is the Standard",
];

const BRIEFS = [
  "Today is not a workout. It is a vote for the athlete you are becoming.",
  "Do the boring things with pride. Protein. Water. The last set.",
  "You do not need more motivation. You need the next locked door opened.",
  "Move, fuel, recover. In that order. No drama.",
  "Tomorrow stays dark until you finish the light in front of you.",
];

function tasksForDay(day: number): MissionTask[] {
  const wd = (day - 1) % 7;
  return [
    {
      id: `${day}-run`,
      label: wd === 2 ? "Complete tempo run" : wd === 4 ? "Complete intervals" : wd === 5 ? "Complete long run" : "Complete aerobic session",
      category: "run",
      completed: false,
    },
    {
      id: `${day}-str`,
      label: wd === 6 ? "Complete mobility flow" : "Complete strength block",
      category: "strength",
      completed: false,
    },
    {
      id: `${day}-pro`,
      label: "Hit protein target",
      category: "protein",
      completed: false,
    },
    {
      id: `${day}-h2o`,
      label: "Drink 3.5L water",
      category: "water",
      completed: false,
    },
    {
      id: `${day}-mob`,
      label: "10 minutes mobility or posture work",
      category: "mobility",
      completed: false,
    },
    {
      id: `${day}-slp`,
      label: "Protect 7.5+ hours of sleep",
      category: "sleep",
      completed: false,
    },
  ];
}

export function generateMission(day: number, unlocked: boolean): Mission {
  return {
    day,
    title: TITLES[(day - 1) % TITLES.length],
    brief: BRIEFS[(day - 1) % BRIEFS.length],
    unlocked,
    completed: false,
    tasks: tasksForDay(day),
  };
}

export function generateYear(currentDay: number): Mission[] {
  return Array.from({ length: 365 }, (_, i) => {
    const day = i + 1;
    return generateMission(day, day <= currentDay);
  });
}

export function missionProgress(mission: Mission) {
  if (mission.tasks.length === 0) return 0;
  return mission.tasks.filter((t) => t.completed).length / mission.tasks.length;
}

export function isMissionComplete(mission: Mission) {
  return mission.tasks.every((t) => t.completed);
}
