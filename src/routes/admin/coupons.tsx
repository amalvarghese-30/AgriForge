import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { DataTable, type ColumnDef } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Coupon {
  _id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  maxDiscount: number;
  usageLimit: number;
  currentUsage: number;
  expiresAt: string;
  isActive: boolean;
}

const EMPTY: Coupon = {
  _id: '', code: '', type: 'percentage', value: 0, minOrderValue: 0,
  maxDiscount: 0, usageLimit: 0, currentUsage: 0, expiresAt: '', isActive: true,
};

export function Component() {
  const [items, setItems] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<Coupon>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetch = () => {
    setLoading(true);
    api.get('/admin/coupons').then(({ data }) => setItems(data.data || []))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setForm(EMPTY); setDialogOpen(true); };
  const openEdit = (c: Coupon) => { setForm({ ...c }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!form.code || !form.value) { toast.error('Code and value are required'); return; }
    setSaving(true);
    const payload = { ...form, code: form.code.toUpperCase() };
    try {
      if (form._id) {
        await api.put(`/admin/coupons/${form._id}`, payload);
        toast.success('Coupon updated');
      } else {
        await api.post('/admin/coupons', payload);
        toast.success('Coupon created');
      }
      setDialogOpen(false);
      fetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await api.delete(`/admin/coupons/${deleteId}`); toast.success('Deleted'); setDeleteId(null); fetch(); }
    catch (err: any) { toast.error(err?.response?.data?.error?.message || 'Failed to delete'); }
  };

  const columns: ColumnDef<Coupon>[] = [
    { header: 'Code', render: (c) => <span className="font-semibold font-mono text-sm">{c.code}</span> },
    { header: 'Type', render: (c) => <span className="text-sm">{c.type === 'percentage' ? `₹${c.value}%` : `₹${c.value} off`}</span> },
    { header: 'Min Order', render: (c) => <span className="text-sm">₹{c.minOrderValue.toLocaleString('en-IN')}</span> },
    { header: 'Usage', render: (c) => <span className="text-sm tabular-nums">{c.currentUsage}/{c.usageLimit || '∞'}</span> },
    {
      header: 'Status',
      render: (c) => {
        const expired = c.expiresAt && new Date(c.expiresAt) < new Date();
        const active = c.isActive && !expired;
        return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{active ? 'Active' : 'Inactive'}</span>;
      },
    },
    {
      header: '', className: 'w-[80px]',
      render: (c) => (
        <div className="flex items-center gap-1 justify-end">
          <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleteId(c._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Helmet><title>Coupons | Admin | AgriForge</title></Helmet>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" /> New Coupon</Button>
      </div>

      <DataTable columns={columns} data={items} loading={loading} keyExtractor={(c) => c._id} emptyMessage="No coupons yet." />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{form._id ? 'Edit Coupon' : 'New Coupon'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Code *</Label>
              <Input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="SUMMER25" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Type</Label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as 'percentage' | 'fixed' })} className="w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-accent bg-transparent">
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label>Value *</Label>
                <Input type="number" value={String(form.value)} onChange={e => setForm({ ...form, value: Number(e.target.value) })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Min Order Value</Label>
                <Input type="number" value={String(form.minOrderValue)} onChange={e => setForm({ ...form, minOrderValue: Number(e.target.value) })} />
              </div>
              <div className="space-y-1">
                <Label>Max Discount</Label>
                <Input type="number" value={String(form.maxDiscount)} onChange={e => setForm({ ...form, maxDiscount: Number(e.target.value) })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Usage Limit</Label>
                <Input type="number" value={String(form.usageLimit)} onChange={e => setForm({ ...form, usageLimit: Number(e.target.value) })} placeholder="0 = unlimited" />
              </div>
              <div className="space-y-1">
                <Label>Expiry Date</Label>
                <Input type="date" value={form.expiresAt ? new Date(form.expiresAt).toISOString().split('T')[0] : ''} onChange={e => setForm({ ...form, expiresAt: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="isActive" checked={form.isActive} onCheckedChange={v => setForm({ ...form, isActive: v })} />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}{form._id ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Coupon</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
