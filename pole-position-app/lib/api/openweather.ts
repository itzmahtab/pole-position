interface OpenWeatherForecast {
  list: Array<{
    dt: number;
    main: { temp: number; humidity: number };
    weather: Array<{ description: string; icon: string }>;
    wind: { speed: number; deg: number };
    pop: number;
  }>;
  city: { name: string; country: string };
}

export async function fetchWeatherForecast(
  lat: number,
  lon: number
): Promise<OpenWeatherForecast | null> {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`,
      { next: { revalidate: 900 } } // 15 min
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
