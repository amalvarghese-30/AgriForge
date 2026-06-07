import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Minus, Plus, Trash2, ShoppingBag, ImageOff } from "lucide-react";
import { CouponInput } from "@/components/site/CouponInput";
import { useCoupon } from "@/hooks/use-coupon";

export function CartDrawer() {
  const { open, setOpen, items, subtotal, updateQty, removeItem, count } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { coupon } = useCoupon();
  const discount = coupon?.discount ?? 0;
  const grand = Math.max(0, subtotal - discount);

  const goCheckout = () => {
    setOpen(false);
    if (!user) {
      navigate("/auth?mode=login&redirect=/checkout");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 bg-[var(--color-beige)]">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <SheetTitle className="font-display text-2xl tracking-wide">
            Your Cart <span className="text-muted-foreground text-base">({count})</span>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 grid place-items-center px-6 text-center">
            <div>
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-secondary">
                <ShoppingBag className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="mt-4 font-display text-xl">Cart is empty</h3>
              <p className="mt-1 text-sm text-muted-foreground">Add machinery or parts to get started.</p>
              <Link
                to="/shop"
                onClick={() => setOpen(false)}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-accent hover:text-accent-foreground transition"
              >
                Browse Shop
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map((it) => {
                const product = typeof it.productId === 'object' ? it.productId : null;
                const itemId = it._id || (typeof it.productId === 'string' ? it.productId : it.productId?._id || '');
                const imgSrc = product?.thumbnail || (Array.isArray(product?.images) && product.images.length > 0
                  ? (typeof product.images[0] === 'string' ? product.images[0] : (product.images[0] as { url: string })?.url)
                  : undefined);
                const productName = product?.title || 'Product';
                const price = product?.salePrice || product?.basePrice || 0;
                const slug = product?.slug || '';

                return (
                  <div key={itemId} className="flex gap-3 rounded-2xl bg-card border border-border p-3">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-secondary grid place-items-center text-muted-foreground/40">
                      <ImageOff className="h-5 w-5 absolute" />
                      {imgSrc && (
                        <img src={imgSrc} alt={productName} className="relative h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/shop/${slug}`}
                        onClick={() => setOpen(false)}
                        className="block truncate text-sm font-semibold hover:text-accent"
                      >
                        {productName}
                      </Link>
                      <div className="mt-1 text-sm font-bold text-primary">
                        ₹{Number(price).toLocaleString("en-IN")}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-full border border-border bg-background">
                          <button
                            aria-label="Decrease"
                            onClick={() => void updateQty(itemId, it.quantity - 1)}
                            className="grid h-8 w-8 place-items-center hover:bg-secondary rounded-l-full"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">{it.quantity}</span>
                          <button
                            aria-label="Increase"
                            onClick={() => void updateQty(itemId, it.quantity + 1)}
                            className="grid h-8 w-8 place-items-center hover:bg-secondary rounded-r-full"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <button
                          aria-label="Remove"
                          onClick={() => void removeItem(itemId)}
                          className="grid h-8 w-8 place-items-center text-muted-foreground hover:text-destructive rounded-full"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-border px-6 py-5 space-y-4 bg-card">
              <CouponInput subtotal={subtotal} />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground uppercase tracking-wider">Subtotal</span>
                <span className="text-lg font-bold">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-accent">
                  <span className="text-sm uppercase tracking-wider">Discount</span>
                  <span className="font-bold">−₹{discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="text-sm text-muted-foreground uppercase tracking-wider">Total</span>
                <span className="text-2xl font-extrabold text-primary">₹{grand.toLocaleString("en-IN")}</span>
              </div>
              <p className="text-xs text-muted-foreground">Shipping &amp; taxes calculated at checkout.</p>
              <button
                onClick={goCheckout}
                className="w-full inline-flex items-center justify-center rounded-full bg-accent text-accent-foreground px-6 py-3.5 font-semibold hover:brightness-110 transition"
              >
                Checkout
              </button>
              <Link
                to="/shop"
                onClick={() => setOpen(false)}
                className="block text-center text-sm text-muted-foreground hover:text-accent"
              >
                Continue shopping
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
