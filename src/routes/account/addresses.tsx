import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Loader2, Plus, MapPin, Trash2, Pencil, Check } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

type Address = {
  _id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

const empty = (): Partial<Address> => ({ label: '', fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' });

export function Component() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Address> | null>(null);
  const [saving, setSaving] = useState(false);

  const fetch = () => {
    setLoading(true);
    api.get('/account/addresses')
      .then(({ data }) => setAddresses(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const { _id, ...payload } = editing;
    setSaving(true);
    try {
      if (_id) {
        await api.put(`/account/addresses/${_id}`, payload);
      } else {
        await api.post('/account/addresses', payload);
      }
      toast.success(_id ? 'Address updated' : 'Address added');
      setEditing(null);
      fetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await api.delete(`/account/addresses/${id}`);
      toast.success('Address removed');
      fetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Failed to delete');
    }
  };

  const setDefault = async (id: string) => {
    try {
      await api.put(`/account/addresses/${id}`, { isDefault: true });
      fetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Failed to update');
    }
  };

  const fields = [
    { key: 'label', label: 'Address Label', placeholder: 'e.g. Home, Farm, Office', required: true },
    { key: 'fullName', label: 'Full Name', placeholder: 'Full name', required: true },
    { key: 'phone', label: 'Phone', placeholder: '10-digit mobile number', required: true },
    { key: 'line1', label: 'Address Line 1', placeholder: 'Street, building, etc.', required: true },
    { key: 'line2', label: 'Address Line 2', placeholder: 'Landmark, area', required: false },
    { key: 'city', label: 'City', placeholder: 'City', required: true },
    { key: 'state', label: 'State', placeholder: 'State', required: true },
    { key: 'pincode', label: 'Pincode', placeholder: '6-digit pincode', required: true },
  ];

  return (
    <>
      <Helmet><title>My Addresses | AgriForge</title></Helmet>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Addresses</h1>
          <button onClick={() => setEditing(empty())} className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-accent hover:text-accent-foreground transition">
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>

        {loading ? (
          <div className="grid place-items-center py-20"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
        ) : addresses.length === 0 && !editing ? (
          <div className="py-20 text-center text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="mb-2">No saved addresses.</p>
            <button onClick={() => setEditing(empty())} className="text-accent underline">Add one</button>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((a) => (
              <div key={a._id} className="rounded-2xl border border-border p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-sm flex items-center gap-2">
                      {a.label}
                      {a.isDefault && <span className="rounded-full bg-accent/10 text-accent text-[10px] font-bold px-2 py-0.5">Default</span>}
                    </div>
                    <div className="text-sm text-muted-foreground mt-0.5">{a.fullName} · {a.phone}</div>
                    <div className="text-sm text-muted-foreground">{a.line1}{a.line2 ? `, ${a.line2}` : ''}, {a.city}, {a.state} — {a.pincode}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    {!a.isDefault && <button onClick={() => setDefault(a._id)} title="Set as default" className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary"><Check className="h-4 w-4" /></button>}
                    <button onClick={() => setEditing(a)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => remove(a._id)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-destructive/10"><Trash2 className="h-4 w-4 text-destructive" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {editing && (
          <div className="mt-6 rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold mb-4">{editing._id ? 'Edit address' : 'New address'}</h2>
            <form onSubmit={save} className="space-y-3">
              {fields.map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-semibold mb-1">{f.label}{f.required ? ' *' : ''}</label>
                  <input
                    value={(editing as any)[f.key] || ''}
                    onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
                    required={f.required}
                    placeholder={f.placeholder}
                    className="w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-2.5 font-semibold hover:bg-accent hover:text-accent-foreground transition disabled:opacity-50">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
                </button>
                <button type="button" onClick={() => setEditing(null)} className="rounded-full border border-border px-6 py-2.5 font-semibold hover:bg-secondary transition">Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
