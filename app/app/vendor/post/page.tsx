'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Calendar, Clock, Truck, Package, Weight, IndianRupee, FileText, StickyNote, CheckCircle, AlertCircle } from 'lucide-react';
import type { AppTrip } from '@/lib/app-types';
import { demoUsers } from '@/lib/demo-users';
import { addVendorTrip } from '@/lib/vendor-trips';

// ─── Constants ────────────────────────────────────────────────────────────────
const VEHICLE_TYPES = [
  'Any Vehicle',
  'Truck (Light)',
  'Truck (Medium)',
  'Truck (Heavy)',
  'Mini Truck (Tata Ace)',
  'Container',
  'Tanker',
  'Trailer',
  'Pickup Van',
];

const LOAD_TYPES = [
  'General Goods',
  'Dry Goods',
  'Liquid/Chemicals',
  'Perishable',
  'Fragile',
  'Heavy Machinery',
  'Agricultural',
  'Other',
];

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function VendorPostPage() {
  const router = useRouter();
  const vendor = demoUsers.vendorPremium;

  const [form, setForm] = useState({
    fromCity: '',
    toCity: '',
    tripDate: '',
    tripTime: '',
    vehicleType: 'Any Vehicle',
    loadType: 'General Goods',
    weightTons: '',
    expectedFare: '',
    additionalDetails: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function set(key: keyof typeof form, value: string) {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  }

  function validate() {
    const e: typeof errors = {};
    if (!form.fromCity.trim()) e.fromCity = 'Pickup city is required';
    if (!form.toCity.trim()) e.toCity = 'Destination city is required';
    if (!form.tripDate) e.tripDate = 'Trip date is required';
    if (form.fromCity.trim().toLowerCase() === form.toCity.trim().toLowerCase()) {
      e.toCity = 'Destination must be different from pickup';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));

    const newTrip: AppTrip = {
      id: `TRP${Date.now()}`,
      vendorId: vendor.id,
      vendorName: vendor.name,
      vendorPhone: vendor.phone,
      fromCity: form.fromCity.trim(),
      toCity: form.toCity.trim(),
      fromState: 'Gujarat',
      toState: 'Gujarat',
      vehicleType: form.vehicleType,
      loadType: form.loadType,
      tripDate: form.tripDate,
      tripTime: form.tripTime || '09:00',
      expectedFare: form.expectedFare ? Number(form.expectedFare) : undefined,
      weightTons: form.weightTons ? Number(form.weightTons) : undefined,
      notes: form.additionalDetails || form.notes || undefined,
      status: 'open',
      isPremiumVendor: vendor.isPremium,
      contactsCount: 0,
      contactedDrivers: [],
      createdAt: new Date().toISOString(),
    };

    addVendorTrip(newTrip);
    setLoading(false);
    setSuccess(true);

    await new Promise(r => setTimeout(r, 900));
    router.push('/app/vendor/trips');
  }

  // ── Success screen
  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 gap-5"
        style={{ background: '#0D1117' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(34,197,94,0.15)' }}>
          <CheckCircle size={40} color="#22C55E" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#F0F6FC]">Trip Posted!</h2>
          <p className="text-[#8B949E] mt-2 text-sm leading-relaxed">
            Your trip from <span className="text-[#F0F6FC]">{form.fromCity}</span> to{' '}
            <span className="text-[#F0F6FC]">{form.toCity}</span> has been posted successfully.
            Drivers will start contacting you soon.
          </p>
        </div>
        <p className="text-xs text-[#8B949E]">Redirecting to your trips…</p>
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
          <h1 className="text-base font-semibold text-[#F0F6FC]">Post New Trip</h1>
          <p className="text-xs text-[#8B949E]">Fill in the details to find drivers</p>
        </div>
      </header>

      {/* ── Form ────────────────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 pb-10 pt-5 flex flex-col gap-5">

        {/* Route section */}
        <section>
          <h2 className="text-sm font-semibold text-[#8B949E] uppercase tracking-wider mb-3">Route</h2>
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #30363D' }}>

            {/* From */}
            <div className="relative" style={{ background: '#161B22' }}>
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <MapPin size={18} color="#22C55E" />
              </div>
              <input
                type="text"
                placeholder="Pickup city, e.g. Ahmedabad"
                value={form.fromCity}
                onChange={e => set('fromCity', e.target.value)}
                className="w-full pl-11 pr-4 py-4 bg-transparent text-[#F0F6FC] placeholder-[#8B949E] text-sm outline-none"
              />
            </div>

            <div className="h-px mx-4" style={{ background: '#30363D' }} />

            {/* To */}
            <div className="relative" style={{ background: '#161B22' }}>
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <MapPin size={18} color="#EF4444" />
              </div>
              <input
                type="text"
                placeholder="Destination city, e.g. Mumbai"
                value={form.toCity}
                onChange={e => set('toCity', e.target.value)}
                className="w-full pl-11 pr-4 py-4 bg-transparent text-[#F0F6FC] placeholder-[#8B949E] text-sm outline-none"
              />
            </div>
          </div>

          {(errors.fromCity || errors.toCity) && (
            <div className="mt-2 flex flex-col gap-1">
              {errors.fromCity && <FieldError msg={errors.fromCity} />}
              {errors.toCity && <FieldError msg={errors.toCity} />}
            </div>
          )}
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
                <input
                  type="date"
                  min={todayISO()}
                  value={form.tripDate}
                  onChange={e => set('tripDate', e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-xl text-sm outline-none text-[#F0F6FC]"
                  style={{ background: '#21262D', border: errors.tripDate ? '1px solid #EF4444' : '1px solid #30363D' }}
                />
              </div>
              {errors.tripDate && <FieldError msg={errors.tripDate} />}
            </div>

            <div>
              <label className="text-sm text-[#8B949E] mb-2 block">Trip Time</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Clock size={16} color="#8B949E" />
                </div>
                <input
                  type="time"
                  value={form.tripTime}
                  onChange={e => set('tripTime', e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-xl text-sm outline-none text-[#F0F6FC]"
                  style={{ background: '#21262D', border: '1px solid #30363D' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Vehicle & Load */}
        <section>
          <h2 className="text-sm font-semibold text-[#8B949E] uppercase tracking-wider mb-3">Vehicle & Cargo</h2>
          <div className="flex flex-col gap-3">

            <div>
              <label className="text-sm text-[#8B949E] mb-2 flex items-center gap-1.5 block">
                <Truck size={14} /> Vehicle Type
              </label>
              <select
                value={form.vehicleType}
                onChange={e => set('vehicleType', e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none text-[#F0F6FC]"
                style={{ background: '#21262D', border: '1px solid #30363D' }}
              >
                {VEHICLE_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm text-[#8B949E] mb-2 flex items-center gap-1.5 block">
                <Package size={14} /> Load Type
              </label>
              <select
                value={form.loadType}
                onChange={e => set('loadType', e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none text-[#F0F6FC]"
                style={{ background: '#21262D', border: '1px solid #30363D' }}
              >
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
              <input
                type="number"
                min="0"
                step="0.5"
                placeholder="e.g. 5"
                value={form.weightTons}
                onChange={e => set('weightTons', e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none text-[#F0F6FC] placeholder-[#8B949E]"
                style={{ background: '#21262D', border: '1px solid #30363D' }}
              />
            </div>

            <div>
              <label className="text-sm text-[#8B949E] mb-2 flex items-center gap-1.5 block">
                <IndianRupee size={14} /> Expected Fare
              </label>
              <input
                type="number"
                min="0"
                placeholder="Open to negotiate"
                value={form.expectedFare}
                onChange={e => set('expectedFare', e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none text-[#F0F6FC] placeholder-[#8B949E]"
                style={{ background: '#21262D', border: '1px solid #30363D' }}
              />
            </div>
          </div>
        </section>

        {/* Additional details */}
        <section>
          <div>
            <label className="text-sm text-[#8B949E] mb-2 flex items-center gap-1.5 block">
              <FileText size={14} /> Additional Details
            </label>
            <textarea
              rows={3}
              placeholder="Vehicle requirements, special instructions, hazmat info…"
              value={form.additionalDetails}
              onChange={e => set('additionalDetails', e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none text-[#F0F6FC] placeholder-[#8B949E] resize-none"
              style={{ background: '#21262D', border: '1px solid #30363D' }}
            />
          </div>

          <div className="mt-3">
            <label className="text-sm text-[#8B949E] mb-2 flex items-center gap-1.5 block">
              <StickyNote size={14} /> Internal Notes
              <span className="ml-auto text-xs text-[#8B949E]">Not shown to drivers</span>
            </label>
            <textarea
              rows={2}
              placeholder="Your private notes for this trip…"
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none text-[#F0F6FC] placeholder-[#8B949E] resize-none"
              style={{ background: '#21262D', border: '1px solid #30363D' }}
            />
          </div>
        </section>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 rounded-xl font-semibold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-70"
          style={{ background: '#F5A623', color: '#0D1117' }}
        >
          {loading ? (
            <>
              <span className="w-5 h-5 rounded-full border-2 border-[#0D1117]/30 border-t-[#0D1117] animate-spin" />
              Posting Trip…
            </>
          ) : (
            <>
              <Truck size={20} />
              Post Trip
            </>
          )}
        </button>

        <p className="text-center text-xs text-[#8B949E]">
          Drivers matching your route will be notified instantly
        </p>
      </form>
    </div>
  );
}

function FieldError({ msg }: { msg: string }) {
  return (
    <p className="flex items-center gap-1.5 text-xs mt-1.5" style={{ color: '#EF4444' }}>
      <AlertCircle size={12} />
      {msg}
    </p>
  );
}
