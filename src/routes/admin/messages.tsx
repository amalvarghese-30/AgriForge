import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trash2, Mail, MailOpen } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { DataTable, type ColumnDef } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Message {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export function Component() {
  const [items, setItems] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetch = () => {
    setLoading(true);
    api.get('/admin/messages', { params: { page, limit: 15 } })
      .then(({ data }) => { setItems(data.data || []); setTotalPages(data.pagination?.totalPages || 1); })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetch(); }, [page]);

  const toggleRead = async (m: Message) => {
    try {
      await api.put(`/admin/messages/${m._id}`, { isRead: !m.isRead });
      fetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Failed to update');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await api.delete(`/admin/messages/${deleteId}`); toast.success('Deleted'); setDeleteId(null); fetch(); }
    catch (err: any) { toast.error(err?.response?.data?.error?.message || 'Failed to delete'); }
  };

  const columns: ColumnDef<Message>[] = [
    {
      header: '',
      className: 'w-[40px]',
      render: (m) => (
        <button onClick={() => toggleRead(m)} title={m.isRead ? 'Mark unread' : 'Mark read'}>
          {m.isRead ? <MailOpen className="h-4 w-4 text-muted-foreground" /> : <Mail className="h-4 w-4 text-accent" />}
        </button>
      ),
    },
    { header: 'Name', render: (m) => <span className="font-semibold text-sm">{m.name}</span> },
    { header: 'Email', render: (m) => <span className="text-sm text-muted-foreground">{m.email}</span> },
    { header: 'Subject', render: (m) => <span className="text-sm">{m.subject || '—'}</span> },
    { header: 'Message', render: (m) => <span className="text-sm text-muted-foreground line-clamp-2 max-w-xs">{m.message}</span> },
    { header: 'Date', render: (m) => <span className="text-xs text-muted-foreground">{new Date(m.createdAt).toLocaleDateString('en-IN')}</span> },
    {
      header: '', className: 'w-[50px]',
      render: (m) => (
        <Button variant="ghost" size="icon" onClick={() => setDeleteId(m._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
      ),
    },
  ];

  return (
    <>
      <Helmet><title>Messages | Admin | AgriForge</title></Helmet>
      <h1 className="text-2xl font-bold mb-6">Contact Messages</h1>

      <DataTable
        columns={columns} data={items} loading={loading} keyExtractor={(m) => m._id}
        page={page} totalPages={totalPages} onPageChange={setPage}
        emptyMessage="No messages yet."
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
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
