'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation, MapPin, Calendar, Users, ArrowLeft, AlertCircle } from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import TripsService from '@/lib/services/trips.service';
import type { Trip } from '@/lib/services/trips.service';

const IS_API_MODE = process.env.NEXT_PUBLIC_DATA_MODE === 'api';

const RADII = [5, 10, 20, 30, 50, 100];

function TripCard({ trip, onClick }: { trip: Trip & { distance_km?: number }; onClick: () => void }) {
  const fare = trip.expected_fare ? Number(trip.expected_fare) : null;
  return (
    <div className="rounded-2xl border p-4 mb-3 cursor-pointer active:scale-[0.99] transition-transform"
      style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}
      onClick={onClick}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(45,107,228,0.15)', color: '#2D6BE4' }}>
          {trip.distance_km != null ? `${trip.distance_km} km away` : 'Nearby'}
        </span>
        <span className="text-xs" style={{ color: '#8B949E' }}>{trip.vehicle_type}</span>
      </div>
      <div className="flex items-center gap-2 my-2">
        <MapPin size={14} style={{ color: '#F5A623' }} />
        <span className="text-base font-bold" style={{ color: '#F0F6FC' }}>
          {trip.from_city} → {trip.to_city}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs" style={{ color: '#8B949E' }}>
          <Calendar size={10} className="inline" /> {trip.trip_date}
          {trip.contacts_count > 0 && <span className="flex items-center gap-1"><Users size={10} />{trip.contacts_count}</span>}
        </div>
        {fare ? <span className="text-sm font-bold" style={{ color: '#F5A623' }}>₹{fare.toLocaleString('en-IN')}</span>
              : <span className="text-xs" style={{ color: '#8B949E' }}>Negotiable</span>}
      </div>
      <p className="text-xs mt-1" style={{ color: '#8B949E' }}>by {trip.vendor_name}</p>
    </div>
  );
}

export default function NearbyPage() {
  const router = useRouter();
  const [radius, setRadius] = useState(20);
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [trips, setTrips] = useState<(Trip & { distance_km?: number })[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationError, setLocationError] = useState('');

  function getLocation() {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }
    setLocating(true);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setLocating(false);
        setLocationError('Could not get your location. Please enable location access.');
      }
    );
  }

  useEffect(() => { getLocation(); }, []);

  useEffect(() => {
    if (!coords || !IS_API_MODE) return;
    setLoading(true); setError('');
    TripsService.getNearby({ lat: coords.lat, lng: coords.lng, radius })
      .then((res) => setTrips(res.trips as (Trip & { distance_km?: number })[]))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Failed to load nearby trips'))
      .finally(() => setLoading(false));
  }, [coords, radius]);

  function viewTrip(id: string) {
    router.push(`/app/driver/trip/${id}`);
  }

  return (
    <AppShell>
      <header className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3"
        style={{ background: '#0D1117', borderBottom: '1px solid #30363D', minHeight: 56 }}>
        <button onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-xl"
          style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <ArrowLeft size={20} color="#F0F6FC" />
        </button>
        <div>
          <h1 className="text-base font-semibold text-[#F0F6FC]">Nearby Trips</h1>
          <p className="text-xs text-[#8B949E]">
            {coords ? `Within ${radius} km of your location` : 'Getting your location…'}
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-8 pt-4">
        {/* Radius selector */}
        <div className="mb-4">
          <p className="text-xs text-[#8B949E] mb-2">Search Radius</p>
          <div className="flex gap-2 flex-wrap">
            {RADII.map((r) => (
              <button key={r} onClick={() => setRadius(r)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium"
                style={{
                  background: radius === r ? '#F5A623' : '#21262D',
                  color: radius === r ? '#0D1117' : '#8B949E',
                  border: radius === r ? 'none' : '1px solid #30363D',
                }}>
                {r} km
              </button>
            ))}
          </div>
        </div>

        {/* Location status */}
        {locationError && (
          <div className="mb-4 p-3 rounded-xl flex items-center gap-2"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
            <AlertCircle size={14} color="#EF4444" />
            <span className="text-xs" style={{ color: '#EF4444' }}>{locationError}</span>
          </div>
        )}

        {!coords && !locationError && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.3)' }}>
              <Navigation size={28} className={locating ? 'animate-pulse' : ''} style={{ color: '#F5A623' }} />
            </div>
            <p className="text-sm font-medium" style={{ color: '#F0F6FC' }}>
              {locating ? 'Getting your location…' : 'Location required'}
            </p>
            {!locating && (
              <button onClick={getLocation}
                className="text-xs font-semibold px-4 py-2 rounded-xl"
                style={{ background: '#F5A623', color: '#0D1117' }}>
                Try Again
              </button>
            )}
          </div>
        )}

        {!IS_API_MODE && coords && (
          <div className="p-4 rounded-xl mb-4" style={{ background: '#161B22', border: '1px dashed #30363D' }}>
            <p className="text-sm text-center" style={{ color: '#8B949E' }}>
              Nearby search requires API mode. Location: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
            </p>
          </div>
        )}

        {IS_API_MODE && coords && (
          <>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center py-12 gap-3">
                <p className="text-sm" style={{ color: '#EF4444' }}>{error}</p>
              </div>
            ) : trips.length === 0 ? (
              <div className="flex flex-col items-center py-12 gap-3 text-center">
                <Navigation size={32} style={{ color: '#30363D' }} />
                <p className="font-semibold" style={{ color: '#F0F6FC' }}>No trips nearby</p>
                <p className="text-sm" style={{ color: '#8B949E' }}>Try increasing the radius</p>
              </div>
            ) : (
              <>
                <p className="text-xs mb-3" style={{ color: '#8B949E' }}>{trips.length} trips found within {radius} km</p>
                {trips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} onClick={() => viewTrip(trip.id)} />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
