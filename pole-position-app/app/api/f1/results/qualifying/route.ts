import { NextResponse, type NextRequest } from "next/server";
import { fetchWithFallback } from "@/lib/api/fetchWithFallback";
import { jolpica } from "@/lib/api/jolpica";
import type { ApiEnvelope, QualifyingResultRaw } from "@/types";

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiEnvelope<QualifyingResultRaw[]>>> {
  const roundParam = request.nextUrl.searchParams.get("round");
  const yearParam = request.nextUrl.searchParams.get("year");
  if (!roundParam) {
    return NextResponse.json(
      { data: null, source: "jolpica", stale: false, fetchedAt: new Date().toISOString() },
      { status: 400 }
    );
  }
  const round = Number(roundParam);
  const year = yearParam ? Number(yearParam) : null;

  const result = await fetchWithFallback<QualifyingResultRaw[]>({
    primary: async () => {
      const json = (year
        ? await jolpica.yearQualifyingResults(year, round)
        : await jolpica.qualifyingResults(round)) as {
        MRData: { RaceTable: { Races: Array<{ QualifyingResults: QualifyingResultRaw[] }> } };
      };
      return json.MRData?.RaceTable?.Races?.[0]?.QualifyingResults ?? [];
    },
    cacheKey: `f1:qualifying:${year ?? "current"}:${round}`,
  });

  return NextResponse.json(result);
}
