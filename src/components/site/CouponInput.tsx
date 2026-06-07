import { useState, useEffect } from "react";
import { Tag, X, Loader2 } from "lucide-react";
import { useCoupon } from "@/hooks/use-coupon";

export function CouponInput({ subtotal }: { subtotal: number }) {
  const { coupon, apply, clear, revalidate, applying } = useCoupon();
  const [code, setCode] = useState("");

  // Revalidate stored coupon when subtotal changes
  useEffect(() => {
    if (coupon && coupon.discount === 0) void revalidate(subtotal);
  }, [subtotal, coupon, revalidate]);

  if (coupon && coupon.discount > 0) {
    return (
      <div className="flex items-center justify-between rounded-xl bg-accent/10 border border-accent/40 px-3 py-2.5 text-sm">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-accent" />
          <div>
            <div className="font-bold tracking-wider">{coupon.code}</div>
            <div className="text-xs text-muted-foreground">−₹{coupon.discount.toLocaleString("en-IN")} off</div>
          </div>
        </div>
        <button onClick={clear} aria-label="Remove coupon" className="grid h-7 w-7 place-items-center rounded-full hover:bg-secondary">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); void apply(code, subtotal).then((ok) => { if (ok) setCode(""); }); }}
      className="flex items-center gap-2"
    >
      <div className="flex-1 flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
        <Tag className="h-4 w-4 text-muted-foreground" />
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 32))}
          placeholder="Promo code"
          className="flex-1 bg-transparent outline-none text-sm tracking-wider uppercase"
        />
      </div>
      <button
        type="submit"
        disabled={applying || !code.trim()}
        className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold disabled:opacity-50"
      >
        {applying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
      </button>
    </form>
  );
}