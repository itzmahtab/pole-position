import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { verifySubscriberToken } from "@/lib/newsletter/tokens";
import { sendEmail } from "@/lib/email/resend";
import { UnsubscribeConfirmEmail } from "@/lib/email/templates/unsubscribe-confirm";
import type { ApiEnvelope } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiEnvelope<{ unsubscribed: boolean }>>> {
  const token = request.nextUrl.searchParams.get("token");
  const subscriberId = token ? verifySubscriberToken(token) : null;
  if (!subscriberId) {
    return NextResponse.json(
      {
        data: null,
        source: "static" as const,
        stale: false,
        fetchedAt: new Date().toISOString(),
      },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.warn("[newsletter] Supabase not configured; cannot unsubscribe");
    return NextResponse.json(
      {
        data: { unsubscribed: false },
        source: "static" as const,
        stale: false,
        fetchedAt: new Date().toISOString(),
      },
      { status: 503 }
    );
  }

  const { data } = await supabase
    .from("newsletter_subscribers")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("id", subscriberId)
    .select("email")
    .single();

  if (data?.email) {
    await sendEmail({
      to: data.email,
      subject: "You've unsubscribed from Pole Position",
      react: UnsubscribeConfirmEmail({ email: data.email }),
    });
  }

  return NextResponse.json({
    data: { unsubscribed: true },
    source: "static",
    stale: false,
    fetchedAt: new Date().toISOString(),
  });
}
