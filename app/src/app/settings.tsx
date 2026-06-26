import { Alert, StyleSheet, Switch, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  UserPen, KeyRound, Bell, Ruler, ShieldCheck, Trash2, LogOut, Info,
} from 'lucide-react-native';
import { Card, Screen, Text } from '@/components/ui';
import { Row } from '@/components/Row';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useClearHistory } from '@/hooks/useScans';
import { theme } from '@/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const { metricUnits, toggle } = useSettingsStore();
  const clearHistory = useClearHistory();

  const isAdmin = user?.role === 'ADMIN';

  const confirmClear = () =>
    Alert.alert('Clear scan history?', 'This permanently deletes all your scans. This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => clearHistory.mutate() },
    ]);

  const switchTrack = { false: theme.colors.borderStrong, true: theme.colors.brand };

  return (
    <Screen>
      <Section title="Account">
        <Row icon={UserPen} iconColor={theme.colors.brand} title="Edit profile" subtitle={user?.email ?? ''} onPress={() => router.push('/profile-edit')} />
        <Divider />
        <Row icon={KeyRound} iconColor={theme.colors.info} title="Change password" onPress={() => router.push('/change-password')} />
      </Section>

      <Section title="Notifications">
        <Row icon={Bell} iconColor={theme.colors.food} title="Smart alerts" subtitle="Manage what we notify you about" onPress={() => router.push('/alerts')} />
      </Section>

      <Section title="Preferences">
        <Row
          icon={Ruler}
          title="Metric units"
          subtitle={metricUnits ? 'cm · kg · g' : 'in · lb · oz'}
          right={<Switch value={metricUnits} onValueChange={() => toggle('metricUnits')} trackColor={switchTrack} thumbColor="#fff" />}
        />
      </Section>

      {isAdmin ? (
        <Section title="Admin">
          <Row icon={ShieldCheck} iconColor={theme.colors.brandStrong} title="Admin panel" subtitle="Manage products & users" onPress={() => router.push('/admin/index')} />
        </Section>
      ) : null}

      <Section title="Data & privacy">
        <Row
          icon={Trash2}
          title="Clear scan history"
          subtitle="Delete all your scans"
          danger
          onPress={confirmClear}
        />
        <Text variant="caption" color={theme.colors.textMuted} style={styles.privacyNote}>
          Your scans and profile are stored to power history and reports. You can delete them anytime (DPDP).
        </Text>
      </Section>

      <Section title="About">
        <Row icon={Info} title="Version" right={<Text variant="body" color={theme.colors.textMuted}>0.1.0 (dev)</Text>} />
      </Section>

      <Row icon={LogOut} title="Log out" danger onPress={() => signOut()} />
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text variant="overline" color={theme.colors.textMuted} style={styles.sectionTitle}>{title}</Text>
      <Card style={styles.card}>{children}</Card>
    </View>
  );
}

const Divider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  section: { marginBottom: theme.spacing[5] },
  sectionTitle: { marginBottom: theme.spacing[2], marginLeft: theme.spacing[1] },
  card: { paddingVertical: theme.spacing[1] },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: theme.colors.borderSubtle, marginLeft: 50 },
  privacyNote: { marginTop: theme.spacing[2], marginHorizontal: theme.spacing[1] },
});
