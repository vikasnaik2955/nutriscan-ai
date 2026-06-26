import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Input, Screen, Text } from '@/components/ui';
import { useBodyStore, computeBmi } from '@/store/bodyStore';
import { theme } from '@/theme';

const CATEGORY_COLOR: Record<string, string> = {
  Underweight: theme.colors.info,
  Normal: theme.colors.healthy,
  Overweight: theme.colors.warning,
  Obese: theme.colors.error,
};

// Scale runs 15–40 BMI for the marker position.
const SCALE_MIN = 15;
const SCALE_MAX = 40;
const SEGMENTS = [
  { label: 'Under', color: theme.colors.info, upTo: 18.5 },
  { label: 'Normal', color: theme.colors.healthy, upTo: 25 },
  { label: 'Over', color: theme.colors.warning, upTo: 30 },
  { label: 'Obese', color: theme.colors.error, upTo: SCALE_MAX },
];

export default function Bmi() {
  const { heightCm, weightKg, setHeight, setWeight } = useBodyStore();
  const [h, setH] = useState(String(heightCm));
  const [w, setW] = useState(String(weightKg));

  const onHeight = (t: string) => { setH(t); const v = parseFloat(t); if (v > 0) setHeight(v); };
  const onWeight = (t: string) => { setW(t); const v = parseFloat(t); if (v > 0) setWeight(v); };

  const result = computeBmi(parseFloat(h) || 0, parseFloat(w) || 0);
  const markerPct = result
    ? Math.max(0, Math.min(1, (result.bmi - SCALE_MIN) / (SCALE_MAX - SCALE_MIN))) * 100
    : 0;

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="h1">BMI calculator</Text>
        <Text variant="lg" color={theme.colors.textSecondary}>Enter your height and weight.</Text>
      </View>

      <View style={styles.inputs}>
        <Input label="Height (cm)" keyboardType="numeric" value={h} onChangeText={onHeight} containerStyle={styles.flex} />
        <Input label="Weight (kg)" keyboardType="numeric" value={w} onChangeText={onWeight} containerStyle={styles.flex} />
      </View>

      {result ? (
        <Card style={styles.result}>
          <View style={styles.resultTop}>
            <View>
              <Text variant="overline" color={theme.colors.textMuted}>Your BMI</Text>
              <Text variant="display" weight="extra" color={CATEGORY_COLOR[result.category]}>{result.bmi}</Text>
            </View>
            <View style={[styles.catPill, { backgroundColor: CATEGORY_COLOR[result.category] + '1A' }]}>
              <Text variant="caption" weight="bold" color={CATEGORY_COLOR[result.category]}>{result.category}</Text>
            </View>
          </View>

          {/* Scale */}
          <View style={styles.scaleWrap}>
            <View style={styles.scale}>
              {SEGMENTS.map((s) => (
                <View key={s.label} style={[styles.segment, { backgroundColor: s.color }]} />
              ))}
            </View>
            <View style={[styles.marker, { left: `${markerPct}%` }]} />
            <View style={styles.scaleLabels}>
              {SEGMENTS.map((s) => (
                <Text key={s.label} variant="overline" color={theme.colors.textMuted} style={styles.flex} center>{s.label}</Text>
              ))}
            </View>
          </View>

          <Text variant="sm" color={theme.colors.textSecondary}>{advice(result.category)}</Text>
        </Card>
      ) : (
        <Card><Text variant="body" color={theme.colors.textSecondary}>Enter valid height and weight to see your BMI.</Text></Card>
      )}

      <Text variant="caption" center color={theme.colors.textMuted} style={styles.disclaimer}>
        BMI is a rough screening measure and doesn’t account for muscle, age, or body composition.
      </Text>
    </Screen>
  );
}

function advice(category: string): string {
  switch (category) {
    case 'Underweight': return 'You’re below the healthy range. Nutrient-dense meals and protein can help.';
    case 'Normal': return 'You’re in the healthy range. Keep up balanced eating and regular activity.';
    case 'Overweight': return 'Slightly above the healthy range. Small, steady changes to diet and movement help.';
    default: return 'Above the healthy range. Consider speaking with a doctor or dietitian for a plan.';
  }
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { gap: 2, marginBottom: theme.spacing[5] },
  inputs: { flexDirection: 'row', gap: theme.spacing[3], marginBottom: theme.spacing[5] },
  result: { gap: theme.spacing[5] },
  resultTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  catPill: { paddingHorizontal: theme.spacing[3], paddingVertical: theme.spacing[1], borderRadius: theme.radius.full },
  scaleWrap: { gap: theme.spacing[2] },
  scale: { flexDirection: 'row', height: 12, borderRadius: theme.radius.full, overflow: 'hidden', gap: 2 },
  segment: { flex: 1 },
  marker: {
    position: 'absolute', top: -4, width: 4, height: 20, borderRadius: 2,
    backgroundColor: theme.colors.textPrimary, marginLeft: -2,
  },
  scaleLabels: { flexDirection: 'row' },
  disclaimer: { marginTop: theme.spacing[6], paddingHorizontal: theme.spacing[4] },
});
