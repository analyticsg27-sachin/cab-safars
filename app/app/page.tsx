'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/lib/app-state';
import { asset } from '@/lib/basepath';
import { demoUsers, vendorFreeTrips, vendorPremiumTrips, availableTripsForDriver, demoNotifications } from '@/lib/demo-users';
import AppShell from '@/components/app/AppShell';

// â”€â”€ Transport Illustration (Car/Sedan) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function TransportIllustration() {
  return (
    <svg viewBox="0 0 320 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[300px]">
      {/* Glow under car */}
      <ellipse cx="160" cy="132" rx="90" ry="9" fill="#F5A623" opacity="0.08" />
      {/* Road */}
      <rect x="0" y="122" width="320" height="38" fill="#111827" rx="4" />
      <rect x="10" y="139" width="36" height="3" fill="#1F2937" rx="1.5" />
      <rect x="64" y="139" width="36" height="3" fill="#1F2937" rx="1.5" />
      <rect x="118" y="139" width="36" height="3" fill="#1F2937" rx="1.5" />
      <rect x="172" y="139" width="36" height="3" fill="#1F2937" rx="1.5" />
      <rect x="226" y="139" width="36" height="3" fill="#1F2937" rx="1.5" />
      <rect x="280" y="139" width="36" height="3" fill="#1F2937" rx="1.5" />
      {/* Car body (lower) */}
      <rect x="68" y="96" width="184" height="30" fill="#1C2430" rx="8" />
      {/* Car roof / cabin */}
      <path d="M110 96 C118 72 202 72 210 96 Z" fill="#1E2A3A" />
      {/* Roof highlight */}
      <path d="M118 89 C124 77 196 77 202 89" stroke="#F5A623" strokeWidth="1.5" opacity="0.2" fill="none" strokeLinecap="round" />
      {/* Windshield front */}
      <path d="M193 96 C199 80 208 76 210 96 Z" fill="#1E3A5F" opacity="0.85" />
      {/* Windshield rear */}
      <path d="M110 96 C112 76 121 72 127 96 Z" fill="#1E3A5F" opacity="0.85" />
      {/* Side windows */}
      <path d="M130 96 C131 78 163 76 163 96 Z" fill="#1E3A5F" opacity="0.7" />
      <path d="M166 96 C166 76 190 78 191 96 Z" fill="#1E3A5F" opacity="0.7" />
      {/* Window divider */}
      <line x1="164" y1="76" x2="164" y2="96" stroke="#2D6BE4" strokeWidth="1" opacity="0.35" />
      {/* Body accent stripe */}
      <rect x="68" y="96" width="184" height="2" fill="#F5A623" opacity="0.18" rx="1" />
      {/* Door lines */}
      <line x1="164" y1="98" x2="164" y2="126" stroke="#30363D" strokeWidth="1" opacity="0.6" />
      {/* Headlights */}
      <rect x="246" y="102" width="10" height="5" fill="#F5A623" rx="2" opacity="0.95" />
      <ellipse cx="256" cy="104.5" rx="10" ry="4" fill="#F5A623" opacity="0.12" />
      {/* Tail lights */}
      <rect x="68" y="102" width="8" height="5" fill="#EF4444" rx="2" opacity="0.7" />
      {/* Wheels */}
      <circle cx="112" cy="124" r="14" fill="#0F172A" />
      <circle cx="112" cy="124" r="9" fill="#1E293B" />
      <circle cx="112" cy="124" r="4" fill="#374151" />
      <circle cx="112" cy="124" r="2" fill="#4B5563" />
      <circle cx="208" cy="124" r="14" fill="#0F172A" />
      <circle cx="208" cy="124" r="9" fill="#1E293B" />
      <circle cx="208" cy="124" r="4" fill="#374151" />
      <circle cx="208" cy="124" r="2" fill="#4B5563" />
      {/* Wheel glints */}
      <circle cx="107" cy="119" r="2" fill="#475569" opacity="0.5" />
      <circle cx="203" cy="119" r="2" fill="#475569" opacity="0.5" />
      {/* Route line */}
      <line x1="20" y1="52" x2="300" y2="52" stroke="#1F2937" strokeWidth="1.5" strokeDasharray="6 4" />
      {/* Origin pin */}
      <circle cx="20" cy="52" r="6" fill="#F5A623" opacity="0.9" />
      <circle cx="20" cy="52" r="3" fill="#0B1220" />
      {/* Destination pin */}
      <circle cx="300" cy="52" r="6" fill="#F5A623" opacity="0.9" />
      <circle cx="300" cy="52" r="3" fill="#0B1220" />
      {/* Midpoint pin */}
      <circle cx="160" cy="52" r="4" fill="#2D6BE4" opacity="0.5" />
      {/* Speed lines */}
      <line x1="8" y1="100" x2="40" y2="100" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <line x1="8" y1="107" x2="34" y2="107" stroke="#F5A623" strokeWidth="1" strokeLinecap="round" opacity="0.2" />
    </svg>
  );
}

// â”€â”€ Feature Pill â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€ Demo Quick Login Button â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€ Welcome Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function WelcomePage() {
  const { state, dispatch } = useAppState();
  const router = useRouter();

  // First-launch: show onboarding splash once
  useEffect(() => {
    if (!localStorage.getItem('cs_onboarding_done')) {
      router.replace('/app/onboarding');
    }
  }, [router]);

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
    dispatch({ type: 'LOGOUT' }); // clear any stale localStorage state
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
          <div className="mb-3 flex items-center justify-center">
            <img
              src={asset('/logo-v2.png')}
              alt="CAB SAFARS"
              className="h-36 w-auto object-contain block"
            />
          </div>

          {/* Tagline */}
          <span
            className="text-sm font-bold tracking-widest uppercase mb-6"
            style={{ color: '#E2E8F0', letterSpacing: '0.18em', textShadow: '0 0 20px rgba(245,166,35,0.3)' }}
          >
            Safe Trips. Smart Journeys.
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
            India's Travels Marketplace
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

