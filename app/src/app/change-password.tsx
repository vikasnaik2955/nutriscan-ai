import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { CircleCheck } from 'lucide-react-native';
import { Button, Input, Screen, Text } from '@/components/ui';
import { useChangePassword } from '@/hooks/useAuth';
import { ApiError } from '@/lib/api/client';
import { theme } from '@/theme';

export default function ChangePassword() {
  const router = useRouter();
  const change = useChangePassword();

  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errs, setErrs] = useState<{ current?: string; next?: string; confirm?: string }>({});
  const [done, setDone] = useState(false);

  const onSubmit = () => {
    const e: typeof errs = {};
    if (current.length < 8) e.current = 'Enter your current password';
    if (next.length < 8) e.next = 'Use at least 8 characters';
    if (next !== confirm) e.confirm = 'Passwords don’t match';
    setErrs(e);
    if (Object.keys(e).length) return;

    change.mutate(
      { currentPassword: current, newPassword: next },
      { onSuccess: () => { setDone(true); setTimeout(() => router.back(), 900); } },
    );
  };

  const serverMessage = change.error instanceof ApiError ? change.error.message : null;

  if (done) {
    return (
      <Screen>
        <View style={styles.doneWrap}>
          <CircleCheck size={56} color={theme.colors.success} />
          <Text variant="h2" center>Password updated</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="h1">Change password</Text>
        <Text variant="lg" color={theme.colors.textSecondary}>Use at least 8 characters.</Text>
      </View>

      <View style={styles.form}>
        <Input label="Current password" password value={current} onChangeText={setCurrent} error={errs.current} />
        <Input label="New password" password value={next} onChangeText={setNext} error={errs.next} />
        <Input label="Confirm new password" password value={confirm} onChangeText={setConfirm} error={errs.confirm} />

        {serverMessage ? <Text variant="sm" color={theme.colors.error}>{serverMessage}</Text> : null}

        <Button label="Update password" onPress={onSubmit} loading={change.isPending} style={styles.cta} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: 2, marginBottom: theme.spacing[5] },
  form: { gap: theme.spacing[4] },
  cta: { marginTop: theme.spacing[2] },
  doneWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: theme.spacing[3] },
});
