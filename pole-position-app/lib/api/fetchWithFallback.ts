import type { ApiEnvelope } from "@/types";

const TIMEOUT_MS = 5000;
const MAX_RETRIES = 1;
const BACKOFF_MS = 250;

interface FetchWithFallbackOptions<T> {
  primary: () => Promise<T>;
  fallback?: () => Promise<T>;
  cacheKey?: string;
  cacheTtlMs?: number;
}

// Simple in-memory stale cache (edge-compatible, no Redis needed for basic fallback)
const staleCache = new Map<string, { data: unknown; timestamp: number }>();

function getStaleCache<T>(key: string): T | null {
  const entry = staleCache.get(key);
  if (!entry) return null;
  return entry.data as T;
}

function setStaleCache(key: string, data: unknown): void {
  staleCache.set(key, { data, timestamp: Date.now() });
}

async function withTimeout<T>(fn: () => Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    fn(),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    ),
  ]);
}

async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number,
  backoffMs: number
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, backoffMs * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

/**
 * Central fetch utility per architecture.md §6.
 *
 * 1. Attempt primary source with timeout.
 * 2. On failure: retry once with exponential backoff.
 * 3. On second failure: attempt fallback source (if provided).
 * 4. On total failure: return last cached value (stale).
 * 5. If no cache: return null data with stale flag.
 */
export async function fetchWithFallback<T>(
  options: FetchWithFallbackOptions<T>,
  envelopeMeta?: { source: ApiEnvelope<T>["source"]; fallbackSource?: ApiEnvelope<T>["source"] }
): Promise<ApiEnvelope<T>> {
  const { primary, fallback, cacheKey } = options;
  const source = envelopeMeta?.source ?? "openf1";
  const fallbackSource = envelopeMeta?.fallbackSource ?? source;

  // Step 1+2: Primary with timeout + retry
  try {
    const data = await withTimeout(
      () => withRetry(primary, MAX_RETRIES, BACKOFF_MS),
      TIMEOUT_MS
    );
    if (cacheKey) setStaleCache(cacheKey, data);
    return { data, source, stale: false, fetchedAt: new Date().toISOString() };
  } catch {
    // Step 3: Fallback
    if (fallback) {
      try {
        const data = await withTimeout(
          () => withRetry(fallback, MAX_RETRIES, BACKOFF_MS),
          TIMEOUT_MS
        );
        if (cacheKey) setStaleCache(cacheKey, data);
        return {
          data,
          source: fallbackSource,
          stale: false,
          fetchedAt: new Date().toISOString(),
        };
      } catch {
        // continue to step 4
      }
    }

    // Step 4: Stale cache
    if (cacheKey) {
      const staleData = getStaleCache<T>(cacheKey);
      if (staleData !== null) {
        return {
          data: staleData,
          source: "cache",
          stale: true,
          fetchedAt: new Date().toISOString(),
        };
      }
    }

    // Step 5: Nothing available
    return {
      data: null,
      source: "cache",
      stale: true,
      fetchedAt: new Date().toISOString(),
    };
  }
}
