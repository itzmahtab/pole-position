import { beforeEach, describe, expect, it } from "vitest";
import { usePreferences } from "@/store/preferences";

const store = usePreferences;

describe("store/preferences", () => {
  beforeEach(() => {
    localStorage.clear();
    usePreferences.setState({
      timezone: "UTC",
      country: "",
      language: "en",
      theme: "dark",
      favorites: [],
      motionEnabled: true,
      firstVisitDone: false,
      bannerDismissed: false,
    });
  });

  it("defaults to dark theme with motion enabled", () => {
    const s = store.getState();
    expect(s.theme).toBe("dark");
    expect(s.motionEnabled).toBe(true);
    expect(s.language).toBe("en");
    expect(s.favorites).toEqual([]);
  });

  it("sets timezone and country", () => {
    store.getState().setTimezone("Asia/Dhaka");
    store.getState().setCountry("Bangladesh");
    expect(store.getState().timezone).toBe("Asia/Dhaka");
    expect(store.getState().country).toBe("Bangladesh");
  });

  it("sets language and theme", () => {
    store.getState().setLanguage("bn");
    store.getState().setTheme("light");
    expect(store.getState().language).toBe("bn");
    expect(store.getState().theme).toBe("light");
  });

  it("toggles favorites on and off", () => {
    store.getState().toggleFavorite("mclaren");
    expect(store.getState().favorites).toEqual(["mclaren"]);
    store.getState().toggleFavorite("mclaren");
    expect(store.getState().favorites).toEqual([]);
  });

  it("toggles motion and banner flags", () => {
    store.getState().setMotionEnabled(false);
    expect(store.getState().motionEnabled).toBe(false);
    store.getState().dismissBanner();
    expect(store.getState().bannerDismissed).toBe(true);
    store.getState().markFirstVisitDone();
    expect(store.getState().firstVisitDone).toBe(true);
  });

  it("persists to localStorage", () => {
    store.getState().setTimezone("Europe/London");
    const stored = JSON.parse(localStorage.getItem("pole-position-prefs") ?? "{}");
    expect(stored.state.timezone).toBe("Europe/London");
  });
});
