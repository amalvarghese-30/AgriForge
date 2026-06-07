import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

const GALLERY_IMAGES = [
  { src: "https://images.unsplash.com/photo-1570053382191-8c12b3e3e1c7?w=800&q=80", alt: "John Deere tractor in field", cat: "Tractors" },
  { src: "https://images.unsplash.com/photo-1586902474419-0666a766f8b6?w=800&q=80", alt: "Harvester at work during wheat season", cat: "Harvesters" },
  { src: "https://images.unsplash.com/photo-1530267981375-f08d74229d7f?w=800&q=80", alt: "Rotavator preparing seedbed", cat: "Implements" },
  { src: "https://images.unsplash.com/photo-1622406994537-0e5e3d72bbaa?w=800&q=80", alt: "Mahindra tractor with cultivator", cat: "Tractors" },
  { src: "https://images.unsplash.com/photo-1571895158267-86f2b6c7aae1?w=800&q=80", alt: "Round baler producing straw bales", cat: "Balers" },
  { src: "https://images.unsplash.com/photo-1592836690524-08cf237b4b51?w=800&q=80", alt: "Sugarcane loader in operation", cat: "Loaders" },
  { src: "https://images.unsplash.com/photo-1580674285054-dd9d82b6c741?w=800&q=80", alt: "Power tiller in paddy field", cat: "Power Tillers" },
  { src: "https://images.unsplash.com/photo-1605727598473-44bb2a4f33da?w=800&q=80", alt: "Sprayer mounted on tractor", cat: "Sprayers" },
  { src: "https://images.unsplash.com/photo-1523342726926-2e3c347b2d2a?w=800&q=80", alt: "Workshop service bay", cat: "Service" },
  { src: "https://images.unsplash.com/photo-1622395044864-6b2f84a1116f?w=800&q=80", alt: "Laser land leveller grading field", cat: "Implements" },
  { src: "https://images.unsplash.com/photo-1605001011052-2d8e0a5a78cd?w=800&q=80", alt: "Thresher processing wheat", cat: "Threshers" },
  { src: "https://images.unsplash.com/photo-1616151715985-b84e53d60d7d?w=800&q=80", alt: "New Holland tractor lineup", cat: "Tractors" },
  { src: "https://images.unsplash.com/photo-1500072786197-02dd5b61c2c4?w=800&q=80", alt: "Seed drill planting wheat", cat: "Implements" },
  { src: "https://images.unsplash.com/photo-1520053229642-b20a424f45bd?w=800&q=80", alt: "Compact tractor in orchard", cat: "Tractors" },
  { src: "https://images.unsplash.com/photo-1558618666-fcd5c85a7bb5?w=800&q=80", alt: "Hay rake merging windrows", cat: "Balers" },
  { src: "https://images.unsplash.com/photo-1558443603-5b3d2e3406b6?w=800&q=80", alt: "Parts warehouse inventory", cat: "Spare Parts" },
  { src: "https://images.unsplash.com/photo-1591901475199-8e41d9c5c2be?w=800&q=80", alt: "Dealer showroom floor", cat: "Showroom" },
  { src: "https://images.unsplash.com/photo-1625246331038-ee87e1f94bb1?w=800&q=80", alt: "Power weeder in vegetable field", cat: "Power Weeders" },
  { src: "https://images.unsplash.com/photo-1580551315441-4a4695e2e9e8?w=800&q=80", alt: "Backhoe loader digging canal", cat: "Loaders" },
  { src: "https://images.unsplash.com/photo-1659972316324-421a3fb3f79b?w=800&q=80", alt: "Reaper binder harvesting paddy", cat: "Harvesters" },
  { src: "https://images.unsplash.com/photo-1532978373488-5c4c5e45ead3?w=800&q=80", alt: "Technician servicing engine", cat: "Service" },
  { src: "https://images.unsplash.com/photo-1605104556443-59c2d9b2cb2c?w=800&q=80", alt: "Subsoiler breaking hardpan", cat: "Implements" },
  { src: "https://images.unsplash.com/photo-1616075789287-217d86ad55ac?w=800&q=80", alt: "Fertilizer broadcaster in action", cat: "Implements" },
  { src: "https://images.unsplash.com/photo-1622392410582-6b10814f62ab?w=800&q=80", alt: "Dealer team at field demo", cat: "Showroom" },
];

const CATEGORIES = ["All", "Tractors", "Harvesters", "Implements", "Balers", "Loaders", "Sprayers", "Power Tillers", "Power Weeders", "Threshers", "Spare Parts", "Service", "Showroom"];

export function Component() {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? GALLERY_IMAGES : GALLERY_IMAGES.filter((i) => i.cat === filter);

  useEffect(() => {
    if (selected) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  return (
    <>
      <Helmet>
        <title>Gallery — AgriForge</title>
        <meta name="description" content="Explore our showroom, field demonstrations, service centre and product lineup through the AgriForge gallery." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <section className="pt-8 pb-16">
          <div className="container-px mx-auto max-w-7xl">
            <div className="text-center mb-10">
              <span className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">Our Work in Pictures</span>
              <h1 className="mt-3 font-display text-4xl sm:text-6xl tracking-wide">Gallery</h1>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                Tractors in the field, implements at work, our service centre and the machines that power Indian agriculture.
              </p>
            </div>

            {/* Filter tags */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    filter === c
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Gallery grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(img.src)}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary cursor-zoom-in"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-left translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="block text-xs font-semibold text-white">{img.alt}</span>
                    <span className="block text-[10px] text-white/60 mt-0.5">{img.cat}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Lightbox */}
        {selected && (
          <div
            className="fixed inset-0 z-[100] bg-ink/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-5 right-5 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={selected}
              alt=""
              className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
            />
          </div>
        )}
      </div>
    </>
  );
}
