'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar, Clock, Truck, Package, Weight,
  IndianRupee, FileText, StickyNote, CheckCircle, AlertCircle, Timer,
} from 'lucide-react';
import type { AppTrip } from '@/lib/app-types';
import { useAppState } from '@/lib/app-state';
import TripsService from '@/lib/services/trips.service';
import LocationAutocomplete, { type LocationValue } from '@/components/app/LocationAutocomplete';
import AppShell from '@/components/app/AppShell';
import AppHeader from '@/components/app/AppHeader';

const IS_API_MODE = process.env.NEXT_PUBLIC_DATA_MODE === 'api';

const VEHICLE_TYPES = [
  'Any Vehicle', 'Truck (Light)', 'Truck (Medium)', 'Truck (Heavy)',
  'Mini Truck (Tata Ace)', 'Container', 'Tanker', 'Trailer', 'Pickup Van',
];

const LOAD_TYPES = [
  'General Goods', 'Dry Goods', 'Liquid/Chemicals', 'Perishable',
  'Fragile', 'Heavy Machinery', 'Agricultural', 'Other',
];

const EXPIRY_OPTIONS = [
  { label: '6 Hours', value: 6 },
  { label: '12 Hours', value: 12 },
  { label: '24 Hours', value: 24 },
  { label: '48 Hours', value: 48 },
];

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

export default function VendorPostPage() {
  const router = useRouter();
  const { state, dispatch } = useAppState();
  const vendor = state.currentUser!;

  const [fromLoc, setFromLoc] = useState<LocationValue>({ name: '', city: '', state: '' });
  const [toLoc, setToLoc]     = useState<LocationValue>({ name: '', city: '', state: '' });

  const [form, setForm] = useState({
    tripDate: '',
    tripTime: '',
    vehicleType: 'Any Vehicle',
    loadType: 'General Goods',
    weightTons: '',
    expectedFare: '',
    additionalDetails: '',
    notes: '',
    expiryHours: 24,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  function setField(key: keyof typeof form, value: string | number) {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => { const e = { ...prev }; delete e[key]; return e; });
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!fromLoc.city.trim()) e.fromCity = 'Pickup location is required';
    if (!toLoc.city.trim()) e.toCity = 'Destination is required';
    if (!form.tripDate) e.tripDate = 'Trip date is required';
    if (fromLoc.city.trim().toLowerCase() === toLoc.city.trim().toLowerCase() && fromLoc.city) {
      e.toCity = 'Destination must be different from pickup';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError('');

    if (IS_API_MODE) {
      try {
        await TripsService.postTrip({
          from_city:    fromLoc.city,
          from_state:   fromLoc.state || 'Unknown',
          to_city:      toLoc.city,
          to_state:     toLoc.state || 'Unknown',
          trip_date:    form.tripDate,
          trip_time:    form.tripTime || undefined,
          vehicle_type: form.vehicleType,
          load_type:    form.loadType,
          weight_tons:  form.weightTons ? Number(form.weightTons) : undefined,
          expected_fare:form.expectedFare ? Number(form.expectedFare) : undefined,
          notes:        form.additionalDetails || undefined,
          expiry_hours: form.expiryHours,
          lat_from:     fromLoc.lat,
          lng_from:     fromLoc.lng,
          lat_to:       toLoc.lat,
          lng_to:       toLoc.lng,
        });
        setSuccess(true);
        setTimeout(() => router.push('/app/vendor/trips'), 900);
      } catch (err: unknown) {
        setApiError(err instanceof Error ? err.message : 'Failed to post trip');
        setLoading(false);
      }
    } else {
      await new Promise(r => setTimeout(r, 1500));
      const newTrip: AppTrip = {
        id: `TRP${Date.now()}`,
        vendorId: vendor.id,
        vendorName: vendor.name,
        vendorPhone: vendor.phone ?? '',
        fromCity: fromLoc.city,
        toCity: toLoc.city,
        fromState: fromLoc.state || 'Unknown',
        toState: toLoc.state || 'Unknown',
        vehicleType: form.vehicleType,
        loadType: form.loadType,
        tripDate: form.tripDate,
        tripTime: form.tripTime || '09:00',
        expectedFare: form.expectedFare ? Number(form.expectedFare) : undefined,
        weightTons: form.weightTons ? Number(form.weightTons) : undefined,
        notes: form.additionalDetails || undefined,
        status: 'open',
        isPremiumVendor: vendor.isPremium,
        contactsCount: 0,
        contactedDrivers: [],
        createdAt: new Date().toISOString(),

      };
      dispatch({ type: 'ADD_TRIP', payload: newTrip });
      setLoading(false);
      setSuccess(true);
      setTimeout(() => router.push('/app/vendor/trips'), 900);
    }
  }

  if (success) {
    return (
      <AppShell>
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-5">
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)' }}>
            <CheckCircle size={40} color="#22C55E" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-[#F0F6FC]">Trip Posted!</h2>
            <p className="text-[#8B949E] mt-2 text-sm leading-relaxed">
              Your trip from <span className="text-[#F0F6FC]">{fromLoc.city}</span> to{' '}
              <span className="text-[#F0F6FC]">{toLoc.city}</span> has been posted.
              Drivers will start contacting you soon.
            </p>
          </div>
          <p className="text-xs text-[#8B949E]">Redirecting…</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <AppHeader title="Post New Trip" subtitle="Fill in the details to find drivers" showBack onBack={() => router.back()} />


      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 pb-10 pt-5 flex flex-col gap-5" style={{ backgroundColor: '#0D1117' }}>
        {apiError && (
          <div className="p-3 rounded-xl flex items-center gap-2" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
            <AlertCircle size={14} color="#EF4444" />
            <span className="text-xs" style={{ color: '#EF4444' }}>{apiError}</span>
          </div>
        )}

        {/* Route section — LocationAutocomplete */}
        <section>
          <h2 className="text-sm font-semibold text-[#8B949E] uppercase tracking-wider mb-3">Route</h2>
          <div className="flex flex-col gap-2">
            <LocationAutocomplete
              value={fromLoc.city}
              onChange={(loc) => setFromLoc(loc)}
              placeholder="Pickup city, e.g. Ahmedabad"
              pinColor="#22C55E"
              error={errors.fromCity}
            />
            <LocationAutocomplete
              value={toLoc.city}
              onChange={(loc) => setToLoc(loc)}
              placeholder="Destination city, e.g. Mumbai"
              pinColor="#EF4444"
              error={errors.toCity}
            />
          </div>
        </section>

        {/* Date & Time */}
        <section>
          <h2 className="text-sm font-semibold text-[#8B949E] uppercase tracking-wider mb-3">Schedule</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-[#8B949E] mb-2 block">Trip Date *</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Calendar size={16} color="#8B949E" />
                </div>
                <input type="date" min={todayISO()} value={form.tripDate}
                  onChange={e => setField('tripDate', e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-xl text-sm outline-none text-[#F0F6FC]"
                  style={{ background: '#21262D', border: errors.tripDate ? '1px solid #EF4444' : '1px solid #30363D' }} />
              </div>
              {errors.tripDate && <FieldError msg={errors.tripDate} />}
            </div>

            <div>
              <label className="text-sm text-[#8B949E] mb-2 block">Trip Time</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Clock size={16} color="#8B949E" />
                </div>
                <input type="time" value={form.tripTime}
                  onChange={e => setField('tripTime', e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-xl text-sm outline-none text-[#F0F6FC]"
                  style={{ background: '#21262D', border: '1px solid #30363D' }} />
              </div>
            </div>
          </div>
        </section>

        {/* Trip expiry */}
        <section>
          <h2 className="text-sm font-semibold text-[#8B949E] uppercase tracking-wider mb-3">
            <Timer size={13} className="inline mr-1" /> Trip Expires In
          </h2>
          <div className="flex gap-2 flex-wrap">
            {EXPIRY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setField('expiryHours', opt.value)}
                className="px-3 py-2 rounded-xl text-xs font-medium transition-all"
                style={{
                  background: form.expiryHours === opt.value ? '#F5A623' : '#21262D',
                  color: form.expiryHours === opt.value ? '#0D1117' : '#8B949E',
                  border: form.expiryHours === opt.value ? 'none' : '1px solid #30363D',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-xs mt-2" style={{ color: '#8B949E' }}>
            Trip will auto-expire and disappear from the feed after this time
          </p>
        </section>

        {/* Vehicle & Load */}
        <section>
          <h2 className="text-sm font-semibold text-[#8B949E] uppercase tracking-wider mb-3">Vehicle &amp; Cargo</h2>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-sm text-[#8B949E] mb-2 flex items-center gap-1.5 block">
                <Truck size={14} /> Vehicle Type
              </label>
              <select value={form.vehicleType} onChange={e => setField('vehicleType', e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none text-[#F0F6FC]"
                style={{ background: '#21262D', border: '1px solid #30363D' }}>
                {VEHICLE_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm text-[#8B949E] mb-2 flex items-center gap-1.5 block">
                <Package size={14} /> Load Type
              </label>
              <select value={form.loadType} onChange={e => setField('loadType', e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none text-[#F0F6FC]"
                style={{ background: '#21262D', border: '1px solid #30363D' }}>
                {LOAD_TYPES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* Weight & Fare */}
        <section>
          <h2 className="text-sm font-semibold text-[#8B949E] uppercase tracking-wider mb-3">Details (Optional)</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-[#8B949E] mb-2 flex items-center gap-1.5 block">
                <Weight size={14} /> Weight (Tons)
              </label>
              <input type="number" min="0" step="0.5" placeholder="e.g. 5"
                value={form.weightTons} onChange={e => setField('weightTons', e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none text-[#F0F6FC] placeholder-[#8B949E]"
                style={{ background: '#21262D', border: '1px solid #30363D' }} />
            </div>
            <div>
              <label className="text-sm text-[#8B949E] mb-2 flex items-center gap-1.5 block">
                <IndianRupee size={14} /> Expected Fare
              </label>
              <input type="number" min="0" placeholder="Open to negotiate"
                value={form.expectedFare} onChange={e => setField('expectedFare', e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none text-[#F0F6FC] placeholder-[#8B949E]"
                style={{ background: '#21262D', border: '1px solid #30363D' }} />
            </div>
          </div>
        </section>

        {/* Additional details */}
        <section>
          <div>
            <label className="text-sm text-[#8B949E] mb-2 flex items-center gap-1.5 block">
              <FileText size={14} /> Additional Details
            </label>
            <textarea rows={3} placeholder="Vehicle requirements, special instructions…"
              value={form.additionalDetails} onChange={e => setField('additionalDetails', e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none text-[#F0F6FC] placeholder-[#8B949E] resize-none"
              style={{ background: '#21262D', border: '1px solid #30363D' }} />
          </div>

          <div className="mt-3">
            <label className="text-sm text-[#8B949E] mb-2 flex items-center gap-1.5 block">
              <StickyNote size={14} /> Internal Notes
              <span className="ml-auto text-xs text-[#8B949E]">Not shown to drivers</span>
            </label>
            <textarea rows={2} placeholder="Your private notes…"
              value={form.notes} onChange={e => setField('notes', e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none text-[#F0F6FC] placeholder-[#8B949E] resize-none"
              style={{ background: '#21262D', border: '1px solid #30363D' }} />
          </div>
        </section>

        <button type="submit" disabled={loading}
          className="w-full h-14 rounded-xl font-semibold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-70"
          style={{ background: '#F5A623', color: '#0D1117' }}>
          {loading ? (
            <><span className="w-5 h-5 rounded-full border-2 border-[#0D1117]/30 border-t-[#0D1117] animate-spin" />Posting Trip…</>
          ) : (
            <><Truck size={20} />Post Trip</>
          )}
        </button>

        <p className="text-center text-xs text-[#8B949E]">
          Drivers matching your route will be notified instantly
        </p>
      </form>
    </AppShell>
  );
}

function FieldError({ msg }: { msg: string }) {
  return (
    <p className="flex items-center gap-1.5 text-xs mt-1.5" style={{ color: '#EF4444' }}>
      <AlertCircle size={12} />{msg}
    </p>
  );
}
