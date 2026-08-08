import type { Page } from "@playwright/test";
import type { LiveStatus, RaceRaw } from "@/types";

const envelope = <T>(data: T) => ({
  data,
  source: "mock",
  stale: false,
  fetchedAt: new Date().toISOString(),
});

export const liveStatusFixture: LiveStatus = {
  state: "upcoming",
  meeting: {
    meeting_key: 1,
    meeting_official_name: "British Grand Prix",
    country_code: "GB",
    country_name: "United Kingdom",
    circuit_short_name: "Silverstone Circuit",
    gmt_offset: "+01:00",
    date_start: "2026-07-03T10:00:00Z",
    date_end: "2026-07-05T16:00:00Z",
    sessions: [
      {
        session_key: 40,
        session_type: "Practice 1",
        session_name: "Practice 1",
        date_start: "2026-07-03T10:00:00Z",
        date_end: "2026-07-03T11:00:00Z",
        gmt_offset: "+01:00",
        meeting_key: 1,
      },
      {
        session_key: 42,
        session_type: "Race",
        session_name: "Race",
        date_start: "2026-07-05T14:00:00Z",
        date_end: "2026-07-05T16:00:00Z",
        gmt_offset: "+01:00",
        meeting_key: 1,
      },
    ],
  },
  session: {
    session_key: 42,
    session_type: "Race",
    date_start: "2026-07-05T14:00:00Z",
    date_end: "2026-07-05T16:00:00Z",
  },
  nextSession: {
    session_key: 43,
    session_type: "Qualifying",
    date_start: "2026-07-04T14:00:00Z",
  },
};

export const scheduleFixture: RaceRaw[] = [
  {
    season: "2026",
    round: "1",
    raceName: "British Grand Prix",
    date: "2026-07-05",
    Circuit: {
      circuitId: "silverstone",
      circuitName: "Silverstone Circuit",
      Location: {
        locality: "Silverstone",
        country: "United Kingdom",
        lat: "52.07",
        long: "-1.01",
      },
    },
  },
];

const driverStandingFixture = [
  {
    position: 1,
    points: "25",
    wins: "1",
    Driver: {
      driverId: "verstappen",
      permanentNumber: "1",
      code: "VER",
      givenName: "Max",
      familyName: "Verstappen",
      nationality: "Dutch",
    },
    Constructors: [
      {
        constructorId: "red_bull",
        name: "Red Bull",
        nationality: "Austrian",
      },
    ],
  },
];

const constructorStandingFixture = [
  {
    position: 1,
    points: "25",
    wins: "1",
    Constructor: {
      constructorId: "red_bull",
      name: "Red Bull",
      nationality: "Austrian",
    },
  },
];

export interface MockApiOptions {
  liveStatus?: LiveStatus;
  schedule?: RaceRaw[];
  subscribe?: { subscribed: boolean; alreadySubscribed: boolean };
}

export async function mockApi(page: Page, options: MockApiOptions = {}) {
  const liveStatus = options.liveStatus ?? liveStatusFixture;
  const schedule = options.schedule ?? scheduleFixture;

  await page.route("**/api/**", async (route) => {
    const url = new URL(route.request().url());
    const path = url.pathname;

    if (path === "/api/f1/live-status") {
      return route.fulfill({ json: envelope(liveStatus) });
    }
    if (path === "/api/f1/schedule") {
      return route.fulfill({ json: envelope(schedule) });
    }
    if (path === "/api/f1/championship/drivers") {
      return route.fulfill({ json: envelope(driverStandingFixture) });
    }
    if (path === "/api/f1/championship/teams") {
      return route.fulfill({ json: envelope(constructorStandingFixture) });
    }
    if (path === "/api/newsletter/subscribe") {
      return route.fulfill({
        json: envelope(
          options.subscribe ?? { subscribed: true, alreadySubscribed: false }
        ),
      });
    }

    return route.fulfill({ status: 500, json: envelope(null) });
  });
}
