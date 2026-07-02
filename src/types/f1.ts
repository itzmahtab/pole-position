export interface RaceMeeting {
  meeting_key: number;
  meeting_name: string;
  meeting_official_name: string;
  location: string;
  country_key: number;
  country_code: string;
  country_name: string;
  circuit_key: number;
  circuit_short_name: string;
  date_start: string;
  date_end: string;
  year: number;
  country_flag: string;
  circuit_image: string;
}

export interface Session {
  session_key: number;
  session_name: string;
  session_type: string;
  meeting_key: number;
  date_start: string;
  date_end: string;
  gmt_offset: string;
  path?: string;
}

export interface DriverStanding {
  position: number;
  positionText: string;
  points: number;
  wins: number;
  podiums: number;
  driver_name: string;
  driver_number: number;
  constructor_name: string;
  constructor_id: string;
  nationality: string;
  team_colour: string;
  headshot_url: string;
}

export interface ConstructorStanding {
  position: number;
  positionText: string;
  points: number;
  wins: number;
  constructor_name: string;
  constructor_id: string;
  nationality: string;
}

export interface RaceResult {
  race_name: string;
  round: number;
  date: string;
  results: RaceResultEntry[];
}

export interface RaceResultEntry {
  position: number;
  driver_name: string;
  constructor_name: string;
  laps: number;
  time: string;
  status: string;
  points: number;
}

export interface SeasonCalendar {
  season: number;
  races: CalendarRace[];
}

export interface CalendarRace {
  round: number;
  race_name: string;
  circuit: Circuit;
  date: string;
  time: string;
  country: string;
  flag: string;
}

export interface Circuit {
  circuit_id: string;
  circuit_name: string;
  location: string;
  country: string;
  lat: number;
  lng: number;
  length_km: number;
  corners: number;
  lap_record: string;
  lap_record_driver: string;
  first_gp: number;
  image: string;
  svg_path?: string;
}

export interface RaceWeekend {
  meeting: RaceMeeting;
  sessions: Session[];
  current_session: Session | null;
  next_session: Session | null;
  status: 'upcoming' | 'live' | 'between_sessions' | 'completed';
  progress: number;
}

export interface WeatherData {
  temp_celsius: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_direction: number;
  pressure: number;
  visibility: number;
  weather_main: string;
  weather_description: string;
  weather_icon: string;
  cloud_coverage: number;
  rain_1h: number;
  track_temp: number;
  air_temp: number;
  updated_at: string;
}
