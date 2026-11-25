import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CalendarDays, CheckCircle2, Clock3, PackageCheck, RefreshCw, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getAdminDashboard, updateSubscriptionStatus, type SubscriptionRequest } from "@/lib/dashboard.functions";
import { seo } from "@/components/site";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DEMO_ADMIN, DEMO_REQUESTS } from "@/lib/demo-account";
import { getAuthRedirectUrl, getSignInErrorMessage } from "@/lib/auth-redirect";
import { getSupabaseConfigurationErrorMessage } from "@/integrations/supabase/config";

export const Route = createFileRoute("/admin")({
  head: () => seo("Admin Dashboard — Healthy Nation", "Manage Healthy Nation subscription requests.", "/admin"),
  component: AdminDashboard,
});

function getRequestCounts(requests: SubscriptionRequest[]) {
  const now = new Date();
  return {
    total: requests.length,
    active: requests.filter((request) => request.status?.toLowerCase() === "active").length,
    pending: requests.filter((request) => ["pending", "new"].includes(request.status?.toLowerCase())).length,
    thisMonth: requests.filter((request) => {
      const created = new Date(request.created_at);
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length,
  };
}

function AdminSignIn({ onDemoSignIn }: { onDemoSignIn: () => void }) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");

  async function demoSignIn(event: React.FormEvent) {
    event.preventDefault();
    if (email.trim().toLowerCase() === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      onDemoSignIn();
    } else {
      setMessage("Use the demo admin credentials shown below.");
    }
  }

  async function sendLink(event: React.FormEvent) {
    event.preventDefault();
    setSending(true);
    setMessage("");
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: getAuthRedirectUrl("/admin") },
      });
      setMessage(error ? getSignInErrorMessage(error) : "Check your email for the secure sign-in link.");
    } catch (error) {
      setMessage(
        getSupabaseConfigurationErrorMessage(error) ??
          "We couldn't send the sign-in link. Please check your connection and try again.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mt-6 grid gap-5">
      <form onSubmit={sendLink} className="grid gap-3">
        <label htmlFor="admin-email" className="text-sm font-semibold">Administrator email</label>
        <input id="admin-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm" placeholder="admin@example.com" />
        <Button type="submit" disabled={sending}>{sending ? "Sending…" : "Email me a sign-in link"}</Button>
      </form>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
      <div className="border-t pt-5"><p className="text-xs font-bold uppercase text-leaf">Demo login</p><form onSubmit={demoSignIn} className="mt-3 grid gap-3"><Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="admin@healthynation.demo" /><Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required placeholder="Password" /><Button type="submit" variant="outline">Open demo admin</Button><p className="text-xs text-muted-foreground">{DEMO_ADMIN.email}<br />Password: <strong>{DEMO_ADMIN.password}</strong></p></form></div>
    </div>
  );
}

function AdminDashboard() {
  const [requests, setRequests] = useState<SubscriptionRequest[]>([]);
  const [counts, setCounts] = useState({ total: 0, active: 0, pending: 0, thisMonth: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const load = useServerFn(getAdminDashboard);
  const updateStatus = useServerFn(updateSubscriptionStatus);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (demoMode) {
        setRequests(DEMO_REQUESTS);
        setCounts(getRequestCounts(DEMO_REQUESTS));
        setAuthorized(true);
        setLoading(false);
        return;
      }
      const result = await load();
      setRequests(result.requests);
      setCounts(result.counts);
      setAuthorized(true);
    } catch (caught) {
      setError(
        getSupabaseConfigurationErrorMessage(caught) ??
          (caught instanceof Error
            ? caught.message
            : "Could not load subscription requests. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  }, [demoMode, load]);

  useEffect(() => {
    if (demoMode) {
      setLoading(false);
      return;
    }

    let active = true;
    let unsubscribe = () => {};
    try {
      const auth = supabase.auth;
      const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
        if (!active || event === "INITIAL_SESSION") return;
        queueMicrotask(() => {
          if (!active) return;
          if (session) {
            if (event === "SIGNED_IN") {
              setAuthorized(false);
              setRequests([]);
              setCounts({ total: 0, active: 0, pending: 0, thisMonth: 0 });
            }
            void refresh();
          }
          else {
            setAuthorized(false);
            setRequests([]);
            setCounts({ total: 0, active: 0, pending: 0, thisMonth: 0 });
            setLoading(false);
          }
        });
      });
      unsubscribe = () => subscription.unsubscribe();

      void auth.getSession()
        .then(({ data, error }) => {
          if (!active) return;
          if (error) throw error;
          if (data.session) void refresh();
          else setLoading(false);
        })
        .catch(() => {
          if (active) {
            setError("We couldn't check your sign-in. Please refresh and try again.");
            setLoading(false);
          }
        });
    } catch (caught) {
      setError(
        getSupabaseConfigurationErrorMessage(caught) ??
          "Supabase sign-in is unavailable. Please contact the site administrator.",
      );
      setLoading(false);
    }

    return () => {
      active = false;
      unsubscribe();
    };
  }, [demoMode, refresh]);

  async function changeStatus(id: string, status: string) {
    const previous = requests.find((request) => request.id === id);
    if (!previous) return;
    setError("");
    if (demoMode) {
      const updated = requests.map((request) => request.id === id ? { ...request, status } : request);
      setRequests(updated);
      setCounts(getRequestCounts(updated));
      return;
    }
    setRequests((current) => current.map((request) => request.id === id ? { ...request, status } : request));
    try {
      await updateStatus({ data: { id, status } });
      await refresh();
    } catch (caught) {
      setRequests((current) => current.map((request) => request.id === id ? { ...request, status: previous.status } : request));
      setError(
        getSupabaseConfigurationErrorMessage(caught) ??
          (caught instanceof Error
            ? caught.message
            : "Could not update this request. Please try again."),
      );
    }
  }

  async function signOut() {
    if (!demoMode) {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        setError("We couldn't sign you out. Please try again.");
        return;
      }
    }
    setDemoMode(false);
    setRequests([]);
    setAuthorized(false);
    setCounts({ total: 0, active: 0, pending: 0, thisMonth: 0 });
  }

  const cards = [
    { label: "Subscription requests", value: counts.total, icon: Users },
    { label: "Active plans", value: counts.active, icon: CheckCircle2 },
    { label: "Awaiting review", value: counts.pending, icon: Clock3 },
    { label: "New this month", value: counts.thisMonth, icon: CalendarDays },
  ];

  if (!authorized && !loading) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="max-w-md rounded-lg border bg-card p-6">
          <PackageCheck className="mb-5 text-leaf" size={30} />
          <h1 className="text-3xl font-extrabold">Admin sign-in</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in with an account assigned the <strong>admin</strong> role in Supabase user app metadata.</p>
          <AdminSignIn onDemoSignIn={() => {
            setDemoMode(true);
            setRequests(DEMO_REQUESTS);
            setCounts(getRequestCounts(DEMO_REQUESTS));
            setAuthorized(true);
            setLoading(false);
          }} />
          {error && <p className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          <Button variant="ghost" className="mt-2 w-full" onClick={() => void refresh()}><RefreshCw /> Try again</Button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm font-bold text-leaf">Healthy Nation operations</p><h1 className="mt-2 text-4xl font-extrabold">Admin dashboard</h1></div>
        <div className="flex gap-2"><Button variant="outline" onClick={() => void refresh()}><RefreshCw size={16} /> Refresh</Button><Button variant="ghost" onClick={() => void signOut()}>Sign out</Button></div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <article key={label} className="rounded-lg border bg-card p-5"><Icon className="text-leaf" size={22} /><p className="mt-5 text-3xl font-extrabold">{value}</p><p className="mt-1 text-sm text-muted-foreground">{label}</p></article>
        ))}
      </div>

      {error && <p role="alert" className="mt-6 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      <div className="mt-8 overflow-hidden rounded-lg border bg-card">
        <div className="flex items-center justify-between border-b px-5 py-4"><h2 className="font-bold">Subscription requests</h2><span className="text-sm text-muted-foreground">{requests.length} records</span></div>
        {loading ? <p className="p-6 text-sm text-muted-foreground">Loading requests…</p> : requests.length === 0 ? <p className="p-6 text-sm text-muted-foreground">No subscription requests yet.</p> : (
          <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-secondary text-xs uppercase text-muted-foreground"><tr><th className="px-5 py-3">Customer</th><th className="px-4 py-3">Plan</th><th className="px-4 py-3">Preferences</th><th className="px-4 py-3">Received</th><th className="px-5 py-3">Status</th></tr></thead>
            <tbody>{requests.map((request) => (
              <tr key={request.id} className="border-t"><td className="px-5 py-4"><p className="font-bold">{request.name}</p><p className="mt-1 text-muted-foreground">{request.phone}</p>{request.address && <p className="mt-1 max-w-52 text-xs text-muted-foreground">{request.address}</p>}</td><td className="px-4 py-4"><p className="font-semibold">{request.plan_name}</p><p className="mt-1 text-muted-foreground">{request.duration}</p></td><td className="px-4 py-4">{request.diet}</td><td className="px-4 py-4 text-muted-foreground">{new Date(request.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td><td className="px-5 py-4"><Select value={request.status || "new"} onValueChange={(status) => void changeStatus(request.id, status)}><SelectTrigger className="w-36"><SelectValue /></SelectTrigger><SelectContent>{["new", "contacted", "active", "cancelled"].map((status) => <SelectItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</SelectItem>)}</SelectContent></Select></td></tr>
            ))}</tbody>
          </table></div>
        )}
      </div>
    </section>
  );
}
