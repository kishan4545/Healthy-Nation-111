import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowUpRight, CalendarDays, CheckCircle2, MessageCircle, Phone, Utensils } from "lucide-react";
import { PHONE } from "@/data/menu";
import { DIETS, DURATIONS, PLANS, sampleDishOf, type Plan } from "@/data/plans";
import { requestSchema } from "@/lib/subscription-schema";
import { submitSubscriptionRequest } from "@/lib/subscriptions.functions";
import { seo } from "@/components/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/subscriptions")({
  head: () => seo("Meal Plans & Subscriptions — Healthy Nation JP Nagar", "Choose one of three meal plans at Healthy Nation in JP Nagar and start it on this site: pick your plan, how often you eat with us and your food preference.", "/subscriptions"),
  component: Subscriptions,
});

export const plans = PLANS;

const emptyFields = { name: "", phone: "", email: "", address: "", notes: "" };
type Fields = typeof emptyFields;
type Errors = Partial<Record<keyof Fields | "duration" | "diet" | "plan" | "form", string>>;

function Subscriptions() {
  const [selected, setSelected] = useState<Plan | null>(null);
  const [duration, setDuration] = useState<(typeof DURATIONS)[number]>("Weekly");
  const [diet, setDiet] = useState<(typeof DIETS)[number]>("Vegetarian");
  const [fields, setFields] = useState<Fields>(emptyFields);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const submit = useServerFn(submitSubscriptionRequest);

  const openPlan = (plan: Plan) => {
    setSelected(plan);
    setDone(false);
    setErrors({});
    setFields(emptyFields);
  };

  const set = (key: keyof Fields) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields((current) => ({ ...current, [key]: event.target.value }));

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!selected) return;
    const request = { ...fields, plan: selected.name, duration, diet };
    const parsed = requestSchema.safeParse(request);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form") as keyof Errors;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const result = await submit({ data: request });
      if (result.ok) setDone(true);
      else setErrors({ form: result.error });
    } catch {
      setErrors({ form: "We couldn't save your request. Please try again or call the kitchen." });
    } finally {
      setSubmitting(false);
    }
  }

  const summary = `${selected?.name ?? "a meal plan"} · ${duration} · ${diet}`;
  const whatsappText = `Hi Healthy Nation! I've started a meal plan on your website.\n\nPlan: ${summary}\nName: ${fields.name}\nPhone: ${fields.phone}\nEmail: ${fields.email || "not given"}\nDelivery: ${fields.address || "to be discussed"}\nNotes: ${fields.notes || "none"}\n\nPlease confirm the price, number of meals, delivery details and renewal terms.`;
  const whatsappUrl = `https://wa.me/${PHONE.replace("+", "")}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <>
      <section className="bg-deep text-deep-foreground">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <p className="flex items-center gap-2 text-sm font-bold text-accent"><CalendarDays size={18} /> Healthy Nation · Meal subscriptions</p>
          <h1 className="mt-5 max-w-3xl text-5xl font-extrabold leading-tight md:text-6xl">Healthy Nation<br /><span className="text-accent">Meal Plans</span></h1>
          <p className="mt-5 max-w-xl text-lg opacity-90">Your favourite meals, part of your routine. Pick a plan, tell us how you eat, and we'll confirm the rest.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><h2 className="text-3xl font-extrabold">Find your meal routine</h2><p className="mt-2 text-muted-foreground">Three plans · Pricing and meal counts confirmed by the kitchen.</p></div>
          <span className="flex items-center gap-2 text-sm font-semibold text-leaf"><Utensils size={18} /> Fresh from JP Nagar</span>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const sample = sampleDishOf(plan);
            return (
              <article key={plan.name} className="flex flex-col overflow-hidden rounded-lg border bg-card">
                {sample && <div className="relative aspect-[4/3] overflow-hidden"><img src={sample.image} alt={`Illustrative ${sample.name}`} width={816} height={612} className="h-full w-full object-cover" /><span className="absolute bottom-3 left-3 rounded-md bg-deep px-3 py-1 text-xs font-bold text-deep-foreground">{plan.tag}</span></div>}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-2xl font-extrabold">{plan.name}</h3>
                  <p className="mt-2 font-medium text-leaf">{plan.subtitle}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>
                  <p className="mt-5 text-sm font-semibold">{plan.categories.join(" · ")}</p>
                  <div className="mt-auto pt-6"><p className="mb-3 text-sm text-muted-foreground">Price on enquiry</p><Button className="w-full" size="lg" onClick={() => openPlan(plan)}>Start your plan <ArrowUpRight /></Button></div>
                </div>
              </article>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Photos are illustrative. Final menus, delivery availability and subscription terms are confirmed by the kitchen.</p>
      </section>

      <section className="bg-secondary">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 px-4 py-10 md:flex-row md:items-center">
          <div><h2 className="text-2xl font-extrabold">A plan that fits you</h2><p className="mt-2 max-w-2xl text-muted-foreground">Tell us your meal preferences, allergies and delivery location and we'll set it up.</p></div>
          <Button asChild variant="outline" size="lg"><a href={`tel:${PHONE}`}><Phone /> Call the kitchen</a></Button>
        </div>
      </section>

      <Dialog open={selected !== null} onOpenChange={(open) => { if (!open) { setSelected(null); setDone(false); } }}>
        <DialogContent className="max-h-[88dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-lg">
          {done ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-2xl"><CheckCircle2 className="text-leaf" /> Request received</DialogTitle>
                <DialogDescription>We've saved your meal plan request. The kitchen will call you on {fields.phone} to confirm price, meal count and delivery.</DialogDescription>
              </DialogHeader>
              <dl className="grid gap-3 rounded-md bg-secondary p-4 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Plan</dt><dd className="text-right font-semibold">{selected?.name}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-muted-foreground">How often</dt><dd className="text-right font-semibold">{duration}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Food preference</dt><dd className="text-right font-semibold">{diet}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Name</dt><dd className="text-right font-semibold">{fields.name}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Phone</dt><dd className="text-right font-semibold">{fields.phone}</dd></div>
                {fields.address && <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Delivery</dt><dd className="text-right font-semibold">{fields.address}</dd></div>}
              </dl>
              <p className="rounded-md bg-secondary p-4 text-sm text-secondary-foreground">No payment was taken on this site. We'll confirm pricing, meal counts, delivery and renewal terms with you first.</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="flex-1"><a href={whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle /> Send details on WhatsApp</a></Button>
                <Button asChild variant="outline" size="lg"><a href={`tel:${PHONE}`}><Phone /> Call now</a></Button>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selected?.name}</DialogTitle>
                <DialogDescription>Start your {selected?.name.toLowerCase()} plan. The kitchen confirms pricing, meal counts, delivery and renewal terms before anything starts.</DialogDescription>
              </DialogHeader>
              <form onSubmit={onSubmit} className="grid gap-5" noValidate>
                <fieldset>
                  <legend className="mb-3 font-semibold">How often</legend>
                  <div className="flex flex-wrap gap-4">{DURATIONS.map((value) => <label key={value} className="flex cursor-pointer items-center gap-2"><input type="radio" name="duration" value={value} checked={duration === value} onChange={() => setDuration(value)} className="accent-primary" />{value}</label>)}</div>
                </fieldset>
                <fieldset>
                  <legend className="mb-3 font-semibold">Food preference</legend>
                  <div className="flex flex-wrap gap-4">{DIETS.map((value) => <label key={value} className="flex cursor-pointer items-center gap-2"><input type="radio" name="diet" value={value} checked={diet === value} onChange={() => setDiet(value)} className="accent-primary" />{value}</label>)}</div>
                </fieldset>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="sub-name" className="mb-2 block text-sm font-semibold">Name</label>
                    <Input id="sub-name" value={fields.name} onChange={set("name")} placeholder="Your name" autoComplete="name" />
                    {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="sub-phone" className="mb-2 block text-sm font-semibold">Phone</label>
                    <Input id="sub-phone" value={fields.phone} onChange={set("phone")} placeholder="Your phone number" inputMode="tel" autoComplete="tel" />
                    {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="sub-email" className="mb-2 block text-sm font-semibold">Email <span className="font-normal text-muted-foreground">(optional)</span></label>
                  <Input id="sub-email" type="email" value={fields.email} onChange={set("email")} placeholder="you@example.com" autoComplete="email" />
                  {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="sub-address" className="mb-2 block text-sm font-semibold">Delivery area or address <span className="font-normal text-muted-foreground">(optional)</span></label>
                  <Input id="sub-address" value={fields.address} onChange={set("address")} placeholder="e.g. JP Nagar 1st Phase" autoComplete="street-address" />
                  {errors.address && <p className="mt-1 text-xs text-destructive">{errors.address}</p>}
                </div>
                <div>
                  <label htmlFor="sub-notes" className="mb-2 block text-sm font-semibold">Anything we should know <span className="font-normal text-muted-foreground">(optional)</span></label>
                  <Textarea id="sub-notes" value={fields.notes} onChange={set("notes")} placeholder="Allergies, meal timing, number of meals a day…" rows={3} />
                  {errors.notes && <p className="mt-1 text-xs text-destructive">{errors.notes}</p>}
                </div>
                {errors.form && <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{errors.form}</p>}
                <Button type="submit" size="lg" disabled={submitting}>{submitting ? "Sending…" : "Send my request"}</Button>
                <p className="text-xs text-muted-foreground">No payment is taken on this site. We'll call you to confirm the price, meal count, delivery and renewal terms before your plan starts.</p>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
