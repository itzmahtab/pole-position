import { NextResponse, type NextRequest } from "next/server";
import { fetchWithFallback } from "@/lib/api/fetchWithFallback";
import { jolpica } from "@/lib/api/jolpica";
import type { ApiEnvelope, RaceResultRaw } from "@/types";

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiEnvelope<RaceResultRaw[]>>> {
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

  const result = await fetchWithFallback<RaceResultRaw[]>({
    primary: async () => {
      const json = (year
        ? await jolpica.yearSprintResults(year, round)
        : await jolpica.sprintResults(round)) as {
        MRData: { RaceTable: { Races: Array<{ SprintResults: RaceResultRaw[] }> } };
      };
      return json.MRData?.RaceTable?.Races?.[0]?.SprintResults ?? [];
    },
    cacheKey: `f1:sprint:${year ?? "current"}:${round}`,
  });

  return NextResponse.json(result);
}
