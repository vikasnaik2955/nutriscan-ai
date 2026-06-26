import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Input, Screen, Text } from '@/components/ui';
import { useUpdateProfile } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { useBodyStore } from '@/store/bodyStore';
import { theme } from '@/theme';

export default function ProfileEdit() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const update = useUpdateProfile();

  const body = useBodyStore();
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [height, setHeight] = useState(String(body.heightCm));
  const [weight, setWeight] = useState(String(body.weightKg));
  const [errs, setErrs] = useState<{ displayName?: string; email?: string }>({});

  const onSave = () => {
    const e: typeof errs = {};
    if (displayName.trim().length < 2) e.displayName = 'Enter your name';
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email';
    setErrs(e);
    if (Object.keys(e).length) return;

    // Body metrics are local (mock); persist immediately.
    const h = parseFloat(height); if (h > 0) body.setHeight(h);
    const w = parseFloat(weight); if (w > 0) body.setWeight(w);

    update.mutate(
      { displayName: displayName.trim(), email: email.trim() },
      { onSuccess: () => router.back() },
    );
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="h1">Edit profile</Text>
        <Text variant="lg" color={theme.colors.textSecondary}>Update your details.</Text>
      </View>

      <View style={styles.form}>
        <Input label="Name" value={displayName} onChangeText={setDisplayName} autoCapitalize="words" error={errs.displayName} />
        <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" error={errs.email} />

        <Card style={styles.metrics}>
          <Text variant="overline" color={theme.colors.textMuted}>Body metrics (for BMI & calories)</Text>
          <View style={styles.metricsRow}>
            <Input label="Height (cm)" keyboardType="numeric" value={height} onChangeText={setHeight} containerStyle={styles.flex} />
            <Input label="Weight (kg)" keyboardType="numeric" value={weight} onChangeText={setWeight} containerStyle={styles.flex} />
          </View>
        </Card>

        <Button label="Save changes" onPress={onSave} loading={update.isPending} style={styles.cta} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { gap: 2, marginBottom: theme.spacing[5] },
  form: { gap: theme.spacing[4] },
  metrics: { gap: theme.spacing[3] },
  metricsRow: { flexDirection: 'row', gap: theme.spacing[3] },
  cta: { marginTop: theme.spacing[2] },
});
