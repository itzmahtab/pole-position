export function NoiseOverlay({ opacity = 0.06 }: { opacity?: number }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 bg-noise"
      style={{ opacity }}
      aria-hidden
    />
  );
}
