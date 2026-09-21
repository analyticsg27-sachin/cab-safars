'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Crown, MapPin, Calendar, Truck, Package, DollarSign,
  Phone, MessageCircle, Lock, Users, FileText,
} from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import AppHeader from '@/components/app/AppHeader';
import { useAppState } from '@/lib/app-state';
import { useTranslation } from '@/lib/useTranslation';
import TripsService from '@/lib/services/trips.service';
import type { TripDetail } from '@/lib/services/trips.service';
import { isApiMode } from '@/lib/services';

function timeAgo(dateStr: string | undefined | null) {
  if (!dateStr) return 'recently';
  // API returns "2026-09-21 12:40:43" — replace space with T for valid ISO parse
  const diff = Date.now() - new Date(dateStr.replace(' ', 'T')).getTime();
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (isNaN(diff) || h < 1) return 'just now';
  if (h < 24) return `${h} hour${h !== 1 ? 's' : ''} ago`;
  return `${d} day${d !== 1 ? 's' : ''} ago`;
}

function formatPhone(phone: string | undefined | null) {
  if (!phone) return '';
  return phone.replace(/\s+/g, '').replace('+', '');
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid #30363D' }}>
      <div className="flex items-center gap-2">
        <Icon size={14} style={{ color: '#8B949E' }} />
        <span className="text-sm" style={{ color: '#8B949E' }}>{label}</span>
      </div>
      <span className="text-sm font-medium" style={{ color: '#F0F6FC' }}>{value}</span>
    </div>
  );
}

function TripDetailInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state } = useAppState();
  const { t } = useTranslation();
  const isPremiumDriver = state.currentUser?.isPremium ?? false;

  const id = searchParams.get('id') ?? '';
  const [trip, setTrip] = useState<TripDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contactLogged, setContactLogged] = useState<'call' | 'whatsapp' | null>(null);

  useEffect(() => {
    if (!id) { setLoading(false); setError('No trip ID'); return; }
    if (isApiMode()) {
      TripsService.getDriverTripDetail(id)
        .then(setTrip)
        .catch(() => setError('Trip not found'))
        .finally(() => setLoading(false));
    } else {
      // demo mode: look up from local state trips (passed via state)
      setLoading(false);
      setError('Trip not found in demo mode');
    }
  }, [id]);

  async function handleContact(method: 'call' | 'whatsapp') {
    if (!trip) return;
    try { await TripsService.logContact(trip.id, method); } catch { /* ignore */ }
    setContactLogged(method);
  }

  if (loading) {
    return (
      <AppShell>
        <AppHeader title={t('trip_details')} showBack onBack={() => router.back()} />
        <main className="flex-1 flex items-center justify-center">
          <p style={{ color: '#8B949E' }}>Loading…</p>
        </main>
      </AppShell>
    );
  }

  if (error || !trip) {
    return (
      <AppShell>
        <AppHeader title={t('trip_details')} showBack onBack={() => router.back()} />
        <main className="flex-1 flex flex-col items-center justify-center px-4 pb-24">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#21262D' }}>
            <Truck size={28} style={{ color: '#8B949E' }} />
          </div>
          <p className="font-semibold mb-1" style={{ color: '#F0F6FC' }}>{t('trip_not_found')}</p>
          <p className="text-sm text-center mb-5" style={{ color: '#8B949E' }}>{t('trip_not_found_desc')}</p>
          <button
            className="text-sm font-semibold px-6 py-3 rounded-xl"
            style={{ backgroundColor: '#F5A623', color: '#0D1117' }}
            onClick={() => router.push('/app/driver/trips')}
          >
            {t('browse_all_trips')}
          </button>
        </main>
      </AppShell>
    );
  }

  const waPhone = trip.vendor_phone ? formatPhone(trip.vendor_phone) : '';

  return (
    <AppShell>
      <AppHeader title={t('trip_details')} showBack onBack={() => router.back()} />

      <main className="flex-1 overflow-y-auto px-4 pb-10 pt-5">
        {/* Route card */}
        <div className="rounded-2xl border p-4 mb-4" style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs px-2 py-1 rounded" style={{ backgroundColor: '#21262D', color: '#8B949E' }}>
              {trip.id}
            </span>
            {trip.is_premium_vendor && (
              <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: 'rgba(245,166,35,0.12)', color: '#F5A623' }}>
                <Crown size={10} /> {t('premium_vendor')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mb-1">
            <MapPin size={16} style={{ color: '#F5A623' }} />
            <span className="text-2xl font-bold" style={{ color: '#F0F6FC' }}>
              {trip.from_city} → {trip.to_city}
            </span>
          </div>
          <p className="text-xs mb-4 pl-6" style={{ color: '#8B949E' }}>
            {trip.from_state} → {trip.to_state} · Posted {timeAgo(trip.created_at)}
          </p>

          <div style={{ borderTop: '1px solid #30363D' }}>
            <InfoRow icon={Calendar} label={t('date_time')} value={`${trip.trip_date} · ${trip.trip_time}`} />
            <InfoRow icon={Truck} label={t('vehicle_type')} value={trip.vehicle_type} />
            <InfoRow icon={Package} label={t('load_type')} value={trip.load_type} />
            {trip.weight_tons != null && (
              <InfoRow icon={Package} label={t('weight')} value={`${trip.weight_tons} Ton${trip.weight_tons !== 1 ? 's' : ''}`} />
            )}
            {trip.expected_fare != null && (
              <InfoRow icon={DollarSign} label={t('expected_fare')} value={`₹${trip.expected_fare.toLocaleString('en-IN')}`} />
            )}
            {trip.contacts_count > 0 && (
              <InfoRow icon={Users} label={t('contacts_made')} value={`${trip.contacts_count} driver${trip.contacts_count !== 1 ? 's' : ''}`} />
            )}
          </div>
        </div>

        {/* Vendor info */}
        {trip.vendor_name && (
          <div className="rounded-2xl border p-4 mb-4" style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#8B949E' }}>{t('trip_provider')}</p>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ backgroundColor: 'rgba(245,166,35,0.15)', color: '#F5A623' }}>
                {trip.vendor_name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold" style={{ color: '#F0F6FC' }}>{trip.vendor_name}</p>
                <p className="text-xs" style={{ color: '#8B949E' }}>{trip.vendor_city ?? ''} · {t('verified_provider')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Contact section */}
        <div className="rounded-2xl border p-4 mb-4" style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#8B949E' }}>{t('contact_provider')}</p>

          {isPremiumDriver && !trip.is_contact_locked ? (
            <>
              {contactLogged && (
                <p className="text-xs text-center mb-3" style={{ color: '#22C55E' }}>✓ Contact logged</p>
              )}
              <div className="grid grid-cols-2 gap-3 mb-2">
                <a href={`tel:${trip.vendor_phone}`}
                  onClick={() => handleContact('call')}
                  className="flex flex-col items-center justify-center gap-2 py-4 rounded-xl"
                  style={{ backgroundColor: 'rgba(45,107,228,0.12)', border: '1px solid rgba(45,107,228,0.35)', color: '#2D6BE4', textDecoration: 'none' }}>
                  <Phone size={22} />
                  <span className="text-sm font-semibold">{t('call_provider')}</span>
                  <span className="text-[10px]" style={{ color: '#2D6BE4', opacity: 0.8 }}>{trip.vendor_phone}</span>
                </a>
                <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noopener noreferrer"
                  onClick={() => handleContact('whatsapp')}
                  className="flex flex-col items-center justify-center gap-2 py-4 rounded-xl"
                  style={{ backgroundColor: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)', color: '#25D366', textDecoration: 'none' }}>
                  <MessageCircle size={22} />
                  <span className="text-sm font-semibold">WhatsApp</span>
                  <span className="text-[10px]" style={{ color: '#25D366', opacity: 0.7 }}>{t('open_chat')}</span>
                </a>
              </div>
              <p className="text-center text-xs" style={{ color: '#8B949E' }}>{t('contact_logged')}</p>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button onClick={() => router.push('/app/subscription')}
                  className="flex flex-col items-center justify-center gap-1.5 py-4 rounded-xl transition-all active:scale-95"
                  style={{ backgroundColor: 'rgba(45,107,228,0.08)', border: '1px solid rgba(45,107,228,0.2)' }}>
                  <div className="relative">
                    <Phone size={22} style={{ color: '#2D6BE4', opacity: 0.6 }} />
                    <div className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F5A623' }}>
                      <Lock size={9} style={{ color: '#0D1117' }} />
                    </div>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: '#2D6BE4', opacity: 0.8 }}>{t('call_provider')}</span>
                  <span className="text-[10px] tracking-widest" style={{ color: '#8B949E' }}>●●●●● ●●●●●</span>
                </button>
                <button onClick={() => router.push('/app/subscription')}
                  className="flex flex-col items-center justify-center gap-1.5 py-4 rounded-xl transition-all active:scale-95"
                  style={{ backgroundColor: 'rgba(37,211,102,0.06)', border: '1px solid rgba(37,211,102,0.2)' }}>
                  <div className="relative">
                    <MessageCircle size={22} style={{ color: '#25D366', opacity: 0.5 }} />
                    <div className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F5A623' }}>
                      <Lock size={9} style={{ color: '#0D1117' }} />
                    </div>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: '#25D366', opacity: 0.7 }}>WhatsApp</span>
                  <span className="text-[10px] tracking-widest" style={{ color: '#8B949E' }}>●●●●● ●●●●●</span>
                </button>
              </div>

              <div className="rounded-xl p-4"
                style={{ background: 'linear-gradient(135deg, rgba(245,166,35,0.08), rgba(245,166,35,0.03))', border: '1px solid rgba(245,166,35,0.35)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <Crown size={16} style={{ color: '#F5A623' }} />
                  <span className="font-bold text-sm" style={{ color: '#F0F6FC' }}>{t('unlock_provider_contacts')}</span>
                </div>
                <p className="text-xs mb-3" style={{ color: '#8B949E' }}>{t('unlock_contacts_desc')}</p>
                <div className="flex gap-4 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Phone size={12} style={{ color: '#22C55E' }} />
                    <span className="text-xs font-medium" style={{ color: '#CBD5E1' }}>{t('direct_call')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageCircle size={12} style={{ color: '#25D366' }} />
                    <span className="text-xs font-medium" style={{ color: '#CBD5E1' }}>{t('whatsapp_chat')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={12} style={{ color: '#2D6BE4' }} />
                    <span className="text-xs font-medium" style={{ color: '#CBD5E1' }}>{t('contact_log')}</span>
                  </div>
                </div>
                <button
                  className="w-full py-3 rounded-xl text-sm font-bold"
                  style={{ backgroundColor: '#F5A623', color: '#0D1117' }}
                  onClick={() => router.push('/app/subscription')}
                >
                  {t('upgrade_price_btn')}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Notes */}
        {trip.notes && (
          <div className="rounded-2xl border p-4" style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}>
            <div className="flex items-center gap-2 mb-2">
              <FileText size={14} style={{ color: '#8B949E' }} />
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8B949E' }}>{t('notes')}</p>
            </div>
            <p className="text-sm" style={{ color: '#F0F6FC' }}>{trip.notes}</p>
          </div>
        )}
      </main>
    </AppShell>
  );
}

export default function DriverTripDetailPage() {
  return (
    <Suspense fallback={null}>
      <TripDetailInner />
    </Suspense>
  );
}
