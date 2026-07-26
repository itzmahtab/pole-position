import { NextResponse, type NextRequest } from "next/server";
import { fetchWithFallback } from "@/lib/api/fetchWithFallback";
import { openf1 } from "@/lib/api/openf1";
import type { ApiEnvelope, RaceControlMessage } from "@/types";

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiEnvelope<RaceControlMessage[]>>> {
  const sessionKey = request.nextUrl.searchParams.get("session_key");
  if (!sessionKey) {
    return NextResponse.json(
      { data: null, source: "openf1", stale: false, fetchedAt: new Date().toISOString() },
      { status: 400 }
    );
  }

  const result = await fetchWithFallback<RaceControlMessage[]>({
    primary: async () => {
      const data = await openf1.raceControl(Number(sessionKey));
      return data as RaceControlMessage[];
    },
    cacheKey: `f1:race-control:${sessionKey}`,
  });

  return NextResponse.json(result);
}
