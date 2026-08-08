import "server-only";
import { openf1 } from "./openf1";
import { jolpica } from "./jolpica";
import type { LiveStatus, Meeting, SessionSummary } from "@/types";

export async function getLiveStatus(): Promise<LiveStatus> {
  const now = new Date();

  try {
    const meetings = await openf1.meetings();
    if (!meetings.length) {
      return {
        state: "upcoming",
        meeting: null,
        session: null,
        nextSession: null,
      };
    }

    const sorted = [...meetings].sort(
      (a, b) =>
        new Date(b.date_start).getTime() - new Date(a.date_start).getTime()
    );

    const active =
      sorted.find((m) => {
        const s = new Date(m.date_start).getTime();
        const e = new Date(m.date_end).getTime();
        return s <= now.getTime() && e >= now.getTime();
      }) ?? null;

    const upcoming = [...meetings]
      .filter((m) => new Date(m.date_start).getTime() >= now.getTime())
      .sort(
        (a, b) =>
          new Date(a.date_start).getTime() - new Date(b.date_start).getTime()
      )[0] ?? null;

    const current = active ?? upcoming ?? sorted[0];
    const sessions = await openf1.sessions(current.meeting_key);

    return deriveLiveStatus(current, sessions, now);
  } catch {
    // Fallback to Jolpica
    try {
      const json = (await jolpica.currentSchedule()) as {
        MRData: { RaceTable: { Races: unknown[] } };
      };
      const races = json.MRData?.RaceTable?.Races ?? [];
      if (!races.length) {
        return {
          state: "upcoming",
          meeting: null,
          session: null,
          nextSession: null,
        };
      }

      const race = races[0] as Record<string, unknown>;
      const circuit = race.Circuit as Record<string, unknown>;
      const loc = circuit.Location as Record<string, unknown>;
      const meeting: Meeting = {
        meeting_key: Number(race.round),
        meeting_official_name: race.raceName as string,
        country_code: (loc.country as string)?.slice(0, 3).toUpperCase() ?? "",
        country_name: loc.country as string,
        circuit_short_name: circuit.circuitName as string,
        gmt_offset: "+00:00",
        date_start: `${race.date}T${(race.time as string) ?? "00:00:00Z"}`,
        date_end: `${race.date}T${(race.time as string) ?? "23:59:59Z"}`,
        sessions: [],
      };

      const sessions = buildSessionsFromRace(race);
      const raceStart = new Date(meeting.date_start);
      const state: LiveStatus["state"] =
        raceStart > now ? "upcoming" : "finished";

      return {
        state,
        meeting,
        session: null,
        nextSession: sessions[0] ?? null,
      };
    } catch {
      return {
        state: "upcoming",
        meeting: null,
        session: null,
        nextSession: null,
      };
    }
  }
}

function deriveLiveStatus(
  meeting: Meeting,
  sessions: SessionSummary[],
  now: Date
): LiveStatus {
  const activeSession =
    sessions.find((s) => {
      const start = new Date(s.date_start);
      const end = new Date(s.date_end);
      return start <= now && end >= now;
    }) ?? null;

  const futureSessions = sessions
    .filter((s) => new Date(s.date_start) > now)
    .sort(
      (a, b) =>
        new Date(a.date_start).getTime() - new Date(b.date_start).getTime()
    );

  let state: LiveStatus["state"];
  if (activeSession) {
    state = "live";
  } else if (futureSessions.length > 0) {
    const gapMs =
      new Date(futureSessions[0].date_start).getTime() - now.getTime();
    state = gapMs < 3_600_000 ? "between" : "upcoming";
  } else {
    state = "finished";
  }

  return {
    state,
    meeting: { ...meeting, sessions },
    session: activeSession,
    nextSession: futureSessions[0] ?? null,
  };
}

const SESSION_FIELDS: Array<[string, string]> = [
  ["FirstPractice", "Practice 1"],
  ["SecondPractice", "Practice 2"],
  ["ThirdPractice", "Practice 3"],
  ["SprintQualifying", "Sprint Qualifying"],
  ["Sprint", "Sprint"],
  ["Qualifying", "Qualifying"],
  ["Race", "Race"],
];

function buildSessionsFromRace(
  race: Record<string, unknown>
): SessionSummary[] {
  const sessions: SessionSummary[] = [];
  SESSION_FIELDS.forEach(([field, type], i) => {
    const raw = race[field] as { date?: string; time?: string } | undefined;
    if (!raw?.date) return;
    sessions.push({
      session_key: i + 1,
      session_type: type,
      date_start: `${raw.date}T${raw.time ?? "00:00:00Z"}`,
      date_end: `${raw.date}T${raw.time ?? "23:59:59Z"}`,
      gmt_offset: "+00:00",
    });
  });
  return sessions.sort(
    (a, b) =>
      new Date(a.date_start).getTime() - new Date(b.date_start).getTime()
  );
}
