import { Facebook, Instagram, Linkedin, Youtube, MapPin, Phone, Mail, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { NewsletterForm } from "@/components/site/NewsletterForm";

const cols: { t: string; l: { label: string; to: string }[] }[] = [
  { t: "Shop", l: [
    { label: "All products", to: "/shop" },
    { label: "Best sellers", to: "/shop" },
    { label: "New arrivals", to: "/shop" },
    { label: "Spare parts", to: "/shop" },
  ] },
  { t: "Company", l: [
    { label: "About us", to: "/about" },
    { label: "Contact", to: "/contact" },
  ] },
  { t: "Account", l: [
    { label: "My account", to: "/account" },
    { label: "Orders", to: "/account/orders" },
    { label: "Track order", to: "/track" },
    { label: "Addresses", to: "/account/addresses" },
    { label: "Wishlist", to: "/wishlist" },
  ] },
];

export function Footer() {
  return (
    <footer className="bg-[var(--color-ink)] text-white relative overflow-hidden">
      <div className="absolute inset-0 grain opacity-30" />
      <div className="container-px mx-auto max-w-7xl relative">
        {/* Newsletter */}
        <div className="py-14 border-b border-white/10 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="font-display text-4xl sm:text-5xl">JOIN THE FIELD REPORT.</h3>
            <p className="mt-3 text-white/60 max-w-md">Monthly drops on new arrivals, seasonal maintenance tips and dealer-only pricing.</p>
          </div>
          <NewsletterForm />
        </div>

        {/* Main */}
        <div className="py-16 grid grid-cols-2 lg:grid-cols-12 gap-10">
          <div className="col-span-2 lg:col-span-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-accent-foreground">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M4 18h16M6 18V9l6-4 6 4v9M10 18v-5h4v5" />
                </svg>
              </div>
              <div className="font-display text-3xl tracking-wider">AGRIFORGE</div>
            </div>
            <p className="mt-5 text-sm text-white/60 leading-relaxed max-w-sm">
              Industrial-grade agricultural machinery and spare parts engineered for India's
              hardest working farms. Since 1998.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-start gap-3 text-white/75"><MapPin className="h-4 w-4 text-accent mt-0.5" /><span>Plot 47, MIDC Industrial Estate, Pune 411019</span></div>
              <div className="flex items-center gap-3 text-white/75"><Phone className="h-4 w-4 text-accent" /><span>+91 98765 43210</span></div>
              <div className="flex items-center gap-3 text-white/75"><Mail className="h-4 w-4 text-accent" /><span>sales@agriforge.in</span></div>
              <div className="flex items-center gap-3 text-white/75"><Clock className="h-4 w-4 text-accent" /><span>Mon–Sat · 9:00 – 19:00 IST</span></div>
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.t} className="lg:col-span-2">
              <div className="text-xs uppercase tracking-[0.25em] text-accent">{c.t}</div>
              <ul className="mt-5 space-y-3 text-sm">
                {c.l.map((x) => (
                  <li key={x.label}><Link to={x.to} className="text-white/70 hover:text-white transition">{x.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 lg:col-span-2">
            <div className="text-xs uppercase tracking-[0.25em] text-accent">Follow</div>
            <div className="mt-5 flex gap-2">
              {[
                { Icon: Facebook, href: "https://facebook.com/agriforgeindia" },
                { Icon: Instagram, href: "https://instagram.com/agriforgeindia" },
                { Icon: Linkedin, href: "https://linkedin.com/company/agriforgeindia" },
                { Icon: Youtube, href: "https://youtube.com/@agriforgeindia" },
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/80 hover:bg-accent hover:text-accent-foreground hover:border-accent transition">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div>© {new Date().getFullYear()} AgriForge Industries Pvt. Ltd. All rights reserved.</div>
          <div className="flex gap-6">
            <a className="hover:text-white">Privacy</a>
            <a className="hover:text-white">Terms</a>
            <a className="hover:text-white">Shipping</a>
            <a className="hover:text-white">GST Invoices</a>
          </div>
        </div>
      </div>
    </footer>
  );
}