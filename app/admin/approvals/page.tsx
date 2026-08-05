"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CheckCircle, XCircle, Clock, Phone, Mail, MapPin, Car, Users,
  AlertCircle, RefreshCw, Printer, FolderOpen, Shield,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AdminService from "@/lib/services/admin.service";
import type { PendingRegistration } from "@/lib/services/admin.service";
import { formatDate } from "@/lib/utils";

// ── Reject modal ─────────────────────────────────────────────────────────────

interface RejectModalProps {
  user: PendingRegistration;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  loading: boolean;
}

function RejectModal({ user, onConfirm, onCancel, loading }: RejectModalProps) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1C2128] border border-[#30363D] rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#EF4444]/10 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-[#EF4444]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#F0F6FC]">Reject Registration</h3>
            <p className="text-xs text-[#8B949E]">{user.name}</p>
          </div>
        </div>
        <p className="text-xs text-[#8B949E] mb-3">
          This reason will be saved and sent to the user so they understand why their registration was declined.
        </p>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="e.g. Incomplete information provided. Please re-register with valid vehicle details."
          rows={4}
          className="w-full rounded-xl px-3 py-2.5 text-sm text-[#F0F6FC] placeholder-[#374151] resize-none outline-none"
          style={{ background: "#0D1117", border: "1px solid #30363D" }}
        />
        <div className="flex gap-2 mt-4">
          <Button variant="danger" size="sm" className="flex-1"
            onClick={() => reason.trim() && onConfirm(reason.trim())}
            disabled={loading || !reason.trim()}>
            {loading ? "Rejecting…" : "Reject & Notify User"}
          </Button>
          <Button variant="secondary" size="sm" className="flex-1" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Direct approve modal ──────────────────────────────────────────────────────

interface DirectApproveModalProps {
  user: PendingRegistration;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  loading: boolean;
}

function DirectApproveModal({ user, onConfirm, onCancel, loading }: DirectApproveModalProps) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1C2128] border border-[#30363D] rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#2D6BE4]/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#2D6BE4]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#F0F6FC]">Direct Approval</h3>
            <p className="text-xs text-[#8B949E]">{user.name} — skip document requirement</p>
          </div>
        </div>
        <div className="px-3 py-2.5 rounded-xl mb-4"
          style={{ background: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.2)" }}>
          <p className="text-xs text-[#F5A623]">
            This grants full app access without requiring document upload.
            Use only for trusted users (already known, relative, verified offline, etc.)
          </p>
        </div>
        <p className="text-xs text-[#8B949E] mb-3">
          Write a note for admin records explaining why documents were waived.
        </p>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="e.g. Already verified in person. Personal contact of the team."
          rows={3}
          className="w-full rounded-xl px-3 py-2.5 text-sm text-[#F0F6FC] placeholder-[#374151] resize-none outline-none"
          style={{ background: "#0D1117", border: "1px solid #30363D" }}
        />
        <div className="flex gap-2 mt-4">
          <Button variant="primary" size="sm" className="flex-1"
            onClick={() => reason.trim() && onConfirm(reason.trim())}
            disabled={loading || !reason.trim()}>
            {loading ? "Approving…" : "Direct Approve"}
          </Button>
          <Button variant="secondary" size="sm" className="flex-1" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<PendingRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState("");

  const [rejectTarget, setRejectTarget] = useState<PendingRegistration | null>(null);
  const [approveTarget, setApproveTarget] = useState<PendingRegistration | null>(null);
  const [directApproveTarget, setDirectApproveTarget] = useState<PendingRegistration | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  const fetchApprovals = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await AdminService.getUsers({ status: "pending" });
      setApprovals((res.data as unknown as PendingRegistration[]) ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load approvals");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchApprovals(); }, [fetchApprovals]);

  function printUser(user: PendingRegistration) {
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Registration - ${user.name}</title>
    <style>body{font-family:Arial,sans-serif;background:#fff;color:#111;margin:40px}
    h1{font-size:22px;margin-bottom:4px}.sub{color:#666;font-size:13px;margin-bottom:28px}
    table{border-collapse:collapse;width:100%;max-width:480px}
    td{padding:8px 12px;font-size:14px;border-bottom:1px solid #e5e7eb}
    td:first-child{font-weight:600;width:160px;color:#444}
    </style></head><body>
    <h1>${user.name}</h1><div class="sub">Registration Details — CAB SAFARS</div>
    <table>
      <tr><td>Role</td><td>${user.role === "vendor" ? "Trip Provider" : "Driver"}</td></tr>
      <tr><td>Phone</td><td>${user.phone}</td></tr>
      <tr><td>Email</td><td>${user.email || "—"}</td></tr>
      <tr><td>City / State</td><td>${user.city}${user.state ? `, ${user.state}` : ""}</td></tr>
      ${user.vehicle_type ? `<tr><td>Vehicle Type</td><td>${user.vehicle_type}</td></tr>` : ""}
      ${user.vehicle_number ? `<tr><td>Vehicle Number</td><td>${user.vehicle_number}</td></tr>` : ""}
      ${user.company_name ? `<tr><td>Company</td><td>${user.company_name}</td></tr>` : ""}
      <tr><td>Registered</td><td>${new Date(user.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td></tr>
    </table></body></html>`;
    window.open(URL.createObjectURL(new Blob([html], { type: "text/html" })), "_blank");
  }

  async function handleApprove(user: PendingRegistration) {
    setActionLoading(true);
    try {
      await AdminService.approveUser(user.id);
      setApprovals(prev => prev.filter(a => a.id !== user.id));
      showToast(`${user.name} approved — they will be notified to upload documents`);
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Action failed");
    } finally {
      setActionLoading(false);
      setApproveTarget(null);
    }
  }

  async function handleReject(user: PendingRegistration, reason: string) {
    setActionLoading(true);
    try {
      await AdminService.rejectUser(user.id, reason);
      setApprovals(prev => prev.filter(a => a.id !== user.id));
      showToast(`${user.name} rejected — reason saved and user notified`);
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Action failed");
    } finally {
      setActionLoading(false);
      setRejectTarget(null);
    }
  }

  async function handleDirectApprove(user: PendingRegistration, reason: string) {
    setActionLoading(true);
    try {
      await AdminService.directApproveUser(user.id, reason);
      setApprovals(prev => prev.filter(a => a.id !== user.id));
      showToast(`${user.name} directly approved — full access granted`);
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Action failed");
    } finally {
      setActionLoading(false);
      setDirectApproveTarget(null);
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1000px]">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl text-sm font-medium text-[#0D1117] bg-[#22C55E] shadow-lg">
          {toast}
        </div>
      )}

      {/* Modals */}
      {rejectTarget && (
        <RejectModal
          user={rejectTarget}
          onConfirm={r => handleReject(rejectTarget, r)}
          onCancel={() => setRejectTarget(null)}
          loading={actionLoading}
        />
      )}
      {approveTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1C2128] border border-[#30363D] rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#22C55E]/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-[#22C55E]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#F0F6FC]">Approve Registration</h3>
                <p className="text-xs text-[#8B949E]">{approveTarget.name}</p>
              </div>
            </div>
            <p className="text-sm text-[#8B949E] mb-6">
              The user will be notified and asked to upload their verification documents.
            </p>
            <div className="flex gap-2">
              <Button variant="success" size="sm" className="flex-1"
                onClick={() => handleApprove(approveTarget)} disabled={actionLoading}>
                {actionLoading ? "Approving…" : "Yes, Approve"}
              </Button>
              <Button variant="secondary" size="sm" className="flex-1"
                onClick={() => setApproveTarget(null)} disabled={actionLoading}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {directApproveTarget && (
        <DirectApproveModal
          user={directApproveTarget}
          onConfirm={r => handleDirectApprove(directApproveTarget, r)}
          onCancel={() => setDirectApproveTarget(null)}
          loading={actionLoading}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F0F6FC]">Pending Approvals</h1>
          <p className="text-sm text-[#8B949E] mt-0.5">
            Review new registrations and approve or reject them
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!loading && (
            <span className="text-sm font-semibold bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 rounded-full px-3 py-1">
              {approvals.length} pending
            </span>
          )}
          <button onClick={fetchApprovals}
            className="p-2 rounded-lg text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D] transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

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
          <p className="text-sm text-[#8B949E]">No pending registrations at this time.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {approvals.map(user => (
            <div key={user.id} className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
              <div className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Avatar + full registration details */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-[#21262D] flex items-center justify-center text-[#8B949E] font-bold text-lg shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-[#F0F6FC]">{user.name}</h3>
                        <Badge variant={user.role === "driver" ? "driver" : "vendor"}>
                          {user.role === "driver"
                            ? <><Car className="w-3 h-3" /> Driver</>
                            : <><Users className="w-3 h-3" /> Trip Provider</>}
                        </Badge>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-1.5 mt-2">
                        <span className="flex items-center gap-1.5 text-xs text-[#8B949E]">
                          <Phone className="w-3.5 h-3.5 shrink-0" /> {user.phone}
                        </span>
                        {user.email && (
                          <span className="flex items-center gap-1.5 text-xs text-[#8B949E]">
                            <Mail className="w-3.5 h-3.5 shrink-0" /> {user.email}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5 text-xs text-[#8B949E]">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          {user.city}{user.state ? `, ${user.state}` : ""}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-[#8B949E]">
                          <Clock className="w-3.5 h-3.5 shrink-0" /> {formatDate(user.created_at)}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {user.vehicle_type && (
                          <span className="text-xs bg-[#21262D] border border-[#30363D] rounded-lg px-2.5 py-1 text-[#8B949E]">
                            Vehicle: {user.vehicle_type}
                          </span>
                        )}
                        {user.vehicle_number && (
                          <span className="text-xs bg-[#21262D] border border-[#30363D] rounded-lg px-2.5 py-1 text-[#8B949E]">
                            Plate: {user.vehicle_number}
                          </span>
                        )}
                        {user.company_name && (
                          <span className="text-xs bg-[#21262D] border border-[#30363D] rounded-lg px-2.5 py-1 text-[#8B949E]">
                            Company: {user.company_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 sm:flex-col shrink-0">
                    <Button variant="success" size="sm" className="flex-1 sm:flex-none"
                      onClick={() => setApproveTarget(user)}>
                      <CheckCircle className="w-4 h-4" /> Approve
                    </Button>
                    <Button variant="danger" size="sm" className="flex-1 sm:flex-none"
                      onClick={() => setRejectTarget(user)}>
                      <XCircle className="w-4 h-4" /> Reject
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-1 sm:flex-none"
                      onClick={() => printUser(user)}>
                      <Printer className="w-4 h-4" /> Print
                    </Button>
                    <button
                      onClick={() => setDirectApproveTarget(user)}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                      style={{
                        background: "rgba(45,107,228,0.08)",
                        border: "1px solid rgba(45,107,228,0.25)",
                        color: "#2D6BE4",
                      }}>
                      <Shield className="w-3.5 h-3.5" /> Direct Approve
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-3 flex items-center justify-between"
                style={{ borderTop: "1px solid #30363D", background: "rgba(13,17,23,0.4)" }}>
                <p className="text-xs text-[#374151]">
                  Documents reviewed separately after approval
                </p>
                <Link href="/admin/documents"
                  className="flex items-center gap-1.5 text-xs font-semibold"
                  style={{ color: "#F5A623" }}>
                  <FolderOpen className="w-3.5 h-3.5" />
                  Go to Documents →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
