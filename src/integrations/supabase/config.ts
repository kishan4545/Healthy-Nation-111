type SupabaseConfig = {
  url: string;
  publishableKey: string;
};

export function getSupabaseConfigurationErrorMessage(error: unknown): string | null {
  const message =
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
      ? error.message
      : "";

  if (!message.includes("Missing Supabase environment variable")) {
    return null;
  }

  return "Sign-in is unavailable because Supabase isn't configured for this deployment. In Vercel, add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY under Project Settings > Environment Variables, then redeploy.";
}

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
    throw new Error(
      `Missing Supabase environment variable(s): ${missing.join(", ")}. ` +
        "Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in this deployment's build environment, then rebuild and redeploy. " +
        "Server-only SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY variables do not configure the browser bundle. Never use the service-role key for a VITE_ variable.",
    );
  }

  return { url, publishableKey };
}
