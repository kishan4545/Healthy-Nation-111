import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getSupabaseConfig,
  getSupabaseConfigurationErrorMessage,
} from "@/integrations/supabase/config";

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

  it("explains how to configure a deployment when settings are missing", () => {
    vi.stubEnv("SUPABASE_URL", "");
    vi.stubEnv("SUPABASE_PUBLISHABLE_KEY", "");
    vi.stubEnv("VITE_SUPABASE_URL", "");
    vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY", "");

    let caught: unknown;
    try {
      getSupabaseConfig();
    } catch (error) {
      caught = error;
    }

    expect(getSupabaseConfigurationErrorMessage(caught)).toContain(
      "In Vercel, add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY",
    );
    expect(getSupabaseConfigurationErrorMessage(caught)).not.toContain(
      "Missing Supabase environment variable(s)",
    );
  });
});
