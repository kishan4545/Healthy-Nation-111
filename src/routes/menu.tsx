import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CATEGORIES, MENU, TAGS, tagsOf, type Category, type Tag } from "@/data/menu";
import { DishCard, Reveal, seo } from "@/components/site";

export const Route = createFileRoute("/menu")({
  head: () => seo("Menu — Healthy Nation JP Nagar | Bowls, Salads, Smoothies", "Browse the Healthy Nation menu: burrito bowls, salads, wraps, sandwiches, whey oats, smoothies and cold-pressed juices with calories and protein.", "/menu"),
  component: MenuPage,
});

function MenuPage() {
  const [cat, setCat] = useState<Category | "All">("All");
  const [tags, setTags] = useState<Tag[]>([]);
  const list = MENU.filter((d) => (cat === "All" || d.category === cat) && tags.every((t) => tagsOf(d).includes(t)));
  const chip = (on: boolean) => `rounded-full border px-4 py-2 text-sm font-semibold transition ${on ? "border-deep bg-deep text-deep-foreground" : "bg-card hover:border-deep"}`;
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <Reveal><h1 className="text-5xl font-extrabold md:text-6xl">The Menu</h1><p className="mt-2 text-muted-foreground">Prices as on Zomato. Calories and protein are approximate per serving.</p></Reveal>
      <div className="sticky top-[57px] z-30 -mx-4 mt-6 space-y-3 bg-background/95 px-4 py-3 backdrop-blur">
        <div className="flex gap-2 overflow-x-auto pb-1">{(["All", ...CATEGORIES] as const).map((c) => <button key={c} onClick={() => setCat(c)} className={`shrink-0 ${chip(cat === c)}`} aria-pressed={cat === c}>{c}</button>)}</div>
        <div className="flex flex-wrap gap-2">{TAGS.map((t) => { const on = tags.includes(t); return <button key={t} aria-pressed={on} onClick={() => setTags(on ? tags.filter((x) => x !== t) : [...tags, t])} className={`rounded-full border-2 px-3 py-1 text-xs font-bold ${on ? "border-primary bg-primary text-primary-foreground" : "border-primary/40 text-foreground"}`}>{on ? "✓ " : "+ "}{t}</button>; })}</div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{list.length} dishes</p>
      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{list.map((d) => <DishCard key={d.id} d={d} />)}</div>
      {list.length === 0 && <p className="py-16 text-center text-muted-foreground">No dishes match — try removing a filter.</p>}
    </section>
  );
}
