import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Loader2, Heart, ShoppingCart } from 'lucide-react';
import { useWishlist } from '@/hooks/use-wishlist';
import { useCart } from '@/hooks/use-cart';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

type Product = { _id: string; title: string; slug: string; basePrice: number; salePrice: number; thumbnail: string; inStock: boolean };

export function Component() {
  const { ids, toggle } = useWishlist();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ids.size === 0) { setProducts([]); return; }
    setLoading(true);
    api.post('/products/batch', { ids: [...ids] })
      .then(({ data }) => setProducts(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [ids.size]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Helmet><title>Wishlist | AgriForge</title></Helmet>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

        {loading ? (
          <div className="grid place-items-center py-20"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="mb-2">Your wishlist is empty.</p>
            <Link to="/shop" className="text-accent underline">Browse products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <div key={p._id} className="group relative overflow-hidden rounded-3xl bg-card border border-border">
                <Link to={`/shop/${p.slug}`} className="block aspect-[4/5] bg-secondary overflow-hidden">
                  {p.thumbnail ? <img src={p.thumbnail} alt={p.title} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-muted-foreground/40">No image</div>}
                </Link>
                <div className="p-5">
                  <Link to={`/shop/${p.slug}`}><h3 className="font-bold text-sm line-clamp-2 hover:text-accent">{p.title}</h3></Link>
                  <div className="mt-2 font-extrabold text-primary">₹{(p.salePrice || p.basePrice || 0).toLocaleString('en-IN')}</div>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => addToCart(p._id, 1)} disabled={!p.inStock} className="flex-1 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-accent hover:text-accent-foreground disabled:opacity-40 flex items-center justify-center gap-1">
                      <ShoppingCart className="h-3 w-3" /> Add to cart
                    </button>
                    <button onClick={() => toggle(p._id)} className="grid h-9 w-9 place-items-center rounded-full bg-accent text-accent-foreground">
                      <Heart className="h-4 w-4 fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
