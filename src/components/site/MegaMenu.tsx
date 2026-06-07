import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface SubItem {
  label: string;
  to: string;
}

interface MegaItem {
  label: string;
  brandSlug: string;
  children: SubItem[];
}

const megaLinks: MegaItem[] = [
  {
    label: "John Deere",
    brandSlug: "john-deere",
    children: [
      { label: "Tractors", to: "/shop?brand=john-deere&category=tractors" },
      { label: "Harvesters", to: "/shop?brand=john-deere&category=harvesters" },
      { label: "Implements", to: "/shop?brand=john-deere&category=implements" },
      { label: "Planters & Seeders", to: "/shop?brand=john-deere&category=planters-seeders" },
      { label: "Balers", to: "/shop?brand=john-deere&category=balers" },
      { label: "Spare Parts", to: "/shop?brand=john-deere&category=spare-parts" },
      { label: "All John Deere", to: "/shop?brand=john-deere" },
    ],
  },
  {
    label: "Shaktiman",
    brandSlug: "shaktiman",
    children: [
      { label: "Rotavators", to: "/shop?brand=shaktiman&category=rotavators" },
      { label: "Implements", to: "/shop?brand=shaktiman&category=implements" },
      { label: "Planters & Seeders", to: "/shop?brand=shaktiman&category=planters-seeders" },
      { label: "Sprayers & Dusters", to: "/shop?brand=shaktiman&category=sprayers-dusters" },
      { label: "Threshers", to: "/shop?brand=shaktiman&category=threshers" },
      { label: "Spare Parts", to: "/shop?brand=shaktiman&category=spare-parts" },
      { label: "All Shaktiman", to: "/shop?brand=shaktiman" },
    ],
  },
  {
    label: "Kirloskar",
    brandSlug: "kirloskar",
    children: [
      { label: "Mini Harvesters", to: "/shop?brand=kirloskar&category=harvesters" },
      { label: "Power Tillers", to: "/shop?brand=kirloskar&category=power-tillers" },
      { label: "Power Weeders", to: "/shop?brand=kirloskar&category=power-weeders" },
      { label: "All Kirloskar", to: "/shop?brand=kirloskar" },
    ],
  },
  {
    label: "Bull",
    brandSlug: "bull",
    children: [
      { label: "Loaders", to: "/shop?brand=bull&category=loaders" },
      { label: "Sugarcane Loaders", to: "/shop?brand=bull" },
      { label: "Backhoe & Dozer", to: "/shop?brand=bull" },
      { label: "All Bull", to: "/shop?brand=bull" },
    ],
  },
  {
    label: "Redlands",
    brandSlug: "redlands",
    children: [
      { label: "Round Balers", to: "/shop?brand=redlands&category=balers" },
      { label: "Hay Rakes", to: "/shop?brand=redlands&category=balers" },
      { label: "Implements", to: "/shop?brand=redlands&category=implements" },
      { label: "All Redlands", to: "/shop?brand=redlands" },
    ],
  },
  {
    label: "BCS Ferrari",
    brandSlug: "bcs-ferrari",
    children: [
      { label: "Power Weeders", to: "/shop?brand=bcs-ferrari&category=power-weeders" },
      { label: "Reaper Binders", to: "/shop?brand=bcs-ferrari&category=harvesters" },
      { label: "All BCS Ferrari", to: "/shop?brand=bcs-ferrari" },
    ],
  },
];

export function MegaMenu() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const onEnter = (i: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenIndex(i);
  };

  const onLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenIndex(null), 150);
  };

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  return (
    <nav className="hidden lg:flex items-center gap-0.5" ref={containerRef}>
      {megaLinks.map((item, i) => (
        <div
          key={item.label}
          className="relative"
          onMouseEnter={() => onEnter(i)}
          onMouseLeave={onLeave}
        >
          <Link
            to={`/shop?brand=${item.brandSlug}`}
            className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              openIndex === i
                ? "text-accent bg-accent/5"
                : "text-foreground/80 hover:text-accent"
            }`}
          >
            {item.label}
            <ChevronDown
              className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${
                openIndex === i ? "rotate-180" : ""
              }`}
            />
          </Link>
          {openIndex === i && (
            <div className="absolute top-full left-0 pt-2 min-w-[200px] animate-in slide-in-from-top-2 fade-in duration-150">
              <div className="rounded-2xl border border-border bg-card shadow-card p-2">
                <div className="grid gap-0.5">
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      to={child.to}
                      className="block rounded-xl px-4 py-2.5 text-sm text-foreground/80 hover:text-accent hover:bg-accent/5 font-medium transition-colors whitespace-nowrap"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
