import { Resend } from "resend";
import { render } from "react-email";
import type { ReactElement } from "react";

export interface EmailPayload {
  to: string;
  subject: string;
  react: ReactElement;
}

let cached: Resend | null = null;

export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!cached) cached = new Resend(key);
  return cached;
}

export async function renderEmail(react: ReactElement): Promise<{ html: string; text: string }> {
  const html = await render(react);
  const text = await render(react, { plainText: true });
  return { html, text };
}

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;
  const { html, text } = await renderEmail(payload.react);
  const from = process.env.EMAIL_FROM ?? "Pole Position <onboarding@resend.dev>";
  const { error } = await resend.emails.send({
    from,
    to: payload.to,
    subject: payload.subject,
    html,
    text,
  });
  if (error) {
    console.error("[email] send failed", error);
    return false;
  }
  return true;
}
