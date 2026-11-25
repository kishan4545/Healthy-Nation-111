import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Clock3, LogOut, Mail, Package, Utensils } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getMySubscriptions, type SubscriptionRequest } from "@/lib/dashboard.functions";
import { seo } from "@/components/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEMO_CUSTOMER, DEMO_SUBSCRIPTIONS } from "@/lib/demo-account";

export const Route = createFileRoute("/account")({
  head: () => seo("My Account — Healthy Nation", "View your Healthy Nation subscription requests and plan status.", "/account"),
  component: CustomerAccount,
});

function CustomerAccount() {
  const [email, setEmail] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [requests, setRequests] = useState<SubscriptionRequest[]>([]);
  const [demoMode, setDemoMode] = useState(false);
  const [password, setPassword] = useState("");
  const load = useServerFn(getMySubscriptions);

  const refresh = useCallback(async (authenticated: boolean) => {
    setLoading(true);
    setSignedIn(authenticated);
    setMessage("");
    if (!authenticated) {
      setRequests([]);
      setLoading(false);
      return;
    }
    setRequests([]);
    try {
      const result = await load();
      setRequests(result.requests);
    } catch {
      setMessage("We couldn't load your subscription history. Please refresh and try again.");
    } finally {
      setLoading(false);
    }
  }, [load]);

  useEffect(() => {
    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active || event === "INITIAL_SESSION") return;
      queueMicrotask(() => {
        if (active) void refresh(Boolean(session));
      });
    });

    void supabase.auth.getSession()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) throw error;
        void refresh(Boolean(data.session));
      })
      .catch(() => {
        if (active) {
          setMessage("We couldn't check your sign-in. Please refresh and try again.");
          setLoading(false);
        }
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [refresh]);

  async function handleSignIn(event: React.FormEvent) {
    event.preventDefault();
    setSending(true);
    setMessage("");
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: `${window.location.origin}/account` },
      });
      setMessage(error ? "We couldn't send the sign-in link. Please try again." : "Check your email for your secure sign-in link.");
    } catch {
      setMessage("We couldn't send the sign-in link. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  async function signOut() {
    if (!demoMode) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setMessage("We couldn't sign you out. Please try again.");
        return;
      }
    }
    setRequests([]);
    setSignedIn(false);
    setDemoMode(false);
  }

  function signInDemo(event: React.FormEvent) {
    event.preventDefault();
    if (email.trim().toLowerCase() === DEMO_CUSTOMER.email && password === DEMO_CUSTOMER.password) {
      setDemoMode(true);
      setSignedIn(true);
      setRequests(DEMO_SUBSCRIPTIONS);
      setMessage("Demo customer session active.");
    } else {
      setMessage("Use the demo customer credentials shown below.");
    }
  }

  if (loading) return <section className="mx-auto max-w-5xl px-4 py-16 text-muted-foreground">Loading your account…</section>;

  if (!signedIn) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-14">
        <div className="grid gap-8 rounded-lg border bg-card p-6 md:grid-cols-[1fr_320px] md:p-10">
          <div><p className="text-sm font-bold text-leaf">Customer account</p><h1 className="mt-3 max-w-xl text-4xl font-extrabold">Your meal plans, in one place.</h1><p className="mt-4 max-w-xl text-muted-foreground">Sign in to see the subscription requests linked to your email and follow their status.</p></div>
          <div className="grid gap-4">
            <form onSubmit={handleSignIn} className="rounded-md bg-secondary p-5"><Mail className="text-leaf" /><h2 className="mt-4 text-xl font-bold">Sign in securely</h2><label htmlFor="account-email" className="mt-5 block text-sm font-semibold">Email address</label><Input id="account-email" className="mt-2 bg-background" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="you@example.com" /><Button type="submit" className="mt-3 w-full" disabled={sending}>{sending ? "Sending link…" : "Email me a sign-in link"}</Button></form>
            <form onSubmit={signInDemo} className="rounded-md border p-5"><p className="text-xs font-bold uppercase text-leaf">Demo login</p><h2 className="mt-2 text-lg font-bold">Customer preview</h2><div className="mt-4 grid gap-3"><Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="customer@healthynation.demo" /><Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required placeholder="Password" /><Button type="submit" variant="outline">Open demo account</Button></div><p className="mt-3 text-xs text-muted-foreground">{DEMO_CUSTOMER.email}<br />Password: <strong>{DEMO_CUSTOMER.password}</strong></p></form>
            {message && <p className="text-sm text-muted-foreground">{message}</p>}
          </div>
        </div>
      </section>
    );
  }

  const active = requests.filter((request) => request.status?.toLowerCase() === "active").length;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold text-leaf">Customer account</p><h1 className="mt-2 text-4xl font-extrabold">My meal plans</h1>{demoMode && <p className="mt-2 text-xs font-bold text-leaf">DEMO SESSION</p>}</div><Button variant="outline" onClick={() => void signOut()}><LogOut /> Sign out</Button></div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3"><article className="rounded-lg border bg-card p-5"><Package className="text-leaf" /><p className="mt-5 text-3xl font-extrabold">{requests.length}</p><p className="text-sm text-muted-foreground">Plan requests</p></article><article className="rounded-lg border bg-card p-5"><CheckCircle2 className="text-leaf" /><p className="mt-5 text-3xl font-extrabold">{active}</p><p className="text-sm text-muted-foreground">Active plans</p></article><article className="rounded-lg border bg-card p-5"><Utensils className="text-leaf" /><p className="mt-5 text-3xl font-extrabold">{requests.reduce((total, request) => total + (request.duration === "Monthly" ? 30 : 7), 0)}</p><p className="text-sm text-muted-foreground">Selected meal-cycle days</p></article></div>

      {message && <p className="mt-6 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{message}</p>}
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {requests.length === 0 ? <div className="rounded-lg border bg-card p-6"><h2 className="text-xl font-bold">No plans yet</h2><p className="mt-2 text-sm text-muted-foreground">Your submitted subscription requests will appear here.</p><Button asChild className="mt-5"><Link to="/subscriptions">Explore meal plans</Link></Button></div> : requests.map((request) => {
          const status = request.status?.toLowerCase() || "new";
          const StatusIcon = status === "active" || status === "contacted" ? CheckCircle2 : Clock3;
          return <article key={request.id} className="rounded-lg border bg-card p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase text-muted-foreground">{request.duration}</p><h2 className="mt-2 text-2xl font-extrabold">{request.plan_name}</h2></div><span className="flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-sm font-bold"><StatusIcon size={16} />{status.charAt(0).toUpperCase() + status.slice(1)}</span></div><dl className="mt-6 grid grid-cols-2 gap-4 text-sm"><div><dt className="text-muted-foreground">Diet</dt><dd className="mt-1 font-semibold">{request.diet}</dd></div><div><dt className="text-muted-foreground">Submitted</dt><dd className="mt-1 font-semibold">{new Date(request.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</dd></div></dl>{request.address && <p className="mt-5 border-t pt-4 text-sm text-muted-foreground">Delivery: {request.address}</p>}</article>;
        })}
      </div>
    </section>
  );
}
