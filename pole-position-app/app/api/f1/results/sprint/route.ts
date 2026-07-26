import { NextResponse, type NextRequest } from "next/server";
import { fetchWithFallback } from "@/lib/api/fetchWithFallback";
import { jolpica } from "@/lib/api/jolpica";
import type { ApiEnvelope } from "@/types";

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiEnvelope<unknown[]>>> {
  const round = request.nextUrl.searchParams.get("round");
  if (!round) {
    return NextResponse.json(
      { data: null, source: "jolpica", stale: false, fetchedAt: new Date().toISOString() },
      { status: 400 }
    );
  }

  const result = await fetchWithFallback({
    primary: async () => {
      const json = (await jolpica.sprintResults(Number(round))) as {
        MRData: { RaceTable: { Races: Array<{ SprintResults: unknown[] }> } };
      };
      return json.MRData?.RaceTable?.Races?.[0]?.SprintResults ?? [];
    },
    cacheKey: `f1:sprint:${round}`,
  });

  return NextResponse.json(result);
}
