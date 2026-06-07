import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Loader2, ChevronRight, Trash2, Plus, Minus } from 'lucide-react';
import api from '@/lib/api';
import { useCart, type CartItem } from '@/hooks/use-cart';
import { useCoupon } from '@/hooks/use-coupon';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

type CartProduct = {
  _id: string;
  title: string;
  slug: string;
  basePrice: number;
  salePrice: number;
  thumbnail: string;
  inStock: boolean;
};

type Address = { _id: string; label: string; line1: string; line2: string; city: string; state: string; pincode: string; isDefault: boolean };

export function Component() {
  const { user } = useAuth();
  const { items, subtotal, updateQty, removeItem, clear } = useCart();
  const { coupon, applying, apply, revalidate, clear: clearCoupon } = useCoupon();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [couponCode, setCouponCode] = useState('');
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    api.get('/account/addresses').then(({ data }) => {
      setAddresses(data.data || []);
      const def = (data.data || []).find((a: Address) => a.isDefault);
      if (def) setSelectedAddress(def._id);
    }).catch(() => {});
  }, [user]);

  useEffect(() => { revalidate(subtotal); }, [subtotal]); // eslint-disable-line react-hooks/exhaustive-deps

  const discount = coupon?.discount || 0;
  const shipping = subtotal >= 5000 ? 0 : 299;
  const orderTotal = Math.max(0, subtotal - discount + shipping);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    const ok = await apply(couponCode, subtotal);
    if (ok) setCouponCode('');
  };

  const placeOrder = async () => {
    if (!selectedAddress) { toast.error('Select a delivery address'); return; }
    setPlacing(true);
    try {
      const { data: orderRes } = await api.post('/orders', {
        addressId: selectedAddress,
        couponCode: coupon?.code || undefined,
      });

      const { order, razorpay } = orderRes.data;

      if (razorpay?.orderId) {
        // Load Razorpay checkout
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        await new Promise<void>((resolve) => { script.onload = () => resolve(); });

        const rzp = new (window as any).Razorpay({
          key: razorpay.key,
          amount: razorpay.amount,
          currency: razorpay.currency,
          name: 'AgriForge',
          description: `Order #${order.orderNumber}`,
          order_id: razorpay.orderId,
          prefill: {
            name: user?.fullName || '',
            email: user?.email || '',
          },
          theme: { color: '#16a34a' },
          handler: async (response: any) => {
            try {
              await api.post('/payments/verify', {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
              toast.success('Payment successful!');
              clear();
              clearCoupon();
              navigate(`/orders/${order._id}`);
            } catch {
              toast.error('Payment verification failed. Contact support.');
            }
          },
        });
        rzp.on('payment.failed', () => { toast.error('Payment failed. Please try again.'); });
        rzp.open();
      } else {
        toast.success('Order placed successfully!');
        clear();
        clearCoupon();
        navigate('/account/orders');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  const getProduct = (item: CartItem): CartProduct => {
    if (typeof item.productId === 'object') return item.productId as CartProduct;
    return { _id: item.productId as string, title: 'Product', slug: '#', basePrice: 0, salePrice: 0, thumbnail: '', inStock: true };
  };

  if (items.length === 0 && !coupon) {
    return (
      <>
        <Helmet><title>Checkout | AgriForge</title></Helmet>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Link to="/shop" className="text-accent underline">Browse products</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet><title>Checkout | AgriForge</title></Helmet>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          <div className="space-y-6">
            {/* Delivery Address */}
            <section className="rounded-2xl border border-border p-6">
              <h2 className="text-lg font-bold mb-3">Delivery Address</h2>
              {addresses.length === 0 ? (
                <p className="text-sm text-muted-foreground">No saved addresses. <Link to="/account/addresses" className="text-accent underline">Add one</Link></p>
              ) : (
                <div className="space-y-2">
                  {addresses.map((a) => (
                    <label key={a._id} className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition ${selectedAddress === a._id ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/40'}`}>
                      <input type="radio" name="address" checked={selectedAddress === a._id} onChange={() => setSelectedAddress(a._id)} className="mt-0.5" />
                      <div>
                        <div className="font-semibold text-sm flex items-center gap-2">{a.label} {a.isDefault && <span className="text-[10px] uppercase bg-secondary px-2 py-0.5 rounded-full">Default</span>}</div>
                        <div className="text-xs text-muted-foreground">{a.line1}{a.line2 ? `, ${a.line2}` : ''}, {a.city}, {a.state} — {a.pincode}</div>
                      </div>
                    </label>
                  ))}
                  <Link to="/account/addresses" className="text-sm text-accent underline inline-block mt-2">+ Add new address</Link>
                </div>
              )}
            </section>

            {/* Cart Items */}
            <section className="rounded-2xl border border-border p-6">
              <h2 className="text-lg font-bold mb-3">Cart Items</h2>
              <div className="divide-y divide-border">
                {items.map((item) => {
                  const p = getProduct(item);
                  const itemId = item._id || (typeof item.productId === 'string' ? item.productId : (item.productId as CartProduct)._id);
                  return (
                    <div key={itemId} className="flex items-center gap-4 py-3">
                      <div className="h-16 w-16 rounded-lg bg-secondary overflow-hidden shrink-0">
                        {p.thumbnail && <img src={p.thumbnail} alt="" className="h-full w-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link to={`/shop/${p.slug}`} className="font-semibold text-sm line-clamp-1 hover:text-accent">{p.title}</Link>
                        <div className="text-sm font-bold text-primary mt-0.5">₹{(p.salePrice || p.basePrice || 0).toLocaleString('en-IN')}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateQty(itemId, item.quantity - 1)} className="grid h-7 w-7 place-items-center rounded-full hover:bg-secondary" disabled={item.quantity <= 1}><Minus className="h-3 w-3" /></button>
                        <span className="w-8 text-center text-sm font-semibold tabular-nums">{item.quantity}</span>
                        <button onClick={() => updateQty(itemId, item.quantity + 1)} className="grid h-7 w-7 place-items-center rounded-full hover:bg-secondary"><Plus className="h-3 w-3" /></button>
                      </div>
                      <button onClick={() => removeItem(itemId)} className="text-muted-foreground hover:text-destructive transition"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Order Summary */}
          <aside>
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 space-y-4">
              <h2 className="text-lg font-bold">Order Summary</h2>
              <div className="text-sm space-y-2">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? <span className="text-green-600 font-semibold">FREE</span> : `₹${shipping}`}</span></div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600"><span>Discount ({coupon?.code})</span><span>-₹{discount.toLocaleString('en-IN')}</span></div>
                )}
                <div className="flex justify-between pt-2 border-t border-border text-lg font-bold"><span>Total</span><span>₹{orderTotal.toLocaleString('en-IN')}</span></div>
              </div>

              <div className="flex gap-2">
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon code"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleApplyCoupon(); } }}
                  className="flex-1 rounded-full border border-border px-4 py-2 text-sm focus:outline-none focus:border-accent"
                  disabled={!!coupon}
                />
                <button onClick={handleApplyCoupon} disabled={applying || !!coupon || !couponCode.trim()} className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold hover:bg-accent hover:text-accent-foreground transition disabled:opacity-50">
                  {applying ? <Loader2 className="h-4 w-4 animate-spin" /> : coupon ? 'Applied' : 'Apply'}
                </button>
              </div>

              <button
                onClick={placeOrder}
                disabled={placing || !selectedAddress}
                className="w-full rounded-full bg-primary text-primary-foreground py-3 font-bold hover:bg-accent hover:text-accent-foreground transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {placing ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Place Order <ChevronRight className="h-4 w-4" /></>}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
