import { NextResponse, type NextRequest } from "next/server";
import { fetchWithFallback } from "@/lib/api/fetchWithFallback";
import { openf1 } from "@/lib/api/openf1";
import type { ApiEnvelope } from "@/types";

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiEnvelope<unknown[]>>> {
  const meetingKey = request.nextUrl.searchParams.get("meeting_key");
  if (!meetingKey) {
    return NextResponse.json(
      { data: null, source: "openf1", stale: false, fetchedAt: new Date().toISOString() },
      { status: 400 }
    );
  }

  const result = await fetchWithFallback({
    primary: () => openf1.sessions(Number(meetingKey)),
    cacheKey: `f1:sessions:${meetingKey}`,
  });

  return NextResponse.json(result);
}
