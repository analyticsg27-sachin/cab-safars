'use client';

import { useRouter } from 'next/navigation';
import {
  Crown, User, MapPin, ChevronRight, FileText, Lock, HelpCircle,
  Phone, Star, LogOut, Truck, Package, Calendar, CreditCard, Shield,
} from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import AppHeader from '@/components/app/AppHeader';
import { useAppState } from '@/lib/app-state';

const DEMO_PAYMENTS = [
  { date: 'Jun 20, 2026', amount: 'â‚¹199.00', txnId: 'CS74628193' },
  { date: 'May 20, 2026', amount: 'â‚¹199.00', txnId: 'CS61837462' },
  { date: 'Apr 20, 2026', amount: 'â‚¹199.00', txnId: 'CS50293847' },
];

// â”€â”€â”€ Menu Row â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function MenuRow({
  icon: Icon,
  label,
  value,
  iconColor = '#8B949E',
  labelColor = '#F0F6FC',
  onClick,
  isLast = false,
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
  iconColor?: string;
  labelColor?: string;
  onClick?: () => void;
  isLast?: boolean;
}) {
  return (
    <button
      className="w-full flex items-center gap-3 px-4 active:bg-[#21262D] transition-colors"
      style={{ height: '52px', borderBottom: isLast ? 'none' : '1px solid #30363D' }}
      onClick={onClick}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: 'rgba(139,148,158,0.1)' }}
      >
        <Icon size={15} style={{ color: iconColor }} />
      </div>
      <span className="flex-1 text-sm text-left" style={{ color: labelColor }}>{label}</span>
      {value && <span className="text-xs mr-1" style={{ color: '#8B949E' }}>{value}</span>}
      {onClick && <ChevronRight size={14} style={{ color: '#8B949E' }} />}
    </button>
  );
}

// â”€â”€â”€ Section card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function MenuSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold uppercase tracking-wider mb-2 px-1" style={{ color: '#8B949E' }}>
        {title}
      </p>
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}>
        {children}
      </div>
    </div>
  );
}

// â”€â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function ProfilePage() {
  const router = useRouter();
  const { state, dispatch } = useAppState();
  const currentUser = state.currentUser;

  const user = {
    name: currentUser?.name ?? 'Guest',
    role: (currentUser?.role ?? 'driver') as 'driver' | 'vendor',
    isPremium: currentUser?.isPremium ?? false,
    city: currentUser?.city ?? '—',
    state: 'India',
    memberSince: 'Jan 2025',
    premiumExpiry: currentUser?.premiumExpiry ?? '',
    tripsApplied: state.trips.filter(t => t.status === 'open').length,
    tripsCompleted: state.trips.filter(t => t.status === 'closed').length,
    tripsPosted: state.trips.length,
    totalContacts: state.trips.reduce((s, t) => s + t.contactsCount, 0),
  };
  const isDriver = user.role === 'driver';

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <AppShell>
      <AppHeader title="Profile" />

      <main className="flex-1 overflow-y-auto pb-10 pt-5 px-4">
        {/* Avatar + name */}
        <div className="flex flex-col items-center mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mb-3"
            style={{
              backgroundColor: user.isPremium ? 'rgba(245,166,35,0.2)' : '#21262D',
              border: user.isPremium ? '2px solid rgba(245,166,35,0.4)' : '2px solid #30363D',
              color: user.isPremium ? '#F5A623' : '#8B949E',
            }}
          >
            {initials}
          </div>

          <h2 className="text-xl font-bold mb-1" style={{ color: '#F0F6FC' }}>{user.name}</h2>

          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
              style={{ backgroundColor: '#21262D', color: '#8B949E', border: '1px solid #30363D' }}
            >
              {user.role}
            </span>
            {user.isPremium && (
              <span
                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: 'rgba(245,166,35,0.12)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.3)' }}
              >
                <Crown size={10} /> Premium Member
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <MapPin size={12} style={{ color: '#8B949E' }} />
            <span className="text-sm" style={{ color: '#8B949E' }}>{user.city}, {user.state}</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {(isDriver ? [
            { label: 'Applied', value: user.tripsApplied, icon: Truck },
            { label: 'Completed', value: user.tripsCompleted, icon: Package },
            { label: 'Member', value: user.memberSince, icon: Calendar },
          ] : [
            { label: 'Posted', value: user.tripsPosted, icon: Truck },
            { label: 'Contacts', value: user.totalContacts, icon: User },
            { label: 'Member', value: user.memberSince, icon: Calendar },
          ]).map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-xl p-3 flex flex-col items-center gap-1"
              style={{ backgroundColor: '#161B22', border: '1px solid #30363D' }}
            >
              <Icon size={14} style={{ color: '#8B949E' }} />
              <span className="text-base font-bold" style={{ color: '#F0F6FC' }}>{value}</span>
              <span className="text-xs" style={{ color: '#8B949E' }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Account section */}
        <MenuSection title="Account">
          <MenuRow icon={User} label="My Details" onClick={() => router.push('/app/my-details')} />
          <MenuRow icon={Lock} label="Change Password" onClick={() => router.push('/app/change-password')} />
          <MenuRow icon={FileText} label="Documents" onClick={() => router.push('/app/documents')} isLast />
        </MenuSection>

        {/* Subscription section */}
        <MenuSection title="Subscription">
          <MenuRow
            icon={Crown}
            label="Current Plan"
            value={user.isPremium ? 'Premium' : 'Free'}
            iconColor={user.isPremium ? '#F5A623' : '#8B949E'}
            onClick={() => router.push('/app/subscription')}
          />
          <MenuRow
            icon={CreditCard}
            label="Payment History"
            value={`${DEMO_PAYMENTS.length} payments`}
            onClick={() => router.push('/app/subscription')}
            isLast
          />
        </MenuSection>

        {/* Support section */}
        <MenuSection title="Support">
          <MenuRow icon={HelpCircle} label="Help & FAQ" onClick={() => router.push('/app/help')} />
          <MenuRow icon={Phone} label="Contact Support" onClick={() => router.push('/app/support')} />
          <MenuRow icon={Star} label="Rate the App" onClick={() => router.push('/app/rate')} isLast />
        </MenuSection>

        {/* Danger zone */}
        <MenuSection title="Danger Zone">
          <MenuRow
            icon={LogOut}
            label="Logout"
            labelColor="#EF4444"
            iconColor="#EF4444"
            isLast
            onClick={() => { dispatch({ type: 'LOGOUT' }); router.replace('/app/'); }}
          />
        </MenuSection>

        {/* Version */}
        <p className="text-center text-xs mt-2" style={{ color: '#8B949E' }}>
          Cab Safars v1.0.0 Â· Built with care
        </p>
      </main>
    </AppShell>
  );
}
