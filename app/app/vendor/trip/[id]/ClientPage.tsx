'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft, Calendar, Clock, Truck, Package, Weight, IndianRupee,
  FileText, Users, Phone, MessageCircle, Crown, X, ChevronRight, Hash, Lock,
} from 'lucide-react';
import type { AppTrip, ContactedDriver } from '@/lib/app-types';
import { useAppState } from '@/lib/app-state';

const DEMO_CONTACTS: Record<string, ContactedDriver[]> = {
  'tr-v003-001': [
    { driverId: 'd010', driverName: 'Vijay Kumar', driverPhone: '+91 94260 78901', vehicleType: 'SUV', city: 'Vadodara', isPremium: false, contactMethod: 'call', contactedAt: '2026-07-11T09:00:00Z' },
    { driverId: 'd011', driverName: 'Sunil Mehta', driverPhone: '+91 98765 43210', vehicleType: 'SUV', city: 'Surat', isPremium: true, contactMethod: 'whatsapp', contactedAt: '2026-07-12T14:30:00Z' },
  ],
  'tr-v003-002': [
    { driverId: 'd012', driverName: 'Ravi Joshi', driverPhone: '+91 91234 56789', vehicleType: 'Sedan', city: 'Vadodara', isPremium: false, contactMethod: 'call', contactedAt: '2026-07-09T08:00:00Z' },
    { driverId: 'd013', driverName: 'Dinesh Patel', driverPhone: '+91 87654 32109', vehicleType: 'Hatchback', city: 'Anand', isPremium: false, contactMethod: 'call', contactedAt: '2026-07-09T10:00:00Z' },
    { driverId: 'd014', driverName: 'Ketan Shah', driverPhone: '+91 99012 34567', vehicleType: 'Sedan', city: 'Surat', isPremium: true, contactMethod: 'whatsapp', contactedAt: '2026-07-10T07:30:00Z' },
    { driverId: 'd015', driverName: 'Ashok Trivedi', driverPhone: '+91 76543 21098', vehicleType: 'Tempo Travel', city: 'Vadodara', isPremium: false, contactMethod: 'call', contactedAt: '2026-07-10T11:00:00Z' },
    { driverId: 'd016', driverName: 'Mahesh Rao', driverPhone: '+91 93456 78901', vehicleType: 'Hatchback', city: 'Bharuch', isPremium: false, contactMethod: 'call', contactedAt: '2026-07-11T06:00:00Z' },
  ],
  'tr-v003-003': [
    { driverId: 'd017', driverName: 'Prakash Bhatt', driverPhone: '+91 88901 23456', vehicleType: 'Tempo Travel', city: 'Rajkot', isPremium: false, contactMethod: 'call', contactedAt: '2026-07-13T10:00:00Z' },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
function formatTime(t: string) {
  const [h, m] = t.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}
function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
function initials(name: string) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}
function avatarBg(name: string) {
  const colors = ['#F5A623', '#22C55E', '#3B82F6', '#A855F7', '#EF4444', '#14B8A6'];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % colors.length;
  return colors[h];
}

// ─── Components ───────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: AppTrip['status'] }) {
  if (status === 'open') return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
      style={{ background: 'rgba(34,197,94,0.15)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' }}>
      <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
      Open
    </span>
  );
  if (status === 'closed') return (
    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold"
      style={{ background: 'rgba(139,148,158,0.15)', color: '#8B949E', border: '1px solid rgba(139,148,158,0.2)' }}>
      Closed
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold"
      style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>
      Cancelled
    </span>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3" style={{ borderBottom: '1px solid #30363D' }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: '#1C2128' }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[#8B949E]">{label}</p>
        <p className="text-sm font-medium text-[#F0F6FC] mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function DriverCard({ driver }: { driver: ContactedDriver }) {
  const bg = avatarBg(driver.driverName);
  return (
    <div className="flex items-center gap-3 py-3" style={{ borderBottom: '1px solid #1C2128' }}>
      {/* Avatar */}
      <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
        style={{ background: bg, color: '#0D1117' }}>
        {initials(driver.driverName)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#F0F6FC] truncate">{driver.driverName}</span>
          {driver.isPremium && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold shrink-0"
              style={{ background: 'rgba(245,166,35,0.15)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.2)' }}>
              <Crown size={8} />
              Pro
            </span>
          )}
        </div>
        <p className="text-xs text-[#8B949E] mt-0.5 truncate">{driver.vehicleType} · {driver.city}</p>
      </div>

      {/* Contact method + time */}
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg"
          style={{ background: driver.contactMethod === 'whatsapp' ? 'rgba(34,197,94,0.1)' : 'rgba(59,130,246,0.1)' }}>
          {driver.contactMethod === 'whatsapp'
            ? <MessageCircle size={13} color="#22C55E" />
            : <Phone size={13} color="#3B82F6" />}
          <span className="text-[11px] font-medium"
            style={{ color: driver.contactMethod === 'whatsapp' ? '#22C55E' : '#3B82F6' }}>
            {driver.contactMethod === 'whatsapp' ? 'WhatsApp' : 'Call'}
          </span>
        </div>
        <span className="text-[11px] text-[#8B949E]">{timeAgo(driver.contactedAt)}</span>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function VendorTripDetailPage() {
  const router = useRouter();
  const params = useParams();
  const tripId = params?.id as string;
  const { state, dispatch } = useAppState();
  const [closing, setClosing] = useState(false);

  const trip = state.trips.find((t: AppTrip) => t.id === tripId);
  const isPremium = state.currentUser?.isPremium ?? false;

  if (!trip) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center"
        style={{ background: '#0D1117' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(239,68,68,0.1)' }}>
          <X size={28} color="#EF4444" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#F0F6FC]">Trip Not Found</h2>
          <p className="text-sm text-[#8B949E] mt-1">This trip may have been deleted or the link is invalid.</p>
        </div>
        <button
          onClick={() => router.push('/app/vendor/trips')}
          className="px-5 py-3 rounded-xl font-semibold text-sm"
          style={{ background: '#F5A623', color: '#0D1117' }}
        >
          Back to Trips
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D1117' }}>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3"
        style={{ background: '#0D1117', borderBottom: '1px solid #30363D', minHeight: 56 }}>
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-xl"
          style={{ background: '#161B22', border: '1px solid #30363D' }}
          aria-label="Go back"
        >
          <ArrowLeft size={20} color="#F0F6FC" />
        </button>
        <div className="flex-1">
          <h1 className="text-base font-semibold text-[#F0F6FC]">Trip Details</h1>
        </div>
        <StatusBadge status={trip.status} />
      </header>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto px-4 pb-10 pt-4 flex flex-col gap-4">

        {/* Route hero card */}
        <div className="rounded-2xl p-5" style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <div className="flex items-start gap-3 mb-4">
            <div className="flex flex-col items-center gap-1 pt-0.5">
              <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: '#22C55E' }} />
              <div className="w-0.5 h-6" style={{ background: 'linear-gradient(#22C55E,#EF4444)' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#EF4444' }} />
            </div>
            <div className="flex-1">
              <p className="text-2xl font-bold text-[#F0F6FC] leading-tight">
                {trip.fromCity}
              </p>
              <p className="text-sm text-[#8B949E] mt-0.5">{trip.fromState}</p>
              <div className="my-3" />
              <p className="text-2xl font-bold text-[#F0F6FC] leading-tight">
                {trip.toCity}
              </p>
              <p className="text-sm text-[#8B949E] mt-0.5">{trip.toState}</p>
            </div>
          </div>

          {/* Trip ID */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: '#1C2128' }}>
            <Hash size={14} color="#8B949E" />
            <span className="font-mono text-sm text-[#F0F6FC]">{trip.id}</span>
          </div>
        </div>

        {/* Info rows */}
        <div className="rounded-2xl px-4" style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <InfoRow icon={<Calendar size={16} color="#F5A623" />} label="Trip Date" value={formatDate(trip.tripDate)} />
          <InfoRow icon={<Clock size={16} color="#F5A623" />} label="Departure Time" value={formatTime(trip.tripTime)} />
          <InfoRow icon={<Truck size={16} color="#8B949E" />} label="Vehicle Type" value={trip.vehicleType} />
          <InfoRow icon={<Package size={16} color="#8B949E" />} label="Load Type" value={trip.loadType} />
          {trip.weightTons !== undefined && (
            <InfoRow icon={<Weight size={16} color="#8B949E" />} label="Weight" value={`${trip.weightTons} Tons`} />
          )}
          {trip.expectedFare !== undefined && (
            <InfoRow icon={<IndianRupee size={16} color="#22C55E" />} label="Expected Fare" value={`₹${trip.expectedFare.toLocaleString('en-IN')}`} />
          )}
          {trip.notes && (
            <div className="py-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: '#1C2128' }}>
                  <FileText size={16} color="#8B949E" />
                </div>
                <p className="text-xs text-[#8B949E]">Notes</p>
              </div>
              <p className="text-sm text-[#F0F6FC] leading-relaxed ml-11">{trip.notes}</p>
            </div>
          )}
        </div>

        {/* Closure info (if closed) */}
        {trip.status === 'closed' && trip.closureType && (
          <div className="rounded-2xl p-4" style={{ background: '#161B22', border: '1px solid #30363D' }}>
            <h3 className="text-sm font-semibold text-[#F0F6FC] mb-3">Closure Details</h3>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: trip.closureType === 'app_driver' ? 'rgba(34,197,94,0.15)' : 'rgba(139,148,158,0.15)' }}>
                {trip.closureType === 'app_driver'
                  ? <Crown size={18} color="#22C55E" />
                  : <Users size={18} color="#8B949E" />}
              </div>
              <div>
                <p className="text-sm font-medium text-[#F0F6FC]">
                  {trip.closureType === 'app_driver' ? 'Closed via App Driver' : 'Closed via Outside Driver'}
                </p>
                {trip.closureNotes && (
                  <p className="text-xs text-[#8B949E] mt-0.5">{trip.closureNotes}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contacted Drivers */}
        <div className="rounded-2xl p-4" style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-[#F0F6FC]">Contacted Drivers</h3>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)' }}>
              <Users size={12} color="#F5A623" />
              <span className="text-xs font-semibold" style={{ color: '#F5A623' }}>{trip.contactsCount}</span>
            </div>
          </div>

          {(() => {
            const contacts: ContactedDriver[] = trip.contactedDrivers.length
              ? trip.contactedDrivers
              : (DEMO_CONTACTS[tripId] ?? []);

            if (trip.contactsCount === 0) {
              return (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(139,148,158,0.1)' }}>
                    <Users size={22} color="#8B949E" />
                  </div>
                  <p className="text-sm font-medium text-[#F0F6FC]">
                    {trip.status === 'open' ? 'No drivers yet' : 'No contact records'}
                  </p>
                  <p className="text-xs text-[#8B949E] leading-relaxed">
                    {trip.status === 'open'
                      ? 'Drivers matching your route will appear here once they contact you'
                      : 'No drivers were recorded for this trip'}
                  </p>
                </div>
              );
            }

            if (!isPremium) {
              return (
                <div>
                  {contacts.slice(0, trip.contactsCount).map((d) => (
                    <div key={d.driverId} className="flex items-center gap-3 py-3" style={{ borderBottom: '1px solid #1C2128' }}>
                      <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                        style={{ background: '#21262D', color: '#8B949E' }}>
                        {initials(d.driverName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#F0F6FC]">{d.driverName}</p>
                        <p className="text-xs text-[#8B949E]">{d.city} · {d.vehicleType}</p>
                        <p className="text-xs mt-0.5 blur-sm select-none" style={{ color: '#8B949E' }}>+91 XXXXX XXXXX</p>
                      </div>
                      <Lock size={14} color="#F5A623" />
                    </div>
                  ))}
                  <button
                    onClick={() => router.push('/app/premium')}
                    className="w-full flex items-center justify-between mt-3 p-4 rounded-2xl transition-all active:scale-95"
                    style={{ background: 'linear-gradient(135deg,rgba(245,166,35,0.1),rgba(245,166,35,0.05))', border: '1px solid rgba(245,166,35,0.3)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(245,166,35,0.15)' }}>
                        <Crown size={18} color="#F5A623" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold" style={{ color: '#F5A623' }}>Unlock All Contacts</p>
                        <p className="text-xs text-[#8B949E]">Upgrade to Premium — ₹199/month</p>
                      </div>
                    </div>
                    <ChevronRight size={16} color="#F5A623" />
                  </button>
                </div>
              );
            }

            return (
              <div>
                {contacts.map(d => <DriverCard key={d.driverId} driver={d} />)}
              </div>
            );
          })()}
        </div>

        {/* Close / Reopen Trip */}
        {trip.status === 'open' ? (
          <button
            onClick={() => {
              setClosing(true);
              dispatch({ type: 'CLOSE_TRIP', payload: { tripId: trip.id, closureType: 'outside_driver' } });
              setTimeout(() => { setClosing(false); router.back(); }, 600);
            }}
            disabled={closing}
            className="w-full h-14 rounded-xl font-semibold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            style={{ background: closing ? '#0D1117' : '#161B22', border: '1px solid rgba(239,68,68,0.4)', color: '#EF4444' }}
          >
            {closing ? 'Closing…' : 'Mark as Closed'}
          </button>
        ) : (
          <button
            onClick={() => {
              dispatch({ type: 'UPDATE_TRIP', payload: { ...trip, status: 'open', closureType: undefined, closedDriverId: undefined } });
              router.back();
            }}
            className="w-full h-14 rounded-xl font-semibold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', color: '#22C55E' }}
          >
            Reopen This Trip
          </button>
        )}
      </main>
    </div>
  );
}
