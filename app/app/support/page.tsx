'use client';

import { useRouter } from 'next/navigation';
import { Phone, Mail, MessageCircle, Clock } from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import AppHeader from '@/components/app/AppHeader';

export default function SupportPage() {
  const router = useRouter();

  const options = [
    { icon: Phone, label: 'Call Support', sub: '+91 98765 00000', color: '#22C55E', href: 'tel:+919876500000' },
    { icon: MessageCircle, label: 'WhatsApp Us', sub: 'Quick response on WhatsApp', color: '#25D366', href: 'https://wa.me/919876500000' },
    { icon: Mail, label: 'Email Support', sub: 'support@cabsafars.com', color: '#3B82F6', href: 'mailto:support@cabsafars.com' },
  ];

  return (
    <AppShell>
      <AppHeader title="Contact Support" showBack onBack={() => router.back()} />
      <main className="flex-1 overflow-y-auto px-4 pb-10 pt-6">
        <div className="flex items-center gap-2 rounded-xl px-4 py-3 mb-6" style={{ backgroundColor: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)' }}>
          <Clock size={14} style={{ color: '#F5A623' }} />
          <p className="text-xs" style={{ color: '#F5A623' }}>Support hours: Mon–Sat, 9 AM – 6 PM IST</p>
        </div>

        <div className="flex flex-col gap-3">
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
      </main>
    </AppShell>
  );
}
