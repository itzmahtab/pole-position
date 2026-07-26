import { NextResponse, type NextRequest } from "next/server";
import { fetchWithFallback } from "@/lib/api/fetchWithFallback";
import { openf1 } from "@/lib/api/openf1";
import type { ApiEnvelope, Position } from "@/types";

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiEnvelope<Position[]>>> {
  const sessionKey = request.nextUrl.searchParams.get("session_key");
  if (!sessionKey) {
    return NextResponse.json(
      { data: null, source: "openf1", stale: false, fetchedAt: new Date().toISOString() },
      { status: 400 }
    );
  }

  const result = await fetchWithFallback<Position[]>({
    primary: async () => {
      const data = await openf1.position(Number(sessionKey));
      return data as Position[];
    },
    cacheKey: `f1:positions:${sessionKey}`,
  });

  return NextResponse.json(result);
}
