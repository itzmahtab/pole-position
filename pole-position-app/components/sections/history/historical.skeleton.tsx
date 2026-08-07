export function HistoricalSkeleton() {
  return (
    <section className="relative py-24" aria-busy="true">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="h-8 w-64 animate-pulse rounded bg-elevated" />
        <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-elevated" />
        <div className="mt-6 flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-9 w-20 animate-pulse rounded-lg bg-elevated" />
          ))}
        </div>
        <div className="mt-6 space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-elevated" />
          ))}
        </div>
      </div>
    </section>
  );
}
