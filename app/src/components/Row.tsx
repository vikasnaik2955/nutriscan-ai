import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronRight, type LucideIcon } from 'lucide-react-native';
import { Text } from '@/components/ui';
import { theme } from '@/theme';

interface RowProps {
  icon?: LucideIcon;
  iconColor?: string;
  title: string;
  subtitle?: string;
  /** Custom right-hand element (e.g. a Switch). Defaults to a chevron when onPress is set. */
  right?: React.ReactNode;
  onPress?: () => void;
  danger?: boolean;
}

/** Standard list row used across Settings / Alerts. */
export function Row({ icon: Icon, iconColor, title, subtitle, right, onPress, danger }: RowProps) {
  const color = danger ? theme.colors.error : theme.colors.textPrimary;
  const content = (
    <View style={styles.row}>
      {Icon ? (
        <View style={[styles.icon, { backgroundColor: (iconColor ?? theme.colors.textSecondary) + '1A' }]}>
          <Icon size={20} color={iconColor ?? (danger ? theme.colors.error : theme.colors.textSecondary)} />
        </View>
      ) : null}
      <View style={styles.flex}>
        <Text variant="body" weight="semibold" color={color}>{title}</Text>
        {subtitle ? <Text variant="caption" color={theme.colors.textMuted}>{subtitle}</Text> : null}
      </View>
      {right ?? (onPress ? <ChevronRight size={18} color={theme.colors.textMuted} /> : null)}
    </View>
  );

  if (!onPress) return <View style={styles.wrap}>{content}</View>;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.wrap, pressed && styles.pressed]}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingVertical: theme.spacing[1] },
  pressed: { opacity: 0.6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3], paddingVertical: theme.spacing[2] },
  icon: { width: 38, height: 38, borderRadius: theme.radius.md, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
});
