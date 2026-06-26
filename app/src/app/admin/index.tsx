import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Users, Package, ScanLine, ChevronRight, type LucideIcon } from 'lucide-react-native';
import { Card, Screen, Text } from '@/components/ui';
import { useAdminStats } from '@/hooks/useAdmin';
import { theme } from '@/theme';

export default function AdminDashboard() {
  const router = useRouter();
  const { data: stats, isLoading } = useAdminStats();

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="h1">Dashboard</Text>
        <Text variant="lg" color={theme.colors.textSecondary}>Overview & management.</Text>
      </View>

      {isLoading || !stats ? (
        <View style={styles.loading}><ActivityIndicator color={theme.colors.brand} /></View>
      ) : (
        <View style={styles.stats}>
          <StatCard icon={Users} tint={theme.colors.info} value={stats.users} label="Users" />
          <StatCard icon={Package} tint={theme.colors.food} value={stats.products} label="Products" />
          <StatCard icon={ScanLine} tint={theme.colors.brand} value={stats.scans} label="Scans" />
        </View>
      )}

      <Text variant="overline" color={theme.colors.textMuted} style={styles.manageLabel}>Manage</Text>
      <NavCard icon={Package} tint={theme.colors.food} title="Products" subtitle="Add or remove catalog items" onPress={() => router.push('/admin/products')} />
      <NavCard icon={Users} tint={theme.colors.info} title="Users" subtitle="Enable, disable and review users" onPress={() => router.push('/admin/users')} />
    </Screen>
  );
}

function StatCard({ icon: Icon, tint, value, label }: { icon: LucideIcon; tint: string; value: number; label: string }) {
  return (
    <Card style={styles.statCard}>
      <Icon size={22} color={tint} />
      <Text variant="h1" weight="extra">{value}</Text>
      <Text variant="caption" color={theme.colors.textMuted}>{label}</Text>
    </Card>
  );
}

function NavCard({ icon: Icon, tint, title, subtitle, onPress }: {
  icon: LucideIcon; tint: string; title: string; subtitle: string; onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.navCard, theme.shadow.sm, pressed && styles.pressed]}>
      <View style={[styles.navIcon, { backgroundColor: tint + '1A' }]}><Icon size={22} color={tint} /></View>
      <View style={styles.flex}>
        <Text variant="lg" weight="semibold">{title}</Text>
        <Text variant="sm" color={theme.colors.textSecondary}>{subtitle}</Text>
      </View>
      <ChevronRight size={20} color={theme.colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { gap: 2, marginBottom: theme.spacing[5] },
  loading: { paddingVertical: theme.spacing[8] },
  stats: { flexDirection: 'row', gap: theme.spacing[3], marginBottom: theme.spacing[5] },
  statCard: { flex: 1, alignItems: 'center', gap: theme.spacing[1], paddingVertical: theme.spacing[4] },
  manageLabel: { marginBottom: theme.spacing[2] },
  navCard: {
    flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3],
    backgroundColor: theme.colors.surfaceCard, borderRadius: theme.radius.lg,
    borderWidth: 1, borderColor: theme.colors.borderSubtle, padding: theme.spacing[3], marginBottom: theme.spacing[3],
  },
  pressed: { opacity: 0.7 },
  navIcon: { width: 44, height: 44, borderRadius: theme.radius.md, alignItems: 'center', justifyContent: 'center' },
});
