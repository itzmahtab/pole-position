import { NextResponse, type NextRequest } from "next/server";
import { fetchWithFallback } from "@/lib/api/fetchWithFallback";
import type { ApiEnvelope } from "@/types";

export const dynamic = "force-dynamic";

export interface ForecastPoint {
  dt: number;
  temp: number;
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number;
  pop: number;
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiEnvelope<ForecastPoint[]>>> {
  const lat = request.nextUrl.searchParams.get("lat");
  const lon = request.nextUrl.searchParams.get("lon");
  if (!lat || !lon) {
    return NextResponse.json(
      { data: null, source: "static", stale: false, fetchedAt: new Date().toISOString() },
      { status: 400 }
    );
  }

  const result = await fetchWithFallback<ForecastPoint[]>(
    {
      primary: async () => {
        const apiKey = process.env.OPENWEATHER_API_KEY;
        if (!apiKey) return [];
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&cnt=8&appid=${apiKey}`
        );
        if (!res.ok) throw new Error(`openweather ${res.status}`);
        const json = (await res.json()) as {
          list: Array<{
            dt: number;
            main: { temp: number; humidity: number };
            weather: Array<{ description: string; icon: string }>;
            wind: { speed: number };
            pop: number;
          }>;
        };
        return (json.list ?? []).map((p) => ({
          dt: p.dt,
          temp: Math.round(p.main.temp),
          humidity: p.main.humidity,
          description: p.weather[0]?.description ?? "",
          icon: p.weather[0]?.icon ?? "",
          windSpeed: Math.round(p.wind.speed),
          pop: Math.round(p.pop * 100),
        }));
      },
      cacheKey: `f1:forecast:${lat}:${lon}`,
      cacheTtlMs: 900_000,
    },
    { source: "openweather" }
  );

  return NextResponse.json(result);
}
