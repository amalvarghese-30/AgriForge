import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Loader2, Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import api from '@/lib/api';

type Order = {
  _id: string;
  orderNumber: string;
  status: string;
  items: Array<{ title: string; price: number; quantity: number; thumbnail: string }>;
  total: number;
  shippingAddress: { line1: string; line2: string; city: string; state: string; pincode: string };
  trackingNumber: string | null;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  paymentStatus: string;
  couponCode: string | null;
  discount: number;
  shipping: number;
  statusHistory: Array<{ status: string; timestamp: string; note: string }>;
  createdAt: string;
};

const STATUS_ICONS: Record<string, React.ComponentType<{ className: string }>> = {
  pending: Clock,
  confirmed: CheckCircle,
  shipped: Truck,
  delivered: Package,
  cancelled: XCircle,
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export function Component() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get(`/orders/${id}`)
      .then(({ data }) => { setOrder(data.data); setError(false); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="grid place-items-center py-32"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>;
  if (error || !order) return <div className="max-w-4xl mx-auto px-4 py-32 text-center"><h1 className="text-2xl font-bold">Order not found</h1><Link to="/account/orders" className="text-accent underline mt-4 inline-block">Back to orders</Link></div>;

  const statusColor = STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800';

  return (
    <>
      <Helmet><title>Order {order.orderNumber} | AgriForge</title></Helmet>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/account/orders" className="text-sm text-accent mb-4 inline-block">&larr; Back to orders</Link>

        <div className="flex items-center justify-between mt-2">
          <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
          <span className={`rounded-full px-4 py-1 text-sm font-semibold capitalize ${statusColor}`}>{order.status.replace(/_/g, ' ')}</span>
        </div>

        <div className="text-sm text-muted-foreground mt-1">
          Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          {order.trackingNumber && <span> · Tracking: <strong>{order.trackingNumber}</strong></span>}
        </div>

        {/* Status Timeline */}
        <div className="mt-6 rounded-2xl border border-border p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">Status Timeline</h2>
          <div className="space-y-3">
            {order.statusHistory.map((h, i) => {
              const Icon = STATUS_ICONS[h.status] || Clock;
              const isLatest = i === order.statusHistory.length - 1;
              return (
                <div key={i} className={`flex items-center gap-3 ${isLatest ? '' : ''}`}>
                  <Icon className={`h-5 w-5 ${isLatest ? 'text-accent' : 'text-muted-foreground/50'}`} />
                  <div className="flex-1">
                    <div className={`text-sm font-medium capitalize ${isLatest ? '' : 'text-muted-foreground'}`}>{h.status.replace(/_/g, ' ')}</div>
                    {h.note && <div className="text-xs text-muted-foreground">{h.note}</div>}
                  </div>
                  <div className="text-xs text-muted-foreground">{new Date(h.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Items */}
        <div className="mt-6 rounded-2xl border border-border p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">Items</h2>
          <div className="divide-y divide-border">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4 py-3">
                <div className="h-14 w-14 rounded-lg bg-secondary overflow-hidden shrink-0">
                  {item.thumbnail && <img src={item.thumbnail} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="flex-1"><div className="font-semibold text-sm">{item.title}</div><div className="text-xs text-muted-foreground">Qty: {item.quantity}</div></div>
                <div className="font-bold text-sm">₹{item.price.toLocaleString('en-IN')}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 rounded-2xl border border-border p-6 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{(order.total + order.discount - order.shipping).toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{order.shipping === 0 ? <span className="text-green-600">FREE</span> : `₹${order.shipping}`}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span><span>-₹{order.discount.toLocaleString('en-IN')}</span></div>}
          <div className="flex justify-between pt-2 border-t border-border font-bold text-lg"><span>Total</span><span>₹{order.total.toLocaleString('en-IN')}</span></div>
          {order.razorpayPaymentId && <div className="text-xs text-muted-foreground pt-2">Payment ID: {order.razorpayPaymentId}</div>}
        </div>

        {/* Shipping Address */}
        <div className="mt-6 rounded-2xl border border-border p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-2">Shipping Address</h2>
          <div className="text-sm text-muted-foreground">
            {order.shippingAddress.line1}{order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
          </div>
        </div>
      </div>
    </>
  );
}
