'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserSettings } from '@/types/ui';

interface SettingsState extends UserSettings {
  setTimezone: (timezone: string) => void;
  setCountry: (country: string) => void;
  setLanguage: (language: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  setFavoriteDriver: (driver: string | null) => void;
  setFavoriteConstructor: (constructor: string | null) => void;
  setFavoriteCircuit: (circuit: string | null) => void;
  setReminder: (key: '24h' | '12h' | '1h' | '15m', value: boolean) => void;
  reset: () => void;
}

const defaultSettings: UserSettings = {
  timezone: 'UTC',
  country: 'US',
  language: 'en',
  theme: 'dark',
  animationsEnabled: true,
  reducedMotion: false,
  favoriteDriver: null,
  favoriteConstructor: null,
  favoriteCircuit: null,
  reminders: {
    '24h': true,
    '12h': false,
    '1h': true,
    '15m': false,
  },
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setTimezone: (timezone) => set({ timezone }),
      setCountry: (country) => set({ country }),
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      setAnimationsEnabled: (animationsEnabled) => set({ animationsEnabled }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
      setFavoriteDriver: (favoriteDriver) => set({ favoriteDriver }),
      setFavoriteConstructor: (favoriteConstructor) => set({ favoriteConstructor }),
      setFavoriteCircuit: (favoriteCircuit) => set({ favoriteCircuit }),
      setReminder: (key, value) =>
        set((state) => ({
          reminders: { ...state.reminders, [key]: value },
        })),
      reset: () => set(defaultSettings),
    }),
    {
      name: 'pole-position-settings',
      version: 1,
    }
  )
);
