import { describe, it, expect, vi } from "vitest";
import { fetchWithFallback } from "@/lib/api/fetchWithFallback";

describe("fetchWithFallback", () => {
  it("returns primary data on success", async () => {
    const result = await fetchWithFallback({
      primary: async () => ({ value: 42 }),
    });
    expect(result.data).toEqual({ value: 42 });
    expect(result.source).toBe("openf1");
    expect(result.stale).toBe(false);
  });

  it("retries primary before falling back", async () => {
    let attempts = 0;
    const result = await fetchWithFallback({
      primary: async () => {
        attempts++;
        throw new Error("fail");
      },
      fallback: async () => ({ recovered: true }),
    });
    expect(attempts).toBe(2);
    expect(result.data).toEqual({ recovered: true });
    expect(result.source).toBe("openf1");
  });

  it("returns stale cache when both primary and fallback fail", async () => {
    await fetchWithFallback({
      primary: async () => ({ cached: true }),
      cacheKey: "test:stale",
    });

    const result = await fetchWithFallback(
      {
        primary: async () => {
          throw new Error("primary down");
        },
        fallback: async () => {
          throw new Error("fallback down");
        },
        cacheKey: "test:stale",
      }
    );
    expect(result.data).toEqual({ cached: true });
    expect(result.stale).toBe(true);
    expect(result.source).toBe("cache");
  });

  it("returns null data when no cache and all sources fail", async () => {
    const result = await fetchWithFallback({
      primary: async () => {
        throw new Error("fail");
      },
    });
    expect(result.data).toBeNull();
    expect(result.stale).toBe(true);
  });

  it("uses fallback source name in envelope when fallback succeeds", async () => {
    const result = await fetchWithFallback(
      {
        primary: async () => {
          throw new Error("fail");
        },
        fallback: async () => ({ fromFallback: true }),
      },
      { source: "openf1", fallbackSource: "jolpica" }
    );
    expect(result.source).toBe("jolpica");
    expect(result.data).toEqual({ fromFallback: true });
  });
});
