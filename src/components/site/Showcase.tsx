import machinery from "@/assets/showcase-machinery.jpg";
import parts from "@/assets/showcase-parts.jpg";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function Showcase() {
  return (
    <section className="py-24 sm:py-32 bg-[var(--color-ink)] text-white relative overflow-hidden">
      <div className="absolute inset-0 grain opacity-40" />
      <div className="container-px mx-auto max-w-7xl relative">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-accent">
              <span className="h-px w-10 bg-accent" /> Industrial Showcase
            </div>
            <h2 className="mt-4 font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] text-balance">
              FROM <span className="text-accent">FACTORY FLOOR</span><br />TO THE FIELD.
            </h2>
            <p className="mt-6 text-white/70 leading-relaxed max-w-md">
              Every component is forged, machined and stress-tested in our certified
              facilities — then dispatched to dealerships and farms across 14 states.
            </p>
            <ul className="mt-8 space-y-3">
              {["ISO 9001:2015 certified manufacturing", "100% serialised inventory", "5-stage quality assurance", "OEM-grade material sourcing"].map((t) => (
                <li key={t} className="flex items-center gap-3 text-sm text-white/85">
                  <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" /> {t}
                </li>
              ))}
            </ul>
            <a className="mt-10 group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground hover:brightness-110 transition">
              Tour our facility <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          <div className="lg:col-span-7 grid grid-cols-12 gap-4 lg:gap-6">
            <div className="col-span-7 relative aspect-[4/5] overflow-hidden rounded-3xl group">
              <img src={machinery} alt="Tractor engine" loading="lazy" width={1024} height={1024} className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <div className="text-[10px] uppercase tracking-[0.25em] text-accent">01 / Machinery</div>
                <div className="mt-1 font-display text-3xl">HEAVY ENGINES</div>
              </div>
            </div>
            <div className="col-span-5 flex flex-col gap-4 lg:gap-6">
              <div className="relative aspect-square overflow-hidden rounded-3xl group flex-1">
                <img src={parts} alt="Spare parts" loading="lazy" width={1024} height={1024} className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-accent">02 / Parts</div>
                  <div className="mt-1 font-display text-2xl">PRECISION BEARINGS</div>
                </div>
              </div>
              <div className="rounded-3xl bg-accent text-accent-foreground p-6">
                <div className="font-display text-5xl">24/7</div>
                <div className="mt-2 text-sm font-medium">Workshop helpline for dealers & service centres.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}