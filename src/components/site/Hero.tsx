import heroImg from "@/assets/hero-tractor.jpg";
import { ArrowRight, Play, ShieldCheck, Truck, Wrench } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[var(--color-ink)] text-white -mt-24">
      <img
        src={heroImg}
        alt="Tractor harvesting wheat at sunset"
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,18,18,0.55)_0%,rgba(18,18,18,0.35)_45%,rgba(18,18,18,0.95)_100%)]" />
      <div className="absolute inset-0 grain opacity-50" />

      <div className="relative z-10 container-px mx-auto max-w-7xl pt-40 pb-24 lg:pt-48 lg:pb-32">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/70">
          <span className="h-px w-10 bg-accent" />
          Est. 1998 · Trusted by 12,000+ farms
        </div>

        <h1 className="mt-6 max-w-5xl font-display text-[clamp(3rem,9vw,8.5rem)] leading-[0.9] text-balance">
          POWERING <span className="text-accent">MODERN</span><br />
          AGRICULTURE.
        </h1>

        <p className="mt-8 max-w-xl text-base sm:text-lg text-white/75 leading-relaxed">
          Industrial-grade machinery, genuine tractor spare parts, and heavy-duty
          components engineered to outlast every season — delivered to your farm,
          workshop or dealership.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-glow)] hover:brightness-110 transition">
            Shop Parts
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 py-4 text-sm font-semibold text-white backdrop-blur hover:bg-white/10 transition">
            Explore Machinery
          </a>
          <a className="inline-flex items-center gap-2 px-3 py-4 text-sm font-medium text-white/80 hover:text-white">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-white/30">
              <Play className="h-3.5 w-3.5 fill-white" />
            </span>
            Watch the film
          </a>
        </div>

        {/* Stats strip */}
        <div className="mt-16 grid max-w-3xl grid-cols-3 gap-6">
          {[
            { v: "50K+", l: "Parts shipped" },
            { v: "850+", l: "Authorised dealers" },
            { v: "27 yrs", l: "Field-tested" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-4xl sm:text-5xl text-white">{s.v}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.2em] text-white/60">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom floating cards */}
      <div className="relative z-10 container-px mx-auto max-w-7xl -mt-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { Icon: ShieldCheck, t: "Genuine OEM Parts", d: "Verified, serialised, guaranteed." },
            { Icon: Truck, t: "Pan-India Delivery", d: "24–72 hr dispatch across 600+ cities." },
            { Icon: Wrench, t: "Workshop Support", d: "Talk to certified machinery engineers." },
          ].map(({ Icon, t, d }) => (
            <div key={t} className="glass-dark rounded-2xl p-5 flex items-start gap-4 transition hover:-translate-y-1 hover:border-accent/50">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent/15 text-accent">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-white">{t}</div>
                <div className="text-sm text-white/65">{d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}