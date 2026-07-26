import { NextResponse, type NextRequest } from "next/server";
import { fetchWithFallback } from "@/lib/api/fetchWithFallback";
import { openf1 } from "@/lib/api/openf1";
import type { ApiEnvelope, Stint } from "@/types";

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiEnvelope<Stint[]>>> {
  const sessionKey = request.nextUrl.searchParams.get("session_key");
  if (!sessionKey) {
    return NextResponse.json(
      { data: null, source: "openf1", stale: false, fetchedAt: new Date().toISOString() },
      { status: 400 }
    );
  }

  const result = await fetchWithFallback<Stint[]>({
    primary: async () => {
      const data = await openf1.stints(Number(sessionKey));
      return data as Stint[];
    },
    cacheKey: `f1:stints:${sessionKey}`,
  });

  return NextResponse.json(result);
}
