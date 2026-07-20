'use client';

import { useRouter } from 'next/navigation';
import { Phone, Mail, MessageCircle, Clock, MapPin } from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import AppHeader from '@/components/app/AppHeader';

const SUPPORT_PHONE = '9574816765';
const SUPPORT_ADDRESS = 'F-18, Janki Apartment, Opp Fojdar Ni Chali, Saijpur Bogha, Naroda, Ahmedabad';

export default function SupportPage() {
  const router = useRouter();

  const options = [
    { icon: Phone, label: 'Call Support', sub: `+91 ${SUPPORT_PHONE}`, color: '#22C55E', href: `tel:+91${SUPPORT_PHONE}` },
    { icon: MessageCircle, label: 'WhatsApp Us', sub: 'Quick response on WhatsApp', color: '#25D366', href: `https://wa.me/91${SUPPORT_PHONE}` },
    { icon: Mail, label: 'Email Support', sub: 'support@cabsafars.in', color: '#3B82F6', href: 'mailto:support@cabsafars.in' },
  ];

  return (
    <AppShell>
      <AppHeader title="Contact Support" showBack onBack={() => router.back()} />
      <main className="flex-1 overflow-y-auto px-4 pb-10 pt-6">
        <div className="flex items-center gap-2 rounded-xl px-4 py-3 mb-6" style={{ backgroundColor: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)' }}>
          <Clock size={14} style={{ color: '#F5A623' }} />
          <p className="text-xs" style={{ color: '#F5A623' }}>Support hours: Mon–Sat, 9 AM – 6 PM IST</p>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          {options.map(({ icon: Icon, label, sub, color, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-4 px-4 py-4 rounded-2xl"
              style={{ backgroundColor: '#161B22', border: '1px solid #30363D', textDecoration: 'none' }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}15` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#F0F6FC' }}>{label}</p>
                <p className="text-xs mt-0.5" style={{ color: '#8B949E' }}>{sub}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Office Address */}
        <div className="rounded-2xl border px-4 py-4" style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: 'rgba(245,166,35,0.1)' }}>
              <MapPin size={16} style={{ color: '#F5A623' }} />
            </div>
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: '#F0F6FC' }}>Office Address</p>
              <p className="text-xs leading-relaxed" style={{ color: '#8B949E' }}>{SUPPORT_ADDRESS}</p>
            </div>
          </div>
        </div>

        <button
          className="w-full mt-4 py-3 rounded-2xl text-sm font-medium"
          style={{ backgroundColor: '#21262D', color: '#8B949E', border: '1px solid #30363D' }}
          onClick={() => router.push('/app/terms')}
        >
          View Terms &amp; Privacy Policy
        </button>
      </main>
    </AppShell>
  );
}
