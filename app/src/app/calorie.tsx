import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { Trash2, Plus } from 'lucide-react-native';
import { Button, Card, Input, Screen, Text } from '@/components/ui';
import { ProgressBar } from '@/components/ProgressBar';
import { useCalorieDay, useAddCalorie, useRemoveCalorie, useSetCalorieGoal } from '@/hooks/useCalories';
import type { MealType } from '@/lib/api/mockCalories';
import { theme } from '@/theme';

const MEALS: MealType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

export default function Calorie() {
  const { data: day, isLoading } = useCalorieDay();
  const add = useAddCalorie();
  const remove = useRemoveCalorie();
  const setGoal = useSetCalorieGoal();

  const [name, setName] = useState('');
  const [kcal, setKcal] = useState('');
  const [meal, setMeal] = useState<MealType>('Snack');
  const [goalText, setGoalText] = useState('');

  if (isLoading || !day) {
    return <Screen><View style={styles.fill}><ActivityIndicator color={theme.colors.brand} /></View></Screen>;
  }

  const remaining = day.goal - day.total;
  const over = remaining < 0;
  const barColor = over ? theme.colors.error : theme.colors.brand;

  const canAdd = name.trim().length > 0 && parseInt(kcal, 10) > 0;
  const onAdd = () => {
    if (!canAdd) return;
    add.mutate({ name: name.trim(), kcal: parseInt(kcal, 10), meal });
    setName(''); setKcal('');
  };

  const onSetGoal = () => {
    const g = parseInt(goalText, 10);
    if (g > 0) { setGoal.mutate(g); setGoalText(''); }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="h1">Calorie tracker</Text>
        <Text variant="lg" color={theme.colors.textSecondary}>Today’s intake against your goal.</Text>
      </View>

      {/* Summary */}
      <Card style={styles.summary}>
        <View style={styles.summaryTop}>
          <View>
            <Text variant="display" weight="extra" color={barColor}>{day.total}</Text>
            <Text variant="sm" color={theme.colors.textMuted}>of {day.goal} kcal</Text>
          </View>
          <View style={styles.remaining}>
            <Text variant="h3" weight="bold" color={over ? theme.colors.error : theme.colors.textPrimary}>
              {Math.abs(remaining)}
            </Text>
            <Text variant="caption" color={theme.colors.textMuted}>{over ? 'over' : 'left'}</Text>
          </View>
        </View>
        <ProgressBar value={day.total} max={day.goal} color={barColor} />

        <View style={styles.goalRow}>
          <Input
            placeholder={`Set daily goal (now ${day.goal})`}
            keyboardType="number-pad"
            value={goalText}
            onChangeText={setGoalText}
            containerStyle={styles.flex}
          />
          <Button label="Set" size="md" fullWidth={false} disabled={!parseInt(goalText, 10)} loading={setGoal.isPending} onPress={onSetGoal} />
        </View>
      </Card>

      {/* Add entry */}
      <Card style={styles.addCard}>
        <Text variant="overline" color={theme.colors.textMuted}>Add a meal</Text>
        <Input placeholder="What did you eat?" value={name} onChangeText={setName} autoCapitalize="sentences" />
        <View style={styles.addRow}>
          <Input placeholder="kcal" keyboardType="number-pad" value={kcal} onChangeText={setKcal} containerStyle={styles.kcalInput} />
          <View style={styles.meals}>
            {MEALS.map((m) => {
              const active = m === meal;
              return (
                <Pressable key={m} onPress={() => setMeal(m)} style={[styles.mealChip, active && styles.mealChipActive]}>
                  <Text variant="caption" weight="semibold" color={active ? theme.colors.brandOn : theme.colors.textSecondary}>{m}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        <Button
          label="Add"
          onPress={onAdd}
          disabled={!canAdd}
          loading={add.isPending}
          leftIcon={<Plus size={18} color={theme.colors.brandOn} />}
        />
      </Card>

      {/* Today's entries */}
      <Text variant="overline" color={theme.colors.textMuted} style={styles.logLabel}>Today</Text>
      {day.entries.length === 0 ? (
        <Text variant="body" color={theme.colors.textMuted}>No meals logged yet.</Text>
      ) : (
        <View style={styles.log}>
          {day.entries.map((e) => (
            <View key={e.id} style={styles.entry}>
              <View style={styles.flex}>
                <Text variant="body" weight="semibold">{e.name}</Text>
                <Text variant="caption" color={theme.colors.textMuted}>{e.meal}</Text>
              </View>
              <Text variant="body" weight="bold">{e.kcal}</Text>
              <Pressable onPress={() => remove.mutate(e.id)} hitSlop={8}>
                <Trash2 size={18} color={theme.colors.textMuted} />
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
  header: { gap: 2, marginBottom: theme.spacing[5] },
  summary: { gap: theme.spacing[4], marginBottom: theme.spacing[4] },
  summaryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  remaining: { alignItems: 'flex-end' },
  goalRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[2] },
  addCard: { gap: theme.spacing[3], marginBottom: theme.spacing[4] },
  addRow: { flexDirection: 'row', gap: theme.spacing[2], alignItems: 'center' },
  kcalInput: { width: 96 },
  meals: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[1], justifyContent: 'flex-end' },
  mealChip: {
    paddingHorizontal: theme.spacing[3], paddingVertical: theme.spacing[2],
    borderRadius: theme.radius.full, backgroundColor: theme.colors.surfaceSunken,
  },
  mealChipActive: { backgroundColor: theme.colors.brand },
  logLabel: { marginBottom: theme.spacing[2] },
  log: { gap: theme.spacing[2] },
  entry: {
    flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3],
    backgroundColor: theme.colors.surfaceCard, borderRadius: theme.radius.md,
    borderWidth: StyleSheet.hairlineWidth, borderColor: theme.colors.borderSubtle, padding: theme.spacing[3],
  },
});
