import { useRef, useState } from "react";
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";

type GalleryImage = { url: string; alt: string };

function resolveUrl(img: string | GalleryImage): string {
  return typeof img === 'string' ? img : img.url;
}
function resolveAlt(img: string | GalleryImage, fallback: string): string {
  return typeof img === 'string' ? fallback : (img.alt || fallback);
}

export function ImageZoomGallery({ images, alt }: { images: string[] | GalleryImage[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [broken, setBroken] = useState<Set<number>>(new Set());
  const [zoom, setZoom] = useState({ x: 50, y: 50, on: false });
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setZoom({ x, y, on: true });
  };

  const imgUrl = resolveUrl(images[active]);
  const imgAlt = resolveAlt(images[active], alt);
  const hasImg = imgUrl && !broken.has(active);

  return (
    <div>
      <div
        ref={ref}
        className="relative aspect-square rounded-3xl overflow-hidden bg-card border border-border group cursor-zoom-in"
        onMouseMove={onMove}
        onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}
        onClick={() => hasImg && setLightbox(true)}
      >
        {hasImg ? (
          <img
            src={imgUrl}
            alt={imgAlt}
            onError={() => setBroken(prev => new Set(prev).add(active))}
            className="h-full w-full object-cover transition-transform duration-200"
            style={zoom.on ? { transformOrigin: `${zoom.x}% ${zoom.y}%`, transform: "scale(2)" } : undefined}
            draggable={false}
          />
        ) : (
          <div className="grid h-full place-items-center text-muted-foreground/30">
            <svg viewBox="0 0 200 200" className="h-1/2 w-1/2" fill="none" stroke="currentColor" strokeWidth="4">
              <circle cx="100" cy="100" r="70" />
              <circle cx="100" cy="100" r="30" />
            </svg>
          </div>
        )}
        {hasImg && (
          <div className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-background/90 text-foreground opacity-0 group-hover:opacity-100 transition">
            <ZoomIn className="h-4 w-4" />
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {images.map((img, i) => {
            const thumb = resolveUrl(img);
            const thumbBroken = broken.has(i);
            return (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition ${i === active ? "border-accent" : "border-border hover:border-primary"}`}
              >
                {thumb && !thumbBroken ? (
                  <img src={thumb} alt="" onError={() => setBroken(prev => new Set(prev).add(i))} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center bg-secondary text-muted-foreground/40 text-xs">N/A</div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {lightbox && hasImg && (
        <div className="fixed inset-0 z-[100] bg-black/95 grid place-items-center p-6" onClick={() => setLightbox(false)}>
          <button className="absolute top-6 right-6 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
          {images.length > 1 && (
            <>
              <button
                aria-label="Previous"
                className="absolute left-6 top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                onClick={(e) => { e.stopPropagation(); setActive((a) => (a - 1 + images.length) % images.length); }}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                aria-label="Next"
                className="absolute right-6 top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                onClick={(e) => { e.stopPropagation(); setActive((a) => (a + 1) % images.length); }}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          <img src={imgUrl} alt={imgAlt} className="max-h-[88vh] max-w-[88vw] object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}