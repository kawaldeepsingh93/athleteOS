import type { SupplementDef } from "@/lib/types";

export const SUPPLEMENTS: SupplementDef[] = [
  { id: "vit-d3", name: "Vitamin D3", dose: "2000 IU", timing: "Morning with fat", why: "Immunity, mood, bone. Raised if 25-OH is low." },
  { id: "omega3", name: "Omega-3", dose: "1–2 g EPA+DHA", timing: "With a meal", why: "Lipids, joints, recovery." },
  { id: "mag", name: "Magnesium glycinate", dose: "200–400 mg", timing: "Evening", why: "Sleep, cramps, nervous system." },
  { id: "creatine", name: "Creatine monohydrate", dose: "5 g", timing: "Any consistent time", why: "Strength density. Safe for athletic work." },
  { id: "b12", name: "Vitamin B12", dose: "500 mcg", timing: "Morning", why: "Energy and nerves. Raised if B12 is low or vegan." },
  { id: "iron", name: "Iron (only if low)", dose: "As prescribed", timing: "Away from tea/coffee", why: "Only when ferritin or hemoglobin is low." },
  { id: "zinc", name: "Zinc", dose: "15 mg", timing: "Dinner", why: "Immunity and recovery. Not stacked high long-term." },
  { id: "vit-c", name: "Vitamin C", dose: "500 mg", timing: "With iron-rich meals", why: "Helps plant iron absorption." },
];

export function supplementById(id: string) {
  return SUPPLEMENTS.find((s) => s.id === id);
}
