import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

/**
 * Auth gate. The root layout holds the splash until the session is hydrated, so by the
 * time this renders `status` is resolved: route into the app or out to onboarding.
 */
export default function Index() {
  const status = useAuthStore((s) => s.status);

  if (status === 'authenticated') return <Redirect href="/(tabs)" />;
  return <Redirect href="/(auth)/onboarding" />;
}
