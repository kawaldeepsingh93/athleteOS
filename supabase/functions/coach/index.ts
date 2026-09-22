// Supabase Edge Function mirror of /api/coach
// Deploy: supabase functions deploy coach

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  const { message } = await req.json();
  const key = Deno.env.get("OPENAI_API_KEY");
  if (!key) {
    return Response.json({
      reply:
        "I am online in local mode. Finish today's protein, water, and the next unfinished set. Tomorrow stays locked until you do.",
    });
  }
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are the AthleteOS coach. Supportive, disciplined, never guilty. Under 140 words.",
        },
        { role: "user", content: message },
      ],
    }),
  });
  const data = await res.json();
  return Response.json({
    reply: data.choices?.[0]?.message?.content ?? "Win today. Unlock tomorrow.",
  });
});
