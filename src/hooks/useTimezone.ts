'use client';

import { useState, useEffect, useCallback } from 'react';

interface TimezoneState {
  timezone: string;
  country: string;
  detected: boolean;
}

export function useTimezone() {
  const [state, setState] = useState<TimezoneState>({
    timezone: 'UTC',
    country: 'US',
    detected: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem('pole-position-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.timezone && parsed.country) {
          setState({
            timezone: parsed.timezone,
            country: parsed.country,
            detected: false,
          });
          return;
        }
      } catch {
        // Invalid saved data, continue to detection
      }
    }

    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const detectedCountry = detectCountryFromTimezone(detectedTimezone);

    setState({
      timezone: detectedTimezone,
      country: detectedCountry,
      detected: true,
    });
  }, []);

  const setTimezone = useCallback((timezone: string, country: string) => {
    setState({ timezone, country, detected: false });

    const saved = localStorage.getItem('pole-position-settings');
    const settings = saved ? JSON.parse(saved) : {};
    localStorage.setItem(
      'pole-position-settings',
      JSON.stringify({
        ...settings,
        timezone,
        country,
      })
    );
  }, []);

  return { ...state, setTimezone };
}

function detectCountryFromTimezone(timezone: string): string {
  const timezoneMap: Record<string, string> = {
    'America/New_York': 'US',
    'America/Chicago': 'US',
    'America/Denver': 'US',
    'America/Los_Angeles': 'US',
    'Europe/London': 'GB',
    'Europe/Paris': 'FR',
    'Europe/Berlin': 'DE',
    'Europe/Rome': 'IT',
    'Europe/Madrid': 'ES',
    'Asia/Tokyo': 'JP',
    'Asia/Shanghai': 'CN',
    'Asia/Singapore': 'SG',
    'Asia/Dubai': 'AE',
    'Australia/Melbourne': 'AU',
    'America/Sao_Paulo': 'BR',
    'America/Mexico_City': 'MX',
    'Asia/Dhaka': 'BD',
    'Asia/Kolkata': 'IN',
    'Asia/Karachi': 'PK',
  };

  return timezoneMap[timezone] || 'US';
}
