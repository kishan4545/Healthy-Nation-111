import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type SubscriptionRequest = {
  id: string;
  created_at: string;
  plan_name: string;
  duration: string;
  diet: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  notes: string | null;
  status: string;
};

function isAdmin(claims: Record<string, unknown>) {
  const appMetadata = claims["app_metadata"] as Record<string, unknown> | undefined;
  const roles = appMetadata?.["roles"];
  return appMetadata?.["role"] === "admin"
    || (Array.isArray(roles) && roles.includes("admin"));
}

export const getAdminDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    if (!isAdmin(context.claims as Record<string, unknown>)) {
      throw new Error("Forbidden: administrator access required");
    }

    const { data, error } = await context.supabase
      .from("subscription_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Could not load subscription requests:", error.message);
      throw new Error("Could not load subscription requests. Check the subscription access policies in Supabase.");
    }

    const requests = (data ?? []) as SubscriptionRequest[];
    const activeStatuses = new Set(["active"]);
    const counts = {
      total: requests.length,
      active: requests.filter((request) => activeStatuses.has(request.status?.toLowerCase())).length,
      pending: requests.filter((request) => ["pending", "new"].includes(request.status?.toLowerCase())).length,
      thisMonth: requests.filter((request) => {
        const created = new Date(request.created_at);
        const now = new Date();
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
      }).length,
    };

    return { requests, counts };
  });

export const updateSubscriptionStatus = createServerFn({ method: "POST" })
  .validator((input: { id: string; status: string }) => input)
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    if (!isAdmin(context.claims as Record<string, unknown>)) {
      throw new Error("Forbidden: administrator access required");
    }

    const allowed = ["new", "contacted", "active", "cancelled"];
    if (!allowed.includes(data.status)) throw new Error("Invalid status");

    const { error } = await context.supabase
      .from("subscription_requests")
      .update({ status: data.status })
      .eq("id", data.id);

    if (error) {
      console.error("Could not update subscription status:", error.message);
      throw new Error("Could not update subscription status. Check the subscription access policies in Supabase.");
    }
    return { ok: true as const };
  });

export const getMySubscriptions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const claims = context.claims as Record<string, unknown>;
    const email = typeof claims["email"] === "string" ? claims["email"] : null;
    if (!email) return { requests: [] as SubscriptionRequest[] };

    const { data, error } = await context.supabase
      .from("subscription_requests")
      .select("*")
      .ilike("email", email)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Could not load customer subscriptions:", error.message);
      throw new Error("Could not load your subscriptions. Please try again or contact the kitchen.");
    }
    return { requests: (data ?? []) as SubscriptionRequest[] };
  });
