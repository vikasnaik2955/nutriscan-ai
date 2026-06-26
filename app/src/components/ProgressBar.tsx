import { StyleSheet, View } from 'react-native';
import { theme } from '@/theme';

/** Horizontal progress bar. `value`/`max` clamps to 0–100%; over-budget shows full + a hint color. */
export function ProgressBar({ value, max, color = theme.colors.brand, track = theme.colors.surfaceSunken, height = 12 }: {
  value: number;
  max: number;
  color?: string;
  track?: string;
  height?: number;
}) {
  const pct = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  return (
    <View style={[styles.track, { height, backgroundColor: track }]}>
      <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: '100%', borderRadius: theme.radius.full, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: theme.radius.full },
});
