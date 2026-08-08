import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchWeatherForecast } from "@/lib/api/openweather";

const forecastJson = {
  list: [
    {
      dt: 1000,
      main: { temp: 18.5, humidity: 60 },
      weather: [{ description: "clear sky", icon: "01d" }],
      wind: { speed: 4, deg: 180 },
      pop: 0.1,
    },
  ],
  city: { name: "Silverstone", country: "GB" },
};

describe("lib/api/openweather", () => {
  const original = { ...process.env };

  afterEach(() => {
    process.env = { ...original };
    vi.unstubAllGlobals();
  });

  it("returns null when no API key is configured", async () => {
    delete process.env.OPENWEATHER_API_KEY;
    expect(await fetchWeatherForecast(52.1, -1.0)).toBeNull();
  });

  it("fetches and returns a forecast", async () => {
    process.env.OPENWEATHER_API_KEY = "test-key";
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => forecastJson,
    });
    vi.stubGlobal("fetch", fetchMock);

    const data = await fetchWeatherForecast(52.1, -1.0);
    expect(data).toEqual(forecastJson);
    expect(fetchMock.mock.calls[0][0]).toContain("lat=52.1");
    expect(fetchMock.mock.calls[0][0]).toContain("lon=-1");
    expect(fetchMock.mock.calls[0][0]).toContain("appid=test-key");
  });

  it("returns null on non-ok responses", async () => {
    process.env.OPENWEATHER_API_KEY = "test-key";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    expect(await fetchWeatherForecast(52.1, -1.0)).toBeNull();
  });

  it("returns null on network errors", async () => {
    process.env.OPENWEATHER_API_KEY = "test-key";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    expect(await fetchWeatherForecast(52.1, -1.0)).toBeNull();
  });
});
