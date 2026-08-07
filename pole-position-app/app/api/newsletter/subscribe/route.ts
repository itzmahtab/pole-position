import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { signSubscriberToken } from "@/lib/newsletter/tokens";
import { isReminderWindow } from "@/lib/newsletter/windows";
import { sendEmail } from "@/lib/email/resend";
import { WelcomeEmail } from "@/lib/email/templates/welcome";
import { appBaseUrl } from "@/lib/app-url";
import type { ApiEnvelope } from "@/types";

export const dynamic = "force-dynamic";

const SubscribeSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  reminderWindows: z
    .array(z.string())
    .refine((arr) => arr.length > 0, "Pick at least one reminder window")
    .transform((arr) =>
      [...new Set(arr)].filter(isReminderWindow)
    ),
  timezone: z.string().max(64).default("UTC"),
  favoriteDriver: z.string().max(80).optional().nullable(),
});

export interface SubscribeResponse {
  subscribed: boolean;
  alreadySubscribed: boolean;
}

export async function POST(
  request: Request
): Promise<NextResponse<ApiEnvelope<SubscribeResponse>>> {
  const envelope = (data: SubscribeResponse | null, status = 200) =>
    NextResponse.json(
      {
        data,
        source: "static" as const,
        stale: false,
        fetchedAt: new Date().toISOString(),
      },
      { status }
    );

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return envelope(null, 400);
  }

  const parsed = SubscribeSchema.safeParse(body);
  if (!parsed.success) {
    return envelope(null, 400);
  }

  const { email, reminderWindows, timezone, favoriteDriver } = parsed.data;

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.warn("[newsletter] Supabase not configured; storing nothing");
    return envelope({ subscribed: true, alreadySubscribed: false });
  }

  // Re-activate if the subscriber previously unsubscribed.
  const existing = await supabase
    .from("newsletter_subscribers")
    .select("id, unsubscribed_at")
    .eq("email", email)
    .maybeSingle();

  let subscriberId: string;
  let alreadySubscribed = false;

  if (existing.data) {
    alreadySubscribed = existing.data.unsubscribed_at == null;
    const { error } = await supabase
      .from("newsletter_subscribers")
      .update({
        reminder_windows: reminderWindows,
        timezone,
        favorite_driver: favoriteDriver ?? null,
        unsubscribed_at: null,
      })
      .eq("id", existing.data.id);
    if (error) {
      console.error("[newsletter] update failed", error.message);
      return envelope(null, 500);
    }
    subscriberId = existing.data.id;
  } else {
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email,
        reminder_windows: reminderWindows,
        timezone,
        favorite_driver: favoriteDriver ?? null,
      })
      .select("id")
      .single();
    if (error) {
      console.error("[newsletter] insert failed", error.message);
      return envelope(null, 500);
    }
    subscriberId = data.id;
  }

  const token = signSubscriberToken(subscriberId);
  const unsubscribeUrl = `${appBaseUrl()}/api/newsletter/unsubscribe?token=${encodeURIComponent(
    token
  )}`;

  await sendEmail({
    to: email,
    subject: "Welcome to Pole Position",
    react: WelcomeEmail({
      email,
      reminderWindows,
      unsubscribeUrl,
    }),
  });

  return envelope({ subscribed: true, alreadySubscribed });
}
