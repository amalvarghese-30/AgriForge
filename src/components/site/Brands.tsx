const brands = ["MAHINDRA", "SONALIKA", "JOHN·DEERE", "ESCORTS", "TAFE", "SWARAJ", "KUBOTA", "NEW HOLLAND", "EICHER", "POWERTRAC"];

export function Brands() {
  return (
    <section className="py-16 bg-[var(--color-beige)] border-y border-border">
      <div className="container-px mx-auto max-w-7xl">
        <div className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground mb-8">
          Authorised partner for India's most trusted machinery brands
        </div>
        <div className="relative overflow-hidden mask-fade">
          <div className="flex gap-16 animate-marquee w-max">
            {[...brands, ...brands].map((b, i) => (
              <div key={i} className="font-display text-3xl sm:text-4xl text-foreground/40 hover:text-primary transition-colors whitespace-nowrap tracking-wider">
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}