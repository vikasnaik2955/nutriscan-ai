import type { HealthBand, ScanResult } from '@/types/health';

export interface Insights {
  total: number;
  avgScore: number | null;
  bandCounts: Record<HealthBand, number>;
  /** % of scans in the HEALTHY band (0–100). */
  healthyRate: number;
  /** Most recent scans (up to 7), oldest→newest, for the trend chart. */
  recent: { id: number; score: number; band: HealthBand; label: string }[];
}

/** Derive weekly-style insights from the user's scan history. Pure — no I/O. */
export function computeInsights(scans: ScanResult[]): Insights {
  const bandCounts: Record<HealthBand, number> = { HEALTHY: 0, MODERATE: 0, UNHEALTHY: 0 };
  for (const s of scans) bandCounts[s.healthBand]++;

  const total = scans.length;
  const avgScore = total ? Math.round((scans.reduce((a, s) => a + s.healthScore, 0) / total) * 10) / 10 : null;
  const healthyRate = total ? Math.round((bandCounts.HEALTHY / total) * 100) : 0;

  // newest-first list -> take 7, reverse to oldest→newest for left-to-right bars
  const recent = [...scans]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 7)
    .reverse()
    .map((s) => ({
      id: s.id,
      score: s.healthScore,
      band: s.healthBand,
      label: shortName(s.productName),
    }));

  return { total, avgScore, bandCounts, healthyRate, recent };
}

function shortName(name: string | null): string {
  if (!name) return '?';
  return name.split(' ')[0].slice(0, 6);
}
