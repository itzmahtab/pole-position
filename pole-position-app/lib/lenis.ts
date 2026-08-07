import type Lenis from "lenis";

// Shared Lenis handle so non-provider code (e.g. CommandMenu scroll-to) can
// drive smooth scrolling instead of bouncing against native scrollIntoView.
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis(): Lenis | null {
  return instance;
}

export function scrollToSection(id: string) {
  if (instance) {
    instance.scrollTo(`#${id}`, { offset: -96 });
  } else {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }
}
