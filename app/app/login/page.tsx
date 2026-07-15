'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowLeft, X } from 'lucide-react';
import { useAppState } from '@/lib/app-state';
import { IS_API_MODE } from '@/lib/services';
import AuthService from '@/lib/services/auth.service';
import { setTokens } from '@/lib/services/api-client';
import { demoUsers, vendorFreeTrips, vendorPremiumTrips, availableTripsForDriver, demoNotifications } from '@/lib/demo-users';
import type { AppUser } from '@/lib/app-types';
import AppShell from '@/components/app/AppShell';

type Role = 'vendor' | 'driver';

function mockLogin(identifier: string, role: Role) {
  const needle = identifier.toLowerCase().trim();
  for (const user of Object.values(demoUsers)) {
    if (
      user.role === role &&
      (user.email.toLowerCase() === needle ||
        user.phone.replace(/\s/g, '') === needle.replace(/\s/g, '') ||
        user.name.toLowerCase() === needle)
    ) {
      return user;
    }
  }
  return Object.values(demoUsers).find((u) => u.role === role) ?? null;
}

export default function LoginPage() {
  const router = useRouter();
  const { dispatch } = useAppState();
  const [role, setRole] = useState<Role>('vendor');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!identifier.trim()) { setError('Please enter your mobile number or email.'); return; }
    if (!password.trim()) { setError('Please enter your password.'); return; }
    setError('');
    setLoading(true);

    if (IS_API_MODE) {
      try {
        const res = await AuthService.login(identifier.trim(), password);
        if (res.status === 'pending') {
          const user: AppUser = {
            id: res.user.uuid,
            name: res.user.name,
            phone: res.user.phone,
            email: res.user.email ?? '',
            role: res.user.role,
            status: 'pending',
            isPremium: false,
            city: res.user.city,
          };
          dispatch({ type: 'SET_USER', payload: { user, trips: [], notifications: [] } });
          router.push('/app/pending');
          return;
        }
        if (res.user.status !== 'approved') {
          setError('Your account is not approved yet.');
          setLoading(false);
          return;
        }
        const user: AppUser = {
          id: res.user.uuid,
          name: res.user.name,
          phone: res.user.phone,
          email: res.user.email ?? '',
          role: res.user.role,
          status: 'active',
          isPremium: res.user.is_premium,
          premiumExpiry: res.user.premium_expires_at ?? undefined,
          city: res.user.city,
          companyName: res.user.company_name,
          vehicleType: res.user.vehicle_type,
        };
        dispatch({ type: 'SET_USER', payload: { user, trips: [], notifications: [] } });
        router.push(user.role === 'vendor' ? '/app/vendor/home' : '/app/driver/home');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Login failed';
        setError(msg);
        setLoading(false);
      }
    } else {
      setTimeout(() => {
        const user = mockLogin(identifier, role);
        if (!user) { setError('No account found. Try demo access below.'); setLoading(false); return; }
        const trips =
          user.id === 'v003' ? vendorFreeTrips
          : user.id === 'v001' ? vendorPremiumTrips
          : availableTripsForDriver;
        dispatch({ type: 'SET_USER', payload: { user, trips, notifications: demoNotifications } });
        router.push(user.role === 'vendor' ? '/app/vendor/home' : '/app/driver/home');
      }, 600);
    }
  }

  function quickLogin(key: keyof typeof demoUsers) {
    const user = demoUsers[key];
    const trips =
      key === 'vendorFree' ? vendorFreeTrips
      : key === 'vendorPremium' ? vendorPremiumTrips
      : availableTripsForDriver;
    dispatch({ type: 'SET_USER', payload: { user, trips, notifications: demoNotifications } });
    router.push(user.role === 'vendor' ? '/app/vendor/home' : '/app/driver/home');
  }

  return (
    <AppShell>
      <div
        className="flex flex-col flex-1 overflow-y-auto"
        style={{
          backgroundColor: '#0B1220',
          backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(245,166,35,0.08) 0%, transparent 60%)',
          minHeight: '100%',
        }}
      >
        {/* Back button */}
        <div className="px-4 pt-12 pb-2">
          <button
            onClick={() => router.push('/app')}
            className="flex items-center justify-center w-10 h-10 rounded-2xl transition-all active:scale-90"
            style={{ backgroundColor: '#111827', border: '1px solid #243042', color: '#94A3B8' }}
          >
            <ArrowLeft size={18} />
          </button>
        </div>

        {/* Logo */}
        <div className="px-6 pt-4 pb-2 flex flex-col items-center">
          <img
            src="/cabsafars/logo.png"
            alt="CAB SAFARS"
            className="h-14 w-auto object-contain mx-auto mb-6"
          />
          <h1 className="text-2xl font-bold text-white mb-1">Welcome Back</h1>
          <p className="text-sm" style={{ color: '#94A3B8' }}>Sign in to continue your journey</p>
        </div>

        {/* Card */}
        <div
          className="mx-4 mt-6 mb-4 rounded-3xl p-6 shadow-2xl"
          style={{ backgroundColor: '#111827', border: '1px solid #243042' }}
        >
          {/* Error banner */}
          {error && (
            <div
              className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-5"
              style={{ backgroundColor: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)' }}
            >
              <X size={16} style={{ color: '#EF4444', flexShrink: 0 }} />
              <p className="text-sm flex-1" style={{ color: '#FCA5A5' }}>{error}</p>
              <button onClick={() => setError('')} style={{ color: '#EF4444' }}>
                <X size={14} />
              </button>
            </div>
          )}

          {/* Role toggle — mock mode only */}
          {!IS_API_MODE && (
            <div className="flex gap-2 mb-6">
              {(['vendor', 'driver'] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold capitalize transition-all"
                  style={
                    role === r
                      ? { backgroundColor: '#F5A623', color: '#000000' }
                      : { backgroundColor: 'transparent', border: '1px solid #243042', color: '#94A3B8' }
                  }
                >
                  {r === 'vendor' ? 'Trip Provider' : 'Driver'}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* Identifier */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>
                Mobile Number or Email
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="+91 98XXX XXXXX"
                className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                style={{
                  backgroundColor: '#1A2332',
                  border: '1px solid #243042',
                  color: '#F1F5F9',
                  caretColor: '#F5A623',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#F5A623';
                  e.target.style.boxShadow = '0 0 0 3px rgba(245,166,35,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#243042';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3.5 pr-12 rounded-xl text-sm outline-none transition-all"
                  style={{
                    backgroundColor: '#1A2332',
                    border: '1px solid #243042',
                    color: '#F1F5F9',
                    caretColor: '#F5A623',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#F5A623';
                    e.target.style.boxShadow = '0 0 0 3px rgba(245,166,35,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#243042';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#94A3B8' }}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl text-base font-bold mt-1 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #F5A623 0%, #D4891E 100%)', color: '#000000' }}
            >
              {loading ? (
                <>
                  <span
                    className="inline-block w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin"
                  />
                  Please wait...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Bottom link */}
        <p className="text-sm text-center py-4" style={{ color: '#94A3B8' }}>
          Don&apos;t have an account?{' '}
          <button
            onClick={() => router.push('/app/register')}
            className="font-semibold underline-offset-2"
            style={{ color: '#F5A623' }}
          >
            Register
          </button>
        </p>

        {/* Demo shortcuts — mock mode only */}
        {!IS_API_MODE && (
          <div
            className="mx-4 mb-8 rounded-2xl p-4"
            style={{ backgroundColor: '#111827', border: '1px solid #243042' }}
          >
            <p
              className="text-[11px] font-semibold uppercase tracking-wider text-center mb-3"
              style={{ color: '#94A3B8' }}
            >
              Quick Demo Access
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { key: 'vendorFree', label: 'Vendor Free', color: '#F5A623' },
                  { key: 'vendorPremium', label: 'Vendor Premium ★', color: '#F5A623' },
                  { key: 'driverFree', label: 'Driver Free', color: '#60A5FA' },
                  { key: 'driverPremium', label: 'Driver Premium ★', color: '#60A5FA' },
                ] as const
              ).map(({ key, label, color }) => (
                <button
                  key={key}
                  onClick={() => quickLogin(key)}
                  className="py-2.5 px-3 rounded-xl text-xs font-semibold transition-all active:scale-95"
                  style={{ backgroundColor: '#1A2332', border: `1px solid ${color}44`, color }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
