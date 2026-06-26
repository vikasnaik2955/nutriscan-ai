import type { ScanResult } from '@/types/health';

export type RecTone = 'good' | 'warn' | 'tip';

export interface Recommendation {
  id: string;
  title: string;
  body: string;
  tone: RecTone;
}

/** Healthier staples to suggest as swaps (mirrors the mock catalog's good picks). */
const HEALTHY_PICKS = [
  'Quaker Oats — high fibre, low sugar',
  'Amul Toned Milk — good protein, low fat',
  'Roasted chana or makhana instead of fried chips',
];

/**
 * Turn scan history into a short, personalized recommendation list. Heuristic and mock-driven;
 * a real version would live server-side alongside the score engine.
 */
export function buildRecommendations(scans: ScanResult[]): Recommendation[] {
  const recs: Recommendation[] = [];

  if (scans.length === 0) {
    recs.push({
      id: 'empty',
      title: 'Scan a few products',
      body: 'Once you’ve scanned a handful of items, you’ll get tips tailored to what you actually eat.',
      tone: 'tip',
    });
    return recs;
  }

  const avg = scans.reduce((a, s) => a + s.healthScore, 0) / scans.length;
  const unhealthy = scans.filter((s) => s.healthBand === 'UNHEALTHY');
  const healthy = scans.filter((s) => s.healthBand === 'HEALTHY');

  // Find the dominant problem across reasons (salt / sugar / saturated fat).
  const counts = { salt: 0, sugar: 0, fat: 0 };
  for (const s of scans) {
    for (const r of s.reasons) {
      if (/salt/i.test(r) && /high|some/i.test(r)) counts.salt++;
      if (/sugar/i.test(r) && /high|some/i.test(r)) counts.sugar++;
      if (/saturated/i.test(r) && /high|moderate/i.test(r)) counts.fat++;
    }
  }
  const worst = (Object.entries(counts).sort((a, b) => b[1] - a[1])[0] ?? ['', 0]) as [string, number];

  if (worst[1] >= 2) {
    const label = worst[0] === 'fat' ? 'saturated fat' : worst[0];
    recs.push({
      id: 'reduce',
      title: `Watch the ${label}`,
      body: `Several of your scans are high in ${label}. Try lower-${label} alternatives or smaller portions.`,
      tone: 'warn',
    });
  }

  if (avg < 5) {
    recs.push({
      id: 'swaps',
      title: 'Try a few healthier swaps',
      body: HEALTHY_PICKS.join('\n• '),
      tone: 'tip',
    });
  }

  if (healthy.length >= 2 && healthy.length >= unhealthy.length) {
    recs.push({
      id: 'streak',
      title: 'Nice choices lately',
      body: `${healthy.length} of your recent scans scored Healthy. Keep that going — your weekly average is ${avg.toFixed(1)}/10.`,
      tone: 'good',
    });
  }

  // Always close with a steady, generic tip.
  recs.push({
    id: 'habit',
    title: 'Aim for 8+ on everyday items',
    body: 'Foods scoring 8–10 are great daily picks. Save 0–4 items for occasional treats.',
    tone: 'tip',
  });

  return recs;
}
