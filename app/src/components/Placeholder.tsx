import { StyleSheet, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Screen, Text } from '@/components/ui';
import { theme } from '@/theme';

/** Temporary scaffold screen — replaced as each module is built out. */
export function Placeholder({ icon: Icon, title, subtitle, build }: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  build: string;
}) {
  return (
    <Screen>
      <View style={styles.wrap}>
        <View style={styles.iconWrap}>
          <Icon size={48} color={theme.colors.brand} strokeWidth={1.75} />
        </View>
        <Text variant="h2" center>{title}</Text>
        <Text variant="lg" center color={theme.colors.textSecondary}>{subtitle}</Text>
        <View style={styles.badge}>
          <Text variant="overline" color={theme.colors.textMuted}>{build}</Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: theme.spacing[3] },
  iconWrap: {
    width: 96, height: 96, borderRadius: theme.radius.full, backgroundColor: theme.colors.brandSoft,
    alignItems: 'center', justifyContent: 'center', marginBottom: theme.spacing[2],
  },
  badge: {
    marginTop: theme.spacing[4], paddingHorizontal: theme.spacing[3], paddingVertical: theme.spacing[1],
    backgroundColor: theme.colors.surfaceSunken, borderRadius: theme.radius.full,
  },
});
