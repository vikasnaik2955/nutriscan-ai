import { create } from 'zustand';
import { setAuthToken, setUnauthorizedHandler } from '@/lib/api/client';
import { tokenStorage } from '@/lib/storage/tokenStorage';
import type { AuthResponse, AuthUser } from '@/types/auth';

type Status = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  status: Status;
  token: string | null;
  user: AuthUser | null;
  /** Load any persisted token on app start. Call once from the root layout. */
  hydrate: () => Promise<void>;
  /** Persist a successful login/register and flip to authenticated. */
  signIn: (res: AuthResponse) => Promise<void>;
  /** Update the cached user (e.g. after GET /auth/me or a profile edit). */
  setUser: (user: AuthUser) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'loading',
  token: null,
  user: null,

  hydrate: async () => {
    const token = await tokenStorage.get();
    setAuthToken(token);
    set({ token, status: token ? 'authenticated' : 'unauthenticated' });
  },

  signIn: async ({ token, user }) => {
    await tokenStorage.set(token);
    setAuthToken(token);
    set({ token, user, status: 'authenticated' });
  },

  setUser: (user) => set({ user }),

  signOut: async () => {
    await tokenStorage.clear();
    setAuthToken(null);
    set({ token: null, user: null, status: 'unauthenticated' });
  },
}));

// On any 401 from the API, drop the session so the gate routes back to auth.
setUnauthorizedHandler(() => {
  void useAuthStore.getState().signOut();
});
