import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { ProductCard } from '@/components/site/ProductCard';

export function RelatedProducts({ productId, categoryId }: { productId: string; categoryId: string | null | undefined }) {
  const [products, setProducts] = useState<Array<{ _id: string; title: string; slug: string; basePrice: number; salePrice: number; thumbnail: string; stockQuantity: number }>>([]);

  useEffect(() => {
    if (!productId) return;
    const params: Record<string, string | number> = {};
    if (categoryId) params.category = categoryId;
    api.get(`/products/${productId}/related`, { params })
      .then(({ data }) => setProducts(data.data || []))
      .catch(() => {});
  }, [productId, categoryId]);

  if (products.length === 0) return null;
  return (
    <section className="mt-20">
      <div className="flex items-end justify-between mb-8">
        <h2 className="font-display text-3xl sm:text-4xl">You may also like</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {products.map((p) => <ProductCard key={p._id} product={p} />)}
      </div>
    </section>
  );
}
