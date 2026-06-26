import { ActivityIndicator, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { theme } from '@/theme';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  style?: ViewStyle;
}

const HEIGHT: Record<Size, number> = { md: 48, lg: 54 };

export function Button({
  label, onPress, variant = 'primary', size = 'lg',
  loading = false, disabled = false, fullWidth = true, leftIcon, style,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const palette = colorsFor(variant, isDisabled);

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        {
          height: HEIGHT[size],
          backgroundColor: palette.bg,
          borderColor: palette.border,
          borderWidth: variant === 'ghost' || variant === 'secondary' ? 1.5 : 0,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
        variant === 'primary' && !isDisabled && theme.shadow.brand,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.fg} />
      ) : (
        <View style={styles.row}>
          {leftIcon}
          <Text variant="lg" weight="bold" color={palette.fg}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

function colorsFor(variant: Variant, disabled: boolean): { bg: string; fg: string; border: string } {
  if (disabled) {
    return { bg: theme.colors.surfaceSunken, fg: theme.colors.textDisabled, border: theme.colors.borderSubtle };
  }
  switch (variant) {
    case 'primary':
      return { bg: theme.colors.brand, fg: theme.colors.brandOn, border: 'transparent' };
    case 'secondary':
      return { bg: theme.colors.surfaceCard, fg: theme.colors.textPrimary, border: theme.colors.borderStrong };
    case 'ghost':
      return { bg: theme.colors.brandSoft, fg: theme.colors.brandStrong, border: theme.colors.brandSoft };
    case 'danger':
      return { bg: theme.colors.error, fg: '#FFFFFF', border: 'transparent' };
  }
}

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing[5],
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[2] },
});
