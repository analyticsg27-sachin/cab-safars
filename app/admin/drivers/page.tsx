"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, CheckCircle, XCircle, AlertCircle, RefreshCw, Car, Ban, FileText, X, ThumbsUp, ThumbsDown, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminService from "@/lib/services/admin.service";
import type { UserDocument } from "@/lib/services/admin.service";
import { formatDate } from "@/lib/utils";

interface ApiUser {
  id: string;
  name: string;
  phone: string;
  city: string;
  status: string;
  is_premium: boolean;
  vehicle_type?: string;
  profile_image?: string;
  created_at: string;
}

function UserAvatar({ name, src }: { name: string; src?: string }) {
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  if (src) {
    return <img src={src} alt={name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" style={{ border: '1px solid #30363D' }} />;
  }
  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
      style={{ background: 'rgba(245,166,35,0.15)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.3)' }}>
      {initials}
    </div>
  );
}

const STATUS_FILTERS = ['all', 'approved', 'rejected', 'suspended'];

function DocModal({ user, onClose }: { user: ApiUser; onClose: () => void }) {
  const [docs, setDocs] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3000); }

  useEffect(() => {
    AdminService.getUserDocuments(user.id)
      .then(setDocs)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user.id]);

  async function handleDoc(docId: string, action: 'approve' | 'reject') {
    if (action === 'reject') {
      const reason = window.prompt('Enter rejection reason for the user:');
      if (!reason?.trim()) return;
      setActioning(docId);
      try {
        await AdminService.rejectDocument(docId, reason.trim());
        setDocs(prev => prev.map(d => d.id === docId ? { ...d, status: 'rejected' as const, rejection_reason: reason.trim() } : d));
        showToast('Document rejected');
      } catch (e: unknown) {
        showToast(e instanceof Error ? e.message : 'Action failed');
      } finally { setActioning(null); }
      return;
    }
    setActioning(docId);
    try {
      await AdminService.approveDocument(docId);
      setDocs(prev => prev.map(d => d.id === docId ? { ...d, status: 'approved' as const } : d));
      showToast('Document approved');
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Action failed');
    } finally { setActioning(null); }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1C2128] border border-[#30363D] rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#30363D]">
          <div>
            <h3 className="text-base font-semibold text-[#F0F6FC]">{user.name} — Documents</h3>
            <p className="text-xs text-[#8B949E]">{user.phone} · {user.city}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#21262D] text-[#8B949E] hover:text-[#F0F6FC]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {toast && <div className="mb-3 px-3 py-2 rounded-lg text-xs font-medium text-[#0D1117] bg-[#22C55E]">{toast}</div>}

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : docs.length === 0 ? (
            <div className="flex flex-col items-center py-10 gap-2 text-center">
              <FileText className="w-10 h-10 text-[#30363D]" />
              <p className="text-sm text-[#8B949E]">No documents uploaded yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {docs.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: '#0D1117', border: '1px solid #30363D' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(245,166,35,0.1)' }}>
                    <FileText className="w-3.5 h-3.5 text-[#F5A623]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#F0F6FC] truncate">{doc.document_type}</p>
                    <p className="text-[10px] text-[#8B949E] truncate">
                      {doc.original_name ?? 'Document'}{doc.file_size ? ` · ${Math.round(doc.file_size / 1024)} KB` : ''}
                    </p>
                    <p className="text-[10px] text-[#374151]">{formatDate(doc.created_at)}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    doc.status === 'approved' ? 'bg-[#22C55E]/10 text-[#22C55E]' :
                    doc.status === 'rejected' ? 'bg-[#EF4444]/10 text-[#EF4444]' :
                    'bg-[#F5A623]/10 text-[#F5A623]'
                  }`}>
                    {doc.status}
                  </span>
                  <div className="flex gap-1 shrink-0">
                    {doc.file_url && (
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer"
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#2D6BE4]/10 border border-[#2D6BE4]/30"
                        title="View">
                        <Eye className="w-3 h-3 text-[#2D6BE4]" />
                      </a>
                    )}
                    {doc.status === 'pending' && (
                      <>
                        <button onClick={() => handleDoc(doc.id, 'approve')} disabled={actioning === doc.id}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/30"
                          title="Approve">
                          <ThumbsUp className="w-3 h-3 text-[#22C55E]" />
                        </button>
                        <button onClick={() => handleDoc(doc.id, 'reject')} disabled={actioning === doc.id}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30"
                          title="Reject">
                          <ThumbsDown className="w-3 h-3 text-[#EF4444]" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [toast, setToast] = useState('');
  const [docsUser, setDocsUser] = useState<ApiUser | null>(null);

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3000); }

  const fetchDrivers = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await AdminService.getUsers({
        role: 'driver',
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: search || undefined,
        page,
      });
      const r = res as unknown as { data?: ApiUser[]; pagination?: { total: number; total_pages: number } };
      setDrivers((r.data ?? []).filter(d => d.status !== 'pending'));
      setTotal(r.pagination?.total ?? 0);
      setTotalPages(r.pagination?.total_pages ?? 1);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load drivers');
    } finally { setLoading(false); }
  }, [statusFilter, search, page]);

  useEffect(() => { fetchDrivers(); }, [fetchDrivers]);

  async function handleAction(id: string, action: 'approve' | 'reject' | 'suspend') {
    try {
      if (action === 'approve') await AdminService.approveUser(id);
      else if (action === 'reject') await AdminService.rejectUser(id, 'Rejected by admin');
      else await AdminService.suspendUser(id);
      showToast(`Driver ${action}d`);
      fetchDrivers();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Action failed');
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1200px]">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl text-sm font-medium text-[#0D1117] bg-[#22C55E] shadow-lg">{toast}</div>
      )}
      {docsUser && <DocModal user={docsUser} onClose={() => setDocsUser(null)} />}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F0F6FC]">Drivers</h1>
          <p className="text-sm text-[#8B949E] mt-0.5">Manage driver accounts ({total} total)</p>
        </div>
        <button onClick={fetchDrivers} className="p-2 rounded-lg text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px] max-w-xs">
          <Input placeholder="Search name, phone…" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            leftIcon={<Search className="w-4 h-4" />} />
        </div>
        <div className="flex gap-1 flex-wrap">
          {STATUS_FILTERS.map((s) => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                statusFilter === s ? 'bg-[#F5A623] text-[#0D1117]' : 'bg-[#21262D] text-[#8B949E] hover:text-[#F0F6FC]'
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-20">
          <AlertCircle className="w-8 h-8 text-[#EF4444]" />
          <p className="text-sm text-[#EF4444]">{error}</p>
          <button onClick={fetchDrivers} className="text-xs text-[#F5A623] underline">Retry</button>
        </div>
      ) : drivers.length === 0 ? (
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-16 text-center">
          <Car className="w-10 h-10 text-[#8B949E] mx-auto mb-3" />
          <p className="text-[#8B949E] text-sm">No drivers found</p>
        </div>
      ) : (
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#30363D]">
                  {["Name", "Phone", "City", "Vehicle", "Status", "Premium", "Registered", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-[#8B949E] font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {drivers.map((d) => (
                  <tr key={d.id} className="border-b border-[#30363D]/50 hover:bg-[#1C2128]/50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <UserAvatar name={d.name} src={d.profile_image} />
                        <span className="text-xs font-medium text-[#F0F6FC]">{d.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#8B949E]">{d.phone}</td>
                    <td className="px-4 py-3 text-xs text-[#8B949E]">{d.city}</td>
                    <td className="px-4 py-3 text-xs text-[#8B949E]">{d.vehicle_type || '—'}</td>
                    <td className="px-4 py-3">
                      <Badge variant={d.status as 'pending' | 'approved' | 'rejected' | 'suspended'} dot>{d.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {d.is_premium
                        ? <span className="text-xs text-[#F5A623] font-semibold">★ Premium</span>
                        : <span className="text-xs text-[#8B949E]">Free</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#8B949E] whitespace-nowrap">{formatDate(d.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="secondary" size="xs" onClick={() => setDocsUser(d)} title="View Documents">
                          <FileText className="w-3 h-3" />
                        </Button>
                        {d.status === 'pending' && (
                          <>
                            <Button variant="success" size="xs" onClick={() => handleAction(d.id, 'approve')}><CheckCircle className="w-3 h-3" /> Approve</Button>
                            <Button variant="danger" size="xs" onClick={() => handleAction(d.id, 'reject')}><XCircle className="w-3 h-3" /> Reject</Button>
                          </>
                        )}
                        {d.status === 'approved' && (
                          <Button variant="secondary" size="xs" onClick={() => handleAction(d.id, 'suspend')}><Ban className="w-3 h-3" /> Suspend</Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#30363D]">
              <span className="text-xs text-[#8B949E]">Page {page} of {totalPages}</span>
              <div className="flex gap-1">
                <Button variant="secondary" size="xs" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
                <Button variant="secondary" size="xs" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
