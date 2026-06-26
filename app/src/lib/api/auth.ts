import { apiRequest } from './client';
import { MOCK_AUTH } from '@/config/env';
import { mockLogin, mockMe, mockRegister } from './mockAuth';
import type { AuthResponse, AuthUser, LoginRequest, RegisterRequest } from '@/types/auth';

/**
 * Auth endpoints (backend BUILD #2). While MOCK_AUTH is on (dev, no backend) these resolve
 * locally via mockAuth; flip MOCK_AUTH off and the exact same calls hit the real API.
 */
export const authApi = {
  register: (req: RegisterRequest) =>
    MOCK_AUTH
      ? mockRegister(req)
      : apiRequest<AuthResponse>('/auth/register', { method: 'POST', body: req, anonymous: true }),

  login: (req: LoginRequest) =>
    MOCK_AUTH
      ? mockLogin(req)
      : apiRequest<AuthResponse>('/auth/login', { method: 'POST', body: req, anonymous: true }),

  me: () => (MOCK_AUTH ? mockMe() : apiRequest<AuthUser>('/auth/me')),
};
