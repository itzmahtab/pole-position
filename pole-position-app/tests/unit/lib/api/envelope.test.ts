import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchEnvelopeData } from "@/lib/api/envelope";

describe("lib/api/envelope", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns json.data from a successful response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: { hello: "world" }, source: "jolpica", stale: false, fetchedAt: "x" }),
      })
    );
    const data = await fetchEnvelopeData<{ hello: string }>("/api/test");
    expect(data).toEqual({ hello: "world" });
    expect(fetch).toHaveBeenCalledWith("/api/test", { cache: "no-store" });
  });

  it("throws on non-ok responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 500 })
    );
    await expect(fetchEnvelopeData("/api/test")).rejects.toThrow("/api/test 500");
  });

  it("returns null when data is null", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: null, source: "cache", stale: false, fetchedAt: "x" }),
      })
    );
    expect(await fetchEnvelopeData("/api/test")).toBeNull();
  });
});
