import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Trash2, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface Variant {
  _id?: string;
  sku: string;
  name: string;
  type: 'color' | 'size' | 'spec';
  price: number;
  stockQuantity: number;
  inStock: boolean;
}

interface Product {
  _id: string;
  title: string;
  variants: Variant[];
}

export function Component() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<Variant>({ sku: '', name: '', type: 'spec', price: 0, stockQuantity: 0, inStock: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/admin/products', { params: { limit: 100 } })
      .then(({ data }) => setProducts(data.data || []))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const openVariants = (p: Product) => {
    setSelected(p);
    setDialogOpen(true);
  };

  const addVariant = () => {
    if (!selected) return;
    setEditingVariant({ sku: '', name: '', type: 'spec', price: 0, stockQuantity: 0, inStock: true });
  };

  const removeVariant = (index: number) => {
    if (!selected) return;
    const updated = { ...selected, variants: selected.variants.filter((_, i) => i !== index) };
    setSelected(updated);
  };

  const saveVariants = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await api.put(`/admin/products/${selected._id}`, { variants: selected.variants });
      toast.success('Variants saved');
      setDialogOpen(false);
      setProducts(prev => prev.map(p => p._id === selected._id ? selected : p));
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  return (
    <>
      <Helmet><title>Variants | Admin | AgriForge</title></Helmet>
      <h1 className="text-2xl font-bold mb-6">Variant Management</h1>

      {loading ? (
        <div className="grid place-items-center py-20"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-3 text-sm font-semibold">Product</th>
                <th className="text-center px-6 py-3 text-sm font-semibold">Variants</th>
                <th className="text-right px-6 py-3 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-border last:border-0">
                  <td className="px-6 py-4"><span className="font-semibold text-sm">{p.title}</span></td>
                  <td className="px-6 py-4 text-center"><span className="tabular-nums text-sm text-muted-foreground">{p.variants?.length || 0}</span></td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => openVariants(p)}>Edit Variants</Button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={3} className="py-12 text-center text-sm text-muted-foreground">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Variants — {selected?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {selected?.variants.map((v, i) => (
              <div key={i} className="flex items-center gap-2 p-3 rounded-xl border border-border bg-secondary/30">
                <Input
                  className="w-24 text-sm"
                  value={v.sku}
                  onChange={e => {
                    const updated = [...(selected?.variants || [])];
                    updated[i] = { ...updated[i], sku: e.target.value };
                    setSelected({ ...selected!, variants: updated });
                  }}
                  placeholder="SKU"
                />
                <Input
                  className="flex-1 text-sm"
                  value={v.name}
                  onChange={e => {
                    const updated = [...(selected?.variants || [])];
                    updated[i] = { ...updated[i], name: e.target.value };
                    setSelected({ ...selected!, variants: updated });
                  }}
                  placeholder="Name"
                />
                <select
                  value={v.type}
                  onChange={e => {
                    const updated = [...(selected?.variants || [])];
                    updated[i] = { ...updated[i], type: e.target.value as 'color' | 'size' | 'spec' };
                    setSelected({ ...selected!, variants: updated });
                  }}
                  className="text-xs rounded-lg border border-border px-2 py-1.5 bg-transparent"
                >
                  <option value="spec">Spec</option>
                  <option value="color">Color</option>
                  <option value="size">Size</option>
                </select>
                <Input
                  type="number"
                  className="w-20 text-sm"
                  value={String(v.price || 0)}
                  onChange={e => {
                    const updated = [...(selected?.variants || [])];
                    updated[i] = { ...updated[i], price: Number(e.target.value) };
                    setSelected({ ...selected!, variants: updated });
                  }}
                  placeholder="Price"
                />
                <Input
                  type="number"
                  className="w-16 text-sm"
                  value={String(v.stockQuantity)}
                  onChange={e => {
                    const updated = [...(selected?.variants || [])];
                    updated[i] = { ...updated[i], stockQuantity: Number(e.target.value) };
                    setSelected({ ...selected!, variants: updated });
                  }}
                  placeholder="Qty"
                />
                <Button variant="ghost" size="icon" onClick={() => removeVariant(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!selected) return;
                setSelected({
                  ...selected,
                  variants: [...selected.variants, { sku: `VAR-${Date.now()}`, name: 'New Variant', type: 'spec', price: 0, stockQuantity: 0, inStock: true }],
                });
              }}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Variant
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveVariants} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
