import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './client';

/**
 * Shared TanStack Query client. Tuned for the Indian market: conservative refetching
 * to keep payloads/data usage down, and no retries on 4xx (those are deterministic).
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false;
        return failureCount < 2;
      },
    },
    mutations: { retry: false },
  },
});
