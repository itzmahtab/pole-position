import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

// Creates a QueryClient tuned for tests (no retries, no stale refetches).
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
        staleTime: Infinity,
      },
    },
  });
}

export function createWrapper() {
  const client = createTestQueryClient();
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
  };
}

export function renderQueryHook<T>(
  hook: () => T,
  wrapper = createWrapper()
) {
  return renderHook(hook, { wrapper });
}

export function jsonResponse(data: unknown) {
  return {
    ok: true,
    json: async () => ({
      data,
      source: "jolpica",
      stale: false,
      fetchedAt: new Date().toISOString(),
    }),
  };
}

export { waitFor };
