import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Loader2, Trash2, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

type Review = {
  _id: string;
  productId: string;
  userId: { _id: string; fullName: string } | string;
  rating: number;
  title: string | null;
  body: string | null;
  approved: boolean;
  isVerifiedPurchase: boolean;
  createdAt: string;
};

export function Stars({ value, size = 16, onChange }: { value: number; size?: number; onChange?: (n: number) => void }) {
  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= Math.round(value);
        return (
          <button
            key={n}
            type="button"
            disabled={!onChange}
            onClick={() => onChange?.(n)}
            className={onChange ? 'cursor-pointer transition hover:scale-110' : 'cursor-default'}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
          >
            <Star
              style={{ width: size, height: size }}
              className={filled ? 'fill-accent text-accent' : 'text-muted-foreground/40'}
            />
          </button>
        );
      })}
    </div>
  );
}

export function ProductReviews({ productId }: { productId: string }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = () => {
    setLoading(true);
    api.get(`/products/${productId}/reviews`)
      .then(({ data }) => setReviews(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, [productId]); // eslint-disable-line react-hooks/exhaustive-deps

  const approved = reviews.filter((r) => r.approved !== false);
  const count = approved.length;
  const avg = count > 0 ? approved.reduce((s, r) => s + r.rating, 0) / count : 0;
  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    n: approved.filter((r) => r.rating === star).length,
    pct: count > 0 ? (approved.filter((r) => r.rating === star).length / count) * 100 : 0,
  }));

  const myReview = user ? reviews.find((r) => {
    const uid = typeof r.userId === 'object' ? r.userId._id : r.userId;
    return uid === user._id;
  }) : undefined;

  const deleteMine = async (id: string) => {
    try {
      await api.delete(`/reviews/${id}`);
      toast.success('Review deleted');
      fetchReviews();
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Failed to delete');
    }
  };

  const getName = (r: Review) => typeof r.userId === 'object' ? r.userId.fullName : 'Customer';

  return (
    <section id="reviews" className="mt-16 rounded-3xl bg-card border border-border p-8">
      <h2 className="font-display text-3xl tracking-wide">Customer Reviews</h2>

      {loading ? (
        <div className="py-10 grid place-items-center"><Loader2 className="h-5 w-5 animate-spin text-accent" /></div>
      ) : (
        <>
          <div className="mt-6 grid md:grid-cols-[260px_1fr] gap-8 pb-8 border-b border-border">
            <div>
              <div className="text-5xl font-extrabold text-primary">{avg.toFixed(1)}</div>
              <Stars value={avg} size={20} />
              <div className="mt-1 text-sm text-muted-foreground">{count} review{count === 1 ? '' : 's'}</div>
            </div>
            <div className="space-y-2">
              {breakdown.map((b) => (
                <div key={b.star} className="flex items-center gap-3 text-sm">
                  <span className="w-6 text-muted-foreground">{b.star}★</span>
                  <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-accent transition-all" style={{ width: `${b.pct}%` }} />
                  </div>
                  <span className="w-8 text-right text-muted-foreground tabular-nums">{b.n}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            {user ? (
              <ReviewForm productId={productId} existing={myReview} onDone={fetchReviews} />
            ) : (
              <div className="rounded-2xl bg-secondary/40 border border-dashed border-border p-6 text-center">
                <p className="text-sm text-muted-foreground">Sign in to write a review.</p>
                <Link to="/auth" className="mt-3 inline-flex rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-semibold hover:bg-accent hover:text-accent-foreground transition">
                  Sign in
                </Link>
              </div>
            )}
          </div>

          <div className="mt-10 space-y-5">
            {approved.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No reviews yet. Be the first to share your experience.</p>
            ) : (
              approved.map((r) => {
                const uid = typeof r.userId === 'object' ? r.userId._id : r.userId;
                return (
                  <article key={r._id} className="rounded-2xl border border-border p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Stars value={r.rating} />
                          {r.isVerifiedPurchase && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                              <ShieldCheck className="h-3 w-3" /> Verified
                            </span>
                          )}
                        </div>
                        {r.title && <h3 className="mt-2 font-bold">{r.title}</h3>}
                        <div className="mt-0.5 text-xs text-muted-foreground">
                          {getName(r)} · {new Date(r.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      {user?._id === uid && (
                        <button
                          onClick={() => deleteMine(r._id)}
                          className="text-muted-foreground hover:text-destructive transition"
                          aria-label="Delete review"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    {r.body && <p className="mt-3 text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{r.body}</p>}
                  </article>
                );
              })
            )}
          </div>
        </>
      )}
    </section>
  );
}

function ReviewForm({ productId, existing, onDone }: { productId: string; existing?: Review; onDone: () => void }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(existing?.rating ?? 5);
  const [title, setTitle] = useState(existing?.title ?? '');
  const [body, setBody] = useState(existing?.body ?? '');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    try {
      await api.post(`/products/${productId}/reviews`, { rating, title: title.trim() || undefined, body: body.trim() || undefined });
      toast.success(existing ? 'Review updated' : 'Review posted');
      onDone();
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Failed to submit review');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-2xl border border-border p-6 bg-secondary/20">
      <h3 className="font-bold text-lg">{existing ? 'Update your review' : 'Write a review'}</h3>
      <div className="mt-3 flex items-center gap-3">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Rating</span>
        <Stars value={rating} size={22} onChange={setRating} />
      </div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Summarize your experience"
        maxLength={120}
        className="mt-4 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Tell other buyers what you liked, build quality, fitment, durability..."
        rows={4}
        maxLength={2000}
        className="mt-3 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:border-accent resize-y"
      />
      <button
        type="submit"
        disabled={busy}
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-2.5 text-sm font-semibold hover:bg-accent hover:text-accent-foreground transition disabled:opacity-50"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        {existing ? 'Update review' : 'Submit review'}
      </button>
    </form>
  );
}
