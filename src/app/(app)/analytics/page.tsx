"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { chartTheme } from "@/components/charts/theme";
import { selectToday, useAthleteStore } from "@/lib/store";

export default function AnalyticsPage() {
  const state = useAthleteStore();
  const today = useMemo(() => selectToday(state), [state]);
  const weight = state.measurements.map((m) => ({ date: m.date.slice(5), weight: m.weightKg }));
  const pace = state.runs.map((r) => ({ date: r.date.slice(5), pace: r.paceMinPerKm }));
  const protein = state.completedDays.slice(-14).map((day) => ({
    day: `D${day}`,
    hit: 1,
  }));
  const sleep = state.sleep.slice(-14).map((s) => ({
    date: s.date.slice(5),
    hours: s.hours,
    recovery: s.recoveryScore,
  }));
  const calendar = Array.from({ length: 35 }, (_, i) => {
    const day = state.currentDay - 34 + i;
    return {
      day,
      done: day > 0 && state.completedDays.includes(day),
      today: day === state.currentDay,
    };
  });

  return (
    <div className="space-y-5">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-muted">Analytics</div>
        <h1 className="display mt-1 text-4xl">See the compound interest.</h1>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weight trend</CardTitle>
          </CardHeader>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weight}>
                <CartesianGrid stroke={chartTheme.grid} vertical={false} />
                <XAxis dataKey="date" stroke={chartTheme.axis} fontSize={12} />
                <Tooltip contentStyle={chartTheme.tooltip} />
                <Area dataKey="weight" stroke={chartTheme.accent} fill={chartTheme.accent} fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Running pace</CardTitle>
          </CardHeader>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={pace}>
                <XAxis dataKey="date" stroke={chartTheme.axis} fontSize={12} />
                <YAxis reversed stroke={chartTheme.axis} fontSize={12} />
                <Tooltip contentStyle={chartTheme.tooltip} />
                <Area dataKey="pace" stroke={chartTheme.success} fill={chartTheme.success} fillOpacity={0.12} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Protein consistency</CardTitle>
          </CardHeader>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={protein}>
                <XAxis dataKey="day" stroke={chartTheme.axis} fontSize={12} />
                <Tooltip contentStyle={chartTheme.tooltip} />
                <Bar dataKey="hit" fill={chartTheme.success} radius={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sleep correlation</CardTitle>
          </CardHeader>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sleep}>
                <XAxis dataKey="date" stroke={chartTheme.axis} fontSize={12} />
                <Tooltip contentStyle={chartTheme.tooltip} />
                <Area dataKey="hours" stroke={chartTheme.warning} fill={chartTheme.warning} fillOpacity={0.12} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Streak calendar</CardTitle>
            <div className="text-sm text-muted">
              Today protein {Math.round(today.protein)}g · {state.streak} day streak
            </div>
          </CardHeader>
          <div className="grid grid-cols-7 gap-2">
            {calendar.map((cell, i) => (
              <div
                key={`${cell.day}-${i}`}
                title={cell.day > 0 ? `Day ${cell.day}` : ""}
                className={`aspect-square rounded-xl ${
                  cell.day < 1
                    ? "bg-transparent"
                    : cell.today
                      ? "bg-accent"
                      : cell.done
                        ? "bg-success/70"
                        : "bg-white/6"
                }`}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
