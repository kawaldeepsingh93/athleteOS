"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAthleteStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const chips = [
  "I slept only 5 hours.",
  "Adjust today's workout.",
  "I ate outside.",
  "Help me hit protein.",
];

export default function CoachPage() {
  const { coachMessages, sendCoach } = useAthleteStore();
  const [value, setValue] = useState("");
  const [pending, setPending] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  async function submit(text: string) {
    const message = text.trim();
    if (!message || pending) return;
    sendCoach("user", message);
    setValue("");
    setPending(true);
    try {
      const snapshot = useAthleteStore.getState();
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          athlete: {
            name: snapshot.profile?.name,
            day: snapshot.currentDay,
            streak: snapshot.streak,
            xp: snapshot.xp,
            diet: snapshot.profile?.dietType,
            equipment: snapshot.profile?.equipment,
            protein: snapshot.targets?.proteinG,
            sleepTime: snapshot.profile?.sleepTime,
            protocol: snapshot.protocol,
            labs: snapshot.bloodReports.at(-1)?.markers ?? [],
          },
        }),
      });
      const data = (await res.json()) as { reply?: string };
      sendCoach("coach", data.reply ?? "Stay with the mission in front of you.");
    } catch {
      sendCoach("coach", "I am offline, but the mission is not. Finish protein and the next set.");
    } finally {
      setPending(false);
      scroller.current?.scrollTo({ top: 99999, behavior: "smooth" });
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col">
      <div className="mb-4">
        <div className="text-xs uppercase tracking-[0.2em] text-muted">AI Coach</div>
        <h1 className="display mt-1 text-4xl">Supportive. Disciplined.</h1>
      </div>
      <Card className="flex flex-1 flex-col">
        <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto pr-1">
          {coachMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-6",
                msg.role === "coach"
                  ? "bg-white/5"
                  : "ml-auto bg-accent text-white",
              )}
            >
              {msg.content}
            </motion.div>
          ))}
          {pending && <div className="text-sm text-muted">Coach is thinking…</div>}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <Button key={chip} size="sm" variant="secondary" onClick={() => submit(chip)}>
              {chip}
            </Button>
          ))}
        </div>
        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            submit(value);
          }}
        >
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Tell the coach what happened today."
            aria-label="Message the coach"
          />
          <Button type="submit" disabled={pending}>
            Send
          </Button>
        </form>
      </Card>
    </div>
  );
}
