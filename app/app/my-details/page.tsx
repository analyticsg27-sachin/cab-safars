'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Phone, Mail, MapPin, Truck, Building2, Crown, Pencil, Check, X } from 'lucide-react';
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

  const staticRows = [
    { icon: Mail, label: 'Email', value: user.email || '—' },
    { icon: user.role === 'driver' ? Truck : Building2, label: user.role === 'driver' ? 'Vehicle' : 'Company', value: user.role === 'driver' ? (user.vehicleType || '—') : (user.companyName || '—') },
    { icon: Crown, label: 'Plan', value: user.isPremium ? `Premium${user.premiumExpiry ? ` · expires ${user.premiumExpiry}` : ''}` : 'Free' },
  ];

  return (
    <AppShell>
      <AppHeader
        title="My Details"
        showBack
        onBack={() => router.back()}
      />
      <main className="flex-1 overflow-y-auto px-4 pb-10 pt-6">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: '#21262D', border: '2px solid #F5A623' }}>
            <span className="text-3xl font-bold" style={{ color: '#F5A623' }}>{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <p className="text-lg font-bold" style={{ color: '#F0F6FC' }}>{user.name}</p>
          <span className="text-xs font-semibold px-3 py-1 rounded-full mt-1" style={{ backgroundColor: 'rgba(245,166,35,0.12)', color: '#F5A623' }}>{roleLabel}</span>
        </div>

        {/* Editable fields */}
        <div className="rounded-2xl border overflow-hidden mb-3" style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}>
          {/* Full Name */}
          <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: '1px solid #30363D' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(139,148,158,0.1)' }}>
              <User size={15} style={{ color: '#8B949E' }} />
            </div>
            <div className="flex-1">
              <p className="text-xs" style={{ color: '#8B949E' }}>Full Name</p>
              {editing ? (
                <input
                  value={draftName}
                  onChange={e => setDraftName(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium outline-none border-b"
                  style={{ color: '#F0F6FC', borderColor: '#F5A623' }}
                />
              ) : (
                <p className="text-sm font-medium" style={{ color: '#F0F6FC' }}>{user.name}</p>
              )}
            </div>
          </div>
          {/* Phone */}
          <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: '1px solid #30363D' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(139,148,158,0.1)' }}>
              <Phone size={15} style={{ color: '#8B949E' }} />
            </div>
            <div className="flex-1">
              <p className="text-xs" style={{ color: '#8B949E' }}>Phone</p>
              {editing ? (
                <input
                  value={draftPhone}
                  onChange={e => setDraftPhone(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium outline-none border-b"
                  style={{ color: '#F0F6FC', borderColor: '#F5A623' }}
                  type="tel"
                />
              ) : (
                <p className="text-sm font-medium" style={{ color: '#F0F6FC' }}>{user.phone}</p>
              )}
            </div>
          </div>
          {/* City */}
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(139,148,158,0.1)' }}>
              <MapPin size={15} style={{ color: '#8B949E' }} />
            </div>
            <div className="flex-1">
              <p className="text-xs" style={{ color: '#8B949E' }}>City</p>
              {editing ? (
                <input
                  value={draftCity}
                  onChange={e => setDraftCity(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium outline-none border-b"
                  style={{ color: '#F0F6FC', borderColor: '#F5A623' }}
                />
              ) : (
                <p className="text-sm font-medium" style={{ color: '#F0F6FC' }}>{user.city || '—'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Edit / Save / Cancel buttons */}
        {editing ? (
          <div className="flex gap-3 mb-4">
            <button
              onClick={saveEdit}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold"
              style={{ backgroundColor: '#F5A623', color: '#0D1117' }}
            >
              <Check size={15} /> Save Changes
            </button>
            <button
              onClick={() => setEditing(false)}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium"
              style={{ backgroundColor: '#21262D', color: '#8B949E', border: '1px solid #30363D' }}
            >
              <X size={15} /> Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={startEdit}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium mb-4"
            style={{ backgroundColor: '#21262D', color: '#F0F6FC', border: '1px solid #30363D' }}
          >
            <Pencil size={14} /> Edit Details
          </button>
        )}

        {/* Static details card */}
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}>
          {staticRows.map(({ icon: Icon, label, value }, i) => (
            <div key={label} className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: i < staticRows.length - 1 ? '1px solid #30363D' : 'none' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(139,148,158,0.1)' }}>
                <Icon size={15} style={{ color: '#8B949E' }} />
              </div>
              <div className="flex-1">
                <p className="text-xs" style={{ color: '#8B949E' }}>{label}</p>
                <p className="text-sm font-medium" style={{ color: '#F0F6FC' }}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#8B949E' }}>Email, vehicle, and plan details can only be changed via support.</p>
      </main>
    </AppShell>
  );
}
