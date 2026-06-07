import { createBrowserRouter, Navigate } from 'react-router-dom';
import RootLayout from './routes/__root';
import AuthGuard from './routes/guards/AuthGuard';
import AdminGuard from './routes/guards/AdminGuard';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, lazy: () => import('./routes/home') },
      { path: 'shop', lazy: () => import('./routes/shop') },
      { path: 'shop/:slug', lazy: () => import('./routes/product') },
      { path: 'search', lazy: () => import('./routes/search') },
      { path: 'auth', lazy: () => import('./routes/auth') },
      { path: 'about', lazy: () => import('./routes/about') },
      { path: 'gallery', lazy: () => import('./routes/gallery') },
      { path: 'contact', lazy: () => import('./routes/contact') },
      { path: 'track', lazy: () => import('./routes/track') },
      { path: 'wishlist', lazy: () => import('./routes/wishlist') },
      { path: 'orders/:id', lazy: () => import('./routes/orders/$id') },
      {
        element: <AuthGuard />,
        children: [
          { path: 'checkout', lazy: () => import('./routes/checkout') },
          { path: 'account', element: <Navigate to="/account/profile" replace /> },
          { path: 'account/profile', lazy: () => import('./routes/account/profile') },
          { path: 'account/orders', lazy: () => import('./routes/account/orders') },
          { path: 'account/addresses', lazy: () => import('./routes/account/addresses') },
          {
            element: <AdminGuard />,
            children: [
              { path: 'admin', lazy: () => import('./routes/admin/dashboard') },
              { path: 'admin/products', lazy: () => import('./routes/admin/products') },
              { path: 'admin/orders', lazy: () => import('./routes/admin/orders') },
              { path: 'admin/categories', lazy: () => import('./routes/admin/categories') },
              { path: 'admin/brands', lazy: () => import('./routes/admin/brands') },
              { path: 'admin/coupons', lazy: () => import('./routes/admin/coupons') },
              { path: 'admin/reviews', lazy: () => import('./routes/admin/reviews') },
              { path: 'admin/messages', lazy: () => import('./routes/admin/messages') },
              { path: 'admin/variants', lazy: () => import('./routes/admin/variants') },
              { path: 'admin/subscribers', lazy: () => import('./routes/admin/subscribers') },
              { path: 'admin/stock-alerts', lazy: () => import('./routes/admin/stock-alerts') },
            ],
          },
        ],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
