import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { DataTable, type ColumnDef } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Review {
  _id: string;
  productId: { _id: string; title: string } | string;
  userId: { _id: string; fullName: string } | string;
  rating: number;
  comment: string;
  approved: boolean;
  adminResponse: string;
  createdAt: string;
}

export function Component() {
  const [items, setItems] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetch = () => {
    setLoading(true);
    api.get('/admin/reviews', { params: { page, limit: 15 } })
      .then(({ data }) => { setItems(data.data || []); setTotalPages(data.pagination?.totalPages || 1); })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetch(); }, [page]);

  const toggleApproved = async (r: Review) => {
    try {
      await api.put(`/admin/reviews/${r._id}`, { approved: !r.approved });
      toast.success(r.approved ? 'Unapproved' : 'Approved');
      fetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Failed to update');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await api.delete(`/admin/reviews/${deleteId}`); toast.success('Deleted'); setDeleteId(null); fetch(); }
    catch (err: any) { toast.error(err?.response?.data?.error?.message || 'Failed to delete'); }
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? 'text-yellow-500' : 'text-gray-300'}>★</span>
      ))}
    </div>
  );

  const columns: ColumnDef<Review>[] = [
    { header: 'Product', render: (r) => <span className="font-semibold text-sm">{(typeof r.productId === 'object' ? r.productId?.title : '') || '—'}</span> },
    { header: 'User', render: (r) => <span className="text-sm">{(typeof r.userId === 'object' ? r.userId?.fullName : '') || '—'}</span> },
    { header: 'Rating', render: (r) => renderStars(r.rating) },
    { header: 'Comment', render: (r) => <span className="text-sm text-muted-foreground line-clamp-2 max-w-xs">{r.comment || '—'}</span> },
    {
      header: 'Approved',
      render: (r) => (
        <div className="flex items-center gap-2">
          <Switch checked={r.approved} onCheckedChange={() => toggleApproved(r)} />
          <span className={`text-xs font-semibold ${r.approved ? 'text-green-600' : 'text-red-600'}`}>{r.approved ? 'Yes' : 'No'}</span>
        </div>
      ),
    },
    {
      header: '', className: 'w-[50px]',
      render: (r) => (
        <Button variant="ghost" size="icon" onClick={() => setDeleteId(r._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
      ),
    },
  ];

  return (
    <>
      <Helmet><title>Reviews | Admin | AgriForge</title></Helmet>
      <h1 className="text-2xl font-bold mb-6">Reviews Moderation</h1>

      <DataTable
        columns={columns} data={items} loading={loading} keyExtractor={(r) => r._id}
        page={page} totalPages={totalPages} onPageChange={setPage}
        emptyMessage="No reviews yet."
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
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
