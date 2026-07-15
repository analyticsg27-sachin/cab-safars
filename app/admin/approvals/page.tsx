"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckCircle, XCircle, Clock, Phone, Mail, MapPin, Car, Users, AlertCircle, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AdminService from "@/lib/services/admin.service";
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

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState<{ id: string; name: string; action: "approve" | "reject" } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState('');

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  const fetchApprovals = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await AdminService.getUsers({ status: 'pending' });
      const r = res as { data?: PendingUser[] };
      setApprovals(r.data ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load approvals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchApprovals(); }, [fetchApprovals]);

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
            Review and approve new vendor and driver registrations
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

      {confirming && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1C2128] border border-[#30363D] rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-base font-semibold text-[#F0F6FC] mb-2">
              Confirm {confirming.action === "approve" ? "Approval" : "Rejection"}
            </h3>
            <p className="text-sm text-[#8B949E] mb-6">
              Are you sure you want to {confirming.action} <strong className="text-[#F0F6FC]">{confirming.name}</strong>?
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
            <div key={user.id} className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
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
                    {user.vehicle_type && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="text-xs bg-[#21262D] border border-[#30363D] rounded-lg px-2.5 py-1 text-[#8B949E]">
                          Vehicle: {user.vehicle_type}
                        </span>
                      </div>
                    )}
                    {user.company_name && (
                      <div className="mt-3">
                        <span className="text-xs bg-[#21262D] border border-[#30363D] rounded-lg px-2.5 py-1 text-[#8B949E]">
                          Company: {user.company_name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
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
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
