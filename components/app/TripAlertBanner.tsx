'use client';

import { useEffect, useState } from 'react';
import { Bell, X, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TripAlert {
  id: string;
  from: string;
  to: string;
  vehicle: string;
  fare: number;
  tripId: string;
}

// Demo alerts that fire after a delay to simulate push notifications
const DEMO_ALERTS: TripAlert[] = [
  { id: 'a1', from: 'Ahmedabad', to: 'Surat',  vehicle: 'SUV',           fare: 8500,  tripId: 'tr-open-001' },
  { id: 'a2', from: 'Vadodara',  to: 'Mumbai', vehicle: 'Tempo Travel',  fare: 14000, tripId: 'tr-open-004' },
  { id: 'a3', from: 'Rajkot',    to: 'Pune',   vehicle: 'Innova Crysta', fare: 22000, tripId: 'tr-open-007' },
];

export default function TripAlertBanner({ role }: { role: 'driver' | 'vendor' }) {
  const router = useRouter();
  const [alert, setAlert] = useState<TripAlert | null>(null);
  const [shown, setShown] = useState<Set<string>>(new Set());
  const [alertIndex, setAlertIndex] = useState(0);

  useEffect(() => {
    // Only show for drivers — they get new trip notifications
    if (role !== 'driver') return;

    // Show first demo alert after 8 seconds, then every 45 seconds
    const delay = alertIndex === 0 ? 8000 : 45000;
    const timer = setTimeout(() => {
      const next = DEMO_ALERTS[alertIndex % DEMO_ALERTS.length];
      if (!shown.has(next.id)) {
        setAlert(next);
        setShown(prev => new Set([...prev, next.id]));
        // Auto-dismiss after 6 seconds
        setTimeout(() => setAlert(null), 6000);
      }
      setAlertIndex(i => i + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [alertIndex, role, shown]);

  if (!alert) return null;

  return (
    <div
      className="absolute left-3 right-3 z-50"
      style={{
        top: 12,
        animation: 'slideDown 0.3s ease-out',
      }}
    >
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
      `}</style>
      <div
        className="rounded-2xl px-4 py-3 flex items-start gap-3 shadow-2xl"
        style={{
          backgroundColor: '#1C2430',
          border: '1px solid rgba(245,166,35,0.4)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}
      >
        {/* Bell icon with pulse */}
        <div className="shrink-0 mt-0.5 relative">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(245,166,35,0.15)' }}
          >
            <Bell size={16} style={{ color: '#F5A623' }} />
          </div>
          <span
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
            style={{ backgroundColor: '#EF4444', animation: 'pulse 1s infinite' }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold mb-0.5" style={{ color: '#F5A623' }}>
            🔔 New Trip Alert!
          </p>
          <p className="text-sm font-semibold" style={{ color: '#F0F6FC' }}>
            {alert.from} → {alert.to}
          </p>
          <p className="text-xs" style={{ color: '#8B949E' }}>
            {alert.vehicle} · ₹{alert.fare.toLocaleString('en-IN')}
          </p>
          <button
            className="mt-2 text-xs font-bold px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: '#F5A623', color: '#0D1117' }}
            onClick={() => {
              setAlert(null);
              router.push('/app/driver/trips');
            }}
          >
            View Trip →
          </button>
        </div>

        {/* Close */}
        <button onClick={() => setAlert(null)} className="shrink-0 mt-0.5">
          <X size={14} style={{ color: '#8B949E' }} />
        </button>
      </div>
    </div>
  );
}
