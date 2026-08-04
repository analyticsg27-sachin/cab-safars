"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CheckCircle, XCircle, Clock, Phone, Mail, MapPin, Car, Users,
  AlertCircle, RefreshCw, Printer, FileText, Eye, ChevronDown, ChevronUp,
  Download, ThumbsUp, ThumbsDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AdminService from "@/lib/services/admin.service";
import type { UserDocument } from "@/lib/services/admin.service";
import { formatDate } from "@/lib/utils";

interface PendingUser {
  id: string;
  role: "vendor" | "driver";
  name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  status: string;
  company_name?: string;
  vehicle_type?: string;
  created_at: string;
}

function DocStatusBadge({ status }: { status: string }) {
  const cfg = {
    approved: { bg: 'rgba(34,197,94,0.12)', color: '#22C55E', label: 'Approved' },
    rejected: { bg: 'rgba(239,68,68,0.12)', color: '#EF4444', label: 'Rejected' },
    pending:  { bg: 'rgba(245,166,35,0.12)', color: '#F5A623', label: 'Pending' },
  }[status] ?? { bg: 'rgba(139,148,158,0.12)', color: '#8B949E', label: status };
  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  );
}

function DocumentsPanel({ userId, userName }: { userId: string; userName: string }) {
  const [docs, setDocs] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actioning, setActioning] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3000); }

  useEffect(() => {
    setLoading(true);
    AdminService.getUserDocuments(userId)
      .then(setDocs)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Failed to load documents'))
      .finally(() => setLoading(false));
  }, [userId]);

  async function handleDoc(docId: string, action: 'approve' | 'reject') {
    setActioning(docId);
    try {
      if (action === 'approve') await AdminService.approveDocument(docId);
      else await AdminService.rejectDocument(docId);
      setDocs(prev => prev.map(d => d.id === docId ? { ...d, status: action === 'approve' ? 'approved' : 'rejected' } : d));
      showToast(`Document ${action}d`);
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Action failed');
    } finally { setActioning(null); }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-6">
      <div className="w-5 h-5 border-2 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <p className="text-xs text-[#EF4444] py-4 text-center">{error}</p>
  );

  if (docs.length === 0) return (
    <div className="flex flex-col items-center py-6 gap-2 text-center">
      <FileText className="w-8 h-8 text-[#30363D]" />
      <p className="text-sm text-[#8B949E]">No documents uploaded yet</p>
      <p className="text-xs text-[#374151]">{userName} hasn't submitted any documents.</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-2">
      {toast && (
        <div className="px-3 py-2 rounded-lg text-xs font-medium text-[#0D1117] bg-[#22C55E]">{toast}</div>
      )}
      {docs.map((doc) => (
        <div key={doc.id} className="flex items-center gap-3 p-3 rounded-xl"
          style={{ background: '#0D1117', border: '1px solid #30363D' }}>
          {/* Icon */}
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'rgba(245,166,35,0.1)' }}>
            <FileText className="w-4 h-4 text-[#F5A623]" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#F0F6FC] truncate">{doc.document_type}</p>
            <p className="text-[10px] text-[#8B949E] truncate">
              {doc.original_name ?? 'Document'} · {doc.file_size ? `${Math.round(doc.file_size / 1024)} KB` : ''}
            </p>
            <p className="text-[10px] text-[#374151]">{formatDate(doc.created_at)}</p>
          </div>

          {/* Status */}
          <DocStatusBadge status={doc.status} />

          {/* Actions */}
          <div className="flex gap-1 shrink-0">
            {/* View/Download if URL available */}
            {doc.file_url && (
              <a href={doc.file_url} target="_blank" rel="noopener noreferrer"
                className="w-7 h-7 flex items-center justify-center rounded-lg"
                style={{ background: 'rgba(45,107,228,0.12)', border: '1px solid rgba(45,107,228,0.3)' }}
                title="View document">
                <Eye className="w-3.5 h-3.5 text-[#2D6BE4]" />
              </a>
            )}
            {doc.status === 'pending' && (
              <>
                <button
                  onClick={() => handleDoc(doc.id, 'approve')}
                  disabled={actioning === doc.id}
                  className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
                  style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)' }}
                  title="Approve document">
                  <ThumbsUp className="w-3.5 h-3.5 text-[#22C55E]" />
                </button>
                <button
                  onClick={() => handleDoc(doc.id, 'reject')}
                  disabled={actioning === doc.id}
                  className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
                  style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)' }}
                  title="Reject document">
                  <ThumbsDown className="w-3.5 h-3.5 text-[#EF4444]" />
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState<{ id: string; name: string; action: "approve" | "reject" } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [expandedDocs, setExpandedDocs] = useState<Set<string>>(new Set());

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  const fetchApprovals = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await AdminService.getUsers({ status: 'pending' });
      setApprovals((res.data as unknown as PendingUser[]) ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load approvals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchApprovals(); }, [fetchApprovals]);

  function toggleDocs(userId: string) {
    setExpandedDocs(prev => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  }

  function printUser(user: PendingUser) {
    const vehicleOrCompany = user.vehicle_type
      ? `Vehicle Type: ${user.vehicle_type}`
      : user.company_name
      ? `Company: ${user.company_name}`
      : '—';
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Registration - ${user.name}</title><style>
      body { font-family: Arial, sans-serif; background: #fff; color: #111; margin: 40px; }
      h1 { font-size: 22px; margin-bottom: 4px; }
      .subtitle { color: #666; font-size: 13px; margin-bottom: 28px; }
      table { border-collapse: collapse; width: 100%; max-width: 480px; }
      td { padding: 8px 12px; font-size: 14px; border-bottom: 1px solid #e5e7eb; }
      td:first-child { font-weight: 600; width: 160px; color: #444; }
      .status { display: inline-block; background: #fef3c7; color: #92400e; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; }
      @media print { body { margin: 20px; } }
    </style></head><body>
      <h1>${user.name}</h1>
      <div class="subtitle">Registration Details</div>
      <table>
        <tr><td>Role</td><td>${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td></tr>
        <tr><td>Phone</td><td>${user.phone}</td></tr>
        <tr><td>Email</td><td>${user.email || '—'}</td></tr>
        <tr><td>City</td><td>${user.city}${user.state ? `, ${user.state}` : ''}</td></tr>
        <tr><td>${user.vehicle_type ? 'Vehicle Type' : 'Company'}</td><td>${vehicleOrCompany.split(': ').slice(1).join(': ') || '—'}</td></tr>
        <tr><td>Registration Date</td><td>${new Date(user.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td></tr>
        <tr><td>Status</td><td><span class="status">Pending</span></td></tr>
      </table>
    </body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

  async function handleAction(id: string, action: "approve" | "reject") {
    setActionLoading(true);
    try {
      if (action === 'approve') {
        await AdminService.approveUser(id);
        showToast(`User approved successfully`);
      } else {
        await AdminService.rejectUser(id);
        showToast(`User rejected`);
      }
      setApprovals((prev) => prev.filter((a) => a.id !== id));
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setActionLoading(false);
      setConfirming(null);
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1000px]">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl text-sm font-medium text-[#0D1117] bg-[#22C55E] shadow-lg">
          {toast}
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F0F6FC]">Pending Approvals</h1>
          <p className="text-sm text-[#8B949E] mt-0.5">
            Review documents and approve new vendor and driver registrations
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!loading && (
            <span className="text-sm font-semibold bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 rounded-full px-3 py-1">
              {approvals.length} pending
            </span>
          )}
          <button
            onClick={fetchApprovals}
            className="p-2 rounded-lg text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D] transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Confirm modal */}
      {confirming && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1C2128] border border-[#30363D] rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-base font-semibold text-[#F0F6FC] mb-2">
              Confirm {confirming.action === "approve" ? "Approval" : "Rejection"}
            </h3>
            <p className="text-sm text-[#8B949E] mb-6">
              Are you sure you want to {confirming.action}{' '}
              <strong className="text-[#F0F6FC]">{confirming.name}</strong>?
            </p>
            <div className="flex gap-2">
              <Button
                variant={confirming.action === "approve" ? "success" : "danger"}
                size="sm"
                className="flex-1"
                onClick={() => handleAction(confirming.id, confirming.action)}
                disabled={actionLoading}
              >
                {actionLoading ? 'Processing…' : confirming.action === "approve" ? "Yes, Approve" : "Yes, Reject"}
              </Button>
              <Button variant="secondary" size="sm" className="flex-1" onClick={() => setConfirming(null)}
                disabled={actionLoading}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[#8B949E]">Loading approvals…</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="flex flex-col items-center gap-3">
            <AlertCircle className="w-8 h-8 text-[#EF4444]" />
            <p className="text-sm text-[#EF4444]">{error}</p>
            <button onClick={fetchApprovals} className="text-xs text-[#F5A623] underline">Retry</button>
          </div>
        </div>
      ) : approvals.length === 0 ? (
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#22C55E]/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-[#22C55E]" />
          </div>
          <h3 className="text-base font-semibold text-[#F0F6FC] mb-1">All caught up!</h3>
          <p className="text-sm text-[#8B949E]">No pending approvals at this time.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {approvals.map((user) => (
            <div key={user.id} className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
              {/* User info row */}
              <div className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-[#21262D] flex items-center justify-center text-[#8B949E] font-bold text-lg shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-[#F0F6FC]">{user.name}</h3>
                        <Badge variant={user.role === "driver" ? "driver" : "vendor"}>
                          {user.role === "driver" ? (
                            <><Car className="w-3 h-3" /> Driver</>
                          ) : (
                            <><Users className="w-3 h-3" /> Trip Provider</>
                          )}
                        </Badge>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-1.5 mt-2">
                        {user.email && (
                          <span className="flex items-center gap-1.5 text-xs text-[#8B949E]">
                            <Mail className="w-3.5 h-3.5 shrink-0" /> {user.email}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5 text-xs text-[#8B949E]">
                          <Phone className="w-3.5 h-3.5 shrink-0" /> {user.phone}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-[#8B949E]">
                          <MapPin className="w-3.5 h-3.5 shrink-0" /> {user.city}{user.state ? `, ${user.state}` : ''}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-[#8B949E]">
                          <Clock className="w-3.5 h-3.5 shrink-0" /> {formatDate(user.created_at)}
                        </span>
                      </div>
                      {(user.vehicle_type || user.company_name) && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {user.vehicle_type && (
                            <span className="text-xs bg-[#21262D] border border-[#30363D] rounded-lg px-2.5 py-1 text-[#8B949E]">
                              Vehicle: {user.vehicle_type}
                            </span>
                          )}
                          {user.company_name && (
                            <span className="text-xs bg-[#21262D] border border-[#30363D] rounded-lg px-2.5 py-1 text-[#8B949E]">
                              Company: {user.company_name}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 sm:flex-col shrink-0">
                    <Button
                      variant="success" size="sm" className="flex-1 sm:flex-none"
                      onClick={() => setConfirming({ id: user.id, name: user.name, action: "approve" })}
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </Button>
                    <Button
                      variant="danger" size="sm" className="flex-1 sm:flex-none"
                      onClick={() => setConfirming({ id: user.id, name: user.name, action: "reject" })}
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </Button>
                    <Button
                      variant="secondary" size="sm" className="flex-1 sm:flex-none"
                      onClick={() => printUser(user)}
                    >
                      <Printer className="w-4 h-4" /> Print
                    </Button>
                  </div>
                </div>
              </div>

              {/* Documents section — collapsible */}
              <div style={{ borderTop: '1px solid #30363D' }}>
                <button
                  onClick={() => toggleDocs(user.id)}
                  className="w-full flex items-center justify-between px-5 py-3 text-xs font-semibold text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#1C2128] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" />
                    Documents
                  </span>
                  {expandedDocs.has(user.id)
                    ? <ChevronUp className="w-3.5 h-3.5" />
                    : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {expandedDocs.has(user.id) && (
                  <div className="px-5 pb-5">
                    <DocumentsPanel userId={user.id} userName={user.name} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
