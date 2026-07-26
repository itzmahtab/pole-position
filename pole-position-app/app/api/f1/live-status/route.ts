import { NextResponse } from "next/server";
import { fetchWithFallback } from "@/lib/api/fetchWithFallback";
import { openf1 } from "@/lib/api/openf1";
import type { ApiEnvelope, LiveStatus, Meeting } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse<ApiEnvelope<LiveStatus>>> {
  const now = new Date();

  const result = await fetchWithFallback<LiveStatus>({
    primary: async () => {
      const meetings = (await openf1.meetings()) as Meeting[];
      if (!meetings.length) {
        return { state: "upcoming", meeting: null, session: null, nextSession: null };
      }

      // Find current or most recent meeting
      const sorted = [...meetings].sort(
        (a, b) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime()
      );
      const current = sorted.find((m) => new Date(m.date_end) >= now) ?? sorted[0];

      // Find active session
      const activeSession = current.sessions.find((s) => {
        const start = new Date(s.date_start);
        const end = new Date(s.date_end);
        return start <= now && end >= now;
      });

      // Find next session
      const futureSessions = current.sessions
        .filter((s) => new Date(s.date_start) > now)
        .sort((a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime());

      let state: LiveStatus["state"];
      if (activeSession) {
        state = "live";
      } else if (futureSessions.length > 0) {
        const gap = futureSessions[0].date_start;
        const gapMs = new Date(gap).getTime() - now.getTime();
        state = gapMs < 3_600_000 ? "between" : "upcoming";
      } else {
        state = "finished";
      }

      return {
        state,
        meeting: current,
        session: activeSession ?? null,
        nextSession: futureSessions[0] ?? null,
      };
    },
    cacheKey: "f1:live-status",
    cacheTtlMs: 10_000,
  });

  return NextResponse.json(result);
}
