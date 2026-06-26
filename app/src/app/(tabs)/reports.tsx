import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, Scale, Flame, ChevronRight, type LucideIcon } from 'lucide-react-native';
import { Card, Screen, Text } from '@/components/ui';
import { MiniBars } from '@/components/MiniBars';
import { useScans } from '@/hooks/useScans';
import { computeInsights } from '@/lib/insights';
import { theme, bandColors } from '@/theme';

export default function Reports() {
  const router = useRouter();
  const { data: scans, isLoading } = useScans();

  if (isLoading) {
    return <Screen><View style={styles.fill}><ActivityIndicator color={theme.colors.brand} /></View></Screen>;
  }

  const insights = computeInsights(scans ?? []);
  const avgBand = insights.avgScore != null ? bandColors(scoreBand(insights.avgScore)) : null;

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="h1">Insights</Text>
        <Text variant="lg" color={theme.colors.textSecondary}>How your choices are trending.</Text>
      </View>

      {/* Weekly summary */}
      <Card style={styles.summary}>
        <View style={styles.summaryTop}>
          <View>
            <Text variant="overline" color={theme.colors.textMuted}>Average score</Text>
            <Text variant="display" weight="extra" color={avgBand?.fg ?? theme.colors.textMuted}>
              {insights.avgScore ?? '—'}
            </Text>
          </View>
          <View style={styles.summaryStats}>
            <Stat label="Scans" value={String(insights.total)} />
            <Stat label="Healthy" value={`${insights.healthyRate}%`} color={theme.colors.healthy} />
          </View>
        </View>

        {/* Band breakdown */}
        <View style={styles.bands}>
          {(['HEALTHY', 'MODERATE', 'UNHEALTHY'] as const).map((b) => {
            const c = bandColors(b);
            const count = insights.bandCounts[b];
            const pct = insights.total ? (count / insights.total) * 100 : 0;
            return (
              <View key={b} style={styles.bandRow}>
                <Text variant="caption" weight="semibold" color={c.fg} style={styles.bandLabel}>{cap(b)}</Text>
                <View style={styles.bandTrack}>
                  <View style={[styles.bandFill, { width: `${pct}%`, backgroundColor: c.fg }]} />
                </View>
                <Text variant="caption" color={theme.colors.textMuted} style={styles.bandCount}>{count}</Text>
              </View>
            );
          })}
        </View>
      </Card>

      {/* Trend */}
      <Card style={styles.section}>
        <Text variant="overline" color={theme.colors.textMuted}>Recent scores</Text>
        <MiniBars
          data={insights.recent.map((r) => ({ value: r.score, color: bandColors(r.band).fg, label: r.label }))}
        />
      </Card>

      <Text variant="overline" color={theme.colors.textMuted} style={styles.toolsLabel}>Tools</Text>
      <NavCard icon={Sparkles} tint={theme.colors.food} title="Recommendations" subtitle="Personalized tips from your scans" onPress={() => router.push('/recommendations')} />
      <NavCard icon={Scale} tint={theme.colors.info} title="BMI calculator" subtitle="Check your body mass index" onPress={() => router.push('/bmi')} />
      <NavCard icon={Flame} tint={theme.colors.brand} title="Calorie tracker" subtitle="Log meals against a daily goal" onPress={() => router.push('/calorie')} />
    </Screen>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.stat}>
      <Text variant="h3" weight="bold" color={color ?? theme.colors.textPrimary}>{value}</Text>
      <Text variant="caption" color={theme.colors.textMuted}>{label}</Text>
    </View>
  );
}

function NavCard({ icon: Icon, tint, title, subtitle, onPress }: {
  icon: LucideIcon; tint: string; title: string; subtitle: string; onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.navCard, theme.shadow.sm, pressed && styles.pressed]}>
      <View style={[styles.navIcon, { backgroundColor: tint + '1A' }]}>
        <Icon size={22} color={tint} />
      </View>
      <View style={styles.flex}>
        <Text variant="lg" weight="semibold">{title}</Text>
        <Text variant="sm" color={theme.colors.textSecondary}>{subtitle}</Text>
      </View>
      <ChevronRight size={20} color={theme.colors.textMuted} />
    </Pressable>
  );
}

function scoreBand(score: number) {
  return score >= 8 ? 'HEALTHY' : score >= 5 ? 'MODERATE' : 'UNHEALTHY';
}
const cap = (b: string) => b.charAt(0) + b.slice(1).toLowerCase();

const styles = StyleSheet.create({
  fill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
  header: { gap: 2, marginBottom: theme.spacing[4] },
  summary: { gap: theme.spacing[4], marginBottom: theme.spacing[4] },
  summaryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  summaryStats: { flexDirection: 'row', gap: theme.spacing[5] },
  stat: { alignItems: 'flex-end' },
  bands: { gap: theme.spacing[2] },
  bandRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[2] },
  bandLabel: { width: 72 },
  bandTrack: { flex: 1, height: 8, borderRadius: theme.radius.full, backgroundColor: theme.colors.surfaceSunken, overflow: 'hidden' },
  bandFill: { height: '100%', borderRadius: theme.radius.full },
  bandCount: { width: 20, textAlign: 'right' },
  section: { gap: theme.spacing[3], marginBottom: theme.spacing[4] },
  toolsLabel: { marginBottom: theme.spacing[2] },
  navCard: {
    flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3],
    backgroundColor: theme.colors.surfaceCard, borderRadius: theme.radius.lg,
    borderWidth: 1, borderColor: theme.colors.borderSubtle, padding: theme.spacing[3], marginBottom: theme.spacing[3],
  },
  pressed: { opacity: 0.7 },
  navIcon: { width: 44, height: 44, borderRadius: theme.radius.md, alignItems: 'center', justifyContent: 'center' },
});
