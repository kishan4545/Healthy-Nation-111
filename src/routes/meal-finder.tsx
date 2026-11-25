import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { recommend, type Budget, type Diet, type Goal } from "@/data/menu";
import { DishCard, seo } from "@/components/site";

export const Route = createFileRoute("/meal-finder")({
  head: () => seo("Meal Finder — Find Your Perfect Healthy Meal | Healthy Nation", "Answer 3 quick questions about your fitness goal, diet and budget and get three Healthy Nation dishes picked for you.", "/meal-finder"),
  component: Finder,
});

const steps = [
  { q: "What's your goal?", opts: [["lose", "🔥", "Lose weight"], ["muscle", "💪", "Build muscle"], ["energy", "⚡", "Stay energized"]] },
  { q: "How do you eat?", opts: [["veg", "🥦", "Vegetarian"], ["nonveg", "🍗", "Non-veg is fine"], ["vegan", "🌱", "Vegan"]] },
  { q: "Budget per dish?", opts: [["200", "💸", "Under ₹200"], ["300", "💰", "Under ₹300"], ["1000", "👑", "Anything goes"]] },
] as const;

function Finder() {
  const [ans, setAns] = useState<string[]>([]);
  const step = ans.length;
  const done = step === 3;
  const picks = done ? recommend(ans[0] as Goal, ans[1] as Diet, Number(ans[2]) as Budget) : [];
  return (
    <section className="mx-auto max-w-5xl px-4 py-14">
      <h1 className="text-center text-5xl font-extrabold md:text-6xl">Meal Finder</h1>
      <div className="mx-auto mt-6 flex max-w-xs gap-2">{[0, 1, 2].map((i) => <div key={i} className={`h-2 flex-1 rounded-full ${i < step ? "bg-primary" : "bg-muted"}`} />)}</div>
      {!done ? (
        <div key={step} className="animate-in fade-in slide-in-from-bottom-4 mt-10 text-center duration-500">
          <p className="text-sm font-bold text-leaf">Step {step + 1} of 3</p>
          <h2 className="mt-2 text-3xl font-extrabold md:text-4xl">{steps[step]!.q}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {steps[step]!.opts.map(([v, e, l]) => <button key={v} onClick={() => setAns([...ans, v])} className="rounded-2xl border-2 bg-card p-8 text-xl font-bold shadow-pop transition hover:-translate-y-1 hover:border-primary"><span className="block text-5xl">{e}</span><span className="mt-3 block">{l}</span></button>)}
          </div>
          {step > 0 && <button onClick={() => setAns(ans.slice(0, -1))} className="mt-6 text-sm font-semibold text-muted-foreground underline">← Back</button>}
        </div>
      ) : (
        <div className="animate-in fade-in mt-10 duration-500">
          <h2 className="text-center text-3xl font-extrabold">Your top 3 picks 🎯</h2>
          {picks.length ? <div className="mt-8 grid gap-6 md:grid-cols-3">{picks.map((d) => <DishCard key={d.id} d={d} />)}</div> : <p className="mt-8 text-center text-muted-foreground">Nothing matches that combo — try a bigger budget.</p>}
          <div className="mt-8 text-center"><button onClick={() => setAns([])} className="btn-ghost text-deep">Start over</button></div>
        </div>
      )}
    </section>
  );
}
