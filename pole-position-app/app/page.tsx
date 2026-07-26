export default function Home() {
  return (
    <div className="relative min-h-screen bg-hero">
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.06]" />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <h1 className="text-display text-[12vw] leading-[0.9] text-foreground sm:text-[8vw] lg:text-[112px]">
          POLE
          <span className="text-primary">.</span>
          POSITION
        </h1>
        <p className="mt-6 max-w-md text-center text-base text-muted-foreground">
          The ultimate Formula 1 companion — live standings, race weekend
          timeline, session countdowns and the full calendar, in your timezone.
        </p>
      </div>
    </div>
  );
}
