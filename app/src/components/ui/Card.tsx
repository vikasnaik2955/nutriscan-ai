import { StyleSheet, View, type ViewStyle } from 'react-native';
import { theme } from '@/theme';

interface CardProps {
  children: React.ReactNode;
  /** Optional 4px left accent bar (e.g. a health-band color). */
  accent?: string;
  style?: ViewStyle;
}

export function Card({ children, accent, style }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        theme.shadow.sm,
        accent ? { borderLeftWidth: 4, borderLeftColor: accent } : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surfaceCard,
    borderRadius: theme.radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.borderSubtle,
    padding: theme.spacing[4],
  },
});
