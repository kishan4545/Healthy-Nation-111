import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero-bowl.jpg";
import { MENU, RATING } from "@/data/menu";
import { DishCard, OrderLink, Reveal, seo } from "@/components/site";

export const Route = createFileRoute("/")({
  head: () => seo("Healthy Nation JP Nagar — Eat Clean. Feel Unstoppable.", "Order high-protein bowls, salads, wraps and cold-pressed juices from Healthy Nation, JP Nagar, Bengaluru. Rated 4.2★ on Zomato.", "/"),
  component: Home,
});

const reviews = [
  ["Finally a place where healthy actually tastes amazing. The BBQ paneer bowl is my post-gym ritual.", "Ananya R.", "JP Nagar"],
  ["Whey oats for breakfast changed my mornings. Filling, tasty and macros on point.", "Karthik S.", "Jayanagar"],
  ["Fast delivery, fresh food, honest portions. The Gut Reset juice is a must.", "Priya M.", "BTM Layout"],
];

function Home() {
  const best = MENU.filter((d) => d.bestseller);
  return (
    <>
      <section className="relative isolate overflow-hidden bg-deep text-deep-foreground">
        <img src={hero} alt="Barbecue paneer burrito bowl with avocado, beans and corn" width={1600} height={1024} className="absolute inset-0 -z-10 h-full w-full object-cover opacity-60" fetchPriority="high" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-deep via-deep/60 to-transparent" />
        {["🥑", "🍋", "🌿", "🍓"].map((e, i) => <span key={e} aria-hidden className="floaty absolute text-4xl md:text-6xl" style={{ top: `${15 + i * 18}%`, [i % 2 ? "right" : "left"]: `${6 + i * 3}%`, animationDelay: `${i * 1.2}s` }}>{e}</span>)}
        <div className="mx-auto flex min-h-[82vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-32">
          <p className="mb-4 w-fit rounded-full bg-accent px-3 py-1 text-sm font-bold text-accent-foreground">JP Nagar's clean-eating kitchen</p>
          <h1 className="max-w-3xl text-5xl font-extrabold leading-[0.95] md:text-8xl">Eat Clean.<br /><span className="text-accent">Feel Unstoppable.</span></h1>
          <p className="mt-5 max-w-xl text-lg opacity-90">Protein-packed bowls, whey oats, salads and cold-pressed juices — made fresh, delivered fast.</p>
          <div className="mt-8 flex flex-wrap gap-3"><OrderLink>Order on Zomato →</OrderLink><Link to="/subscriptions" className="btn-ghost">Explore meal plans</Link><Link to="/menu" className="btn-ghost">See the menu</Link></div>
        </div>
      </section>

      <section className="bg-citrus text-primary-foreground">
        <div className="mx-auto grid max-w-6xl grid-cols-3 gap-2 px-4 py-5 text-center text-sm font-bold md:text-lg">
          <p>⭐ {RATING} on Zomato</p><p>⚡ ~30 min delivery</p><p>🌱 Made fresh in JP Nagar</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <Reveal className="flex items-end justify-between gap-4"><h2 className="text-4xl font-extrabold md:text-5xl">Bestsellers</h2><Link to="/menu" className="font-bold text-leaf">Full menu →</Link></Reveal>
        <div className="-mx-4 mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4">
          {best.map((d) => <div key={d.id} className="w-72 shrink-0 snap-start"><DishCard d={d} /></div>)}
        </div>
      </section>

      <section className="bg-secondary py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal><h2 className="text-4xl font-extrabold md:text-5xl">Why Healthy Nation</h2></Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[["🥬", "Fresh ingredients", "Prepped every morning. Real fruit, crisp veggies, low-fat paneer and lean chicken breast."], ["💪", "Macro-friendly meals", "Up to 38g protein per bowl, whey-loaded oats and protein mojitos for every goal."], ["😋", "No-compromise taste", "Makhani, tandoori, chipotle, BBQ — the flavours you love, minus the guilt."]].map(([i, t, b], k) => (
              <Reveal key={t} delay={k * 120} className="rounded-2xl bg-card p-7 shadow-pop"><p className="text-4xl">{i}</p><h3 className="mt-4 text-2xl font-bold">{t}</h3><p className="mt-2 text-muted-foreground">{b}</p></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <Reveal><h2 className="text-4xl font-extrabold md:text-5xl">Loved across South Bengaluru</h2></Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reviews.map(([q, n, a], k) => <Reveal key={n} delay={k * 120} className="rounded-2xl border bg-card p-6"><p className="text-primary">★★★★★</p><p className="mt-3 text-lg">“{q}”</p><p className="mt-4 font-bold">{n} <span className="font-normal text-muted-foreground">· {a}</span></p></Reveal>)}
        </div>
      </section>

      <section className="px-4 pb-20">
        <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-deep px-6 py-16 text-center text-deep-foreground">
          <span aria-hidden className="floaty absolute left-6 top-6 text-5xl">🥗</span><span aria-hidden className="floaty absolute bottom-6 right-8 text-5xl" style={{ animationDelay: "2s" }}>🍊</span>
          <h2 className="text-4xl font-extrabold md:text-6xl">Hungry? Your best meal<br />is 30 minutes away.</h2>
          <div className="mt-8"><OrderLink>Order Now on Zomato</OrderLink></div>
        </Reveal>
      </section>
    </>
  );
}
