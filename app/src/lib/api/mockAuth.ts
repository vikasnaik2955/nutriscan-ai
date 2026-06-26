import type { AuthResponse, AuthUser, LoginRequest, RegisterRequest } from '@/types/auth';

/**
 * Dev-only fake auth backend. Enabled via MOCK_AUTH (see config/env.ts). Returns a
 * realistic {@link AuthResponse} after a short delay so the UI flows exactly as it will
 * against the real API — only the network call is faked. Delete nothing when the backend
 * lands; just let MOCK_AUTH go false and authApi routes to the real endpoints.
 */
const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// Remembers the last "signed-in" user so mockMe() stays consistent within a session.
let lastUser: AuthUser = { id: 1, email: 'demo@nutriscan.app', displayName: 'Demo User', role: 'USER' };

function nameFromEmail(email: string): string {
  const handle = email.split('@')[0] || 'Demo';
  return handle.charAt(0).toUpperCase() + handle.slice(1);
}

export async function mockLogin(req: LoginRequest): Promise<AuthResponse> {
  await delay(600);
  lastUser = {
    id: 1,
    email: req.email,
    displayName: nameFromEmail(req.email),
    // Tip: use an email containing "admin" to exercise admin-only screens later.
    role: req.email.toLowerCase().includes('admin') ? 'ADMIN' : 'USER',
  };
  return { token: `mock.${Date.now()}`, user: lastUser };
}

export async function mockRegister(req: RegisterRequest): Promise<AuthResponse> {
  await delay(700);
  lastUser = { id: 1, email: req.email, displayName: req.displayName, role: 'USER' };
  return { token: `mock.${Date.now()}`, user: lastUser };
}

export async function mockMe(): Promise<AuthUser> {
  await delay(150);
  return lastUser;
}

export async function mockUpdateProfile(input: { displayName: string; email: string }): Promise<AuthUser> {
  await delay(500);
  lastUser = { ...lastUser, displayName: input.displayName, email: input.email };
  return lastUser;
}

export async function mockChangePassword(): Promise<void> {
  await delay(500);
  // Mock always succeeds; the real endpoint would verify the current password.
}
