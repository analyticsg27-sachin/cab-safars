'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, X, MapPin, Calendar, Users, ChevronRight,
  RefreshCw, SlidersHorizontal, Navigation,
} from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import AppHeader from '@/components/app/AppHeader';
import BottomNav from '@/components/app/BottomNav';
import LocationAutocomplete, { type LocationValue } from '@/components/app/LocationAutocomplete';
import TripsService from '@/lib/services/trips.service';
import type { Trip, FeedFilters } from '@/lib/services/trips.service';
import { useAppState } from '@/lib/app-state';

const IS_API_MODE = process.env.NEXT_PUBLIC_DATA_MODE === 'api';

const VEHICLE_TYPES = ['Any', 'Truck (Light)', 'Truck (Medium)', 'Truck (Heavy)', 'Mini Truck (Tata Ace)', 'Container', 'Tanker', 'Trailer', 'Pickup Van'];

function TripCard({ trip, onView }: { trip: Trip; onView: () => void }) {
  const fare = trip.expected_fare ? Number(trip.expected_fare) : null;
  return (
    <div
      className="rounded-2xl border p-4 mb-3 active:scale-[0.99] transition-transform cursor-pointer"
      style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}
      onClick={onView}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {trip.is_premium_vendor && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'rgba(245,166,35,0.12)', color: '#F5A623' }}>
              ★ Priority
            </span>
          )}
          <span className="text-xs" style={{ color: '#8B949E' }}>{trip.vehicle_type}</span>
        </div>
        <span className="text-[10px] font-mono" style={{ color: '#8B949E' }}>
          {new Date(trip.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <MapPin size={14} style={{ color: '#F5A623' }} />
        <span className="text-base font-bold" style={{ color: '#F0F6FC' }}>
          {trip.from_city} → {trip.to_city}
        </span>
      </div>

      <div className="flex gap-3 mb-3 flex-wrap text-xs" style={{ color: '#8B949E' }}>
        <span><Calendar size={10} className="inline mr-1" />{trip.trip_date}</span>
        <span>{trip.load_type}</span>
        {trip.weight_tons && <span>{trip.weight_tons}T</span>}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {fare ? (
            <span className="text-lg font-bold" style={{ color: '#F5A623' }}>
              ₹{fare.toLocaleString('en-IN')}
            </span>
          ) : (
            <span className="text-sm" style={{ color: '#8B949E' }}>Negotiable</span>
          )}
          {trip.contacts_count > 0 && (
            <span className="flex items-center gap-1 text-xs" style={{ color: '#8B949E' }}>
              <Users size={11} /> {trip.contacts_count}
            </span>
          )}
        </div>
        <button
          className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl"
          style={{ backgroundColor: '#F5A623', color: '#0D1117' }}
          onClick={(e) => { e.stopPropagation(); onView(); }}
        >
          View <ChevronRight size={12} />
        </button>
      </div>

      <div className="mt-2 text-xs" style={{ color: '#8B949E' }}>
        by {trip.vendor_name} · {trip.vendor_city}
      </div>
    </div>
  );
}

export default function FindTripsPage() {
  const router = useRouter();
  const { state } = useAppState();
  const [activeTab, setActiveTab] = useState('route');

  const [fromLoc, setFromLoc] = useState<LocationValue>({ name: '', city: '', state: '' });
  const [toLoc, setToLoc]     = useState<LocationValue>({ name: '', city: '', state: '' });
  const [vehicle, setVehicle] = useState('Any');
  const [postedToday, setPostedToday] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [trips, setTrips] = useState<Trip[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTrips = useCallback(async (p = 1) => {
    if (!IS_API_MODE) return;
    setLoading(true); setError('');
    try {
      const filters: FeedFilters = { page: p, per_page: 20 };
      if (fromLoc.city) filters.from_city = fromLoc.city;
      if (toLoc.city)   filters.to_city   = toLoc.city;
      if (vehicle !== 'Any') filters.vehicle_type = vehicle;
      if (postedToday)  filters.posted_today = '1';

      const res = await TripsService.getFeed(filters);
      if (p === 1) setTrips(res.data ?? []);
      else setTrips(prev => [...prev, ...(res.data ?? [])]);
      setTotal((res as { pagination?: { total?: number } }).pagination?.total ?? 0);
      setTotalPages((res as { pagination?: { total_pages?: number } }).pagination?.total_pages ?? 1);
      setPage(p);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load trips');
    } finally { setLoading(false); }
  }, [fromLoc.city, toLoc.city, vehicle, postedToday]);

  useEffect(() => { fetchTrips(1); }, [fetchTrips]);

  function handleTab(tab: string) {
    setActiveTab(tab);
    const paths: Record<string, string> = {
      home: '/app/vendor/home', trips: '/app/vendor/trips',
      post: '/app/vendor/post', route: '/app/vendor/route', profile: '/app/profile',
    };
    if (paths[tab]) router.push(paths[tab]);
  }

  function viewTrip(tripId: string) {
    router.push(`/app/driver/trip/${tripId}`);
  }

  const sameCityWarning = !IS_API_MODE && fromLoc.city && toLoc.city &&
    fromLoc.city.trim().toLowerCase() === toLoc.city.trim().toLowerCase();

  // In demo mode — show all trips filtered by city
  const demoTrips: Trip[] = state.trips.filter((t) => {
    if (fromLoc.city && !t.fromCity.toLowerCase().includes(fromLoc.city.toLowerCase())) return false;
    if (toLoc.city && !t.toCity.toLowerCase().includes(toLoc.city.toLowerCase())) return false;
    return true;
  }).map((t) => ({
    id: t.id,
    from_city: t.fromCity,
    to_city: t.toCity,
    from_state: t.fromState ?? 'Gujarat',
    to_state: t.toState ?? 'Gujarat',
    vehicle_type: t.vehicleType,
    load_type: t.loadType ?? '',
    trip_date: t.tripDate,
    trip_time: '',
    expected_fare: t.expectedFare ?? null,
    contacts_count: t.contactsCount,
    is_premium_vendor: false,
    is_contact_locked: false,
    contacts_count_x: 0,
    vendor_name: 'Your Trip',
    vendor_city: t.fromCity,
    created_at: new Date().toISOString(),
    status: t.status,
  } as unknown as Trip));
  const displayTrips = IS_API_MODE ? trips : demoTrips;

  return (
    <AppShell>
      <AppHeader title="Find Trips" />

      <main className="flex-1 overflow-y-auto pb-24">
        {/* Filters */}
        <div className="px-4 pt-4 pb-2 space-y-2">
          <LocationAutocomplete value={fromLoc.city} onChange={setFromLoc}
            placeholder="From city…" pinColor="#22C55E" />
          <LocationAutocomplete value={toLoc.city} onChange={setToLoc}
            placeholder="To city…" pinColor="#EF4444" />

          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(f => !f)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium"
              style={{ background: showFilters ? '#F5A623' : '#21262D', color: showFilters ? '#0D1117' : '#8B949E', border: '1px solid #30363D' }}>
              <SlidersHorizontal size={13} /> Filters
            </button>

            <button
              onClick={() => router.push('/app/nearby')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium"
              style={{ background: '#21262D', color: '#8B949E', border: '1px solid #30363D' }}>
              <Navigation size={13} /> Nearby
            </button>

            <button
              onClick={() => fetchTrips(1)}
              className="ml-auto flex items-center justify-center w-9 h-9 rounded-xl"
              style={{ background: '#21262D', border: '1px solid #30363D' }}>
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} style={{ color: '#8B949E' }} />
            </button>
          </div>

          {showFilters && (
            <div className="flex flex-col gap-2 pt-1">
              <div>
                <label className="text-xs text-[#8B949E] mb-1 block">Vehicle Type</label>
                <div className="flex gap-1.5 flex-wrap">
                  {['Any', 'Truck (Light)', 'Truck (Medium)', 'Truck (Heavy)', 'Container', 'Mini Truck (Tata Ace)'].map(v => (
                    <button key={v} onClick={() => setVehicle(v)}
                      className="px-2.5 py-1 rounded-lg text-xs"
                      style={{ background: vehicle === v ? '#F5A623' : '#21262D', color: vehicle === v ? '#0D1117' : '#8B949E', border: vehicle === v ? 'none' : '1px solid #30363D' }}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs" style={{ color: '#8B949E' }}>
                <input type="checkbox" checked={postedToday} onChange={e => setPostedToday(e.target.checked)}
                  className="rounded" style={{ accentColor: '#F5A623' }} />
                Posted today only
              </label>
            </div>
          )}
        </div>

        {/* Same-city warning */}
        {sameCityWarning && (
          <div className="mx-4 mb-1 px-3 py-2 rounded-xl" style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.3)' }}>
            <span className="text-xs" style={{ color: '#F5A623' }}>⚠ Pickup and destination are the same city</span>
          </div>
        )}

        {/* Results count */}
        <div className="px-4 pb-2">
          <p className="text-xs" style={{ color: '#8B949E' }}>
            {IS_API_MODE ? `${total} trip${total !== 1 ? 's' : ''} found` : `${demoTrips.length} trips (demo)`}
          </p>
        </div>

        {/* Trip list */}
        <div className="px-4">
          {loading && trips.length === 0 ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center py-16 gap-3">
              <p className="text-sm" style={{ color: '#EF4444' }}>{error}</p>
              <button onClick={() => fetchTrips(1)} className="text-xs" style={{ color: '#F5A623' }}>Retry</button>
            </div>
          ) : displayTrips.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#21262D' }}>
                <Search size={28} style={{ color: '#8B949E' }} />
              </div>
              <p className="font-semibold mb-1" style={{ color: '#F0F6FC' }}>No trips found</p>
              <p className="text-sm" style={{ color: '#8B949E' }}>Try adjusting your filters</p>
              <button onClick={() => { setFromLoc({ name: '', city: '', state: '' }); setToLoc({ name: '', city: '', state: '' }); setVehicle('Any'); }}
                className="mt-4 text-sm font-semibold" style={{ color: '#F5A623' }}>
                Clear filters
              </button>
            </div>
          ) : (
            <>
              {displayTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} onView={() => viewTrip(trip.id)} />
              ))}
              {IS_API_MODE && page < totalPages && (
                <button onClick={() => fetchTrips(page + 1)} disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-medium mb-3"
                  style={{ background: '#21262D', color: '#F5A623', border: '1px solid #30363D' }}>
                  {loading ? 'Loading…' : 'Load More'}
                </button>
              )}
            </>
          )}
        </div>
      </main>

      <BottomNav role="vendor" activeTab={activeTab} onTabChange={handleTab}
        unreadNotifications={state.unreadNotifications} />
    </AppShell>
  );
}
