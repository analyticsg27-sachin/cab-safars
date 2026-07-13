'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/lib/app-state';
import { demoUsers, vendorFreeTrips, vendorPremiumTrips, availableTripsForDriver, demoNotifications } from '@/lib/demo-users';
import AppShell from '@/components/app/AppShell';

// ── Inline SVG Transport Illustration ─────────────────────────────────────────
function TransportIllustration() {
  return (
    <svg viewBox="0 0 320 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[280px]">
      {/* Road */}
      <rect x="0" y="120" width="320" height="40" fill="#161B22" rx="4" />
      <rect x="20" y="138" width="40" height="4" fill="#30363D" rx="2" />
      <rect x="80" y="138" width="40" height="4" fill="#30363D" rx="2" />
      <rect x="140" y="138" width="40" height="4" fill="#30363D" rx="2" />
      <rect x="200" y="138" width="40" height="4" fill="#30363D" rx="2" />
      <rect x="260" y="138" width="40" height="4" fill="#30363D" rx="2" />
      {/* Truck body */}
      <rect x="60" y="72" width="160" height="48" fill="#1C2128" rx="6" />
      {/* Truck cabin */}
      <rect x="200" y="80" width="56" height="40" fill="#21262D" rx="6" />
      {/* Cabin window */}
      <rect x="210" y="86" width="34" height="22" fill="#2D6BE4" rx="3" opacity="0.7" />
      {/* Wheels */}
      <circle cx="100" cy="122" r="14" fill="#30363D" />
      <circle cx="100" cy="122" r="7" fill="#21262D" />
      <circle cx="200" cy="122" r="14" fill="#30363D" />
      <circle cx="200" cy="122" r="7" fill="#21262D" />
      <circle cx="234" cy="122" r="14" fill="#30363D" />
      <circle cx="234" cy="122" r="7" fill="#21262D" />
      {/* Cargo stripes */}
      <rect x="70" y="82" width="120" height="28" fill="#161B22" rx="4" />
      <rect x="80" y="88" width="8" height="16" fill="#F5A623" rx="2" opacity="0.8" />
      <rect x="96" y="88" width="8" height="16" fill="#F5A623" rx="2" opacity="0.5" />
      <rect x="112" y="88" width="8" height="16" fill="#F5A623" rx="2" opacity="0.8" />
      <rect x="128" y="88" width="8" height="16" fill="#F5A623" rx="2" opacity="0.5" />
      <rect x="144" y="88" width="8" height="16" fill="#F5A623" rx="2" opacity="0.8" />
      <rect x="160" y="88" width="8" height="16" fill="#F5A623" rx="2" opacity="0.5" />
      {/* Route dots */}
      <circle cx="30" cy="60" r="6" fill="#F5A623" />
      <line x1="30" y1="66" x2="30" y2="80" stroke="#F5A623" strokeWidth="2" strokeDasharray="4 3" />
      <circle cx="290" cy="60" r="6" fill="#22C55E" />
      <line x1="290" y1="66" x2="290" y2="80" stroke="#22C55E" strokeWidth="2" strokeDasharray="4 3" />
      {/* Route line */}
      <line x1="36" y1="60" x2="284" y2="60" stroke="#30363D" strokeWidth="1.5" strokeDasharray="6 4" />
      {/* Speed lines */}
      <line x1="20" y1="96" x2="48" y2="96" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="20" y1="102" x2="40" y2="102" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

// ── Feature Pill ──────────────────────────────────────────────────────────────
function FeaturePill({ text }: { text: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
      style={{ backgroundColor: '#1C2128', color: '#F0F6FC', border: '1px solid #30363D' }}
    >
      <span style={{ color: '#22C55E' }}>✓</span>
      {text}
    </span>
  );
}

// ── Demo Quick Login Button ───────────────────────────────────────────────────
interface DemoButtonProps {
  label: string;
  sublabel: string;
  color: string;
  onClick: () => void;
}
function DemoButton({ label, sublabel, color, onClick }: DemoButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center p-3 rounded-xl text-center transition-all active:scale-95"
      style={{
        backgroundColor: '#161B22',
        border: `1px solid ${color}33`,
        flex: '1 1 0',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = color)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = `${color}33`)}
    >
      <span className="text-xs font-bold" style={{ color }}>
        {label}
      </span>
      <span className="text-[10px] mt-0.5" style={{ color: '#8B949E' }}>
        {sublabel}
      </span>
    </button>
  );
}

// ── Welcome Page ──────────────────────────────────────────────────────────────
export default function WelcomePage() {
  const { state, dispatch } = useAppState();
  const router = useRouter();

  // If already authenticated, redirect to the correct home
  useEffect(() => {
    if (!state.isAuthenticated) return;
    const u = state.currentUser!;
    if (u.status === 'pending') {
      router.push('/app/pending');
    } else if (u.role === 'vendor') {
      router.push('/app/vendor/home');
    } else {
      router.push('/app/driver/home');
    }
  }, [state.isAuthenticated, state.currentUser, router]);

  function loginAs(key: keyof typeof demoUsers) {
    const user = demoUsers[key];
    const trips =
      key === 'vendorFree'
        ? vendorFreeTrips
        : key === 'vendorPremium'
        ? vendorPremiumTrips
        : availableTripsForDriver;
    const notifications = demoNotifications;
    dispatch({ type: 'SET_USER', payload: { user, trips, notifications } });
    if (user.role === 'vendor') {
      router.push('/app/vendor/home');
    } else {
      router.push('/app/driver/home');
    }
  }

  return (
    <AppShell>
      <div
        className="flex flex-col flex-1 overflow-y-auto"
        style={{ backgroundColor: '#0D1117' }}
      >
        {/* Hero section — top ~40% */}
        <div
          className="flex flex-col items-center justify-end pt-12 pb-6 px-6"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(245,166,35,0.08) 0%, transparent 70%)',
          }}
        >
          {/* Brand name */}
          <div className="mb-2 text-center">
            <span
              className="text-3xl font-black tracking-widest uppercase"
              style={{ color: '#F5A623', letterSpacing: '0.18em' }}
            >
              CAB SAFARS
            </span>
          </div>
          <span
            className="text-xs font-semibold tracking-widest uppercase mb-6"
            style={{ color: '#8B949E' }}
          >
            Vendor &amp; Driver Network
          </span>

          {/* Illustration */}
          <div className="w-full flex justify-center px-4">
            <TransportIllustration />
          </div>
        </div>

        {/* Content section */}
        <div className="flex flex-col flex-1 px-6 pb-8">
          {/* Headline */}
          <h1
            className="text-2xl font-bold text-center mb-2 leading-tight"
            style={{ color: '#F0F6FC' }}
          >
            Grow Your Transport Business
          </h1>
          <p
            className="text-sm text-center mb-5 leading-relaxed"
            style={{ color: '#8B949E' }}
          >
            Connect with verified vendors and drivers across India
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-7">
            <FeaturePill text="Post Trips Instantly" />
            <FeaturePill text="Smart Route Matching" />
            <FeaturePill text="Premium Network" />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={() => router.push('/app/login')}
              className="w-full py-3.5 rounded-xl text-base font-bold transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #F5A623, #D4891E)',
                color: '#0D1117',
                boxShadow: '0 4px 20px rgba(245,166,35,0.35)',
              }}
            >
              Login
            </button>
            <button
              onClick={() => router.push('/app/register')}
              className="w-full py-3.5 rounded-xl text-base font-semibold transition-all active:scale-95"
              style={{
                backgroundColor: 'transparent',
                border: '1.5px solid #F5A623',
                color: '#F5A623',
              }}
            >
              Create Account
            </button>
          </div>

          {/* Demo section */}
          <div
            className="rounded-2xl p-4"
            style={{ backgroundColor: '#161B22', border: '1px solid #30363D' }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider text-center mb-3"
              style={{ color: '#8B949E' }}
            >
              Demo Access — Tap to explore
            </p>
            <div className="flex gap-2">
              <DemoButton
                label="Vendor"
                sublabel="Free"
                color="#F5A623"
                onClick={() => loginAs('vendorFree')}
              />
              <DemoButton
                label="Vendor"
                sublabel="Premium ★"
                color="#F5A623"
                onClick={() => loginAs('vendorPremium')}
              />
              <DemoButton
                label="Driver"
                sublabel="Free"
                color="#2D6BE4"
                onClick={() => loginAs('driverFree')}
              />
              <DemoButton
                label="Driver"
                sublabel="Premium ★"
                color="#2D6BE4"
                onClick={() => loginAs('driverPremium')}
              />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
