/**
 * NutriScan design tokens — typed for React Native.
 *
 * Translated 1:1 from the design system shipped in the project ZIP
 * (design/tokens/*.css — the reused "Plenty" token set). Donation-specific
 * tokens (clothes/teal category, REQUESTED→DELIVERED status lifecycle, reward
 * gold) are intentionally dropped; NutriScan health-band colors are added.
 *
 * This is the single source of truth for styling. Screens consume these via the
 * `theme` export in ./index.ts — never hard-code hex values in components.
 */

// ---- Base palette (from design/tokens/colors.css) ----
export const palette = {
  green: {
    50: '#ECFBF1', 100: '#D1F4DD', 200: '#A6E9BF', 300: '#6FD89A', 400: '#3BBE76',
    500: '#1F9D57', 600: '#178049', 700: '#14653B', 800: '#135231', 900: '#0F4329',
  },
  orange: {
    50: '#FEF3EA', 100: '#FCE0CB', 200: '#F8C79B', 300: '#F6B27A',
    400: '#F09148', 500: '#EA7317', 600: '#C75D0E', 700: '#9C4A0F',
  },
  neutral: {
    0: '#FFFFFF', 50: '#FAF8F5', 100: '#F2EFEA', 200: '#E6E1DA', 300: '#D2CBC1',
    400: '#ABA194', 500: '#82776A', 600: '#5F564B', 700: '#443E36', 800: '#2C2823', 900: '#1A1714',
  },
  red: { 50: '#FBEBE9', 500: '#DC4B3E' },
  amber: { 50: '#FCF3DD', 500: '#E6A012' },
  blue: { 50: '#E9F0FE', 500: '#2F6FED' },
} as const;

// ---- Semantic colors ----
export const colors = {
  // Brand (food orange is the secondary accent for "food" affordances)
  brand: palette.green[500],
  brandStrong: palette.green[600],
  brandSoft: palette.green[50],
  brandOn: '#FFFFFF',

  food: palette.orange[500],
  foodSoft: palette.orange[50],

  // Text
  textPrimary: palette.neutral[900],
  textSecondary: palette.neutral[600],
  textMuted: palette.neutral[500],
  textDisabled: palette.neutral[400],
  textOnBrand: '#FFFFFF',
  textLink: palette.green[600],

  // Surfaces
  surfacePage: palette.neutral[50],
  surfaceCard: palette.neutral[0],
  surfaceSunken: palette.neutral[100],
  surfaceInverse: palette.neutral[900],
  surfaceOverlay: 'rgba(26, 23, 20, 0.48)',

  // Borders
  borderSubtle: palette.neutral[200],
  borderStrong: palette.neutral[300],
  borderBrand: palette.green[500],
  focusRing: 'rgba(31, 157, 87, 0.40)',

  // Semantic states
  success: palette.green[500], successSoft: palette.green[50],
  warning: palette.amber[500], warningSoft: palette.amber[50],
  error: palette.red[500], errorSoft: palette.red[50],
  info: palette.blue[500], infoSoft: palette.blue[50],

  // NutriScan health-score bands (0–4 / 5–7 / 8–10). NOT in the donation tokens —
  // added here, mapped onto the semantic hues so the palette stays coherent.
  healthy: palette.green[500], healthySoft: palette.green[50],
  moderate: palette.amber[500], moderateSoft: palette.amber[50],
  unhealthy: palette.red[500], unhealthySoft: palette.red[50],
} as const;

// ---- Spacing (4/8 base) ----
export const spacing = {
  0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48, 16: 64,
} as const;

// ---- Radii (cards land at 16) ----
export const radius = {
  xs: 6, sm: 10, md: 14, lg: 16, xl: 20, '2xl': 28, full: 999,
} as const;

// ---- Elevation (soft, warm-tinted). RN shadow objects, iOS + Android. ----
export const shadow = {
  sm: {
    shadowColor: palette.neutral[900], shadowOpacity: 0.08, shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 }, elevation: 2,
  },
  md: {
    shadowColor: palette.neutral[900], shadowOpacity: 0.08, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  lg: {
    shadowColor: palette.neutral[900], shadowOpacity: 0.12, shadowRadius: 28,
    shadowOffset: { width: 0, height: 12 }, elevation: 8,
  },
  brand: {
    shadowColor: palette.green[500], shadowOpacity: 0.28, shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 }, elevation: 6,
  },
} as const;

// ---- Typography (Plus Jakarta Sans). Font files loaded via @expo-google-fonts. ----
export const fontFamily = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extra: 'PlusJakartaSans_800ExtraBold',
} as const;

export const fontSize = {
  display: 40, h1: 32, h2: 26, h3: 21, lg: 17, body: 15, sm: 14, caption: 13, overline: 11,
} as const;

export const lineHeight = {
  tight: 1.12, snug: 1.28, normal: 1.5, relaxed: 1.62,
} as const;

export const tracking = {
  tight: -0.02, normal: 0, wide: 0.04, overline: 0.1,
} as const;

// ---- Layout / motion ----
export const layout = {
  tapTarget: 44,
  appbarHeight: 56,
  bottomNavHeight: 64,
  contentPad: 20,
} as const;

export const motion = {
  durationFast: 140, durationBase: 220, durationSlow: 320,
  // react-native-reanimated Easing.bezier(...) args
  easeStandard: [0.2, 0, 0, 1] as const,
  easeEmphasized: [0.3, 0, 0, 1] as const,
} as const;
