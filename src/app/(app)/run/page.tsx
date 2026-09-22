"use client";

import { useMemo, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { chartTheme } from "@/components/charts/theme";
import { formatPace, personalBest, paceTrend, RUN_MODES } from "@/lib/engines/running";
import { useAthleteStore } from "@/lib/store";
import type { RunMode } from "@/lib/types";
import { formatDistance } from "@/lib/units";
import { cn } from "@/lib/utils";

export default function RunPage() {
  const { runs, logRun, settings } = useAthleteStore();
  const [mode, setMode] = useState<RunMode>("zone2");
  const [distanceKm, setDistanceKm] = useState(5);
  const [durationMin, setDurationMin] = useState(28);
  const pb = personalBest(runs);
  const trend = useMemo(() => paceTrend(runs), [runs]);

  return (
    <div className="space-y-5">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-muted">Running module</div>
        <h1 className="display mt-1 text-4xl">Earn the miles.</h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Log a run</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-2 gap-2">
            {RUN_MODES.map((item) => (
              <button
                key={item.id}
                onClick={() => setMode(item.id)}
                className={cn(
                  "rounded-2xl border p-3 text-left",
                  mode === item.id ? "border-accent bg-accent/12" : "border-white/6",
                )}
              >
                <div className="font-medium">{item.label}</div>
                <div className="mt-1 text-xs text-muted">{item.blurb}</div>
              </button>
            ))}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Distance (km)">
              <Input type="number" step="0.1" value={distanceKm} onChange={(e) => setDistanceKm(Number(e.target.value))} />
            </Field>
            <Field label="Time (min)">
              <Input type="number" step="0.1" value={durationMin} onChange={(e) => setDurationMin(Number(e.target.value))} />
            </Field>
          </div>
          <div className="mt-3 text-sm text-muted">
            Pace {formatPace(distanceKm ? durationMin / distanceKm : 0)} /km
          </div>
          <Button className="mt-4 w-full" onClick={() => logRun({ mode, distanceKm, durationMin })}>
            Save run
          </Button>
        </Card>

        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Pace trend</CardTitle>
            {pb && (
              <Badge tone="success">
                5K PB {formatPace(pb.paceMinPerKm)} · {pb.durationMin}m
              </Badge>
            )}
          </CardHeader>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <XAxis dataKey="date" stroke={chartTheme.axis} fontSize={12} />
                <YAxis reversed stroke={chartTheme.axis} fontSize={12} domain={["auto", "auto"]} />
                <Tooltip contentStyle={chartTheme.tooltip} formatter={(v) => [`${v} min/km`, "Pace"]} />
                <Line type="monotone" dataKey="pace" stroke={chartTheme.success} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-12">
          <CardTitle className="mb-4">History</CardTitle>
          <div className="space-y-2">
            {runs.slice().reverse().map((run) => (
              <div key={run.id} className="flex items-center justify-between rounded-2xl bg-white/3 px-4 py-3">
                <div>
                  <div className="font-medium capitalize">{run.mode.replace("zone2", "Zone 2")}</div>
                  <div className="text-xs text-muted">{run.date}</div>
                </div>
                <div className="text-right text-sm tabular">
                  {formatDistance(run.distanceKm, settings.unitSystem)} · {run.durationMin}m
                  <div className="text-muted">{formatPace(run.paceMinPerKm)} /km</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
