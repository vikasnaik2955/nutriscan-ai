import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function AdminLayout() {
  const role = useAuthStore((s) => s.user?.role);

  // Admin-only area. Non-admins (or a reloaded session with no cached user) bounce home.
  if (role !== 'ADMIN') return <Redirect href="/(tabs)" />;

  return (
    <Stack screenOptions={{ headerTintColor: '#178049', headerBackTitle: 'Back' }}>
      <Stack.Screen name="index" options={{ title: 'Admin' }} />
      <Stack.Screen name="products" options={{ title: 'Products' }} />
      <Stack.Screen name="users" options={{ title: 'Users' }} />
    </Stack>
  );
}
