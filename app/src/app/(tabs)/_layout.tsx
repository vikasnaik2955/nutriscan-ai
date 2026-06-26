import { Redirect, Tabs } from 'expo-router';
import { House, ScanLine, History, ChartColumn, User } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { theme } from '@/theme';

export default function TabsLayout() {
  const status = useAuthStore((s) => s.status);

  // Guard the app area: unauthenticated users go back to the auth flow.
  if (status !== 'authenticated') return <Redirect href="/(auth)/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.brand,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          height: theme.layout.bottomNavHeight + 16,
          paddingTop: 6,
          paddingBottom: 10,
          backgroundColor: theme.colors.surfaceCard,
          borderTopColor: theme.colors.borderSubtle,
        },
        tabBarLabelStyle: { fontFamily: theme.fontFamily.semibold, fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', tabBarIcon: ({ color, size }) => <House color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="history"
        options={{ title: 'History', tabBarIcon: ({ color, size }) => <History color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="scan"
        options={{ title: 'Scan', tabBarIcon: ({ color, size }) => <ScanLine color={color} size={size + 2} /> }}
      />
      <Tabs.Screen
        name="reports"
        options={{ title: 'Reports', tabBarIcon: ({ color, size }) => <ChartColumn color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }}
      />
    </Tabs>
  );
}
