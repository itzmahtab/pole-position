import { describe, it, expect } from "vitest";
import {
  MeetingSchema,
  DriverSchema,
  IntervalSchema,
  PositionSchema,
  RaceControlMessageSchema,
  WeatherSchema,
  StintSchema,
  SessionResultSchema,
  DriverStandingSchema,
  ConstructorStandingSchema,
  RaceSchema,
  LiveStatusSchema,
} from "@/types";

describe("Zod Schemas", () => {
  const validMeeting = {
    meeting_key: 1234,
    meeting_official_name: "Bahrain Grand Prix",
    country_code: "BHR",
    country_key: 65,
    country_name: "Bahrain",
    circuit_short_name: "Bahrain International Circuit",
    date_start: "2025-03-02T12:00:00+03:00",
    date_end: "2025-03-02T21:00:00+03:00",
    gmt_offset: "+03:00",
    sessions: [
      {
        session_key: 9161,
        session_type: "Practice 1",
        date_start: "2025-02-28T13:30:00+03:00",
        date_end: "2025-02-28T14:30:00+03:00",
        gmt_offset: "+03:00",
      },
    ],
  };

  const validDriver = {
    driver_number: 1,
    full_name: "Max Verstappen",
    name_acronym: "VER",
    country_code: "NED",
  };

  const validInterval = {
    meeting_key: 1234,
    session_key: 9165,
    driver_number: 1,
    gap_to_leader: "Leader",
    interval: null,
    date: "2025-03-02T15:00:00+00:00",
  };

  const validPosition = {
    meeting_key: 1234,
    session_key: 9165,
    driver_number: 1,
    position: 1,
    date: "2025-03-02T15:00:00+00:00",
  };

  const validRaceControl = {
    meeting_key: 1234,
    session_key: 9165,
    date: "2025-03-02T15:30:00+00:00",
    category: "Flag",
    message: "YELLOW FLAG",
    flag: "Yellow",
    scope: "Track",
    source: "Race Director",
    status: "Active",
    lap_number: 5,
  };

  const validWeather = {
    meeting_key: 1234,
    session_key: 9165,
    air_temperature: 28.5,
    humidity: 45,
    rainfall: false,
    track_temperature: 35.2,
    wind_direction: 180,
    wind_speed: 5.5,
    date: "2025-03-02T15:00:00+00:00",
  };

  const validStint = {
    meeting_key: 1234,
    session_key: 9165,
    driver_number: 1,
    stint_number: 1,
    compound: "SOFT",
    start_lap: 1,
    end_lap: 15,
    tyre_age_at_start: 0,
  };

  it("parses Meeting", () => {
    expect(MeetingSchema.parse(validMeeting)).toEqual(validMeeting);
  });

  it("parses Driver", () => {
    expect(DriverSchema.parse(validDriver)).toEqual(validDriver);
  });

  it("parses Interval", () => {
    expect(IntervalSchema.parse(validInterval)).toEqual(validInterval);
  });

  it("parses Position", () => {
    expect(PositionSchema.parse(validPosition)).toEqual(validPosition);
  });

  it("parses RaceControlMessage", () => {
    expect(RaceControlMessageSchema.parse(validRaceControl)).toEqual(validRaceControl);
  });

  it("parses Weather", () => {
    expect(WeatherSchema.parse(validWeather)).toEqual(validWeather);
  });

  it("parses Stint", () => {
    expect(StintSchema.parse(validStint)).toEqual(validStint);
  });

  it("rejects Meeting with missing required fields", () => {
    expect(() => MeetingSchema.parse({ meeting_key: 1 })).toThrow();
  });

  it("rejects Position with string position", () => {
    expect(() =>
      PositionSchema.parse({ ...validPosition, position: "P1" })
    ).toThrow();
  });

  it("parses DriverStanding", () => {
    const data = {
      position: 1,
      points: "250",
      wins: "8",
      Driver: {
        driverId: "verstappen",
        permanentNumber: "33",
        code: "VER",
        givenName: "Max",
        familyName: "Verstappen",
        nationality: "Dutch",
      },
      Constructors: [
        {
          constructorId: "red_bull",
          name: "Red Bull Racing",
          nationality: "Austrian",
        },
      ],
    };
    expect(DriverStandingSchema.parse(data)).toEqual(data);
  });

  it("parses ConstructorStanding", () => {
    const data = {
      position: 1,
      points: "400",
      wins: "10",
      Constructor: {
        constructorId: "red_bull",
        name: "Red Bull Racing",
        nationality: "Austrian",
      },
    };
    expect(ConstructorStandingSchema.parse(data)).toEqual(data);
  });

  it("parses Race", () => {
    const data = {
      season: "2025",
      round: "1",
      raceName: "Bahrain Grand Prix",
      date: "2025-03-02",
      time: "15:00:00Z",
      Circuit: {
        circuitId: "bahrain",
        circuitName: "Bahrain International Circuit",
        Location: {
          locality: "Sakhir",
          country: "Bahrain",
          lat: "26.0325",
          long: "50.5106",
        },
      },
    };
    expect(RaceSchema.parse(data)).toEqual(data);
  });

  it("LiveStatus accepts all states", () => {
    const states = ["upcoming", "live", "between", "finished"] as const;
    for (const state of states) {
      expect(
        LiveStatusSchema.parse({
          state,
          meeting: null,
          session: null,
          nextSession: null,
        })
      ).toBeTruthy();
    }
  });
});
