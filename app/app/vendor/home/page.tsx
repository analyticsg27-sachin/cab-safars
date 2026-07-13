'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Crown, PlusCircle, MapPin, ChevronRight, Package } from 'lucide-react';
import { useAppState } from '@/lib/app-state';
import AppShell from '@/components/app/AppShell';
import BottomNav from '@/components/app/BottomNav';
import AppHeader from '@/components/app/AppHeader';

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div
      className="flex-1 rounded-xl p-4"
      style={{ backgroundColor: '#161B22', border: '1px solid #30363D' }}
    >
      <p className="text-xs mb-1" style={{ color: '#8B949E' }}>{label}</p>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
    </div>
  );
}

export default function VendorHomePage() {
  const { state } = useAppState();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');
  const user = state.currentUser;

  useEffect(() => {
    if (!state.isAuthenticated) router.push('/app');
  }, [state.isAuthenticated, router]);

  function handleTab(tab: string) {
    setActiveTab(tab);
    if (tab === 'trips') router.push('/app/vendor/trips');
    else if (tab === 'post') router.push('/app/vendor/post');
    else if (tab === 'notifications') router.push('/app/notifications');
    else if (tab === 'profile') router.push('/app/profile');
  }

  if (!user) return null;

  const openTrips = state.trips.filter((t) => t.status === 'open').length;
  const closedTrips = state.trips.filter((t) => t.status === 'closed').length;
  const totalContacts = state.trips.reduce((s, t) => s + t.contactsCount, 0);
  const recentTrips = state.trips.slice(0, 3);

  return (
    <AppShell>
      <div className="flex flex-col flex-1 overflow-hidden" style={{ backgroundColor: '#0D1117' }}>
        <AppHeader
          title={user.companyName ?? user.name}
          isPremium={user.isPremium}
          rightAction={
            <button
              onClick={() => router.push('/app/notifications')}
              className="relative flex items-center justify-center w-9 h-9 rounded-full"
              style={{ backgroundColor: '#21262D' }}
            >
              <Bell size={18} style={{ color: '#F0F6FC' }} />
              {state.unreadNotifications > 0 && (
                <span
                  className="absolute top-0.5 right-0.5 w-4 h-4 flex items-center justify-center text-[9px] font-bold rounded-full"
                  style={{ backgroundColor: '#EF4444', color: '#fff' }}
                >
                  {state.unreadNotifications}
                </span>
              )}
            </button>
          }
        />

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Premium upgrade banner */}
          {!user.isPremium && (
            <button
              onClick={() => router.push('/app/subscription')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #F5A62322, #D4891E11)', border: '1px solid #F5A62344' }}
            >
              <Crown size={20} style={{ color: '#F5A623' }} />
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold" style={{ color: '#F5A623' }}>Upgrade to Premium</p>
                <p className="text-xs" style={{ color: '#8B949E' }}>Unlimited contacts &amp; priority listing</p>
              </div>
              <ChevronRight size={16} style={{ color: '#F5A623' }} />
            </button>
          )}

          {/* Stats row */}
          <div className="flex gap-3">
            <StatCard label="Open Trips" value={openTrips} color="#F5A623" />
            <StatCard label="Closed" value={closedTrips} color="#22C55E" />
            <StatCard label="Contacts" value={totalContacts} color="#2D6BE4" />
          </div>

          {/* Quick post button */}
          <button
            onClick={() => router.push('/app/vendor/post')}
            className="w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #F5A623, #D4891E)',
              boxShadow: '0 4px 20px rgba(245,166,35,0.3)',
            }}
          >
            <PlusCircle size={22} color="#0D1117" />
            <span className="text-base font-bold" style={{ color: '#0D1117' }}>Post a New Trip</span>
          </button>

          {/* Recent trips */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold" style={{ color: '#F0F6FC' }}>Recent Trips</p>
              <button
                onClick={() => router.push('/app/vendor/trips')}
                className="text-xs font-medium"
                style={{ color: '#F5A623' }}
              >
                View All
              </button>
            </div>

            {recentTrips.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-10 rounded-2xl"
                style={{ backgroundColor: '#161B22', border: '1px dashed #30363D' }}
              >
                <Package size={32} style={{ color: '#30363D' }} />
                <p className="text-sm mt-3" style={{ color: '#8B949E' }}>No trips posted yet</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {recentTrips.map((trip) => (
                  <button
                    key={trip.id}
                    onClick={() => router.push(`/app/vendor/trip/${trip.id}`)}
                    className="w-full text-left p-4 rounded-xl transition-all active:scale-95"
                    style={{ backgroundColor: '#161B22', border: '1px solid #30363D' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} style={{ color: '#F5A623' }} />
                        <span className="text-sm font-semibold" style={{ color: '#F0F6FC' }}>
                          {trip.fromCity} → {trip.toCity}
                        </span>
                      </div>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: trip.status === 'open' ? '#22C55E22' : '#8B949E22',
                          color: trip.status === 'open' ? '#22C55E' : '#8B949E',
                        }}
                      >
                        {trip.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs" style={{ color: '#8B949E' }}>
                      <span>{trip.vehicleType}</span>
                      <span>•</span>
                      <span>{trip.tripDate}</span>
                      <span>•</span>
                      <span>{trip.contactsCount} contacts</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <BottomNav
          role="vendor"
          activeTab={activeTab}
          onTabChange={handleTab}
          unreadNotifications={state.unreadNotifications}
        />
      </div>
    </AppShell>
  );
}
