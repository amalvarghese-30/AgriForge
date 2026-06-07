import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Which tractor and machinery brands does AgriForge carry?",
    a: "We are authorised dealers for John Deere, Mahindra, Swaraj, Shaktiman, Kirloskar, Sonalika, New Holland, Bull, Redlands, BCS Ferrari, Escorts, and Kubota. Our inventory covers tractors from 20 HP to 120 HP, harvesters, implements, power tillers, loaders, balers, sprayers, threshers and genuine OEM spare parts across all brands.",
  },
  {
    q: "Do you offer financing or EMI options for tractor purchases?",
    a: "Yes. We work with all major agri-finance institutions — SBI Agri, HDFC Bank, Mahindra Finance, and regional cooperative banks. Financing is available for up to 90% of the invoice value with tenures from 1–7 years. Contact our sales team for a custom EMI quote based on your farm size and crop cycle.",
  },
  {
    q: "Is crop insurance or equipment insurance available through AgriForge?",
    a: "We assist with equipment insurance through partner insurers. Comprehensive coverage includes accidental damage, theft, fire, and third-party liability. Insurance can be bundled with your finance package. For standalone equipment insurance, speak to our after-sales desk.",
  },
  {
    q: "Do you have a trade-in or exchange program for old tractors?",
    a: "Absolutely. We accept trade-ins on all major brands — not just the ones we sell. Our team will inspect your existing equipment, provide a fair market valuation, and apply the trade-in value against your new purchase. The process typically takes 48–72 hours from inspection to deal closure.",
  },
  {
    q: "What after-sales service and warranty coverage do you provide?",
    a: "Every new machine includes the manufacturer's standard warranty (typically 2–5 years depending on brand) plus our 24/7 doorstep service guarantee. We maintain a fully-equipped service centre in Pune MIDC with factory-trained technicians, mobile service vans, and over ₹2 crore in spare parts inventory. Routine maintenance, breakdown repair, and seasonal inspection packages are available.",
  },
  {
    q: "What implements and attachments are compatible with my tractor?",
    a: "We stock and customise a full range: rotavators (5–8 ft), cultivators (7–11 tyne), mouldboard and disc ploughs, laser land levellers, seed drills, super seeders, flail mowers, mulchers, subsoilers, ridgers, puddlers, fertiliser broadcasters, and sugarcane loaders. Our technical team matches implements to your tractor HP, soil type, and cropping pattern at no extra consultation charge.",
  },
  {
    q: "Do you ship spare parts and machinery outside Maharashtra?",
    a: "Yes. We ship spare parts pan-India within 24–72 hours via our logistics network. Complete machinery is delivered through specialised agri-equipment transporters with nationwide reach. Export inquiries to neighbouring countries (Nepal, Bangladesh, Sri Lanka, Africa) are welcome — contact our export desk.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-secondary/40">
      <div className="container-px mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">Got Questions</span>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl tracking-wide">Frequently Asked Questions</h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            Everything you need to know about buying, financing and maintaining your farm equipment.
          </p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex items-center justify-between w-full px-5 py-4 text-left font-semibold text-sm sm:text-base hover:text-accent transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ${openIndex === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
