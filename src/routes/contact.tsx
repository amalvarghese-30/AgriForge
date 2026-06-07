import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Loader2, MapPin, Mail, Phone, Send } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

export function Component() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post('/contact', { name, email, phone, subject, message });
      toast.success('Message sent! We\'ll get back to you soon.');
      setName(''); setEmail(''); setPhone(''); setSubject(''); setMessage('');
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Failed to send message');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Helmet><title>Contact Us | AgriForge</title></Helmet>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

        <div className="grid md:grid-cols-[1fr_320px] gap-8">
          <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Name *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Email *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-accent" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Phone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Subject *</label>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} required className="w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Message *</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={5} className="w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-accent resize-y" />
            </div>
            <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 font-semibold hover:bg-accent hover:text-accent-foreground transition disabled:opacity-50">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4" /> Send message</>}
            </button>
          </form>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold mb-3">Get in touch</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" /> <span>AgriForge HQ, Bangalore, India</span></div>
                <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-accent" /> <a href="mailto:support@agriforge.com" className="hover:text-accent">support@agriforge.com</a></div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-accent" /> <a href="tel:+918888888888" className="hover:text-accent">+91 88888 88888</a></div>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold mb-3">Business hours</h2>
              <p className="text-sm text-muted-foreground">Monday – Saturday, 9:00 AM – 7:00 PM IST. We respond within 24 hours.</p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
