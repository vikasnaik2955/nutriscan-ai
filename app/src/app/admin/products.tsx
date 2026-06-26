import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Trash2, Plus, Package } from 'lucide-react-native';
import { Button, Card, Input, Screen, Text } from '@/components/ui';
import { useAdminProducts, useAddProduct, useRemoveProduct } from '@/hooks/useAdmin';
import { theme } from '@/theme';

export default function AdminProducts() {
  const { data: products, isLoading } = useAdminProducts();
  const add = useAddProduct();
  const remove = useRemoveProduct();

  const [barcode, setBarcode] = useState('');
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');

  const canAdd = barcode.trim().length >= 6 && name.trim().length > 0;
  const onAdd = () => {
    if (!canAdd) return;
    add.mutate({ barcode: barcode.trim(), name: name.trim(), brand: brand.trim() || '—' });
    setBarcode(''); setName(''); setBrand('');
  };

  return (
    <Screen scroll={false}>
      <Card style={styles.addCard}>
        <Text variant="overline" color={theme.colors.textMuted}>Add product</Text>
        <Input placeholder="Barcode" keyboardType="number-pad" value={barcode} onChangeText={setBarcode} />
        <View style={styles.row}>
          <Input placeholder="Name" value={name} onChangeText={setName} containerStyle={styles.flex} />
          <Input placeholder="Brand" value={brand} onChangeText={setBrand} containerStyle={styles.flex} />
        </View>
        <Button label="Add product" onPress={onAdd} disabled={!canAdd} loading={add.isPending} leftIcon={<Plus size={18} color={theme.colors.brandOn} />} />
      </Card>

      {isLoading || !products ? (
        <View style={styles.fill}><ActivityIndicator color={theme.colors.brand} /></View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(p) => String(p.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListHeaderComponent={<Text variant="overline" color={theme.colors.textMuted} style={styles.listLabel}>{products.length} products</Text>}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={styles.itemIcon}><Package size={18} color={theme.colors.food} /></View>
              <View style={styles.flex}>
                <Text variant="body" weight="semibold" numberOfLines={1}>{item.name}</Text>
                <Text variant="caption" color={theme.colors.textMuted}>{item.brand} · {item.barcode}</Text>
              </View>
              <Pressable onPress={() => remove.mutate(item.id)} hitSlop={8}>
                <Trash2 size={18} color={theme.colors.textMuted} />
              </Pressable>
            </View>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  fill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  addCard: { gap: theme.spacing[3], marginBottom: theme.spacing[4] },
  row: { flexDirection: 'row', gap: theme.spacing[2] },
  list: { paddingBottom: theme.spacing[8] },
  listLabel: { marginBottom: theme.spacing[2] },
  sep: { height: theme.spacing[2] },
  item: {
    flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3],
    backgroundColor: theme.colors.surfaceCard, borderRadius: theme.radius.md,
    borderWidth: StyleSheet.hairlineWidth, borderColor: theme.colors.borderSubtle, padding: theme.spacing[3],
  },
  itemIcon: { width: 38, height: 38, borderRadius: theme.radius.md, backgroundColor: theme.colors.foodSoft, alignItems: 'center', justifyContent: 'center' },
});
