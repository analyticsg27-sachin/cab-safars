'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAppState } from '@/lib/app-state';
import { demoUsers, vendorFreeTrips, vendorPremiumTrips, availableTripsForDriver, demoNotifications } from '@/lib/demo-users';
import AppShell from '@/components/app/AppShell';

type Role = 'vendor' | 'driver';

function mockLogin(identifier: string, role: Role) {
  // Match demo users by email, phone or name (case-insensitive)
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
  // Default: return first user matching role
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

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!identifier.trim()) { setError('Please enter your mobile number or email.'); return; }
    if (!password.trim()) { setError('Please enter your password.'); return; }
    setError('');
    setLoading(true);
    setTimeout(() => {
      const user = mockLogin(identifier, role);
      if (!user) { setError('No account found. Try demo access below.'); setLoading(false); return; }
      const trips =
        user.id === 'v003'
          ? vendorFreeTrips
          : user.id === 'v001'
          ? vendorPremiumTrips
          : availableTripsForDriver;
      dispatch({ type: 'SET_USER', payload: { user, trips, notifications: demoNotifications } });
      router.push(user.role === 'vendor' ? '/app/vendor/home' : '/app/driver/home');
    }, 600);
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
        style={{ backgroundColor: '#0D1117' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-12 pb-6">
          <button
            onClick={() => router.push('/app')}
            className="flex items-center justify-center w-9 h-9 rounded-full"
            style={{ backgroundColor: '#161B22', color: '#F0F6FC' }}
          >
            <ArrowLeft size={18} />
          </button>
        </div>

        <div className="flex flex-col flex-1 px-6 pb-10">
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: '#F0F6FC' }}
          >
            Welcome Back
          </h1>
          <p className="text-sm mb-7" style={{ color: '#8B949E' }}>
            Sign in to your account
          </p>

          {/* Role toggle */}
          <div
            className="flex rounded-xl p-1 mb-6"
            style={{ backgroundColor: '#161B22' }}
          >
            {(['vendor', 'driver'] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all"
                style={
                  role === r
                    ? { backgroundColor: '#F5A623', color: '#0D1117' }
                    : { backgroundColor: 'transparent', color: '#8B949E' }
                }
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* Identifier */}
            <div>
              <label
                className="block text-xs font-semibold mb-1.5"
                style={{ color: '#8B949E' }}
              >
                Mobile Number or Email
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="+91 98XXX XXXXX"
                className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                style={{
                  backgroundColor: '#21262D',
                  border: '1px solid #30363D',
                  color: '#F0F6FC',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#F5A623')}
                onBlur={(e) => (e.target.style.borderColor = '#30363D')}
              />
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-xs font-semibold mb-1.5"
                style={{ color: '#8B949E' }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3.5 pr-12 rounded-xl text-sm outline-none transition-all"
                  style={{
                    backgroundColor: '#21262D',
                    border: '1px solid #30363D',
                    color: '#F0F6FC',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#F5A623')}
                  onBlur={(e) => (e.target.style.borderColor = '#30363D')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: '#8B949E' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm" style={{ color: '#EF4444' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-base font-bold mt-2 transition-all active:scale-95 disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #F5A623, #D4891E)',
                color: '#0D1117',
              }}
            >
              {loading ? 'Signing in…' : 'Login'}
            </button>
          </form>

          <p className="text-sm text-center mt-5" style={{ color: '#8B949E' }}>
            Don&apos;t have an account?{' '}
            <button
              onClick={() => router.push('/app/register')}
              className="font-semibold"
              style={{ color: '#F5A623' }}
            >
              Register
            </button>
          </p>

          {/* Demo shortcuts */}
          <div
            className="mt-8 rounded-2xl p-4"
            style={{ backgroundColor: '#161B22', border: '1px solid #30363D' }}
          >
            <p
              className="text-[11px] font-semibold uppercase tracking-wider text-center mb-3"
              style={{ color: '#8B949E' }}
            >
              Quick Demo Access
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { key: 'vendorFree', label: 'Vendor Free', color: '#F5A623' },
                  { key: 'vendorPremium', label: 'Vendor Premium ★', color: '#F5A623' },
                  { key: 'driverFree', label: 'Driver Free', color: '#2D6BE4' },
                  { key: 'driverPremium', label: 'Driver Premium ★', color: '#2D6BE4' },
                ] as const
              ).map(({ key, label, color }) => (
                <button
                  key={key}
                  onClick={() => quickLogin(key)}
                  className="py-2.5 px-3 rounded-xl text-xs font-semibold transition-all active:scale-95"
                  style={{
                    backgroundColor: '#21262D',
                    border: `1px solid ${color}44`,
                    color,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
