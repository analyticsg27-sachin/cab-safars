'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, MessageCircle, Crown, MapPin, Lock, User, Search } from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import AppHeader from '@/components/app/AppHeader';
import BottomNav from '@/components/app/BottomNav';
import { useAppState } from '@/lib/app-state';

const DEMO_DRIVERS = [
  { id: 'd001', name: 'Harshad Bhatt',   phone: '+91 98250 65432', city: 'Ahmedabad', vehicleType: 'Sedan',        isPremium: true,  rating: 4.8, trips: 34 },
  { id: 'd003', name: 'Ramesh Yadav',    phone: '+91 88660 87654', city: 'Surat',     vehicleType: 'Hatchback',    isPremium: false, rating: 4.5, trips: 12 },
  { id: 'd004', name: 'Vinay Desai',     phone: '+91 91540 22345', city: 'Gandhinagar', vehicleType: 'SUV',        isPremium: false, rating: 4.6, trips: 20 },
  { id: 'd005', name: 'Arjun Singh',     phone: '+91 87650 99123', city: 'Ahmedabad', vehicleType: 'Innova Crysta', isPremium: true, rating: 4.9, trips: 58 },
  { id: 'd006', name: 'Deepak Sharma',   phone: '+91 99010 45678', city: 'Vadodara',  vehicleType: 'Tempo Travel', isPremium: false, rating: 4.3, trips: 8  },
  { id: 'd007', name: 'Rahul Mehta',     phone: '+91 93740 11223', city: 'Rajkot',    vehicleType: 'Bus',          isPremium: true,  rating: 4.7, trips: 41 },
  { id: 'd008', name: 'Sunil Prajapati', phone: '+91 82000 33445', city: 'Surat',     vehicleType: 'Mini Bus',     isPremium: false, rating: 4.4, trips: 15 },
  { id: 'd009', name: 'Kiran Solanki',   phone: '+91 76540 88990', city: 'Ahmedabad', vehicleType: 'Luxury Car',   isPremium: true,  rating: 5.0, trips: 27 },
];

export default function FindDriversPage() {
  const router = useRouter();
  const { state } = useAppState();
  const user = state.currentUser;
  const isPremium = user?.isPremium ?? false;

  const [search, setSearch] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('Any');

  if (!user) { router.replace('/app/'); return null; }

  const VEHICLE_OPTIONS = ['Any', 'Sedan', 'SUV', 'Hatchback', 'Innova Crysta', 'Innova', 'Tempo Travel', 'Bus', 'Mini Bus', 'Luxury Car', 'Ecco', 'Parcel Package'];

  const filtered = DEMO_DRIVERS.filter(d => {
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.city.toLowerCase().includes(search.toLowerCase());
    const matchVehicle = vehicleFilter === 'Any' || d.vehicleType === vehicleFilter;
    return matchSearch && matchVehicle;
  });

  return (
    <AppShell>
      <AppHeader title="Find Drivers" subtitle={isPremium ? 'Premium — contact any driver directly' : 'Upgrade to contact drivers'} />

      <main className="flex-1 overflow-y-auto pb-24">
        {/* Premium gate banner for free users */}
        {!isPremium && (
          <div className="mx-4 mt-4 mb-2 rounded-2xl p-4 flex items-start gap-3"
            style={{ backgroundColor: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.3)' }}>
            <Crown size={20} style={{ color: '#F5A623', flexShrink: 0, marginTop: 2 }} />
            <div>
              <p className="text-sm font-bold mb-1" style={{ color: '#F5A623' }}>Premium Feature</p>
              <p className="text-xs mb-3" style={{ color: '#8B949E' }}>
                Upgrade to Premium to directly call or WhatsApp any available driver and book them for your trip.
              </p>
              <button
                className="px-4 py-2 rounded-xl text-xs font-bold"
                style={{ backgroundColor: '#F5A623', color: '#0D1117' }}
                onClick={() => router.push('/app/subscription')}
              >
                Upgrade to Premium — ₹199/month
              </button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-2 px-3 py-3 rounded-xl mb-3"
            style={{ backgroundColor: '#161B22', border: '1px solid #30363D' }}>
            <Search size={15} style={{ color: '#8B949E' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or city..."
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: '#F0F6FC' }}
            />
          </div>

          {/* Vehicle filter */}
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {VEHICLE_OPTIONS.map(v => (
              <button key={v} onClick={() => setVehicleFilter(v)}
                className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{
                  backgroundColor: vehicleFilter === v ? '#F5A623' : '#21262D',
                  color: vehicleFilter === v ? '#0D1117' : '#8B949E',
                  border: vehicleFilter === v ? 'none' : '1px solid #30363D',
                }}>
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 pb-2">
          <p className="text-xs" style={{ color: '#8B949E' }}>{filtered.length} drivers available</p>
        </div>

        {/* Driver cards */}
        <div className="px-4 flex flex-col gap-3">
          {filtered.map((driver) => (
            <div key={driver.id} className="rounded-2xl border p-4"
              style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}>
              <div className="flex items-start gap-3 mb-3">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: '#21262D', border: '2px solid #30363D' }}>
                  <span className="text-lg font-bold" style={{ color: '#F5A623' }}>
                    {driver.name.charAt(0)}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold" style={{ color: '#F0F6FC' }}>{driver.name}</p>
                    {driver.isPremium && (
                      <span className="flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: 'rgba(245,166,35,0.12)', color: '#F5A623' }}>
                        <Crown size={8} /> Premium
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: '#8B949E' }}>
                    <span className="flex items-center gap-1"><MapPin size={10} />{driver.city}</span>
                    <span>⭐ {driver.rating}</span>
                    <span>{driver.trips} trips</span>
                  </div>
                  <p className="text-xs mt-1" style={{ color: '#8B949E' }}>
                    <User size={10} className="inline mr-1" />{driver.vehicleType}
                  </p>
                </div>
              </div>

              {/* Contact buttons */}
              {isPremium ? (
                <div className="flex gap-2">
                  <a href={`tel:${driver.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold"
                    style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.25)', textDecoration: 'none' }}>
                    <Phone size={14} /> Call
                  </a>
                  <a href={`https://wa.me/${driver.phone.replace(/\D/g, '')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold"
                    style={{ backgroundColor: 'rgba(37,211,102,0.12)', color: '#25D366', border: '1px solid rgba(37,211,102,0.25)', textDecoration: 'none' }}>
                    <MessageCircle size={14} /> WhatsApp
                  </a>
                </div>
              ) : (
                <button
                  onClick={() => router.push('/app/subscription')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ backgroundColor: '#21262D', color: '#8B949E', border: '1px solid #30363D' }}>
                  <Lock size={13} /> Unlock Contact — Premium Only
                </button>
              )}
            </div>
          ))}
        </div>
      </main>

      <BottomNav role="vendor" activeTab="drivers" onTabChange={(tab) => {
        const paths: Record<string, string> = {
          home: '/app/vendor/home', trips: '/app/vendor/trips',
          post: '/app/vendor/post', route: '/app/vendor/route',
          drivers: '/app/vendor/find-drivers', profile: '/app/profile',
        };
        if (paths[tab]) router.push(paths[tab]);
      }} unreadNotifications={state.unreadNotifications} isPremium={isPremium} />
    </AppShell>
  );
}
