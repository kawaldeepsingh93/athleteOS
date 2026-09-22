import { round } from "@/lib/utils";
import type { UnitSystem } from "@/lib/types";

export function cmToFtIn(cm: number) {
  const totalIn = cm / 2.54;
  const ft = Math.floor(totalIn / 12);
  const inches = round(totalIn - ft * 12, 1);
  return { ft, inches };
}

export function kgToLb(kg: number) {
  return round(kg * 2.20462, 1);
}

export function lbToKg(lb: number) {
  return round(lb / 2.20462, 1);
}

export function formatWeight(kg: number, units: UnitSystem) {
  return units === "imperial" ? `${kgToLb(kg)} lb` : `${round(kg, 1)} kg`;
}

export function formatHeight(cm: number, units: UnitSystem) {
  if (units === "imperial") {
    const { ft, inches } = cmToFtIn(cm);
    return `${ft}'${inches}"`;
  }
  return `${Math.round(cm)} cm`;
}

export function formatDistance(km: number, units: UnitSystem) {
  return units === "imperial" ? `${round(km * 0.621371, 2)} mi` : `${round(km, 2)} km`;
}
