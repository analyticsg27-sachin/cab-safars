'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, CheckCircle, Clock, Upload, Eye, Download, X, AlertCircle, ChevronDown } from 'lucide-react';
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

const VENDOR_DOC_TYPES = [
  'Business Registration Certificate',
  'GST Certificate',
  'PAN Card',
  'Aadhar Card',
  'Bank Account Proof (Cancelled Cheque / Passbook)',
  'Trade Licence',
  'Other',
];

const DRIVER_DOC_TYPES = [
  'Driving Licence (Front & Back)',
  'Aadhar Card',
  'PAN Card',
  'Vehicle RC (Registration Certificate)',
  'Vehicle Insurance',
  'Fitness Certificate',
  'Pollution Certificate (PUC)',
  'Other',
];

type Doc = { name: string; status: string; type: string; pages: number };

function DocViewer({ doc, onClose }: { doc: Doc; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}>
      <div className="w-full rounded-t-3xl overflow-hidden" style={{ backgroundColor: '#161B22', border: '1px solid #30363D', maxHeight: '85vh' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #30363D' }}>
          <div>
            <p className="text-sm font-bold" style={{ color: '#F0F6FC' }}>{doc.name}</p>
            <p className="text-xs" style={{ color: '#8B949E' }}>{doc.type} · {doc.pages} page{doc.pages > 1 ? 's' : ''}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#21262D' }}>
            <X size={14} style={{ color: '#8B949E' }} />
          </button>
        </div>
        <div className="px-5 py-6 flex flex-col items-center gap-4">
          <div className="w-full rounded-xl flex flex-col items-center justify-center gap-3"
            style={{ backgroundColor: '#0D1117', border: '1px solid #30363D', minHeight: 200, padding: '32px 16px' }}>
            <FileText size={48} style={{ color: '#30363D' }} />
            <div className="text-center">
              <p className="text-sm font-semibold mb-1" style={{ color: '#8B949E' }}>{doc.name}</p>
              <p className="text-xs" style={{ color: '#374151' }}>
                {doc.type === 'PDF' ? `PDF Document · ${doc.pages} page${doc.pages > 1 ? 's' : ''}` : 'Image Document'}
              </p>
              <p className="text-xs mt-1" style={{ color: '#374151' }}>Uploaded · Verified by CAB SAFARS</p>
            </div>
            {doc.status === 'verified' && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full mt-2"
                style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
                <CheckCircle size={12} style={{ color: '#22C55E' }} />
                <span className="text-xs font-semibold" style={{ color: '#22C55E' }}>Verified Document</span>
              </div>
            )}
          </div>
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

function UploadSheet({ role, onClose, onUploaded }: { role: string; onClose: () => void; onUploaded: (name: string) => void }) {
  const [docType, setDocType] = useState('');
  const [note, setNote] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<'form' | 'done'>('form');

  const docTypes = role === 'driver' ? DRIVER_DOC_TYPES : VENDOR_DOC_TYPES;

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setFile(f);
    e.target.value = '';
  }

  function handleSubmit() {
    if (!docType) return;
    if (!file) return;
    setStep('done');
    onUploaded(docType);
  }

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}>
      <div className="w-full rounded-t-3xl overflow-hidden" style={{ backgroundColor: '#161B22', border: '1px solid #30363D', maxHeight: '90vh' }}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: '#30363D' }} />
        </div>

        <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid #30363D' }}>
          <p className="text-base font-bold" style={{ color: '#F0F6FC' }}>Upload Document</p>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#21262D' }}>
            <X size={14} style={{ color: '#8B949E' }} />
          </button>
        </div>

        {step === 'done' ? (
          <div className="flex flex-col items-center py-10 px-6 text-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(34,197,94,0.12)' }}>
              <CheckCircle size={32} style={{ color: '#22C55E' }} />
            </div>
            <p className="text-lg font-bold" style={{ color: '#F0F6FC' }}>Document Uploaded</p>
            <p className="text-sm" style={{ color: '#8B949E' }}>Your <span style={{ color: '#F0F6FC' }}>{docType}</span> has been submitted for verification. You will be notified within 24–48 hours.</p>
            <button onClick={onClose} className="w-full py-3.5 rounded-2xl text-sm font-bold mt-2" style={{ backgroundColor: '#F5A623', color: '#0D1117' }}>Done</button>
          </div>
        ) : (
          <div className="px-5 py-4 overflow-y-auto flex flex-col gap-4" style={{ maxHeight: '75vh' }}>

            {/* Info banner */}
            <div className="rounded-xl px-3 py-2.5 flex items-start gap-2" style={{ backgroundColor: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)' }}>
              <AlertCircle size={14} style={{ color: '#F5A623', marginTop: 1, flexShrink: 0 }} />
              <p className="text-xs leading-relaxed" style={{ color: '#8B949E' }}>
                Upload clear, readable documents only. Files must be under <span style={{ color: '#F0F6FC' }}>5 MB</span>. Accepted formats: <span style={{ color: '#F0F6FC' }}>PDF, JPG, PNG</span>.
              </p>
            </div>

            {/* Step 1 — Select document type */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#8B949E' }}>
                1. Select Document Type <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div className="relative">
                <select
                  value={docType}
                  onChange={e => setDocType(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl text-sm outline-none appearance-none"
                  style={{ backgroundColor: '#21262D', border: `1px solid ${docType ? '#F5A623' : '#30363D'}`, color: docType ? '#F0F6FC' : '#8B949E' }}
                >
                  <option value="">-- Select document type --</option>
                  {docTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown size={14} style={{ color: '#8B949E', position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>

            {/* Step 2 — Note (optional) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#8B949E' }}>
                2. Note <span className="font-normal normal-case" style={{ color: '#8B949E' }}>(optional)</span>
              </label>
              <input
                type="text"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="e.g. Front and back side included"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ backgroundColor: '#21262D', border: '1px solid #30363D', color: '#F0F6FC' }}
              />
            </div>

            {/* Step 3 — Choose file */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#8B949E' }}>
                3. Choose File <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <label className="w-full flex flex-col items-center justify-center gap-2 py-6 rounded-xl cursor-pointer transition-all"
                style={{ border: `2px dashed ${file ? '#F5A623' : '#30363D'}`, backgroundColor: file ? 'rgba(245,166,35,0.05)' : 'transparent' }}>
                {file ? (
                  <>
                    <FileText size={28} style={{ color: '#F5A623' }} />
                    <p className="text-sm font-semibold" style={{ color: '#F0F6FC' }}>{file.name}</p>
                    <p className="text-xs" style={{ color: '#8B949E' }}>{(file.size / 1024).toFixed(0)} KB · Tap to change</p>
                  </>
                ) : (
                  <>
                    <Upload size={28} style={{ color: '#8B949E' }} />
                    <p className="text-sm font-medium" style={{ color: '#8B949E' }}>Tap to choose file</p>
                    <p className="text-xs" style={{ color: '#30363D' }}>PDF, JPG, PNG — max 5 MB</p>
                  </>
                )}
                <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleFile} />
              </label>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!docType || !file}
              className="w-full py-4 rounded-2xl text-sm font-bold transition-all"
              style={{
                backgroundColor: docType && file ? '#F5A623' : '#21262D',
                color: docType && file ? '#0D1117' : '#8B949E',
                cursor: docType && file ? 'pointer' : 'not-allowed',
              }}
            >
              Submit for Verification
            </button>
            <p className="text-center text-xs pb-2" style={{ color: '#8B949E' }}>Documents are reviewed within 24–48 hours.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DocumentsPage() {
  const router = useRouter();
  const { state } = useAppState();
  const user = state.currentUser;
  const [viewing, setViewing] = useState<Doc | null>(null);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!user) { router.replace('/app/'); return null; }

  const docs: Doc[] = user.role === 'driver' ? DRIVER_DOCS : VENDOR_DOCS;

  function handleUploaded(name: string) {
    setSuccessMsg(`"${name}" submitted for verification.`);
    setTimeout(() => setSuccessMsg(''), 5000);
  }

  return (
    <AppShell>
      {viewing && <DocViewer doc={viewing} onClose={() => setViewing(null)} />}
      {uploading && (
        <UploadSheet
          role={user.role}
          onClose={() => setUploading(false)}
          onUploaded={(name) => { setUploading(false); handleUploaded(name); }}
        />
      )}

      <AppHeader title="Documents" showBack onBack={() => router.back()} />
      <main className="flex-1 overflow-y-auto px-4 pb-10 pt-4">

        {/* Header info */}
        <div className="rounded-xl px-4 py-3 mb-4 flex items-start gap-2" style={{ backgroundColor: 'rgba(45,107,228,0.08)', border: '1px solid rgba(45,107,228,0.2)' }}>
          <AlertCircle size={14} style={{ color: '#2D6BE4', marginTop: 1, flexShrink: 0 }} />
          <p className="text-xs leading-relaxed" style={{ color: '#8B949E' }}>
            All documents are <span style={{ color: '#F0F6FC' }}>verified by the CAB SAFARS team</span> within 24–48 hours. Verified accounts get a trust badge visible to other users.
          </p>
        </div>

        {/* Doc list */}
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#8B949E' }}>Submitted Documents</p>
        <div className="rounded-2xl border overflow-hidden mb-4" style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}>
          {docs.map(({ name, status, type, pages }, i) => (
            <div key={name} className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: i < docs.length - 1 ? '1px solid #30363D' : 'none' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: status === 'verified' ? 'rgba(34,197,94,0.1)' : 'rgba(245,166,35,0.1)' }}>
                <FileText size={15} style={{ color: status === 'verified' ? '#22C55E' : '#F5A623' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: '#F0F6FC' }}>{name}</p>
                <p className="text-xs" style={{ color: '#8B949E' }}>{type} · {pages} page{pages > 1 ? 's' : ''}</p>
              </div>
              {status === 'verified' ? (
                <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                  style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#22C55E' }}>
                  <CheckCircle size={10} /> Verified
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                  style={{ backgroundColor: 'rgba(245,166,35,0.12)', color: '#F5A623' }}>
                  <Clock size={10} /> Pending
                </span>
              )}
              <button
                className="ml-1 w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'rgba(45,107,228,0.12)', border: '1px solid rgba(45,107,228,0.25)' }}
                onClick={() => setViewing({ name, status, type, pages })}
              >
                <Eye size={14} style={{ color: '#2D6BE4' }} />
              </button>
            </div>
          ))}
        </div>

        {/* Success banner */}
        {successMsg && (
          <div className="rounded-xl px-4 py-3 mb-3 flex items-center gap-2" style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
            <CheckCircle size={14} style={{ color: '#22C55E' }} />
            <p className="text-xs" style={{ color: '#22C55E' }}>{successMsg}</p>
          </div>
        )}

        {/* Upload button */}
        <button
          onClick={() => setUploading(true)}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-semibold"
          style={{ backgroundColor: '#F5A623', color: '#0D1117' }}
        >
          <Upload size={16} /> Upload New Document
        </button>
        <p className="text-center text-xs mt-3" style={{ color: '#8B949E' }}>
          Required: {user.role === 'driver' ? 'Licence, Aadhar, RC, Insurance, PAN' : 'Business Reg., GST, PAN, Bank Proof'}
        </p>
      </main>
    </AppShell>
  );
}
