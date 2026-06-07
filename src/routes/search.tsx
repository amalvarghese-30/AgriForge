import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Loader2, Search } from 'lucide-react';
import api from '@/lib/api';
import { ProductCard } from '@/components/site/ProductCard';

type Product = { _id: string; title: string; slug: string; basePrice: number; salePrice: number; thumbnail: string; stockQuantity: number };

export function Component() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!q) { setProducts([]); setTotal(0); return; }
    setLoading(true);
    api.get('/products/search', { params: { q, limit: 50 } })
      .then(({ data }) => { setProducts(data.data || []); setTotal(data.pagination?.total || 0); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <>
      <Helmet><title>{q ? `"${q}" — Search` : 'Search'} | AgriForge</title></Helmet>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Search Products</h1>

        {!q ? (
          <div className="py-20 text-center">
            <Search className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">Enter a search term to find products.</p>
          </div>
        ) : loading ? (
          <div className="grid place-items-center py-20"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground mb-2">No products found for "{q}".</p>
            <Link to="/shop" className="text-accent underline">Browse all products</Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">{total} result{total === 1 ? '' : 's'} for "{q}"</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </>
        )}
      </div>
    </>
  );
}
