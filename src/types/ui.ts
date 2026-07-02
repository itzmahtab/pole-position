export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
  isExpired: boolean;
}

export interface UserSettings {
  timezone: string;
  country: string;
  language: string;
  theme: 'light' | 'dark' | 'system';
  animationsEnabled: boolean;
  reducedMotion: boolean;
  favoriteDriver: string | null;
  favoriteConstructor: string | null;
  favoriteCircuit: string | null;
  reminders: {
    '24h': boolean;
    '12h': boolean;
    '1h': boolean;
    '15m': boolean;
  };
}

export interface ModalState {
  isOpen: boolean;
  type: string | null;
  data?: Record<string, unknown>;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

export type SessionStatus = {
  label: string;
  color: string;
  variant: 'upcoming' | 'live' | 'finished';
};
