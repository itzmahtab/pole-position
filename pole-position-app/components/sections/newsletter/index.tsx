import { Suspense } from "react";
import { NewsletterForm } from "./newsletter.client";
import { NewsletterSkeleton } from "./newsletter.skeleton";

export function Newsletter() {
  return (
    <section id="newsletter" className="relative scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Race reminders, straight to your inbox
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              Sign up for session reminders across the entire F1 calendar.
              Choose when you want the heads-up — a day before, a few hours out,
              or right at the 15-minute mark — and we&apos;ll ping you before every
              green light. Unsubscribe in one click, any time.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                "Sessions for the full season calendar",
                "Per-session reminder windows you control",
                "One-click unsubscribe, no spam",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <Suspense fallback={<NewsletterSkeleton />}>
            <NewsletterForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
