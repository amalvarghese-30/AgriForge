import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import { ProductCard } from '@/components/site/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

type Product = { _id: string; title: string; slug: string; basePrice: number; salePrice: number; thumbnail: string; stockQuantity: number };

export function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products/best-sellers')
      .then(({ data }) => setProducts(data.data?.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
              What farmers buy most.
            </h2>
          </div>
          <Link to="/shop" className="rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-accent hover:text-accent-foreground transition">
            Browse all
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-[4/5] rounded-3xl" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No products yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}
