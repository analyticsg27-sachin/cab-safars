'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User, Phone, Mail, MapPin, Truck, Building2, Crown, Pencil, Check, X,
  ShieldCheck, Star, Calendar, TrendingUp, FileText, ChevronRight, Clock,
} from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import AppHeader from '@/components/app/AppHeader';
import { useAppState } from '@/lib/app-state';

export default function MyDetailsPage() {
  const router = useRouter();
  const { state, dispatch } = useAppState();
  const user = state.currentUser;

  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [draftPhone, setDraftPhone] = useState('');
  const [draftCity, setDraftCity] = useState('');

  if (!user) { router.replace('/app/'); return null; }

  const roleLabel = user.role === 'vendor' ? 'Trip Provider' : 'Driver';
  const isVendor = user.role === 'vendor';

  function startEdit() {
    if (!user) return;
    setDraftName(user.name);
    setDraftPhone(user.phone);
    setDraftCity(user.city || '');
    setEditing(true);
  }

  function saveEdit() {
    if (!user) return;
    dispatch({ type: 'UPDATE_USER', payload: { name: draftName.trim() || user.name, phone: draftPhone.trim() || user.phone, city: draftCity.trim() || user.city } });
    setEditing(false);
  }

  // Demo stats per role
  const stats = isVendor
    ? [
        { label: 'Trips Posted', value: '12', icon: TrendingUp, color: '#F5A623' },
        { label: 'Drivers Hired', value: '8', icon: User, color: '#2D6BE4' },
        { label: 'Avg. Rating', value: '4.7★', icon: Star, color: '#22C55E' },
        { label: 'Member Since', value: 'Jan 2024', icon: Calendar, color: '#8B949E' },
      ]
    : [
        { label: 'Trips Done', value: '34', icon: TrendingUp, color: '#F5A623' },
        { label: 'Trips Upcoming', value: '2', icon: Clock, color: '#2D6BE4' },
        { label: 'Avg. Rating', value: '4.8★', icon: Star, color: '#22C55E' },
        { label: 'Member Since', value: 'Mar 2024', icon: Calendar, color: '#8B949E' },
      ];

  const planColor = user.isPremium ? '#F5A623' : '#8B949E';
  const planBg = user.isPremium ? 'rgba(245,166,35,0.08)' : 'rgba(139,148,158,0.06)';
  const planBorder = user.isPremium ? 'rgba(245,166,35,0.3)' : '#30363D';

  return (
    <AppShell>
      <AppHeader title="My Details" showBack onBack={() => router.back()} />
      <main className="flex-1 overflow-y-auto pb-10">

        {/* Hero profile header */}
        <div className="px-4 pt-6 pb-4 flex flex-col items-center">
          {/* Avatar */}
          <div className="relative mb-3">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#21262D', border: '3px solid #F5A623' }}
            >
              <span className="text-3xl font-bold" style={{ color: '#F5A623' }}>
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            {/* Verified badge */}
            <div
              className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#22C55E', border: '2px solid #0D1117' }}
            >
              <ShieldCheck size={12} color="#fff" />
            </div>
          </div>
          <p className="text-xl font-bold mb-1" style={{ color: '#F0F6FC' }}>{user.name}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(245,166,35,0.12)', color: '#F5A623' }}>
              {roleLabel}
            </span>
            {user.isPremium && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1" style={{ backgroundColor: 'rgba(245,166,35,0.18)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.3)' }}>
                <Crown size={10} /> Premium
              </span>
            )}
          </div>
          <p className="text-xs mt-1.5" style={{ color: '#8B949E' }}>
            <MapPin size={11} className="inline mr-0.5" />{user.city || 'India'}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2 px-4 mb-4">
          {stats.map(s => (
            <div
              key={s.label}
              className="rounded-xl p-2.5 flex flex-col items-center gap-1"
              style={{ backgroundColor: '#161B22', border: '1px solid #30363D' }}
            >
              <span className="text-base font-black" style={{ color: s.color }}>{s.value}</span>
              <span className="text-[9px] text-center leading-tight" style={{ color: '#8B949E' }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Plan / subscription card */}
        <div className="mx-4 mb-4 rounded-2xl p-4 flex items-center gap-3" style={{ backgroundColor: planBg, border: `1px solid ${planBorder}` }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: user.isPremium ? 'rgba(245,166,35,0.12)' : '#21262D' }}>
            <Crown size={18} style={{ color: planColor }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold" style={{ color: planColor }}>
              {user.isPremium ? 'Premium Plan Active' : 'Free Plan'}
            </p>
            <p className="text-xs" style={{ color: '#8B949E' }}>
              {user.isPremium
                ? `Expires: ${user.premiumExpiry ?? 'N/A'} · Direct contact unlocked`
                : 'Upgrade to call & WhatsApp directly'}
            </p>
          </div>
          {!user.isPremium && (
            <button
              onClick={() => router.push('/app/subscription')}
              className="text-xs font-bold px-3 py-2 rounded-xl shrink-0"
              style={{ backgroundColor: '#F5A623', color: '#0D1117' }}
            >
              Upgrade
            </button>
          )}
        </div>

        {/* Editable fields */}
        <div className="px-4 mb-1">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#8B949E' }}>Personal Info</p>
        </div>
        <div className="mx-4 rounded-2xl border overflow-hidden mb-3" style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}>
          {[
            { icon: User, label: 'Full Name', key: 'name', value: user.name, draft: draftName, set: setDraftName, type: 'text' },
            { icon: Phone, label: 'Phone', key: 'phone', value: user.phone, draft: draftPhone, set: setDraftPhone, type: 'tel' },
            { icon: MapPin, label: 'City', key: 'city', value: user.city || '—', draft: draftCity, set: setDraftCity, type: 'text' },
          ].map(({ icon: Icon, label, value, draft, set, type }, i, arr) => (
            <div key={label} className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: i < arr.length - 1 ? '1px solid #30363D' : 'none' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(139,148,158,0.1)' }}>
                <Icon size={14} style={{ color: '#8B949E' }} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: '#8B949E' }}>{label}</p>
                {editing ? (
                  <input
                    value={draft}
                    onChange={e => set(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium outline-none border-b"
                    style={{ color: '#F0F6FC', borderColor: '#F5A623' }}
                    type={type}
                  />
                ) : (
                  <p className="text-sm font-medium" style={{ color: '#F0F6FC' }}>{value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Edit / Save / Cancel */}
        <div className="px-4 mb-4">
          {editing ? (
            <div className="flex gap-3">
              <button onClick={saveEdit} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold" style={{ backgroundColor: '#F5A623', color: '#0D1117' }}>
                <Check size={14} /> Save Changes
              </button>
              <button onClick={() => setEditing(false)} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium" style={{ backgroundColor: '#21262D', color: '#8B949E', border: '1px solid #30363D' }}>
                <X size={14} /> Cancel
              </button>
            </div>
          ) : (
            <button onClick={startEdit} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium" style={{ backgroundColor: '#21262D', color: '#F0F6FC', border: '1px solid #30363D' }}>
              <Pencil size={14} /> Edit Details
            </button>
          )}
        </div>

        {/* Account details (read-only) */}
        <div className="px-4 mb-1">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#8B949E' }}>Account Info</p>
        </div>
        <div className="mx-4 rounded-2xl border overflow-hidden mb-4" style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}>
          {[
            { icon: Mail, label: 'Email', value: user.email || '—' },
            { icon: isVendor ? Building2 : Truck, label: isVendor ? 'Company' : 'Vehicle Type', value: isVendor ? (user.companyName || '—') : (user.vehicleType || '—') },
            { icon: ShieldCheck, label: 'Documents', value: 'Verified', valueColor: '#22C55E' },
            { icon: Calendar, label: 'Account ID', value: `CS-${user.id?.toString().padStart(5, '0') ?? '00001'}` },
          ].map(({ icon: Icon, label, value, valueColor }, i, arr) => (
            <div key={label} className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: i < arr.length - 1 ? '1px solid #30363D' : 'none' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(139,148,158,0.1)' }}>
                <Icon size={14} style={{ color: '#8B949E' }} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: '#8B949E' }}>{label}</p>
                <p className="text-sm font-medium" style={{ color: valueColor ?? '#F0F6FC' }}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="px-4 mb-1">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#8B949E' }}>Quick Actions</p>
        </div>
        <div className="mx-4 rounded-2xl border overflow-hidden mb-6" style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}>
          {[
            { icon: FileText, label: 'My Documents', sub: 'View & upload documents', path: '/app/documents' },
            { icon: Crown, label: 'Subscription & Payments', sub: 'Plan, billing history', path: '/app/payment-history' },
            { icon: ShieldCheck, label: 'Change Password', sub: 'Update your password', path: '/app/change-password' },
          ].map(({ icon: Icon, label, sub, path }, i, arr) => (
            <button
              key={label}
              onClick={() => router.push(path)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-white/5"
              style={{ borderBottom: i < arr.length - 1 ? '1px solid #30363D' : 'none' }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(139,148,158,0.1)' }}>
                <Icon size={14} style={{ color: '#8B949E' }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: '#F0F6FC' }}>{label}</p>
                <p className="text-xs" style={{ color: '#8B949E' }}>{sub}</p>
              </div>
              <ChevronRight size={14} style={{ color: '#8B949E' }} />
            </button>
          ))}
        </div>

        <p className="text-center text-xs px-6" style={{ color: '#8B949E' }}>
          Email and account details can only be changed via support.
        </p>
      </main>
    </AppShell>
  );
}
