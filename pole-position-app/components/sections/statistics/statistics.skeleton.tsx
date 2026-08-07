export function StatisticsSkeleton() {
  return (
    <section className="relative py-24" aria-busy="true">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="h-8 w-64 animate-pulse rounded bg-elevated" />
        <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-elevated" />
        <div className="mt-6 h-80 animate-pulse rounded-2xl bg-elevated" />
        <div className="mt-6 h-80 animate-pulse rounded-2xl bg-elevated" />
        <div className="mt-6 h-64 animate-pulse rounded-2xl bg-elevated" />
      </div>
    </section>
  );
}
