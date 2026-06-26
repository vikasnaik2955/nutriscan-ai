import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';
import { Button, Input, Screen, Text } from '@/components/ui';
import { useRegister } from '@/hooks/useAuth';
import { ApiError } from '@/lib/api/client';
import { theme } from '@/theme';

export default function Register() {
  const register = useRegister();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errs, setErrs] = useState<{ displayName?: string; email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errs = {};
    if (displayName.trim().length < 2) e.displayName = 'Tell us your name';
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email address';
    if (password.length < 8) e.password = 'Use at least 8 characters';
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = () => {
    if (!validate()) return;
    register.mutate({ displayName: displayName.trim(), email: email.trim(), password });
  };

  // Surface a per-field server error (e.g. email already taken) under the right input.
  const serverFieldErr = (field: string) =>
    register.error instanceof ApiError
      ? register.error.details?.find((d) => d.field === field)?.message
      : undefined;
  const serverMessage =
    register.error instanceof ApiError && !register.error.details?.length ? register.error.message : null;

  return (
    <Screen>
      <View style={styles.head}>
        <Text variant="h1">Create your account</Text>
        <Text variant="lg" color={theme.colors.textSecondary}>Start eating a little smarter today.</Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Name"
          placeholder="Your name"
          autoCapitalize="words"
          value={displayName}
          onChangeText={setDisplayName}
          error={errs.displayName ?? serverFieldErr('displayName')}
        />
        <Input
          label="Email"
          placeholder="you@example.com"
          keyboardType="email-address"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
          error={errs.email ?? serverFieldErr('email')}
        />
        <Input
          label="Password"
          placeholder="At least 8 characters"
          password
          value={password}
          onChangeText={setPassword}
          error={errs.password ?? serverFieldErr('password')}
        />

        {serverMessage ? <Text variant="sm" color={theme.colors.error}>{serverMessage}</Text> : null}

        <Button label="Create account" onPress={onSubmit} loading={register.isPending} style={styles.cta} />

        <Text variant="caption" center color={theme.colors.textMuted} style={styles.legal}>
          By continuing you agree we may store your scans to power your history and reports.
          You can delete them anytime.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text variant="body" color={theme.colors.textSecondary}>Already have an account? </Text>
        <Link href="/(auth)/login" replace>
          <Text variant="body" weight="bold" color={theme.colors.textLink}>Log in</Text>
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { gap: theme.spacing[2], marginTop: theme.spacing[5], marginBottom: theme.spacing[6] },
  form: { gap: theme.spacing[4] },
  cta: { marginTop: theme.spacing[2] },
  legal: { marginTop: theme.spacing[1], paddingHorizontal: theme.spacing[4] },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: theme.spacing[6] },
});
