import { useEffect, useState } from 'react';
import api from '@/lib/api';

type Variant = {
  _id: string;
  name: string;
  sku: string | null;
  attributes: Record<string, string>;
  priceOverride: number | null;
  stock: number;
  imageUrl: string | null;
  isActive: boolean;
};

export function useVariants(productId: string) {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    api.get(`/products/${productId}/variants`)
      .then(({ data }) => setVariants(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId]);

  return { data: variants, isLoading: loading };
}

export function VariantSelector({
  variants,
  selectedId,
  onSelect,
}: {
  variants: Variant[];
  selectedId: string | null;
  onSelect: (v: Variant | null) => void;
}) {
  if (!variants.length) return null;
  return (
    <div className="mt-6">
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-3">Choose variant</div>
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => {
          const active = v._id === selectedId;
          const oos = v.stock <= 0;
          return (
            <button
              key={v._id}
              type="button"
              onClick={() => onSelect(active ? null : v)}
              disabled={oos}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                active
                  ? 'border-accent bg-accent text-accent-foreground'
                  : 'border-border bg-card hover:border-primary'
              } ${oos ? 'opacity-50 line-through cursor-not-allowed' : ''}`}
            >
              {v.name}
              {v.priceOverride != null && (
                <span className="ml-2 text-xs opacity-80">₹{Number(v.priceOverride).toLocaleString('en-IN')}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
