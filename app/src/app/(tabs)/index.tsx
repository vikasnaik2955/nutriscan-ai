import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScanLine, Sparkles } from 'lucide-react-native';
import { Button, Card, Screen, Text } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import { theme } from '@/theme';

export default function Home() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const firstName = user?.displayName?.split(' ')[0] ?? 'there';

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="overline" color={theme.colors.textMuted}>Good day</Text>
        <Text variant="h1">Hi {firstName} 👋</Text>
        <Text variant="lg" color={theme.colors.textSecondary}>Ready to check what you&apos;re eating?</Text>
      </View>

      <Card style={styles.hero} accent={theme.colors.brand}>
        <View style={styles.heroRow}>
          <View style={styles.heroIcon}>
            <ScanLine size={28} color={theme.colors.brandOn} strokeWidth={2} />
          </View>
          <View style={styles.flex}>
            <Text variant="h3">Scan a product</Text>
            <Text variant="sm" color={theme.colors.textSecondary}>Barcode or nutrition label — get a health score in seconds.</Text>
          </View>
        </View>
        <Button label="Open scanner" onPress={() => router.push('/(tabs)/scan')} style={styles.heroBtn} />
      </Card>

      <Card style={styles.tip}>
        <View style={styles.tipRow}>
          <Sparkles size={20} color={theme.colors.food} />
          <Text variant="sm" weight="semibold" color={theme.colors.textSecondary}>Tip</Text>
        </View>
        <Text variant="body" color={theme.colors.textPrimary}>
          Foods scoring 8–10 are great everyday picks. Aim to keep your weekly average climbing.
        </Text>
      </Card>

      <Text variant="caption" center color={theme.colors.textMuted} style={styles.disclaimer}>
        Health scores are a general guide, not medical advice.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { gap: theme.spacing[1], marginBottom: theme.spacing[5] },
  hero: { gap: theme.spacing[4], marginBottom: theme.spacing[4] },
  heroRow: { flexDirection: 'row', gap: theme.spacing[3], alignItems: 'center' },
  heroIcon: {
    width: 52, height: 52, borderRadius: theme.radius.md, backgroundColor: theme.colors.brand,
    alignItems: 'center', justifyContent: 'center',
  },
  heroBtn: { marginTop: theme.spacing[1] },
  tip: { gap: theme.spacing[2] },
  tipRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[2] },
  disclaimer: { marginTop: theme.spacing[6] },
});
