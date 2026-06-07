import { useState } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { ArrowRight, Loader2 } from 'lucide-react';
import api from '@/lib/api';

const schema = z.string().trim().email('Enter a valid email').max(255);

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(email);
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? 'Invalid email'); return; }
    setBusy(true);
    try {
      await api.post('/newsletter/subscribe', { email: parsed.data.toLowerCase() });
      toast.success("Subscribed! Welcome to the Field Report.");
      setEmail('');
    } catch (err: any) {
      if (err?.response?.status === 409) { toast.success("You're already subscribed — thanks!"); setEmail(''); return; }
      toast.error(err?.response?.data?.error?.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 w-full">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@farm.com"
        className="flex-1 rounded-full bg-white/5 border border-white/15 px-6 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-accent transition"
      />
      <button disabled={busy} className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 text-sm font-bold text-accent-foreground hover:brightness-110 transition disabled:opacity-50">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Subscribe <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>}
      </button>
    </form>
  );
}
