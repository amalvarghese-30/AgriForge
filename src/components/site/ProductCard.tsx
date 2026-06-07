import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { useState } from 'react';

export type ProductCardData = {
  _id: string;
  title?: string;
  name?: string;
  slug: string;
  basePrice?: number;
  salePrice?: number;
  price?: number;
  compareAtPrice?: number | null;
  compare_at_price?: number | null;
  thumbnail?: string;
  images?: unknown;
  stock?: number;
  stockQuantity?: number;
  inStock?: boolean;
};

function firstImageUrl(product: ProductCardData): string | undefined {
  if (product.thumbnail) return product.thumbnail;
  if (Array.isArray(product.images) && product.images.length > 0) {
    const first = product.images[0];
    return typeof first === 'string' ? first : (first as { url?: string })?.url;
  }
  return undefined;
}

function resolve(product: ProductCardData) {
  const id = product._id;
  const name = product.title || product.name || '';
  const price = product.salePrice ?? product.price ?? product.basePrice ?? 0;
  const compareAt = product.compareAtPrice ?? product.compare_at_price ?? null;
  const img = firstImageUrl(product);
  const stock = product.stockQuantity ?? product.stock ?? (product.inStock === false ? 0 : 1);
  const oos = stock <= 0;
  return { id, name, price, compareAt, img, stock, oos };
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const { addToCart } = useCart();
  const { has, toggle } = useWishlist();
  const { id, name, price, compareAt, img, stock, oos } = resolve(product);
  const wished = has(id);
  const [imgError, setImgError] = useState(false);
  const showImg = img && !imgError;

  return (
    <article className="group relative overflow-hidden rounded-3xl bg-card border border-border transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
      <Link to={`/shop/${product.slug}`} className="block relative aspect-[4/5] bg-secondary overflow-hidden">
        {showImg ? (
          <img src={img} alt={name} loading="lazy" onError={() => setImgError(true)} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="grid h-full place-items-center text-muted-foreground/40">No image</div>
        )}
        <button
          aria-label="Wishlist"
          onClick={(e) => { e.preventDefault(); void toggle(id); }}
          className={`absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full transition ${wished ? 'bg-accent text-accent-foreground' : 'bg-white/95 text-ink hover:bg-accent hover:text-accent-foreground'}`}
        >
          <Heart className={`h-4 w-4 ${wished ? 'fill-current' : ''}`} />
        </button>
        {oos && (
          <div className="absolute top-3 left-3 rounded-full bg-destructive/90 text-destructive-foreground px-2.5 py-1 text-[10px] font-bold tracking-wider">
            OUT OF STOCK
          </div>
        )}
      </Link>
      <div className="p-5">
        <Link to={`/shop/${product.slug}`}>
          <h3 className="text-base font-bold text-foreground leading-snug line-clamp-2 hover:text-accent transition">{name}</h3>
        </Link>
        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <div className="text-lg font-extrabold text-primary">₹{Number(price).toLocaleString('en-IN')}</div>
            {compareAt && compareAt > price && (
              <div className="text-xs text-muted-foreground line-through">₹{Number(compareAt).toLocaleString('en-IN')}</div>
            )}
          </div>
          <button
            disabled={oos}
            onClick={() => void addToCart(id, 1)}
            aria-label="Add to cart"
            className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground transition disabled:opacity-40"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
