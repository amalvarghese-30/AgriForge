import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Loader2, ShoppingCart, Heart, Share2, TrendingUp, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import api from '@/lib/api';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { useRecentlyViewed } from '@/hooks/use-recently-viewed';
import { Stars, ProductReviews } from '@/components/site/ProductReviews';
import { VariantSelector, useVariants, type Variant } from '@/components/site/VariantSelector';
import { RelatedProducts } from '@/components/site/RelatedProducts';
import { RecentlyViewed } from '@/components/site/RecentlyViewed';
import { StockNotifyForm } from '@/components/site/StockNotifyForm';
import { ImageZoomGallery } from '@/components/site/ImageZoomGallery';
import { toast } from 'sonner';

type Product = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  basePrice: number;
  salePrice: number;
  stockQuantity: number;
  inStock: boolean;
  thumbnail: string;
  images: Array<{ url: string; alt: string }>;
  categoryId: { _id: string; name: string; slug: string } | string;
  brandId: { _id: string; name: string; slug: string } | string;
  ratings: { average: number; count: number };
  specifications: Record<string, string>;
  seo: { title: string; description: string };
};

export function Component() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const { addToCart } = useCart();
  const { has, toggle } = useWishlist();
  const { track } = useRecentlyViewed();
  const { data: variants } = useVariants(product?._id || '');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.get(`/products/${slug}`)
      .then(({ data }) => { setProduct(data.data); setError(false); track(data.data._id); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <div className="grid place-items-center py-32"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>;
  if (error || !product) return <div className="max-w-7xl mx-auto px-4 py-32 text-center"><h1 className="text-2xl font-bold">Product not found</h1><Link to="/shop" className="text-accent underline mt-4 inline-block">Back to shop</Link></div>;

  const price = product.salePrice || product.basePrice;
  const maybeDisc = product.salePrice && product.basePrice > product.salePrice
    ? Math.round((1 - product.salePrice / product.basePrice) * 100) : 0;
  const oos = !product.inStock || product.stockQuantity <= 0;
  const catId = typeof product.categoryId === 'object' ? product.categoryId?._id : product.categoryId;
  const catName = typeof product.categoryId === 'object' ? product.categoryId?.name : '';
  const brandName = typeof product.brandId === 'object' ? product.brandId?.name : '';
  const brandSlug = typeof product.brandId === 'object' ? product.brandId?.slug : '';
  const wished = has(product._id);

  return (
    <>
      <Helmet>
        <title>{product.seo?.title || product.title} | AgriForge</title>
        <meta name="description" content={product.seo?.description || product.description?.slice(0, 160)} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-accent">Home</Link> / <Link to="/shop" className="hover:text-accent">Shop</Link>
          {catName && <span> / <Link to={`/shop?category=${catId}`} className="hover:text-accent">{catName}</Link></span>}
          <span className="text-foreground"> / {product.title}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10">
          <div>
            {product.images?.length > 0 ? <ImageZoomGallery images={product.images} /> : (
              <div className="aspect-[4/5] rounded-3xl bg-secondary grid place-items-center text-muted-foreground">No image</div>
            )}
          </div>

          <div>
            {brandName && <div className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-2">{brandName}</div>}
            <h1 className="text-3xl sm:text-4xl font-bold">{product.title}</h1>
            <div className="mt-2 flex items-center gap-3">
              <Stars value={product.ratings?.average || 0} size={16} />
              <span className="text-sm text-muted-foreground">({product.ratings?.count || 0} reviews)</span>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-primary">₹{price.toLocaleString('en-IN')}</span>
              {maybeDisc > 0 && (
                <>
                  <span className="text-lg line-through text-muted-foreground">₹{product.basePrice.toLocaleString('en-IN')}</span>
                  <span className="rounded-full bg-green-100 text-green-800 px-2.5 py-0.5 text-xs font-bold">{maybeDisc}% off</span>
                </>
              )}
            </div>

            <VariantSelector variants={variants} selectedId={selectedVariant?._id || null} onSelect={(v) => setSelectedVariant(v)} />

            {oos ? (
              <div className="mt-6">
                <div className="rounded-full bg-destructive/10 text-destructive font-semibold px-4 py-2 text-sm inline-block mb-4">Out of Stock</div>
                <StockNotifyForm productId={product._id} variantId={selectedVariant?._id} />
              </div>
            ) : (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="flex items-center rounded-full border border-border">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-lg font-bold hover:bg-secondary rounded-l-full" disabled={qty <= 1}>-</button>
                  <span className="px-4 py-2 font-semibold tabular-nums">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="px-3 py-2 text-lg font-bold hover:bg-secondary rounded-r-full">+</button>
                </div>
                <button onClick={() => addToCart(product._id, qty)} className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 font-semibold hover:bg-accent hover:text-accent-foreground transition">
                  <ShoppingCart className="h-4 w-4" /> Add to cart
                </button>
                <button onClick={() => toggle(product._id)} className={`grid h-11 w-11 place-items-center rounded-full border transition ${wished ? 'bg-accent text-accent-foreground border-accent' : 'border-border hover:border-accent'}`}>
                  <Heart className={`h-5 w-5 ${wished ? 'fill-current' : ''}`} />
                </button>
                <button onClick={() => { navigator.share ? navigator.share({ title: product.title, url: window.location.href }) : (navigator.clipboard.writeText(window.location.href), toast.success('Link copied')); }} className="grid h-11 w-11 place-items-center rounded-full border border-border hover:border-accent transition">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            )}

            <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 rounded-xl bg-secondary/40 p-3"><Truck className="h-4 w-4 text-accent" /> Free shipping</div>
              <div className="flex items-center gap-2 rounded-xl bg-secondary/40 p-3"><RotateCcw className="h-4 w-4 text-accent" /> Easy returns</div>
              <div className="flex items-center gap-2 rounded-xl bg-secondary/40 p-3"><ShieldCheck className="h-4 w-4 text-accent" /> Warranty</div>
              <div className="flex items-center gap-2 rounded-xl bg-secondary/40 p-3"><TrendingUp className="h-4 w-4 text-accent" /> Quality assured</div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-[1fr_320px] gap-10">
          <div>
            <h2 className="font-display text-3xl mb-4">Description</h2>
            <div className="prose max-w-none text-foreground/80 leading-relaxed whitespace-pre-line">{product.description}</div>
            {Object.keys(product.specifications || {}).length > 0 && (
              <div className="mt-8">
                <h3 className="font-bold text-lg mb-3">Specifications</h3>
                <table className="w-full border-collapse">
                  <tbody>
                    {Object.entries(product.specifications).map(([k, v]) => (
                      <tr key={k} className="border-b border-border">
                        <td className="py-2 pr-4 text-sm text-muted-foreground font-medium">{k}</td>
                        <td className="py-2 text-sm">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-bold">Delivery</h3>
              <p className="text-sm text-muted-foreground mt-1">Free delivery across India. Dispatched within 2 business days.</p>
            </div>
          </aside>
        </div>

        <ProductReviews productId={product._id} />
        <RelatedProducts productId={product._id} categoryId={catId} />
        <RecentlyViewed excludeId={product._id} title="Recently viewed" />
      </div>
    </>
  );
}
