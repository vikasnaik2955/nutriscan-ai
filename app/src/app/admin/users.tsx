import { ActivityIndicator, FlatList, StyleSheet, Switch, View } from 'react-native';
import { Screen, Text } from '@/components/ui';
import { useAdminUsers, useToggleUser } from '@/hooks/useAdmin';
import { theme } from '@/theme';

export default function AdminUsers() {
  const { data: users, isLoading } = useAdminUsers();
  const toggle = useToggleUser();

  if (isLoading || !users) {
    return <Screen><View style={styles.fill}><ActivityIndicator color={theme.colors.brand} /></View></Screen>;
  }

  const switchTrack = { false: theme.colors.borderStrong, true: theme.colors.brand };

  return (
    <Screen scroll={false}>
      <FlatList
        data={users}
        keyExtractor={(u) => String(u.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<Text variant="overline" color={theme.colors.textMuted} style={styles.label}>{users.length} users</Text>}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        renderItem={({ item }) => {
          const initials = item.displayName.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
          const isAdmin = item.role === 'ADMIN';
          return (
            <View style={styles.item}>
              <View style={styles.avatar}><Text variant="body" weight="bold" color={theme.colors.brandStrong}>{initials}</Text></View>
              <View style={styles.flex}>
                <View style={styles.nameRow}>
                  <Text variant="body" weight="semibold" numberOfLines={1}>{item.displayName}</Text>
                  {isAdmin ? (
                    <View style={styles.adminBadge}><Text variant="overline" color={theme.colors.brandStrong}>ADMIN</Text></View>
                  ) : null}
                </View>
                <Text variant="caption" color={theme.colors.textMuted} numberOfLines={1}>{item.email} · {item.scanCount} scans</Text>
              </View>
              <Switch
                value={item.enabled}
                onValueChange={() => toggle.mutate(item.id)}
                trackColor={switchTrack}
                thumbColor="#fff"
              />
            </View>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  fill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { paddingVertical: theme.spacing[2], paddingBottom: theme.spacing[8] },
  label: { marginBottom: theme.spacing[2] },
  sep: { height: theme.spacing[2] },
  item: {
    flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3],
    backgroundColor: theme.colors.surfaceCard, borderRadius: theme.radius.md,
    borderWidth: StyleSheet.hairlineWidth, borderColor: theme.colors.borderSubtle, padding: theme.spacing[3],
  },
  avatar: { width: 40, height: 40, borderRadius: theme.radius.full, backgroundColor: theme.colors.brandSoft, alignItems: 'center', justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[2] },
  adminBadge: { paddingHorizontal: theme.spacing[2], paddingVertical: 2, borderRadius: theme.radius.full, backgroundColor: theme.colors.brandSoft },
});
