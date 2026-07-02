'use client';

import { useQuery } from '@tanstack/react-query';
import { weatherClient } from '@/lib/api/client';
import type { WeatherData } from '@/types/f1';

export function useWeather(lat: number, lng: number) {
  return useQuery<WeatherData>({
    queryKey: ['weather', lat, lng],
    queryFn: async () => {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      const response = await weatherClient.fetch<{
        main: { temp: number; feels_like: number; humidity: number; pressure: number };
        wind: { speed: number; deg: number };
        weather: Array<{ main: string; description: string; icon: string }>;
        clouds: { all: number };
        visibility: number;
        rain?: { '1h': number };
      }>(
        '/weather',
        {},
        {
          lat,
          lon: lng,
          appid: apiKey,
          units: 'metric',
        }
      );

      const data = response.data;

      return {
        temp_celsius: data.main.temp,
        feels_like: data.main.feels_like,
        humidity: data.main.humidity,
        wind_speed: data.wind.speed,
        wind_direction: data.wind.deg,
        pressure: data.main.pressure,
        visibility: data.visibility,
        weather_main: data.weather[0]?.main || 'Unknown',
        weather_description: data.weather[0]?.description || 'unknown',
        weather_icon: data.weather[0]?.icon || '01d',
        cloud_coverage: data.clouds.all,
        rain_1h: data.rain?.['1h'] || 0,
        track_temp: data.main.temp + 5,
        air_temp: data.main.temp,
        updated_at: new Date().toISOString(),
      };
    },
    staleTime: 600000,
    refetchInterval: 600000,
    enabled: !!lat && !!lng,
  });
}
