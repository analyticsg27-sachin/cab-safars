'use client';

import { useRouter } from 'next/navigation';
import { User, Phone, Mail, MapPin, Truck, Building2, Crown } from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import AppHeader from '@/components/app/AppHeader';
import { useAppState } from '@/lib/app-state';

export default function MyDetailsPage() {
  const router = useRouter();
  const { state } = useAppState();
  const user = state.currentUser;

  if (!user) { router.replace('/app/'); return null; }

  const rows = [
    { icon: User, label: 'Full Name', value: user.name },
    { icon: Phone, label: 'Phone', value: user.phone },
    { icon: Mail, label: 'Email', value: user.email || '—' },
    { icon: MapPin, label: 'City', value: user.city || '—' },
    { icon: user.role === 'driver' ? Truck : Building2, label: user.role === 'driver' ? 'Vehicle' : 'Company', value: user.role === 'driver' ? (user.vehicleType || '—') : (user.companyName || '—') },
    { icon: Crown, label: 'Plan', value: user.isPremium ? `Premium${user.premiumExpiry ? ` · expires ${user.premiumExpiry}` : ''}` : 'Free' },
  ];

  return (
    <AppShell>
      <AppHeader title="My Details" showBack onBack={() => router.back()} />
      <main className="flex-1 overflow-y-auto px-4 pb-10 pt-6">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: '#21262D', border: '2px solid #F5A623' }}>
            <span className="text-3xl font-bold" style={{ color: '#F5A623' }}>{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <p className="text-lg font-bold" style={{ color: '#F0F6FC' }}>{user.name}</p>
          <span className="text-xs font-semibold px-3 py-1 rounded-full mt-1 capitalize" style={{ backgroundColor: 'rgba(245,166,35,0.12)', color: '#F5A623' }}>{user.role}</span>
        </div>

        {/* Details card */}
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}>
          {rows.map(({ icon: Icon, label, value }, i) => (
            <div key={label} className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: i < rows.length - 1 ? '1px solid #30363D' : 'none' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(139,148,158,0.1)' }}>
                <Icon size={15} style={{ color: '#8B949E' }} />
              </div>
              <div className="flex-1">
                <p className="text-xs" style={{ color: '#8B949E' }}>{label}</p>
                <p className="text-sm font-medium" style={{ color: '#F0F6FC' }}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#8B949E' }}>To update your details, contact support.</p>
      </main>
    </AppShell>
  );
}
