'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Navigation, MapPin, Calendar, Clock, Sliders, ChevronRight,
  Crown, Lock, CheckCircle, Navigation2,
} from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import AppHeader from '@/components/app/AppHeader';
import BottomNav from '@/components/app/BottomNav';
import LocationAutocomplete, { LocationValue } from '@/components/app/LocationAutocomplete';
import { useAppState } from '@/lib/app-state';

const EXPIRY_OPTIONS = ['Today only', 'Next 24 hours', 'Next 3 days', 'Next 7 days'];

interface ActiveRoute {
  fromCity: string;
  toCity: string;
  date: string;
  time: string;
  radius: number;
  expiry: string;
}

function MatchedTripCard({
  trip,
  reason,
  reasonColor,
  reasonBg,
  isPremium,
  onView,
}: {
  trip: { id: string; fromCity: string; toCity: string; tripDate: string; tripTime: string; vehicleType: string; expectedFare?: number; isPremiumVendor: boolean };
  reason: string;
  reasonColor: string;
  reasonBg: string;
  isPremium: boolean;
  onView: () => void;
}) {
  return (
    <div className="rounded-2xl border p-4 mb-3" style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: reasonBg, color: reasonColor }}>
          {reason}
        </span>
        {trip.isPremiumVendor && (
          <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(245,166,35,0.12)', color: '#F5A623' }}>
            <Crown size={9} /> Premium
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mb-1">
        <MapPin size={13} style={{ color: '#F5A623' }} />
        <span className="text-base font-bold" style={{ color: '#F0F6FC' }}>
          {trip.fromCity} &rarr; {trip.toCity}
        </span>
      </div>
      <p className="text-xs mb-3 pl-5" style={{ color: '#8B949E' }}>
        {trip.tripDate} &middot; {trip.tripTime} &middot; {trip.vehicleType}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-base font-bold" style={{ color: '#F5A623' }}>
          {trip.expectedFare != null ? `₹${trip.expectedFare.toLocaleString('en-IN')}` : 'Negotiable'}
        </span>
        {isPremium ? (
          <button
            className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl"
            style={{ backgroundColor: '#F5A623', color: '#0D1117' }}
            onClick={onView}
          >
            View <ChevronRight size={11} />
          </button>
        ) : (
          <button
            className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl"
            style={{ backgroundColor: '#21262D', color: '#8B949E', border: '1px solid #30363D' }}
            onClick={onView}
          >
            <Lock size={11} /> Unlock
          </button>
        )}
      </div>
    </div>
  );
}

export default function SmartRoutePage() {
  const router = useRouter();
  const { state } = useAppState();
  const isPremium = state.currentUser?.isPremium ?? false;

  const [tab, setTab] = useState<'route' | 'nearby'>('route');
  const [activeRoute, setActiveRoute] = useState<ActiveRoute | null>(null);
  const [form, setForm] = useState({ fromCity: '', toCity: '', date: '', time: '', radius: 50, expiry: 'Next 24 hours' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Nearby tab state
  const [nearbyCity, setNearbyCity] = useState('');
  const [nearbyRadius, setNearbyRadius] = useState(50);
  const [nearbyErrors, setNearbyErrors] = useState<Record<string, string>>({});

  function handleActivate() {
    const e: Record<string, string> = {};
    if (!form.fromCity.trim()) e.fromCity = 'Enter from city';
    if (!form.toCity.trim()) e.toCity = 'Enter to city';
    if (form.fromCity.trim() && form.toCity.trim() && form.fromCity.trim().toLowerCase() === form.toCity.trim().toLowerCase()) {
      e.toCity = 'To city must be different from From city';
    }
    if (!form.date) e.date = 'Select date';
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setActiveRoute({ ...form });
  }

  // Use app state trips for matching (real IDs)
  const allTrips = state.trips.filter((t) => t.status === 'open');
  const matchedTrips = activeRoute
    ? allTrips.filter((t) =>
        t.fromCity.toLowerCase().includes(activeRoute.fromCity.toLowerCase()) ||
        t.toCity.toLowerCase().includes(activeRoute.toCity.toLowerCase())
      ).slice(0, 6)
    : [];

  const reasons = ['At Destination', '12 km Nearby', 'Return Route', 'Popular Route', 'En Route', 'Nearby'];
  const reasonColors = ['#22C55E', '#2D6BE4', '#F5A623', '#A855F7', '#06B6D4', '#8B949E'];
  const reasonBgs = [
    'rgba(34,197,94,0.12)', 'rgba(45,107,228,0.12)', 'rgba(245,166,35,0.12)',
    'rgba(168,85,247,0.12)', 'rgba(6,182,212,0.12)', 'rgba(139,148,158,0.12)',
  ];

  // Nearby trips: filter by city name match
  const nearbyMatches = nearbyCity
    ? allTrips.filter((t) =>
        t.fromCity.toLowerCase().includes(nearbyCity.toLowerCase()) ||
        t.toCity.toLowerCase().includes(nearbyCity.toLowerCase())
      ).slice(0, 8)
    : allTrips.slice(0, 6);

  return (
    <AppShell>
      <AppHeader title="Smart Route" />

      {/* Tabs */}
      <div className="flex gap-1 mx-4 mt-3 mb-1 p-1 rounded-2xl" style={{ backgroundColor: '#161B22', border: '1px solid #30363D' }}>
        {(['route', 'nearby'] as const).map((t) => (
          <button
            key={t}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-colors"
            style={{
              backgroundColor: tab === t ? '#F5A623' : 'transparent',
              color: tab === t ? '#0D1117' : '#8B949E',
            }}
            onClick={() => setTab(t)}
          >
            {t === 'route' ? 'Route Match' : 'Nearby'}
          </button>
        ))}
      </div>

      <main className="flex-1 overflow-y-auto pb-24">
        {tab === 'route' ? (
          // ── Route Match Tab ──────────────────────────────────────────────────
          <div className="px-4 pt-4">
            {!activeRoute ? (
              <>
                <div className="flex justify-center mb-5">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(245,166,35,0.1)', border: '2px solid rgba(245,166,35,0.2)' }}>
                    <Navigation size={30} style={{ color: '#F5A623' }} />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-center mb-1" style={{ color: '#F0F6FC' }}>Set Your Active Route</h2>
                <p className="text-sm text-center mb-5" style={{ color: '#8B949E' }}>
                  Tell us where you&apos;re travelling and we&apos;ll find matching trips
                </p>

                <div className="space-y-3">
                  <LocationAutocomplete
                    label="From City"
                    value={form.fromCity}
                    onChange={(loc: LocationValue) => setForm((f) => ({ ...f, fromCity: loc.city }))}
                    placeholder="e.g. Ahmedabad"
                    pinColor="#8B949E"
                    error={errors.fromCity}
                  />
                  <LocationAutocomplete
                    label="To City"
                    value={form.toCity}
                    onChange={(loc: LocationValue) => setForm((f) => ({ ...f, toCity: loc.city }))}
                    placeholder="e.g. Vadodara"
                    pinColor="#F5A623"
                    error={errors.toCity}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: '#8B949E' }}>Travel Date</label>
                      <div className="relative">
                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8B949E' }} />
                        <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                          className="w-full pl-9 pr-2 py-3 rounded-xl text-sm"
                          style={{ backgroundColor: '#21262D', border: `1px solid ${errors.date ? '#EF4444' : '#30363D'}`, color: '#F0F6FC', outline: 'none', colorScheme: 'dark' }} />
                      </div>
                      {errors.date && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.date}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: '#8B949E' }}>Travel Time</label>
                      <div className="relative">
                        <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8B949E' }} />
                        <input type="time" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                          className="w-full pl-9 pr-2 py-3 rounded-xl text-sm"
                          style={{ backgroundColor: '#21262D', border: '1px solid #30363D', color: '#F0F6FC', outline: 'none', colorScheme: 'dark' }} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium flex items-center gap-1.5" style={{ color: '#8B949E' }}>
                        <Sliders size={12} /> Search Radius
                      </label>
                      <span className="text-xs font-bold" style={{ color: '#F5A623' }}>{form.radius} km</span>
                    </div>
                    <input type="range" min={10} max={100} step={10} value={form.radius}
                      onChange={(e) => setForm((f) => ({ ...f, radius: Number(e.target.value) }))}
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{ accentColor: '#F5A623', backgroundColor: '#30363D' }} />
                    <div className="flex justify-between text-xs mt-1" style={{ color: '#8B949E' }}>
                      <span>10 km</span><span>100 km</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: '#8B949E' }}>Route Expiry</label>
                    <select value={form.expiry} onChange={(e) => setForm((f) => ({ ...f, expiry: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl text-sm"
                      style={{ backgroundColor: '#21262D', border: '1px solid #30363D', color: '#F0F6FC', outline: 'none', colorScheme: 'dark' }}>
                      {EXPIRY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>

                  <button className="w-full h-14 rounded-xl font-semibold text-base mt-2"
                    style={{ backgroundColor: '#F5A623', color: '#0D1117' }}
                    onClick={handleActivate}>
                    Activate Route
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Active route card */}
                <div className="rounded-2xl border p-4 mb-5" style={{ backgroundColor: '#161B22', borderColor: 'rgba(34,197,94,0.3)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: 'rgba(34,197,94,0.15)', color: '#22C55E' }}>
                      <CheckCircle size={10} /> ACTIVE ROUTE
                    </span>
                    <button className="text-xs font-semibold px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}
                      onClick={() => setActiveRoute(null)}>
                      Deactivate
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <Navigation size={15} style={{ color: '#F5A623' }} />
                    <span className="text-xl font-bold" style={{ color: '#F0F6FC' }}>
                      {activeRoute.fromCity} &rarr; {activeRoute.toCity}
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
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(245,166,35,0.12)', color: '#F5A623' }}>
                      {activeRoute.expiry}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#8B949E' }}>Matching Trips</p>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(245,166,35,0.15)', color: '#F5A623' }}>
                    {matchedTrips.length}
                  </span>
                </div>

                {matchedTrips.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="font-semibold mb-1" style={{ color: '#F0F6FC' }}>No trips yet</p>
                    <p className="text-sm" style={{ color: '#8B949E' }}>No trips found for this route. We&apos;ll notify you when new ones match.</p>
                  </div>
                ) : (
                  matchedTrips.map((trip, i) => (
                    <MatchedTripCard
                      key={trip.id}
                      trip={{ id: trip.id, fromCity: trip.fromCity, toCity: trip.toCity, tripDate: trip.tripDate, tripTime: trip.tripTime, vehicleType: trip.vehicleType, expectedFare: trip.expectedFare, isPremiumVendor: trip.isPremiumVendor }}
                      reason={reasons[i % reasons.length]}
                      reasonColor={reasonColors[i % reasonColors.length]}
                      reasonBg={reasonBgs[i % reasonBgs.length]}
                      isPremium={isPremium}
                      onView={() => router.push(`/app/driver/trip/${trip.id}`)}
                    />
                  ))
                )}
              </>
            )}
          </div>
        ) : (
          // ── Nearby Tab ───────────────────────────────────────────────────────
          <div className="px-4 pt-4">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(45,107,228,0.1)', border: '2px solid rgba(45,107,228,0.2)' }}>
                <Navigation2 size={26} style={{ color: '#2D6BE4' }} />
              </div>
            </div>
            <h2 className="text-lg font-bold text-center mb-1" style={{ color: '#F0F6FC' }}>Nearby Trips</h2>
            <p className="text-sm text-center mb-5" style={{ color: '#8B949E' }}>
              Enter your current city to find trips nearby
            </p>

            <LocationAutocomplete
              label="Your Location"
              value={nearbyCity}
              onChange={(loc: LocationValue) => setNearbyCity(loc.city)}
              placeholder="e.g. Ahmedabad"
              pinColor="#2D6BE4"
              error={nearbyErrors.city}
            />

            <div className="mt-3 mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium flex items-center gap-1.5" style={{ color: '#8B949E' }}>
                  <Sliders size={12} /> Search Radius
                </label>
                <span className="text-xs font-bold" style={{ color: '#2D6BE4' }}>{nearbyRadius} km</span>
              </div>
              <input type="range" min={10} max={100} step={10} value={nearbyRadius}
                onChange={(e) => setNearbyRadius(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: '#2D6BE4', backgroundColor: '#30363D' }} />
              <div className="flex justify-between text-xs mt-1" style={{ color: '#8B949E' }}>
                <span>10 km</span><span>100 km</span>
              </div>
            </div>

            {nearbyMatches.length === 0 ? (
              <div className="text-center py-10">
                <p className="font-semibold mb-1" style={{ color: '#F0F6FC' }}>No trips found</p>
                <p className="text-sm" style={{ color: '#8B949E' }}>Try a different city or increase the radius</p>
              </div>
            ) : (
              <>
                <p className="text-xs mb-3" style={{ color: '#8B949E' }}>{nearbyMatches.length} trips found near {nearbyCity || 'your area'}</p>
                {nearbyMatches.map((trip) => (
                  <div
                    key={trip.id}
                    className="rounded-2xl border p-4 mb-3 cursor-pointer active:scale-[0.99] transition-transform"
                    style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}
                    onClick={() => router.push(`/app/driver/trip/${trip.id}`)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(45,107,228,0.15)', color: '#2D6BE4' }}>
                        Nearby
                      </span>
                      <span className="text-xs" style={{ color: '#8B949E' }}>{trip.vehicleType}</span>
                    </div>
                    <div className="flex items-center gap-2 my-2">
                      <MapPin size={14} style={{ color: '#F5A623' }} />
                      <span className="text-base font-bold" style={{ color: '#F0F6FC' }}>
                        {trip.fromCity} &rarr; {trip.toCity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: '#8B949E' }}>
                        <Calendar size={10} className="inline mr-1" />{trip.tripDate}
                      </span>
                      {trip.expectedFare != null
                        ? <span className="text-sm font-bold" style={{ color: '#F5A623' }}>{'₹'}{trip.expectedFare.toLocaleString('en-IN')}</span>
                        : <span className="text-xs" style={{ color: '#8B949E' }}>Negotiable</span>}
                    </div>
                    <p className="text-xs mt-1" style={{ color: '#8B949E' }}>by {trip.vendorName}</p>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </main>

      <BottomNav role="driver" activeTab="route" onTabChange={(t) => {
        const paths: Record<string, string> = { home: '/app/driver/home', trips: '/app/driver/trips', route: '/app/driver/route', notifications: '/app/notifications', profile: '/app/profile' };
        if (paths[t]) router.push(paths[t]);
      }} />
    </AppShell>
  );
}
