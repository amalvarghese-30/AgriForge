import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Loader2, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import api from '@/lib/api';

type Tracking = {
  orderId: string;
  status: string;
  statusLabel: string;
  trackingNumber: string | null;
  expectedDelivery: string | null;
  items: Array<{ title: string; quantity: number; price: number }>;
  total: number;
  createdAt: string;
  statusHistory: Array<{ status: string; timestamp: string; note: string }>;
};

const STATUS_ICONS: Record<string, React.ComponentType<{ className: string }>> = {
  pending: Clock,
  confirmed: CheckCircle,
  shipped: Truck,
  delivered: Package,
};

export function Component() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Tracking | null>(null);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const { data } = await api.post('/orders/track-order', { orderId: orderId.trim(), email: email.trim() || undefined });
      if (data.data) setResult(data.data);
      else setError('Order not found. Please check the order ID.');
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || 'Failed to track order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Track Order | AgriForge</title></Helmet>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Track Your Order</h1>

        <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Order ID</label>
            <input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              required
              placeholder="e.g. 60f1a2b3c4d5e6f7a8b9c0d1"
              className="w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Email (optional, for guest orders)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <button type="submit" disabled={loading || !orderId.trim()} className="w-full rounded-full bg-primary text-primary-foreground py-3 font-bold hover:bg-accent hover:text-accent-foreground transition disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Track order'}
          </button>
        </form>

        {error && <p className="mt-4 text-sm text-destructive text-center">{error}</p>}

        {result && (
          <div className="mt-8 rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Order #{result.orderId}</h2>
              <span className="rounded-full bg-accent/10 text-accent font-semibold px-4 py-1 text-sm">{result.statusLabel}</span>
            </div>
            {result.trackingNumber && <p className="text-sm text-muted-foreground mt-1">Tracking: {result.trackingNumber}</p>}
            {result.expectedDelivery && <p className="text-sm text-muted-foreground">Expected: {new Date(result.expectedDelivery).toLocaleDateString()}</p>}

            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-3">Order Progress</h3>
              <div className="space-y-3">
                {result.statusHistory.map((h, i) => {
                  const Icon = STATUS_ICONS[h.status] || Clock;
                  const isLatest = i === result.statusHistory.length - 1;
                  return (
                    <div key={i} className={`flex items-center gap-3 ${i > 0 ? '' : ''}`}>
                      <Icon className={`h-5 w-5 ${isLatest ? 'text-accent' : 'text-muted-foreground/50'}`} />
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${isLatest ? '' : 'text-muted-foreground'}`}>{h.status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</div>
                        {h.note && <div className="text-xs text-muted-foreground">{h.note}</div>}
                      </div>
                      <div className="text-xs text-muted-foreground">{new Date(h.timestamp).toLocaleDateString()}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 border-t border-border pt-4">
              <h3 className="text-sm font-semibold mb-2">Items</h3>
              {result.items.map((it, i) => (
                <div key={i} className="flex justify-between text-sm"><span>{it.title} × {it.quantity}</span><span className="font-semibold">₹{it.price.toLocaleString('en-IN')}</span></div>
              ))}
              <div className="flex justify-between font-bold mt-2 pt-2 border-t border-border">Total <span>₹{result.total.toLocaleString('en-IN')}</span></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
