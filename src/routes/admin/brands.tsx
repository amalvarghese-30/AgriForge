import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { DataTable, type ColumnDef } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Brand {
  _id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  productCount: number;
}

const EMPTY: Brand = { _id: '', name: '', slug: '', description: '', logo: '', productCount: 0 };

export function Component() {
  const [items, setItems] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<Brand>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetch = () => {
    setLoading(true);
    api.get('/admin/brands').then(({ data }) => setItems(data.data || []))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setForm(EMPTY); setDialogOpen(true); };
  const openEdit = (b: Brand) => { setForm({ ...b }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!form.name || !form.slug) { toast.error('Name and slug are required'); return; }
    setSaving(true);
    try {
      if (form._id) {
        await api.put(`/admin/brands/${form._id}`, form);
        toast.success('Brand updated');
      } else {
        await api.post('/admin/brands', form);
        toast.success('Brand created');
      }
      setDialogOpen(false);
      fetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await api.delete(`/admin/brands/${deleteId}`); toast.success('Deleted'); setDeleteId(null); fetch(); }
    catch (err: any) { toast.error(err?.response?.data?.error?.message || 'Failed to delete'); }
  };

  const columns: ColumnDef<Brand>[] = [
    { header: 'Name', render: (b) => (
      <div className="flex items-center gap-3">
        {b.logo ? <img src={b.logo} alt="" className="h-8 w-8 object-contain rounded" /> : <div className="h-8 w-8 rounded bg-secondary" />}
        <span className="font-semibold text-sm">{b.name}</span>
      </div>
    )},
    { header: 'Slug', render: (b) => <span className="text-sm text-muted-foreground">{b.slug}</span> },
    { header: 'Products', render: (b) => <span className="tabular-nums">{b.productCount}</span> },
    {
      header: '', className: 'w-[80px]',
      render: (b) => (
        <div className="flex items-center gap-1 justify-end">
          <Button variant="ghost" size="icon" onClick={() => openEdit(b)}><Pencil className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleteId(b._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Helmet><title>Brands | Admin | AgriForge</title></Helmet>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Brands</h1>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" /> New Brand</Button>
      </div>

      <DataTable columns={columns} data={items} loading={loading} keyExtractor={(b) => b._id} emptyMessage="No brands yet." />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{form._id ? 'Edit Brand' : 'New Brand'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Name *</Label>
              <Input value={form.name} onChange={e => {
                const val = e.target.value;
                setForm(f => ({ ...f, name: val, slug: !f._id ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : f.slug }));
              }} />
            </div>
            <div className="space-y-1">
              <Label>Slug *</Label>
              <Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-accent bg-transparent resize-y" />
            </div>
            <div className="space-y-1">
              <Label>Logo URL</Label>
              <Input value={form.logo} onChange={e => setForm({ ...form, logo: e.target.value })} placeholder="https://..." />
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
            <AlertDialogTitle>Delete Brand</AlertDialogTitle>
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
