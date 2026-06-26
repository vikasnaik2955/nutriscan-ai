import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * JWT persistence. Uses the OS keystore (Keychain / Keystore) via expo-secure-store
 * on device; falls back to localStorage on web where SecureStore is unavailable.
 *
 * DPDP note: the auth token is a credential — keep it in secure storage, never in
 * plain AsyncStorage, and clear it on sign-out.
 */
const KEY = 'nutriscan.jwt';

const webStore = {
  getItem: async (k: string) =>
    (typeof localStorage !== 'undefined' ? localStorage.getItem(k) : null),
  setItem: async (k: string, v: string) => {
    if (typeof localStorage !== 'undefined') localStorage.setItem(k, v);
  },
  removeItem: async (k: string) => {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(k);
  },
};

const isWeb = Platform.OS === 'web';

export const tokenStorage = {
  async get(): Promise<string | null> {
    return isWeb ? webStore.getItem(KEY) : SecureStore.getItemAsync(KEY);
  },
  async set(token: string): Promise<void> {
    if (isWeb) await webStore.setItem(KEY, token);
    else await SecureStore.setItemAsync(KEY, token);
  },
  async clear(): Promise<void> {
    if (isWeb) await webStore.removeItem(KEY);
    else await SecureStore.deleteItemAsync(KEY);
  },
};
