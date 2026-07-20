'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Truck, Users, MapPin, Plus, ChevronRight, RefreshCw, RotateCcw,
} from 'lucide-react';
import type { AppTrip } from '@/lib/app-types';
import { useAppState } from '@/lib/app-state';
import AppShell from '@/components/app/AppShell';
import BottomNav from '@/components/app/BottomNav';
import TripsService from '@/lib/services/trips.service';
import type { Trip } from '@/lib/services/trips.service';

const IS_API_MODE = process.env.NEXT_PUBLIC_DATA_MODE === 'api';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function StatusBadge({ status }: { status?: string }) {
  const isActive = status === 'active' || status === 'open';
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
      style={{
        background: isActive ? 'rgba(34,197,94,0.15)' : 'rgba(139,148,158,0.15)',
        color: isActive ? '#22C55E' : '#8B949E',
        border: isActive ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(139,148,158,0.2)',
      }}>
      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />}
      {isActive ? 'Active' : (status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown')}
    </span>
  );
}

function ApiTripCard({ trip, onRepost }: { trip: Trip; onRepost: (id: string) => void }) {
  const router = useRouter();
  const fare = trip.expected_fare ? Number(trip.expected_fare) : null;
  const isClosed = trip.status !== 'active';

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: '#161B22', borderColor: '#30363D' }}>
      {!isClosed && <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg,#F5A623,transparent)' }} />}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: !isClosed ? 'rgba(245,166,35,0.15)' : 'rgba(139,148,158,0.1)' }}>
              <MapPin size={16} color={!isClosed ? '#F5A623' : '#8B949E'} />
            </div>
            <span className="text-base font-semibold text-[#F0F6FC] truncate">
              {trip.from_city} → {trip.to_city}
            </span>
          </div>
          <StatusBadge status={trip.status} />
        </div>

        <div className="flex items-center gap-3 text-sm text-[#8B949E] ml-10">
          <span>{formatDate(trip.trip_date)}</span>
          <span className="w-1 h-1 rounded-full bg-[#30363D]" />
          <span className="truncate">{trip.vehicle_type}</span>
          {trip.load_type && (<><span className="w-1 h-1 rounded-full bg-[#30363D]" /><span className="truncate">{trip.load_type}</span></>)}
        </div>

        <div className="flex items-center justify-between ml-10">
          <div className="flex items-center gap-1.5 text-sm text-[#8B949E]">
            <Users size={14} />
            <span>{trip.contacts_count ?? 0} contacted</span>
          </div>
          <div className="flex items-center gap-2">
            {fare && <span className="text-sm font-semibold text-[#F5A623]">₹{fare.toLocaleString('en-IN')}</span>}
          </div>
        </div>

        <div className="flex gap-2 ml-10">
          <button
            onClick={() => router.push(`/app/vendor/trip/${trip.id}`)}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg"
            style={{ background: '#21262D', color: '#F0F6FC', border: '1px solid #30363D' }}>
            View <ChevronRight size={11} />
          </button>
          {isClosed && (
            <button
              onClick={() => onRepost(trip.id)}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(245,166,35,0.15)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.3)' }}>
              <RotateCcw size={11} /> Repost
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function LocalTripCard({ trip, onClick }: { trip: AppTrip; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full text-left rounded-2xl border active:scale-[0.98] transition-transform overflow-hidden"
      style={{ background: '#161B22', borderColor: '#30363D' }}>
      {trip.status === 'open' && <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg,#F5A623,transparent)' }} />}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: trip.status === 'open' ? 'rgba(245,166,35,0.15)' : 'rgba(139,148,158,0.1)' }}>
              <MapPin size={16} color={trip.status === 'open' ? '#F5A623' : '#8B949E'} />
            </div>
            <span className="text-base font-semibold text-[#F0F6FC] truncate">
              {trip.fromCity} → {trip.toCity}
            </span>
          </div>
          <StatusBadge status={trip.status} />
        </div>
        <div className="flex items-center gap-3 text-sm text-[#8B949E] ml-10">
          <span>{formatDate(trip.tripDate)}</span>
          <span className="w-1 h-1 rounded-full bg-[#30363D]" />
          <span className="truncate">{trip.vehicleType}</span>
        </div>
        <div className="flex items-center justify-between ml-10">
          <div className="flex items-center gap-1.5 text-sm text-[#8B949E]">
            <Users size={14} /><span>{trip.contactsCount} contacted</span>
          </div>
          {trip.expectedFare && <span className="text-sm font-semibold text-[#F5A623]">₹{trip.expectedFare.toLocaleString('en-IN')}</span>}
        </div>
      </div>
    </button>
  );
}

function EmptyState({ tab, onPost }: { tab: string; onPost: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(245,166,35,0.1)' }}>
        <Truck size={28} color="#F5A623" />
      </div>
      <div>
        <p className="text-base font-semibold text-[#F0F6FC]">{tab === 'active' ? 'No active trips' : 'No closed trips'}</p>
        <p className="text-sm text-[#8B949E] mt-1.5 leading-relaxed">
          {tab === 'active' ? 'Post a trip to start finding drivers' : 'Closed trips appear here — repost any time'}
        </p>
      </div>
      {tab === 'active' && (
        <button onClick={onPost} className="px-6 py-3 rounded-xl text-sm font-semibold mt-1"
          style={{ background: '#F5A623', color: '#0D1117' }}>
          Post New Trip
        </button>
      )}
    </div>
  );
}

export default function VendorTripsPage() {
  const router = useRouter();
  const { state } = useAppState();
  const [activeTab, setActiveTab] = useState<'active' | 'closed'>('active');
  const [apiTrips, setApiTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [reposting, setReposting] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchTrips = useCallback(async () => {
    if (!IS_API_MODE) return;
    setLoading(true); setError('');
    try {
      const res = await TripsService.getMyTrips(1);
      setApiTrips(res.data ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load trips');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchTrips(); }, [fetchTrips]);

  async function handleRepost(tripId: string) {
    setReposting(tripId);
    try {
      const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
      const tripDate = tomorrow.toISOString().split('T')[0];
      await TripsService.repostTrip(tripId, tripDate);
      await fetchTrips();
      setActiveTab('active');
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Repost failed');
    } finally { setReposting(null); }
  }

  // Split API trips
  const activeApiTrips = apiTrips.filter(t => t.status === 'active');
  const closedApiTrips = apiTrips.filter(t => t.status !== 'active');

  // Local trips
  const localTrips = state.trips as AppTrip[];
  const openLocalTrips = localTrips.filter(t => t.status === 'open');
  const closedLocalTrips = localTrips.filter(t => t.status === 'closed');

  const displayApiTrips = activeTab === 'active' ? activeApiTrips : closedApiTrips;
  const displayLocalTrips = activeTab === 'active' ? openLocalTrips : closedLocalTrips;
  const activeCount = IS_API_MODE ? activeApiTrips.length : openLocalTrips.length;
  const closedCount = IS_API_MODE ? closedApiTrips.length : closedLocalTrips.length;

  function handleTab(tab: string) {
    const paths: Record<string, string> = {
      home: '/app/vendor/home', trips: '/app/vendor/trips',
      post: '/app/vendor/post', route: '/app/vendor/route', drivers: '/app/vendor/find-drivers', profile: '/app/profile',
    };
    if (paths[tab]) router.push(paths[tab]);
  }

  return (
    <AppShell>
    <div className="flex flex-col flex-1" style={{ background: '#0D1117' }}>
      <header className="sticky top-0 z-30" style={{ background: '#0D1117', borderBottom: '1px solid #30363D' }}>
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-[#F0F6FC]">My Trips</h1>
          <div className="flex items-center gap-2">
            {IS_API_MODE && (
              <button onClick={fetchTrips} className="w-9 h-9 flex items-center justify-center rounded-xl"
                style={{ background: '#21262D', border: '1px solid #30363D' }}>
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} style={{ color: '#8B949E' }} />
              </button>
            )}
            <button onClick={() => router.push('/app/vendor/post')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold"
              style={{ background: 'rgba(245,166,35,0.15)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.2)' }}>
              <Plus size={16} /> Post Trip
            </button>
          </div>
        </div>
        <div className="flex px-4 pb-0 gap-1" style={{ borderBottom: '1px solid #30363D' }}>
          {(['active', 'closed'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="relative flex items-center gap-2 px-4 py-3 text-sm font-semibold capitalize transition-colors"
              style={{ color: activeTab === tab ? '#F5A623' : '#8B949E' }}>
              {tab === 'active' ? 'Active' : 'Closed'}
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold"
                style={{ background: activeTab === tab ? 'rgba(245,166,35,0.2)' : 'rgba(139,148,158,0.15)', color: activeTab === tab ? '#F5A623' : '#8B949E' }}>
                {tab === 'active' ? activeCount : closedCount}
              </span>
              {activeTab === tab && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full" style={{ background: '#F5A623' }} />}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-28 pt-4">
        {error && (
          <div className="mb-4 p-3 rounded-xl text-xs text-center" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>
            {error} — <button onClick={fetchTrips} style={{ color: '#F5A623' }}>Retry</button>
          </div>
        )}

        {IS_API_MODE ? (
          loading && apiTrips.length === 0 ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : displayApiTrips.length === 0 ? (
            <EmptyState tab={activeTab} onPost={() => router.push('/app/vendor/post')} />
          ) : (
            <div className="flex flex-col gap-3">
              {displayApiTrips.map(t => (
                <ApiTripCard key={t.id} trip={t}
                  onRepost={reposting ? () => {} : handleRepost} />
              ))}
            </div>
          )
        ) : (
          displayLocalTrips.length === 0 ? (
            <EmptyState tab={activeTab} onPost={() => router.push('/app/vendor/post')} />
          ) : (
            <div className="flex flex-col gap-3">
              {displayLocalTrips.map(t => (
                <LocalTripCard key={t.id} trip={t} onClick={() => router.push(`/app/vendor/trip/${t.id}`)} />
              ))}
            </div>
          )
        )}
      </main>

      <button onClick={() => router.push('/app/vendor/post')}
        className="fixed right-5 bottom-20 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg z-40 active:scale-95 transition-transform"
        style={{ background: '#F5A623', boxShadow: '0 4px 20px rgba(245,166,35,0.4)' }}
        aria-label="Post new trip">
        <Plus size={26} color="#0D1117" strokeWidth={2.5} />
      </button>

      <BottomNav role="vendor" activeTab="trips" onTabChange={handleTab}
        unreadNotifications={state.unreadNotifications} isPremium={user?.isPremium} />
    </div>
    </AppShell>
  );
}
