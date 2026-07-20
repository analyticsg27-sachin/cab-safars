'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Crown, Search, MapPin, ChevronRight } from 'lucide-react';
import { useAppState } from '@/lib/app-state';
import AppShell from '@/components/app/AppShell';
import BottomNav from '@/components/app/BottomNav';
import AppHeader from '@/components/app/AppHeader';
import TripAlertBanner from '@/components/app/TripAlertBanner';

export default function DriverHomePage() {
  const { state } = useAppState();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');
  const user = state.currentUser;

  useEffect(() => {
    if (!state.isAuthenticated) router.push('/app');
  }, [state.isAuthenticated, router]);

  function handleTab(tab: string) {
    setActiveTab(tab);
    if (tab === 'trips') router.push('/app/driver/trips');
    else if (tab === 'route') router.push('/app/driver/route');
    else if (tab === 'notifications') router.push('/app/notifications');
    else if (tab === 'profile') router.push('/app/profile');
  }

  if (!user) return null;

  const openTrips = state.trips.filter((t) => t.status === 'open');
  const nearbyTrips = openTrips.slice(0, 3);

  return (
    <AppShell>
      <TripAlertBanner role="driver" />
      <div className="flex flex-col flex-1 overflow-hidden" style={{ backgroundColor: '#0D1117' }}>
        <AppHeader
          title="Cab Safars"
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
          {/* Greeting */}
          <div
            className="rounded-2xl p-4"
            style={{ background: 'linear-gradient(135deg, #1C2128, #161B22)', border: '1px solid #30363D' }}
          >
            <p className="text-xs mb-0.5" style={{ color: '#8B949E' }}>Welcome back,</p>
            <p className="text-lg font-bold" style={{ color: '#F0F6FC' }}>{user.name}</p>
            <p className="text-xs mt-1" style={{ color: '#8B949E' }}>
              {user.vehicleType} · {user.city}
            </p>
          </div>

          {/* Premium upgrade */}
          {!user.isPremium && (
            <button
              onClick={() => router.push('/app/subscription')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #F5A62322, #D4891E11)', border: '1px solid #F5A62344' }}
            >
              <Crown size={20} style={{ color: '#F5A623' }} />
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold" style={{ color: '#F5A623' }}>Upgrade to Premium</p>
                <p className="text-xs" style={{ color: '#8B949E' }}>See vendor contact details &amp; apply faster</p>
              </div>
              <ChevronRight size={16} style={{ color: '#F5A623' }} />
            </button>
          )}

          {/* Find trips CTA */}
          <button
            onClick={() => router.push('/app/driver/trips')}
            className="w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #2D6BE4, #1a4fc7)',
              boxShadow: '0 4px 20px rgba(45,107,228,0.3)',
            }}
          >
            <Search size={22} color="#fff" />
            <span className="text-base font-bold text-white">Browse Available Trips</span>
            <span
              className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: '#ffffff22', color: '#fff' }}
            >
              {openTrips.length}
            </span>
          </button>

          {/* Nearby trips */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold" style={{ color: '#F0F6FC' }}>Latest Trips</p>
              <button
                onClick={() => router.push('/app/driver/trips')}
                className="text-xs font-medium"
                style={{ color: '#F5A623' }}
              >
                See All
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {nearbyTrips.map((trip) => (
                <button
                  key={trip.id}
                  onClick={() => router.push(`/app/driver/trip/${trip.id}`)}
                  className="w-full text-left p-4 rounded-xl transition-all active:scale-95"
                  style={{
                    backgroundColor: '#161B22',
                    border: `1px solid ${trip.isPremiumVendor ? '#F5A62333' : '#30363D'}`,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} style={{ color: '#F5A623' }} />
                      <span className="text-sm font-semibold" style={{ color: '#F0F6FC' }}>
                        {trip.fromCity} → {trip.toCity}
                      </span>
                    </div>
                    {trip.isPremiumVendor && (
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: '#F5A62322', color: '#F5A623' }}
                      >
                        PREMIUM
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs" style={{ color: '#8B949E' }}>
                    <span>{trip.vehicleType}</span>
                    <span>•</span>
                    <span>{trip.tripDate}</span>
                    {trip.expectedFare && (
                      <>
                        <span>•</span>
                        <span style={{ color: '#22C55E' }}>₹{trip.expectedFare.toLocaleString()}</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs mt-1.5" style={{ color: '#8B949E' }}>
                    by {trip.vendorName}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <BottomNav
          role="driver"
          activeTab={activeTab}
          onTabChange={handleTab}
          unreadNotifications={state.unreadNotifications}
        />
      </div>
    </AppShell>
  );
}
