export function NewsletterSkeleton() {
  return (
    <div className="rounded-2xl bg-elevated p-8" aria-busy="true">
      <div className="h-4 w-40 animate-pulse rounded bg-muted" />
      <div className="mt-4 h-5 w-80 max-w-full animate-pulse rounded bg-muted" />
      <div className="mt-6 h-11 animate-pulse rounded-lg bg-muted" />
      <div className="mt-5 flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-9 w-32 animate-pulse rounded-full bg-muted" />
        ))}
      </div>
    </div>
  );
}
