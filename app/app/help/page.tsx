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
        a: 'CAB SAFARS is a transport marketplace that connects Trip Providers (who need vehicles) with Drivers (who have vehicles). Trip Providers post trips, and Drivers contact them to offer their service. Premium members can directly call or WhatsApp each other.',
      },
      {
        q: 'What is the difference between a Trip Provider and a Driver?',
        a: 'A Trip Provider posts trips — they need a vehicle (Sedan, SUV, Bus, Tempo Travel, etc.) for a specific route and date. A Driver browses posted trips and contacts the Trip Provider to offer their vehicle. Both can register for free.',
      },
      {
        q: 'How long does account approval take?',
        a: 'After you submit your documents, our team verifies them within 24–48 hours. You will receive a notification once your account is approved.',
      },
    ],
  },
  {
    category: 'Trips',
    items: [
      {
        q: 'How do I post a trip as a Trip Provider?',
        a: 'Go to Home → Post Trip. Enter the pickup city, destination, vehicle type required, trip date, number of seats/load, and expected fare. Your trip goes live instantly and is visible to all drivers.',
      },
      {
        q: 'How do I find trips as a Driver?',
        a: 'Go to Available Trips from your home screen. You can filter by city, vehicle type, and date. Premium drivers can directly Call or WhatsApp the Trip Provider from the trip details page.',
      },
      {
        q: 'How do I close a trip after it is filled?',
        a: 'Open the trip from My Trips → tap "Close Trip". Closed trips are hidden from drivers and moved to your history. CAB SAFARS does not charge anything for closing a trip.',
      },
      {
        q: 'Can I see closed or filled trips?',
        a: 'Drivers can see a "Trips You Missed" section showing recently closed trips. This helps you stay motivated and check activity in your area.',
      },
    ],
  },
  {
    category: 'Premium Membership',
    items: [
      {
        q: 'What does Premium membership include?',
        a: 'Premium members get: (1) Direct Call & WhatsApp access to the other party, (2) Priority listing on trip/driver feeds, (3) Premium badge on your profile. Premium costs ₹199/month.',
      },
      {
        q: 'How do I upgrade to Premium?',
        a: 'Go to Profile → Current Plan → Upgrade to Premium. You can pay via UPI, credit/debit card, or net banking. Your account upgrades instantly after payment.',
      },
      {
        q: 'Is my phone number visible to everyone?',
        a: 'No. Your contact number is only unlocked for Premium members. Free users see a locked button and are prompted to upgrade before they can view your contact.',
      },
      {
        q: 'Can I cancel my Premium subscription?',
        a: 'As per our policy, there is no cancellation or refund once a subscription is activated. Your Premium access continues until the end of the billing period.',
      },
    ],
  },
  {
    category: 'Payments & Policy',
    items: [
      {
        q: 'Does CAB SAFARS handle trip payments between users?',
        a: 'No. CAB SAFARS is only a platform to connect Trip Providers and Drivers. All fare negotiations and payments happen directly between the two parties. We do not hold or process trip money.',
      },
      {
        q: 'What payment methods are accepted for subscriptions?',
        a: 'We accept UPI (GPay, PhonePe, Paytm), credit/debit cards, and net banking via Razorpay.',
      },
      {
        q: 'Is there a refund policy?',
        a: 'CAB SAFARS does not offer refunds on subscription payments. Since we are a marketplace and not involved in trip execution, we also do not mediate fare disputes between users.',
      },
    ],
  },
  {
    category: 'Documents & Verification',
    items: [
      {
        q: 'Which documents do I need to upload?',
        a: 'Trip Providers: Business Registration, GST Certificate, PAN Card, Bank Account Proof. Drivers: Driving Licence, Aadhar Card, Vehicle RC, Vehicle Insurance, PAN Card. All documents are verified within 24–48 hours.',
      },
      {
        q: 'What file formats are accepted for document upload?',
        a: 'We accept PDF, JPG, and PNG files. Maximum file size is 5 MB per document. Make sure the document is clearly readable and not blurry.',
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
