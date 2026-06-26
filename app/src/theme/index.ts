/**
 * Single import surface for the design system.
 *
 *   import { theme } from '@/theme';
 *   ...
 *   backgroundColor: theme.colors.surfaceCard,
 *   borderRadius: theme.radius.lg,
 *
 * Also exposes a couple of helpers the score UI needs repeatedly.
 */
import {
  colors, fontFamily, fontSize, layout, lineHeight, motion, palette,
  radius, shadow, spacing, tracking,
} from './tokens';
import type { HealthBand } from '../types/health';

export const theme = {
  palette, colors, spacing, radius, shadow,
  fontFamily, fontSize, lineHeight, tracking, layout, motion,
} as const;

/** Map a 0–10 health score to its band (mirrors the backend thresholds). */
export function bandForScore(score: number): HealthBand {
  if (score >= 8) return 'HEALTHY';
  if (score >= 5) return 'MODERATE';
  return 'UNHEALTHY';
}

/** Foreground + soft background color for a health band. */
export function bandColors(band: HealthBand): { fg: string; soft: string } {
  switch (band) {
    case 'HEALTHY':
      return { fg: colors.healthy, soft: colors.healthySoft };
    case 'MODERATE':
      return { fg: colors.moderate, soft: colors.moderateSoft };
    case 'UNHEALTHY':
      return { fg: colors.unhealthy, soft: colors.unhealthySoft };
  }
}

export { colors, spacing, radius, shadow, fontFamily, fontSize, palette };
