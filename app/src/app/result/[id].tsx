import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle2, AlertTriangle, Trash2 } from 'lucide-react-native';
import { Button, Card, Screen, Text } from '@/components/ui';
import { ScoreRing } from '@/components/ScoreRing';
import { NutritionFacts } from '@/components/NutritionFacts';
import { useScan, useDeleteScan } from '@/hooks/useScans';
import { theme, bandColors } from '@/theme';

export default function ScanResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scanId = Number(id);
  const router = useRouter();
  const { data: scan, isLoading } = useScan(scanId);
  const del = useDeleteScan();

  if (isLoading) {
    return (
      <Screen><View style={styles.fill}><ActivityIndicator color={theme.colors.brand} /></View></Screen>
    );
  }

  if (!scan) {
    return (
      <Screen>
        <View style={styles.fill}>
          <Text variant="h3" center>Scan not found</Text>
          <Button label="Back to scanner" onPress={() => router.replace('/(tabs)/scan')} style={styles.gap} />
        </View>
      </Screen>
    );
  }

  const band = bandColors(scan.healthBand);

  const onDelete = () =>
    del.mutate(scanId, { onSuccess: () => router.replace('/(tabs)/history') });

  return (
    <Screen>
      <View style={styles.hero}>
        <ScoreRing score={scan.healthScore} />
        <Text variant="h2" center style={styles.name}>{scan.productName ?? 'Unknown product'}</Text>
        <View style={[styles.bandPill, { backgroundColor: band.soft }]}>
          <Text variant="caption" weight="bold" color={band.fg}>
            {bandHeadline(scan.healthBand)}
          </Text>
        </View>
      </View>

      <Card style={styles.section}>
        <Text variant="overline" color={theme.colors.textMuted}>Why this score</Text>
        {scan.reasons.map((r) => {
          const caution = isCaution(r);
          return (
            <View key={r} style={styles.reason}>
              {caution
                ? <AlertTriangle size={18} color={theme.colors.warning} />
                : <CheckCircle2 size={18} color={theme.colors.success} />}
              <Text variant="body" color={theme.colors.textPrimary} style={styles.flex}>{r}</Text>
            </View>
          );
        })}
      </Card>

      <Card style={styles.section}>
        <NutritionFacts nutrition={scan.nutrition} />
      </Card>

      <Text variant="caption" center color={theme.colors.textMuted} style={styles.disclaimer}>
        Health scores are a general guide based on nutrition per 100 g — not medical advice.
      </Text>

      <View style={styles.actions}>
        <Button label="Scan again" onPress={() => router.replace('/(tabs)/scan')} />
        <Button label="Done" variant="secondary" onPress={() => router.replace('/(tabs)')} />
        <Button
          label="Delete scan"
          variant="ghost"
          loading={del.isPending}
          leftIcon={<Trash2 size={18} color={theme.colors.error} />}
          onPress={onDelete}
        />
      </View>
    </Screen>
  );
}

function bandHeadline(band: string): string {
  if (band === 'HEALTHY') return 'Healthy pick';
  if (band === 'MODERATE') return 'Okay in moderation';
  return 'Best to limit';
}

/** Crude sign detection for the reason icon. */
function isCaution(reason: string): boolean {
  return /high (sugar|salt|saturated)|some (sugar|salt)|moderate saturated|energy-dense|limited/i.test(reason);
}

const styles = StyleSheet.create({
  fill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
  gap: { marginTop: theme.spacing[4] },
  hero: { alignItems: 'center', gap: theme.spacing[3], marginTop: theme.spacing[2], marginBottom: theme.spacing[5] },
  name: { marginTop: theme.spacing[2] },
  bandPill: { paddingHorizontal: theme.spacing[3], paddingVertical: theme.spacing[1], borderRadius: theme.radius.full },
  section: { gap: theme.spacing[3], marginBottom: theme.spacing[4] },
  reason: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing[2] },
  disclaimer: { marginBottom: theme.spacing[5], paddingHorizontal: theme.spacing[4] },
  actions: { gap: theme.spacing[3] },
});
