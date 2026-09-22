import { NextResponse } from "next/server";
import OpenAI from "openai";
import { protocolFromLabs } from "@/lib/engines/protocol";
import type { BloodReport, Profile, Protocol } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    reports?: BloodReport[];
    profile?: Profile | null;
  };
  const reports = body.reports ?? [];
  const local = protocolFromLabs(reports, body.profile ?? null);

  if (!process.env.OPENAI_API_KEY || reports.length === 0) {
    return NextResponse.json({ protocol: local, provider: reports.length ? "labs" : "default" });
  }

  const latest = reports.at(-1);
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are AthleteOS medical-adjacent coach, not a doctor. Return JSON only: summary, calorieDelta, proteinDelta, intensity (0.6-1.1), preferZone2, dietNotes, trainingNotes, supplementIds (from vit-d3, omega3, mag, creatine, b12, iron, zinc, vit-c). Never diagnose. Prefer Indian food. If iron/ferritin/hb is low, lower intensity and prefer Zone 2.",
      },
      {
        role: "user",
        content: JSON.stringify({
          profile: body.profile,
          markers: latest?.markers ?? [],
          fallback: local,
        }),
      },
    ],
  });

  try {
    const parsed = JSON.parse(completion.choices[0]?.message?.content ?? "{}") as Partial<Protocol>;
    const protocol: Protocol = {
      source: "ai",
      summary: parsed.summary ?? local.summary,
      calorieDelta: Number(parsed.calorieDelta ?? local.calorieDelta),
      proteinDelta: Number(parsed.proteinDelta ?? local.proteinDelta),
      intensity: Number(parsed.intensity ?? local.intensity),
      preferZone2: Boolean(parsed.preferZone2 ?? local.preferZone2),
      dietNotes: parsed.dietNotes ?? local.dietNotes,
      trainingNotes: parsed.trainingNotes ?? local.trainingNotes,
      supplementIds: parsed.supplementIds ?? local.supplementIds,
      createdAt: new Date().toISOString(),
    };
    return NextResponse.json({ protocol, provider: "openai" });
  } catch {
    return NextResponse.json({ protocol: local, provider: "labs" });
  }
}
