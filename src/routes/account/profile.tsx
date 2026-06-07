import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Loader2, Save, User } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import api from '@/lib/api';
import { toast } from 'sonner';

export function Component() {
  const { user, refresh } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.put('/account/profile', { fullName, phone });
      toast.success('Profile updated');
      refresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Failed to update profile');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Helmet><title>My Profile | AgriForge</title></Helmet>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>

        <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-14 w-14 rounded-full bg-secondary grid place-items-center">
              <User className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <div className="font-bold">{user?.fullName}</div>
              <div className="text-sm text-muted-foreground">{user?.email}</div>
              <div className="text-xs text-muted-foreground capitalize">{user?.roles?.join(', ')}</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Full Name</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Phone</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-accent" />
          </div>
          <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-2.5 font-semibold hover:bg-accent hover:text-accent-foreground transition disabled:opacity-50">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Save changes</>}
          </button>
        </form>
      </div>
    </>
  );
}
