'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import AppHeader from '@/components/app/AppHeader';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit() {
    setError('');
    if (!current || !next || !confirm) { setError('All fields are required.'); return; }
    if (next.length < 6) { setError('New password must be at least 6 characters.'); return; }
    if (next !== confirm) { setError('Passwords do not match.'); return; }
    setDone(true);
  }

  return (
    <AppShell>
      <AppHeader title="Change Password" showBack onBack={() => router.back()} />
      <main className="flex-1 overflow-y-auto px-4 pb-10 pt-6">
        {done ? (
          <div className="flex flex-col items-center justify-center pt-20">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(34,197,94,0.12)' }}>
              <CheckCircle size={32} style={{ color: '#22C55E' }} />
            </div>
            <p className="text-lg font-bold mb-2" style={{ color: '#F0F6FC' }}>Password Updated</p>
            <p className="text-sm text-center mb-6" style={{ color: '#8B949E' }}>Your password has been changed successfully.</p>
            <button className="px-6 py-3 rounded-2xl text-sm font-bold" style={{ backgroundColor: '#F5A623', color: '#0D1117' }} onClick={() => router.back()}>Done</button>
          </div>
        ) : (
          <div className="rounded-2xl border p-5" style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}>
            {[
              { label: 'Current Password', val: current, set: setCurrent, show: showCurrent, toggle: () => setShowCurrent(v => !v) },
              { label: 'New Password', val: next, set: setNext, show: showNext, toggle: () => setShowNext(v => !v) },
              { label: 'Confirm New Password', val: confirm, set: setConfirm, show: showConfirm, toggle: () => setShowConfirm(v => !v) },
            ].map(({ label, val, set, show, toggle }, i) => (
              <div key={label} className="mb-4">
                <p className="text-xs font-semibold mb-1.5" style={{ color: '#8B949E' }}>{label}</p>
                <div className="flex items-center rounded-xl px-4" style={{ backgroundColor: '#21262D', border: '1px solid #30363D', height: '48px' }}>
                  <Lock size={14} style={{ color: '#8B949E', marginRight: 10 }} />
                  <input
                    type={show ? 'text' : 'password'}
                    value={val}
                    onChange={e => set(e.target.value)}
                    placeholder="••••••••"
                    className="flex-1 bg-transparent text-sm outline-none"
                    style={{ color: '#F0F6FC' }}
                  />
                  <button onClick={toggle} type="button">{show ? <EyeOff size={14} style={{ color: '#8B949E' }} /> : <Eye size={14} style={{ color: '#8B949E' }} />}</button>
                </div>
              </div>
            ))}
            {error && <p className="text-xs mb-3" style={{ color: '#EF4444' }}>{error}</p>}
            <button className="w-full py-4 rounded-2xl text-sm font-bold mt-1" style={{ backgroundColor: '#F5A623', color: '#0D1117' }} onClick={handleSubmit}>Update Password</button>
          </div>
        )}
      </main>
    </AppShell>
  );
}
