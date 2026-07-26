import { NextResponse } from "next/server";
import { fetchWithFallback } from "@/lib/api/fetchWithFallback";
import { jolpica } from "@/lib/api/jolpica";
import type { ApiEnvelope, ConstructorStandingRaw } from "@/types";

export async function GET(): Promise<
  NextResponse<ApiEnvelope<ConstructorStandingRaw[]>>
> {
  const result = await fetchWithFallback<ConstructorStandingRaw[]>({
    primary: async () => {
      const json = (await jolpica.constructorStandings()) as {
        MRData: { StandingsTable: { StandingsLists: Array<{ ConstructorStandings: ConstructorStandingRaw[] }> } };
      };
      return json.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings ?? [];
    },
    cacheKey: "f1:constructor-standings",
  });

  return NextResponse.json(result);
}
