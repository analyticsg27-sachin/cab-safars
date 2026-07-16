'use client';

import { useRouter } from 'next/navigation';
import { FileText, CheckCircle, Clock, Upload } from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import AppHeader from '@/components/app/AppHeader';
import { useAppState } from '@/lib/app-state';

const VENDOR_DOCS = [
  { name: 'Business Registration', status: 'verified' },
  { name: 'GST Certificate', status: 'verified' },
  { name: 'PAN Card', status: 'verified' },
  { name: 'Bank Account Proof', status: 'pending' },
];

const DRIVER_DOCS = [
  { name: 'Driving Licence', status: 'verified' },
  { name: 'Aadhar Card', status: 'verified' },
  { name: 'Vehicle RC', status: 'verified' },
  { name: 'Vehicle Insurance', status: 'pending' },
  { name: 'PAN Card', status: 'pending' },
];

export default function DocumentsPage() {
  const router = useRouter();
  const { state } = useAppState();
  const user = state.currentUser;
  if (!user) { router.replace('/app/'); return null; }

  const docs = user.role === 'driver' ? DRIVER_DOCS : VENDOR_DOCS;

  return (
    <AppShell>
      <AppHeader title="Documents" showBack onBack={() => router.back()} />
      <main className="flex-1 overflow-y-auto px-4 pb-10 pt-6">
        <p className="text-xs mb-4" style={{ color: '#8B949E' }}>Your submitted documents and verification status.</p>
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}>
          {docs.map(({ name, status }, i) => (
            <div key={name} className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: i < docs.length - 1 ? '1px solid #30363D' : 'none' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(139,148,158,0.1)' }}>
                <FileText size={15} style={{ color: '#8B949E' }} />
              </div>
              <span className="flex-1 text-sm" style={{ color: '#F0F6FC' }}>{name}</span>
              {status === 'verified' ? (
                <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#22C55E' }}>
                  <CheckCircle size={10} /> Verified
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(245,166,35,0.12)', color: '#F5A623' }}>
                  <Clock size={10} /> Pending
                </span>
              )}
            </div>
          ))}
        </div>
        <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl mt-5 text-sm font-semibold" style={{ border: '1.5px dashed #30363D', color: '#8B949E' }}>
          <Upload size={16} /> Upload New Document
        </button>
        <p className="text-center text-xs mt-3" style={{ color: '#8B949E' }}>Documents are verified within 24–48 hours.</p>
      </main>
    </AppShell>
  );
}
