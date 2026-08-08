import { describe, expect, it, vi } from "vitest";
import Lenis from "lenis";
import { setLenis, getLenis, scrollToSection } from "@/lib/lenis";

vi.mock("lenis", () => {
  return {
    default: vi.fn().mockImplementation(function () {
      return {
        scrollTo: vi.fn(),
        destroy: vi.fn(),
      };
    }),
  };
});

describe("lib/lenis", () => {
  it("stores and returns the shared instance", () => {
    expect(getLenis()).toBeNull();
    const lenis = new Lenis({});
    setLenis(lenis);
    expect(getLenis()).toBe(lenis);
    setLenis(null);
    expect(getLenis()).toBeNull();
  });

  it("drives smooth scroll through Lenis when available", () => {
    const lenis = new Lenis({});
    const scrollTo = vi.mocked(lenis.scrollTo);
    setLenis(lenis);
    scrollToSection("hero");
    expect(scrollTo).toHaveBeenCalledWith("#hero", { offset: -96 });
    setLenis(null);
  });

  it("falls back to native scrollIntoView without Lenis", () => {
    setLenis(null);
    const el = document.createElement("div");
    el.id = "hero";
    el.scrollIntoView = vi.fn();
    document.body.appendChild(el);
    scrollToSection("hero");
    expect(el.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
    el.remove();
  });
});
