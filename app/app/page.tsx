'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/lib/app-state';
import { demoUsers, vendorFreeTrips, vendorPremiumTrips, availableTripsForDriver, demoNotifications } from '@/lib/demo-users';
import AppShell from '@/components/app/AppShell';

// ── Premium Transport Illustration ────────────────────────────────────────────
function TransportIllustration() {
  return (
    <svg viewBox="0 0 320 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[300px]">
      {/* Glow under truck */}
      <ellipse cx="170" cy="132" rx="100" ry="10" fill="#F5A623" opacity="0.07" />
      {/* Road */}
      <rect x="0" y="122" width="320" height="38" fill="#111827" rx="4" />
      <rect x="10" y="139" width="36" height="3" fill="#1F2937" rx="1.5" />
      <rect x="64" y="139" width="36" height="3" fill="#1F2937" rx="1.5" />
      <rect x="118" y="139" width="36" height="3" fill="#1F2937" rx="1.5" />
      <rect x="172" y="139" width="36" height="3" fill="#1F2937" rx="1.5" />
      <rect x="226" y="139" width="36" height="3" fill="#1F2937" rx="1.5" />
      <rect x="280" y="139" width="36" height="3" fill="#1F2937" rx="1.5" />
      {/* Truck body */}
      <rect x="55" y="70" width="168" height="52" fill="#1C2430" rx="8" />
      {/* Body top highlight */}
      <rect x="55" y="70" width="168" height="3" fill="#F5A623" rx="8" opacity="0.25" />
      {/* Cargo hold */}
      <rect x="63" y="78" width="122" height="36" fill="#131D2A" rx="5" />
      {/* Cargo stripes */}
      <rect x="72" y="85" width="7" height="22" fill="#F5A623" rx="2" opacity="0.9" />
      <rect x="85" y="85" width="7" height="22" fill="#F5A623" rx="2" opacity="0.5" />
      <rect x="98" y="85" width="7" height="22" fill="#F5A623" rx="2" opacity="0.9" />
      <rect x="111" y="85" width="7" height="22" fill="#F5A623" rx="2" opacity="0.5" />
      <rect x="124" y="85" width="7" height="22" fill="#F5A623" rx="2" opacity="0.9" />
      <rect x="137" y="85" width="7" height="22" fill="#F5A623" rx="2" opacity="0.5" />
      <rect x="150" y="85" width="7" height="22" fill="#F5A623" rx="2" opacity="0.9" />
      <rect x="163" y="85" width="7" height="22" fill="#F5A623" rx="2" opacity="0.5" />
      {/* Truck cabin */}
      <rect x="203" y="76" width="60" height="46" fill="#1E2A3A" rx="8" />
      {/* Cabin top accent */}
      <rect x="203" y="76" width="60" height="3" fill="#F5A623" rx="8" opacity="0.3" />
      {/* Cabin window */}
      <rect x="212" y="83" width="38" height="24" fill="#1E3A5F" rx="4" opacity="0.9" />
      <line x1="231" y1="83" x2="231" y2="107" stroke="#2D6BE4" strokeWidth="1" opacity="0.4" />
      {/* Headlight */}
      <rect x="258" y="94" width="8" height="5" fill="#F5A623" rx="2" opacity="0.9" />
      <rect x="263" y="94" width="18" height="5" fill="#F5A623" rx="2" opacity="0.25" />
      {/* Wheels */}
      <circle cx="96" cy="124" r="15" fill="#0F172A" />
      <circle cx="96" cy="124" r="10" fill="#1E293B" />
      <circle cx="96" cy="124" r="4" fill="#374151" />
      <circle cx="198" cy="124" r="15" fill="#0F172A" />
      <circle cx="198" cy="124" r="10" fill="#1E293B" />
      <circle cx="198" cy="124" r="4" fill="#374151" />
      <circle cx="232" cy="124" r="15" fill="#0F172A" />
      <circle cx="232" cy="124" r="10" fill="#1E293B" />
      <circle cx="232" cy="124" r="4" fill="#374151" />
      {/* Wheel glints */}
      <circle cx="91" cy="119" r="2" fill="#475569" opacity="0.6" />
      <circle cx="193" cy="119" r="2" fill="#475569" opacity="0.6" />
      <circle cx="227" cy="119" r="2" fill="#475569" opacity="0.6" />
      {/* Route dots */}
      <circle cx="26" cy="54" r="7" fill="#F5A623" />
      <circle cx="26" cy="54" r="3.5" fill="#0B1220" />
      <line x1="26" y1="61" x2="26" y2="72" stroke="#F5A623" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />
      <circle cx="294" cy="54" r="7" fill="#22C55E" />
      <circle cx="294" cy="54" r="3.5" fill="#0B1220" />
      <line x1="294" y1="61" x2="294" y2="72" stroke="#22C55E" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />
      {/* Route line */}
      <line x1="33" y1="54" x2="287" y2="54" stroke="#1F2937" strokeWidth="1.5" strokeDasharray="6 4" />
      {/* Midpoint pin */}
      <circle cx="160" cy="54" r="4" fill="#2D6BE4" opacity="0.6" />
      {/* Speed lines */}
      <line x1="10" y1="90" x2="42" y2="90" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
      <line x1="10" y1="97" x2="36" y2="97" stroke="#F5A623" strokeWidth="1" strokeLinecap="round" opacity="0.25" />
      <line x1="10" y1="104" x2="28" y2="104" stroke="#F5A623" strokeWidth="1" strokeLinecap="round" opacity="0.15" />
    </svg>
  );
}

// ── Feature Pill ──────────────────────────────────────────────────────────────
function FeaturePill({ text }: { text: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide"
      style={{
        background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.03))',
        color: '#E2E8F0',
        border: '1px solid rgba(34,197,94,0.2)',
      }}
    >
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <circle cx="5.5" cy="5.5" r="5.5" fill="#22C55E" opacity="0.15" />
        <path d="M3 5.5L5 7.5L8 4" stroke="#22C55E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
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
        background: `linear-gradient(145deg, rgba(${color === '#F5A623' ? '245,166,35' : '45,107,228'},0.06), transparent)`,
        border: `1px solid ${color}28`,
        flex: '1 1 0',
        boxShadow: `0 2px 12px ${color}0A`,
      }}
    >
      <span className="text-xs font-bold" style={{ color }}>
        {label}
      </span>
      <span className="text-[10px] mt-0.5 font-medium" style={{ color: '#64748B' }}>
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
        style={{
          backgroundColor: '#0B1220',
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(245,166,35,0.10) 0%, transparent 55%), radial-gradient(ellipse at 100% 100%, rgba(34,197,94,0.07) 0%, transparent 50%), #0B1220',
        }}
      >
        {/* Hero section */}
        <div className="flex flex-col items-center justify-end pt-10 pb-5 px-6">
          {/* Logo */}
          <div className="mb-1 flex items-center justify-center">
            <img src="/cabsafars/logo.png" alt="CAB SAFARS" className="h-20 w-auto object-contain" />
          </div>

          {/* Tagline */}
          <span
            className="text-xs font-semibold tracking-wider uppercase mb-6"
            style={{ color: '#94A3B8', letterSpacing: '0.15em' }}
          >
            Safe Loads. Smart Journeys.
          </span>

          {/* Illustration */}
          <div className="w-full flex justify-center px-2">
            <TransportIllustration />
          </div>
        </div>

        {/* Content section */}
        <div className="flex flex-col flex-1 px-6 pb-8">
          {/* Headline */}
          <h1
            className="text-2xl font-bold text-center mb-1.5 leading-tight"
            style={{ color: '#F8FAFC' }}
          >
            India's Transport Marketplace
          </h1>
          <p
            className="text-sm text-center mb-5 font-semibold tracking-wide"
            style={{ color: '#F5A623' }}
          >
            Connect. Move. Grow.
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
              className="w-full py-4 rounded-2xl text-base font-bold transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #F5A623, #D4891E)',
                color: '#0B1220',
                boxShadow: '0 4px 24px rgba(245,166,35,0.40)',
                letterSpacing: '0.01em',
              }}
            >
              Login
            </button>
            <button
              onClick={() => router.push('/app/register')}
              className="w-full py-4 rounded-2xl text-base font-semibold transition-all active:scale-95"
              style={{
                backgroundColor: 'transparent',
                border: '1.5px solid #F5A623',
                color: '#F5A623',
                letterSpacing: '0.01em',
              }}
            >
              Create Account
            </button>
          </div>

          {/* Demo section */}
          <div
            className="rounded-2xl p-4"
            style={{
              background: 'linear-gradient(145deg, rgba(245,166,35,0.05), rgba(15,23,42,0.8))',
              border: '1px solid rgba(245,166,35,0.18)',
              boxShadow: '0 0 24px rgba(245,166,35,0.06)',
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <span
                className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{
                  color: '#F5A623',
                  background: 'rgba(245,166,35,0.1)',
                  border: '1px solid rgba(245,166,35,0.2)',
                  letterSpacing: '0.12em',
                }}
              >
                Try Demo
              </span>
            </div>
            <div className="flex gap-2">
              <DemoButton
                label="Trip Provider"
                sublabel="Free"
                color="#F5A623"
                onClick={() => loginAs('vendorFree')}
              />
              <DemoButton
                label="Trip Provider"
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

          {/* Testing note */}
          <p className="text-center mt-4 text-[10px]" style={{ color: '#374151' }}>
            Testing Mode — Data is simulated
          </p>
        </div>
      </div>
    </AppShell>
  );
}
