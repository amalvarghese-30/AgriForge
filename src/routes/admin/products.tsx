import { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Pencil, Trash2, Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { DataTable, type ColumnDef } from '@/components/admin/DataTable';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  basePrice: number;
  salePrice: number;
  categoryId: { _id: string; name: string } | null;
  brandId: { _id: string; name: string } | null;
  images: Array<{ url: string; alt: string }>;
  thumbnail: string;
  inStock: boolean;
  stockQuantity: number;
  specs: Record<string, string>;
  featured: boolean;
}

interface CatBrand { _id: string; name: string; slug: string }

const EMPTY: Product = {
  _id: '', title: '', slug: '', description: '', basePrice: 0, salePrice: 0,
  categoryId: null, brandId: null, images: [], thumbnail: '', inStock: true,
  stockQuantity: 0, specs: {}, featured: false,
};

export function Component() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<CatBrand[]>([]);
  const [brands, setBrands] = useState<CatBrand[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<Product>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    api.get('/admin/products', { params: { page, limit: 10 } })
      .then(({ data }) => {
        setProducts(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
      })
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.data || [])).catch(() => {});
    api.get('/brands').then(({ data }) => setBrands(data.data || [])).catch(() => {});
  }, []);

  const openCreate = () => { setForm(EMPTY); setDialogOpen(true); };
  const openEdit = (p: Product) => { setForm({ ...p }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!form.title || !form.slug || form.basePrice < 0) {
      toast.error('Title, slug, and base price are required');
      return;
    }
    setSaving(true);
    try {
      if (form._id) {
        await api.put(`/admin/products/${form._id}`, form);
        toast.success('Product updated');
      } else {
        await api.post('/admin/products', form);
        toast.success('Product created');
      }
      setDialogOpen(false);
      fetchProducts();
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/admin/products/${deleteId}`);
      toast.success('Product deleted');
      setDeleteId(null);
      fetchProducts();
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Failed to delete');
    }
  };

  const updateForm = (key: keyof Product, value: any) => setForm(f => ({ ...f, [key]: value }));

  const columns: ColumnDef<Product>[] = [
    {
      header: 'Product',
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-secondary overflow-hidden shrink-0">
            {p.thumbnail ? <img src={p.thumbnail} alt="" className="h-full w-full object-cover" /> : (
              <div className="h-full w-full grid place-items-center text-muted-foreground/40"><Package className="h-4 w-4" /></div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{p.title}</p>
            <p className="text-xs text-muted-foreground">{p.slug}</p>
          </div>
        </div>
      ),
    },
    { header: 'Category', accessor: undefined as any, render: (p) => p.categoryId?.name || '—' },
    { header: 'Brand', accessor: undefined as any, render: (p) => p.brandId?.name || '—' },
    { header: 'Price', accessor: undefined as any, render: (p) => `₹${p.basePrice.toLocaleString('en-IN')}` },
    { header: 'Stock', accessor: undefined as any, render: (p) => (
      <div className="flex items-center gap-2">
        <span className="tabular-nums font-medium">{p.stockQuantity}</span>
        <span className={`w-2 h-2 rounded-full ${p.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
      </div>
    )},
    {
      header: '',
      className: 'w-[100px]',
      render: (p) => (
        <div className="flex items-center gap-1 justify-end">
          <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleteId(p._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Helmet><title>Products | Admin | AgriForge</title></Helmet>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" /> New Product</Button>
      </div>

      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        keyExtractor={(p) => p._id}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        emptyMessage="No products found. Create your first product."
      />

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{form._id ? 'Edit Product' : 'New Product'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Title *</Label>
                <Input value={form.title} onChange={e => { updateForm('title', e.target.value); if (!form._id) updateForm('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')); }} />
              </div>
              <div className="space-y-1">
                <Label>Slug *</Label>
                <Input value={form.slug} onChange={e => updateForm('slug', e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <textarea
                value={form.description}
                onChange={e => updateForm('description', e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-accent bg-transparent resize-y"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Base Price (₹) *</Label>
                <Input type="number" value={String(form.basePrice)} onChange={e => updateForm('basePrice', Number(e.target.value))} />
              </div>
              <div className="space-y-1">
                <Label>Sale Price (₹)</Label>
                <Input type="number" value={String(form.salePrice || 0)} onChange={e => updateForm('salePrice', Number(e.target.value))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Category</Label>
                <select value={form.categoryId?._id || ''} onChange={e => updateForm('categoryId', e.target.value ? { _id: e.target.value, name: categories.find(c => c._id === e.target.value)?.name || '' } : null)} className="w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-accent bg-transparent">
                  <option value="">None</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <Label>Brand</Label>
                <select value={form.brandId?._id || ''} onChange={e => updateForm('brandId', e.target.value ? { _id: e.target.value, name: brands.find(b => b._id === e.target.value)?.name || '' } : null)} className="w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-accent bg-transparent">
                  <option value="">None</option>
                  {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Stock Quantity</Label>
                <Input type="number" value={String(form.stockQuantity)} onChange={e => updateForm('stockQuantity', Number(e.target.value))} />
              </div>
              <div className="space-y-1">
                <Label>Thumbnail URL</Label>
                <Input value={form.thumbnail} onChange={e => updateForm('thumbnail', e.target.value)} placeholder="https://..." />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch id="inStock" checked={form.inStock} onCheckedChange={v => updateForm('inStock', v)} />
                <Label htmlFor="inStock">In Stock</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="featured" checked={form.featured} onCheckedChange={v => updateForm('featured', v)} />
                <Label htmlFor="featured">Featured</Label>
              </div>
            </div>
            <div className="space-y-1">
              <Label>Specifications (JSON)</Label>
              <textarea
                value={Object.keys(form.specs || {}).length > 0 ? JSON.stringify(form.specs, null, 2) : ''}
                onChange={e => {
                  try { updateForm('specs', JSON.parse(e.target.value)); } catch { updateForm('specs', {}); }
                }}
                rows={3}
                placeholder='{"engine": "75 HP", "fuel": "Diesel"}'
                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-accent bg-transparent resize-y font-mono"
              />
            </div>
            <div className="space-y-1">
              <Label>Images</Label>
              <ImageUpload images={form.images} onChange={imgs => updateForm('images', imgs)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              {form._id ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product.
            </AlertDialogDescription>
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
