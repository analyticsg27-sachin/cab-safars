'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/lib/app-state';
import AppShell from '@/components/app/AppShell';
import { availableTripsForDriver, vendorFreeTrips, demoNotifications } from '@/lib/demo-users';

function HourglassIcon() {
  return (
    <div className="relative flex items-center justify-center">
      <style>{`
        @keyframes hourglassSpin {
          0%, 49% { transform: rotate(0deg); }
          50%, 100% { transform: rotate(180deg); }
        }
        @keyframes sandFall {
          0% { height: 20px; opacity: 1; }
          50% { height: 0px; opacity: 0.3; }
          51% { height: 0px; opacity: 0.3; }
          100% { height: 20px; opacity: 1; }
        }
        .hourglass-anim {
          animation: hourglassSpin 2.4s ease-in-out infinite;
        }
        .sand-anim {
          animation: sandFall 2.4s ease-in-out infinite;
        }
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .ring-anim {
          animation: pulseRing 1.8s ease-out infinite;
        }
      `}</style>

      {/* Pulsing ring */}
      <div
        className="absolute w-24 h-24 rounded-full ring-anim"
        style={{ backgroundColor: '#F5A62318' }}
      />
      <div
        className="absolute w-20 h-20 rounded-full"
        style={{ backgroundColor: '#F5A62310', border: '1px solid #F5A62330' }}
      />

      {/* Hourglass */}
      <div className="hourglass-anim">
        <svg width="48" height="60" viewBox="0 0 48 60" fill="none">
          <path d="M6 4 L42 4 L42 8 L28 24 L28 36 L42 52 L42 56 L6 56 L6 52 L20 36 L20 24 L6 8 Z"
            fill="#1C2128" stroke="#F5A623" strokeWidth="2" strokeLinejoin="round" />
          {/* Top sand */}
          <polygon points="12,10 36,10 26,22 22,22" fill="#F5A623" opacity="0.7" />
          {/* Bottom sand */}
          <polygon points="22,38 26,38 36,50 12,50" fill="#F5A623" opacity="0.9" />
          {/* Center drip */}
          <rect x="23" y="23" width="2" height="14" fill="#F5A623" opacity="0.5" className="sand-anim" />
        </svg>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2.5"
      style={{ borderBottom: '1px solid #30363D' }}>
      <span className="text-sm" style={{ color: '#8B949E' }}>{label}</span>
      <span className="text-sm font-medium" style={{ color: '#F0F6FC' }}>{value}</span>
    </div>
  );
}

export default function PendingPage() {
  const router = useRouter();
  const { state, dispatch } = useAppState();
  const user = state.currentUser;

  useEffect(() => {
    if (!state.isAuthenticated) {
      router.push('/app');
    }
  }, [state.isAuthenticated, router]);

  function approveForDemo() {
    if (!user) return;
    const approved = { ...user, status: 'active' as const };
    const trips = user.role === 'vendor' ? vendorFreeTrips : availableTripsForDriver;
    dispatch({ type: 'SET_USER', payload: { user: approved, trips, notifications: demoNotifications } });
    router.push(user.role === 'vendor' ? '/app/vendor/home' : '/app/driver/home');
  }

  if (!user) return null;

  return (
    <AppShell>
      <div
        className="flex flex-col flex-1 items-center justify-center px-6 py-12"
        style={{ backgroundColor: '#0D1117' }}
      >
        {/* Icon */}
        <div className="mb-8">
          <HourglassIcon />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-center mb-2" style={{ color: '#F0F6FC' }}>
          Account Under Review
        </h1>
        <p className="text-sm text-center mb-8 leading-relaxed max-w-[280px]" style={{ color: '#8B949E' }}>
          Your account is being reviewed by our team. You&apos;ll receive a notification once approved.
        </p>

        {/* Info card */}
        <div
          className="w-full rounded-2xl p-4 mb-6"
          style={{ backgroundColor: '#161B22', border: '1px solid #30363D' }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#8B949E' }}>
            Your Details
          </p>
          <InfoRow label="Name" value={user.name} />
          <InfoRow label="Role" value={user.role.charAt(0).toUpperCase() + user.role.slice(1)} />
          <InfoRow label="City" value={user.city} />
          {user.role === 'vendor' && user.companyName && (
            <InfoRow label="Company" value={user.companyName} />
          )}
          {user.role === 'driver' && user.vehicleType && (
            <InfoRow label="Vehicle" value={user.vehicleType} />
          )}
          <div className="flex justify-between items-center pt-2.5">
            <span className="text-sm" style={{ color: '#8B949E' }}>Status</span>
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: '#F59E0B22', color: '#F59E0B' }}
            >
              Pending Review
            </span>
          </div>
        </div>

        {/* Time estimate */}
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-xl mb-8"
          style={{ backgroundColor: '#161B22', border: '1px solid #22C55E33' }}
        >
          <span style={{ color: '#22C55E' }}>⏱</span>
          <span className="text-sm" style={{ color: '#8B949E' }}>
            Usually takes <strong style={{ color: '#F0F6FC' }}>24–48 hours</strong>
          </span>
        </div>

        {/* Contact support */}
        <a
          href="mailto:support@cabsafars.in"
          className="text-sm mb-6"
          style={{ color: '#F5A623' }}
        >
          Contact Support →
        </a>

        {/* Demo bypass */}
        <button
          onClick={approveForDemo}
          className="w-full py-3 rounded-xl text-sm font-semibold transition-all active:scale-95"
          style={{
            backgroundColor: '#21262D',
            border: '1px dashed #30363D',
            color: '#8B949E',
          }}
        >
          Skip for Demo (Approve Now)
        </button>
      </div>
    </AppShell>
  );
}
