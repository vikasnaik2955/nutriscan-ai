import { API_BASE_URL } from '@/config/env';

/** Mirrors the backend error envelope (com.nutriscan.common.error.ErrorResponse). */
export interface ApiErrorBody {
  timestamp: string;
  status: number;
  error: string;
  code: string;
  message: string;
  path: string;
  details?: { field: string; message: string }[];
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: { field: string; message: string }[];

  constructor(status: number, body: Partial<ApiErrorBody>) {
    super(body.message ?? `Request failed (${status})`);
    this.name = 'ApiError';
    this.status = status;
    this.code = body.code ?? 'UNKNOWN';
    this.details = body.details;
  }
}

// --- Auth wiring (set by the auth store; avoids a circular import) ---
let authToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export function setAuthToken(token: string | null): void {
  authToken = token;
}
export function setUnauthorizedHandler(handler: () => void): void {
  onUnauthorized = handler;
}

/** Max time to wait for the backend before failing fast (prevents an infinite spinner). */
const DEFAULT_TIMEOUT_MS = 12_000;

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  /** Skip the Authorization header (e.g. login/register). */
  anonymous?: boolean;
  signal?: AbortSignal;
  /** Override the request timeout in ms. */
  timeoutMs?: number;
}

/**
 * Typed JSON fetch wrapper. Adds the JWT, enforces a timeout, parses the error envelope
 * into {@link ApiError}, and triggers sign-out on 401. Returns `undefined` for 204/empty.
 */
export async function apiRequest<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, anonymous = false, signal, timeoutMs = DEFAULT_TIMEOUT_MS } = opts;

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (!anonymous && authToken) headers.Authorization = `Bearer ${authToken}`;

  // Abort the request if it exceeds the timeout, or if the caller's signal fires.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (e) {
    // Timeout or network failure (server down / unreachable) — normalize to ApiError so
    // the UI always resolves instead of spinning forever.
    const timedOut = (e as Error)?.name === 'AbortError';
    throw new ApiError(0, {
      code: timedOut ? 'TIMEOUT' : 'NETWORK_ERROR',
      message: timedOut
        ? 'The server took too long to respond. Is the backend running?'
        : 'Cannot reach the server. Make sure the backend is running.',
    });
  } finally {
    clearTimeout(timer);
  }

  if (res.status === 401 && !anonymous) {
    onUnauthorized?.();
  }

  if (!res.ok) {
    let parsed: Partial<ApiErrorBody> = {};
    try {
      parsed = (await res.json()) as ApiErrorBody;
    } catch {
      /* non-JSON error body */
    }
    throw new ApiError(res.status, parsed);
  }

  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
