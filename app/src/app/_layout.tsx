import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';

import { queryClient } from '@/lib/api/queryClient';
import { useAuthStore } from '@/store/authStore';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const hydrate = useAuthStore((s) => s.hydrate);
  const status = useAuthStore((s) => s.status);

  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  // Load any persisted session once on startup.
  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const ready = fontsLoaded && status !== 'loading';

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null; // native splash stays visible

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="result/[id]"
              options={{ headerShown: true, title: 'Scan result', headerBackTitle: 'Back', headerTintColor: '#178049' }}
            />
            <Stack.Screen name="recommendations" options={{ headerShown: true, title: 'Recommendations', headerBackTitle: 'Back', headerTintColor: '#178049' }} />
            <Stack.Screen name="bmi" options={{ headerShown: true, title: 'BMI calculator', headerBackTitle: 'Back', headerTintColor: '#178049' }} />
            <Stack.Screen name="calorie" options={{ headerShown: true, title: 'Calorie tracker', headerBackTitle: 'Back', headerTintColor: '#178049' }} />
            <Stack.Screen name="profile-edit" options={{ headerShown: true, title: 'Edit profile', headerBackTitle: 'Back', headerTintColor: '#178049' }} />
            <Stack.Screen name="change-password" options={{ headerShown: true, title: 'Change password', headerBackTitle: 'Back', headerTintColor: '#178049' }} />
            <Stack.Screen name="alerts" options={{ headerShown: true, title: 'Smart alerts', headerBackTitle: 'Back', headerTintColor: '#178049' }} />
            <Stack.Screen name="admin" options={{ headerShown: false }} />
            <Stack.Screen name="settings" options={{ headerShown: true, title: 'Settings' }} />
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
