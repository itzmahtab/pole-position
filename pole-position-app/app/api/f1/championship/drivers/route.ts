import { NextResponse } from "next/server";
import { fetchWithFallback } from "@/lib/api/fetchWithFallback";
import { jolpica } from "@/lib/api/jolpica";
import type { ApiEnvelope, DriverStandingRaw } from "@/types";

export async function GET(): Promise<
  NextResponse<ApiEnvelope<DriverStandingRaw[]>>
> {
  const result = await fetchWithFallback<DriverStandingRaw[]>({
    primary: async () => {
      const json = (await jolpica.driverStandings()) as {
        MRData: { StandingsTable: { StandingsLists: Array<{ DriverStandings: DriverStandingRaw[] }> } };
      };
      return json.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? [];
    },
    cacheKey: "f1:driver-standings",
  });

  return NextResponse.json(result);
}
