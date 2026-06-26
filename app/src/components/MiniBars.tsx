import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui';
import { theme } from '@/theme';

export interface Bar {
  value: number;
  color: string;
  label?: string;
}

/** Tiny vertical bar chart (no SVG). Bars scale to `max`; values shown on top. */
export function MiniBars({ data, max = 10, height = 120 }: { data: Bar[]; max?: number; height?: number }) {
  if (data.length === 0) {
    return <Text variant="sm" color={theme.colors.textMuted}>No data yet</Text>;
  }
  return (
    <View style={[styles.row, { height }]}>
      {data.map((b, i) => {
        const h = Math.max(6, (b.value / max) * (height - 22));
        return (
          <View key={i} style={styles.col}>
            <Text variant="caption" weight="bold" color={theme.colors.textSecondary}>{b.value}</Text>
            <View style={[styles.bar, { height: h, backgroundColor: b.color }]} />
            {b.label ? <Text variant="overline" color={theme.colors.textMuted} numberOfLines={1}>{b.label}</Text> : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: theme.spacing[2] },
  col: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4 },
  bar: { width: '78%', borderRadius: theme.radius.sm },
});
