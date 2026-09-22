"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useAthleteStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function Celebration() {
  const celebration = useAthleteStore((s) => s.celebration);
  const dismiss = useAthleteStore((s) => s.dismissCelebration);
  const currentDay = useAthleteStore((s) => s.currentDay);

  return (
    <AnimatePresence>
      {celebration && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-6 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.88, y: 18, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="w-full max-w-md rounded-[32px] border border-white/10 bg-card p-8 text-center shadow-[0_0_80px_rgba(79,140,255,0.25)]"
          >
            <div className="text-[11px] uppercase tracking-[0.22em] text-accent">Mission complete</div>
            <h2 className="display mt-3 text-5xl">Day {celebration.day}</h2>
            <p className="mt-3 text-muted">
              Tomorrow is unlocked. Day {currentDay} is waiting. +{celebration.xp} XP.
            </p>
            <Button className="mt-7 w-full" size="lg" onClick={dismiss}>
              Enter Day {currentDay}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
