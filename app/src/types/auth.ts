/** Auth DTOs — mirror the backend contract built in BUILD #2 (com.nutriscan auth). */

export type Role = 'USER' | 'ADMIN';

export interface AuthUser {
  id: number;
  email: string;
  displayName: string | null;
  role: Role;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

/** POST /api/auth/login and /register return the token + the user. */
export interface AuthResponse {
  token: string;
  user: AuthUser;
}
