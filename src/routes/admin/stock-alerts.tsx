import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trash2, BellRing } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { DataTable, type ColumnDef } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface StockAlert {
  _id: string;
  productId: { _id: string; title: string } | string;
  email: string;
  notified: boolean;
  createdAt: string;
}

export function Component() {
  const [items, setItems] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetch = () => {
    setLoading(true);
    api.get('/admin/stock-alerts', { params: { page, limit: 15 } })
      .then(({ data }) => { setItems(data.data || []); setTotalPages(data.pagination?.totalPages || 1); })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetch(); }, [page]);

  const notify = async (id: string) => {
    try {
      await api.post(`/admin/stock-alerts/${id}/notify`);
      toast.success('Notification sent');
      fetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Failed to notify');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await api.delete(`/admin/stock-alerts/${deleteId}`); toast.success('Deleted'); setDeleteId(null); fetch(); }
    catch (err: any) { toast.error(err?.response?.data?.error?.message || 'Failed to delete'); }
  };

  const columns: ColumnDef<StockAlert>[] = [
    { header: 'Product', render: (s) => <span className="font-semibold text-sm">{(typeof s.productId === 'object' ? s.productId?.title : '') || '—'}</span> },
    { header: 'Email', render: (s) => <span className="text-sm text-muted-foreground">{s.email}</span> },
    {
      header: 'Status',
      render: (s) => s.notified
        ? <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-800">Notified</span>
        : <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">Pending</span>,
    },
    { header: 'Requested', render: (s) => <span className="text-xs text-muted-foreground">{new Date(s.createdAt).toLocaleDateString('en-IN')}</span> },
    {
      header: '', className: 'w-[80px]',
      render: (s) => (
        <div className="flex items-center gap-1 justify-end">
          {!s.notified && (
            <Button variant="ghost" size="icon" onClick={() => notify(s._id)} title="Send notification"><BellRing className="h-4 w-4 text-accent" /></Button>
          )}
          <Button variant="ghost" size="icon" onClick={() => setDeleteId(s._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Helmet><title>Stock Alerts | Admin | AgriForge</title></Helmet>
      <h1 className="text-2xl font-bold mb-6">Stock Alerts</h1>

      <DataTable
        columns={columns} data={items} loading={loading} keyExtractor={(s) => s._id}
        page={page} totalPages={totalPages} onPageChange={setPage}
        emptyMessage="No stock alerts yet."
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Stock Alert</AlertDialogTitle>
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
