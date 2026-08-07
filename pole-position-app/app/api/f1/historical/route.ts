import { NextResponse, type NextRequest } from "next/server";
import { fetchWithFallback } from "@/lib/api/fetchWithFallback";
import { jolpica } from "@/lib/api/jolpica";
import type { ApiEnvelope, HistoricalSeason } from "@/types";

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiEnvelope<HistoricalSeason>>> {
  const yearParam = request.nextUrl.searchParams.get("year");
  const year = yearParam ? Number(yearParam) : new Date().getFullYear();
  if (Number.isNaN(year)) {
    return NextResponse.json(
      { data: null, source: "jolpica", stale: false, fetchedAt: new Date().toISOString() },
      { status: 400 }
    );
  }

  const result = await fetchWithFallback<HistoricalSeason>({
    primary: async () => {
      const races = await jolpica.yearSeasonResults(year);
      return { season: String(year), races };
    },
    cacheKey: `f1:historical:${year}`,
    cacheTtlMs: 60 * 60_000,
  });

  return NextResponse.json(result);
}
