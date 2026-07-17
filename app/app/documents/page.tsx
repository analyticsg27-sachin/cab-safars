'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, CheckCircle, Clock, Upload, Eye, Download, X } from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import AppHeader from '@/components/app/AppHeader';
import { useAppState } from '@/lib/app-state';

const VENDOR_DOCS = [
  { name: 'Business Registration', status: 'verified', type: 'PDF', pages: 2 },
  { name: 'GST Certificate', status: 'verified', type: 'PDF', pages: 1 },
  { name: 'PAN Card', status: 'verified', type: 'Image', pages: 1 },
  { name: 'Bank Account Proof', status: 'pending', type: 'PDF', pages: 3 },
];

const DRIVER_DOCS = [
  { name: 'Driving Licence', status: 'verified', type: 'Image', pages: 1 },
  { name: 'Aadhar Card', status: 'verified', type: 'Image', pages: 1 },
  { name: 'Vehicle RC', status: 'verified', type: 'PDF', pages: 2 },
  { name: 'Vehicle Insurance', status: 'pending', type: 'PDF', pages: 4 },
  { name: 'PAN Card', status: 'pending', type: 'Image', pages: 1 },
];

type Doc = { name: string; status: string; type: string; pages: number };

function DocViewer({ doc, onClose }: { doc: Doc; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full rounded-t-3xl overflow-hidden" style={{ backgroundColor: '#161B22', border: '1px solid #30363D', maxHeight: '85vh' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #30363D' }}>
          <div>
            <p className="text-sm font-bold" style={{ color: '#F0F6FC' }}>{doc.name}</p>
            <p className="text-xs" style={{ color: '#8B949E' }}>{doc.type} · {doc.pages} page{doc.pages > 1 ? 's' : ''}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#21262D' }}>
            <X size={14} style={{ color: '#8B949E' }} />
          </button>
        </div>

        {/* Mock document preview */}
        <div className="px-5 py-6 flex flex-col items-center gap-4">
          <div
            className="w-full rounded-xl flex flex-col items-center justify-center gap-3"
            style={{ backgroundColor: '#0D1117', border: '1px solid #30363D', minHeight: 200, padding: '32px 16px' }}
          >
            <FileText size={48} style={{ color: '#30363D' }} />
            <div className="text-center">
              <p className="text-sm font-semibold mb-1" style={{ color: '#8B949E' }}>{doc.name}</p>
              <p className="text-xs" style={{ color: '#374151' }}>
                {doc.type === 'PDF' ? `PDF Document · ${doc.pages} page${doc.pages > 1 ? 's' : ''}` : 'Image Document'}
              </p>
              <p className="text-xs mt-1" style={{ color: '#374151' }}>Uploaded · Verified by CAB SAFARS</p>
            </div>
            {/* Fake stamp */}
            {doc.status === 'verified' && (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full mt-2"
                style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}
              >
                <CheckCircle size={12} style={{ color: '#22C55E' }} />
                <span className="text-xs font-semibold" style={{ color: '#22C55E' }}>Verified Document</span>
              </div>
            )}
          </div>

          {/* Download button */}
          <button
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold"
            style={{ backgroundColor: '#F5A623', color: '#0D1117' }}
            onClick={() => {
              const a = document.createElement('a');
              a.href = 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKCjEgMCBvYmoKPDwgL1R5cGUgL0NhdGFsb2cgL1BhZ2VzIDIgMCBSID4+CmVuZG9iagoKMiAwIG9iago8PCAvVHlwZSAvUGFnZXMgL0tpZHMgWzMgMCBSXSAvQ291bnQgMSA+PgplbmRvYmoKCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA2MTIgNzkyXSA+PgplbmRvYmoKCnhyZWYKMCA0CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDU4IDAwMDAwIG4gCjAwMDAwMDAxMTUgMDAwMDAgbiAKCnRyYWlsZXIKPDwgL1NpemUgNCAvUm9vdCAxIDAgUiA+PgpzdGFydHhyZWYKMjA4CiUlRU9G';
              a.download = `${doc.name.replace(/ /g, '_')}.pdf`;
              a.click();
            }}
          >
            <Download size={16} /> Download {doc.type}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DocumentsPage() {
  const router = useRouter();
  const { state } = useAppState();
  const user = state.currentUser;
  const [viewing, setViewing] = useState<Doc | null>(null);

  if (!user) { router.replace('/app/'); return null; }

  const docs: Doc[] = user.role === 'driver' ? DRIVER_DOCS : VENDOR_DOCS;

  return (
    <AppShell>
      {viewing && <DocViewer doc={viewing} onClose={() => setViewing(null)} />}
      <AppHeader title="Documents" showBack onBack={() => router.back()} />
      <main className="flex-1 overflow-y-auto px-4 pb-10 pt-6">
        <p className="text-xs mb-4" style={{ color: '#8B949E' }}>Your submitted documents and verification status.</p>
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}>
          {docs.map(({ name, status, type, pages }, i) => (
            <div key={name} className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: i < docs.length - 1 ? '1px solid #30363D' : 'none' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(139,148,158,0.1)' }}>
                <FileText size={15} style={{ color: '#8B949E' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ color: '#F0F6FC' }}>{name}</p>
                <p className="text-xs" style={{ color: '#8B949E' }}>{type}</p>
              </div>
              {status === 'verified' ? (
                <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#22C55E' }}>
                  <CheckCircle size={10} /> Verified
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: 'rgba(245,166,35,0.12)', color: '#F5A623' }}>
                  <Clock size={10} /> Pending
                </span>
              )}
              <button
                className="ml-2 w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'rgba(45,107,228,0.12)', border: '1px solid rgba(45,107,228,0.25)' }}
                onClick={() => setViewing({ name, status, type, pages })}
              >
                <Eye size={14} style={{ color: '#2D6BE4' }} />
              </button>
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
