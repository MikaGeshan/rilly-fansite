import { describe, it, expect, vi } from "vitest";

const { createClient } = vi.hoisted(() => ({
  createClient: vi.fn(() => ({ mock: "client" })),
}));

vi.mock("@supabase/supabase-js", () => ({ createClient }));

describe("supabase client", () => {
  it("creates a client using the configured env vars and is exported", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "public-key");
    vi.resetModules();

    const { supabase } = await import("@/lib/supabase");

    expect(createClient).toHaveBeenCalledWith(
      "https://example.supabase.co",
      "public-key",
    );
    expect(supabase).toEqual({ mock: "client" });

    vi.unstubAllEnvs();
  });
});
