"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Activity,
  Apple,
  Command,
  Dumbbell,
  FlaskConical,
  Flame,
  Home,
  LineChart,
  MessageCircle,
  Settings,
  Target,
  Trophy,
} from "lucide-react";
import { Celebration } from "@/components/mission/celebration";
import { useAthleteStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { levelFromXp, rankFromLevel } from "@/lib/engines/gamification";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: Home, shortcut: "D" },
  { href: "/mission", label: "Mission", icon: Target, shortcut: "M" },
  { href: "/workout", label: "Workout", icon: Dumbbell, shortcut: "W" },
  { href: "/run", label: "Run", icon: Activity, shortcut: "R" },
  { href: "/nutrition", label: "Nutrition", icon: Apple, shortcut: "N" },
  { href: "/labs", label: "Labs", icon: FlaskConical, shortcut: "L" },
  { href: "/progress", label: "Progress", icon: Trophy, shortcut: "P" },
  { href: "/coach", label: "Coach", icon: MessageCircle, shortcut: "C" },
  { href: "/analytics", label: "Analytics", icon: LineChart, shortcut: "A" },
  { href: "/settings", label: "Settings", icon: Settings, shortcut: "S" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { onboarded, hydrated, currentDay, xp, streak, profile, ensureToday } =
    useAthleteStore();

  useEffect(() => {
    if (hydrated && !onboarded) router.replace("/onboarding");
  }, [hydrated, onboarded, router]);

  useEffect(() => {
    if (onboarded) ensureToday();
  }, [onboarded, ensureToday]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || !event.shiftKey) return;
      const hit = NAV.find((item) => item.shortcut === event.key.toUpperCase());
      if (hit) {
        event.preventDefault();
        router.push(hit.href);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  const rank = rankFromLevel(levelFromXp(xp));

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-white/6 bg-bg/80 p-5 backdrop-blur-xl lg:flex lg:flex-col">
        <Link href="/dashboard" className="mb-8 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-accent/15 text-accent">
            <Flame className="size-5" />
          </span>
          <div>
            <div className="display text-lg leading-none">AthleteOS</div>
            <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted">
              Day {currentDay} · {rank}
            </div>
          </div>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm transition",
                  active
                    ? "bg-accent/12 text-ink"
                    : "text-muted hover:bg-white/4 hover:text-ink",
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon className="size-4" />
                  {item.label}
                </span>
                <span className="hidden text-[10px] text-muted/70 xl:inline">
                  ⌘⇧{item.shortcut}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="rounded-2xl border border-white/6 bg-white/3 p-4">
          <div className="text-xs uppercase tracking-[0.16em] text-muted">Operator</div>
          <div className="mt-2 truncate font-medium">{profile?.name ?? "Athlete"}</div>
          <div className="mt-1 text-sm text-muted">
            {streak} day streak · {xp.toLocaleString()} XP
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/6 bg-bg/70 px-4 py-3 backdrop-blur-xl lg:hidden">
          <div className="display">AthleteOS</div>
          <div className="text-xs text-muted">Day {currentDay}</div>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-6 pb-28 lg:px-8 lg:pb-10">
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-white/6 bg-bg/85 px-2 py-2 backdrop-blur-xl lg:hidden">
        {NAV.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-2xl py-2 text-[10px] uppercase tracking-wider",
                active ? "text-accent" : "text-muted",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="pointer-events-none fixed right-4 bottom-24 hidden items-center gap-2 rounded-full border border-white/8 bg-card/80 px-3 py-1.5 text-[11px] text-muted lg:flex">
        <Command className="size-3" />
        Shortcuts live
      </div>
      <Celebration />
    </div>
  );
}
