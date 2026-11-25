import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { getSupabaseConfig } from "@/integrations/supabase/config";
import { requestSchema, type SubscriptionRequestInput } from "@/lib/subscription-schema";

export const submitSubscriptionRequest = createServerFn({ method: "POST" })
  .validator((input: SubscriptionRequestInput) => requestSchema.parse(input))
  .handler(async ({ data }) => {
    const { url, publishableKey: key } = getSupabaseConfig();
    const supabasePublic = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      // Opaque sb_ keys aren't JWTs; send only apikey, not the default Authorization bearer.
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });

    const { error } = await supabasePublic.from("subscription_requests").insert({
      plan_name: data.plan,
      duration: data.duration,
      diet: data.diet,
      name: data.name,
      phone: data.phone,
      email: data.email?.trim() ? data.email.trim() : null,
      address: data.address?.trim() ? data.address.trim() : null,
      notes: data.notes?.trim() ? data.notes.trim() : null,
    });

    if (error) {
      console.error("Meal plan request could not be saved:", error.message);
      return { ok: false as const, error: "We couldn't save your request. Please try again or call the kitchen." };
    }
    return { ok: true as const };
  });
