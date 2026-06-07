import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Loader2, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import api from '@/lib/api';
import { ProductCard } from '@/components/site/ProductCard';

type Product = { _id: string; title: string; slug: string; basePrice: number; salePrice: number; thumbnail: string; stockQuantity: number };
type Category = { _id: string; name: string; slug: string };
type Brand = { _id: string; name: string; slug: string };

export function Component() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const page = Number(searchParams.get('page') || '1');
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';
  const sort = searchParams.get('sort') || 'createdAt_desc';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const inStock = searchParams.get('inStock') || '';

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.data || [])).catch(() => {});
    api.get('/brands').then(({ data }) => setBrands(data.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string | number> = { page, limit: 12, sort };
    if (category) params.category = category;
    if (brand) params.brand = brand;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (inStock === 'true') params.inStock = true;
    api.get('/products', { params })
      .then(({ data }) => {
        setProducts(data.data || []);
        setTotal(data.pagination?.total || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, category, brand, sort, minPrice, maxPrice, inStock]);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    if (key !== 'page') next.delete('page');
    setSearchParams(next);
  };

  const totalPages = Math.ceil(total / 12);

  return (
    <>
      <Helmet><title>Shop | AgriForge</title></Helmet>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Shop Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="bg-gray-50 rounded-lg p-4 space-y-5">
            <div>
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-1"><SlidersHorizontal className="h-3 w-3" /> Filters</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Category</label>
                  <select value={category} onChange={(e) => setParam('category', e.target.value)} className="w-full mt-1 rounded-lg border px-3 py-2 text-sm">
                    <option value="">All</option>
                    {categories.map((c) => <option key={c._id} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Brand</label>
                  <select value={brand} onChange={(e) => setParam('brand', e.target.value)} className="w-full mt-1 rounded-lg border px-3 py-2 text-sm">
                    <option value="">All</option>
                    {brands.map((b) => <option key={b._id} value={b.slug}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Sort</label>
                  <select value={sort} onChange={(e) => setParam('sort', e.target.value)} className="w-full mt-1 rounded-lg border px-3 py-2 text-sm">
                    <option value="createdAt_desc">Newest</option>
                    <option value="createdAt_asc">Oldest</option>
                    <option value="basePrice_asc">Price: Low to High</option>
                    <option value="basePrice_desc">Price: High to Low</option>
                    <option value="title_asc">Name: A-Z</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Price Range</label>
                  <div className="flex gap-2 mt-1">
                    <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setParam('minPrice', e.target.value)} className="w-full rounded-lg border px-2 py-1 text-sm" />
                    <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setParam('maxPrice', e.target.value)} className="w-full rounded-lg border px-2 py-1 text-sm" />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={inStock === 'true'} onChange={(e) => setParam('inStock', e.target.checked ? 'true' : '')} className="rounded" />
                  In stock only
                </label>
              </div>
            </div>
          </aside>

          <div className="md:col-span-3">
            {loading ? (
              <div className="grid place-items-center py-20"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
            ) : products.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground">No products found. Try adjusting your filters.</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((p) => <ProductCard key={p._id} product={p} />)}
                </div>
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-3">
                    <button disabled={page <= 1} onClick={() => setParam('page', String(page - 1))} className="p-2 rounded-full hover:bg-secondary disabled:opacity-30"><ChevronLeft className="h-4 w-4" /></button>
                    <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
                    <button disabled={page >= totalPages} onClick={() => setParam('page', String(page + 1))} className="p-2 rounded-full hover:bg-secondary disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
