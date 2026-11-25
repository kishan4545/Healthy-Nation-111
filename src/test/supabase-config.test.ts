import { afterEach, describe, expect, it, vi } from "vitest";
import { getSupabaseConfig } from "@/integrations/supabase/config";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("Supabase deployment configuration", () => {
  it("uses server runtime variables when available", () => {
    vi.stubEnv("SUPABASE_URL", "https://runtime.example.supabase.co");
    vi.stubEnv("SUPABASE_PUBLISHABLE_KEY", "runtime-publishable-key");

    expect(getSupabaseConfig()).toEqual({
      url: "https://runtime.example.supabase.co",
      publishableKey: "runtime-publishable-key",
    });
  });
});
