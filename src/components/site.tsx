import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ZOMATO_URL, PHONE, ADDRESS, HOURS, type Dish, tagsOf } from "@/data/menu";

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { el.classList.add("in"); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

export function OrderLink({ children = "Order Now", className = "btn-order" }: { children?: ReactNode; className?: string }) {
  return <a href={ZOMATO_URL} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>;
}

const nav = [["/", "Home"], ["/menu", "Menu"], ["/subscriptions", "Meal Plans"], ["/meal-finder", "Meal Finder"], ["/account", "My Account"], ["/admin", "Admin"], ["/about", "About & Visit"]] as const;

export function Shell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="font-display text-xl font-extrabold text-deep">Healthy<span className="text-primary">Nation</span></Link>
          <nav className="hidden gap-4 md:flex">
            {nav.map(([to, l]) => <Link key={to} to={to} className="font-medium text-muted-foreground hover:text-foreground" activeProps={{ className: "text-leaf" }} activeOptions={{ exact: true }}>{l}</Link>)}
          </nav>
          <div className="flex items-center gap-2">
            <OrderLink className="btn-order hidden !py-2 md:inline-flex">Order on Zomato</OrderLink>
            <button aria-label="Menu" onClick={() => setOpen(!open)} className="rounded-full border px-3 py-2 md:hidden">☰</button>
          </div>
        </div>
        {open && <nav className="flex flex-col border-t px-4 py-2 md:hidden">{nav.map(([to, l]) => <Link key={to} to={to} onClick={() => setOpen(false)} className="py-2 font-medium">{l}</Link>)}</nav>}
      </header>
      <main>{children}</main>
      <footer className="bg-deep text-deep-foreground">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
          <div><p className="font-display text-2xl font-extrabold">Healthy<span className="text-accent">Nation</span></p><p className="mt-2 opacity-80">Clean, macro-friendly food made fresh in JP Nagar, Bengaluru.</p></div>
          <div className="opacity-90"><p className="font-bold">Visit</p><p className="mt-2 text-sm">{ADDRESS}</p><p className="mt-2 text-sm">{HOURS}</p></div>
          <div><p className="font-bold">Get in touch</p><a href={`tel:${PHONE}`} className="mt-2 block text-sm underline">+91 88617 59545</a><div className="mt-4"><OrderLink /></div></div>
        </div>
        <p className="pb-6 text-center text-xs opacity-60">© {new Date().getFullYear()} Healthy Nation, JP Nagar</p>
      </footer>
      <div className="fixed inset-x-0 bottom-0 z-50 p-3 md:hidden"><OrderLink className="btn-order w-full">🛵 Order on Zomato</OrderLink></div>
    </div>
  );
}

export function VegMark({ veg }: { veg: boolean }) {
  return <span title={veg ? "Veg" : "Non-veg"} aria-label={veg ? "Veg" : "Non-veg"} className={`inline-flex h-5 w-5 items-center justify-center rounded-sm border-2 bg-card ${veg ? "border-veg" : "border-nonveg"}`}><span className={`h-2.5 w-2.5 rounded-full ${veg ? "bg-veg" : "bg-nonveg"}`} /></span>;
}

export function DishCard({ d }: { d: Dish }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-pop">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={d.image} alt={d.name} loading="lazy" width={816} height={612} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute left-3 top-3"><VegMark veg={d.veg} /></div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2"><h3 className="text-lg font-bold leading-tight">{d.name}</h3><span className="font-display text-lg font-extrabold text-primary">₹{d.price}</span></div>
        <p className="mt-1 text-sm text-muted-foreground">{d.desc}</p>
        <div className="mt-3 flex flex-wrap gap-1.5 text-xs font-semibold">
          <span className="rounded-full bg-accent px-2 py-1 text-accent-foreground">~{d.kcal} kcal</span>
          <span className="rounded-full bg-secondary px-2 py-1 text-secondary-foreground">{d.protein}g protein</span>
          {tagsOf(d).filter((t) => t === "Vegan").map((t) => <span key={t} className="rounded-full bg-deep px-2 py-1 text-deep-foreground">{t}</span>)}
        </div>
        <div className="mt-auto pt-4"><OrderLink className="btn-order w-full !py-2.5">Order</OrderLink></div>
      </div>
    </article>
  );
}

export function seo(title: string, description: string, path: string) {
  return {
    meta: [
      { title }, { name: "description", content: description },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: path }],
  };
}
