import { ActivityIndicator, StyleSheet, Switch, View } from 'react-native';
import { TriangleAlert, PartyPopper, Bell, Soup, Candy, CalendarClock, Target, type LucideIcon } from 'lucide-react-native';
import { Card, Screen, Text } from '@/components/ui';
import { Row } from '@/components/Row';
import { useScans } from '@/hooks/useScans';
import { computeInsights } from '@/lib/insights';
import { useSettingsStore, type BoolPref } from '@/store/settingsStore';
import { theme } from '@/theme';

interface AlertItem { id: string; icon: LucideIcon; color: string; soft: string; title: string; body: string; }

export default function Alerts() {
  const { data: scans, isLoading } = useScans();
  const settings = useSettingsStore();

  if (isLoading) {
    return <Screen><View style={styles.fill}><ActivityIndicator color={theme.colors.brand} /></View></Screen>;
  }

  const insights = computeInsights(scans ?? []);
  const feed: AlertItem[] = [];

  if (insights.bandCounts.UNHEALTHY >= 2) {
    feed.push({
      id: 'unhealthy', icon: TriangleAlert, color: theme.colors.warning, soft: theme.colors.warningSoft,
      title: 'Watch your recent picks',
      body: `${insights.bandCounts.UNHEALTHY} of your recent scans scored in the unhealthy range.`,
    });
  }
  if (insights.healthyRate >= 50 && insights.total >= 2) {
    feed.push({
      id: 'streak', icon: PartyPopper, color: theme.colors.success, soft: theme.colors.successSoft,
      title: 'Healthy streak 🎉',
      body: `${insights.healthyRate}% of your scans this week were healthy picks. Keep it up!`,
    });
  }
  feed.push({
    id: 'tip', icon: Bell, color: theme.colors.info, soft: theme.colors.infoSoft,
    title: 'Scan before you buy',
    body: 'A quick scan in the aisle helps you choose the better option on the shelf.',
  });

  const toggles: { key: BoolPref; icon: LucideIcon; title: string; subtitle: string }[] = [
    { key: 'highSugarAlerts', icon: Candy, title: 'High-sugar alerts', subtitle: 'Warn me on high-sugar scans' },
    { key: 'highSaltAlerts', icon: Soup, title: 'High-salt alerts', subtitle: 'Warn me on high-salt scans' },
    { key: 'dailySummary', icon: CalendarClock, title: 'Daily summary', subtitle: 'A recap of your day' },
    { key: 'goalReminders', icon: Target, title: 'Calorie goal reminders', subtitle: 'Nudge me toward my goal' },
  ];
  const switchTrack = { false: theme.colors.borderStrong, true: theme.colors.brand };

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="h1">Smart alerts</Text>
        <Text variant="lg" color={theme.colors.textSecondary}>Timely nudges based on your habits.</Text>
      </View>

      <View style={styles.feed}>
        {feed.map((a) => {
          const Icon = a.icon;
          return (
            <Card key={a.id} style={styles.alertCard} accent={a.color}>
              <View style={[styles.icon, { backgroundColor: a.soft }]}><Icon size={20} color={a.color} /></View>
              <View style={styles.flex}>
                <Text variant="body" weight="semibold">{a.title}</Text>
                <Text variant="sm" color={theme.colors.textSecondary}>{a.body}</Text>
              </View>
            </Card>
          );
        })}
      </View>

      <Text variant="overline" color={theme.colors.textMuted} style={styles.prefLabel}>Notify me about</Text>
      <Card style={styles.prefCard}>
        {toggles.map((t, i) => (
          <View key={t.key}>
            {i > 0 ? <View style={styles.divider} /> : null}
            <Row
              icon={t.icon}
              title={t.title}
              subtitle={t.subtitle}
              right={<Switch value={settings[t.key]} onValueChange={() => settings.toggle(t.key)} trackColor={switchTrack} thumbColor="#fff" />}
            />
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
  header: { gap: 2, marginBottom: theme.spacing[5] },
  feed: { gap: theme.spacing[3], marginBottom: theme.spacing[6] },
  alertCard: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3] },
  icon: { width: 40, height: 40, borderRadius: theme.radius.md, alignItems: 'center', justifyContent: 'center' },
  prefLabel: { marginBottom: theme.spacing[2] },
  prefCard: { paddingVertical: theme.spacing[1] },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: theme.colors.borderSubtle, marginLeft: 50 },
});
