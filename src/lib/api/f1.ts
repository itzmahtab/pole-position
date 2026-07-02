import { openF1Client, jolpicaClient } from './client';
import { TEAM_COLORS } from '@/lib/utils/constants';
import type {
  RaceMeeting,
  Session,
  DriverStanding,
  ConstructorStanding,
  RaceResult,
  SeasonCalendar,
  CalendarRace,
  Circuit,
} from '@/types/f1';

export async function getMeetings(year: number = new Date().getFullYear()): Promise<RaceMeeting[]> {
  try {
    const response = await openF1Client.fetch<RaceMeeting[]>('/meetings', {}, { year });
    return response.data;
  } catch {
    const fallback = await jolpicaClient.fetch<{ MRData: { RaceTable: { Races: unknown[] } } }>(`/${year}.json`);
    return transformJolpicaMeetings(fallback.data.MRData.RaceTable.Races);
  }
}

export async function getSessions(meetingKey: number | 'latest'): Promise<Session[]> {
  const response = await openF1Client.fetch<Session[]>('/sessions', {}, { meeting_key: meetingKey });
  return response.data.sort(
    (a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime()
  );
}

export async function getDriverStandings(
  season?: number,
  round?: number
): Promise<DriverStanding[]> {
  const path = season
    ? round
      ? `/${season}/${round}/driverStandings.json`
      : `/${season}/driverStandings.json`
    : '/current/driverStandings.json';

  const response = await jolpicaClient.fetch<{
    MRData: {
      StandingsTable: {
        StandingsLists: Array<{ DriverStandings: unknown[] }>;
      };
    };
  }>(path);

  const standings =
    response.data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
  return transformJolpicaDriverStandings(standings);
}

export async function getConstructorStandings(
  season?: number,
  round?: number
): Promise<ConstructorStanding[]> {
  const path = season
    ? round
      ? `/${season}/${round}/constructorStandings.json`
      : `/${season}/constructorStandings.json`
    : '/current/constructorStandings.json';

  const response = await jolpicaClient.fetch<{
    MRData: {
      StandingsTable: {
        StandingsLists: Array<{ ConstructorStandings: unknown[] }>;
      };
    };
  }>(path);

  const standings =
    response.data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || [];
  return transformJolpicaConstructorStandings(standings);
}

export async function getRaceResults(season: number, round: number): Promise<RaceResult> {
  const response = await jolpicaClient.fetch<{
    MRData: {
      RaceTable: {
        Races: Array<{ Results: unknown[] }>;
      };
    };
  }>(`/${season}/${round}/results.json`);

  const race = response.data.MRData.RaceTable.Races[0];
  return transformJolpicaRaceResult(race);
}

export async function getSeasonCalendar(
  season: number = new Date().getFullYear()
): Promise<SeasonCalendar> {
  const response = await jolpicaClient.fetch<{
    MRData: { RaceTable: { Races: unknown[] } };
  }>(`/${season}.json`);

  return {
    season,
    races: transformJolpicaCalendar(response.data.MRData.RaceTable.Races),
  };
}

interface JolpicaDriver {
  driverId: string;
  givenName: string;
  familyName: string;
  nationality: string;
  permanentNumber?: string;
  code?: string;
}

interface JolpicaConstructor {
  constructorId: string;
  name: string;
  nationality: string;
}

interface JolpicaDriverStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: JolpicaDriver;
  Constructors: JolpicaConstructor[];
}

interface JolpicaConstructorStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Constructor: JolpicaConstructor;
}

interface JolpicaRace {
  season: string;
  round: string;
  raceName: string;
  Circuit: {
    circuitId: string;
    circuitName: string;
    Location?: {
      locality?: string;
      country?: string;
    };
  };
  date: string;
  time?: string;
  FirstPractice?: { date: string; time: string };
  SecondPractice?: { date: string; time: string };
  ThirdPractice?: { date: string; time: string };
  Qualifying?: { date: string; time: string };
  Sprint?: { date: string; time: string };
}

interface JolpicaRaceResult {
  Results: Array<{
    position: string;
    Driver: JolpicaDriver;
    Constructor: JolpicaConstructor;
    laps: string;
    time?: { time: string };
    status: string;
    points: string;
  }>;
}

function transformJolpicaMeetings(races: unknown[]): RaceMeeting[] {
  return (races as JolpicaRace[]).map((race, index) => ({
    meeting_key: index + 1,
    meeting_name: race.raceName,
    meeting_official_name: race.raceName,
    location: race.Circuit.Location?.locality || race.Circuit.Location?.country || '',
    country_key: index + 1,
    country_code: (race.Circuit.Location?.country || '').slice(0, 2).toUpperCase(),
    country_name: race.Circuit.Location?.country || '',
    circuit_key: index + 1,
    circuit_short_name: race.Circuit.circuitName,
    date_start: race.date,
    date_end: race.date,
    year: parseInt(race.season),
    country_flag: '',
    circuit_image: '',
  }));
}

function transformJolpicaDriverStandings(standings: unknown[]): DriverStanding[] {
  return (standings as JolpicaDriverStanding[]).map((s) => {
    const driverName = `${s.Driver.givenName} ${s.Driver.familyName}`;
    const constructorName = s.Constructors[0]?.name || 'Unknown';
    const teamColour = TEAM_COLORS[constructorName] || '#666';
    return {
      position: parseInt(s.position),
      positionText: s.positionText,
      points: parseInt(s.points),
      wins: parseInt(s.wins),
      podiums: 0,
      driver_name: driverName,
      driver_number: parseInt(s.Driver.permanentNumber || '0'),
      constructor_name: constructorName,
      constructor_id: s.Constructors[0]?.constructorId || '',
      nationality: s.Driver.nationality,
      team_colour: teamColour,
      headshot_url: '',
    };
  });
}

function transformJolpicaConstructorStandings(standings: unknown[]): ConstructorStanding[] {
  return (standings as JolpicaConstructorStanding[]).map((s) => ({
    position: parseInt(s.position),
    positionText: s.positionText,
    points: parseInt(s.points),
    wins: parseInt(s.wins),
    constructor_name: s.Constructor.name,
    constructor_id: s.Constructor.constructorId,
    nationality: s.Constructor.nationality,
  }));
}

function transformJolpicaRaceResult(race: unknown): RaceResult {
  const r = race as JolpicaRaceResult & { raceName?: string; round?: string; date?: string };
  return {
    race_name: r.raceName || '',
    round: parseInt(r.round || '0'),
    date: r.date || '',
    results: (r.Results || []).map((entry) => ({
      position: parseInt(entry.position),
      driver_name: `${entry.Driver.givenName} ${entry.Driver.familyName}`,
      constructor_name: entry.Constructor.name,
      laps: parseInt(entry.laps),
      time: entry.time?.time || '',
      status: entry.status,
      points: parseInt(entry.points),
    })),
  };
}

function transformJolpicaCalendar(races: unknown[]): CalendarRace[] {
  return (races as JolpicaRace[]).map((race) => ({
    round: parseInt(race.round),
    race_name: race.raceName,
    circuit: {
      circuit_id: race.Circuit.circuitId,
      circuit_name: race.Circuit.circuitName,
      location: race.Circuit.Location?.locality || '',
      country: race.Circuit.Location?.country || '',
      lat: 0,
      lng: 0,
      length_km: 0,
      corners: 0,
      lap_record: '',
      lap_record_driver: '',
      first_gp: 0,
      image: '',
    },
    date: race.date,
    time: race.time || '',
    country: race.Circuit.Location?.country || '',
    flag: (race.Circuit.Location?.country || '').slice(0, 2).toLowerCase(),
  }));
}
