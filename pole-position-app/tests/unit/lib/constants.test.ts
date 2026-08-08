import { describe, expect, it } from "vitest";
import {
  CACHE_TTL,
  TEAM_COLORS,
  SESSION_TYPE_LABEL,
  FLAG_CODE_MAP,
} from "@/lib/constants";
import { CIRCUIT_INFO } from "@/lib/constants/circuits";

describe("lib/constants", () => {
  it("defines cache TTLs for every live endpoint", () => {
    expect(CACHE_TTL.RACE_CONTROL).toBe(15);
    expect(CACHE_TTL.INTERVALS).toBe(10);
    expect(CACHE_TTL.LIVE_STATUS).toBe(10);
    expect(CACHE_TTL.SCHEDULE).toBe(600);
  });

  it("maps all 10 teams to colours", () => {
    expect(Object.keys(TEAM_COLORS)).toHaveLength(10);
    expect(TEAM_COLORS.mclaren).toMatch(/^#/);
    expect(TEAM_COLORS.ferrari).toMatch(/^#/);
  });

  it("maps session types to short labels", () => {
    expect(SESSION_TYPE_LABEL["Race"]).toBe("R");
    expect(SESSION_TYPE_LABEL["Qualifying"]).toBe("Q");
  });

  it("maps ISO country codes to flag CDN codes", () => {
    expect(FLAG_CODE_MAP.GBR).toBe("gb");
    expect(FLAG_CODE_MAP.USA).toBe("us");
    expect(FLAG_CODE_MAP.MON).toBe("mc");
  });

  it("provides curated metadata for all 7 tracks", () => {
    expect(Object.keys(CIRCUIT_INFO)).toHaveLength(7);
    for (const info of Object.values(CIRCUIT_INFO)) {
      expect(info.corners).toBeGreaterThan(0);
      expect(info.raceLaps).toBeGreaterThan(0);
      expect(info.firstGp).toBeGreaterThan(0);
      expect(info.lengthKm).toBeGreaterThan(0);
    }
  });
});
