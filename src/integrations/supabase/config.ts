type SupabaseConfig = {
  url: string;
  publishableKey: string;
};

function runtimeEnv(name: string): string | undefined {
  if (typeof process === "undefined") return undefined;
  return process.env[name];
}

export function getSupabaseConfig(): SupabaseConfig {
  const url = runtimeEnv("SUPABASE_URL") || import.meta.env["VITE_SUPABASE_URL"];
  const publishableKey =
    runtimeEnv("SUPABASE_PUBLISHABLE_KEY") ||
    import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

  const missing = [
    ...(!url ? ["VITE_SUPABASE_URL (or SUPABASE_URL)"] : []),
    ...(!publishableKey
      ? ["VITE_SUPABASE_PUBLISHABLE_KEY (or SUPABASE_PUBLISHABLE_KEY)"]
      : []),
  ];

  if (missing.length > 0) {
    throw new Error(`Missing Supabase environment variable(s): ${missing.join(", ")}.`);
  }

  return { url, publishableKey };
}
