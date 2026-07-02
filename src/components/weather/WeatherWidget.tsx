'use client';

interface WeatherWidgetProps {
  lat: number;
  lng: number;
  location: string;
}

export function WeatherWidget({ lat, lng, location }: WeatherWidgetProps) {
  return (
    <div className="glass-card rounded-xl p-4">
      <p className="text-sm text-muted-foreground">Weather at {location}</p>
      <p className="text-xs text-muted-foreground/50 mt-1">
        {lat.toFixed(2)}°N, {lng.toFixed(2)}°E
      </p>
    </div>
  );
}
