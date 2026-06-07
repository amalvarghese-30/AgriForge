import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { DataTable, type ColumnDef } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Subscriber {
  _id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export function Component() {
  const [items, setItems] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetch = () => {
    setLoading(true);
    api.get('/admin/subscribers', { params: { page, limit: 20 } })
      .then(({ data }) => { setItems(data.data || []); setTotalPages(data.pagination?.totalPages || 1); })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetch(); }, [page]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await api.delete(`/admin/subscribers/${deleteId}`); toast.success('Deleted'); setDeleteId(null); fetch(); }
    catch (err: any) { toast.error(err?.response?.data?.error?.message || 'Failed to delete'); }
  };

  const columns: ColumnDef<Subscriber>[] = [
    { header: 'Email', render: (s) => <span className="font-semibold text-sm">{s.email}</span> },
    { header: 'Status', render: (s) => <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{s.isActive ? 'Active' : 'Inactive'}</span> },
    { header: 'Subscribed', render: (s) => <span className="text-xs text-muted-foreground">{new Date(s.createdAt).toLocaleDateString('en-IN')}</span> },
    {
      header: '', className: 'w-[50px]',
      render: (s) => (
        <Button variant="ghost" size="icon" onClick={() => setDeleteId(s._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
      ),
    },
  ];

  return (
    <>
      <Helmet><title>Subscribers | Admin | AgriForge</title></Helmet>
      <h1 className="text-2xl font-bold mb-6">Newsletter Subscribers</h1>

      <DataTable
        columns={columns} data={items} loading={loading} keyExtractor={(s) => s._id}
        page={page} totalPages={totalPages} onPageChange={setPage}
        emptyMessage="No subscribers yet."
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subscriber</AlertDialogTitle>
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
