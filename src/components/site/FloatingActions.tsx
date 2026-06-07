import { MessageCircle, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export function FloatingActions() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      <Link
        to="/contact"
        aria-label="Request inquiry"
        className="group inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground pl-4 pr-5 py-3 shadow-[var(--shadow-card)] hover:scale-105 transition"
      >
        <FileText className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-wider">Inquiry</span>
      </Link>
      <a
        href="https://wa.me/919876543210?text=Hi%20AgriForge%2C%20I%20need%20service%20assistance%20for%20my%20equipment."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Service Booking"
        className="group grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[var(--shadow-card)] hover:scale-105 transition animate-float"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">1</span>
      </a>
    </div>
  );
}