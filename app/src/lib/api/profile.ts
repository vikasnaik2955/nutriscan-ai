import { apiRequest } from './client';
import { MOCK_AUTH } from '@/config/env';
import { mockChangePassword, mockUpdateProfile } from './mockAuth';
import type { AuthUser } from '@/types/auth';

export interface UpdateProfileRequest {
  displayName: string;
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/** Profile + credential endpoints (full-scope; mock-gated like the rest). */
export const profileApi = {
  update: (req: UpdateProfileRequest) =>
    MOCK_AUTH ? mockUpdateProfile(req) : apiRequest<AuthUser>('/auth/me', { method: 'PUT', body: req }),

  changePassword: (req: ChangePasswordRequest) =>
    MOCK_AUTH ? mockChangePassword() : apiRequest<void>('/auth/change-password', { method: 'POST', body: req }),
};
