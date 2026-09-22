"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useAthleteStore } from "@/lib/store";

export default function SettingsPage() {
  const router = useRouter();
  const { settings, updateSettings, reset, loadDemo, profile, targets, athleteId } = useAthleteStore();
  const [db, setDb] = useState<string>("checking…");
  const [sql, setSql] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    void fetch("/api/migrate")
      .then((r) => r.json())
      .then((d: { ready?: boolean; configured?: boolean; error?: string; sql?: string }) => {
        if (d.sql) setSql(d.sql);
        if (!d.configured) setDb("Supabase keys missing");
        else if (d.ready) setDb("Connected · tables ready");
        else setDb("No tables yet. Paste the SQL into the Supabase SQL editor.");
      })
      .catch(() => setDb("Unreachable"));
  }, []);

  function exportData() {
    const snapshot = useAthleteStore.getState();
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "athleteos-export.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-muted">Settings</div>
        <h1 className="display mt-1 text-4xl">Keep the system quiet.</h1>
      </div>

      <Card className="space-y-5">
        <CardTitle>Preferences</CardTitle>
        {[
          ["Dark mode", "Premium dark is the default operating surface.", settings.darkMode, (v: boolean) => updateSettings({ darkMode: v })],
          ["Notifications", "5:00 AM mission brief. 9:30 PM sleep wins tomorrow.", settings.notifications, (v: boolean) => updateSettings({ notifications: v })],
          ["Morning brief", "Your mission is waiting.", settings.morningBrief, (v: boolean) => updateSettings({ morningBrief: v })],
          ["Evening wind-down", "Sleep wins tomorrow's workout.", settings.eveningWindDown, (v: boolean) => updateSettings({ eveningWindDown: v })],
          ["Reduce motion", "Calmer animations.", settings.reduceMotion, (v: boolean) => updateSettings({ reduceMotion: v })],
        ].map(([label, body, checked, onChange]) => (
          <div key={String(label)} className="flex items-center justify-between gap-4">
            <div>
              <div className="font-medium">{label as string}</div>
              <div className="text-sm text-muted">{body as string}</div>
            </div>
            <Switch checked={checked as boolean} onCheckedChange={onChange as (v: boolean) => void} label={label as string} />
          </div>
        ))}
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Units</div>
            <div className="text-sm text-muted">Metric or imperial across the OS.</div>
          </div>
          <Button
            variant="secondary"
            onClick={() =>
              updateSettings({
                unitSystem: settings.unitSystem === "metric" ? "imperial" : "metric",
              })
            }
          >
            {settings.unitSystem}
          </Button>
        </div>
      </Card>

      <Card className="space-y-3">
        <CardTitle>Privacy & data</CardTitle>
        <p className="text-sm text-muted">
          Demo data lives in this browser. Production uses Clerk + Supabase with row-level security.
          Export anytime. No silent sharing.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={exportData}>
            Export JSON
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              loadDemo();
              router.push("/dashboard");
            }}
          >
            Load Day 27 demo
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              reset();
              router.push("/onboarding");
            }}
          >
            Reset athlete
          </Button>
        </div>
      </Card>

      <Card className="space-y-3">
        <CardTitle>Supabase</CardTitle>
        <p className="text-sm text-muted">
          {db} Athlete id {athleteId || "—"}.
        </p>
        <p className="text-sm text-muted">
          If Copy table SQL is offered, paste it in the SQL editor and Run. That adds profiles and weekly progress. Then use Preview Day 27 or onboarding — the profile and each week write to Supabase automatically.
        </p>
        <div className="flex flex-wrap gap-2">
          <a href="https://supabase.com/dashboard/project/dilpzlolaltuqjcgeyea/sql/new" target="_blank" rel="noreferrer">
            <Button variant="primary">Open SQL editor</Button>
          </a>
          <Button
            variant="secondary"
            onClick={async () => {
              await navigator.clipboard.writeText(sql);
              setCopied(true);
            }}
          >
            {copied ? "SQL copied" : "Copy table SQL"}
          </Button>
          <Button
            variant="secondary"
            onClick={async () => {
              const res = await fetch("/api/migrate", { method: "POST" });
              const data = (await res.json()) as { ok?: boolean; error?: string; method?: string };
              setDb(data.ok ? `Migrated · ${data.method}` : data.error ?? "Migration failed");
            }}
          >
            Retry from DATABASE_URL
          </Button>
        </div>
      </Card>

      <Card>
        <CardTitle>Profile</CardTitle>
        <div className="mt-3 text-sm text-muted">
          {profile?.name} · {profile?.age} · {targets?.dailyCalories} kcal · {targets?.proteinG}g protein
        </div>
      </Card>
    </div>
  );
}
