'use client';

import { useParams, useRouter } from 'next/navigation';
import {
  Crown, MapPin, Calendar, Truck, Package, Weight, DollarSign,
  Phone, MessageCircle, Lock, ArrowLeft, Users, FileText,
} from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import AppHeader from '@/components/app/AppHeader';
import { useAppState } from '@/lib/app-state';


function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h} hour${h !== 1 ? 's' : ''} ago`;
  return `${d} day${d !== 1 ? 's' : ''} ago`;
}

function formatPhone(phone: string) {
  return phone.replace(/\s+/g, '').replace('+', '');
}

// ─── Info row ─────────────────────────────────────────────────────────────────
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TripDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { state } = useAppState();
  const isPremiumDriver = state.currentUser?.isPremium ?? false;
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
  const trip = state.trips.find((t) => t.id === id);

  if (!trip) {
    return (
      <AppShell>
        <AppHeader title="Trip Details" showBack onBack={() => router.back()} />
        <main className="flex-1 flex flex-col items-center justify-center px-4 pb-24">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: '#21262D' }}
          >
            <Truck size={28} style={{ color: '#8B949E' }} />
          </div>
          <p className="font-semibold mb-1" style={{ color: '#F0F6FC' }}>Trip not found</p>
          <p className="text-sm text-center mb-5" style={{ color: '#8B949E' }}>
            The trip you are looking for does not exist or has been removed.
          </p>
          <button
            className="text-sm font-semibold px-6 py-3 rounded-xl"
            style={{ backgroundColor: '#F5A623', color: '#0D1117' }}
            onClick={() => router.push('/app/driver/trips')}
          >
            Browse All Trips
          </button>
        </main>
      </AppShell>
    );
  }

  const waPhone = formatPhone(trip.vendorPhone);

  return (
    <AppShell>
      <AppHeader title="Trip Details" showBack onBack={() => router.back()} />

      <main className="flex-1 overflow-y-auto px-4 pb-10 pt-5">
        {/* Route card */}
        <div
          className="rounded-2xl border p-4 mb-4"
          style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}
        >
          {/* Trip ID + Premium badge */}
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs px-2 py-1 rounded" style={{ backgroundColor: '#21262D', color: '#8B949E' }}>
              {trip.id}
            </span>
            {trip.isPremiumVendor && (
              <span
                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: 'rgba(245,166,35,0.12)', color: '#F5A623' }}
              >
                <Crown size={10} /> Premium Vendor
              </span>
            )}
          </div>

          {/* Route */}
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={16} style={{ color: '#F5A623' }} />
            <span className="text-2xl font-bold" style={{ color: '#F0F6FC' }}>
              {trip.fromCity} → {trip.toCity}
            </span>
          </div>
          <p className="text-xs mb-4 pl-6" style={{ color: '#8B949E' }}>
            {trip.fromState} → {trip.toState} · Posted {timeAgo(trip.createdAt)}
          </p>

          {/* Details */}
          <div style={{ borderTop: '1px solid #30363D' }}>
            <InfoRow icon={Calendar} label="Date & Time" value={`${trip.tripDate} · ${trip.tripTime}`} />
            <InfoRow icon={Truck} label="Vehicle Type" value={trip.vehicleType} />
            <InfoRow icon={Package} label="Load Type" value={trip.loadType} />
            {trip.weightTons != null && (
              <InfoRow icon={Weight} label="Weight" value={`${trip.weightTons} Ton${trip.weightTons !== 1 ? 's' : ''}`} />
            )}
            {trip.expectedFare != null && (
              <InfoRow icon={DollarSign} label="Expected Fare" value={`₹${trip.expectedFare.toLocaleString('en-IN')}`} />
            )}
            {trip.contactsCount > 0 && (
              <InfoRow icon={Users} label="Contacts Made" value={`${trip.contactsCount} driver${trip.contactsCount !== 1 ? 's' : ''}`} />
            )}
          </div>
        </div>

        {/* Vendor info card */}
        <div
          className="rounded-2xl border p-4 mb-4"
          style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#8B949E' }}>Vendor</p>
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ backgroundColor: 'rgba(245,166,35,0.15)', color: '#F5A623' }}
            >
              {trip.vendorName.charAt(0)}
            </div>
            <div>
              <p className="font-semibold" style={{ color: '#F0F6FC' }}>{trip.vendorName}</p>
              <p className="text-xs" style={{ color: '#8B949E' }}>Verified Vendor</p>
            </div>
          </div>
        </div>

        {/* Contact section */}
        <div
          className="rounded-2xl border p-4 mb-4"
          style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#8B949E' }}>Contact Vendor</p>

          {isPremiumDriver ? (
            <>
              <div className="grid grid-cols-2 gap-3 mb-2">
                {/* Call */}
                <a
                  href={`tel:${trip.vendorPhone}`}
                  className="flex flex-col items-center justify-center gap-2 py-4 rounded-xl"
                  style={{
                    backgroundColor: 'rgba(34,197,94,0.1)',
                    border: '1px solid rgba(34,197,94,0.3)',
                    color: '#22C55E',
                    textDecoration: 'none',
                  }}
                >
                  <Phone size={22} />
                  <span className="text-sm font-semibold">Call Vendor</span>
                </a>
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${waPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-2 py-4 rounded-xl"
                  style={{
                    backgroundColor: 'rgba(37,211,102,0.1)',
                    border: '1px solid rgba(37,211,102,0.3)',
                    color: '#25D366',
                    textDecoration: 'none',
                  }}
                >
                  <MessageCircle size={22} />
                  <span className="text-sm font-semibold">WhatsApp</span>
                </a>
              </div>
              <p className="text-center text-xs" style={{ color: '#8B949E' }}>
                Contact logged · Premium feature
              </p>
            </>
          ) : (
            <>
              {/* Locked buttons */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {['Call Vendor', 'WhatsApp'].map((label) => (
                  <div
                    key={label}
                    className="relative flex flex-col items-center justify-center gap-2 py-4 rounded-xl"
                    style={{ backgroundColor: '#21262D', border: '1px solid #30363D' }}
                  >
                    <div
                      className="absolute inset-0 rounded-xl flex flex-col items-center justify-center gap-1 backdrop-blur-sm"
                      style={{ backgroundColor: 'rgba(13,17,23,0.75)' }}
                    >
                      <Lock size={18} style={{ color: '#8B949E' }} />
                      <span className="text-xs font-medium" style={{ color: '#8B949E' }}>Premium Required</span>
                    </div>
                    {label === 'Call Vendor' ? <Phone size={22} style={{ color: '#30363D' }} /> : <MessageCircle size={22} style={{ color: '#30363D' }} />}
                    <span className="text-sm font-semibold" style={{ color: '#30363D' }}>{label}</span>
                  </div>
                ))}
              </div>

              {/* Upgrade card */}
              <div
                className="rounded-xl p-4"
                style={{ backgroundColor: '#21262D', border: '1px solid rgba(245,166,35,0.3)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Crown size={16} style={{ color: '#F5A623' }} />
                  <span className="font-semibold text-sm" style={{ color: '#F0F6FC' }}>Unlock Vendor Contacts</span>
                </div>
                <p className="text-xs mb-3" style={{ color: '#8B949E' }}>
                  Get direct access to all vendor phone numbers
                </p>
                <ul className="text-xs space-y-1 mb-3" style={{ color: '#8B949E' }}>
                  {['Direct call access', 'WhatsApp vendor', 'Contact history'].map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span style={{ color: '#22C55E' }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full py-3 rounded-xl text-sm font-semibold"
                  style={{ backgroundColor: '#F5A623', color: '#0D1117' }}
                  onClick={() => router.push('/app/subscription')}
                >
                  Upgrade for ₹199/month
                </button>
              </div>
            </>
          )}
        </div>

        {/* Notes */}
        {trip.notes && (
          <div
            className="rounded-2xl border p-4"
            style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <FileText size={14} style={{ color: '#8B949E' }} />
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8B949E' }}>Notes</p>
            </div>
            <p className="text-sm" style={{ color: '#F0F6FC' }}>{trip.notes}</p>
          </div>
        )}
      </main>
    </AppShell>
  );
}
