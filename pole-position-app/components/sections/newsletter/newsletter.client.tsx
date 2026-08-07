"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Send, CheckCircle2, BellRing } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  REMINDER_WINDOWS,
  DEFAULT_REMINDER_WINDOWS,
} from "@/lib/newsletter/windows";

const formSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  reminderWindows: z
    .array(z.string())
    .min(1, "Pick at least one reminder window"),
});

type FormValues = z.infer<typeof formSchema>;

interface SubscribeResponse {
  subscribed: boolean;
  alreadySubscribed: boolean;
}

interface SubscribeEnvelope {
  data: SubscribeResponse | null;
  source: string;
  stale: boolean;
  fetchedAt: string;
}

type Status = "idle" | "submitting" | "success" | "error";

export function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [wasAlreadySubscribed, setWasAlreadySubscribed] = useState(false);

  const { register, control, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      reminderWindows: DEFAULT_REMINDER_WINDOWS,
    },
  });

  async function onSubmit(values: FormValues) {
    setStatus("submitting");
    setErrorMsg("");
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC";
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, timezone }),
      });
      const json = (await res.json()) as SubscribeEnvelope;
      if (!res.ok || !json.data?.subscribed) {
        throw new Error(json.source === "static" ? "Sign-up is temporarily unavailable" : "Something went wrong");
      }
      setWasAlreadySubscribed(json.data.alreadySubscribed);
      setStatus("success");
    } catch (e) {
      setStatus("error");
      setErrorMsg(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <GlassCard className="flex flex-col items-center gap-3 py-10 text-center">
        <CheckCircle2 className="size-10 text-green-500" aria-hidden />
        <h3 className="font-display text-2xl font-bold text-foreground">
          {wasAlreadySubscribed ? "Still on the grid" : "You're on the grid"}
        </h3>
        <p className="max-w-md text-sm text-muted-foreground">
          {wasAlreadySubscribed
            ? "You were already subscribed — we've refreshed your reminder windows."
            : "Check your inbox to confirm. Race reminders are heading your way."}
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 sm:p-8">
      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
        <BellRing className="size-4" aria-hidden />
        Email reminders
      </div>
      <h3 className="mt-3 font-display text-2xl font-bold text-foreground">
        Never miss a green light
      </h3>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        Get a heads-up before every F1 session. Pick your windows, hit
        subscribe, and we&apos;ll handle the rest — no spam, ever.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5" noValidate>
        <div className="space-y-2">
          <label
            htmlFor="newsletter-email"
            className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground"
          >
            Email address
          </label>
          <Input
            id="newsletter-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={Boolean(formState.errors.email)}
            className="h-11"
            {...register("email")}
          />
          {formState.errors.email && (
            <p role="alert" className="text-xs text-destructive">
              {formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <span className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
            Remind me
          </span>
          <Controller
            control={control}
            name="reminderWindows"
            render={({ field }) => (
              <>
                <div className="flex flex-wrap gap-2">
                  {REMINDER_WINDOWS.map((w) => {
                    const active = field.value.includes(w.id);
                    return (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => {
                          const next = active
                            ? field.value.filter((id) => id !== w.id)
                            : [...field.value, w.id];
                          field.onChange(next);
                        }}
                        aria-pressed={active}
                        className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition-colors ${
                          active
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-border text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"
                        }`}
                      >
                        {active ? (
                          <Check className="size-3.5" aria-hidden />
                        ) : null}
                        {w.label}
                      </button>
                    );
                  })}
                </div>
                {formState.errors.reminderWindows && (
                  <p role="alert" className="text-xs text-destructive">
                    {formState.errors.reminderWindows.message}
                  </p>
                )}
              </>
            )}
          />
        </div>

        {status === "error" && (
          <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errorMsg}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={status === "submitting"}
          className="w-full sm:w-auto"
        >
          <Send aria-hidden />
          {status === "submitting" ? "Subscribing…" : "Subscribe"}
        </Button>
      </form>
    </GlassCard>
  );
}
