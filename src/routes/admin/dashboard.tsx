import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Package, ShoppingBag, IndianRupee, Users, Star, AlertTriangle, Mail,
} from 'lucide-react';
import api from '@/lib/api';
import { StatsCard } from '@/components/admin/StatsCard';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  pendingReviews: number;
  lowStockProducts: number;
  unreadMessages: number;
}

export function Component() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(({ data }) => setStats(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet><title>Dashboard | Admin | AgriForge</title></Helmet>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {loading ? (
        <div className="grid place-items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : stats ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Total Products" value={stats.totalProducts} icon={Package} href="/admin/products" />
            <StatsCard title="Total Orders" value={stats.totalOrders} icon={ShoppingBag} href="/admin/orders" />
            <StatsCard title="Revenue" value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`} icon={IndianRupee} />
            <StatsCard title="Customers" value={stats.totalCustomers} icon={Users} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatsCard title="Pending Reviews" value={stats.pendingReviews} icon={Star} href="/admin/reviews" />
            <StatsCard title="Low Stock Products" value={stats.lowStockProducts} icon={AlertTriangle} href="/admin/products" />
            <StatsCard title="Unread Messages" value={stats.unreadMessages} icon={Mail} href="/admin/messages" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="/admin/products"
              className="rounded-2xl border border-border bg-card p-6 hover:border-accent/40 transition-colors"
            >
              <h3 className="font-bold mb-1">Manage Products</h3>
              <p className="text-sm text-muted-foreground">Add, edit, or remove products from your catalog.</p>
            </a>
            <a
              href="/admin/orders"
              className="rounded-2xl border border-border bg-card p-6 hover:border-accent/40 transition-colors"
            >
              <h3 className="font-bold mb-1">Manage Orders</h3>
              <p className="text-sm text-muted-foreground">Update order status, tracking, and payment information.</p>
            </a>
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground">Failed to load stats.</p>
      )}
    </>
  );
}
