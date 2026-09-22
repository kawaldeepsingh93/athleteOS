import type { AthleteState } from "@/lib/types";
import { FOODS } from "@/lib/data/foods";
import { selectToday } from "@/lib/selectors";

export function coachSystemPrompt(state: AthleteState) {
  const today = selectToday(state);
  const name = state.profile?.name.split(" ")[0] ?? "Athlete";
  return `You are the AthleteOS coach. Tone: supportive, disciplined, never guilty.
Philosophy: "Win Today. Unlock Tomorrow."
Athlete: ${name}, Day ${state.currentDay}/365, streak ${state.streak}, XP ${state.xp}.
Targets: ${state.targets?.dailyCalories ?? "—"} kcal, ${state.targets?.proteinG ?? "—"}g protein, ${state.targets?.waterL ?? 3.5}L water.
Today protein ${Math.round(today.protein)}g, water ${today.water}L, workout ${today.workout?.title ?? "unset"}.
Diet: ${state.profile?.dietType ?? "eggetarian"}. Equipment: ${state.profile?.equipment ?? "bodyweight"}.
Rules:
- Never shame missed sleep, travel, or food out.
- Adjust the day; do not throw away the streak for one imperfect session.
- Prefer Indian foods when suggesting protein.
- If injured or very fatigued, swap intensity for mobility and Zone 2.
- Keep replies under 140 words. End with one clear action.`;
}

export function localCoachReply(message: string, state: AthleteState) {
  const text = message.toLowerCase();
  const today = selectToday(state);
  const proteinLeft = Math.max(0, (state.targets?.proteinG ?? 140) - today.protein);
  const name = state.profile?.name.split(" ")[0] ?? "Athlete";

  if (/(sleep|tired|fatigue|exhausted|5 hours|insomnia)/.test(text)) {
    return `${name}, low sleep is a recovery problem, not a character problem. Keep Zone 2 if you want the streak, cut the last strength set, and lock tonight's wind-down. Tomorrow's intensity comes back when sleep does. Action: 20 easy minutes + lights down at ${state.profile?.sleepTime ?? "22:00"}.`;
  }
  if (/(outside|restaurant|ate out|cheat|pizza|birthday)/.test(text)) {
    return `Eating outside does not reset Day ${state.currentDay}. Estimate the plate, log it, and spend the rest of the day on protein and water. You still have ~${Math.round(proteinLeft)}g protein to earn. Action: dal + paneer or a shake before bed.`;
  }
  if (/(protein|hungry|macros)/.test(text)) {
    const picks = FOODS.filter((f) => f.protein >= 8).slice(0, 3);
    return `Protein left: ${Math.round(proteinLeft)}g. Fastest honest path: ${picks.map((f) => `${f.name} (${f.protein}g/${f.serving})`).join(", ")}. Do not chase perfection — chase the number. Action: log one serving in the next 10 minutes.`;
  }
  if (/(travel|hotel|airport|suitcase)/.test(text)) {
    return `Travel day protocol: hallway Zone 2, push-ups, split squats, backpack rows, and a protein-first plate. The mission shrinks; it does not disappear. Action: 25-minute hotel session and 3.5L water.`;
  }
  if (/(injur|knee|shoulder|pain|hurt)/.test(text)) {
    return `Pain is information. Remove the offending pattern, keep blood flowing with mobility and easy aerobic, and do not test the joint for a PR. Action: swap today's heavy pattern for the mobility flow and message me what hurts.`;
  }
  if (/(missed|skipped|didn't train|didnt train|failed)/.test(text)) {
    return `You missed a session. You did not miss the year. Day ${state.currentDay} is still unlockable. Shorten the workout, keep protein and sleep. No punishment sets. Action: start the first exercise in the next five minutes.`;
  }
  if (/(adjust|easier|harder|workout)/.test(text)) {
    return `Today stays ${today.workout?.title ?? "your programmed session"}. If energy is 6/10 or better, run it as written. If lower, drop one set everywhere and keep the run easy. Progressive overload can wait 24 hours. Action: complete the first two movements.`;
  }
  return `I hear you. The system does not need a perfect story — it needs today's boxes closed. Protein ${Math.round(today.protein)}/${state.targets?.proteinG ?? 140}g, water ${today.water}/3.5L. Finish the mission in front of you. Action: pick one unfinished task and start it now.`;
}
