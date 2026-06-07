import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

type WishlistContextValue = {
  ids: Set<string>;
  count: number;
  loading: boolean;
  has: (id: string) => boolean;
  toggle: (id: string) => Promise<void>;
};

const STORAGE_KEY = 'agriforge.wishlist.v1';
const WishlistContext = createContext<WishlistContextValue | null>(null);

function readGuest(): string[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [guestIds, setGuestIds] = useState<string[]>(() => readGuest());
  const [serverIds, setServerIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Persist guest items
  useEffect(() => {
    if (!user) localStorage.setItem(STORAGE_KEY, JSON.stringify(guestIds));
  }, [guestIds, user]);

  // Fetch server wishlist on login
  useEffect(() => {
    if (!user || authLoading) return;
    setLoading(true);
    api.get('/wishlist')
      .then(({ data }) => {
        setServerIds((data.data.products || []).map((p: { _id: string }) => p._id));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  // Merge guest → server on login
  useEffect(() => {
    if (authLoading || !user) return;
    const local = readGuest();
    if (local.length === 0) return;
    (async () => {
      for (const pid of local) {
        try { await api.post(`/wishlist/${pid}`); } catch {}
      }
      localStorage.removeItem(STORAGE_KEY);
      setGuestIds([]);
      api.get('/wishlist').then(({ data }) => {
        setServerIds((data.data.products || []).map((p: { _id: string }) => p._id));
      }).catch(() => {});
    })();
  }, [user, authLoading]);

  const idArr = user ? serverIds : guestIds;
  const ids = new Set(idArr);

  const toggle = async (id: string) => {
    if (user) {
      const { data } = await api.post(`/wishlist/${id}`);
      if (data.data.inWishlist) {
        setServerIds(prev => [...prev, id]);
        toast.success('Added to wishlist');
      } else {
        setServerIds(prev => prev.filter(x => x !== id));
        toast.success('Removed from wishlist');
      }
    } else {
      setGuestIds(prev => {
        if (prev.includes(id)) {
          toast.success('Removed from wishlist');
          return prev.filter(x => x !== id);
        }
        toast.success('Added to wishlist');
        return [...prev, id];
      });
    }
  };

  return (
    <WishlistContext.Provider value={{ ids, count: idArr.length, loading, has: (id) => ids.has(id), toggle }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
