'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, PlusCircle, MapPin, Package, Search, RefreshCw } from 'lucide-react';
import { useAppState } from '@/lib/app-state';
import AppShell from '@/components/app/AppShell';
import BottomNav from '@/components/app/BottomNav';
import AppHeader from '@/components/app/AppHeader';
import TripsService from '@/lib/services/trips.service';
import type { Trip } from '@/lib/services/trips.service';

const IS_API_MODE = process.env.NEXT_PUBLIC_DATA_MODE === 'api';

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="flex-1 rounded-xl p-4" style={{ backgroundColor: '#161B22', border: '1px solid #30363D' }}>
      <p className="text-xs mb-1" style={{ color: '#8B949E' }}>{label}</p>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
    </div>
  );
}

export default function TripProviderHomePage() {
  const { state } = useAppState();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');
  const user = state.currentUser;

  const [apiTrips, setApiTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!state.isAuthenticated) router.push('/app');
  }, [state.isAuthenticated, router]);

  useEffect(() => {
    if (!IS_API_MODE || !state.isAuthenticated) return;
    setLoading(true);
    TripsService.getMyTrips(1)
      .then((r) => setApiTrips(r.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [state.isAuthenticated]);

  function handleTab(tab: string) {
    setActiveTab(tab);
    const paths: Record<string, string> = {
      trips: '/app/vendor/trips',
      post: '/app/vendor/post',
      find: '/app/vendor/find-trips',
      notifications: '/app/notifications',
      profile: '/app/profile',
    };
    if (paths[tab]) router.push(paths[tab]);
  }

  if (!user) return null;

  const openTrips = IS_API_MODE
    ? apiTrips.filter((t) => t.status === 'active').length
    : state.trips.filter((t) => t.status === 'open').length;
  const closedTrips = IS_API_MODE
    ? apiTrips.filter((t) => t.status === 'closed').length
    : state.trips.filter((t) => t.status === 'closed').length;
  const totalContacts = IS_API_MODE
    ? apiTrips.reduce((s, t) => s + (t.contacts_count ?? 0), 0)
    : state.trips.reduce((s, t) => s + t.contactsCount, 0);

  const recentApiTrips = apiTrips.slice(0, 3);
  const recentLocalTrips = state.trips.slice(0, 3);

  function refreshTrips() {
    setLoading(true);
    TripsService.getMyTrips(1).then(r => setApiTrips(r.data ?? [])).catch(() => {}).finally(() => setLoading(false));
  }

  return (
    <AppShell>
      <div className="flex flex-col flex-1 overflow-hidden" style={{ backgroundColor: '#0D1117' }}>
        <AppHeader
          title={user.companyName ?? user.name}
          rightAction={
            <button
              onClick={() => router.push('/app/notifications')}
              className="relative flex items-center justify-center w-9 h-9 rounded-full"
              style={{ backgroundColor: '#21262D' }}
            >
              <Bell size={18} style={{ color: '#F0F6FC' }} />
              {state.unreadNotifications > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 flex items-center justify-center text-[9px] font-bold rounded-full"
                  style={{ backgroundColor: '#EF4444', color: '#fff' }}>
                  {state.unreadNotifications}
                </span>
              )}
            </button>
          }
        />

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Role badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(245,166,35,0.15)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.3)' }}>
              Trip Provider
            </span>
            <span className="text-xs" style={{ color: '#8B949E' }}>{user.city}</span>
          </div>

          {/* Stats */}
          <div className="flex gap-3">
            <StatCard label="Active Trips" value={loading ? '…' : openTrips} color="#F5A623" />
            <StatCard label="Closed" value={loading ? '…' : closedTrips} color="#22C55E" />
            <StatCard label="Contacts" value={loading ? '…' : totalContacts} color="#2D6BE4" />
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => router.push('/app/vendor/post')}
              className="flex items-center gap-2 px-4 py-4 rounded-xl transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #F5A623, #D4891E)', boxShadow: '0 4px 20px rgba(245,166,35,0.3)' }}>
              <PlusCircle size={20} color="#0D1117" />
              <span className="text-sm font-bold" style={{ color: '#0D1117' }}>Post Trip</span>
            </button>

            <button onClick={() => router.push('/app/vendor/find-trips')}
              className="flex items-center gap-2 px-4 py-4 rounded-xl transition-all active:scale-95"
              style={{ background: '#161B22', border: '1px solid #30363D' }}>
              <Search size={20} style={{ color: '#F5A623' }} />
              <span className="text-sm font-semibold" style={{ color: '#F0F6FC' }}>Find Trips</span>
            </button>
          </div>

          {/* Recent trips */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold" style={{ color: '#F0F6FC' }}>Recent Trips</p>
              <div className="flex items-center gap-2">
                {IS_API_MODE && (
                  <button onClick={refreshTrips}>
                    <RefreshCw size={13} className={loading ? 'animate-spin' : ''} style={{ color: '#8B949E' }} />
                  </button>
                )}
                <button onClick={() => router.push('/app/vendor/trips')} className="text-xs font-medium" style={{ color: '#F5A623' }}>
                  View All
                </button>
              </div>
            </div>

            {IS_API_MODE ? (
              recentApiTrips.length === 0 ? (
                <EmptyTrips onPost={() => router.push('/app/vendor/post')} />
              ) : (
                <div className="flex flex-col gap-3">
                  {recentApiTrips.map((trip) => (
                    <button key={trip.id} onClick={() => router.push(`/app/vendor/trip/${trip.id}`)}
                      className="w-full text-left p-4 rounded-xl transition-all active:scale-95"
                      style={{ backgroundColor: '#161B22', border: '1px solid #30363D' }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} style={{ color: '#F5A623' }} />
                          <span className="text-sm font-semibold" style={{ color: '#F0F6FC' }}>
                            {trip.from_city} → {trip.to_city}
                          </span>
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: trip.status === 'active' ? '#22C55E22' : '#8B949E22', color: trip.status === 'active' ? '#22C55E' : '#8B949E' }}>
                          {trip.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs" style={{ color: '#8B949E' }}>
                        <span>{trip.vehicle_type}</span><span>•</span>
                        <span>{trip.trip_date}</span><span>•</span>
                        <span>{trip.contacts_count} contacts</span>
                      </div>
                    </button>
                  ))}
                </div>
              )
            ) : (
              recentLocalTrips.length === 0 ? (
                <EmptyTrips onPost={() => router.push('/app/vendor/post')} />
              ) : (
                <div className="flex flex-col gap-3">
                  {recentLocalTrips.map((trip) => (
                    <button key={trip.id} onClick={() => router.push(`/app/vendor/trip/${trip.id}`)}
                      className="w-full text-left p-4 rounded-xl transition-all active:scale-95"
                      style={{ backgroundColor: '#161B22', border: '1px solid #30363D' }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} style={{ color: '#F5A623' }} />
                          <span className="text-sm font-semibold" style={{ color: '#F0F6FC' }}>
                            {trip.fromCity} → {trip.toCity}
                          </span>
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: trip.status === 'open' ? '#22C55E22' : '#8B949E22', color: trip.status === 'open' ? '#22C55E' : '#8B949E' }}>
                          {trip.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs" style={{ color: '#8B949E' }}>
                        <span>{trip.vehicleType}</span><span>•</span>
                        <span>{trip.tripDate}</span><span>•</span>
                        <span>{trip.contactsCount} contacts</span>
                      </div>
                    </button>
                  ))}
                </div>
              )
            )}
          </div>
        </div>

        <BottomNav role="vendor" activeTab={activeTab} onTabChange={handleTab} unreadNotifications={state.unreadNotifications} />
      </div>
    </AppShell>
  );
}

function EmptyTrips({ onPost }: { onPost: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 rounded-2xl"
      style={{ backgroundColor: '#161B22', border: '1px dashed #30363D' }}>
      <Package size={32} style={{ color: '#30363D' }} />
      <p className="text-sm mt-3" style={{ color: '#8B949E' }}>No trips posted yet</p>
      <button onClick={onPost} className="mt-3 text-xs font-semibold" style={{ color: '#F5A623' }}>
        Post your first trip →
      </button>
    </div>
  );
}
