import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Redis } from "@upstash/redis";

const mocks = vi.hoisted(() => {
  const RedisMock = vi.fn();
  return {
    RedisMock,
    instance: { get: vi.fn(), set: vi.fn() },
  };
});

vi.mock("@upstash/redis", () => ({
  Redis: mocks.RedisMock,
}));

type CacheModule = typeof import("@/lib/cache/redis");

async function loadModule(): Promise<CacheModule> {
  vi.resetModules();
  mocks.RedisMock.mockImplementation(function () {
    return mocks.instance as unknown as Redis;
  });
  return import("@/lib/cache/redis");
}

describe("lib/cache/redis", () => {
  const original = { ...process.env };

  beforeEach(() => {
    process.env.UPSTASH_REDIS_REST_URL = "https://cache.example.com";
    process.env.UPSTASH_REDIS_REST_TOKEN = "secret";
    mocks.RedisMock.mockClear();
    mocks.instance.get.mockReset();
    mocks.instance.set.mockReset();
  });

  afterEach(() => {
    process.env = { ...original };
  });

  it("returns null without credentials", async () => {
    const { getRedis } = await loadModule();
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    expect(getRedis()).toBeNull();
  });

  it("creates a Redis client with credentials", async () => {
    const { getRedis } = await loadModule();
    const client = getRedis();
    expect(client).toBe(mocks.instance);
    expect(mocks.RedisMock).toHaveBeenCalledWith({
      url: "https://cache.example.com",
      token: "secret",
    });
  });

  it("cacheGet returns null without a client", async () => {
    const { cacheGet } = await loadModule();
    delete process.env.UPSTASH_REDIS_REST_URL;
    expect(await cacheGet("k")).toBeNull();
  });

  it("cacheGet returns a cached value", async () => {
    const { cacheGet } = await loadModule();
    mocks.instance.get.mockResolvedValue({ points: 100 });
    expect(await cacheGet("standings")).toEqual({ points: 100 });
  });

  it("cacheGet swallows errors", async () => {
    const { cacheGet } = await loadModule();
    mocks.instance.get.mockRejectedValue(new Error("boom"));
    expect(await cacheGet("k")).toBeNull();
  });

  it("cacheSet writes with a TTL", async () => {
    const { cacheSet } = await loadModule();
    mocks.instance.set.mockResolvedValue("OK");
    await cacheSet("k", { a: 1 }, 60);
    expect(mocks.instance.set).toHaveBeenCalledWith("k", { a: 1 }, { ex: 60 });
  });

  it("cacheSet is a no-op without a client", async () => {
    const { cacheSet } = await loadModule();
    delete process.env.UPSTASH_REDIS_REST_URL;
    await expect(cacheSet("k", 1, 60)).resolves.toBeUndefined();
  });

  it("cacheSet swallows errors", async () => {
    const { cacheSet } = await loadModule();
    mocks.instance.set.mockRejectedValue(new Error("boom"));
    await expect(cacheSet("k", 1, 60)).resolves.toBeUndefined();
  });
});
