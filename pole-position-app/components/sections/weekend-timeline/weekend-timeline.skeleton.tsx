export function WeekendTimelineSkeleton() {
  return (
    <section className="relative py-24" aria-busy="true">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="h-8 w-64 animate-pulse rounded bg-elevated" />
        <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-elevated" />
        <div className="mt-10 flex gap-4 overflow-hidden">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-40 w-44 shrink-0 animate-pulse rounded-2xl bg-elevated"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
