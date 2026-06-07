import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export function SearchBar({ variant = 'icon' }: { variant?: 'icon' | 'inline' }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [debounced, setDebounced] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [results, setResults] = useState<Array<{ _id: string; title: string; slug: string; salePrice: number; basePrice: number; thumbnail: string; sku?: string }>>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim()), 200);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 10);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (debounced.length < 2) { setResults([]); return; }
    setFetching(true);
    api.get('/products/search', { params: { q: debounced, limit: 8 } })
      .then(({ data }) => setResults(data.data || []))
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [debounced]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
    setOpen(false);
  };

  if (variant === 'icon') {
    return (
      <>
        <button
          aria-label="Search"
          onClick={() => setOpen(true)}
          className="hidden sm:grid h-10 w-10 place-items-center rounded-full text-foreground/80 hover:bg-secondary transition-colors"
        >
          <Search className="h-4 w-4" />
        </button>
        {open && <SearchOverlay onClose={() => setOpen(false)} q={q} setQ={setQ} inputRef={inputRef} results={results} fetching={fetching} submit={submit} debounced={debounced} />}
      </>
    );
  }

  return null;
}

function SearchOverlay({
  onClose, q, setQ, inputRef, results, fetching, submit, debounced,
}: {
  onClose: () => void;
  q: string;
  setQ: (v: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  results: Array<{ _id: string; title: string; slug: string; salePrice: number; basePrice: number; thumbnail: string; sku?: string }>;
  fetching: boolean;
  submit: (e: React.FormEvent) => void;
  debounced: string;
}) {
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="container-px mx-auto max-w-3xl pt-24" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={submit} className="flex items-center gap-3 rounded-2xl bg-card border border-border shadow-2xl px-5 py-4">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search machinery, parts, brands…"
            className="flex-1 bg-transparent outline-none text-base placeholder:text-muted-foreground"
          />
          {fetching && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-3 rounded-2xl bg-card border border-border shadow-2xl overflow-hidden max-h-[60vh] overflow-y-auto">
          {debounced.length < 2 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Type at least 2 characters to search.</div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No products match "{debounced}".</div>
          ) : (
            <ul>
              {results.map((p) => {
                const price = p.salePrice || p.basePrice || 0;
                return (
                  <li key={p._id}>
                    <Link
                      to={`/shop/${p.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-secondary/60 transition border-b border-border last:border-0"
                    >
                      <div className="h-12 w-12 rounded-lg overflow-hidden bg-secondary shrink-0">
                        {p.thumbnail && <img src={p.thumbnail} alt="" className="h-full w-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{p.title}</div>
                        {p.sku && <div className="text-xs text-muted-foreground">SKU: {p.sku}</div>}
                      </div>
                      <div className="font-extrabold text-primary">₹{Number(price).toLocaleString('en-IN')}</div>
                    </Link>
                  </li>
                );
              })}
              <li>
                <button onClick={submit} className="w-full px-4 py-3 text-sm font-semibold text-accent hover:bg-secondary/60 transition">
                  See all results for "{debounced}" →
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
