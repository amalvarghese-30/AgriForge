import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AuthProvider } from '@/hooks/use-auth';
import { CartProvider } from '@/hooks/use-cart';
import { WishlistProvider } from '@/hooks/use-wishlist';
import { CouponProvider } from '@/hooks/use-coupon';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { FloatingActions } from '@/components/site/FloatingActions';
import { CartDrawer } from '@/components/site/CartDrawer';

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <CouponProvider>
            <Helmet>
              <title>AgriForge - Agricultural Machinery Marketplace</title>
              <meta name="description" content="Tractors, harvesters, tillers — top brands at the best prices for Indian farmers. Shop John Deere, Mahindra, Swaraj and more." />
              <meta property="og:title" content="AgriForge - Agricultural Machinery Marketplace" />
              <meta property="og:description" content="Tractors, harvesters, tillers — top brands at the best prices for Indian farmers." />
              <meta property="og:type" content="website" />
              <meta name="twitter:card" content="summary_large_image" />
            </Helmet>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1 pt-24">
                <Outlet />
              </main>
              <Footer />
              <FloatingActions />
              <CartDrawer />
            </div>
          </CouponProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
