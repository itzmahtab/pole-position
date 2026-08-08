import { afterEach, describe, expect, it, vi } from "vitest";
import { getSupabaseAdmin, getSupabaseAnon } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({ __client: true })),
}));

describe("lib/supabase/server", () => {
  const original = { ...process.env };

  afterEach(() => {
    process.env = { ...original };
    vi.clearAllMocks();
  });

  it("admin returns null without credentials", () => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    expect(getSupabaseAdmin()).toBeNull();
  });

  it("admin creates a client with the service role key", () => {
    process.env.SUPABASE_URL = "https://db.example.com";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "svc";
    const client = getSupabaseAdmin();
    expect(client).toEqual({ __client: true });
    expect(createClient).toHaveBeenCalledWith("https://db.example.com", "svc", {
      auth: { persistSession: false },
    });
  });

  it("anon returns null without credentials", () => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_ANON_KEY;
    expect(getSupabaseAnon()).toBeNull();
  });

  it("anon creates a client with the anon key", () => {
    process.env.SUPABASE_URL = "https://db.example.com";
    process.env.SUPABASE_ANON_KEY = "anon";
    expect(getSupabaseAnon()).toEqual({ __client: true });
    expect(createClient).toHaveBeenCalledWith("https://db.example.com", "anon", {
      auth: { persistSession: false },
    });
  });
});
