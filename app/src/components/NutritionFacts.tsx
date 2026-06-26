import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui';
import { theme } from '@/theme';
import type { Nutrition } from '@/types/health';

interface Row {
  label: string;
  value: number | null;
  unit: string;
  /** Indent as a sub-nutrient (e.g. "of which sugars"). */
  sub?: boolean;
}

/** Per-100g nutrition table. Skips rows with no data. */
export function NutritionFacts({ nutrition }: { nutrition: Nutrition }) {
  const rows: Row[] = [
    { label: 'Energy', value: nutrition.energyKcal, unit: 'kcal' },
    { label: 'Protein', value: nutrition.proteins, unit: 'g' },
    { label: 'Carbohydrate', value: nutrition.carbohydrates, unit: 'g' },
    { label: 'of which sugars', value: nutrition.sugars, unit: 'g', sub: true },
    { label: 'Fat', value: nutrition.fat, unit: 'g' },
    { label: 'of which saturates', value: nutrition.saturatedFat, unit: 'g', sub: true },
    { label: 'Fibre', value: nutrition.fiber, unit: 'g' },
    { label: 'Salt', value: nutrition.salt, unit: 'g' },
  ].filter((r) => r.value != null);

  return (
    <View>
      <View style={styles.head}>
        <Text variant="overline" color={theme.colors.textMuted}>Nutrition facts</Text>
        <Text variant="overline" color={theme.colors.textMuted}>per 100 g</Text>
      </View>
      {rows.map((r, i) => (
        <View key={r.label} style={[styles.row, i < rows.length - 1 && styles.divider]}>
          <Text
            variant="body"
            weight={r.sub ? 'regular' : 'semibold'}
            color={r.sub ? theme.colors.textSecondary : theme.colors.textPrimary}
            style={r.sub ? styles.sub : undefined}
          >
            {r.label}
          </Text>
          <Text variant="body" weight="semibold">
            {round(r.value as number)} {r.unit}
          </Text>
        </View>
      ))}
    </View>
  );
}

const round = (v: number) => Math.round(v * 10) / 10;

const styles = StyleSheet.create({
  head: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing[2] },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: theme.spacing[3] },
  divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.borderSubtle },
  sub: { paddingLeft: theme.spacing[4] },
});
