"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RingProgress } from "@/components/ui/ring-progress";
import { useAthleteStore } from "@/lib/store";

const features = [
  ["Daily Missions", "Tomorrow stays locked until today is won."],
  ["AI Coach", "Supportive. Disciplined. Never guilty."],
  ["Progressive Overload", "The work gets harder as you get better."],
  ["Indian Nutrition", "Egg, paneer, dal — logged in one tap."],
];

export default function LandingPage() {
  const loadDemo = useAthleteStore((s) => s.loadDemo);
  const onboarded = useAthleteStore((s) => s.onboarded);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="noise pointer-events-none absolute inset-0 opacity-60" />
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <Flame className="size-5 text-accent" />
          <span className="display text-lg">AthleteOS</span>
        </div>
        <div className="flex items-center gap-3">
          {onboarded ? (
            <Link href="/dashboard">
              <Button>Continue mission</Button>
            </Link>
          ) : (
            <>
              <Link href="/onboarding">
                <Button variant="secondary">Begin</Button>
              </Link>
              <Link href="/dashboard" onClick={loadDemo}>
                <Button>Preview Day 27</Button>
              </Link>
            </>
          )}
        </div>
      </header>

      <section className="mx-auto grid min-h-[80vh] w-full max-w-6xl items-center gap-12 px-6 py-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/4 px-3 py-1 text-xs text-muted">
            <Sparkles className="size-3 text-accent" />
            365-Day Athlete Operating System
          </div>
          <h1 className="display mt-6 text-6xl leading-[0.92] sm:text-7xl lg:text-8xl">
            Win today.
            <br />
            <span className="text-accent">Unlock</span> tomorrow.
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted">
            Not another tracker. A mission system that turns ordinary people athletic —
            one locked day at a time.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/onboarding">
              <Button size="lg">
                Enter the system <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/dashboard" onClick={loadDemo}>
              <Button size="lg" variant="secondary">
                Live Day 27
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 140, damping: 18 }}
          className="glass rounded-[36px] p-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted">Today&apos;s mission</div>
              <div className="display mt-2 text-3xl">Become Hard to Kill</div>
            </div>
            <Lock className="size-5 text-muted" />
          </div>
          <div className="mt-8 flex justify-center">
            <RingProgress value={74} label="27" sublabel="of 365" size={200} />
          </div>
          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            {[
              ["12", "Streak"],
              ["4,280", "XP"],
              ["Gold", "Rank"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl bg-white/4 py-4">
                <div className="display text-2xl tabular">{value}</div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-4 px-6 pb-24 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(([title, body], i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            className="rounded-3xl border border-white/6 bg-card p-5"
          >
            <div className="display text-xl">{title}</div>
            <p className="mt-2 text-sm text-muted">{body}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
