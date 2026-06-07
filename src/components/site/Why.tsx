import { BadgeCheck, Truck, Boxes, Headphones, Award, ShieldCheck } from "lucide-react";

const items = [
  { Icon: BadgeCheck, t: "Genuine Parts", d: "Serialised, traceable, OEM-certified components every time." },
  { Icon: Truck, t: "Fast Shipping", d: "24–72 hr dispatch nationwide with cold-chain logistics." },
  { Icon: Boxes, t: "Bulk Orders", d: "Custom pricing for dealers, OEMs and farming cooperatives." },
  { Icon: Headphones, t: "Expert Support", d: "Talk to certified mechanical engineers, not call centres." },
  { Icon: Award, t: "Trusted by Farmers", d: "12,000+ active farm accounts across 14 Indian states." },
  { Icon: ShieldCheck, t: "Warranty Support", d: "Up to 36-month warranty with on-site replacement." },
];

export function Why() {
  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="container-px mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-accent">
            <span className="h-px w-10 bg-accent" /> Why AgriForge
          </div>
          <h2 className="mt-4 text-4xl sm:text-5xl lg:text-6xl text-foreground text-balance">
            Built on trust. Engineered for the field.
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-3xl overflow-hidden border border-border">
          {items.map(({ Icon, t, d }) => (
            <div key={t} className="group relative bg-background p-8 transition-colors duration-500 hover:bg-card">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                <Icon className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <h3 className="mt-6 text-xl font-bold text-foreground">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{d}</p>
              <div className="mt-6 h-px w-12 bg-accent transition-all duration-500 group-hover:w-24" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}