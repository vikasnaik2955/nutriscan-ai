import { Platform } from 'react-native';

/**
 * Backend base URL.
 *
 * Override per environment via the EXPO_PUBLIC_API_URL env var (Expo inlines any
 * EXPO_PUBLIC_* variable at build time). The platform-aware fallback points at a
 * locally-running Spring Boot backend:
 *   - Android emulator reaches the host machine at 10.0.2.2 (NOT localhost)
 *   - iOS simulator / web reach it at localhost
 *   - On a physical device, set EXPO_PUBLIC_API_URL to your machine's LAN IP, e.g.
 *     EXPO_PUBLIC_API_URL=http://192.168.1.5:8080
 */
const fallbackHost = Platform.select({
  android: 'http://10.0.2.2:8080',
  ios: 'http://localhost:8080',
  default: 'http://localhost:8080',
});

const root = process.env.EXPO_PUBLIC_API_URL ?? fallbackHost;

export const API_BASE_URL = `${root}/api`;

/**
 * Dev-only mock auth. When on, login/register succeed locally with a fake user so you can
 * walk the app before the backend exists. Defaults ON in development, OFF in production
 * builds. Force it off (to hit a real backend in dev) with EXPO_PUBLIC_MOCK_AUTH=false.
 */
export const MOCK_AUTH =
  (process.env.EXPO_PUBLIC_MOCK_AUTH ?? (__DEV__ ? 'true' : 'false')) === 'true';
