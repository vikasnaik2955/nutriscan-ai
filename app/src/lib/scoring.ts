import type { HealthBand, Nutrition } from '@/types/health';

export interface ScoreOutcome {
  score: number; // 0–10
  band: HealthBand;
  reasons: string[];
}

/**
 * Dev/preview health scorer. Mirrors the planned backend engine (BUILD #4, which is the
 * authoritative, config-driven version) so the app's Result/History screens are realistic
 * before the backend exists. Thresholds are per 100 g/ml, loosely following FSA front-of-pack
 * "traffic light" cut-offs. Heuristic only — not medical advice.
 */
export function scoreNutrition(n: Nutrition): ScoreOutcome {
  let score = 10;
  const reasons: string[] = [];

  const has = (v: number | null | undefined): v is number => typeof v === 'number' && !Number.isNaN(v);

  // --- Penalties ---
  if (has(n.sugars)) {
    if (n.sugars > 22.5) { score -= 3; reasons.push(`High sugar — ${round(n.sugars)} g per 100 g`); }
    else if (n.sugars > 5) { score -= 1; reasons.push(`Some sugar — ${round(n.sugars)} g per 100 g`); }
    else reasons.push(`Low sugar — ${round(n.sugars)} g per 100 g`);
  }
  if (has(n.saturatedFat)) {
    if (n.saturatedFat > 5) { score -= 2; reasons.push(`High saturated fat — ${round(n.saturatedFat)} g per 100 g`); }
    else if (n.saturatedFat > 1.5) { score -= 1; reasons.push(`Moderate saturated fat — ${round(n.saturatedFat)} g per 100 g`); }
  }
  if (has(n.salt)) {
    if (n.salt > 1.5) { score -= 2; reasons.push(`High salt — ${round(n.salt)} g per 100 g`); }
    else if (n.salt > 0.3) { score -= 1; reasons.push(`Some salt — ${round(n.salt)} g per 100 g`); }
  }
  if (has(n.energyKcal) && n.energyKcal > 400) {
    score -= 1; reasons.push(`Energy-dense — ${round(n.energyKcal)} kcal per 100 g`);
  }

  // --- Rewards ---
  if (has(n.fiber)) {
    if (n.fiber >= 6) { score += 2; reasons.push(`High fibre — ${round(n.fiber)} g per 100 g`); }
    else if (n.fiber >= 3) { score += 1; reasons.push(`Good fibre — ${round(n.fiber)} g per 100 g`); }
  }
  if (has(n.proteins) && n.proteins >= 12) {
    score += 1; reasons.push(`Good protein — ${round(n.proteins)} g per 100 g`);
  }

  score = clamp(Math.round(score), 0, 10);
  if (reasons.length === 0) reasons.push('Limited nutrition data — score is approximate.');

  return { score, band: bandFor(score), reasons };
}

export function bandFor(score: number): HealthBand {
  if (score >= 8) return 'HEALTHY';
  if (score >= 5) return 'MODERATE';
  return 'UNHEALTHY';
}

const round = (v: number) => Math.round(v * 10) / 10;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
