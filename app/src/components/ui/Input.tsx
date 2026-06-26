import { useState } from 'react';
import {
  Pressable, StyleSheet, TextInput, View, type TextInputProps, type ViewStyle,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { theme } from '@/theme';
import { Text } from './Text';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  /** Shows a show/hide toggle and starts masked. */
  password?: boolean;
  containerStyle?: ViewStyle;
}

export function Input({ label, error, password = false, containerStyle, ...rest }: InputProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(password);

  const borderColor = error
    ? theme.colors.error
    : focused
      ? theme.colors.borderBrand
      : theme.colors.borderStrong;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text variant="sm" weight="semibold" color={theme.colors.textSecondary} style={styles.label}>
          {label}
        </Text>
      ) : null}
      <View style={[styles.field, { borderColor }]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={theme.colors.textMuted}
          secureTextEntry={hidden}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoCapitalize="none"
          {...rest}
        />
        {password ? (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10} accessibilityLabel={hidden ? 'Show password' : 'Hide password'}>
            {hidden ? <EyeOff size={20} color={theme.colors.textMuted} /> : <Eye size={20} color={theme.colors.textMuted} />}
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text variant="caption" color={theme.colors.error} style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing[2] },
  label: { marginLeft: theme.spacing[1] },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
    minHeight: 52,
    paddingHorizontal: theme.spacing[4],
    borderWidth: 1.5,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceCard,
  },
  input: {
    flex: 1,
    fontFamily: theme.fontFamily.medium,
    fontSize: theme.fontSize.body,
    color: theme.colors.textPrimary,
    paddingVertical: theme.spacing[3],
  },
  error: { marginLeft: theme.spacing[1] },
});
