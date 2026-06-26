import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Settings, UserPen, ShieldCheck, LogOut } from 'lucide-react-native';
import { Button, Card, Screen, Text } from '@/components/ui';
import { Row } from '@/components/Row';
import { useAuthStore } from '@/store/authStore';
import { theme } from '@/theme';

export default function Profile() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const isAdmin = user?.role === 'ADMIN';

  const initials = (user?.displayName ?? user?.email ?? '?')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <Screen>
      <View style={styles.head}>
        <View style={styles.avatar}>
          <Text variant="h2" color={theme.colors.brandStrong}>{initials}</Text>
        </View>
        <Text variant="h2">{user?.displayName ?? 'Your profile'}</Text>
        <Text variant="body" color={theme.colors.textSecondary}>{user?.email ?? ''}</Text>
      </View>

      <Card style={styles.menu}>
        <Row icon={UserPen} iconColor={theme.colors.brand} title="Edit profile" onPress={() => router.push('/profile-edit')} />
        <Divider />
        <Row icon={Settings} title="Settings" onPress={() => router.push('/settings')} />
        {isAdmin ? (
          <>
            <Divider />
            <Row icon={ShieldCheck} iconColor={theme.colors.brandStrong} title="Admin panel" onPress={() => router.push('/admin/index')} />
          </>
        ) : null}
      </Card>

      <Button
        label="Log out"
        variant="secondary"
        onPress={() => signOut()}
        leftIcon={<LogOut size={18} color={theme.colors.textPrimary} />}
        style={styles.logout}
      />
    </Screen>
  );
}

const Divider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  head: { alignItems: 'center', gap: theme.spacing[1], marginTop: theme.spacing[4], marginBottom: theme.spacing[6] },
  avatar: {
    width: 88, height: 88, borderRadius: theme.radius.full, backgroundColor: theme.colors.brandSoft,
    alignItems: 'center', justifyContent: 'center', marginBottom: theme.spacing[3],
  },
  menu: { paddingVertical: theme.spacing[1], paddingHorizontal: theme.spacing[2] },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: theme.colors.borderSubtle, marginLeft: 50 },
  logout: { marginTop: theme.spacing[6] },
});
