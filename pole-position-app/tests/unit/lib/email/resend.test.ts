import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import React from "react";
import { getResend, renderEmail, sendEmail } from "@/lib/email/resend";
import { WelcomeEmail } from "@/lib/email/templates/welcome";
import { ReminderEmail } from "@/lib/email/templates/reminder";
import { UnsubscribeConfirmEmail } from "@/lib/email/templates/unsubscribe-confirm";

const mocks = vi.hoisted(() => {
  const send = vi.fn();
  const ResendMock = vi.fn(function () {
    return { emails: { send } };
  });
  return { send, ResendMock };
});

vi.mock("resend", () => ({
  Resend: mocks.ResendMock,
}));

describe("lib/email/resend", () => {
  const original = { ...process.env };

  beforeEach(() => {
    process.env.RESEND_API_KEY = "re_test";
    mocks.ResendMock.mockClear();
    mocks.send.mockReset();
  });

  afterEach(() => {
    process.env = { ...original };
  });

  it("returns null without an API key", () => {
    delete process.env.RESEND_API_KEY;
    expect(getResend()).toBeNull();
  });

  it("creates a cached Resend client", () => {
    const client = getResend();
    expect(client).toBeTruthy();
    expect(mocks.ResendMock).toHaveBeenCalledWith("re_test");
  });

  it("renders email templates to html and text", async () => {
    const { html, text } = await renderEmail(
      React.createElement(WelcomeEmail, {
        email: "ada@example.com",
        reminderWindows: ["24h", "1h"],
        unsubscribeUrl: "https://example.com/u/tok",
      })
    );
    expect(html).toContain("ada@example.com");
    expect(text).toContain("ada@example.com");
  });

  it("renders the unsubscribe confirmation template", async () => {
    const { html } = await renderEmail(
      React.createElement(UnsubscribeConfirmEmail, { email: "ada@example.com" })
    );
    expect(html).toContain("ada@example.com");
  });

  it("returns false without a client", async () => {
    delete process.env.RESEND_API_KEY;
    const sent = await sendEmail({
      to: "a@b.com",
      subject: "hi",
      react: React.createElement(WelcomeEmail, {
        email: "a@b.com",
        reminderWindows: [],
        unsubscribeUrl: "https://example.com/u/tok",
      }),
    });
    expect(sent).toBe(false);
  });

  it("sends and returns true on success", async () => {
    mocks.send.mockResolvedValue({ error: null });
    const sent = await sendEmail({
      to: "a@b.com",
      subject: "hi",
      react: React.createElement(ReminderEmail, {
        email: "ada@example.com",
        sessionName: "British Grand Prix",
        sessionType: "Race",
        circuitName: "Silverstone",
        startsAtLabel: "Sun 5 Jul",
        timezone: "UTC",
        localTimeLabel: "14:00",
        remainingLabel: "1 hour",
        unsubscribeUrl: "https://example.com/u/tok",
      }),
    });
    expect(sent).toBe(true);
    expect(mocks.send).toHaveBeenCalledTimes(1);
    const [payload] = mocks.send.mock.calls[0];
    expect(payload.from).toContain("onboarding@resend.dev");
    expect(payload.to).toBe("a@b.com");
    expect(payload.subject).toBe("hi");
  });

  it("honours EMAIL_FROM and reports failures", async () => {
    process.env.EMAIL_FROM = "F1 <reminders@pole-position.app>";
    mocks.send.mockResolvedValue({ error: new Error("rejected") });
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const sent = await sendEmail({
      to: "a@b.com",
      subject: "hi",
      react: React.createElement(WelcomeEmail, {
        email: "a@b.com",
        reminderWindows: [],
        unsubscribeUrl: "https://example.com/u/tok",
      }),
    });
    expect(sent).toBe(false);
    expect(mocks.send.mock.calls[0][0].from).toBe(
      "F1 <reminders@pole-position.app>"
    );
    spy.mockRestore();
  });
});
