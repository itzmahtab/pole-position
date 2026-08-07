import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/resend";
import { ReminderEmail } from "@/lib/email/templates/reminder";
import {
  computeDueReminders,
  fetchUpcomingSessions,
} from "@/lib/newsletter/reminders";
import type { ReminderWindow } from "@/lib/newsletter/windows";
import { signSubscriberToken } from "@/lib/newsletter/tokens";
import { appBaseUrl } from "@/lib/app-url";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export interface CronResult {
  due: number;
  sent: number;
  skipped: number;
  errors: number;
}

function formatStart(dateStart: string, timezone: string): string {
  const date = new Date(dateStart);
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: timezone.replace(/^GMT/, "UTC"),
  }).format(date);
}

function windowLabel(window: ReminderWindow): string {
  switch (window) {
    case "15m":
      return "15 minutes";
    case "1h":
      return "1 hour";
    case "12h":
      return "12 hours";
    case "24h":
      return "24 hours";
  }
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<{ data: CronResult | null; ok: boolean }>> {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ data: null, ok: false }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.warn("[cron/reminders] Supabase not configured; skipping");
    return NextResponse.json({ data: null, ok: false }, { status: 503 });
  }

  const result: CronResult = { due: 0, sent: 0, skipped: 0, errors: 0 };

  let due;
  try {
    const sessions = await fetchUpcomingSessions();
    due = computeDueReminders(sessions);
  } catch (e) {
    console.error("[cron/reminders] failed to load sessions", e);
    await supabase.from("cron_logs").insert({
      emails_sent: 0,
      errors: 1,
      notes: "failed to fetch sessions",
    });
    return NextResponse.json({ data: result, ok: false }, { status: 500 });
  }
  result.due = due.length;

  for (const reminder of due) {
    const { data: subscribers } = await supabase
      .from("newsletter_subscribers")
      .select("id, email, favorite_driver")
      .eq("unsubscribed_at", null)
      .filter("reminder_windows", "cs", `{${reminder.window}}`);

    for (const sub of subscribers ?? []) {
      // Dedupe via the unique constraint on (subscriber_id, session_key, reminder_window).
      const { error: insertError } = await supabase.from("email_logs").insert({
        subscriber_id: sub.id,
        session_key: reminder.sessionKey,
        reminder_window: reminder.window,
        status: "pending",
      });

      if (insertError) {
        // Unique violation — already sent for this session+window.
        result.skipped += 1;
        continue;
      }

      const token = signSubscriberToken(sub.id);
      const unsubscribeUrl = `${appBaseUrl()}/api/newsletter/unsubscribe?token=${encodeURIComponent(
        token
      )}`;

      const ok = await sendEmail({
        to: sub.email,
        subject: `${reminder.sessionName} in ${windowLabel(reminder.window)}`,
        react: ReminderEmail({
          email: sub.email,
          sessionName: reminder.sessionName,
          sessionType: reminder.sessionType,
          circuitName: reminder.circuitName,
          startsAtLabel: formatStart(reminder.dateStart, reminder.timezone),
          timezone: reminder.timezone,
          localTimeLabel: formatStart(reminder.dateStart, reminder.timezone),
          remainingLabel: windowLabel(reminder.window),
          driverName: sub.favorite_driver,
          unsubscribeUrl,
        }),
      });

      if (ok) {
        result.sent += 1;
        await supabase
          .from("email_logs")
          .update({ status: "sent" })
          .eq("subscriber_id", sub.id)
          .eq("session_key", reminder.sessionKey)
          .eq("reminder_window", reminder.window);
      } else {
        result.errors += 1;
        await supabase
          .from("email_logs")
          .delete()
          .eq("subscriber_id", sub.id)
          .eq("session_key", reminder.sessionKey)
          .eq("reminder_window", reminder.window);
      }
    }
  }

  await supabase.from("cron_logs").insert({
    emails_sent: result.sent,
    errors: result.errors,
    notes: `due=${result.due} skipped=${result.skipped}`,
  });

  return NextResponse.json({ data: result, ok: true });
}
