import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Loader2, Package, ChevronRight, Truck, Clock, CheckCircle } from 'lucide-react';
import api from '@/lib/api';

type OrderItem = { _id: string; title: string; price: number; quantity: number; thumbnail: string };
type Order = {
  _id: string;
  orderNumber: string;
  status: string;
  items: OrderItem[];
  total: number;
  trackingNumber: string | null;
  paymentStatus: string;
  createdAt: string;
};

const STATUS_ICONS: Record<string, React.ComponentType<{ className: string }>> = {
  pending: Clock,
  confirmed: CheckCircle,
  shipped: Truck,
  delivered: Package,
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export function Component() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders')
      .then(({ data }) => setOrders(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet><title>My Orders | AgriForge</title></Helmet>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {loading ? (
          <div className="grid place-items-center py-20"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="mb-2">No orders yet.</p>
            <Link to="/shop" className="text-accent underline">Start shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => {
              const Icon = STATUS_ICONS[o.status] || Clock;
              const color = STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-800';
              return (
                <Link key={o._id} to={`/orders/${o._id}`} className="block rounded-2xl border border-border bg-card p-5 hover:border-accent/40 transition group">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-bold">#{o.orderNumber}</h2>
                        <span className={`rounded-full text-xs font-semibold px-2.5 py-0.5 capitalize ${color}`}>
                          <Icon className="h-3 w-3 inline mr-1" />{o.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition" />
                  </div>
                  <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
                    {o.items.map((it, i) => (
                      <div key={i} className="h-14 w-14 rounded-lg bg-secondary overflow-hidden shrink-0">
                        {it.thumbnail && <img src={it.thumbnail} alt="" className="h-full w-full object-cover" />}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{o.items.length} item{o.items.length === 1 ? '' : 's'}</span>
                    <span className="font-bold text-primary">₹{o.total.toLocaleString('en-IN')}</span>
                  </div>
                  {o.trackingNumber && <div className="mt-2 text-xs text-muted-foreground">Tracking: {o.trackingNumber}</div>}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
