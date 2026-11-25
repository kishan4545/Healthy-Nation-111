import { createFileRoute } from "@tanstack/react-router";
import { ADDRESS, HOURS, PHONE } from "@/data/menu";
import { OrderLink, Reveal, seo } from "@/components/site";
import bowl from "@/assets/hero-bowl.jpg";
import salad from "@/assets/salad.jpg";
import smoothie from "@/assets/smoothie.jpg";
import oats from "@/assets/oats.jpg";
import wrap from "@/assets/wrap.jpg";
import juice from "@/assets/juice.jpg";

export const Route = createFileRoute("/about")({
  head: () => seo("About & Visit — Healthy Nation, JP Nagar 2nd Phase, Bengaluru", "Our story, kitchen values, opening hours (8:30 AM–11 PM daily), map and contact for Healthy Nation in JP Nagar, Bengaluru.", "/about"),
  component: About,
});

const faqs = [
  ["Do you deliver?", "Yes — order through Zomato for delivery across JP Nagar and nearby areas."],
  ["Are calories and protein exact?", "They're close estimates per serving. Customise on Zomato to adjust."],
  ["Do you have vegan options?", "Yes: our sprouts and black channa salads and all cold-pressed juices are plant-based."],
  ["What are your hours?", "We're open every day, 8:30 AM to 11 PM."],
];

function About() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2 md:items-center">
        <Reveal>
          <h1 className="text-5xl font-extrabold md:text-6xl">Healthy food, <span className="text-primary">Bengaluru-style.</span></h1>
          <p className="mt-5 text-lg text-muted-foreground">Healthy Nation started with a simple frustration: eating clean in Bengaluru meant boring food. So we built a kitchen in JP Nagar where makhani, tandoori and BBQ flavours meet lean protein, whole grains and real fruit.</p>
          <ul className="mt-6 space-y-2 font-semibold">{["🌿 Fresh prep, every single day", "🧈 Low-fat paneer & chicken breast only", "🍯 Natural sweeteners, no refined sugar overload", "♻️ Honest portions, honest macros"].map((v) => <li key={v}>{v}</li>)}</ul>
        </Reveal>
        <Reveal delay={150}><img src={bowl} alt="Healthy Nation burrito bowl" loading="lazy" width={1600} height={1024} className="rounded-3xl shadow-pop" /></Reveal>
      </section>

      <section className="bg-secondary py-14">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-2">
          <iframe title="Healthy Nation on map" className="h-80 w-full rounded-2xl border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${encodeURIComponent("Healthy Nation, 17th Main Road, 2nd Phase, JP Nagar, Bengaluru")}&output=embed`} />
          <div>
            <h2 className="text-4xl font-extrabold">Visit us</h2>
            <p className="mt-4">{ADDRESS}</p>
            <p className="mt-3 font-bold">{HOURS}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={`tel:${PHONE}`} className="btn-ghost text-deep">📞 Call us</a>
              <a href={`https://wa.me/${PHONE.replace("+", "")}`} target="_blank" rel="noopener noreferrer" className="btn-ghost text-leaf">💬 WhatsApp</a>
              <OrderLink />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <Reveal><h2 className="text-4xl font-extrabold">From our kitchen</h2></Reveal>
        <div className="mt-6 grid grid-cols-3 gap-2 md:gap-4">{[salad, smoothie, oats, wrap, juice, bowl].map((s, i) => <img key={i} src={s} alt="Healthy Nation dish" loading="lazy" width={400} height={400} className="aspect-square w-full rounded-xl object-cover transition hover:scale-[1.03]" />)}</div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-20">
        <h2 className="text-4xl font-extrabold">FAQ</h2>
        <div className="mt-6 space-y-3">{faqs.map(([q, a]) => <details key={q} className="rounded-2xl border bg-card p-5"><summary className="cursor-pointer text-lg font-bold">{q}</summary><p className="mt-2 text-muted-foreground">{a}</p></details>)}</div>
      </section>
    </>
  );
}
