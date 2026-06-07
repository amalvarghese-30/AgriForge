import { Cog, Wrench, Sprout, Droplets, CircleDot, Settings2, Hammer, Flame, ArrowUpRight } from "lucide-react";

const cats = [
  { Icon: Cog, name: "Tractor Parts", count: "1,240 SKUs" },
  { Icon: Settings2, name: "Rotavator Parts", count: "480 SKUs" },
  { Icon: Sprout, name: "Harvesting Equipment", count: "320 SKUs" },
  { Icon: Droplets, name: "Hydraulic Components", count: "610 SKUs" },
  { Icon: Wrench, name: "Pumps & Motors", count: "275 SKUs" },
  { Icon: CircleDot, name: "Bearings", count: "920 SKUs" },
  { Icon: Hammer, name: "Farming Tools", count: "1,580 SKUs" },
  { Icon: Flame, name: "Engine Components", count: "740 SKUs" },
];

export function Categories() {
  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="container-px mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-accent">
              <span className="h-px w-10 bg-accent" />
              Browse Categories
            </div>
            <h2 className="mt-4 text-4xl sm:text-5xl lg:text-6xl text-foreground max-w-2xl text-balance">
              Every part. Every season. <span className="text-primary">In stock.</span>
            </h2>
          </div>
          <a className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-accent transition">
            View all 32 categories <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {cats.map(({ Icon, name, count }, i) => (
            <a
              key={name}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-card)]"
            >
              <div className="absolute inset-0 bg-[var(--gradient-card)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                <div className="grid h-14 w-14 place-items-center rounded-xl bg-primary/10 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <div className="mt-8 flex items-end justify-between">
                  <div>
                    <div className="font-semibold text-foreground leading-tight">{name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{count}</div>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all duration-500 group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-accent transition-all duration-500 group-hover:w-full" />
              <div className="absolute top-3 right-3 text-[10px] font-mono text-muted-foreground/60">0{i + 1}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}