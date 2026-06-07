import { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { DataTable, type ColumnDef } from '@/components/admin/DataTable';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Order {
  _id: string;
  orderNumber: string;
  userId: { email: string } | string;
  status: string;
  total: number;
  paymentStatus: string;
  trackingNumber: string;
  createdAt: string;
}

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800', confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800', shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-orange-100 text-orange-800',
};

export function Component() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const fetch = useCallback(() => {
    setLoading(true);
    const params: Record<string, any> = { page, limit: 15 };
    if (statusFilter) params.status = statusFilter;
    api.get('/admin/orders', { params })
      .then(({ data }) => { setOrders(data.data || []); setTotalPages(data.pagination?.totalPages || 1); })
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, [page, statusFilter]);

  useEffect(() => { fetch(); }, [fetch]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/admin/orders/${id}`, { status });
      toast.success('Status updated');
      fetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Failed to update');
    }
  };

  const updateTracking = async (id: string, trackingNumber: string) => {
    try {
      await api.put(`/admin/orders/${id}`, { trackingNumber });
      toast.success('Tracking updated');
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Failed to update');
    }
  };

  const columns: ColumnDef<Order>[] = [
    { header: 'Order #', render: (o) => <span className="font-semibold font-mono text-sm">{o.orderNumber}</span> },
    { header: 'Customer', render: (o) => <span className="text-sm">{(typeof o.userId === 'object' ? o.userId?.email : '') || '—'}</span> },
    { header: 'Date', render: (o) => <span className="text-sm">{new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span> },
    { header: 'Total', render: (o) => <span className="font-semibold text-sm">₹{o.total.toLocaleString('en-IN')}</span> },
    { header: 'Payment', render: (o) => <Badge variant="outline" className="text-xs">{o.paymentStatus}</Badge> },
    {
      header: 'Status',
      render: (o) => (
        <select
          value={o.status}
          onChange={(e) => updateStatus(o._id, e.target.value)}
          className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-800'}`}
        >
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      ),
    },
    {
      header: 'Tracking',
      render: (o) => (
        <input
          defaultValue={o.trackingNumber || ''}
          onBlur={(e) => { if (e.target.value !== (o.trackingNumber || '')) updateTracking(o._id, e.target.value); }}
          placeholder="—"
          className="w-32 text-xs rounded-lg border border-border px-2 py-1 bg-transparent focus:outline-none focus:border-accent"
        />
      ),
    },
  ];

  return (
    <>
      <Helmet><title>Orders | Admin | AgriForge</title></Helmet>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-xl border border-border px-4 py-2 text-sm bg-transparent focus:outline-none focus:border-accent"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        keyExtractor={(o) => o._id}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        emptyMessage="No orders found."
      />
    </>
  );
}
