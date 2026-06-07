import { useState } from 'react';
import { toast } from 'sonner';
import { Bell, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';

export function StockNotifyForm({ productId, variantId }: { productId: string; variantId?: string | null }) {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    try {
      await api.post('/stock-notifications', {
        productId,
        variantId: variantId ?? null,
        email: email.trim().toLowerCase(),
      });
      setDone(true);
      toast.success("We'll email you when this is back in stock.");
    } catch (err: any) {
      if (err?.response?.status === 409) {
        setDone(true);
        toast.success("You're already on the list — we'll email you.");
      } else {
        toast.error(err?.response?.data?.error?.message || 'Something went wrong');
      }
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="mt-6 rounded-2xl border border-accent/40 bg-accent/10 p-4 text-sm">
        <Bell className="h-4 w-4 inline mr-2 text-accent" />
        We'll let you know the moment this is back in stock.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-sm font-semibold mb-2">
        <Bell className="h-4 w-4 text-accent" /> Notify me when back in stock
      </div>
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={user?.email || 'your@email.com'}
          className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-accent hover:text-accent-foreground transition disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Notify me'}
        </button>
      </div>
    </form>
  );
}
