export function ComparisonSkeleton() {
  return (
    <section className="relative py-24" aria-busy="true">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="h-8 w-72 animate-pulse rounded bg-elevated" />
        <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-elevated" />
        <div className="mt-6 flex gap-3">
          <div className="h-9 w-48 animate-pulse rounded-lg bg-elevated" />
          <div className="h-9 w-48 animate-pulse rounded-lg bg-elevated" />
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {[0, 1].map((c) => (
            <div key={c} className="rounded-2xl bg-elevated p-5">
              <div className="h-6 w-40 animate-pulse rounded bg-muted" />
              <div className="mt-5 space-y-3">
                {[0, 1, 2, 3].map((r) => (
                  <div key={r} className="h-12 animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
