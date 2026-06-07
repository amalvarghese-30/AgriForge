import { Heart, ShoppingCart, Star, GitCompareArrows, Eye } from "lucide-react";

const products = [
  { name: "Hydraulic Cylinder Pro 80T", cat: "Hydraulics", price: "₹18,400", old: "₹22,000", rating: 4.9, stock: "In stock", badge: "BESTSELLER", grad: "from-[#1F4D36] to-[#0c2a1c]" },
  { name: "Rotavator Blade Set — 42pc", cat: "Rotavator", price: "₹6,250", old: "₹7,800", rating: 4.8, stock: "In stock", badge: "-20%", grad: "from-[#556B2F] to-[#2a3517]" },
  { name: "Tapered Roller Bearing 32312", cat: "Bearings", price: "₹2,180", old: null, rating: 4.7, stock: "Low stock", badge: "NEW", grad: "from-[#6B7280] to-[#1f2329]" },
  { name: "Centrifugal Water Pump 5HP", cat: "Pumps", price: "₹24,900", old: "₹29,500", rating: 4.9, stock: "In stock", badge: "PREMIUM", grad: "from-[#D97706] to-[#7a3f02]" },
];

export function Products() {
  return (
    <section className="py-24 sm:py-32 bg-[var(--color-beige)]">
      <div className="container-px mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-accent">
              <span className="h-px w-10 bg-accent" />
              Best Sellers
            </div>
            <h2 className="mt-4 text-4xl sm:text-5xl lg:text-6xl text-foreground max-w-2xl text-balance">
              Built for the long haul.
            </h2>
          </div>
          <div className="flex gap-2">
            {["All", "New", "Tractor", "Hydraulics", "Pumps"].map((t, i) => (
              <button
                key={t}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${i === 0 ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-primary/10"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <article key={p.name} className="group relative overflow-hidden rounded-3xl bg-card border border-border transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
              <div className={`relative aspect-[4/5] bg-gradient-to-br ${p.grad} overflow-hidden`}>
                <div className="absolute inset-0 grain opacity-30" />
                <div className="absolute inset-0 grid place-items-center">
                  <svg viewBox="0 0 200 200" className="h-3/5 w-3/5 text-white/85 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12">
                    <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="6" />
                    <circle cx="100" cy="100" r="35" fill="none" stroke="currentColor" strokeWidth="6" />
                    <circle cx="100" cy="100" r="10" fill="currentColor" />
                    {Array.from({ length: 8 }).map((_, i) => {
                      const a = (i * Math.PI) / 4;
                      const x1 = 100 + Math.cos(a) * 35;
                      const y1 = 100 + Math.sin(a) * 35;
                      const x2 = 100 + Math.cos(a) * 70;
                      const y2 = 100 + Math.sin(a) * 70;
                      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="6" />;
                    })}
                  </svg>
                </div>
                <div className="absolute top-4 left-4 rounded-full bg-white/95 text-ink px-2.5 py-1 text-[10px] font-bold tracking-wider">
                  {p.badge}
                </div>
                <button aria-label="Wishlist" className="absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full bg-white/95 text-ink hover:bg-accent hover:text-accent-foreground transition">
                  <Heart className="h-4 w-4" />
                </button>
                <div className="absolute inset-x-4 bottom-4 flex gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-white text-ink py-2.5 text-xs font-bold hover:bg-accent hover:text-accent-foreground transition">
                    <ShoppingCart className="h-3.5 w-3.5" /> Add to cart
                  </button>
                  <button aria-label="Quick view" className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink hover:bg-accent hover:text-accent-foreground transition">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button aria-label="Compare" className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink hover:bg-accent hover:text-accent-foreground transition">
                    <GitCompareArrows className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="uppercase tracking-wider">{p.cat}</span>
                  <span className="inline-flex items-center gap-1 text-foreground"><Star className="h-3 w-3 fill-accent text-accent" /> {p.rating}</span>
                </div>
                <h3 className="mt-2 text-base font-bold text-foreground leading-snug line-clamp-2">{p.name}</h3>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <div className="text-lg font-extrabold text-primary">{p.price}</div>
                    {p.old && <div className="text-xs text-muted-foreground line-through">{p.old}</div>}
                  </div>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider ${p.stock === "Low stock" ? "text-accent" : "text-primary"}`}>● {p.stock}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}