'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft, Crown, Users, Phone, MessageCircle, CheckCircle,
  UserX, User, FileText, X,
} from 'lucide-react';
import type { AppTrip, ContactedDriver } from '@/lib/app-types';
import { getVendorTrips, closeVendorTrip } from '@/lib/vendor-trips';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function initials(name: string) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}
function avatarBg(name: string) {
  const colors = ['#F5A623', '#22C55E', '#3B82F6', '#A855F7', '#EF4444', '#14B8A6'];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % colors.length;
  return colors[h];
}
function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

type ClosureMode = 'app_driver' | 'outside_driver';

// ─── Sub-components ───────────────────────────────────────────────────────────

function ModeCard({
  selected,
  onSelect,
  icon,
  title,
  description,
  color,
}: {
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <button
      onClick={onSelect}
      className="w-full text-left rounded-2xl p-4 flex items-start gap-4 transition-all active:scale-[0.98]"
      style={{
        background: selected ? `${color}12` : '#161B22',
        border: selected ? `2px solid ${color}` : '2px solid #30363D',
      }}
    >
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
        style={{ background: selected ? `${color}20` : '#1C2128' }}>
        {icon}
      </div>
      <div className="flex-1 pt-0.5">
        <p className="text-sm font-semibold" style={{ color: selected ? '#F0F6FC' : '#8B949E' }}>{title}</p>
        <p className="text-xs mt-1 leading-relaxed text-[#8B949E]">{description}</p>
      </div>
      <div className="w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center"
        style={{ borderColor: selected ? color : '#30363D', background: selected ? color : 'transparent' }}>
        {selected && <div className="w-2 h-2 rounded-full bg-white" />}
      </div>
    </button>
  );
}

function DriverSelectCard({
  driver,
  selected,
  onSelect,
}: {
  driver: ContactedDriver;
  selected: boolean;
  onSelect: () => void;
}) {
  const bg = avatarBg(driver.driverName);
  return (
    <button
      onClick={onSelect}
      className="w-full text-left flex items-center gap-3 py-3.5 px-4 rounded-2xl transition-all active:scale-[0.98]"
      style={{
        background: selected ? 'rgba(245,166,35,0.08)' : '#1C2128',
        border: selected ? '1.5px solid rgba(245,166,35,0.4)' : '1.5px solid #30363D',
      }}
    >
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
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-[#8B949E] truncate">{driver.vehicleType} · {driver.city}</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          {driver.contactMethod === 'whatsapp'
            ? <MessageCircle size={11} color="#22C55E" />
            : <Phone size={11} color="#3B82F6" />}
          <span className="text-[11px]" style={{ color: driver.contactMethod === 'whatsapp' ? '#22C55E' : '#3B82F6' }}>
            via {driver.contactMethod === 'whatsapp' ? 'WhatsApp' : 'Call'}
          </span>
          <span className="text-[11px] text-[#8B949E]">· {timeAgo(driver.contactedAt)}</span>
        </div>
      </div>

      {/* Radio */}
      <div className="w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center"
        style={{ borderColor: selected ? '#F5A623' : '#30363D', background: selected ? '#F5A623' : 'transparent' }}>
        {selected && <div className="w-2 h-2 rounded-full bg-[#0D1117]" />}
      </div>
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function VendorCloseTripPage() {
  const router = useRouter();
  const params = useParams();
  const tripId = params?.id as string;

  const [trips] = useState<AppTrip[]>(() => getVendorTrips());
  const trip = trips.find(t => t.id === tripId);

  const [mode, setMode] = useState<ClosureMode>('app_driver');
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');
  const [outsideName, setOutsideName] = useState('');
  const [outsideContact, setOutsideContact] = useState('');
  const [closureNotes, setClosureNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  if (!trip) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center"
        style={{ background: '#0D1117' }}>
        <X size={32} color="#EF4444" />
        <div>
          <h2 className="text-lg font-bold text-[#F0F6FC]">Trip Not Found</h2>
          <p className="text-sm text-[#8B949E] mt-1">Unable to find this trip.</p>
        </div>
        <button onClick={() => router.push('/app/vendor/trips')}
          className="px-5 py-3 rounded-xl font-semibold text-sm"
          style={{ background: '#F5A623', color: '#0D1117' }}>
          Back to Trips
        </button>
      </div>
    );
  }

  if (trip.status !== 'open') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center"
        style={{ background: '#0D1117' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(139,148,158,0.1)' }}>
          <CheckCircle size={28} color="#8B949E" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#F0F6FC]">Trip Already Closed</h2>
          <p className="text-sm text-[#8B949E] mt-1">This trip has already been marked as closed.</p>
        </div>
        <button onClick={() => router.push(`/app/vendor/trip/${tripId}`)}
          className="px-5 py-3 rounded-xl font-semibold text-sm"
          style={{ background: '#F5A623', color: '#0D1117' }}>
          View Trip
        </button>
      </div>
    );
  }

  async function handleConfirm() {
    setValidationError('');

    if (mode === 'app_driver' && !selectedDriverId) {
      setValidationError('Please select a driver to close this trip');
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));

    closeVendorTrip(tripId, {
      closureType: mode,
      closedDriverId: mode === 'app_driver' ? selectedDriverId : undefined,
      closureNotes: closureNotes || (mode === 'outside_driver'
        ? [outsideName && `Driver: ${outsideName}`, outsideContact && `Contact: ${outsideContact}`].filter(Boolean).join(', ') || undefined
        : undefined),
    });

    setLoading(false);
    setSuccess(true);
    await new Promise(r => setTimeout(r, 1000));
    router.push('/app/vendor/trips');
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 gap-5"
        style={{ background: '#0D1117' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(34,197,94,0.15)' }}>
          <CheckCircle size={40} color="#22C55E" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#F0F6FC]">Trip Closed</h2>
          <p className="text-sm text-[#8B949E] mt-2 leading-relaxed">
            <span className="text-[#F0F6FC]">{trip.fromCity} → {trip.toCity}</span> has been marked as closed.
          </p>
        </div>
        <p className="text-xs text-[#8B949E]">Redirecting to your trips…</p>
      </div>
    );
  }

  const hasDrivers = trip.contactedDrivers.length > 0;

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
          <h1 className="text-base font-semibold text-[#F0F6FC]">Close Trip</h1>
          <p className="text-xs text-[#8B949E] mt-0.5">
            {trip.fromCity} → {trip.toCity}
          </p>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 pb-10 pt-5 flex flex-col gap-5">

        {/* Route summary */}
        <div className="rounded-2xl p-4 flex items-center gap-3"
          style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(245,166,35,0.15)' }}>
            <CheckCircle size={20} color="#F5A623" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#F0F6FC]">{trip.fromCity} → {trip.toCity}</p>
            <p className="text-xs text-[#8B949E] mt-0.5">{trip.vehicleType} · {trip.tripDate}</p>
          </div>
        </div>

        {/* Closure method */}
        <div>
          <h2 className="text-sm font-semibold text-[#8B949E] uppercase tracking-wider mb-3">
            How was this trip fulfilled?
          </h2>
          <div className="flex flex-col gap-3">
            <ModeCard
              selected={mode === 'app_driver'}
              onSelect={() => { setMode('app_driver'); setValidationError(''); }}
              icon={<Crown size={22} color={mode === 'app_driver' ? '#F5A623' : '#8B949E'} />}
              title="Trip Given to App Driver"
              description="Select a driver who contacted you through Cab Safars"
              color="#F5A623"
            />
            <ModeCard
              selected={mode === 'outside_driver'}
              onSelect={() => { setMode('outside_driver'); setValidationError(''); }}
              icon={<UserX size={22} color={mode === 'outside_driver' ? '#8B949E' : '#8B949E'} />}
              title="Trip Given to Outside Driver"
              description="Trip was fulfilled by a driver not on the app"
              color="#8B949E"
            />
          </div>
        </div>

        {/* App driver selection */}
        {mode === 'app_driver' && (
          <div>
            <h2 className="text-sm font-semibold text-[#8B949E] uppercase tracking-wider mb-3">
              Select Driver *
            </h2>
            {hasDrivers ? (
              <div className="flex flex-col gap-2">
                {trip.contactedDrivers.map(d => (
                  <DriverSelectCard
                    key={d.driverId}
                    driver={d}
                    selected={selectedDriverId === d.driverId}
                    onSelect={() => { setSelectedDriverId(d.driverId); setValidationError(''); }}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl p-6 flex flex-col items-center gap-3 text-center"
                style={{ background: '#161B22', border: '1px solid #30363D' }}>
                <Users size={24} color="#8B949E" />
                <div>
                  <p className="text-sm font-medium text-[#F0F6FC]">No drivers recorded</p>
                  <p className="text-xs text-[#8B949E] mt-1">No drivers contacted this trip through the app.</p>
                  <p className="text-xs text-[#8B949E] mt-0.5">Try selecting "Outside Driver" instead.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Outside driver details */}
        {mode === 'outside_driver' && (
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-[#8B949E] uppercase tracking-wider">
              Outside Driver Info (Optional)
            </h2>

            <div className="rounded-2xl p-4 flex flex-col gap-3"
              style={{ background: '#161B22', border: '1px solid #30363D' }}>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ background: 'rgba(139,148,158,0.08)', border: '1px solid rgba(139,148,158,0.15)' }}>
                <User size={14} color="#8B949E" />
                <span className="text-xs text-[#8B949E] leading-snug">
                  This trip was fulfilled by a driver outside the app
                </span>
              </div>

              <div>
                <label className="text-sm text-[#8B949E] mb-2 block">Driver Name</label>
                <input
                  type="text"
                  placeholder="e.g. Suresh Bhai"
                  value={outsideName}
                  onChange={e => setOutsideName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none text-[#F0F6FC] placeholder-[#8B949E]"
                  style={{ background: '#21262D', border: '1px solid #30363D' }}
                />
              </div>

              <div>
                <label className="text-sm text-[#8B949E] mb-2 block">Driver Contact</label>
                <input
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={outsideContact}
                  onChange={e => setOutsideContact(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none text-[#F0F6FC] placeholder-[#8B949E]"
                  style={{ background: '#21262D', border: '1px solid #30363D' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Closure notes */}
        <div>
          <label className="text-sm text-[#8B949E] mb-2 flex items-center gap-1.5 block">
            <FileText size={14} /> Closure Notes (Optional)
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Driver was on time, smooth delivery…"
            value={closureNotes}
            onChange={e => setClosureNotes(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none text-[#F0F6FC] placeholder-[#8B949E] resize-none"
            style={{ background: '#21262D', border: '1px solid #30363D' }}
          />
        </div>

        {/* Validation error */}
        {validationError && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <X size={16} color="#EF4444" />
            <p className="text-sm text-[#EF4444]">{validationError}</p>
          </div>
        )}

        {/* Confirm button */}
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full h-14 rounded-xl font-semibold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-70"
          style={{ background: '#F5A623', color: '#0D1117' }}
        >
          {loading ? (
            <>
              <span className="w-5 h-5 rounded-full border-2 border-[#0D1117]/30 border-t-[#0D1117] animate-spin" />
              Closing Trip…
            </>
          ) : (
            <>
              <CheckCircle size={20} />
              Confirm & Close Trip
            </>
          )}
        </button>

        <p className="text-center text-xs text-[#8B949E]">
          This action cannot be undone. The trip will be marked as closed.
        </p>
      </div>
    </div>
  );
}
