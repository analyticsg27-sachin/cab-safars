'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, Users, MapPin, Plus, Crown, ChevronRight } from 'lucide-react';
import type { AppTrip } from '@/lib/app-types';
import { getVendorTrips } from '@/lib/vendor-trips';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── Components ───────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: AppTrip['status'] }) {
  if (status === 'open') return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
      style={{ background: 'rgba(34,197,94,0.15)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' }}>
      <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
      Open
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
      style={{ background: 'rgba(139,148,158,0.15)', color: '#8B949E', border: '1px solid rgba(139,148,158,0.2)' }}>
      Closed
    </span>
  );
}

function TripCard({ trip, onClick }: { trip: AppTrip; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl border active:scale-[0.98] transition-transform overflow-hidden"
      style={{ background: '#161B22', borderColor: '#30363D' }}
    >
      {/* Top accent stripe for open trips */}
      {trip.status === 'open' && (
        <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg,#F5A623,transparent)' }} />
      )}

      <div className="p-4 flex flex-col gap-3">
        {/* Route row */}
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

        {/* Meta row */}
        <div className="flex items-center gap-3 text-sm text-[#8B949E] ml-10">
          <span>{formatDate(trip.tripDate)}</span>
          <span className="w-1 h-1 rounded-full bg-[#30363D]" />
          <span className="truncate">{trip.vehicleType}</span>
          {trip.loadType && (
            <>
              <span className="w-1 h-1 rounded-full bg-[#30363D]" />
              <span className="truncate">{trip.loadType}</span>
            </>
          )}
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between ml-10">
          <div className="flex items-center gap-1.5 text-sm text-[#8B949E]">
            <Users size={14} />
            <span>{trip.contactsCount} driver{trip.contactsCount !== 1 ? 's' : ''} contacted</span>
          </div>
          <div className="flex items-center gap-2">
            {trip.expectedFare && (
              <span className="text-sm font-semibold text-[#F5A623]">
                ₹{trip.expectedFare.toLocaleString('en-IN')}
              </span>
            )}
            <ChevronRight size={16} color="#8B949E" />
          </div>
        </div>

        {/* Closure info for closed trips */}
        {trip.status === 'closed' && trip.closureType && (
          <div className="ml-10 flex items-center gap-2 text-xs text-[#8B949E]"
            style={{ borderTop: '1px solid #30363D', paddingTop: 10 }}>
            {trip.closureType === 'app_driver'
              ? <><Crown size={12} color="#22C55E" /><span style={{ color: '#22C55E' }}>Closed via App Driver</span></>
              : <><span>Closed via Outside Driver</span></>
            }
          </div>
        )}
      </div>
    </button>
  );
}

function EmptyState({ tab, onPost }: { tab: string; onPost: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(245,166,35,0.1)' }}>
        <Truck size={28} color="#F5A623" />
      </div>
      <div>
        <p className="text-base font-semibold text-[#F0F6FC]">
          {tab === 'open' ? 'No active trips' : 'No closed trips yet'}
        </p>
        <p className="text-sm text-[#8B949E] mt-1.5 leading-relaxed">
          {tab === 'open'
            ? 'Post a trip to start finding drivers for your route'
            : 'Your closed trips will appear here once you mark them as done'}
        </p>
      </div>
      {tab === 'open' && (
        <button
          onClick={onPost}
          className="px-6 py-3 rounded-xl text-sm font-semibold mt-1"
          style={{ background: '#F5A623', color: '#0D1117' }}
        >
          Post New Trip
        </button>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function VendorTripsPage() {
  const router = useRouter();
  const [trips] = useState<AppTrip[]>(() => getVendorTrips());
  const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open');

  const openTrips = trips.filter(t => t.status === 'open');
  const closedTrips = trips.filter(t => t.status === 'closed');
  const displayTrips = activeTab === 'open' ? openTrips : closedTrips;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D1117' }}>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30"
        style={{ background: '#0D1117', borderBottom: '1px solid #30363D' }}>
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-[#F0F6FC]">My Trips</h1>
          <button
            onClick={() => router.push('/app/vendor/post')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold"
            style={{ background: 'rgba(245,166,35,0.15)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.2)' }}
          >
            <Plus size={16} />
            Post Trip
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-4 pb-0 gap-1"
          style={{ borderBottom: '1px solid #30363D' }}>
          {(['open', 'closed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative flex items-center gap-2 px-4 py-3 text-sm font-semibold capitalize transition-colors"
              style={{ color: activeTab === tab ? '#F5A623' : '#8B949E' }}
            >
              {tab === 'open' ? 'Open' : 'Closed'}
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold"
                style={{
                  background: activeTab === tab ? 'rgba(245,166,35,0.2)' : 'rgba(139,148,158,0.15)',
                  color: activeTab === tab ? '#F5A623' : '#8B949E',
                }}>
                {tab === 'open' ? openTrips.length : closedTrips.length}
              </span>
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                  style={{ background: '#F5A623' }} />
              )}
            </button>
          ))}
        </div>
      </header>

      {/* ── Trip list ───────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto px-4 pb-28 pt-4">
        {displayTrips.length === 0 ? (
          <EmptyState tab={activeTab} onPost={() => router.push('/app/vendor/post')} />
        ) : (
          <div className="flex flex-col gap-3">
            {displayTrips.map(t => (
              <TripCard
                key={t.id}
                trip={t}
                onClick={() => router.push(`/app/vendor/trip/${t.id}`)}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── FAB ─────────────────────────────────────────────────────────────── */}
      <button
        onClick={() => router.push('/app/vendor/post')}
        className="fixed right-5 bottom-20 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg z-40 active:scale-95 transition-transform"
        style={{ background: '#F5A623', boxShadow: '0 4px 20px rgba(245,166,35,0.4)' }}
        aria-label="Post new trip"
      >
        <Plus size={26} color="#0D1117" strokeWidth={2.5} />
      </button>

      {/* ── Bottom Nav ──────────────────────────────────────────────────────── */}
      <BottomNav active="trips" router={router} />
    </div>
  );
}

// ─── Bottom Nav (inline) ──────────────────────────────────────────────────────
function BottomNav({ active, router }: { active: string; router: ReturnType<typeof useRouter> }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, path: '/app/vendor/home' },
    { id: 'trips', label: 'My Trips', icon: <Truck size={22} />, path: '/app/vendor/trips' },
    { id: 'post', label: 'Post Trip', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>, path: '/app/vendor/post' },
    { id: 'profile', label: 'Profile', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>, path: '/app/vendor/profile' },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around px-2"
      style={{ background: '#161B22', borderTop: '1px solid #30363D', minHeight: 64, paddingBottom: 12, paddingTop: 8 }}>
      {tabs.map(tab => {
        const isActive = tab.id === active;
        const isPost = tab.id === 'post';
        if (isPost) return (
          <button key={tab.id} onClick={() => router.push(tab.path)}
            className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl"
            style={{ background: '#F5A623' }}>
            <span style={{ color: '#0D1117' }}>{tab.icon}</span>
          </button>
        );
        return (
          <button key={tab.id} onClick={() => router.push(tab.path)}
            className="flex flex-col items-center gap-1 py-1 min-w-[56px]">
            <span style={{ color: isActive ? '#F5A623' : '#8B949E' }}>{tab.icon}</span>
            <span className="text-[10px] font-medium" style={{ color: isActive ? '#F5A623' : '#8B949E' }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
