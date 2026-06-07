import { ArrowRight, MessageCircle } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="py-20 bg-[var(--color-beige)]">
      <div className="container-px mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[var(--color-ink)] p-10 sm:p-16 lg:p-20">
          <div className="absolute inset-0 grain opacity-40" />
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-accent/30 blur-3xl" />
          <div className="absolute -left-10 -bottom-20 h-80 w-80 rounded-full bg-primary/40 blur-3xl" />

          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-accent">Bulk · OEM · Dealer</div>
              <h2 className="mt-4 font-display text-5xl sm:text-6xl lg:text-7xl text-white leading-[0.95] text-balance">
                NEED BULK MACHINERY PARTS?
              </h2>
              <p className="mt-6 text-white/70 max-w-lg">
                Get custom quotations within 24 hours. Dedicated account manager,
                priority dispatch and contract pricing for orders above ₹1 lakh.
              </p>
            </div>
            <div className="flex flex-col gap-4 lg:items-end">
              <a className="group inline-flex items-center justify-center gap-3 rounded-full bg-accent px-8 py-5 text-base font-bold text-accent-foreground shadow-[var(--shadow-glow)] hover:brightness-110 transition w-full lg:w-auto">
                Request a Quotation <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
              <a className="inline-flex items-center justify-center gap-3 rounded-full border border-white/25 bg-white/5 px-8 py-5 text-base font-semibold text-white backdrop-blur hover:bg-white/10 transition w-full lg:w-auto">
                <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}