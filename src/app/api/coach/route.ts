import { NextResponse } from "next/server";
import OpenAI from "openai";
import { localCoachReply } from "@/lib/coach";
import { createBlankState } from "@/lib/data/demo";
import type { AthleteState } from "@/lib/types";

export const runtime = "edge";

type Payload = {
  message?: string;
  athlete?: {
    name?: string;
    day?: number;
    streak?: number;
    xp?: number;
    diet?: AthleteState["profile"] extends infer P
      ? P extends { dietType: infer D }
        ? D
        : never
      : never;
    equipment?: string;
    protein?: number;
    sleepTime?: string;
    protocol?: { summary?: string; dietNotes?: string; trainingNotes?: string };
    labs?: { name: string; value: number; flag: string }[];
  };
};

export async function POST(request: Request) {
  const body = (await request.json()) as Payload;
  const message = body.message?.trim();
  if (!message) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  const fallbackState = createBlankState();
  fallbackState.currentDay = body.athlete?.day ?? 1;
  fallbackState.streak = body.athlete?.streak ?? 0;
  fallbackState.xp = body.athlete?.xp ?? 0;
  fallbackState.targets = {
    maintenanceCalories: 2400,
    dailyCalories: 2000,
    proteinG: body.athlete?.protein ?? 140,
    carbsG: 200,
    fatG: 60,
    waterL: 3.5,
    sleepHours: 8,
  };
  fallbackState.profile = {
    name: body.athlete?.name ?? "Athlete",
    age: 28,
    heightCm: 175,
    weightKg: 78,
    bodyFat: 20,
    goalWeightKg: 72,
    goalBodyFat: 12,
    activityLevel: "moderate",
    equipment: (body.athlete?.equipment as "dumbbells") ?? "dumbbells",
    dietType: (body.athlete?.diet as "eggetarian") ?? "eggetarian",
    wakeTime: "05:30",
    sleepTime: body.athlete?.sleepTime ?? "22:00",
    unitSystem: "metric",
    startDate: new Date().toISOString().slice(0, 10),
  };

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      reply: localCoachReply(message, fallbackState),
      provider: "local",
    });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    temperature: 0.6,
    max_tokens: 220,
    messages: [
      {
        role: "system",
        content: `You are the AthleteOS coach. Supportive, disciplined, never guilty.
Philosophy: Win Today. Unlock Tomorrow.
Athlete: ${fallbackState.profile.name}, Day ${fallbackState.currentDay}, streak ${fallbackState.streak}.
Protocol: ${body.athlete?.protocol?.summary ?? "standard program"}.
Labs: ${JSON.stringify(body.athlete?.labs ?? [])}.
Prefer Indian foods. If labs exist, obey the protocol. If fatigued or injured, reduce intensity. Under 140 words. End with one action.`,
      },
      { role: "user", content: message },
    ],
  });

  return NextResponse.json({
    reply:
      completion.choices[0]?.message?.content ??
      localCoachReply(message, fallbackState),
    provider: "openai",
  });
}
