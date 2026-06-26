import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { History as HistoryIcon, ScanLine } from 'lucide-react-native';
import { Button, Screen, Text } from '@/components/ui';
import { ScanListItem } from '@/components/ScanListItem';
import { useScans } from '@/hooks/useScans';
import { theme } from '@/theme';

export default function History() {
  const router = useRouter();
  const { data: scans, isLoading, isRefetching, refetch } = useScans();

  if (isLoading) {
    return <Screen><View style={styles.fill}><ActivityIndicator color={theme.colors.brand} /></View></Screen>;
  }

  if (!scans || scans.length === 0) {
    return (
      <Screen>
        <View style={styles.fill}>
          <View style={styles.emptyIcon}><HistoryIcon size={44} color={theme.colors.brand} strokeWidth={1.75} /></View>
          <Text variant="h2" center>No scans yet</Text>
          <Text variant="lg" center color={theme.colors.textSecondary}>Scan your first product to start building your history.</Text>
          <Button
            label="Scan a product"
            onPress={() => router.push('/(tabs)/scan')}
            leftIcon={<ScanLine size={18} color={theme.colors.brandOn} />}
            fullWidth={false}
            style={styles.cta}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll={false}>
      <View style={styles.header}>
        <Text variant="h1">History</Text>
        <Text variant="lg" color={theme.colors.textSecondary}>{scans.length} {scans.length === 1 ? 'scan' : 'scans'}</Text>
      </View>
      <FlatList
        data={scans}
        keyExtractor={(s) => String(s.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={theme.colors.brand} />}
        renderItem={({ item }) => (
          <ScanListItem scan={item} onPress={() => router.push({ pathname: '/result/[id]', params: { id: item.id } })} />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: theme.spacing[3] },
  emptyIcon: {
    width: 96, height: 96, borderRadius: theme.radius.full, backgroundColor: theme.colors.brandSoft,
    alignItems: 'center', justifyContent: 'center', marginBottom: theme.spacing[2],
  },
  cta: { marginTop: theme.spacing[3] },
  header: { gap: 2, marginBottom: theme.spacing[4] },
  list: { paddingBottom: theme.spacing[8] },
  sep: { height: theme.spacing[3] },
});
