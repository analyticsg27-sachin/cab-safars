'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Crown, MapPin, Calendar, Users, ChevronRight } from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import AppHeader from '@/components/app/AppHeader';
import BottomNav from '@/components/app/BottomNav';

// ─── Data ─────────────────────────────────────────────────────────────────────
const AVAILABLE_TRIPS = [
  {
    id: 'TRP12563', vendorId: 'v001', vendorName: 'Rajesh Patel', vendorPhone: '+91 98250 11234',
    fromCity: 'Ahmedabad', toCity: 'Baroda', fromState: 'Gujarat', toState: 'Gujarat',
    vehicleType: '1.5 Ton', loadType: 'Open Body', tripDate: '2025-07-16', tripTime: '10:00 AM',
    expectedFare: 8500, weightTons: 1.5, contactsCount: 5, isPremiumVendor: true,
    status: 'open', createdAt: '2025-07-14T08:00:00Z', notes: 'Handle carefully',
  },
  {
    id: 'TRP12562', vendorId: 'v002', vendorName: 'Sunita Shah', vendorPhone: '+91 99090 22345',
    fromCity: 'Surat', toCity: 'Mumbai', fromState: 'Gujarat', toState: 'Maharashtra',
    vehicleType: 'Container', loadType: 'General', tripDate: '2025-07-17', tripTime: '08:00 AM',
    expectedFare: 18000, weightTons: 12, contactsCount: 2, isPremiumVendor: true,
    status: 'open', createdAt: '2025-07-13T07:00:00Z',
  },
  {
    id: 'TRP12561', vendorId: 'v003', vendorName: 'Mohan Verma', vendorPhone: '+91 97140 33456',
    fromCity: 'Vadodara', toCity: 'Ahmedabad', fromState: 'Gujarat', toState: 'Gujarat',
    vehicleType: 'Mini Truck', loadType: 'Agricultural', tripDate: '2025-07-15', tripTime: '07:00 AM',
    expectedFare: 4500, weightTons: 2, contactsCount: 1, isPremiumVendor: false,
    status: 'open', createdAt: '2025-07-13T09:00:00Z',
  },
  {
    id: 'TRP12560', vendorId: 'v005', vendorName: 'Anil Kumar', vendorPhone: '+91 70160 55678',
    fromCity: 'Rajkot', toCity: 'Pune', fromState: 'Gujarat', toState: 'Maharashtra',
    vehicleType: 'Truck (Heavy)', loadType: 'Heavy Machinery', tripDate: '2025-07-18', tripTime: '06:00 AM',
    expectedFare: 25000, weightTons: 22, contactsCount: 0, isPremiumVendor: true,
    status: 'open', createdAt: '2025-07-14T06:00:00Z',
  },
  {
    id: 'TRP12559', vendorId: 'v007', vendorName: 'Ravi Sharma', vendorPhone: '+91 91580 77890',
    fromCity: 'Anand', toCity: 'Vadodara', fromState: 'Gujarat', toState: 'Gujarat',
    vehicleType: 'Mini Truck (Tata Ace)', loadType: 'Agricultural', tripDate: '2025-07-16', tripTime: '07:00 AM',
    expectedFare: 3500, weightTons: 2, contactsCount: 0, isPremiumVendor: false,
    status: 'open', createdAt: '2025-07-15T10:00:00Z',
  },
  {
    id: 'TRP12558', vendorId: 'v010', vendorName: 'Anita Desai', vendorPhone: '+91 98370 10123',
    fromCity: 'Mumbai', toCity: 'Pune', fromState: 'Maharashtra', toState: 'Maharashtra',
    vehicleType: 'Truck (Medium)', loadType: 'Dry Goods', tripDate: '2025-07-19', tripTime: '09:00 AM',
    expectedFare: 9000, weightTons: 6, contactsCount: 3, isPremiumVendor: true,
    status: 'open', createdAt: '2025-07-14T11:00:00Z',
  },
  {
    id: 'TRP12557', vendorId: 'v011', vendorName: 'Nikhil Gupta', vendorPhone: '+91 96050 11234',
    fromCity: 'Delhi', toCity: 'Jaipur', fromState: 'Delhi', toState: 'Rajasthan',
    vehicleType: 'Container', loadType: 'General Goods', tripDate: '2025-07-20', tripTime: '05:00 AM',
    expectedFare: 15000, weightTons: 10, contactsCount: 7, isPremiumVendor: true,
    status: 'open', createdAt: '2025-07-13T05:00:00Z',
  },
  {
    id: 'TRP12556', vendorId: 'v014', vendorName: 'Meena Iyer', vendorPhone: '+91 90440 44567',
    fromCity: 'Ahmedabad', toCity: 'Surat', fromState: 'Gujarat', toState: 'Gujarat',
    vehicleType: 'Truck (Light)', loadType: 'Textile', tripDate: '2025-07-16', tripTime: '11:00 AM',
    expectedFare: 6500, weightTons: 3, contactsCount: 4, isPremiumVendor: true,
    status: 'open', createdAt: '2025-07-15T08:00:00Z',
  },
];

const STATE_FILTERS = ['All', 'Gujarat', 'Maharashtra', 'Delhi', 'Rajasthan'];
const DATE_FILTERS = ['Today', 'This Week'];

// ─── TripCard ─────────────────────────────────────────────────────────────────
function TripCard({ trip }: { trip: typeof AVAILABLE_TRIPS[0] }) {
  const router = useRouter();
  return (
    <div
      className="rounded-2xl border p-4 mb-3 active:scale-[0.99] transition-transform cursor-pointer"
      style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}
      onClick={() => router.push(`/app/driver/trip/${trip.id}`)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {trip.isPremiumVendor && (
            <span
              className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'rgba(245,166,35,0.12)', color: '#F5A623' }}
            >
              <Crown size={9} /> Premium Vendor
            </span>
          )}
        </div>
        <span className="text-xs font-mono" style={{ color: '#8B949E' }}>{trip.id}</span>
      </div>

      {/* Route */}
      <div className="flex items-center gap-2 mb-2">
        <MapPin size={14} style={{ color: '#F5A623' }} />
        <span className="text-base font-bold" style={{ color: '#F0F6FC' }}>
          {trip.fromCity} → {trip.toCity}
        </span>
      </div>

      {/* Date + Vehicle */}
      <div className="flex gap-3 mb-3 flex-wrap">
        <span className="text-xs" style={{ color: '#8B949E' }}>
          <Calendar size={10} className="inline mr-1" />
          {trip.tripDate} · {trip.tripTime}
        </span>
        <span className="text-xs" style={{ color: '#8B949E' }}>
          {trip.vehicleType} · {trip.loadType}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold" style={{ color: '#F5A623' }}>
            ₹{trip.expectedFare.toLocaleString('en-IN')}
          </span>
          {trip.contactsCount > 0 && (
            <span className="flex items-center gap-1 text-xs" style={{ color: '#8B949E' }}>
              <Users size={11} /> {trip.contactsCount} contacted
            </span>
          )}
        </div>
        <button
          className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl"
          style={{ backgroundColor: '#F5A623', color: '#0D1117' }}
          onClick={(e) => { e.stopPropagation(); router.push(`/app/driver/trip/${trip.id}`); }}
        >
          View Details <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FindTripsPage() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [stateFilter, setStateFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = AVAILABLE_TRIPS;
    if (stateFilter !== 'All') {
      list = list.filter((t) => t.fromState === stateFilter || t.toState === stateFilter);
    }
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      list = list.filter((t) =>
        t.fromCity.toLowerCase().includes(q) ||
        t.toCity.toLowerCase().includes(q) ||
        t.vendorName.toLowerCase().includes(q)
      );
    }
    if (dateFilter === 'Today') {
      list = list.filter((t) => t.tripDate === '2025-07-15');
    } else if (dateFilter === 'This Week') {
      list = list.filter((t) => t.tripDate >= '2025-07-15' && t.tripDate <= '2025-07-21');
    }
    return list;
  }, [stateFilter, dateFilter, searchText]);

  const activeFilterCount = (stateFilter !== 'All' ? 1 : 0) + (dateFilter ? 1 : 0);

  return (
    <AppShell>
      <AppHeader title="Available Trips" />

      <main className="flex-1 overflow-y-auto pb-24">
        {/* State filter pills */}
        <div className="px-4 pt-4 pb-0">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {[...STATE_FILTERS, ...DATE_FILTERS].map((f) => {
              const isState = STATE_FILTERS.includes(f);
              const isActive = isState ? stateFilter === f : dateFilter === f;
              return (
                <button
                  key={f}
                  className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
                  style={{
                    backgroundColor: isActive ? '#F5A623' : '#21262D',
                    color: isActive ? '#0D1117' : '#8B949E',
                    border: isActive ? 'none' : '1px solid #30363D',
                  }}
                  onClick={() => {
                    if (isState) setStateFilter(f);
                    else setDateFilter(dateFilter === f ? null : f);
                  }}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search */}
        <div className="px-4 pt-3 pb-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8B949E' }} />
            <input
              type="text"
              placeholder="Search by city or route..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-9 pr-4 py-3 rounded-xl text-sm"
              style={{
                backgroundColor: '#21262D',
                border: '1px solid #30363D',
                color: '#F0F6FC',
                outline: 'none',
              }}
            />
            {searchText && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setSearchText('')}
                style={{ color: '#8B949E' }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div className="px-4 pb-2 flex gap-2 flex-wrap">
            {stateFilter !== 'All' && (
              <span
                className="flex items-center gap-1 text-xs px-3 py-1 rounded-full"
                style={{ backgroundColor: 'rgba(245,166,35,0.12)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.3)' }}
              >
                {stateFilter}
                <button onClick={() => setStateFilter('All')}><X size={10} /></button>
              </span>
            )}
            {dateFilter && (
              <span
                className="flex items-center gap-1 text-xs px-3 py-1 rounded-full"
                style={{ backgroundColor: 'rgba(245,166,35,0.12)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.3)' }}
              >
                {dateFilter}
                <button onClick={() => setDateFilter(null)}><X size={10} /></button>
              </span>
            )}
          </div>
        )}

        {/* Results count */}
        <div className="px-4 pb-2">
          <p className="text-xs" style={{ color: '#8B949E' }}>
            {filtered.length} trip{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Trip list */}
        <div className="px-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: '#21262D' }}
              >
                <Search size={28} style={{ color: '#8B949E' }} />
              </div>
              <p className="font-semibold mb-1" style={{ color: '#F0F6FC' }}>No trips found</p>
              <p className="text-sm" style={{ color: '#8B949E' }}>Try adjusting your filters or search term</p>
              <button
                className="mt-4 text-sm font-semibold"
                style={{ color: '#F5A623' }}
                onClick={() => { setStateFilter('All'); setDateFilter(null); setSearchText(''); }}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filtered.map((trip) => <TripCard key={trip.id} trip={trip} />)
          )}
        </div>
      </main>

      <BottomNav role="driver" activeTab="trips" onTabChange={(tab) => {
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
