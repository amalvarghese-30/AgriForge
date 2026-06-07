import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

type CartProduct = {
  _id: string;
  title: string;
  slug: string;
  basePrice: number;
  salePrice: number;
  thumbnail: string;
  inStock: boolean;
  images?: Array<{ url: string; alt: string }>;
};

export type CartItem = {
  _id?: string;
  productId: CartProduct | string;
  variantSku: string | null;
  quantity: number;
};

type CartSummary = {
  itemCount: number;
  subtotal: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  loading: boolean;
  open: boolean;
  setOpen: (o: boolean) => void;
  addToCart: (productId: string, qty?: number) => Promise<void>;
  updateQty: (itemId: string, qty: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clear: () => Promise<void>;
};

const STORAGE_KEY = 'agriforge.cart.v1';
const CartContext = createContext<CartContextValue | null>(null);

function readGuest(): { productId: string; quantity: number }[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [open, setOpen] = useState(false);
  const [guestItems, setGuestItems] = useState<{ productId: string; quantity: number }[]>(() => readGuest());
  const [serverItems, setServerItems] = useState<CartItem[]>([]);
  const [serverSummary, setServerSummary] = useState<CartSummary>({ itemCount: 0, subtotal: 0 });
  const [loading, setLoading] = useState(false);
  const [guestProducts, setGuestProducts] = useState<CartProduct[]>([]);

  // Persist guest items
  useEffect(() => {
    if (!user) localStorage.setItem(STORAGE_KEY, JSON.stringify(guestItems));
  }, [guestItems, user]);

  // Fetch server cart on login / mount
  const fetchCart = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await api.get('/cart');
      setServerItems(data.data.items);
      setServerSummary(data.data.summary);
    } catch { /* silently fail */ }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => {
    if (user && !authLoading) fetchCart();
    else if (!user && !authLoading) setServerItems([]);
  }, [user, authLoading, fetchCart]);

  // Merge guest → server on login
  useEffect(() => {
    if (authLoading || !user) return;
    const local = readGuest();
    if (local.length === 0) return;
    (async () => {
      try {
        await api.post('/cart/merge', { items: local.map(i => ({ productId: i.productId, variantSku: null, quantity: i.quantity })) });
        localStorage.removeItem(STORAGE_KEY);
        setGuestItems([]);
        fetchCart();
      } catch { /* merge failed, keep local items */ }
    })();
  }, [user, authLoading, fetchCart]);

  // Fetch guest product details
  useEffect(() => {
    if (user || guestItems.length === 0) { setGuestProducts([]); return; }
    const ids = guestItems.map(i => i.productId);
    api.post('/products/batch', { ids }).then(({ data }) => {
      setGuestProducts(data.data || []);
    }).catch(() => setGuestProducts([]));
  }, [guestItems, user]);

  const items: CartItem[] = user
    ? serverItems
    : guestItems.map(g => {
        const product = guestProducts.find(p => p._id === g.productId);
        return { productId: product || g.productId, variantSku: null, quantity: g.quantity };
      });

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => {
    const p = i.productId as CartProduct;
    return s + (p.salePrice || p.basePrice || 0) * i.quantity;
  }, 0);

  const addToCart = async (productId: string, qty = 1) => {
    if (user) {
      await api.post('/cart', { productId, quantity: qty });
      fetchCart();
    } else {
      setGuestItems(prev => {
        const ex = prev.find(p => p.productId === productId);
        if (ex) return prev.map(p => p.productId === productId ? { ...p, quantity: p.quantity + qty } : p);
        return [...prev, { productId, quantity: qty }];
      });
    }
    toast.success('Added to cart');
    setOpen(true);
  };

  const updateQty = async (itemId: string, qty: number) => {
    if (qty <= 0) return removeItem(itemId);
    if (user) {
      await api.put(`/cart/${itemId}`, { quantity: qty });
      fetchCart();
    } else {
      setGuestItems(prev => prev.map(p => p.productId === itemId ? { ...p, quantity: qty } : p));
    }
  };

  const removeItem = async (itemId: string) => {
    if (user) {
      await api.delete(`/cart/${itemId}`);
      fetchCart();
    } else {
      setGuestItems(prev => prev.filter(p => p.productId !== itemId));
    }
  };

  const clear = async () => {
    if (user) {
      await api.delete('/cart');
      fetchCart();
    } else {
      setGuestItems([]);
    }
  };

  return (
    <CartContext.Provider value={{ items, count, subtotal, loading: loading || authLoading, open, setOpen, addToCart, updateQty, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
