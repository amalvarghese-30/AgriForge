import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useRecentlyViewed } from '@/hooks/use-recently-viewed';
import { ProductCard } from '@/components/site/ProductCard';

export function RecentlyViewed({ excludeId, title = 'Recently viewed', className = '' }: { excludeId?: string; title?: string; className?: string }) {
  const { ids } = useRecentlyViewed();
  const filtered = ids.filter((id: string) => id !== excludeId);
  const [products, setProducts] = useState<Array<{ _id: string; title: string; slug: string; basePrice: number; salePrice: number; thumbnail: string; stockQuantity: number }>>([]);

  useEffect(() => {
    if (filtered.length === 0) { setProducts([]); return; }
    api.post('/products/batch', { ids: filtered })
      .then(({ data }) => {
        const order = new Map(filtered.map((id: string, i: number) => [id, i]));
        setProducts((data.data || []).sort((a: { _id: string }, b: { _id: string }) => (order.get(a._id) ?? 0) - (order.get(b._id) ?? 0)));
      })
      .catch(() => {});
  }, [excludeId, ids.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  if (products.length === 0) return null;
  return (
    <section className={`py-20 bg-background ${className}`}>
      <div className="container-px mx-auto max-w-7xl">
        <h2 className="font-display text-3xl sm:text-4xl mb-8">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </div>
    </section>
  );
}
