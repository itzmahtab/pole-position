import { create } from "zustand";
import { persist } from "zustand/middleware";
import { detectTimezone } from "@/lib/time";

export interface PreferencesState {
  timezone: string;
  country: string;
  language: string;
  theme: "dark" | "light" | "system";
  favorites: string[];
  motionEnabled: boolean;
  firstVisitDone: boolean;
  bannerDismissed: boolean;
  setTimezone: (tz: string) => void;
  setCountry: (country: string) => void;
  setLanguage: (lang: string) => void;
  setTheme: (theme: "dark" | "light" | "system") => void;
  toggleFavorite: (id: string) => void;
  setMotionEnabled: (enabled: boolean) => void;
  dismissBanner: () => void;
  markFirstVisitDone: () => void;
}

export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      timezone: detectTimezone(),
      country: "",
      language: "en",
      theme: "dark",
      favorites: [],
      motionEnabled: true,
      firstVisitDone: false,
      bannerDismissed: false,

      setTimezone: (tz) => set({ timezone: tz }),
      setCountry: (country) => set({ country }),
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((f) => f !== id)
            : [...state.favorites, id],
        })),
      setMotionEnabled: (motionEnabled) => set({ motionEnabled }),
      dismissBanner: () => set({ bannerDismissed: true }),
      markFirstVisitDone: () => set({ firstVisitDone: true }),
    }),
    {
      name: "pole-position-prefs",
    }
  )
);
