import {
  KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, type ViewStyle,
} from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { theme } from '@/theme';

interface ScreenProps {
  children: React.ReactNode;
  /** Wrap content in a ScrollView (default true). */
  scroll?: boolean;
  /** Apply the standard 20px horizontal content padding (default true). */
  padded?: boolean;
  edges?: readonly Edge[];
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

/** Page shell: safe-area, warm page background, keyboard avoidance, optional scroll. */
export function Screen({
  children, scroll = true, padded = true, edges = ['top', 'bottom'], style, contentContainerStyle,
}: ScreenProps) {
  const pad = padded ? { paddingHorizontal: theme.layout.contentPad } : null;

  const body = scroll ? (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.scrollContent, pad, contentContainerStyle]}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, pad, contentContainerStyle]}>{children}</View>
  );

  return (
    <SafeAreaView style={[styles.safe, style]} edges={edges}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {body}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.surfacePage },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingVertical: theme.spacing[5] },
});
