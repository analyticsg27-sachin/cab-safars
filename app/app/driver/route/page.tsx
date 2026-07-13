'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Navigation, MapPin, Calendar, Clock, Sliders, ChevronRight,
  Truck, Crown, Lock, X, CheckCircle,
} from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import AppHeader from '@/components/app/AppHeader';
import BottomNav from '@/components/app/BottomNav';

// ─── Demo config ─────────────────────────────────────────────────────────────
const IS_PREMIUM_DRIVER = true;

// ─── Data ─────────────────────────────────────────────────────────────────────
const AVAILABLE_TRIPS = [
  {
    id: 'TRP12563', vendorName: 'Rajesh Patel', vendorPhone: '+91 98250 11234',
    fromCity: 'Ahmedabad', toCity: 'Baroda',
    vehicleType: '1.5 Ton', loadType: 'Open Body', tripDate: '2025-07-16', tripTime: '10:00 AM',
    expectedFare: 8500, weightTons: 1.5, contactsCount: 5, isPremiumVendor: true,
    createdAt: '2025-07-14T08:00:00Z',
  },
  {
    id: 'TRP12561', vendorName: 'Mohan Verma', vendorPhone: '+91 97140 33456',
    fromCity: 'Vadodara', toCity: 'Ahmedabad',
    vehicleType: 'Mini Truck', loadType: 'Agricultural', tripDate: '2025-07-15', tripTime: '07:00 AM',
    expectedFare: 4500, weightTons: 2, contactsCount: 1, isPremiumVendor: false,
    createdAt: '2025-07-13T09:00:00Z',
  },
  {
    id: 'TRP12559', vendorName: 'Ravi Sharma', vendorPhone: '+91 91580 77890',
    fromCity: 'Anand', toCity: 'Vadodara',
    vehicleType: 'Mini Truck (Tata Ace)', loadType: 'Agricultural', tripDate: '2025-07-16', tripTime: '07:00 AM',
    expectedFare: 3500, weightTons: 2, contactsCount: 0, isPremiumVendor: false,
    createdAt: '2025-07-15T10:00:00Z',
  },
  {
    id: 'TRP12556', vendorName: 'Meena Iyer', vendorPhone: '+91 90440 44567',
    fromCity: 'Ahmedabad', toCity: 'Surat',
    vehicleType: 'Truck (Light)', loadType: 'Textile', tripDate: '2025-07-16', tripTime: '11:00 AM',
    expectedFare: 6500, weightTons: 3, contactsCount: 4, isPremiumVendor: true,
    createdAt: '2025-07-15T08:00:00Z',
  },
];

// Trips that match Ahmedabad → Vadodara route
const MATCHED_TRIPS_WITH_REASON = [
  { tripId: 'TRP12563', reason: 'At Destination', reasonColor: '#22C55E', reasonBg: 'rgba(34,197,94,0.12)' },
  { tripId: 'TRP12559', reason: '12 km Nearby', reasonColor: '#2D6BE4', reasonBg: 'rgba(45,107,228,0.12)' },
  { tripId: 'TRP12561', reason: 'Return Route', reasonColor: '#F5A623', reasonBg: 'rgba(245,166,35,0.12)' },
  { tripId: 'TRP12556', reason: 'Popular Route', reasonColor: '#A855F7', reasonBg: 'rgba(168,85,247,0.12)' },
];

const EXPIRY_OPTIONS = ['Today only', 'Next 24 hours', 'Next 3 days', 'Next 7 days'];

interface ActiveRoute {
  fromCity: string;
  toCity: string;
  date: string;
  time: string;
  radius: number;
  expiry: string;
}

// ─── Matched trip card ────────────────────────────────────────────────────────
function MatchedTripCard({ tripId, reason, reasonColor, reasonBg }: (typeof MATCHED_TRIPS_WITH_REASON)[0]) {
  const router = useRouter();
  const trip = AVAILABLE_TRIPS.find((t) => t.id === tripId);
  if (!trip) return null;

  return (
    <div
      className="rounded-2xl border p-4 mb-3"
      style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: reasonBg, color: reasonColor }}
        >
          {reason}
        </span>
        {trip.isPremiumVendor && (
          <span
            className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: 'rgba(245,166,35,0.12)', color: '#F5A623' }}
          >
            <Crown size={9} /> Premium
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mb-1">
        <MapPin size={13} style={{ color: '#F5A623' }} />
        <span className="text-base font-bold" style={{ color: '#F0F6FC' }}>
          {trip.fromCity} → {trip.toCity}
        </span>
      </div>
      <p className="text-xs mb-3 pl-5" style={{ color: '#8B949E' }}>
        {trip.tripDate} · {trip.tripTime} · {trip.vehicleType}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-base font-bold" style={{ color: '#F5A623' }}>
          ₹{trip.expectedFare.toLocaleString('en-IN')}
        </span>
        {IS_PREMIUM_DRIVER ? (
          <button
            className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl"
            style={{ backgroundColor: '#F5A623', color: '#0D1117' }}
            onClick={() => router.push(`/app/driver/trip/${trip.id}`)}
          >
            View <ChevronRight size={11} />
          </button>
        ) : (
          <button
            className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl"
            style={{ backgroundColor: '#21262D', color: '#8B949E', border: '1px solid #30363D' }}
            onClick={() => router.push('/app/subscription')}
          >
            <Lock size={11} /> Unlock
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SmartRoutePage() {
  const router = useRouter();
  const [activeRoute, setActiveRoute] = useState<ActiveRoute | null>(null);
  const [form, setForm] = useState({
    fromCity: '',
    toCity: '',
    date: '',
    time: '',
    radius: 50,
    expiry: 'Next 24 hours',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleActivate() {
    const e: Record<string, string> = {};
    if (!form.fromCity.trim()) e.fromCity = 'Enter from city';
    if (!form.toCity.trim()) e.toCity = 'Enter to city';
    if (!form.date) e.date = 'Select date';
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setActiveRoute({ ...form });
  }

  return (
    <AppShell>
      <AppHeader title="Smart Route" />

      <main className="flex-1 overflow-y-auto pb-24">
        {!activeRoute ? (
          /* ── State A: No active route ── */
          <div className="px-4 pt-6">
            {/* Illustration */}
            <div className="flex justify-center mb-6">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(245,166,35,0.1)', border: '2px solid rgba(245,166,35,0.2)' }}
              >
                <Navigation size={36} style={{ color: '#F5A623' }} />
              </div>
            </div>

            <h2 className="text-xl font-bold text-center mb-2" style={{ color: '#F0F6FC' }}>
              Set Your Active Route
            </h2>
            <p className="text-sm text-center mb-6" style={{ color: '#8B949E' }}>
              Tell us where you&apos;re travelling and we&apos;ll find matching trips for you
            </p>

            {/* Form */}
            <div className="space-y-3">
              {/* From City */}
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#8B949E' }}>From City</label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8B949E' }} />
                  <input
                    type="text"
                    placeholder="e.g. Ahmedabad"
                    value={form.fromCity}
                    onChange={(e) => setForm((f) => ({ ...f, fromCity: e.target.value }))}
                    className="w-full pl-9 pr-4 py-3 rounded-xl text-sm"
                    style={{
                      backgroundColor: '#21262D',
                      border: `1px solid ${errors.fromCity ? '#EF4444' : '#30363D'}`,
                      color: '#F0F6FC',
                      outline: 'none',
                    }}
                  />
                </div>
                {errors.fromCity && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.fromCity}</p>}
              </div>

              {/* To City */}
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#8B949E' }}>To City</label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#F5A623' }} />
                  <input
                    type="text"
                    placeholder="e.g. Vadodara"
                    value={form.toCity}
                    onChange={(e) => setForm((f) => ({ ...f, toCity: e.target.value }))}
                    className="w-full pl-9 pr-4 py-3 rounded-xl text-sm"
                    style={{
                      backgroundColor: '#21262D',
                      border: `1px solid ${errors.toCity ? '#EF4444' : '#30363D'}`,
                      color: '#F0F6FC',
                      outline: 'none',
                    }}
                  />
                </div>
                {errors.toCity && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.toCity}</p>}
              </div>

              {/* Date + Time row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#8B949E' }}>Travel Date</label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8B949E' }} />
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                      className="w-full pl-9 pr-2 py-3 rounded-xl text-sm"
                      style={{
                        backgroundColor: '#21262D',
                        border: `1px solid ${errors.date ? '#EF4444' : '#30363D'}`,
                        color: '#F0F6FC',
                        outline: 'none',
                        colorScheme: 'dark',
                      }}
                    />
                  </div>
                  {errors.date && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.date}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#8B949E' }}>Travel Time</label>
                  <div className="relative">
                    <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8B949E' }} />
                    <input
                      type="time"
                      value={form.time}
                      onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                      className="w-full pl-9 pr-2 py-3 rounded-xl text-sm"
                      style={{
                        backgroundColor: '#21262D',
                        border: '1px solid #30363D',
                        color: '#F0F6FC',
                        outline: 'none',
                        colorScheme: 'dark',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Radius slider */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium flex items-center gap-1.5" style={{ color: '#8B949E' }}>
                    <Sliders size={12} /> Search Radius
                  </label>
                  <span className="text-xs font-bold" style={{ color: '#F5A623' }}>{form.radius} km</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={10}
                  value={form.radius}
                  onChange={(e) => setForm((f) => ({ ...f, radius: Number(e.target.value) }))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: '#F5A623', backgroundColor: '#30363D' }}
                />
                <div className="flex justify-between text-xs mt-1" style={{ color: '#8B949E' }}>
                  <span>10 km</span><span>100 km</span>
                </div>
              </div>

              {/* Route expiry */}
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#8B949E' }}>Route Expiry</label>
                <select
                  value={form.expiry}
                  onChange={(e) => setForm((f) => ({ ...f, expiry: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-sm"
                  style={{
                    backgroundColor: '#21262D',
                    border: '1px solid #30363D',
                    color: '#F0F6FC',
                    outline: 'none',
                    colorScheme: 'dark',
                  }}
                >
                  {EXPIRY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              {/* Activate button */}
              <button
                className="w-full h-14 rounded-xl font-semibold text-base mt-2"
                style={{ backgroundColor: '#F5A623', color: '#0D1117' }}
                onClick={handleActivate}
              >
                Activate Route
              </button>
            </div>
          </div>
        ) : (
          /* ── State B: Active route ── */
          <div className="px-4 pt-5">
            {/* Active route card */}
            <div
              className="rounded-2xl border p-4 mb-5"
              style={{ backgroundColor: '#161B22', borderColor: 'rgba(34,197,94,0.3)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: 'rgba(34,197,94,0.15)', color: '#22C55E' }}
                >
                  <CheckCircle size={10} /> ACTIVE ROUTE
                </span>
                <button
                  className="text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}
                  onClick={() => setActiveRoute(null)}
                >
                  Deactivate
                </button>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <Navigation size={15} style={{ color: '#F5A623' }} />
                <span className="text-xl font-bold" style={{ color: '#F0F6FC' }}>
                  {activeRoute.fromCity} → {activeRoute.toCity}
                </span>
              </div>

              <div className="flex flex-wrap gap-3 mt-2">
                {activeRoute.date && (
                  <span className="text-xs" style={{ color: '#8B949E' }}>
                    <Calendar size={10} className="inline mr-1" />{activeRoute.date}
                  </span>
                )}
                <span className="text-xs" style={{ color: '#8B949E' }}>
                  <Sliders size={10} className="inline mr-1" />{activeRoute.radius} km radius
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: 'rgba(245,166,35,0.12)', color: '#F5A623' }}
                >
                  {activeRoute.expiry}
                </span>
              </div>
            </div>

            {/* Matched trips */}
            <div className="flex items-center gap-2 mb-4">
              <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#8B949E' }}>
                Matching Trips
              </p>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'rgba(245,166,35,0.15)', color: '#F5A623' }}
              >
                {MATCHED_TRIPS_WITH_REASON.length}
              </span>
            </div>

            {MATCHED_TRIPS_WITH_REASON.length === 0 ? (
              <div className="text-center py-12">
                <p className="font-semibold mb-1" style={{ color: '#F0F6FC' }}>No trips yet</p>
                <p className="text-sm" style={{ color: '#8B949E' }}>
                  No trips found for this route right now. We&apos;ll notify you when new trips match.
                </p>
              </div>
            ) : (
              MATCHED_TRIPS_WITH_REASON.map((m) => (
                <MatchedTripCard key={m.tripId} {...m} />
              ))
            )}
          </div>
        )}
      </main>

      <BottomNav role="driver" activeTab="route" onTabChange={(tab) => {
        const paths: Record<string, string> = {
          home: '/app/driver/home',
          trips: '/app/driver/trips',
          route: '/app/driver/route',
          notifications: '/app/notifications',
          profile: '/app/profile',
        };
        if (paths[tab]) router.push(paths[tab]);
      }} />
    </AppShell>
  );
}
