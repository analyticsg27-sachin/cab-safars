'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, Phone, MessageCircle } from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import AppHeader from '@/components/app/AppHeader';

const FAQS = [
  {
    category: 'Getting Started',
    items: [
      {
        q: 'What is CAB SAFARS?',
          a: 'CAB SAFARS lets Trip Providers create trip listings and lets Drivers browse listings available to their accounts. Contact options depend on account status and service availability.',
      },
      {
        q: 'What is the difference between a Trip Provider and a Driver?',
          a: 'A Trip Provider creates trip listings. A Driver can browse listings available to their account. The app shows the account setup options available to you.',
      },
      {
        q: 'How long does account approval take?',
          a: 'Follow the status and instructions shown in your account after submitting any requested information.',
      },
    ],
  },
  {
    category: 'Trips',
    items: [
      {
        q: 'How do I post a trip as a Trip Provider?',
        a: 'Go to Home → Post Trip. Enter the pickup city, destination, vehicle type required, trip date, number of seats/load, and expected fare. Listing visibility depends on your account status and service availability.',
      },
      {
        q: 'How do I find trips as a Driver?',
          a: 'Open the trips area and browse listings available to your account. Available filters and contact options are shown in the app.',
      },
      {
        q: 'How do I close a trip after it is filled?',
          a: 'Open your trip and use the available trip management options shown on its details page.',
      },
      {
          q: 'Which listings can I see?',
          a: 'Listings shown depend on your account and the information available in the service.',
      },
    ],
  },
  {
    category: 'Premium Membership',
    items: [
      {
          q: 'What account options are available?',
          a: 'Open Profile → Current Plan to see the options and details currently available to your account.',
      },
      {
        q: 'How do I upgrade to Premium?',
          a: 'Open Profile → Current Plan and follow the options shown in the app.',
      },
      {
        q: 'Is my phone number visible to everyone?',
          a: 'Contact visibility and available actions depend on account status and are shown in the app.',
      },
      {
          q: 'Where can I find membership terms?',
          a: 'Review the current terms and account options shown in the app before making a purchase.',
      },
    ],
  },
  {
    category: 'Payments & Policy',
    items: [
      {
        q: 'Does CAB SAFARS handle trip payments between users?',
          a: 'Cab Safars provides trip listing information. Confirm trip arrangements and any payment terms directly with the other party.',
      },
      {
          q: 'Where can I see payment options?',
          a: 'If payment options are available to your account, the app will show them with the relevant terms.',
      },
      {
          q: 'How can I review applicable terms?',
          a: 'Read the current terms shown in the app before using an account option or making a purchase.',
      },
    ],
  },
  {
    category: 'Documents & Verification',
    items: [
      {
        q: 'Which documents do I need to upload?',
          a: 'The app will show any information or documents requested for your selected account type.',
      },
      {
          q: 'How do I submit requested information?',
          a: 'Follow the instructions and file requirements displayed in the app.',
      },
    ],
  },
];

export default function HelpPage() {
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <AppShell>
      <AppHeader title="Help & FAQ" showBack onBack={() => router.back()} />
      <main className="flex-1 overflow-y-auto px-4 pb-10 pt-4">

        {FAQS.map((section) => (
          <div key={section.category} className="mb-5">
            <p className="text-xs font-bold uppercase tracking-widest mb-2 px-1" style={{ color: '#F5A623' }}>{section.category}</p>
            <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}>
              {section.items.map(({ q, a }, i) => {
                const key = `${section.category}-${i}`;
                const isOpen = open === key;
                return (
                  <div key={key} style={{ borderBottom: i < section.items.length - 1 ? '1px solid #30363D' : 'none' }}>
                    <button
                      className="w-full flex items-center justify-between px-4 py-4 text-left gap-3"
                      onClick={() => setOpen(isOpen ? null : key)}
                    >
                      <span className="text-sm font-medium flex-1 leading-snug" style={{ color: '#F0F6FC' }}>{q}</span>
                      {isOpen
                        ? <ChevronUp size={14} style={{ color: '#F5A623', flexShrink: 0 }} />
                        : <ChevronDown size={14} style={{ color: '#8B949E', flexShrink: 0 }} />}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4">
                        <p className="text-sm leading-relaxed" style={{ color: '#8B949E' }}>{a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Contact support */}
        <div className="rounded-2xl p-4 mt-2" style={{ backgroundColor: '#161B22', border: '1px solid #30363D' }}>
          <p className="text-sm font-bold mb-1" style={{ color: '#F0F6FC' }}>Still have a question?</p>
          <p className="text-xs mb-4" style={{ color: '#8B949E' }}>Contact our support team directly — Mon to Sat, 10 AM to 7 PM</p>
          <div className="flex gap-2">
            <a
              href="tel:9574816765"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold"
              style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.25)', textDecoration: 'none' }}
            >
              <Phone size={14} /> Call Us
            </a>
            <a
              href="https://wa.me/919574816765"
              target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold"
              style={{ backgroundColor: 'rgba(37,211,102,0.1)', color: '#25D366', border: '1px solid rgba(37,211,102,0.25)', textDecoration: 'none' }}
            >
              <MessageCircle size={14} /> WhatsApp
            </a>
          </div>
        </div>

      </main>
    </AppShell>
  );
}
