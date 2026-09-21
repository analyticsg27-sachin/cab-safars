'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Calendar, Clock, Truck, Package, IndianRupee,
  FileText, Users, Phone, MessageCircle, Crown, X, ChevronRight, Hash, Lock,
} from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import { useAppState } from '@/lib/app-state';
import { useTranslation } from '@/lib/useTranslation';
import TripsService from '@/lib/services/trips.service';
import type { TripDetail } from '@/lib/services/trips.service';
import { isApiMode } from '@/lib/services';
import { isFullyActive } from '@/components/app/AccountStatusBanner';

function StatusBadge({ status }: { status?: string }) {
  const color = status === 'active' || status === 'open' ? '#22C55E' : '#8B949E';
  return (
    <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}>
      {status ?? 'active'}
    </span>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-3" style={{ borderBottom: '1px solid #1C2128' }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#1C2128' }}>
        {icon}
      </div>
      <div className="flex-1 flex items-center justify-between">
        <span className="text-sm text-[#8B949E]">{label}</span>
        <span className="text-sm font-medium text-[#F0F6FC]">{value}</span>
      </div>
    </div>
  );
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function VendorTripDetailInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state } = useAppState();
  const { t } = useTranslation();

  const id = searchParams.get('id') ?? '';
  const isPremium = state.currentUser?.isPremium ?? false;

  const [trip, setTrip] = useState<TripDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [closing, setClosing] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (!id) { setLoading(false); setError('No trip ID'); return; }
    if (isApiMode()) {
      TripsService.getTripDetail(id)
        .then(setTrip)
        .catch(() => setError('Trip not found'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setError('Demo mode: trip not found');
    }
  }, [id]);

  async function handleClose() {
    if (!trip) return;
    setClosing(true);
    try {
      await TripsService.closeTrip(trip.id, { closure_type: 'outside_driver' });
      setClosed(true);
      setTimeout(() => router.back(), 600);
    } catch {
      setClosing(false);
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex-1 flex items-center justify-center">
          <p style={{ color: '#8B949E' }}>Loading…</p>
        </div>
      </AppShell>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center" style={{ background: '#0D1117' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)' }}>
          <X size={28} color="#EF4444" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#F0F6FC]">{t('trip_not_found')}</h2>
          <p className="text-sm text-[#8B949E] mt-1">{t('trip_not_found_v_desc')}</p>
        </div>
        <button onClick={() => router.push('/app/vendor/trips')}
          className="px-5 py-3 rounded-xl font-semibold text-sm"
          style={{ background: '#F5A623', color: '#0D1117' }}>
          {t('back_to_trips')}
        </button>
      </div>
    );
  }

  const isActive = trip.status === 'active';
  const contacts = trip.contacted_drivers ?? [];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D1117' }}>
      <header className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3"
        style={{ background: '#0D1117', borderBottom: '1px solid #30363D', minHeight: 56 }}>
        <button onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-xl"
          style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <ArrowLeft size={20} color="#F0F6FC" />
        </button>
        <div className="flex-1">
          <h1 className="text-base font-semibold text-[#F0F6FC]">{t('trip_details')}</h1>
        </div>
        <StatusBadge status={trip.status} />
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-10 pt-4 flex flex-col gap-4">
        {/* Route card */}
        <div className="rounded-2xl p-5" style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <div className="flex items-start gap-3 mb-4">
            <div className="flex flex-col items-center gap-1 pt-0.5">
              <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: '#22C55E' }} />
              <div className="w-0.5 h-6" style={{ background: 'linear-gradient(#22C55E,#EF4444)' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#EF4444' }} />
            </div>
            <div className="flex-1">
              <p className="text-2xl font-bold text-[#F0F6FC] leading-tight">{trip.from_city}</p>
              <p className="text-sm text-[#8B949E] mt-0.5">{trip.from_state}</p>
              <div className="my-3" />
              <p className="text-2xl font-bold text-[#F0F6FC] leading-tight">{trip.to_city}</p>
              <p className="text-sm text-[#8B949E] mt-0.5">{trip.to_state}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: '#1C2128' }}>
            <Hash size={14} color="#8B949E" />
            <span className="font-mono text-sm text-[#F0F6FC]">{trip.id}</span>
          </div>
        </div>

        {/* Info rows */}
        <div className="rounded-2xl px-4" style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <InfoRow icon={<Calendar size={16} color="#F5A623" />} label={t('trip_date_lbl')} value={trip.trip_date} />
          <InfoRow icon={<Clock size={16} color="#F5A623" />} label={t('departure_time')} value={trip.trip_time} />
          <InfoRow icon={<Truck size={16} color="#8B949E" />} label={t('vehicle_type')} value={trip.vehicle_type} />
          <InfoRow icon={<Package size={16} color="#8B949E" />} label={t('load_type')} value={trip.load_type} />
          {trip.weight_tons != null && (
            <InfoRow icon={<Package size={16} color="#8B949E" />} label={t('weight')} value={`${trip.weight_tons} Tons`} />
          )}
          {trip.expected_fare != null && (
            <InfoRow icon={<IndianRupee size={16} color="#22C55E" />} label={t('expected_fare')} value={`₹${trip.expected_fare.toLocaleString('en-IN')}`} />
          )}
          {trip.notes && (
            <div className="py-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#1C2128' }}>
                  <FileText size={16} color="#8B949E" />
                </div>
                <p className="text-xs text-[#8B949E]">{t('notes')}</p>
              </div>
              <p className="text-sm text-[#F0F6FC] leading-relaxed ml-11">{trip.notes}</p>
            </div>
          )}
        </div>

        {/* Closure info */}
        {trip.closure && (
          <div className="rounded-2xl p-4" style={{ background: '#161B22', border: '1px solid #30363D' }}>
            <h3 className="text-sm font-semibold text-[#F0F6FC] mb-3">{t('closure_details')}</h3>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: trip.closure.type === 'app_driver' ? 'rgba(34,197,94,0.15)' : 'rgba(139,148,158,0.15)' }}>
                {trip.closure.type === 'app_driver' ? <Crown size={18} color="#22C55E" /> : <Users size={18} color="#8B949E" />}
              </div>
              <div>
                <p className="text-sm font-medium text-[#F0F6FC]">
                  {trip.closure.type === 'app_driver' ? t('closed_app_driver') : t('closed_outside_driver')}
                </p>
                {trip.closure.notes && <p className="text-xs text-[#8B949E] mt-0.5">{trip.closure.notes}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Contacted Drivers */}
        <div className="rounded-2xl p-4" style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-[#F0F6FC]">{t('contacted_drivers')}</h3>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)' }}>
              <Users size={12} color="#F5A623" />
              <span className="text-xs font-semibold" style={{ color: '#F5A623' }}>{trip.contacts_count}</span>
            </div>
          </div>

          {trip.contacts_count === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(139,148,158,0.1)' }}>
                <Users size={22} color="#8B949E" />
              </div>
              <p className="text-sm font-medium text-[#F0F6FC]">{isActive ? t('no_drivers_yet') : t('no_contact_records')}</p>
              <p className="text-xs text-[#8B949E] leading-relaxed">
                {isActive ? t('drivers_appear_here') : t('no_drivers_recorded')}
              </p>
            </div>
          ) : !isPremium ? (
            <div>
              {contacts.slice(0, trip.contacts_count).map((d) => (
                <div key={d.driver_id} className="flex items-center gap-3 py-3" style={{ borderBottom: '1px solid #1C2128' }}>
                  <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                    style={{ background: '#21262D', color: '#8B949E' }}>
                    {initials(d.driver_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#F0F6FC]">{d.driver_name}</p>
                    <p className="text-xs text-[#8B949E]">{d.city} · {d.vehicle_type}</p>
                    <p className="text-xs mt-0.5 blur-sm select-none" style={{ color: '#8B949E' }}>+91 XXXXX XXXXX</p>
                  </div>
                  <Lock size={14} color="#F5A623" />
                </div>
              ))}
              <button onClick={() => router.push('/app/subscription')}
                className="w-full flex items-center justify-between mt-3 p-4 rounded-2xl transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg,rgba(245,166,35,0.1),rgba(245,166,35,0.05))', border: '1px solid rgba(245,166,35,0.3)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(245,166,35,0.15)' }}>
                    <Crown size={18} color="#F5A623" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold" style={{ color: '#F5A623' }}>{t('unlock_all_contacts')}</p>
                    <p className="text-xs text-[#8B949E]">{t('upgrade_premium_price')}</p>
                  </div>
                </div>
                <ChevronRight size={16} color="#F5A623" />
              </button>
            </div>
          ) : (
            <div>
              {contacts.map((d) => (
                <div key={d.driver_id} className="flex items-center gap-3 py-3" style={{ borderBottom: '1px solid #1C2128' }}>
                  <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                    style={{ background: 'rgba(245,166,35,0.15)', color: '#F5A623' }}>
                    {initials(d.driver_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#F0F6FC]">{d.driver_name}</p>
                    <p className="text-xs text-[#8B949E]">{d.city} · {d.vehicle_type}</p>
                    <p className="text-xs mt-0.5 font-mono" style={{ color: '#8B949E' }}>{d.driver_phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <a href={`tel:${d.driver_phone}`}
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(45,107,228,0.12)', border: '1px solid rgba(45,107,228,0.3)' }}>
                      <Phone size={15} color="#2D6BE4" />
                    </a>
                    <a href={`https://wa.me/${d.driver_phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.25)' }}>
                      <MessageCircle size={15} color="#25D366" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Close trip button */}
        {state.currentUser && isFullyActive(state.currentUser) && isActive && (
          <button
            onClick={handleClose}
            disabled={closing || closed}
            className="w-full h-14 rounded-xl font-semibold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            style={{ background: closing ? '#0D1117' : '#161B22', border: '1px solid rgba(239,68,68,0.4)', color: '#EF4444' }}>
            {closed ? t('closing') : closing ? t('closing') : t('mark_as_closed')}
          </button>
        )}
      </main>
    </div>
  );
}

export default function VendorTripDetailPage() {
  return (
    <Suspense fallback={null}>
      <VendorTripDetailInner />
    </Suspense>
  );
}
