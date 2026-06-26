import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth';
import { profileApi, type ChangePasswordRequest, type UpdateProfileRequest } from '@/lib/api/profile';
import { useAuthStore } from '@/store/authStore';
import type { LoginRequest, RegisterRequest } from '@/types/auth';

/** Log in, persist the session, and let the gate redirect into the app. */
export function useLogin() {
  const signIn = useAuthStore((s) => s.signIn);
  return useMutation({
    mutationFn: (req: LoginRequest) => authApi.login(req),
    onSuccess: (res) => signIn(res),
  });
}

/** Register a new account, then sign in with the returned token. */
export function useRegister() {
  const signIn = useAuthStore((s) => s.signIn);
  return useMutation({
    mutationFn: (req: RegisterRequest) => authApi.register(req),
    onSuccess: (res) => signIn(res),
  });
}

/** Edit display name / email; updates the cached user on success. */
export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: (req: UpdateProfileRequest) => profileApi.update(req),
    onSuccess: (user) => setUser(user),
  });
}

/** Change password. */
export function useChangePassword() {
  return useMutation({
    mutationFn: (req: ChangePasswordRequest) => profileApi.changePassword(req),
  });
}
