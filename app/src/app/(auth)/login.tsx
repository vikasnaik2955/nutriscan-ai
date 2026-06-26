import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Leaf } from 'lucide-react-native';
import { Button, Input, Screen, Text } from '@/components/ui';
import { useLogin } from '@/hooks/useAuth';
import { ApiError } from '@/lib/api/client';
import { MOCK_AUTH } from '@/config/env';
import { theme } from '@/theme';

export default function Login() {
  const router = useRouter();
  const login = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errs: typeof fieldErrors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Enter a valid email address';
    if (password.length < 8) errs.password = 'Password must be at least 8 characters';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onSubmit = () => {
    if (!validate()) return;
    // On success the auth store flips to authenticated and the gate redirects to (tabs).
    login.mutate({ email: email.trim(), password });
  };

  const serverMessage = login.error instanceof ApiError ? login.error.message : null;

  return (
    <Screen>
      <View style={styles.brand}>
        <View style={styles.mark}>
          <Leaf size={28} color={theme.colors.brandOn} strokeWidth={2.25} />
        </View>
        <Text variant="h1" style={styles.title}>Welcome back</Text>
        <Text variant="lg" color={theme.colors.textSecondary}>Log in to keep scanning smarter.</Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Email"
          placeholder="you@example.com"
          keyboardType="email-address"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
          error={fieldErrors.email}
        />
        <Input
          label="Password"
          placeholder="Your password"
          password
          value={password}
          onChangeText={setPassword}
          error={fieldErrors.password}
        />

        {serverMessage ? (
          <Text variant="sm" color={theme.colors.error}>{serverMessage}</Text>
        ) : null}

        <Button label="Log in" onPress={onSubmit} loading={login.isPending} style={styles.cta} />

        {MOCK_AUTH ? (
          <Text variant="caption" center color={theme.colors.textMuted}>
            Dev mode · any email + 8-char password signs you in (no backend)
          </Text>
        ) : null}
      </View>

      <View style={styles.footer}>
        <Text variant="body" color={theme.colors.textSecondary}>New here? </Text>
        <Link href="/(auth)/register" replace>
          <Text variant="body" weight="bold" color={theme.colors.textLink}>Create an account</Text>
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  brand: { gap: theme.spacing[2], marginTop: theme.spacing[6], marginBottom: theme.spacing[8] },
  mark: {
    width: 56, height: 56, borderRadius: theme.radius.lg, backgroundColor: theme.colors.brand,
    alignItems: 'center', justifyContent: 'center', marginBottom: theme.spacing[4], ...theme.shadow.brand,
  },
  title: { marginTop: theme.spacing[1] },
  form: { gap: theme.spacing[4] },
  cta: { marginTop: theme.spacing[2] },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: theme.spacing[6] },
});
