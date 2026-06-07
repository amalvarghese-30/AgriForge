import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Factory, ShieldCheck, Wrench, Truck, Award, Users } from 'lucide-react';

export function Component() {
  return (
    <>
      <Helmet>
        <title>About AgriForge — Built for India's Hardest Fields</title>
        <meta name="description" content="Since 1998 AgriForge has engineered industrial-grade agricultural machinery and spare parts. Learn our story, factory and values." />
        <meta property="og:title" content="About AgriForge — Built for India's Hardest Fields" />
        <meta property="og:description" content="Industrial-grade agri machinery, since 1998. Factory, story and mission." />
      </Helmet>
      <div className="min-h-screen bg-[var(--color-beige)]">
        <section className="pt-8 pb-16 container-px mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">Est. 1998 · Pune, India</p>
          <h1 className="mt-3 font-display text-5xl sm:text-7xl leading-[0.95]">FORGED FOR THE<br />FIELDS THAT FEED US.</h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            AgriForge builds agricultural machinery and spare parts that survive the monsoon, the dust storms and the 18-hour harvest days. Two generations of metallurgists, machinists and field-engineers — one obsession with tools that don't quit.
          </p>
        </section>

        <section className="container-px mx-auto max-w-7xl pb-20 grid lg:grid-cols-3 gap-6">
          {[
            { icon: Factory, t: "65,000 sq.ft.", d: "In-house foundry, CNC machining and assembly under one roof in MIDC Pune." },
            { icon: Users, t: "240+ Engineers", d: "From metallurgy to embedded hydraulics — homegrown, field-tested teams." },
            { icon: Award, t: "ISO 9001 + CE", d: "Certified manufacturing with full traceability on every casting and bearing." },
          ].map((s) => (
            <div key={s.t} className="rounded-3xl bg-card border border-border p-8">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-foreground"><s.icon className="h-6 w-6" /></div>
              <h3 className="mt-5 font-display text-3xl">{s.t}</h3>
              <p className="mt-2 text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </section>

        <section className="bg-[var(--color-ink)] text-white py-20">
          <div className="container-px mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-accent">Our Mission</p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl">Tools that pay back<br />by harvest #1.</h2>
              <p className="mt-5 text-white/70 max-w-lg">We measure ourselves by uptime on your farm — not units shipped from our floor. Every product gets a 36-month warranty, dealer-network support and an actual phone number that a human answers.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { i: Wrench, t: "36-mo warranty" },
                { i: Truck, t: "Pan-India delivery" },
                { i: ShieldCheck, t: "OEM-grade parts" },
                { i: Users, t: "1,200+ dealers" },
              ].map((x) => (
                <div key={x.t} className="rounded-2xl border border-white/10 p-5">
                  <x.i className="h-5 w-5 text-accent" />
                  <div className="mt-3 font-semibold">{x.t}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container-px mx-auto max-w-7xl py-20 text-center">
          <h2 className="font-display text-4xl sm:text-5xl">Ready to outfit your fleet?</h2>
          <p className="mt-3 text-muted-foreground">Browse the catalogue or reach out for a bulk quote.</p>
          <div className="mt-7 flex justify-center gap-3">
            <Link to="/shop" className="rounded-full bg-primary text-primary-foreground px-7 py-3 font-semibold hover:bg-accent hover:text-accent-foreground transition">Browse shop</Link>
            <Link to="/contact" className="rounded-full border border-border px-7 py-3 font-semibold hover:bg-secondary transition">Contact sales</Link>
          </div>
        </section>
      </div>
    </>
  );
}
