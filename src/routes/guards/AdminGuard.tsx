import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import {
  LayoutDashboard, Package, ShoppingBag, Layers, Tag,
  Ticket, Star, Mail, Send, Bell, Boxes, ArrowLeft,
} from 'lucide-react';

export default function AdminGuard() {
  const { user, roles, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (!roles.includes('admin') && !roles.includes('super_admin')) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

const LINKS = [
  { to: '/admin',              icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/products',     icon: Package,          label: 'Products' },
  { to: '/admin/orders',       icon: ShoppingBag,      label: 'Orders' },
  { to: '/admin/categories',   icon: Layers,           label: 'Categories' },
  { to: '/admin/brands',       icon: Tag,              label: 'Brands' },
  { to: '/admin/coupons',      icon: Ticket,           label: 'Coupons' },
  { to: '/admin/reviews',      icon: Star,             label: 'Reviews' },
  { to: '/admin/messages',     icon: Mail,             label: 'Messages' },
  { to: '/admin/variants',     icon: Boxes,            label: 'Variants' },
  { to: '/admin/subscribers',  icon: Send,             label: 'Subscribers' },
  { to: '/admin/stock-alerts', icon: Bell,             label: 'Stock Alerts' },
];

function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col shrink-0">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-bold">Admin Panel</h2>
      </div>
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {LINKS.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to || (to !== '/admin' && location.pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-gray-700 text-white font-semibold'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-gray-700">
        <Link to="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Site
        </Link>
      </div>
    </aside>
  );
}
