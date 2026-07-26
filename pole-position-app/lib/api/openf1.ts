const BASE_URL = "https://api.openf1.org/v1";

async function openF1Fetch<T>(path: string): Promise<T[]> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 15 },
  });
  if (!res.ok) throw new Error(`OpenF1 ${res.status}: ${path}`);
  const json = await res.json();
  return Array.isArray(json) ? json : [json];
}

export const openf1 = {
  meetings: () => openF1Fetch("/meetings?year=2025"),
  sessions: (meetingKey: number) =>
    openF1Fetch(`/sessions?meeting_key=${meetingKey}`),
  drivers: (sessionKey: number) =>
    openF1Fetch(`/drivers?session_key=${sessionKey}`),
  intervals: (sessionKey: number) =>
    openF1Fetch(`/intervals?session_key=${sessionKey}`),
  position: (sessionKey: number) =>
    openF1Fetch(`/position?session_key=${sessionKey}`),
  raceControl: (sessionKey: number) =>
    openF1Fetch(`/race_control?session_key=${sessionKey}`),
  weather: (sessionKey: number) =>
    openF1Fetch(`/weather?session_key=${sessionKey}`),
  stints: (sessionKey: number) =>
    openF1Fetch(`/stints?session_key=${sessionKey}`),
};
