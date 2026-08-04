import { z } from "zod";

// ─── Shared ───

export const CircuitSchema = z.object({
  id: z.string(),
  name: z.string(),
  country: z.string(),
  locality: z.string(),
  lat: z.number(),
  long: z.number(),
});
export type Circuit = z.infer<typeof CircuitSchema>;

export const SessionSchema = z.object({
  name: z.string(),
  date: z.string(),
});
export type Session = z.infer<typeof SessionSchema>;

// ─── Meetings / Schedule ───

export const SessionSummarySchema = z.object({
  session_key: z.number(),
  session_type: z.string(),
  date_start: z.string(),
  date_end: z.string(),
  gmt_offset: z.string(),
});
export type SessionSummary = z.infer<typeof SessionSummarySchema>;

export const MeetingSchema = z.object({
  meeting_key: z.number(),
  meeting_name: z.string().optional(),
  meeting_official_name: z.string(),
  location: z.string().optional(),
  country_key: z.number().optional(),
  country_code: z.string(),
  country_name: z.string(),
  country_flag: z.string().url().optional(),
  circuit_key: z.number().optional(),
  circuit_short_name: z.string(),
  circuit_type: z.string().optional(),
  circuit_info_url: z.string().url().optional(),
  circuit_image: z.string().url().optional(),
  gmt_offset: z.string(),
  date_start: z.string(),
  date_end: z.string(),
  year: z.number().optional(),
  is_cancelled: z.boolean().optional(),
  sessions: z.array(SessionSummarySchema).optional().default([]),
});
export type Meeting = z.infer<typeof MeetingSchema>;

// ─── Drivers ───

export const DriverSchema = z.object({
  driver_number: z.number(),
  full_name: z.string(),
  name_acronym: z.string(),
  country_code: z.string(),
  team_colour: z.string().optional(),
  headshot_url: z.string().url().optional(),
  meeting_key: z.number().optional(),
  session_key: z.number().optional(),
});
export type Driver = z.infer<typeof DriverSchema>;

// ─── Championship Standings (Jolpica) ───

export const DriverStandingSchema = z.object({
  position: z.number(),
  points: z.string(),
  wins: z.string(),
  Driver: z.object({
    driverId: z.string(),
    permanentNumber: z.string().optional(),
    code: z.string().optional(),
    givenName: z.string(),
    familyName: z.string(),
    nationality: z.string(),
  }),
  Constructors: z.array(
    z.object({
      constructorId: z.string(),
      name: z.string(),
      nationality: z.string(),
    })
  ),
});
export type DriverStandingRaw = z.infer<typeof DriverStandingSchema>;

export const ConstructorStandingSchema = z.object({
  position: z.number(),
  points: z.string(),
  wins: z.string(),
  Constructor: z.object({
    constructorId: z.string(),
    name: z.string(),
    nationality: z.string(),
  }),
});
export type ConstructorStandingRaw = z.infer<typeof ConstructorStandingSchema>;

// ─── Race (Jolpica) ───

export const RaceSchema = z.object({
  season: z.string(),
  round: z.string(),
  raceName: z.string(),
  date: z.string(),
  time: z.string().optional(),
  url: z.string().optional(),
  Circuit: z.object({
    circuitId: z.string(),
    circuitName: z.string(),
    Location: z.object({
      locality: z.string(),
      country: z.string(),
      lat: z.string(),
      long: z.string(),
    }),
  }),
  FirstPractice: z
    .object({ date: z.string(), time: z.string().optional() })
    .optional(),
  SecondPractice: z
    .object({ date: z.string(), time: z.string().optional() })
    .optional(),
  ThirdPractice: z
    .object({ date: z.string(), time: z.string().optional() })
    .optional(),
  SprintQualifying: z
    .object({ date: z.string(), time: z.string().optional() })
    .optional(),
  Sprint: z
    .object({ date: z.string(), time: z.string().optional() })
    .optional(),
  Qualifying: z
    .object({ date: z.string(), time: z.string().optional() })
    .optional(),
});
export type RaceRaw = z.infer<typeof RaceSchema>;

// ─── Intervals (live) ───

export const IntervalSchema = z.object({
  meeting_key: z.number(),
  session_key: z.number(),
  driver_number: z.number(),
  gap_to_leader: z.string().optional(),
  interval: z.string().nullable().optional(),
  date: z.string(),
});
export type Interval = z.infer<typeof IntervalSchema>;

// ─── Position (live) ───

export const PositionSchema = z.object({
  meeting_key: z.number(),
  session_key: z.number(),
  driver_number: z.number(),
  position: z.number(),
  date: z.string(),
});
export type Position = z.infer<typeof PositionSchema>;

// ─── Race Control ───

export const RaceControlMessageSchema = z.object({
  meeting_key: z.number(),
  session_key: z.number(),
  date: z.string(),
  category: z.string(),
  message: z.string(),
  flag: z.string().optional(),
  scope: z.string().optional(),
  source: z.string(),
  status: z.string().optional(),
  lap_number: z.number().optional(),
});
export type RaceControlMessage = z.infer<typeof RaceControlMessageSchema>;

// ─── Weather ───

export const WeatherSchema = z.object({
  meeting_key: z.number(),
  session_key: z.number(),
  air_temperature: z.number(),
  humidity: z.number(),
  rainfall: z.boolean(),
  track_temperature: z.number(),
  wind_direction: z.number(),
  wind_speed: z.number(),
  date: z.string(),
});
export type Weather = z.infer<typeof WeatherSchema>;

// ─── Stints (tyre strategy) ───

export const StintSchema = z.object({
  meeting_key: z.number(),
  session_key: z.number(),
  driver_number: z.number(),
  stint_number: z.number(),
  compound: z.string(),
  start_lap: z.number(),
  end_lap: z.number().optional(),
  tyre_age_at_start: z.number().optional(),
});
export type Stint = z.infer<typeof StintSchema>;

// ─── Session Result ───

export const SessionResultSchema = z.object({
  meeting_key: z.number(),
  session_key: z.number(),
  driver_number: z.number(),
  position: z.number(),
  points: z.number().optional(),
  grid_position: z.number().optional(),
  laps: z.number().optional(),
  status: z.string().optional(),
  gap_to_leader: z.string().optional(),
  duration: z.string().optional(),
});
export type SessionResult = z.infer<typeof SessionResultSchema>;

// ─── Starting Grid ───

export const StartingGridSchema = z.object({
  meeting_key: z.number(),
  session_key: z.number(),
  driver_number: z.number(),
  position: z.number(),
  session_laps: z.number().optional(),
});
export type StartingGrid = z.infer<typeof StartingGridSchema>;

// ─── Live Status ───

export type LiveSessionState =
  | "upcoming"
  | "live"
  | "between"
  | "finished";

export const LiveStatusSchema = z.object({
  state: z.enum(["upcoming", "live", "between", "finished"]),
  meeting: MeetingSchema.nullable(),
  session: z
    .object({
      session_key: z.number(),
      session_type: z.string(),
      date_start: z.string(),
      date_end: z.string(),
    })
    .nullable(),
  nextSession: z
    .object({
      session_key: z.number(),
      session_type: z.string(),
      date_start: z.string(),
    })
    .nullable(),
});
export type LiveStatus = z.infer<typeof LiveStatusSchema>;

// ─── ApiEnvelope (architecture.md §6) ───

export const ApiEnvelopeSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    data: dataSchema.nullable(),
    source: z.enum(["openf1", "jolpica", "cache", "static"]),
    stale: z.boolean(),
    fetchedAt: z.string(),
  });

export type ApiEnvelope<T> = {
  data: T | null;
  source: "openf1" | "jolpica" | "cache" | "static";
  stale: boolean;
  fetchedAt: string;
};
