import { create } from 'zustand';

/**
 * Body metrics for the BMI screen. In-memory for now (resets on reload) — when the backend
 * profile lands (full-scope), hydrate/persist these alongside the user. Units: cm + kg.
 */
interface BodyState {
  heightCm: number;
  weightKg: number;
  setHeight: (cm: number) => void;
  setWeight: (kg: number) => void;
}

export const useBodyStore = create<BodyState>((set) => ({
  heightCm: 170,
  weightKg: 70,
  setHeight: (heightCm) => set({ heightCm }),
  setWeight: (weightKg) => set({ weightKg }),
}));

export interface BmiResult {
  bmi: number;
  category: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
}

export function computeBmi(heightCm: number, weightKg: number): BmiResult | null {
  if (heightCm <= 0 || weightKg <= 0) return null;
  const m = heightCm / 100;
  const bmi = Math.round((weightKg / (m * m)) * 10) / 10;
  const category = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
  return { bmi, category };
}
