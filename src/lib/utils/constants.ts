export const SITE_NAME = 'Pole Position';
export const SITE_DESCRIPTION = 'Real-time F1 dashboard and race tracker';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  openf1: 'https://api.openf1.org/v1',
  jolpica: 'https://api.jolpi.ca/ergast/f1',
  openweather: 'https://api.openweathermap.org/data/2.5',
  flagcdn: 'https://flagcdn.com',
  countries: 'https://restcountries.com/v3.1',
} as const;

export const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,
} as const;

export const CACHE_DURATION = {
  live: 15,
  standings: 120,
  weather: 600,
  calendar: 3600,
} as const;

export const DEFAULT_META = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  ogImage: '/og-image.jpg',
  author: 'Pole Position',
  keywords: [
    'formula 1',
    'f1',
    'racing',
    'motorsport',
    'grand prix',
    'standings',
    'schedule',
    'countdown',
  ],
} as const;

export const TEAM_COLORS: Record<string, string> = {
  'Red Bull Racing': '#1e41ff',
  Ferrari: '#dc0000',
  Mercedes: '#27f4d2',
  McLaren: '#ff8700',
  'Alpine F1 Team': '#ff87bc',
  'Haas F1 Team': '#b6babd',
  'Aston Martin': '#006f62',
  'Williams Racing': '#005aff',
  'RB F1 Team': '#6692ff',
  'Kick Sauber': '#52e252',
};

export const SESSION_NAMES: Record<string, string> = {
  FP1: 'Practice 1',
  FP2: 'Practice 2',
  FP3: 'Practice 3',
  Qualifying: 'Qualifying',
  Race: 'Race',
  Sprint: 'Sprint',
  'Sprint Qualifying': 'Sprint Qualifying',
};

export const COUNTRIES = [
  { code: 'AE', name: 'United Arab Emirates', timezone: 'Asia/Dubai' },
  { code: 'AU', name: 'Australia', timezone: 'Australia/Melbourne' },
  { code: 'AT', name: 'Austria', timezone: 'Europe/Vienna' },
  { code: 'AZ', name: 'Azerbaijan', timezone: 'Asia/Baku' },
  { code: 'BH', name: 'Bahrain', timezone: 'Asia/Bahrain' },
  { code: 'BE', name: 'Belgium', timezone: 'Europe/Brussels' },
  { code: 'BR', name: 'Brazil', timezone: 'America/Sao_Paulo' },
  { code: 'CA', name: 'Canada', timezone: 'America/Toronto' },
  { code: 'CN', name: 'China', timezone: 'Asia/Shanghai' },
  { code: 'FR', name: 'France', timezone: 'Europe/Paris' },
  { code: 'GB', name: 'United Kingdom', timezone: 'Europe/London' },
  { code: 'DE', name: 'Germany', timezone: 'Europe/Berlin' },
  { code: 'HU', name: 'Hungary', timezone: 'Europe/Budapest' },
  { code: 'IN', name: 'India', timezone: 'Asia/Kolkata' },
  { code: 'IT', name: 'Italy', timezone: 'Europe/Rome' },
  { code: 'JP', name: 'Japan', timezone: 'Asia/Tokyo' },
  { code: 'MX', name: 'Mexico', timezone: 'America/Mexico_City' },
  { code: 'MC', name: 'Monaco', timezone: 'Europe/Monaco' },
  { code: 'NL', name: 'Netherlands', timezone: 'Europe/Amsterdam' },
  { code: 'QA', name: 'Qatar', timezone: 'Asia/Qatar' },
  { code: 'SA', name: 'Saudi Arabia', timezone: 'Asia/Riyadh' },
  { code: 'SG', name: 'Singapore', timezone: 'Asia/Singapore' },
  { code: 'KR', name: 'South Korea', timezone: 'Asia/Seoul' },
  { code: 'ES', name: 'Spain', timezone: 'Europe/Madrid' },
  { code: 'US', name: 'United States', timezone: 'America/New_York' },
];
