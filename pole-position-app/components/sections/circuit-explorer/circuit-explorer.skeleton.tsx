export function CircuitExplorerSkeleton() {
  return (
    <section className="relative py-24" aria-busy="true">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="h-8 w-72 animate-pulse rounded bg-elevated" />
        <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-elevated" />
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="aspect-[10/7] animate-pulse rounded-2xl bg-elevated" />
          <div className="space-y-4">
            <div className="h-6 w-48 animate-pulse rounded bg-elevated" />
            <div className="grid grid-cols-2 gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-2xl bg-elevated" />
              ))}
            </div>
            <div className="h-24 animate-pulse rounded-2xl bg-elevated" />
          </div>
        </div>
      </div>
    </section>
  );
}
