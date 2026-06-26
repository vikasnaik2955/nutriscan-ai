import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';
import { theme } from '@/theme';

type Variant = 'display' | 'h1' | 'h2' | 'h3' | 'lg' | 'body' | 'sm' | 'caption' | 'overline';
type Weight = keyof typeof theme.fontFamily;

interface TextProps extends RNTextProps {
  variant?: Variant;
  weight?: Weight;
  color?: string;
  center?: boolean;
}

/** Per-variant size / default weight / line-height / tracking, from the design tokens. */
const VARIANTS: Record<Variant, { size: number; weight: Weight; leading: number; tracking: number }> = {
  display: { size: theme.fontSize.display, weight: 'extra', leading: theme.lineHeight.tight, tracking: theme.tracking.tight },
  h1: { size: theme.fontSize.h1, weight: 'bold', leading: theme.lineHeight.tight, tracking: theme.tracking.tight },
  h2: { size: theme.fontSize.h2, weight: 'bold', leading: theme.lineHeight.snug, tracking: theme.tracking.tight },
  h3: { size: theme.fontSize.h3, weight: 'semibold', leading: theme.lineHeight.snug, tracking: theme.tracking.normal },
  lg: { size: theme.fontSize.lg, weight: 'medium', leading: theme.lineHeight.normal, tracking: theme.tracking.normal },
  body: { size: theme.fontSize.body, weight: 'regular', leading: theme.lineHeight.normal, tracking: theme.tracking.normal },
  sm: { size: theme.fontSize.sm, weight: 'regular', leading: theme.lineHeight.normal, tracking: theme.tracking.normal },
  caption: { size: theme.fontSize.caption, weight: 'medium', leading: theme.lineHeight.normal, tracking: theme.tracking.normal },
  overline: { size: theme.fontSize.overline, weight: 'bold', leading: theme.lineHeight.normal, tracking: theme.tracking.overline },
};

export function Text({ variant = 'body', weight, color, center, style, ...rest }: TextProps) {
  const v = VARIANTS[variant];
  const composed: TextStyle = {
    fontFamily: theme.fontFamily[weight ?? v.weight],
    fontSize: v.size,
    lineHeight: Math.round(v.size * v.leading),
    letterSpacing: v.tracking * v.size,
    color: color ?? theme.colors.textPrimary,
    textTransform: variant === 'overline' ? 'uppercase' : undefined,
    textAlign: center ? 'center' : undefined,
  };
  return <RNText style={[composed, style]} {...rest} />;
}
