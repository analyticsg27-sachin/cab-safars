'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Crown, User, MapPin, ChevronRight, FileText, Lock, HelpCircle,
  Phone, Star, LogOut, Truck, Package, Calendar, CreditCard, Camera,
} from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import AppHeader from '@/components/app/AppHeader';
import { useAppState } from '@/lib/app-state';
import { isFullyActive } from '@/components/app/AccountStatusBanner';
import { useTranslation } from '@/lib/useTranslation';

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
  const { t } = useTranslation();
  const currentUser = state.currentUser;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (currentUser?.id) {
      const saved = localStorage.getItem(`cs_photo_${currentUser.id}`);
      if (saved) setPhotoUrl(saved);
    }
  }, [currentUser?.id]);

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !currentUser?.id) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
      const baseUrl = apiUrl.replace('/api/v1', '');

      const doUpload = async (token: string | null) => {
        return fetch(`${apiUrl}/upload/profile-image`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });
      };

      let token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      let res = await doUpload(token);

      // Auto-refresh token on 401
      if (res.status === 401) {
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
        if (refreshToken) {
          const rRes = await fetch(`${apiUrl}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });
          if (rRes.ok) {
            const rData = await rRes.json();
            token = rData.data?.access_token ?? null;
            if (token) {
              localStorage.setItem('access_token', token);
              res = await doUpload(token);
            }
          }
        }
      }

      if (res.ok) {
        const data = await res.json();
        const fullUrl = `${baseUrl}/${data.data?.path}`;
        setPhotoUrl(fullUrl);
        localStorage.setItem(`cs_photo_${currentUser.id}`, fullUrl);
      } else {
        // fallback: show locally only
        const reader = new FileReader();
        reader.onload = (ev) => { const url = ev.target?.result as string; localStorage.setItem(`cs_photo_${currentUser.id}`, url); setPhotoUrl(url); };
        reader.readAsDataURL(file);
      }
    } catch {
      const reader = new FileReader();
      reader.onload = (ev) => { const url = ev.target?.result as string; localStorage.setItem(`cs_photo_${currentUser.id}`, url); setPhotoUrl(url); };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  }

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
  const fullyActive = currentUser ? isFullyActive(currentUser) : false;

  return (
    <AppShell>
      <AppHeader title={t('nav_profile')} showBack onBack={() => router.back()} />

      <main className="flex-1 overflow-y-auto pb-10 pt-5 px-4">
        {/* Avatar + name */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-3">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover"
                style={{ border: user.isPremium ? '2px solid rgba(245,166,35,0.4)' : '2px solid #30363D' }}
              />
            ) : (
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden"
                style={{
                  backgroundColor: user.isPremium ? 'rgba(245,166,35,0.15)' : '#1C2128',
                  border: user.isPremium ? '2px solid rgba(245,166,35,0.4)' : '2px solid #30363D',
                }}
              >
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* background gradient */}
                  <circle cx="40" cy="40" r="40" fill={user.isPremium ? 'rgba(245,166,35,0.12)' : '#1C2128'} />
                  {/* head */}
                  <circle cx="40" cy="30" r="13" fill={user.isPremium ? '#F5A623' : '#8B949E'} opacity="0.9" />
                  {/* body / shoulders */}
                  <path d="M14 72 C14 55 66 55 66 72" fill={user.isPremium ? '#F5A623' : '#8B949E'} opacity="0.7" />
                </svg>
              </div>
            )}
            <button
              onClick={() => !uploading && fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-90"
              style={{ backgroundColor: '#F5A623', border: '2px solid #0D1117', opacity: uploading ? 0.6 : 1 }}
            >
              {uploading
                ? <div className="w-3 h-3 border border-black border-t-transparent rounded-full animate-spin" />
                : <Camera size={13} style={{ color: '#000' }} />}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="user"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>

          <h2 className="text-xl font-bold mb-1" style={{ color: '#F0F6FC' }}>{user.name}</h2>

          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
              style={{ backgroundColor: '#21262D', color: '#8B949E', border: '1px solid #30363D' }}
            >
              {user.role === 'vendor' ? t('trip_provider') : t('driver')}
            </span>
            {user.isPremium && (
              <span
                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: 'rgba(245,166,35,0.12)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.3)' }}
              >
                <Crown size={10} /> {t('premium_member')}
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
            { label: t('stat_applied'), value: user.tripsApplied, icon: Truck },
            { label: t('stat_completed'), value: user.tripsCompleted, icon: Package },
            { label: t('stat_member'), value: user.memberSince, icon: Calendar },
          ] : [
            { label: t('stat_posted'), value: user.tripsPosted, icon: Truck },
            { label: t('contacts'), value: user.totalContacts, icon: User },
            { label: t('stat_member'), value: user.memberSince, icon: Calendar },
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
        <MenuSection title={t('account')}>
          <MenuRow icon={User} label={t('my_details')} onClick={() => router.push('/app/my-details')} />
          {fullyActive && <MenuRow icon={Lock} label={t('change_password')} onClick={() => router.push('/app/change-password')} />}
          <MenuRow icon={FileText} label={t('documents')} onClick={() => router.push('/app/documents')} isLast />
        </MenuSection>

        {/* Subscription section — only when fully active */}
        {fullyActive && (
          <MenuSection title={t('subscription')}>
            <MenuRow
              icon={Crown}
              label={t('current_plan')}
              value={user.isPremium ? t('premium') : t('free')}
              iconColor={user.isPremium ? '#F5A623' : '#8B949E'}
              onClick={() => router.push('/app/subscription')}
            />
            <MenuRow
              icon={CreditCard}
              label={t('payment_history')}
              value={user.isPremium ? `${DEMO_PAYMENTS.length} ${t('payments_suffix')}` : t('no_payments')}
              onClick={() => router.push('/app/payment-history')}
              isLast
            />
          </MenuSection>
        )}

        {/* Support section */}
        <MenuSection title={t('support')}>
          <MenuRow icon={HelpCircle} label={t('help_faq')} onClick={() => router.push('/app/help')} />
          <MenuRow icon={Phone} label={t('contact_support')} onClick={() => router.push('/app/support')} />
          <MenuRow icon={FileText} label={t('terms_privacy')} onClick={() => router.push('/app/terms')} />
          <MenuRow icon={Star} label={t('rate_app')} onClick={() => router.push('/app/rate')} isLast />
        </MenuSection>

        {/* Danger zone */}
        <MenuSection title={t('danger_zone')}>
          <MenuRow
            icon={LogOut}
            label={t('logout')}
            labelColor="#EF4444"
            iconColor="#EF4444"
            isLast
            onClick={() => { dispatch({ type: 'LOGOUT' }); router.replace('/app/'); }}
          />
        </MenuSection>

        {/* Version */}
        <p className="text-center text-xs mt-2" style={{ color: '#8B949E' }}>
          {t('app_version')}
        </p>
      </main>
    </AppShell>
  );
}
