import { Quote, Star } from "lucide-react";

const items = [
  { q: "Replaced our entire hydraulic line through AgriForge. Delivered in 36 hours during peak harvest. Lifesavers.", n: "Harpreet Singh", r: "Wheat Farmer, Punjab", rating: 5 },
  { q: "We've moved 90% of our spare parts procurement to their dealer portal. Pricing is transparent and inventory is real.", n: "Rajendra Patil", r: "Distributor, Maharashtra", rating: 5 },
  { q: "The bearing quality is genuinely OEM. We use them for our combine harvester fleet — zero failures in 14 months.", n: "Anjali Verma", r: "Fleet Manager, AgroTech Co.", rating: 5 },
];

export function Testimonials() {
  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="container-px mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-accent">
              <span className="h-px w-10 bg-accent" /> Field Reports
            </div>
            <h2 className="mt-4 text-4xl sm:text-5xl lg:text-6xl text-foreground max-w-2xl text-balance">
              Trusted where it matters most.
            </h2>
          </div>
          <div className="text-right">
            <div className="font-display text-5xl text-primary">4.9</div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">2,840 verified reviews</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <figure key={i} className={`relative rounded-3xl p-8 border transition hover:-translate-y-1 ${i === 1 ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:shadow-[var(--shadow-card)]"}`}>
              <Quote className={`h-10 w-10 ${i === 1 ? "text-accent" : "text-primary/20"}`} />
              <blockquote className={`mt-6 text-lg leading-relaxed ${i === 1 ? "text-primary-foreground" : "text-foreground"}`}>
                "{t.q}"
              </blockquote>
              <div className="mt-6 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, k) => (
                  <Star key={k} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <figcaption className="mt-6 pt-6 border-t border-current/15 flex items-center gap-3">
                <div className={`grid h-11 w-11 place-items-center rounded-full font-display text-xl ${i === 1 ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"}`}>
                  {t.n[0]}
                </div>
                <div>
                  <div className="font-semibold">{t.n}</div>
                  <div className={`text-xs ${i === 1 ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{t.r}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}