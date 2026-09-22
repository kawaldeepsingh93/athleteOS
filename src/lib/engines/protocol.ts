import type { BloodReport, Protocol, Profile, Targets } from "@/lib/types";

export function emptyProtocol(): Protocol {
  return {
    source: "default",
    summary: "No labs yet. Running the standard athlete program.",
    calorieDelta: 0,
    proteinDelta: 0,
    intensity: 1,
    preferZone2: false,
    dietNotes: "Hit protein with Indian staples. Keep the deficit honest, not heroic.",
    trainingNotes: "Run the programmed session as written.",
    supplementIds: ["vit-d3", "omega3", "mag", "creatine"],
    createdAt: new Date().toISOString(),
  };
}

export function protocolFromLabs(reports: BloodReport[], profile: Profile | null): Protocol {
  const latest = reports.at(-1);
  if (!latest || latest.markers.length === 0) return emptyProtocol();

  const get = (id: string) => latest.markers.find((m) => m.id === id);
  const vitd = get("vitd");
  const b12 = get("b12");
  const ferritin = get("ferritin");
  const hb = get("hb");
  const glucose = get("glucose");
  const hba1c = get("hba1c");
  const ldl = get("ldl");
  const tsh = get("tsh");

  let calorieDelta = 0;
  let proteinDelta = 0;
  let intensity = 1;
  let preferZone2 = false;
  const supplementIds = new Set(["vit-d3", "omega3", "mag", "creatine"]);
  const notes: string[] = [];
  const training: string[] = [];

  if (vitd && vitd.flag === "low") {
    supplementIds.add("vit-d3");
    notes.push("Vitamin D is low — morning sunlight + D3 with a fat-containing meal.");
  }
  if (b12 && b12.flag === "low") {
    supplementIds.add("b12");
    notes.push("B12 is low — eggs, dahi, milk, or a B12 tablet. Vegans: tablet is non-negotiable.");
  }
  if ((ferritin && ferritin.flag === "low") || (hb && hb.flag === "low")) {
    intensity = 0.75;
    preferZone2 = true;
    supplementIds.add("iron");
    supplementIds.add("vit-c");
    notes.push("Iron stores look low — rajma, chana, greens + vitamin C. Tea away from meals.");
    training.push("No intervals until ferritin recovers. Zone 2 and technique work only.");
  }
  if ((glucose && glucose.flag === "high") || (hba1c && hba1c.flag === "high")) {
    preferZone2 = true;
    calorieDelta -= 100;
    notes.push("Glucose is elevated — fewer refined carbs, more dal/protein, walk after meals.");
    training.push("Prefer Zone 2 over hard intervals this block.");
  }
  if (ldl && ldl.flag === "high") {
    notes.push("LDL is high — keep paneer portions honest, add fiber (chana, oats), keep Omega-3.");
  }
  if (tsh && tsh.flag === "high") {
    calorieDelta += 100;
    notes.push("TSH is high — do not crash calories. Sleep and consistency first.");
  }
  if (profile?.dietType === "vegan") supplementIds.add("b12");

  proteinDelta = intensity < 0.85 ? 10 : 0;

  return {
    source: "labs",
    summary: notes[0] ?? "Labs are in range. Stay on the standard program.",
    calorieDelta,
    proteinDelta,
    intensity,
    preferZone2,
    dietNotes: notes.join(" ") || "Standard Indian-first plate. Protein first.",
    trainingNotes: training.join(" ") || "Run the programmed session as written.",
    supplementIds: [...supplementIds],
    createdAt: new Date().toISOString(),
  };
}

export function applyProtocolToTargets(targets: Targets, protocol: Protocol | null): Targets {
  if (!protocol || protocol.source === "default") return targets;
  const dailyCalories = Math.max(1500, targets.dailyCalories + protocol.calorieDelta);
  const proteinG = Math.max(80, targets.proteinG + protocol.proteinDelta);
  const fatG = Math.round((dailyCalories * 0.28) / 9);
  const carbsG = Math.round((dailyCalories - proteinG * 4 - fatG * 9) / 4);
  return { ...targets, dailyCalories, proteinG, fatG, carbsG };
}
