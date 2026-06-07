import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

const KEY = 'agriforge.coupon.v1';

export type AppliedCoupon = {
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  discount: number;
  description: string | null;
};

type Ctx = {
  coupon: AppliedCoupon | null;
  applying: boolean;
  apply: (code: string, subtotal: number) => Promise<boolean>;
  revalidate: (subtotal: number) => Promise<void>;
  clear: () => void;
};

const CouponContext = createContext<Ctx | null>(null);

function read(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(KEY);
}

export function CouponProvider({ children }: { children: ReactNode }) {
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [applying, setApplying] = useState(false);

  const persist = (c: AppliedCoupon | null) => {
    if (typeof window === 'undefined') return;
    if (c) localStorage.setItem(KEY, c.code);
    else localStorage.removeItem(KEY);
  };

  const apply = useCallback(async (code: string, subtotal: number) => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return false;
    setApplying(true);
    try {
      const { data } = await api.post('/coupons/validate', { code: trimmed, cartTotal: subtotal });
      if (!data.success || !data.data.valid) {
        toast.error(data.error?.message || 'Invalid or ineligible coupon');
        return false;
      }
      const next: AppliedCoupon = {
        code: data.data.coupon.code,
        type: data.data.coupon.type,
        value: Number(data.data.coupon.value),
        discount: Number(data.data.discount),
        description: null,
      };
      setCoupon(next);
      persist(next);
      toast.success(`Coupon ${next.code} applied — ₹${next.discount.toLocaleString('en-IN')} off`);
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Failed to apply coupon');
      return false;
    } finally {
      setApplying(false);
    }
  }, []);

  const revalidate = useCallback(async (subtotal: number) => {
    const code = coupon?.code ?? read();
    if (!code) return;
    try {
      const { data } = await api.post('/coupons/validate', { code, cartTotal: subtotal });
      if (!data.success || !data.data.valid) {
        setCoupon(null);
        persist(null);
        return;
      }
      setCoupon({
        code: data.data.coupon.code,
        type: data.data.coupon.type,
        value: Number(data.data.coupon.value),
        discount: Number(data.data.discount),
        description: null,
      });
    } catch {
      setCoupon(null);
      persist(null);
    }
  }, [coupon?.code]);

  const clear = useCallback(() => {
    setCoupon(null);
    persist(null);
  }, []);

  // Rehydrate on mount
  useEffect(() => {
    const code = read();
    if (!code) return;
    setCoupon({ code, type: 'flat', value: 0, discount: 0, description: null });
  }, []);

  return (
    <CouponContext.Provider value={{ coupon, applying, apply, revalidate, clear }}>
      {children}
    </CouponContext.Provider>
  );
}

export function useCoupon() {
  const ctx = useContext(CouponContext);
  if (!ctx) throw new Error('useCoupon must be used within CouponProvider');
  return ctx;
}
