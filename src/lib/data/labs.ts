import type { BloodMarker, LabFlag } from "@/lib/types";

export const LAB_DEFS = [
  { id: "hb", name: "Hemoglobin", unit: "g/dL", refLow: 13, refHigh: 17, typical: 14.2 },
  { id: "ferritin", name: "Ferritin", unit: "ng/mL", refLow: 30, refHigh: 300, typical: 55 },
  { id: "vitd", name: "Vitamin D (25-OH)", unit: "ng/mL", refLow: 30, refHigh: 80, typical: 22 },
  { id: "b12", name: "Vitamin B12", unit: "pg/mL", refLow: 300, refHigh: 900, typical: 280 },
  { id: "tsh", name: "TSH", unit: "mIU/L", refLow: 0.4, refHigh: 4.0, typical: 2.1 },
  { id: "glucose", name: "Fasting glucose", unit: "mg/dL", refLow: 70, refHigh: 99, typical: 92 },
  { id: "hba1c", name: "HbA1c", unit: "%", refLow: 4.0, refHigh: 5.6, typical: 5.3 },
  { id: "ldl", name: "LDL", unit: "mg/dL", refLow: 0, refHigh: 100, typical: 118 },
  { id: "hdl", name: "HDL", unit: "mg/dL", refLow: 40, refHigh: 80, typical: 46 },
  { id: "trig", name: "Triglycerides", unit: "mg/dL", refLow: 0, refHigh: 150, typical: 132 },
  { id: "alt", name: "ALT", unit: "U/L", refLow: 7, refHigh: 56, typical: 28 },
  { id: "creat", name: "Creatinine", unit: "mg/dL", refLow: 0.7, refHigh: 1.3, typical: 0.9 },
] as const;

export function flagFor(value: number, refLow: number, refHigh: number): LabFlag {
  if (value < refLow) return "low";
  if (value > refHigh) return "high";
  return "ok";
}

export function markerFromInput(id: string, value: number): BloodMarker | null {
  const def = LAB_DEFS.find((d) => d.id === id);
  if (!def) return null;
  return {
    id: def.id,
    name: def.name,
    value,
    unit: def.unit,
    refLow: def.refLow,
    refHigh: def.refHigh,
    flag: flagFor(value, def.refLow, def.refHigh),
  };
}
