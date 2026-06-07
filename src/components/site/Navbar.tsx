import { Link } from "react-router-dom";
import { ShoppingCart, Heart, User, Menu, LogOut, X, Phone, MessageCircle, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { SearchBar } from "@/components/site/SearchBar";
import { MegaMenu } from "@/components/site/MegaMenu";

const links = [
  { label: "Shop", href: "/shop" },
  { label: "Spare Parts", href: "/shop?category=spare-parts" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { count: cartCount, setOpen: setCartOpen } = useCart();
  const { count: wishCount } = useWishlist();
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "py-0" : "py-0"}`}>
      {/* Top contact bar */}
      <div className="hidden md:block bg-[var(--color-ink)] text-white/80 text-xs border-b border-white/10">
        <div className="container-px mx-auto max-w-7xl flex items-center justify-between py-1.5">
          <div className="flex items-center gap-5">
            <a href="tel:+919876543210" className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <Phone className="h-3 w-3" /> +91 98765 43210
            </a>
            <a href="tel:+919876543211" className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <Phone className="h-3 w-3" /> +91 98765 43211
            </a>
            <a href="https://wa.me/919876543210?text=Hi%20AgriForge%2C%20I%20need%20service%20assistance%20for%20my%20equipment." target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#25D366] hover:brightness-110 transition">
              <MessageCircle className="h-3 w-3" /> WhatsApp Service
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3 text-accent" /> ISO 9001:2015 Certified
            </span>
            <a href="https://partsadvisor.deere.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors font-semibold">
              JD Parts Advisor
            </a>
          </div>
        </div>
      </div>
      <div className={`${scrolled ? "py-2" : "py-4"}`}>
        <div className="container-px mx-auto w-[96%] max-w-[1700px]">
          <div
            className={`flex items-center justify-between rounded-2xl px-6 lg:px-8 py-3 transition-all duration-500 ${scrolled ? "glass shadow-card" : "bg-white/95 shadow-card"
              }`}
          >
            <Link to="/" className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M4 18h16M6 18V9l6-4 6 4v9M10 18v-5h4v5" />
                </svg>
              </div>
              <div className="leading-none">
                <div className="font-display text-2xl tracking-wider text-foreground">AGRIFORGE</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Industrial Agriculture</div>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              <MegaMenu />
              {links.map((l) => (
                <Link key={l.label} to={l.href} className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-accent transition-colors">
                  {l.label}
                </Link>
              ))}
              <Link to="/gallery" className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-accent transition-colors">Gallery</Link>
              <Link to="/about" className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-accent transition-colors">About</Link>
              <Link to="/contact" className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-accent transition-colors">Contact</Link>
            </nav>

            <div className="flex items-center gap-1.5">
              <SearchBar />
              <Link to="/wishlist" aria-label="Wishlist" className="relative hidden sm:grid h-10 w-10 place-items-center rounded-full text-foreground/80 hover:bg-secondary transition-colors">
                <Heart className="h-4 w-4" />
                {wishCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">{wishCount}</span>
                )}
              </Link>
              {user ? (
                <>
                  <Link to="/account" aria-label="Account" className="hidden sm:grid h-10 w-10 place-items-center rounded-full text-foreground/80 hover:bg-secondary transition-colors">
                    <User className="h-4 w-4" />
                  </Link>
                  <button aria-label="Sign out" onClick={() => void logout()} className="hidden sm:grid h-10 w-10 place-items-center rounded-full text-foreground/80 hover:bg-secondary transition-colors">
                    <LogOut className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <Link to="/auth?mode=login" aria-label="Sign in" className="hidden sm:grid h-10 w-10 place-items-center rounded-full text-foreground/80 hover:bg-secondary transition-colors">
                  <User className="h-4 w-4" />
                </Link>
              )}
              <button onClick={() => setCartOpen(true)} aria-label="Cart" className="relative grid h-10 w-10 place-items-center rounded-full text-foreground/80 hover:bg-secondary transition-colors">
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">{cartCount}</span>
                )}
              </button>
              <Link to="/contact" className="ml-2 hidden md:inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-glow)] hover:brightness-110 transition">
                Request Quote
              </Link>
              <button
                aria-label="Menu"
                onClick={() => setMenuOpen(true)}
                className="lg:hidden grid h-10 w-10 place-items-center rounded-full text-foreground hover:bg-secondary"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-4 top-4 w-72 rounded-3xl glass-dark border border-white/10 p-6 shadow-2xl animate-in slide-in-from-top-4 duration-200">
              <div className="flex items-center justify-between mb-6">
                <span className="font-display text-xl tracking-wider text-white">Menu</span>
                <button onClick={() => setMenuOpen(false)} className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="space-y-1">
                {links.map((l) => (
                  <Link
                    key={l.label}
                    to={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-4 py-3 text-base font-medium text-white/80 hover:text-white hover:bg-white/10 transition"
                  >
                    {l.label}
                  </Link>
                ))}
                <Link to="/gallery" onClick={() => setMenuOpen(false)} className="block rounded-xl px-4 py-3 text-base font-medium text-white/80 hover:text-white hover:bg-white/10 transition">
                  Gallery
                </Link>
                <Link to="/about" onClick={() => setMenuOpen(false)} className="block rounded-xl px-4 py-3 text-base font-medium text-white/80 hover:text-white hover:bg-white/10 transition">
                  About
                </Link>
                <Link to="/contact" onClick={() => setMenuOpen(false)} className="block rounded-xl px-4 py-3 text-base font-medium text-white/80 hover:text-white hover:bg-white/10 transition">
                  Contact
                </Link>
              </nav>
              <div className="mt-6 pt-6 border-t border-white/10 flex flex-col gap-2">
                <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 transition">
                  <Heart className="h-4 w-4" /> Wishlist {wishCount > 0 && `(${wishCount})`}
                </Link>
                {user ? (
                  <>
                    <Link to="/account" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 transition">
                      <User className="h-4 w-4" /> My Account
                    </Link>
                    <button onClick={() => { setMenuOpen(false); void logout(); }} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 transition">
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </>
                ) : (
                  <Link to="/auth?mode=login" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 transition">
                    <User className="h-4 w-4" /> Sign In
                  </Link>
                )}
                <Link to="/contact" onClick={() => setMenuOpen(false)} className="mt-2 block text-center w-full rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground hover:brightness-110 transition">
                  Request Quote
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}