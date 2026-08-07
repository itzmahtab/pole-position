import { NextResponse } from "next/server";
import { fetchWithFallback } from "@/lib/api/fetchWithFallback";
import { jolpica } from "@/lib/api/jolpica";
import type { ApiEnvelope, RaceRaw } from "@/types";

export const dynamic = "force-static";
export const revalidate = 300;

export async function GET(): Promise<NextResponse<ApiEnvelope<RaceRaw[]>>> {
  const result = await fetchWithFallback<RaceRaw[]>({
    primary: async () => {
      const json = (await jolpica.currentSchedule()) as {
        MRData: { RaceTable: { Races: RaceRaw[] } };
      };
      return json.MRData?.RaceTable?.Races ?? [];
    },
    cacheKey: "f1:schedule",
    cacheTtlMs: 300_000,
  },
    { source: "jolpica" }
  );

  return NextResponse.json(result);
}
