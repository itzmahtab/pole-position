import { NextResponse } from "next/server";
import { fetchWithFallback } from "@/lib/api/fetchWithFallback";
import { openf1 } from "@/lib/api/openf1";
import { jolpica } from "@/lib/api/jolpica";
import type { ApiEnvelope, Meeting } from "@/types";

export const dynamic = "force-static";

export async function GET(): Promise<NextResponse<ApiEnvelope<Meeting[]>>> {
  const result = await fetchWithFallback<Meeting[]>(
    {
      primary: async () => openf1.meetings(),
      fallback: async () => {
        const json = (await jolpica.currentSchedule()) as {
          MRData: { RaceTable: { Races: unknown[] } };
        };
        const races = json.MRData?.RaceTable?.Races ?? [];
        return races.map((r) => {
          const race = r as Record<string, unknown>;
          const circuit = race.Circuit as Record<string, unknown>;
          const loc = circuit.Location as Record<string, unknown>;
          return {
            meeting_key: Number(race.round),
            meeting_official_name: race.raceName as string,
            country_code: (loc.country as string)?.slice(0, 3).toUpperCase() ?? "",
            country_name: loc.country as string,
            circuit_short_name: circuit.circuitName as string,
            date_start: `${race.date}T${race.time ?? "00:00:00Z"}`,
            date_end: `${race.date}T${race.time ?? "23:59:59Z"}`,
            gmt_offset: "+00:00",
            sessions: [],
          } satisfies Meeting;
        });
      },
      cacheKey: "f1:meetings",
    },
    { source: "openf1", fallbackSource: "jolpica" }
  );

  return NextResponse.json(result);
}
