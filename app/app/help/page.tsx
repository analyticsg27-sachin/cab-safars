'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import AppHeader from '@/components/app/AppHeader';

const FAQS = [
  { q: 'How do I post a trip?', a: 'Go to Home → Post Trip. Fill in the route, vehicle type, load details and fare. Your trip will be visible to drivers instantly.' },
  { q: 'What is Premium membership?', a: 'Premium gives you access to driver/vendor contact details (call & WhatsApp), priority listing, and unlimited trip postings.' },
  { q: 'How do I contact a driver or vendor?', a: 'Upgrade to Premium to unlock Call and WhatsApp contact buttons on each trip or driver profile.' },
  { q: 'How long does account approval take?', a: 'Account verification typically takes 24–48 hours after you submit your documents.' },
  { q: 'How do I cancel or close a trip?', a: 'Open the trip from your dashboard and tap "Close Trip". Closed trips are hidden from drivers.' },
  { q: 'Is my phone number shown to everyone?', a: 'No. Your contact details are only visible to Premium members.' },
  { q: 'How do I upgrade to Premium?', a: 'Go to Profile → Current Plan → Upgrade. Premium costs ₹199/month.' },
  { q: 'What payment methods are accepted?', a: 'We accept UPI, credit/debit cards, and net banking via Razorpay.' },
];

export default function HelpPage() {
  const router = useRouter();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <AppShell>
      <AppHeader title="Help & FAQ" showBack onBack={() => router.back()} />
      <main className="flex-1 overflow-y-auto px-4 pb-10 pt-6">
        <p className="text-xs mb-5" style={{ color: '#8B949E' }}>Frequently asked questions</p>
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}>
          {FAQS.map(({ q, a }, i) => (
            <div key={i} style={{ borderBottom: i < FAQS.length - 1 ? '1px solid #30363D' : 'none' }}>
              <button className="w-full flex items-center justify-between px-4 py-4 text-left gap-3" onClick={() => setOpen(open === i ? null : i)}>
                <span className="text-sm font-medium flex-1" style={{ color: '#F0F6FC' }}>{q}</span>
                {open === i ? <ChevronUp size={14} style={{ color: '#8B949E', flexShrink: 0 }} /> : <ChevronDown size={14} style={{ color: '#8B949E', flexShrink: 0 }} />}
              </button>
              {open === i && (
                <div className="px-4 pb-4">
                  <p className="text-sm leading-relaxed" style={{ color: '#8B949E' }}>{a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </AppShell>
  );
}
