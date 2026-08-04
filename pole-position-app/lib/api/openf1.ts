import { z } from "zod";
import {
  MeetingSchema,
  SessionSummarySchema,
  DriverSchema,
  IntervalSchema,
  PositionSchema,
  RaceControlMessageSchema,
  WeatherSchema,
  StintSchema,
} from "@/types";

const BASE_URL = "https://api.openf1.org/v1";

async function openF1Fetch<T extends z.ZodType>(
  path: string,
  schema: T
): Promise<z.infer<T>[]> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 15 },
  });
  if (!res.ok) throw new Error(`OpenF1 ${res.status}: ${path}`);
  const json = await res.json();
  const rows = Array.isArray(json) ? json : [json];
  return rows.map((row) => schema.parse(row));
}

const currentYear = () => new Date().getFullYear();

export const openf1 = {
  meetings: async () => {
    const year = currentYear();
    let meetings = await openF1Fetch(
      `/meetings?year=${year}`,
      MeetingSchema
    );
    // Off-season fallback: current year may have no meetings yet
    if (meetings.length === 0) {
      meetings = await openF1Fetch(
        `/meetings?year=${year - 1}`,
        MeetingSchema
      );
    }
    return meetings;
  },
  sessions: (meetingKey: number) =>
    openF1Fetch(`/sessions?meeting_key=${meetingKey}`, SessionSummarySchema),
  drivers: (sessionKey: number) =>
    openF1Fetch(`/drivers?session_key=${sessionKey}`, DriverSchema),
  intervals: (sessionKey: number) =>
    openF1Fetch(`/intervals?session_key=${sessionKey}`, IntervalSchema),
  position: (sessionKey: number) =>
    openF1Fetch(`/position?session_key=${sessionKey}`, PositionSchema),
  raceControl: (sessionKey: number) =>
    openF1Fetch(`/race_control?session_key=${sessionKey}`, RaceControlMessageSchema),
  weather: (sessionKey: number) =>
    openF1Fetch(`/weather?session_key=${sessionKey}`, WeatherSchema),
  stints: (sessionKey: number) =>
    openF1Fetch(`/stints?session_key=${sessionKey}`, StintSchema),
};
