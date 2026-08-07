'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText, CheckCircle, Clock, Upload, Eye, X, AlertCircle, MessageSquare, RefreshCw, RotateCcw,
} from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import AppHeader from '@/components/app/AppHeader';
import { useAppState } from '@/lib/app-state';
import DocumentsService, { type UserDoc } from '@/lib/services/documents.service';
import { isApiMode } from '@/lib/services';
import { useTranslation } from '@/lib/useTranslation';

const VENDOR_DOC_TYPES = [
  'Aadhar Card',
  'PAN Card',
  'Gumasta (Shop & Establishment)',
  'GST Certificate',
  'Other',
];

const DRIVER_DOC_TYPES = [
  'Aadhar Card',
  'PAN Card',
  'RC Book (Vehicle Registration)',
  'Vehicle Insurance',
  'Permit',
  'Fitness Certificate',
  'Driving Licence',
  'Other',
];

const DEMO_DOCS: UserDoc[] = [
  { id: 'demo-1', document_type: 'Aadhar Card',      original_name: 'aadhar.pdf',    mime_type: 'application/pdf', file_size: 512000, status: 'approved', created_at: '2026-07-01T10:00:00Z' },
  { id: 'demo-2', document_type: 'PAN Card',          original_name: 'pan_card.pdf',  mime_type: 'application/pdf', file_size: 310000, status: 'approved', created_at: '2026-07-01T10:05:00Z' },
  { id: 'demo-3', document_type: 'Driving Licence',   original_name: 'licence.pdf',   mime_type: 'application/pdf', file_size: 480000, status: 'pending',  created_at: '2026-07-02T09:00:00Z' },
  { id: 'demo-4', document_type: 'Vehicle Insurance', original_name: 'insurance.pdf', mime_type: 'application/pdf', file_size: 220000, status: 'rejected', rejection_reason: 'Insurance document appears expired. Please upload a valid certificate dated 2026.', created_at: '2026-07-02T09:10:00Z' },
];

// ── Upload Sheet ──────────────────────────────────────────────────────────────

interface UploadSheetProps {
  role: 'vendor' | 'driver';
  preselectedType?: string;
  onClose: () => void;
  onUploaded: (name: string) => void;
}

function UploadSheet({ role, preselectedType, onClose, onUploaded }: UploadSheetProps) {
  const { t } = useTranslation();
  const docTypes = role === 'driver' ? DRIVER_DOC_TYPES : VENDOR_DOC_TYPES;
  const [docType, setDocType] = useState(preselectedType ?? docTypes[0]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleUpload() {
    if (!file) { setError('Please select a file first.'); return; }
    setError('');
    setUploading(true);
    try {
      if (isApiMode()) {
        await DocumentsService.uploadDocument(file, docType);
      }
      onUploaded(docType);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}>
      <div className="w-full rounded-t-3xl overflow-hidden" style={{ backgroundColor: '#161B22', border: '1px solid #30363D', maxHeight: '85vh' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #30363D' }}>
          <p className="text-sm font-bold" style={{ color: '#F0F6FC' }}>
            {preselectedType ? `Re-upload: ${preselectedType}` : t('upload_document')}
          </p>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#21262D' }}>
            <X size={14} style={{ color: '#8B949E' }} />
          </button>
        </div>
        <div className="px-5 py-5 flex flex-col gap-4 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 60px)' }}>
          {error && (
            <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <AlertCircle size={14} style={{ color: '#EF4444' }} />
              <p className="text-xs" style={{ color: '#EF4444' }}>{error}</p>
            </div>
          )}

          {/* Doc type selector — hidden when re-uploading a specific type */}
          {!preselectedType && (
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: '#8B949E' }}>{t('document_type_label')}</p>
              <div className="flex flex-col gap-1">
                {docTypes.map(dtype => (
                  <button key={dtype}
                    onClick={() => setDocType(dtype)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left transition-all"
                    style={docType === dtype
                      ? { background: 'rgba(245,166,35,0.12)', border: '1px solid rgba(245,166,35,0.3)', color: '#F5A623' }
                      : { background: 'transparent', border: '1px solid #30363D', color: '#8B949E' }}>
                    {docType === dtype && <CheckCircle size={13} style={{ color: '#F5A623', flexShrink: 0 }} />}
                    {dtype}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* File picker */}
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: '#8B949E' }}>{t('select_file')}</p>
            <label
              className="flex flex-col items-center justify-center gap-2 py-6 rounded-2xl cursor-pointer transition-all"
              style={{ border: '2px dashed #30363D', background: file ? 'rgba(34,197,94,0.05)' : 'transparent' }}>
              <input type="file" className="hidden" accept="image/*,.pdf"
                onChange={e => setFile(e.target.files?.[0] ?? null)} />
              {file ? (
                <>
                  <CheckCircle size={24} style={{ color: '#22C55E' }} />
                  <p className="text-sm font-medium text-center px-4" style={{ color: '#22C55E' }}>{file.name}</p>
                  <p className="text-xs" style={{ color: '#8B949E' }}>{Math.round(file.size / 1024)} KB</p>
                </>
              ) : (
                <>
                  <Upload size={24} style={{ color: '#374151' }} />
                  <p className="text-sm" style={{ color: '#8B949E' }}>{t('tap_choose_file')}</p>
                  <p className="text-xs" style={{ color: '#374151' }}>{t('max_file_size')}</p>
                </>
              )}
            </label>
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full py-4 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            style={{ backgroundColor: '#F5A623', color: '#0D1117' }}>
            {uploading
              ? <><span className="w-4 h-4 border-2 border-[#0D1117]/30 border-t-[#0D1117] rounded-full animate-spin" /> {t('uploading_doc')}</>
              : <><Upload size={16} /> {preselectedType ? 'Re-submit Document' : t('submit_document')}</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  if (status === 'approved') return (
    <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
      style={{ background: 'rgba(34,197,94,0.12)', color: '#22C55E' }}>
      <CheckCircle size={10} /> {t('doc_status_verified')}
    </span>
  );
  if (status === 'rejected') return (
    <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
      style={{ background: 'rgba(239,68,68,0.12)', color: '#EF4444' }}>
      <X size={10} /> {t('doc_status_rejected')}
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
      style={{ background: 'rgba(245,166,35,0.12)', color: '#F5A623' }}>
      <Clock size={10} /> {t('doc_status_pending')}
    </span>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function DocumentsPage() {
  const router = useRouter();
  const { state } = useAppState();
  const { t } = useTranslation();
  const user = state.currentUser;

  const [docs, setDocs] = useState<UserDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadSheet, setUploadSheet] = useState<{ open: boolean; reuploadType?: string }>({ open: false });
  const [successMsg, setSuccessMsg] = useState('');
  const [viewUrl, setViewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    if (isApiMode()) {
      setLoading(true);
      DocumentsService.getMyDocuments()
        .then(setDocs)
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setDocs(DEMO_DOCS);
    }
  }, [user]);

  if (!user) { router.replace('/app/'); return null; }

  const role = user.role;
  const approvedCount = docs.filter(d => d.status === 'approved').length;
  const rejectedDocs  = docs.filter(d => d.status === 'rejected');
  const allRequired   = role === 'driver' ? 7 : 4;

  function handleUploaded(name: string) {
    setUploadSheet({ open: false });
    setSuccessMsg(`"${name}" submitted for verification.`);
    setTimeout(() => setSuccessMsg(''), 5000);
    if (isApiMode()) {
      setLoading(true);
      DocumentsService.getMyDocuments().then(setDocs).catch(() => {}).finally(() => setLoading(false));
    } else {
      // Demo: add a fake pending doc
      setDocs(prev => [...prev, {
        id: `demo-${Date.now()}`,
        document_type: name,
        original_name: name.toLowerCase().replace(/ /g, '_') + '.pdf',
        mime_type: 'application/pdf',
        file_size: 300000,
        status: 'pending',
        created_at: new Date().toISOString(),
      }]);
    }
  }

  return (
    <AppShell>
      {uploadSheet.open && (
        <UploadSheet
          role={role}
          preselectedType={uploadSheet.reuploadType}
          onClose={() => setUploadSheet({ open: false })}
          onUploaded={handleUploaded}
        />
      )}
      {viewUrl && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/75">
          <div className="w-full rounded-t-3xl overflow-hidden" style={{ backgroundColor: '#161B22', maxHeight: '90vh' }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #30363D' }}>
              <p className="text-sm font-bold text-[#F0F6FC]">{t('document_preview')}</p>
              <button onClick={() => setViewUrl(null)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#21262D' }}>
                <X size={14} style={{ color: '#8B949E' }} />
              </button>
            </div>
            <iframe src={viewUrl} className="w-full" style={{ height: '70vh', border: 'none' }} />
          </div>
        </div>
      )}

      <AppHeader title={t('documents')} showBack onBack={() => router.back()} />
      <main className="flex-1 overflow-y-auto px-4 pb-10 pt-4">

        {/* Progress card */}
        <div className="rounded-xl px-4 py-3 mb-4"
          style={{ backgroundColor: '#161B22', border: '1px solid #30363D' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold" style={{ color: '#8B949E' }}>Document Verification Progress</p>
            <span className="text-xs font-bold" style={{ color: approvedCount === allRequired ? '#22C55E' : '#F5A623' }}>
              {approvedCount}/{allRequired} approved
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: '#21262D' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, Math.round((approvedCount / allRequired) * 100))}%`,
                backgroundColor: approvedCount === allRequired ? '#22C55E' : '#F5A623',
              }}
            />
          </div>
          <p className="text-[10px] mt-1.5" style={{ color: '#374151' }}>
            Required: {role === 'driver' ? 'Licence, Aadhar, PAN, RC, Insurance, Permit, Fitness' : 'Aadhar, PAN, Gumasta, GST'}
          </p>
        </div>

        {/* Rejection notice */}
        {rejectedDocs.length > 0 && (
          <div className="rounded-xl px-4 py-3 mb-4 flex items-start gap-2"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
            <AlertCircle size={14} style={{ color: '#EF4444', marginTop: 1, flexShrink: 0 }} />
            <div>
              <p className="text-xs font-semibold" style={{ color: '#EF4444' }}>
                {rejectedDocs.length} document{rejectedDocs.length > 1 ? 's' : ''} rejected
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#8B949E' }}>
                Re-upload the rejected documents using the button below each one.
              </p>
            </div>
          </div>
        )}

        {/* Doc list header */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#8B949E' }}>
            {t('your_documents')}
          </p>
          {isApiMode() && (
            <button onClick={() => {
              setLoading(true);
              DocumentsService.getMyDocuments().then(setDocs).catch(() => {}).finally(() => setLoading(false));
            }}>
              <RefreshCw size={13} style={{ color: '#374151' }} className={loading ? 'animate-spin' : ''} />
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-6 h-6 border-2 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : docs.length === 0 ? (
          <div className="rounded-2xl border flex flex-col items-center py-10 gap-2 mb-4"
            style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}>
            <FileText size={32} style={{ color: '#30363D' }} />
            <p className="text-sm" style={{ color: '#8B949E' }}>{t('no_docs_yet')}</p>
            <p className="text-xs" style={{ color: '#374151' }}>Tap "Upload Document" below to get started</p>
          </div>
        ) : (
          <div className="rounded-2xl border overflow-hidden mb-4" style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}>
            {docs.map((doc, i) => (
              <div key={doc.id}
                style={{ borderBottom: i < docs.length - 1 ? '1px solid #30363D' : 'none' }}>
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: doc.status === 'approved' ? 'rgba(34,197,94,0.1)' : doc.status === 'rejected' ? 'rgba(239,68,68,0.1)' : 'rgba(245,166,35,0.1)' }}>
                    <FileText size={15} style={{ color: doc.status === 'approved' ? '#22C55E' : doc.status === 'rejected' ? '#EF4444' : '#F5A623' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: '#F0F6FC' }}>{doc.document_type}</p>
                    <p className="text-xs truncate" style={{ color: '#8B949E' }}>
                      {doc.original_name ?? 'Document'}
                      {doc.file_size ? ` · ${Math.round(doc.file_size / 1024)} KB` : ''}
                    </p>
                  </div>
                  <StatusBadge status={doc.status} />
                  {doc.file_url && (
                    <button
                      onClick={() => setViewUrl(doc.file_url!)}
                      className="ml-1 w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: 'rgba(45,107,228,0.12)', border: '1px solid rgba(45,107,228,0.25)' }}>
                      <Eye size={14} style={{ color: '#2D6BE4' }} />
                    </button>
                  )}
                </div>

                {/* Rejection reason + re-upload */}
                {doc.status === 'rejected' && (
                  <div className="px-4 pb-3 flex flex-col gap-2">
                    {doc.rejection_reason && (
                      <div className="flex items-start gap-2 px-3 py-2 rounded-lg"
                        style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                        <MessageSquare size={12} style={{ color: '#EF4444', flexShrink: 0, marginTop: 1 }} />
                        <div>
                          <p className="text-[10px] font-semibold mb-0.5" style={{ color: '#EF4444' }}>Admin note:</p>
                          <p className="text-[11px]" style={{ color: '#FCA5A5' }}>{doc.rejection_reason}</p>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => setUploadSheet({ open: true, reuploadType: doc.document_type })}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95"
                      style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444' }}>
                      <RotateCcw size={12} /> Re-upload {doc.document_type}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Success banner */}
        {successMsg && (
          <div className="rounded-xl px-4 py-3 mb-3 flex items-center gap-2"
            style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
            <CheckCircle size={14} style={{ color: '#22C55E' }} />
            <p className="text-xs" style={{ color: '#22C55E' }}>{successMsg}</p>
          </div>
        )}

        <button
          onClick={() => setUploadSheet({ open: true })}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-semibold"
          style={{ backgroundColor: '#F5A623', color: '#0D1117' }}>
          <Upload size={16} /> {t('upload_new_doc')}
        </button>
      </main>
    </AppShell>
  );
}
