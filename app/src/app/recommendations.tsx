import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { CircleCheck, TriangleAlert, Lightbulb, type LucideIcon } from 'lucide-react-native';
import { Card, Screen, Text } from '@/components/ui';
import { useScans } from '@/hooks/useScans';
import { buildRecommendations, type RecTone } from '@/lib/recommendations';
import { theme } from '@/theme';

const TONE: Record<RecTone, { icon: LucideIcon; color: string; soft: string }> = {
  good: { icon: CircleCheck, color: theme.colors.success, soft: theme.colors.successSoft },
  warn: { icon: TriangleAlert, color: theme.colors.warning, soft: theme.colors.warningSoft },
  tip: { icon: Lightbulb, color: theme.colors.info, soft: theme.colors.infoSoft },
};

export default function Recommendations() {
  const { data: scans, isLoading } = useScans();

  if (isLoading) {
    return <Screen><View style={styles.fill}><ActivityIndicator color={theme.colors.brand} /></View></Screen>;
  }

  const recs = buildRecommendations(scans ?? []);

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="h1">For you</Text>
        <Text variant="lg" color={theme.colors.textSecondary}>Tips based on what you’ve scanned.</Text>
      </View>

      <View style={styles.list}>
        {recs.map((r) => {
          const t = TONE[r.tone];
          const Icon = t.icon;
          return (
            <Card key={r.id} style={styles.card} accent={t.color}>
              <View style={styles.cardHead}>
                <View style={[styles.icon, { backgroundColor: t.soft }]}>
                  <Icon size={20} color={t.color} />
                </View>
                <Text variant="h3" style={styles.flex}>{r.title}</Text>
              </View>
              <Text variant="body" color={theme.colors.textSecondary}>
                {r.body.includes('\n') ? `• ${r.body}` : r.body}
              </Text>
            </Card>
          );
        })}
      </View>

      <Text variant="caption" center color={theme.colors.textMuted} style={styles.disclaimer}>
        General guidance, not medical or dietary advice.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
  header: { gap: 2, marginBottom: theme.spacing[5] },
  list: { gap: theme.spacing[3] },
  card: { gap: theme.spacing[3] },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3] },
  icon: { width: 40, height: 40, borderRadius: theme.radius.md, alignItems: 'center', justifyContent: 'center' },
  disclaimer: { marginTop: theme.spacing[6] },
});
