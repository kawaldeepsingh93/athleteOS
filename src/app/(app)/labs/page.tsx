"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/input";
import { LAB_DEFS, markerFromInput } from "@/lib/data/labs";
import { protocolFromLabs } from "@/lib/engines/protocol";
import { postJson } from "@/lib/runtime";
import { useAthleteStore } from "@/lib/store";
import { uid } from "@/lib/utils";
import type { BloodMarker } from "@/lib/types";

export default function LabsPage() {
  const { bloodReports, addBloodReport, applyProtocol, profile, protocol } = useAthleteStore();
  const [labName, setLabName] = useState("Health checkup");
  const [values, setValues] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const latest = bloodReports.at(-1);

  const preview = useMemo(
    () =>
      LAB_DEFS.map((def) => {
        const raw = values[def.id];
        if (!raw) return null;
        return markerFromInput(def.id, Number(raw));
      }).filter((m): m is BloodMarker => Boolean(m)),
    [values],
  );

  async function save() {
    if (preview.length === 0 || pending) return;
    const report = {
      id: uid("lab"),
      date: new Date().toISOString().slice(0, 10),
      labName,
      markers: preview,
    };
    addBloodReport(report);
    setPending(true);
    try {
      const data = await postJson<{ protocol?: typeof protocol }>("/api/protocol", {
        reports: [...bloodReports, report],
        profile,
      });
      applyProtocol(data?.protocol ?? protocolFromLabs([...bloodReports, report], profile));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-muted">Blood reports</div>
        <h1 className="display mt-1 text-3xl sm:text-4xl">Let the blood speak. Then train.</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          These are not diagnoses. When a report is in, AI (or the local lab engine) updates calories, protein, intensity, and supplements. Without a report, the normal program stays on.
        </p>
      </div>

      {protocol && (
        <Card className={protocol.source === "default" ? "" : "border-accent/25"}>
          <div className="text-xs uppercase tracking-[0.16em] text-muted">Active protocol · {protocol.source}</div>
          <p className="mt-2 text-sm leading-6">{protocol.summary}</p>
          <p className="mt-2 text-sm text-muted">{protocol.dietNotes}</p>
          <p className="mt-1 text-sm text-muted">{protocol.trainingNotes}</p>
        </Card>
      )}

      <Card className="space-y-4">
        <CardTitle>Log a panel</CardTitle>
        <Field label="Lab / clinic">
          <Input value={labName} onChange={(e) => setLabName(e.target.value)} />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LAB_DEFS.map((def) => (
            <Field key={def.id} label={`${def.name} (${def.unit})`}>
              <Input
                type="number"
                step="0.1"
                placeholder={`${def.refLow}–${def.refHigh}`}
                value={values[def.id] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [def.id]: e.target.value }))}
              />
            </Field>
          ))}
        </div>
        <Button onClick={save} disabled={preview.length === 0 || pending}>
          {pending ? "Updating protocol…" : "Save report and update plan"}
        </Button>
      </Card>

      {latest && (
        <Card>
          <CardTitle className="mb-4">Latest · {latest.date}</CardTitle>
          <div className="grid gap-2 sm:grid-cols-2">
            {latest.markers.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-2xl bg-white/3 px-4 py-3">
                <div>
                  <div className="font-medium">{m.name}</div>
                  <div className="text-xs text-muted">
                    {m.refLow}–{m.refHigh} {m.unit}
                  </div>
                </div>
                <Badge tone={m.flag === "ok" ? "success" : m.flag === "low" ? "warning" : "danger"}>
                  {m.value} {m.flag}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
